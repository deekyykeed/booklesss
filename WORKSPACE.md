# WORKSPACE.md — where everything lives

**Read this before moving or creating files.** It's the map of the whole
repo: what each top-level folder is for, and — just as important — which paths
**must not move** because other files resolve them by relative path. If you're an
agent about to reorganise something, check the "Do not move" rules first.

Companion docs: [`README.md`](README.md) (business state + action queue),
[`PROJECT_MEMORY.md`](PROJECT_MEMORY.md) (session log, dead ends), and
[`.claude/CLAUDE.md`](.claude/CLAUDE.md) (the rules that govern AI sessions).
Each course also has its own `_course.md` status tracker.

_Last restructured: 2026-07-25 — marketing moved out of the app to
`Demand/social/`; `tools/` created for standalone utilities; platform scratch
files removed._

---

## Top-level tree

```
Booklesss/
├── README.md              ← owner's map: business state, money model, action queue
├── PROJECT_MEMORY.md      ← session log: what happened, what worked, dead ends
├── WORKSPACE.md           ← this file: the structural map
├── BUILD_PLAN.md          ← platform/product architecture plan
│
├── Schools/               ← ALL course content, per school → course → lesson
│   ├── ZCAS/              ← Strategic Management, Treasury Management, Corporate Finance
│   └── UNZA/              ← BBA 1110, ECN 1115 (+ _pipeline/ raw courses, gitignored)
│
├── Demand/                ← marketing & demand-side content (see below)
│   ├── social/            ← ★ daily social carousels — the posting command centre
│   ├── carousels/         ← ReportLab PDF carousels (a different, older pipeline)
│   ├── sources/           ← build scripts for the pitch/flyer PDFs
│   └── *.pdf              ← pitch decks, flyers, video-script PDFs
│
├── Operations/            ← running the business: pricing, leads, revenue, checklist
│   ├── sources/           ← build scripts for the ops PDFs (revenue model, roles)
│   ├── cv/  dashboard.html  *.md
│
├── platform/              ← the Next.js 16 course-reader app (booklesss.vercel.app)
│   ├── src/  scripts/  public/  package.json
│   └── (deploys on push to main; content flow is GitHub-only — see below)
│
├── tools/                 ← standalone utility scripts (not tied to one course)
│   ├── transcribe.py      ← Whisper transcription of a single video
│   ├── transcribe_bulk.py ← transcribe a whole folder
│   └── transcribe-test/   ← a sample clip + its transcript
│
├── _dev/                  ← shared build assets + generators (referenced by build scripts)
│   ├── fonts/             ← Parastoo, Aptos, Parkinsans — used by EVERY PDF build script
│   ├── brand/             ← logo, mark, grain.png — used by EVERY PDF build script
│   └── step-generator/    ← Python HTML step generator (still used by some content_*.py)
│
├── Brand/                 ← raw asset drop zone (logos, hero images)
└── Dissertation/          ← side project using the same build tooling
```

---

## What each folder is for

| Folder | Holds | Notes |
|---|---|---|
| `Schools/` | Every course's lessons, steps, sources, past papers | One lesson = one Slack channel = one self-contained folder |
| `Demand/social/` | The daily 9:16 social carousels + generators | Moved here 2026-07-25 from `platform/marketing/`. See its own `README.md` |
| `Demand/` (rest) | Pitch decks, flyers, video scripts, PDF carousels | ReportLab PDFs; build scripts in `Demand/sources/` |
| `Operations/` | Pricing, leads, revenue, daily checklist, dashboards | The business's operating docs |
| `platform/` | The course-reader web app | Next.js 16; `src/lib/course-data.json` is the content it renders |
| `tools/` | Cross-project utility scripts | Currently the transcription tools |
| `_dev/` | Fonts, brand assets, the step generator | Assets here are load-bearing — see "Do not move" |
| `Brand/`, `Dissertation/` | Raw brand assets; a side project | — |

### The daily social workflow (`Demand/social/`)

The posting command centre. Days are grouped by week and named with their
weekday for easy navigation —
`posts/2026-W30 (Jul 20-26)/2026-07-25 Saturday/{morning,afternoon,evening}/` —
each holding three 9:16 carousels a day (`01.png … 05.png`) plus a `PLAN.md` of
times and captions. Both folder levels lead with the ISO week/date so they still
sort chronologically. Regenerate a day with `_scripts/5-day-carousels.mjs` (it
derives the week/weekday from `DAY` automatically) — it's self-contained (crops
from `_source/carousel-crops/`, fonts vendored in `_source/fonts/`), so **no
build or running server is needed**:

```bash
cd Demand/social
DAY=2026-07-26 node _scripts/5-day-carousels.mjs
```

All posts are **light only** — no dark-mode images until the app ships a real
dark mode. Full detail in [`Demand/social/README.md`](Demand/social/README.md).

---

## ⚠️ Do not move (paths other files depend on)

Moving any of these silently breaks scripts — the move succeeds, the script
fails later:

1. **Lesson build scripts stay in their lesson's `sources/` folder.** Each
   `Schools/.../<lesson>/sources/build_*.py` resolves fonts/brand via `_ROOT`
   (5 levels up) and writes its PDF to the sibling `../steps/`. The lesson folder
   is the unit of truth — do not centralise these into `tools/` or anywhere else.
2. **`_dev/fonts/` and `_dev/brand/`** are referenced by *every* PDF build script
   (`_ROOT/_dev/fonts`, `_ROOT/_dev/brand`). Renaming `_dev/` or these subfolders
   breaks ~40 scripts. `tools/` is for *standalone* utilities only — not these.
3. **`_dev/step-generator/`** is still referenced by some `content_*.py` files
   (TM 2.1/2.2, MIC 1.1). Leave it in `_dev/` unless those references are updated too.
4. **`Demand/social/_scripts/`** borrows Playwright from `platform/node_modules`
   and (for the live-app capture scripts 1–3) screenshots the running app. It
   assumes it sits at `Demand/social/`; `paths.mjs` resolves `platform/` from there.
5. **`platform/src/lib/course-data.json`** is generated by `scripts/gen-course.mjs`
   from Supabase — edit content in Supabase then regenerate, don't hand-edit the JSON.

## Content flow (platform)

Publishing is **GitHub-only**: edit content in Supabase → `npm run gen:course`
in `platform/` → commit the updated `course-data.json` → push. Vercel builds
only from the repo. Push to `main` = deploy to `booklesss.vercel.app`.

## Known loose ends (safe to reconcile, flagged not deleted)

- `Demand/build_what_is_booklesss.py` (root) and `Demand/sources/build_what_is_booklesss.py`
  are two **different** versions that build the same PDF — reconcile to one.
- `Demand/build_the_problem.py` sits at the Demand root while the convention is
  `Demand/sources/`; it uses the older `_ROOT` path style, so moving it means
  fixing its font/brand paths.
