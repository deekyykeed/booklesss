#!/usr/bin/env python3
"""
Scrape unza.zm's undergraduate programmes into the Booklesss course pipeline.

    python3 tools/scrape_unza_programmes.py [--out DIR] [--refresh]

Writes to DIR (default _dev/tmp/unza-scrape/), the same three files the ZCAS
scraper writes so the loader can take either:
    programmes.json  school, department, level, source URL
    modules.json     one row per course-in-a-programme
    subjects.json    distinct courses, deduped, ranked by reach
    pages/*.html     cached programme pages (re-used unless --refresh)

HOW UNZA DIFFERS FROM ZCAS, WHICH IS THE WHOLE REASON THIS IS A SECOND SCRIPT:
  - Most programmes publish NOTHING. The Courses tab exists on all 111 pages
    and is empty on most of them — "Coming soon...", or the word "Courses" and
    nothing under it. This is a gap on UNZA's site, not a parsing failure; the
    count of programmes with a curriculum is printed at the end so it cannot be
    mistaken for coverage.
  - Codes are optional and inline. ZCAS gives code and title in separate table
    cells; UNZA either omits the code entirely or writes it into the title
    ("EM211 Engineering Mathematics I"). split_code() takes it back out — a
    code in a title fails the gen-programmes build, and rightly.
  - Mostly no semesters. Courses are grouped by YEAR ("First Year", "YEAR 1"),
    so `semester` is usually None; only the few pages using "Term 1" headings
    say which half of the year a course sits in.
  - No tables. The courses live in the "Courses" tab of a Drupal page as
    <p><strong>Heading</strong></p><ul><li>Course</li></ul> — a heading and the
    list under it. Parsing tables here would find nothing.
  - Headings are not always years. Engineering runs "First Year / General
    Engineering / Third Year", where the middle one IS second year. Unrecognised
    headings are interpolated when they sit in a one-year gap between two known
    years, and left as None when they don't — see year_from().
  - Electives are a real group with no year. Kept, with year None, because a
    student does sit them; they just don't belong to one year.
"""

import argparse, collections, concurrent.futures as cf, html, json, os, re, sys, time, urllib.request

INDEX = 'https://www.unza.zm/academics/undergraduate/programmes'
ORIGIN = 'https://www.unza.zm'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Same normalisation as the ZCAS scraper: the two universities' titles have to
# collapse onto the same subject, or "Introduction to Economics" is built twice.
FIX = {'modelling': 'modeling', 'organisation': 'organization',
       'organisational': 'organizational', 'organisations': 'organizations',
       'behavioural': 'behavioral', 'programme': 'program', 'centre': 'center',
       'analyse': 'analyze', 'specialisation': 'specialization',
       'inteligence': 'intelligence', 'entreprenuership': 'entrepreneurship',
       'attachement': 'attachment', 'enterprenuership': 'entrepreneurship',
       'managment': 'management', 'accouting': 'accounting', 'ict': 'it',
       'maths': 'mathematics', 'info': 'information', 'mathematic': 'mathematics'}

PROJECT_KINDS = {'dissertation', 'computing project', 'project finalists only',
                 'thesis and viva voce', 'industrial attachment', 'project',
                 'research proposal', 'initial progress report', 'research project',
                 'final progress report', 'work placement', 'internship',
                 'industrial training', 'teaching practice', 'clinical practice',
                 'field attachment', 'student teaching practice'}

LEVEL_RANK = {'diploma': 0, 'bachelors': 1, 'masters': 2, 'doctorate': 3}

ORDINALS = {'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'fifth': 5,
            'sixth': 6, 'seventh': 7, 'final': None}

# Headings that group courses but name no year.
ELECTIVE = re.compile(r'(?i)\b(elective|option(al)?|specializ|specialis)')

# Small words that stay lowercase when a URL slug is turned back into a name.
SMALL = {'of', 'and', 'the', 'in', 'for', 'with', 'to'}

# A tab holding the single word "Courses" is a page whose curriculum was never
# filled in, not a programme that teaches a course called Courses. Without this
# every unfinished page contributes one course, and the count reads as coverage.
NOT_A_COURSE = {'courses', 'course', 'modules', 'module', 'curriculum', 'subjects',
                'coming soon', 'core courses', 'course structure', 'programme structure',
                'compulsory courses', 'required courses', 'electives', 'elective',
                'elective courses', 'optional courses', 'and', 'others', 'tbc', 'n a'}


def get(url, tries=4):
    for a in range(tries):
        try:
            return urllib.request.urlopen(
                urllib.request.Request(url, headers=UA), timeout=90
            ).read().decode('utf-8', 'replace')
        except Exception:
            if a == tries - 1:
                return None
            time.sleep(2 * (a + 1))


def norm(t):
    t = t.lower().strip().replace('&', 'and').replace('’', "'")
    t = re.sub(r'\bintro\b', 'introduction', t)
    t = re.sub(r'[^a-z0-9 ]', ' ', t)
    t = ' '.join(FIX.get(w, w) for w in t.split())
    t = re.sub(r'\b(i|ii|iii|iv)\b$', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def slugify(t):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', t.lower())).strip('-')


def unslug(s):
    """`school-of-natural-sciences` -> `School of Natural Sciences`."""
    return ' '.join(w if w in SMALL else w.capitalize() for w in s.split('-')).strip()


def strip_tags(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).replace('\xa0', ' ').strip()


def level_of(name):
    low = name.lower()
    if low.startswith('phd') or 'doctor of philosophy' in low:
        return 'doctorate'
    if low.startswith('master') or low.startswith('mba'):
        return 'masters'
    if 'diploma' in low or 'certificate' in low:
        return 'diploma'
    return 'bachelors'


def parse_index(body):
    """Every /undergraduate/<school>/<department>/<programme> link, deduped.

    The school comes off the URL rather than the heading above the link: the
    headings on this page are short labels ("Mines", "Education") while the URL
    carries the school's actual name, and the URL is what the programme page
    itself agrees with."""
    rows, seen = [], set()
    for m in re.finditer(r'<a[^>]*href="(/undergraduate/([^/"]+)/([^/"]+)/([^/"?#]+))"[^>]*>(.*?)</a>',
                         body, re.S):
        path, school, dept, slug, label = m.groups()
        if path in seen:
            continue
        seen.add(path)
        name = strip_tags(label)
        if not name or len(name) < 5:
            continue
        rows.append({
            'slug': slug, 'name': name, 'url': ORIGIN + path,
            'school': unslug(school), 'department': unslug(dept),
            'level': level_of(name), 'awarding_body': 'University of Zambia',
        })
    return rows


def courses_tab(body):
    """The body of the 'Courses' tab, or None.

    The page is Drupal: the tab button carries aria-controls="<id>", and the
    pane with that id holds the content. Finding the pane by id rather than by
    position matters — Requirements and Finance are the same shape and sit in
    the same wrapper."""
    m = re.search(r'aria-label="Courses"[^>]*?aria-controls="([^"]+)"', body, re.S)
    if not m:
        return None
    pane = re.search(r'<div id="%s"[^>]*>' % re.escape(m.group(1)), body)
    if not pane:
        return None
    start = pane.end()
    nxt = re.search(r'<div id="[^"]*-pane"', body[start:])
    return body[start:start + nxt.start()] if nxt else body[start:start + 40000]


def parse_courses(row, body):
    """<p><strong>Heading</strong></p><ul><li>Course</li>…</ul>, group by group.

    A <strong> only counts as a heading if a <ul> follows it before the next
    one — the pages carry `<strong>Note: </strong>` paragraphs between the year
    groups, and treating those as headings puts the next year's courses under
    'Note'."""
    tab = courses_tab(body)
    if not tab:
        return []
    groups, heads = [], list(re.finditer(r'<strong>(.*?)</strong>', tab, re.S))
    for i, h in enumerate(heads):
        end = heads[i + 1].start() if i + 1 < len(heads) else len(tab)
        chunk = tab[h.end():end]
        items = [strip_tags(x) for x in re.findall(r'<li[^>]*>(.*?)</li>', chunk, re.S)]
        items = [re.sub(r'\s*\|+\s*$', '', x).strip(' .;:') for x in items]
        items = [x for x in items if 3 <= len(x) <= 120]
        if items:
            groups.append({'heading': strip_tags(h.group(1)).strip(' :'), 'items': items})
    if not groups:
        # A few pages put the whole list in one <ul> with no heading at all.
        items = [strip_tags(x) for x in re.findall(r'<li[^>]*>(.*?)</li>', tab, re.S)]
        items = [x for x in items if 3 <= len(x) <= 120]
        if items:
            groups = [{'heading': '', 'items': items}]
    if not groups:
        groups = parse_lines(tab)

    years = [year_from(g['heading']) for g in groups]
    # An unnamed group between two known years is the year in between — this is
    # what rescues Engineering's "General Engineering" as year 2. Only a gap of
    # exactly one is filled; anything wider is a guess and stays None.
    for i, y in enumerate(years):
        if y is not None or ELECTIVE.search(groups[i]['heading']):
            continue
        prev = next((years[j] for j in range(i - 1, -1, -1) if years[j] is not None), None)
        nxt = next((years[j] for j in range(i + 1, len(years)) if years[j] is not None), None)
        if prev is not None and nxt is not None and nxt - prev == 2:
            years[i] = prev + 1
        elif prev is not None and nxt is None and len(groups) > 1:
            years[i] = prev + 1

    out, seen = [], set()
    for g, y in zip(groups, years):
        # "Term 1" / "Semester 2" headings appear on a handful of pages and are
        # the only place UNZA says which half of the year a course sits in.
        sm = re.search(r'(?i)\b(?:term|semester)\s*([12])\b', g['heading'])
        sem = int(sm.group(1)) if sm else None
        for title in (t for raw in g['items'] for t in explode(raw)):
            title = re.sub(r'\s*\((compulsory|core|optional)\)\s*$', '', title, flags=re.I).strip()
            code, title = split_code(title)
            # Last line of defence. A code left in a title fails the
            # gen-programmes build, so anything still carrying one after
            # split_code is a shape this parser does not understand, and is
            # dropped rather than shipped.
            if re.search(r'[A-Z]{2,4}[ -]?\d{3,4}|\b\d{3,4}\b', title):
                continue
            # A code carries the year in its first digit, which is the only year
            # signal on the pages that group by term or by nothing at all.
            year = y
            if year is None and code:
                d = int(re.search(r'\d', code).group(0))
                year = d if 1 <= d <= 7 else None
            k = (norm(title), year)
            if not title or k in seen or norm(title) in NOT_A_COURSE or year_from(title):
                continue
            seen.add(k)
            out.append({
                'programme_slug': row['slug'], 'programme': row['name'],
                'school': row['school'], 'level': row['level'],
                'code': code, 'title': title, 'year': year, 'semester': sem,
                'group': g['heading'],
            })
    return out


# A line that is prose, not a course. The lead-in sentence is the common one
# ("This degree is a five (5) year programme and courses taught include:"), but
# the tab is also where an empty page says "Coming soon...".
PROSE = re.compile(r'(?i)(:\s*$|\bincludes?\b|\bprogramme is\b|\bstudents?\b|\bcoming soon\b|'
                   r'\byears?\s*of\b|\bwill\b|\bmust\b|\bthe following\b)')


def parse_lines(tab):
    """The other published shape: one flat list separated by <br>, no years.

    Two programmes in Agricultural Sciences print their whole curriculum this
    way. Worth handling rather than losing — but note the list carries no year
    at all, so every course off it lands with year None."""
    m = re.search(r'field--name-pb-content-body[^>]*>(.*?)</div>', tab, re.S) or \
        re.search(r'field--name-field-text-box[^>]*>(.*?)</div>', tab, re.S)
    if not m:
        return []
    body = re.sub(r'(?i)<br\s*/?>|</p>\s*<p>', '\n', m.group(1))
    lines = [strip_tags(x).strip(' .;:') for x in body.split('\n')]
    groups, cur = [], None
    for line in lines:
        if not line or len(line) > 120:
            continue
        y = year_from(line)
        if y is not None or (len(line.split()) <= 3 and ELECTIVE.search(line)):
            cur = {'heading': line, 'items': []}
            groups.append(cur)
            continue
        if PROSE.search(line) or len(line.split()) > 12:
            continue
        if cur is None:
            cur = {'heading': '', 'items': []}
            groups.append(cur)
        cur['items'].append(line)
    return [g for g in groups if g['items']]


# Some UNZA pages DO print codes, inline in the title: "EM211 Engineering
# Mathematics I", "LPU2910 - Legal Process & Legal Writing - Full course",
# "BIO 1401 Cells and Bio-molecules". They have to come OUT of the title —
# gen-programmes fails the build on a code in a title, and rightly: a student
# must never see one. They are worth keeping in `code`, where the pipeline can
# read the year off them.
CODE = re.compile(r'^\s*(?:\d{1,2}[.)]\s*)?([A-Z]{2,4})\s?-?\s?(\d{3,4})[A-Z]?\s*[-–—:.]?\s+(.+)$')
TAIL = re.compile(r'(?i)\s*[-–—]\s*(full|half|quarter)\s+course\s*$')
LEADING_NUM = re.compile(r'^\s*\d{1,2}[.)]\s+')


# A code appearing after the start of a line means two courses were typed into
# one cell — seen in Electrical Engineering, where "Electronic Engineering III"
# and "4682 Communications Principles" share a single <li>. Split rather than
# drop: both are real courses on that year.
RUN_ON = re.compile(r'(?<=\S)\s+(?=(?:[A-Z]{2,4}\s?)?\d{3,4}\s+[A-Z])')


def explode(item):
    return [p.strip() for p in RUN_ON.split(item) if p.strip()]


def split_code(title):
    """('EM211', 'Engineering Mathematics I') — or (None, title) when there is
    no code, which is the usual case on this site."""
    title = TAIL.sub('', title).strip()
    m = CODE.match(title)
    if m:
        return m.group(1) + m.group(2), m.group(3).strip(' -–—:.')
    return None, LEADING_NUM.sub('', title).strip()


def year_from(heading):
    h = heading.lower()
    m = re.search(r'\byear\s*([1-7])\b', h) or re.search(r'\b([1-7])(st|nd|rd|th)\s*year\b', h)
    if m:
        return int(m.group(1))
    for word, n in ORDINALS.items():
        if re.search(r'\b%s\b' % word, h) and 'year' in h:
            return n
    return None


def build_subjects(mods):
    groups = collections.defaultdict(list)
    for m in mods:
        groups[norm(m['title'])].append(m)
    subs = []
    for k, g in groups.items():
        tc = collections.Counter(x['title'] for x in g)
        title = re.sub(r'\s+(I{1,3}|IV)$', '', tc.most_common(1)[0][0]).strip()
        yrs = [x['year'] for x in g if x['year']]
        subs.append({
            'norm': k, 'title': title, 'slug': slugify(norm(title)),
            'programme_count': len({x['programme_slug'] for x in g}),
            'module_rows': len(g),
            'lowest_level': min((x['level'] for x in g),
                                key=lambda l: LEVEL_RANK.get(l, 9)),
            'typical_year': collections.Counter(yrs).most_common(1)[0][0] if yrs else None,
            'kind': 'project' if k in PROJECT_KINDS else 'course',
            'schools': sorted({x['school'] for x in g}),
            'codes': sorted({x['code'] for x in g if x['code']}),
            'programmes': sorted({x['programme_slug'] for x in g}),
            'title_variants': sorted(tc),
        })
    queue = sorted([s for s in subs if s['kind'] == 'course'],
                   key=lambda s: (-s['programme_count'],
                                  LEVEL_RANK.get(s['lowest_level'], 9),
                                  s['typical_year'] or 9, s['title']))
    for i, s in enumerate(queue, 1):
        s['priority'] = i
    subs.sort(key=lambda s: (-s['programme_count'], s['title']))
    return subs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join('_dev', 'tmp', 'unza-scrape'))
    ap.add_argument('--refresh', action='store_true', help='ignore cached pages')
    a = ap.parse_args()
    pages = os.path.join(a.out, 'pages')
    os.makedirs(pages, exist_ok=True)

    idx = get(INDEX)
    if not idx:
        sys.exit('could not fetch the programme index')
    rows = parse_index(idx)
    print('programmes on index: %d' % len(rows))

    def fetch(r):
        p = os.path.join(pages, r['slug'] + '.html')
        if not a.refresh and os.path.exists(p) and os.path.getsize(p) > 5000:
            return r, open(p, encoding='utf-8', errors='replace').read()
        b = get(r['url'])
        if b and len(b) > 5000:
            open(p, 'w', encoding='utf-8').write(b)
        return r, b

    mods = []
    with cf.ThreadPoolExecutor(6) as ex:
        for r, body in ex.map(fetch, rows):
            if not body:
                r['link_status'], r['modules_found'] = 'dead-404', 0
                continue
            r['link_status'] = 'ok'
            got = parse_courses(r, body)
            r['modules_found'] = len(got)
            mods.extend(got)

    subs = build_subjects(mods)

    for name, data in (('programmes', rows), ('modules', mods), ('subjects', subs)):
        with open(os.path.join(a.out, name + '.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=1, ensure_ascii=False)

    dead = sum(1 for r in rows if r.get('link_status') == 'dead-404')
    empty = sum(1 for r in rows if not r.get('modules_found'))
    noyear = sum(1 for m in mods if m['year'] is None)
    print('course rows        : %d  (%d with no year)' % (len(mods), noyear))
    print('distinct courses   : %d  (%d teachable)'
          % (len(subs), sum(1 for s in subs if s['kind'] == 'course')))
    print('dead links         : %d' % dead)
    print('no curriculum      : %d' % empty)
    print('written to         : %s' % a.out)


if __name__ == '__main__':
    main()
