#!/usr/bin/env python3
"""
Scrape zcasu.edu.zm/all-programmes/ into the Booklesss course pipeline.

    python3 tools/scrape_zcas_programmes.py [--out DIR] [--refresh]

Writes to DIR (default _dev/tmp/zcas-scrape/):
    programmes.json  60 programmes: school, level, awarding body, source URL
    modules.json     one row per course-in-a-programme (code, year, semester)
    subjects.json    distinct courses, deduped across programmes, ranked by reach
    pages/*.html     cached programme pages (re-used unless --refresh)

The Supabase side lives in pipeline_schools / pipeline_programmes /
pipeline_subjects / pipeline_programme_subjects (see PROJECT_MEMORY session 41).
Those tables are INTERNAL — they carry course codes and school names, which must
never reach a student. RLS is on with no policy: service_role only.

Two things the source site gets wrong, both handled here:
  - 19 programmes say "the course structure is as shown in Tables 1 to 4 below"
    and then publish no tables. They land with modules_found = 0.
  - The 7 University of Greenwich programme links 404. Flagged 'dead-404'.
"""

import argparse, concurrent.futures as cf, html, json, os, re, sys, time, urllib.request

INDEX = 'https://zcasu.edu.zm/all-programmes/'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

SCHOOLS = {
    'school of business': 'School of Business',
    'school of social sciences': 'School of Social Sciences',
    'school of computing, technology and applied sciences':
        'School of Computing, Technology and Applied Sciences',
    'school of law': 'School of Law',
}
# The four law programmes are listed under BOTH Social Sciences and School of
# Law. Document order puts them in Social Sciences, which leaves the School of
# Law empty; their real home is Law.
LAW = {'bachelor-of-laws-llb-commercial-law', 'bachelor-of-laws-llb-generic',
       'master-of-laws-in-corporate-and-commercial-laws',
       'master-of-laws-in-taxation-and-investment'}

# Course titles are typed by hand per programme, so the same course appears
# under several spellings. Normalise before deduping or the reach counts split.
FIX = {'modelling': 'modeling', 'organisation': 'organization',
       'organisational': 'organizational', 'organisations': 'organizations',
       'behavioural': 'behavioral', 'programme': 'program', 'centre': 'center',
       'analyse': 'analyze', 'specialisation': 'specialization',
       'inteligence': 'intelligence', 'entreprenuership': 'entrepreneurship',
       'attachement': 'attachment', 'enterprenuership': 'entrepreneurship',
       'managment': 'management', 'accouting': 'accounting', 'ict': 'it',
       'maths': 'mathematics', 'info': 'information'}

# Assessment milestones, not readable content — kept but excluded from the queue.
PROJECT_KINDS = {'dissertation', 'computing project', 'project finalists only',
                 'thesis and viva voce', 'industrial attachment',
                 'research proposal', 'initial progress report',
                 'final progress report', 'work placement', 'internship'}

LEVEL_RANK = {'diploma': 0, 'bachelors': 1, 'masters': 2, 'doctorate': 3}

PURE = re.compile(r'^([A-Z]{2,6})[\s\-]?(\d{3,4})([A-Z]?)$')
INLINE = re.compile(r'^([A-Z]{2,6})[\s\-]?(\d{3,4})([A-Z]?)\s*[–—\-−:.]\s*(.+)$')
SKIP = re.compile(r'(?i)^\s*(course\s*(code|title)|semester\s*\d?|year\s*\d.*|'
                  r'total.*|credits?|core.*|electives?|optional.*|module.*|n/?a|\d+)\s*$')


def get(url, tries=5):
    for a in range(tries):
        try:
            return urllib.request.urlopen(
                urllib.request.Request(url, headers=UA), timeout=90
            ).read().decode('utf-8', 'replace')
        except Exception as e:
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


def cells(tr):
    out = []
    for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S):
        t = html.unescape(re.sub(r'<[^>]+>', ' ', c))
        t = t.replace('�', '–').replace('\xa0', ' ').replace('​', '')
        out.append(re.sub(r'\s+', ' ', t).strip())
    return out


def parse_index(body):
    """Programme rows in document order, tagged with the school heading above them."""
    toks = re.finditer(
        r'(<h[1-4][^>]*>.*?</h[1-4]>)|(<a[^>]*href="(https://zcasu\.edu\.zm/index\.php/courses/[^"]+?)"[^>]*>(.*?)</a>)',
        body, re.S)
    cur, rows, seen = None, [], set()
    for m in toks:
        if m.group(1):
            t = html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip().lower()
            if t in SCHOOLS:
                cur = SCHOOLS[t]
        elif cur:
            url = m.group(3)
            if url in seen:
                continue
            seen.add(url)
            name = html.unescape(re.sub(r'<[^>]+>', '', m.group(4)))
            name = re.sub(r'\s+', ' ', name.replace('�', '–')).strip()
            if not name:
                continue
            slug = url.rstrip('/').rsplit('/', 1)[1]
            low = name.lower()
            rows.append({
                'slug': slug, 'name': name, 'url': url,
                'school': 'School of Law' if slug in LAW else cur,
                'level': ('doctorate' if low.startswith('phd') or 'doctor of' in low
                          else 'masters' if low.startswith(('master', 'mba'))
                          else 'diploma' if 'diploma' in low else 'bachelors'),
                'awarding_body': ('University of Greenwich' if 'university of greenwich' in low
                                  else 'NCC Education' if low.startswith('ncc')
                                  else 'ZCAS University'),
            })
    # One anchor's text is split by markup and truncates at "University of".
    for r in rows:
        if r['name'].endswith(('of', 'in', 'and', 'the', 'for')):
            r['name'] += ' Greenwich' if 'greenwich' in r['slug'] else ''
    return rows


def parse_modules(row, body):
    """Both published table shapes: 'CODE - Title' cells, and Code|Title columns."""
    mods, tabs = [], re.findall(r'<table.*?</table>', body, re.S)
    for ti, t in enumerate(tabs, 1):
        trs = re.findall(r'<tr.*?</tr>', t, re.S)
        year_hint, sems = None, []
        for tr in trs:
            cs = cells(tr)
            joined = ' '.join(cs)
            if any(PURE.match(c) for c in cs):
                continue
            ym = re.search(r'year\s*(\d)', joined, re.I)
            if ym and len(cs) <= 2:
                year_hint = int(ym.group(1))
            s = re.findall(r'semester\s*(\d)', joined, re.I)
            if s and not sems:
                sems = [int(x) for x in s]
        for tr in trs:
            cs = cells(tr)
            n = len(cs)
            span = (n // len(sems)) if sems and n >= len(sems) and n % len(sems) == 0 else None
            i = 0
            while i < n:
                c = cs[i]
                if not c or SKIP.match(c):
                    i += 1
                    continue
                m, code, title, adv = PURE.match(c), None, None, 1
                if m and i + 1 < n and cs[i + 1] and not PURE.match(cs[i + 1]) \
                        and not SKIP.match(cs[i + 1]):
                    code, title, adv = m.group(1) + m.group(2) + m.group(3), cs[i + 1], 2
                else:
                    m2 = INLINE.match(c)
                    if not m2:
                        i += 1
                        continue
                    code, title = m2.group(1) + m2.group(2) + m2.group(3), m2.group(4)
                title = re.sub(r'\s+', ' ', title.strip(' –—-:.\t')).strip()
                if not title or len(title) < 3 or SKIP.match(title):
                    i += adv
                    continue
                digit = int(re.search(r'\d', code).group(0))
                mods.append({
                    'programme_slug': row['slug'], 'programme': row['name'],
                    'school': row['school'], 'level': row['level'],
                    'code': code, 'title': title,
                    'year': year_hint or (digit if 1 <= digit <= 6 else ti),
                    'semester': sems[i // span] if span and (i // span) < len(sems) else None,
                })
                i += adv
    return mods


def build_subjects(mods):
    import collections
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
            'codes': sorted({x['code'] for x in g}),
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
    ap.add_argument('--out', default=os.path.join('_dev', 'tmp', 'zcas-scrape'))
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
        if b and 'page not found' not in b[:4000].lower():
            open(p, 'w', encoding='utf-8').write(b)
        return r, b

    mods = []
    with cf.ThreadPoolExecutor(6) as ex:
        for r, body in ex.map(fetch, rows):
            if not body or '404' in (body[:200] if body else ''):
                r['link_status'], r['modules_found'] = 'dead-404', 0
                continue
            r['link_status'] = 'ok'
            got = parse_modules(r, body)
            r['modules_found'] = len(got)
            mods.extend(got)

    seen, uniq = set(), []
    for m in mods:
        k = (m['programme_slug'], m['code'], m['title'].lower())
        if k not in seen:
            seen.add(k)
            uniq.append(m)
    subs = build_subjects(uniq)

    for name, data in (('programmes', rows), ('modules', uniq), ('subjects', subs)):
        with open(os.path.join(a.out, name + '.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=1, ensure_ascii=False)

    dead = sum(1 for r in rows if r.get('link_status') == 'dead-404')
    empty = sum(1 for r in rows if not r.get('modules_found'))
    print('module rows        : %d' % len(uniq))
    print('distinct courses   : %d  (%d teachable)'
          % (len(subs), sum(1 for s in subs if s['kind'] == 'course')))
    print('dead links         : %d' % dead)
    print('no curriculum      : %d  <- site references tables it never published' % empty)
    print('written to         : %s' % a.out)


if __name__ == '__main__':
    main()
