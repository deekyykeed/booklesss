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
│   ├── sources/           ← build scripts for the pitch/video-script PDFs
│   └── *.pdf              ← pitch decks, video-script PDFs
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
2. **`_dev/fonts/` and `Brand/`** are referenced by *every* PDF build script
   (`_ROOT/_dev/fonts`, `_ROOT/Brand`). Renaming `_dev/` or these subfolders
   breaks ~40 scripts. `tools/` is for *standalone* utilities only — not these.
3. **`_dev/step-generator/`** is still referenced by some `content_*.py` files
   (TM 2.1/2.2, MIC 1.1). Leave it in `_dev/` unless those references are updated too.
4. **`Demand/social/_scripts/`** borrows Playwright from `platform/node_modules`
   and (for the live-app capture scripts 1–3) screenshots the running app. It
   assumes it sits at `Demand/social/`; `paths.mjs` resolves `platform/` from there.
5. **`platform/src/lib/course-data.json`** is generated by `scripts/gen-course.mjs`
   from Supabase — edit content in Supabase then regenerate, don't hand-edit the JSON.

## 🎬 Animated icons — LIVE on the checkpoint row (parked 2026-08-07, back 2026-08-09)

Owner, 2026-08-09: *"let's go back to the lordicons i had a few iterations
before."* The **three checkpoint answers** are Lordicon doodles again — grey at
rest, their own colours when chosen, and the tapped one plays its animation.
Nothing else in the app draws one; the note button and its five verdicts beside
them are Tabler.

It was parked for two days after the first attempt (*"the animations are nice,
store how they're done so I can do something with that later"*), and **parking it
working rather than deleting it is why coming back was a wiring job**. Everything
below was written then and still holds.

**Two things the second attempt learned, on top of the three below:**

1. **`colorize` is wrong for a filled drawing.** It flattens *every* colour to
   the one you give it, so a grey rest state paints the eyes and mouth the same
   grey as the head — every face rendered as a blank disc. `filter: grayscale(1)`
   in CSS keeps the drawing and drops the hue. `colorize` suits a line icon,
   where the only colour is the line.
2. **Replay on a per-icon counter, not on the selected flag.** Keyed on
   "am I chosen", the mark you just turned *off* replays too, because it flips
   the other way in the same click — so letting go of an answer animates a mark
   you never touched.

**Getting an icon is one line.** No account, no manual export, no clicking:

```bash
cd platform
node scripts/fetch-lordicon.mjs --find smile              # search the catalogue
node scripts/fetch-lordicon.mjs emoji-smile doodle color grasp-got
node scripts/lord-states.mjs                              # what states it carries
```

**Why that works, since Lordicon documents none of it.** Their site is
client-rendered, so an icon page has no icon data and no CDN URL in it, and
`cdn.lordicon.com/emoji-smile.json` is a 404 and always will be — the CDN cannot
be addressed by name. Two public endpoints, no auth, joined by one field:
`lordicon.com/api/library/icons` returns the whole catalogue where every row
carries an opaque `key`, and `cdn.lordicon.com/<key>.json` is the Lottie. The
script refuses `premium: true` icons.

**What is already in the repo**

| | |
|---|---|
| `platform/src/components/icons/lordicon.tsx` | `<LordIcon>` — self-hosted JSON, replays on a `playToken`, falls back to any node you give it |
| `platform/scripts/fetch-lordicon.mjs` | catalogue search + download |
| `platform/scripts/lord-states.mjs` | prints an icon's real state names |
| `platform/public/reader/icons/*.json` | the doodle faces + a feedback mark. **`grasp-save.json` is missing** — the owner picked Lordicon `book-bookmark`, doodle/color (catalogue `doodle-color-112`), but lordicon.com is blocked from the cloud sandbox this was wired in. One command lands it: `node scripts/fetch-lordicon.mjs book-bookmark doodle color grasp-save`, then `node scripts/lord-states.mjs` and set `state` in `Checkpoint.tsx` if the default it prints is an `in-` one. Until then that answer draws its Tabler bookmark, which is what `fallback` is for. |

**Three things that cost time, so they are not rediscovered**

1. **Export Lottie, never GIF.** A GIF bakes one state, one colour and one size
   into pixels. It is also why the first attempt animated wrongly: GIFs exported
   from `in-reveal`, which plays when an icon *appears* and so starts from an
   empty frame — on a control already on screen it reads as the icon vanishing.
   For anything tappable, take a `hover-` state.
2. **An icon is several animations in one file**, and a `state` name that does
   not match falls back to the default **silently** — a guess plays the wrong
   thing with no error. That is what `lord-states.mjs` is for.
3. **`@lordicon/react` needs `lottie-web`** as a peer dependency and npm does
   not install peers, so it fails at render with everything green. (`@lordicon/element`
   bundles its own player and does *not* need it — that difference broke a build.)

⚠️ **Licence unsettled, and it now ships.** Free-tier icons may owe attribution;
nothing here records which plan applies. This stopped being a note on a parked
experiment on 2026-08-09 and is now a note on something students see. Settle it.

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
