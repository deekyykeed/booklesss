#!/usr/bin/env python3
"""
Scrape mu.ac.zm's programmes into the Booklesss course pipeline.

    python3 tools/scrape_mu_programmes.py [--out DIR] [--refresh]

Writes the same three files as the ZCAS and UNZA scrapers, so one loader takes
any of them:
    programmes.json  department, level, source URL
    modules.json     one row per course-in-a-programme (code, year, semester)
    subjects.json    distinct courses, deduped, ranked by reach
    pages/*.html     cached programme pages (re-used unless --refresh)

MULUNGUSHI IS THE BEST-PUBLISHED OF THE THREE. Every programme page carries one
"Programme Structure" table: a Year cell spanning its rows, then a Semester I
and a Semester II column, each cell "1. BAF111 Principles of Accounting I". So
unlike UNZA this yields code, year AND semester on every row — the same
completeness ZCAS gives, from a much tidier source.

The listing is paginated as /<n>/programmes/ rather than by a page= query, and
the same programme appears on the department listings too, so URLs are deduped
on the numeric id at the end of the path.
"""

import argparse, collections, concurrent.futures as cf, html, json, os, re, sys, time, urllib.request

ORIGIN = 'https://www.mu.ac.zm'
INDEX = ORIGIN + '/programmes/'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

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
                 'field attachment', 'student teaching practice', 'capstone project'}

LEVEL_RANK = {'diploma': 0, 'bachelors': 1, 'masters': 2, 'doctorate': 3}

ORDINALS = {'first': 1, 'second': 2, 'third': 3, 'fourth': 4,
            'fifth': 5, 'sixth': 6, 'seventh': 7}
ROMAN = {'i': 1, 'ii': 2, 'iii': 3, 'iv': 4}

# "1. BAF111 Principles of Accounting I" — the leading number is the row's
# position in the semester, not part of anything, and the code must come out of
# the title or the gen-programmes build fails on it.
ENTRY = re.compile(r'^\s*(?:\d{1,2}[.)]\s*)?([A-Z]{2,5})\s?-?\s?(\d{3,4})([A-Z]?)\s*[-–—:.]?\s+(.+)$')
LEADING_NUM = re.compile(r'^\s*\d{1,2}[.)]\s+')

NOT_A_COURSE = {'course', 'courses', 'elective', 'electives', 'and', 'or', 'tbc',
                'n a', 'total', 'credits', 'core', 'optional'}


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


def strip_tags(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).replace('\xa0', ' ').strip()


# Small words that stay lowercase when a URL slug is turned back into a name.
SMALL = {'of', 'and', 'the', 'in', 'for', 'with', 'to'}


def unslug(s):
    """`department-of-economics` -> `Department of Economics`."""
    return ' '.join(w if w in SMALL else w.capitalize() for w in s.split('-')).strip()


def level_of(name):
    low = name.lower()
    if low.startswith('phd') or 'doctor of philosophy' in low:
        return 'doctorate'
    if low.startswith('master') or low.startswith('mba') or ' master' in low:
        return 'masters'
    if 'diploma' in low or 'certificate' in low:
        return 'diploma'
    return 'bachelors'


LINK = re.compile(r'<a[^>]*href="(?:%s)?(/programmes/([a-z0-9-]+)/(\d+)/)"[^>]*>(.*?)</a>'
                  % re.escape(ORIGIN), re.S)


def parse_index(pages):
    """Every /programmes/<slug>/<id>/ link across the listing pages.

    Deduped on the numeric id: a programme appears on the paginated listing and
    again on its department's own listing, sometimes under a different slug.
    Mulungushi has no school layer — the department listing a programme appears
    on is the only grouping it publishes, so that is what is recorded as its
    school."""
    rows, seen = [], {}
    for url, body in pages:
        dept = re.search(r'/department-([a-z0-9-]+)/programmes/', url)
        dept = unslug('department-' + dept.group(1)) if dept else None
        for m in LINK.finditer(body):
            path, slug, pid, label = m.groups()
            name = strip_tags(label)
            if not name or len(name) < 5:
                continue
            if pid in seen:
                # The paginated index is read first and carries no department;
                # fill it in when the department listing turns the same one up.
                if dept and not seen[pid]['school']:
                    seen[pid]['school'] = dept
                continue
            r = {'slug': slug, 'pid': pid, 'name': name, 'url': ORIGIN + path,
                 'school': dept, 'level': level_of(name),
                 'awarding_body': 'Mulungushi University'}
            seen[pid] = r
            rows.append(r)
    return rows


def cells(tr):
    out = []
    for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S):
        out.append(strip_tags(c))
    return out


def year_of(text):
    t = text.lower()
    m = re.search(r'\byear\s*([1-7])\b', t) or re.search(r'\b([1-7])(st|nd|rd|th)\s*year\b', t)
    if m:
        return int(m.group(1))
    for word, n in ORDINALS.items():
        if re.search(r'\b%s\b' % word, t):
            return n
    return None


def semester_of(text):
    t = text.lower()
    m = re.search(r'\b(?:semester|term)\s*(?:([12])|(i{1,2}|iv|iii))\b', t)
    if not m:
        return None
    return int(m.group(1)) if m.group(1) else ROMAN.get(m.group(2))


def parse_modules(row, body):
    """The Programme Structure table: a Year cell spanning its rows, then one
    column per semester.

    The year cell is only present on the first row of each year (it carries a
    rowspan), so the year is carried down. Which column is which semester is
    read from the header rather than assumed, because a handful of programmes
    print Semester I / Semester II / Semester III."""
    mods = []
    for table in re.findall(r'<table.*?</table>', body, re.S):
        trs = re.findall(r'<tr.*?</tr>', table, re.S)
        if not trs:
            continue
        head = cells(trs[0])
        sems = [semester_of(h) for h in head]
        if not any(s for s in sems):
            continue
        # Offset of the first semester column — 1 where a Year column leads.
        first = next(i for i, s in enumerate(sems) if s)
        year = None
        for tr in trs[1:]:
            cs = cells(tr)
            if not cs:
                continue
            # A row that opens with a year label re-anchors the year; one that
            # doesn't is a continuation of the year above it.
            lead = len(cs) - (len(sems) - first)
            if lead > 0 and year_of(cs[0]):
                year = year_of(cs[0])
            body_cells = cs[lead:] if lead > 0 else cs
            for i, cell in enumerate(body_cells):
                sem = sems[first + i] if first + i < len(sems) else None
                for entry in re.split(r'\s{2,}(?=\d{1,2}[.)]\s)', cell):
                    m = ENTRY.match(entry.strip())
                    if not m:
                        continue
                    title = m.group(4).strip(' -–—:.')
                    if not title or norm(title) in NOT_A_COURSE:
                        continue
                    if re.search(r'[A-Z]{2,5}[ -]?\d{3,4}', title):
                        continue
                    mods.append({
                        'programme_slug': row['slug'], 'programme': row['name'],
                        'school': row.get('school'), 'level': row['level'],
                        'code': m.group(1) + m.group(2) + m.group(3),
                        'title': title, 'year': year, 'semester': sem,
                    })
    seen, uniq = set(), []
    for m in mods:
        k = (m['code'], norm(m['title']))
        if k not in seen:
            seen.add(k)
            uniq.append(m)
    return uniq


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
            'schools': sorted({x['school'] for x in g if x['school']}),
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
    ap.add_argument('--out', default=os.path.join('_dev', 'tmp', 'mu-scrape'))
    ap.add_argument('--refresh', action='store_true', help='ignore cached pages')
    a = ap.parse_args()
    pages = os.path.join(a.out, 'pages')
    os.makedirs(pages, exist_ok=True)

    listings = [INDEX] + ['%s/%d/programmes/' % (ORIGIN, n) for n in range(1, 25)]
    pages_seen = []
    with cf.ThreadPoolExecutor(6) as ex:
        for u, b in zip(listings, ex.map(get, listings)):
            if b:
                pages_seen.append((u, b))
    # The department listings carry programmes the paginated index does not, and
    # they are the only place the department is stated.
    depts = sorted({m.group(1) for _, b in pages_seen
                    for m in re.finditer(r'href="(/department-[a-z0-9-]+/programmes/)"', b)})
    urls = [ORIGIN + d for d in depts]
    with cf.ThreadPoolExecutor(6) as ex:
        for u, b in zip(urls, ex.map(get, urls)):
            if b:
                pages_seen.append((u, b))

    rows = parse_index(pages_seen)
    print('programmes found   : %d  (across %d listing pages, %d departments)'
          % (len(rows), len(pages_seen), len(depts)))

    def fetch(r):
        p = os.path.join(pages, '%s-%s.html' % (r['slug'][:60], r['pid']))
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
            got = parse_modules(r, body)
            r['modules_found'] = len(got)
            mods.extend(got)

    subs = build_subjects(mods)
    for name, data in (('programmes', rows), ('modules', mods), ('subjects', subs)):
        with open(os.path.join(a.out, name + '.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=1, ensure_ascii=False)

    empty = sum(1 for r in rows if not r.get('modules_found'))
    noyear = sum(1 for m in mods if m['year'] is None)
    print('course rows        : %d  (%d with no year)' % (len(mods), noyear))
    print('distinct courses   : %d  (%d teachable)'
          % (len(subs), sum(1 for s in subs if s['kind'] == 'course')))
    print('no curriculum      : %d' % empty)
    print('written to         : %s' % a.out)


if __name__ == '__main__':
    main()
