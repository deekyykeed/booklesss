#!/usr/bin/env python3
"""
Load a scrape into the Booklesss course pipeline.

    python3 tools/load_pipeline.py --university unza --dir _dev/tmp/unza-scrape
    python3 tools/load_pipeline.py --university mulungushi --dir _dev/tmp/mu-scrape --dry-run

Takes the programmes.json / modules.json a scraper writes and upserts them into
pipeline_schools / pipeline_programmes / pipeline_subjects /
pipeline_programme_subjects, then recomputes reach and build priority across
EVERY university at once.

One loader for every scraper on purpose: the three sites are shaped differently
enough to need their own parsers, but what they produce is the same three files,
and the reach ranking is only meaningful if it is computed over all of them
together. A course taught at ZCAS and at UNZA is one course to build.

SERVICE ROLE. The pipeline_* tables have RLS on with no policies, and they hold
course codes and school names, which must never reach a student. The key is read
from platform/.env.local and never leaves this machine.
"""

import argparse, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV = os.path.join(ROOT, 'platform', '.env.local')

LEVEL_RANK = {'diploma': 0, 'bachelors': 1, 'masters': 2, 'doctorate': 3}


def env():
    out = {}
    with open(ENV, encoding='utf-8') as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                k, v = line.split('=', 1)
                out[k.strip()] = v.strip().strip('"')
    url, key = out.get('NEXT_PUBLIC_SUPABASE_URL'), out.get('SUPABASE_SERVICE_ROLE_KEY')
    if not url or not key:
        sys.exit('platform/.env.local is missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
    return url.rstrip('/') + '/rest/v1', key


def api(base, key, method, path, body=None, prefer=None):
    req = urllib.request.Request(base + path, method=method)
    req.add_header('apikey', key)
    req.add_header('Authorization', 'Bearer ' + key)
    req.add_header('Content-Type', 'application/json')
    req.add_header('Accept', 'application/json')
    if prefer:
        req.add_header('Prefer', prefer)
    data = json.dumps(body).encode() if body is not None else None
    try:
        with urllib.request.urlopen(req, data, timeout=120) as r:
            raw = r.read().decode() or '[]'
            return json.loads(raw) if raw.strip().startswith(('[', '{')) else []
    except urllib.error.HTTPError as e:
        sys.exit('%s %s -> %s\n%s' % (method, path, e.code, e.read().decode()[:2000]))


def chunks(rows, n=250):
    for i in range(0, len(rows), n):
        yield rows[i:i + n]


def slugify(t):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', t.lower())).strip('-')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--university', required=True, help="a universities.id, e.g. unza")
    ap.add_argument('--dir', required=True, help='the scrape output directory')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()

    progs = json.load(open(os.path.join(a.dir, 'programmes.json'), encoding='utf-8'))
    mods = json.load(open(os.path.join(a.dir, 'modules.json'), encoding='utf-8'))
    base, key = env()

    uni = api(base, key, 'GET', '/universities?id=eq.%s&select=id,name' % a.university)
    if not uni:
        sys.exit('no universities row with id=%s — add the campus first' % a.university)

    # --- schools -------------------------------------------------------------
    names = sorted({p['school'] for p in progs if p.get('school')})
    schools = [{'university_id': a.university, 'slug': slugify(n), 'name': n, 'seq': i}
               for i, n in enumerate(names, 1)]

    # --- programmes ----------------------------------------------------------
    by_slug = {}
    for i, p in enumerate(progs, 1):
        by_slug[p['slug']] = {
            'university_id': a.university, 'slug': p['slug'], 'name': p['name'],
            'level': p.get('level'), 'awarding_body': p.get('awarding_body'),
            'source_url': p.get('url'), 'link_status': p.get('link_status', 'ok'),
            'modules_found': p.get('modules_found', 0), 'seq': i,
            '_school': p.get('school'),
        }

    # --- subjects ------------------------------------------------------------
    # One row per distinct course, keyed on the slug the scraper derived from
    # the normalised title — which is what makes a course taught at two
    # universities land on one row rather than two.
    #
    # A module is matched back to its subject through `title_variants`, the list
    # of raw titles that collapsed into it. Re-deriving it here would mean a
    # second copy of each scraper's norm(), and the two would drift.
    subs = json.load(open(os.path.join(a.dir, 'subjects.json'), encoding='utf-8'))
    subjects, title_to_slug = {}, {}
    for s in subs:
        subjects[s['slug']] = {'slug': s['slug'], 'title': s['title'], 'kind': s['kind'],
                               'status': 'todo'}
        for variant in s.get('title_variants') or [s['title']]:
            title_to_slug[variant] = s['slug']

    print('%s: %d programmes, %d schools, %d course rows, %d distinct courses'
          % (a.university, len(progs), len(schools), len(mods), len(subjects)))
    if a.dry_run:
        return

    # --- write ---------------------------------------------------------------
    if schools:
        api(base, key, 'POST', '/pipeline_schools?on_conflict=university_id,slug', schools,
            'resolution=merge-duplicates,return=minimal')
    school_id = {r['name']: r['id'] for r in api(
        base, key, 'GET', '/pipeline_schools?university_id=eq.%s&select=id,name' % a.university)}

    payload = []
    for p in by_slug.values():
        row = {k: v for k, v in p.items() if not k.startswith('_')}
        row['school_id'] = school_id.get(p['_school'])
        payload.append(row)
    for c in chunks(payload):
        api(base, key, 'POST', '/pipeline_programmes?on_conflict=university_id,slug', c,
            'resolution=merge-duplicates,return=minimal')
    prog_id = {r['slug']: r['id'] for r in api(
        base, key, 'GET',
        '/pipeline_programmes?university_id=eq.%s&select=id,slug&limit=5000' % a.university)}

    # Only insert subjects that are new — an existing row may already be `live`
    # or carry notes, and this must not reset either.
    have = {r['slug'] for r in api(base, key, 'GET', '/pipeline_subjects?select=slug&limit=10000')}
    new = [s for s in subjects.values() if s['slug'] not in have]
    for c in chunks(new):
        api(base, key, 'POST', '/pipeline_subjects', c, 'return=minimal')
    subj_id = {r['slug']: r['id'] for r in api(
        base, key, 'GET', '/pipeline_subjects?select=id,slug&limit=10000')}

    # The join rows for this university are rebuilt rather than merged: the
    # unique index uses coalesce() over three nullable columns, which PostgREST
    # cannot target with on_conflict, and a re-scrape should drop a course the
    # site has removed.
    ids = list(prog_id.values())
    for c in chunks(ids, 100):
        api(base, key, 'DELETE',
            '/pipeline_programme_subjects?programme_id=in.(%s)' % ','.join(c), None, 'return=minimal')

    rows, seen = [], set()
    for m in mods:
        pid = prog_id.get(m['programme_slug'])
        sid = subj_id.get(title_to_slug.get(m['title']))
        if not pid or not sid:
            continue
        k = (pid, sid, m.get('code') or '', m.get('year') or 0, m.get('semester') or 0)
        if k in seen:
            continue
        seen.add(k)
        rows.append({'programme_id': pid, 'subject_id': sid, 'code': m.get('code'),
                     'year': m.get('year'), 'semester': m.get('semester')})
    for c in chunks(rows):
        api(base, key, 'POST', '/pipeline_programme_subjects', c, 'return=minimal')

    print('loaded: %d schools, %d programmes, %d new courses, %d join rows'
          % (len(schools), len(payload), len(new), len(rows)))
    print('now recompute reach and priority — tools/recount_pipeline.sql')


if __name__ == '__main__':
    main()
