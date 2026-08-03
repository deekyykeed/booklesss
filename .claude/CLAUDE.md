# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Booklesss** is an edtech product for Zambian university finance/business courses. **The course reader at `booklesss.vercel.app` is the product** (`platform/`, Next.js 16 + Supabase): a student reads steps there, ticks checkpoints and says how each section landed. Steps are authored as `.mjs` beside the lesson they belong to and published with `npm run seed:course` → `npm run gen:course`.

The original pipeline — source material (PPTX/PDF) → Python ReportLab script → PDF → posted to Slack — still exists and still builds. It is now **provenance and marketing**: lead magnets, business documents, and the PDFs the reader steps were mined from. Slack-as-the-paid-product was dropped (Linear BOO-7, MSA §3.4); do not rebuild paid Slack channels.

**On the reader:** economics, Corporate Finance (25 steps), Strategic Management (7), Treasury Management (12 — Treasury operations was split into three on 2026-08-01). Also on disk: BBA 1110 (UNZA), PDFs only. **Course codes and school names never appear anywhere a student sees** — see the memory index.
**Slack:** free community only; **workspace situation unresolved** (three workspaces; the public invite link points to `bookless10`, whose Pro trial expired, while SM PDFs went to `booklesss20` — see the top of `Operations/workspace.md`). Confirm the target workspace with the owner before posting anything or writing the invite link anywhere. | Website: `booklesss.framer.ai`
**Founding rate deadline:** April 18, 2026 — **this date has passed.** Do not reference it in new marketing content; ask the owner what offer replaces it.

## Commands

**Generate a PDF:**
```bash
python3 "Schools/[School]/[Course]/[lesson]/sources/build_[course]_[step]_[slug].py"
```

**Transcribe a video lecture:**
```bash
python3 tools/transcribe.py "path/to/video.mp4"
```

**Bulk-transcribe a folder of videos:**
```bash
python3 tools/transcribe_bulk.py "path/to/folder/"
```

No build system, no tests, no linter. Scripts are self-contained.

## Folder Structure

```
Booklesss/
├── README.md                          ← owner's map: status, money model, action queue
├── PROJECT_MEMORY.md                  ← session log, next-session list, dead ends
├── Schools/
│   ├── ZCAS/                          ← Zambia Centre for Accountancy Studies
│   │   ├── Strategic Management/
│   │   ├── Treasury Management/
│   │   ├── Corporate Finance/
│   │   └── _pipeline/                 ← future ZCAS courses (currently empty)
│   └── UNZA/                          ← University of Zambia
│       ├── BBA 1110 — Business Administration/
│       └── _pipeline/                 ← 13 raw UNZA courses (LOCAL ONLY — gitignored)
│
├── _dev/                             ← shared build assets (referenced by ALL build scripts)
│   ├── brand/                         ← logo, mark, grain.png
│   ├── fonts/                         ← Parastoo, Aptos, Parkinsans
│   ├── step-generator/               ← Python HTML step generator (used by some content_*.py)
│   └── tmp/                           ← scratch previews and text extracts (gitignored)
│
├── tools/                            ← standalone utility scripts (transcribe.py, transcribe_bulk.py)
├── Operations/                        ← workspace.md, leads, revenue, checklist,
│                                        pricing-strategy.md, positioning.md
├── Demand/                            ← demand-side content
│   └── social/                       ← daily 9:16 social carousels + generators (the posting hub)
├── platform/                         ← Next.js 16 course-reader app (booklesss.vercel.app)
└── Brand/                            ← raw asset drop zone (logos, hero images)
```

See [`WORKSPACE.md`](../WORKSPACE.md) for the full map, per-folder detail, and the
**"do not move"** rules (lesson build scripts, `_dev/fonts`+`brand`, marketing generators).

### Active Course Anatomy

Each active course has this structure — every lesson is self-contained:

```
[Course]/
├── _course.md          ← course status tracker (the single source of truth)
├── 01-[slug]/          ← one lesson = one Slack channel; folder slug = channel slug
│   ├── steps/          ← built PDFs (Step 1.1.pdf, Step 1.2.pdf)
│   ├── sources/        ← source files + build scripts for those steps
│   └── lesson.md       ← step status + note of any external sources
├── 02-[slug]/ …
├── sources/            ← course-wide sources & build scripts (outlines, study pills)
├── assignments/        ← current-semester assignment briefs
└── past-papers/        ← past exam papers (only TM has these so far)
```

Course-level extras (`sources/`, `assignments/`, `past-papers/`) exist only where a course has that material. Course-wide output PDFs (course outline, study pill) sit at the course root.

If a source (e.g. a textbook) feeds multiple lessons it is copied into each. The lesson folder is the unit of truth — everything needed to understand or rebuild its steps lives inside it. External dependencies are noted in `lesson.md`.

### Pipeline Courses

`Schools/UNZA/_pipeline/` holds 13 UNZA courses (DEM 1110, ECN 1115, ECN 1215, GMS 1035, HRM 1015, IRS 1035, MATH 1110, PAM 1025, POL 1015, PSY, SOC 1110, DEV 1150, ECN 2115) plus a `_video-archive/` of lecture videos. These are raw source material — not yet in Booklesss. When a course is moved into Booklesss it gets the full lesson structure and is promoted from `_pipeline/` to an active folder in the school.

**`_pipeline/` and `_textbooks/` are gitignored and exist only on the owner's machine + OneDrive** — they contain files over GitHub's 100 MB limit. Never add them to git. In a fresh clone these folders are absent; that is expected.

## Architecture

### Content Pipeline
Each lesson step gets one Python script that lives in that lesson's `sources/` folder (naming: `build_[course]_[step]_[slug].py`). The script is both the content and the build tool — all text is written directly into the script, which outputs a PDF to the sibling `steps/` folder. There are no intermediate markdown files. Exception: TM Step 1.1 uses the legacy name `build_lesson_1_1_tm.py`.

Each script resolves paths using `_ROOT` (5 levels up to the Booklesss project root) for fonts and brand assets, and `../steps` relative to its own location for output. This keeps the lesson self-contained: open any `sources/` folder and you have the source material, the build script, and one `python3 build_*.py` away from regenerating the PDF.

Scripts are ~700 lines and follow a fixed structure:
1. Font registration — scripts use Windows fonts vendored in `_dev/fonts/` (Parastoo, Aptos, Parkinsans)
2. Color palette constants (per-course)
3. Page geometry (A4, 2.2cm side margins)
4. ReportLab `ParagraphStyle` definitions
5. Canvas callbacks for cover page and body pages (header/footer on every page)
6. Helper functions: `hairline()`, `section()`, `callout()`, `resources_box()`
7. `build()` function that assembles `story[]` and writes the PDF
8. `if __name__ == "__main__": build()`

### Course Visual Identity
All courses: cream `#FFFDE8` cover, black type (`#121212`), warm rule `#E0DACB`, Parastoo-Bold display. No navy, no green, no amber.

| Course | School | Cover BG | Accent | Display Font |
|--------|--------|----------|--------|--------------|
| Strategic Management | ZCAS | `#FFFDE8` cream | `#DC2626` cardinal red (eyebrows only) | Parastoo-Bold |
| Treasury Management | ZCAS | `#FFFDE8` cream | none — cream + black | Parastoo-Bold |
| Corporate Finance | ZCAS | `#FFFDE8` cream | none — cream + black | Parastoo-Bold |
| Business Administration | UNZA | `#FFFDE8` cream | none — cream + black | Parastoo-Bold |

### PDF Content Structure (All Lessons)
Every PDF follows this sequence: cover → 4–7 content sections → 2 embedded discussion questions → Key Terms table → Learning Outcomes → Community closer. Section headers always use an eyebrow tag (7pt bold ALL CAPS, accent color) above the H2. Body text is 10.5pt, leading 17pt.

### Community CTA Pattern
No hard CTAs. Two discussion questions embedded mid-content. Guide the reader toward the next step by weaving a natural hint into the body at the point where it's relevant — never a labelled "Next:" pointer.

### Step Cross-References
When a step's content references another step (e.g. "Step 2.1"), keep the reference as **plain text** — do not link it to a Slack file URL. Slack assigns a new unpredictable file ID on every upload, so embedded file links go stale immediately (see PROJECT_MEMORY dead end, 2026-06-04). Older scripts may still carry a `STEP_LINKS` dict and `step_ref()` helper — remove them when touching those scripts. External permanent links (NotebookLM) are fine.

### Cover ADDED VALUE Box
Each step cover has an accent-bordered "ADDED VALUE" panel listing companion resources as clickable links (NotebookLM audio overviews, linked steps, etc.). Uses the `resources_box([(label, url), ...])` helper defined in each script.

### Lead Magnets
3–4 page PDF teasers for WhatsApp marketing. File name format: `[Hook Title] - Booklesss.pdf`. Use Zambian companies (Zanaco, Zambeef, ZESCO, First Quantum) and ZMW currency in examples. Check `Operations/pricing-strategy.md` for the current offer before writing any pricing or deadline into a lead magnet.

### Skills (Claude Code Extensions)
Custom skills in `.claude/skills/`. **Three** skills, one per surface — course
content, socials, web:
- **`step-skill`** — everything to do with a step: PLAN (what the lessons and
  steps are), WRITE (the reader `.mjs`, or any branded PDF), IMPROVE (the
  feedback loop). **Read it before writing, editing or regenerating any step** —
  `RULES.md` is the house style and `DEBT.md` says what that step owes; both get
  applied in the same edit. Reactions land in `LOG.md` and, when they generalise,
  are promoted to `RULES.md`. It carries the ENGAGEMENT PASS for a step that is
  correct and still not worth reading. Two reference files load on demand:
  `reference/planning.md` (course architecture) and `reference/pdf.md` (the PDF
  design system). Consolidated 2026-08-01 from the former `lesson-skill` +
  `step-skill` + `step-feedback` — the writing rules and the debt they create are
  one state, and splitting them meant whichever skill got invoked read half of it.
- **`daily-post`** — PUBLISH. The build-in-public social pipeline: read what
  actually shipped from the git log, pick the story, capture the reader's mobile
  layout, render the 9:16 carousels, write the day's `PLAN.md`. Its `RULES.md`
  holds the accumulated framing/copy rules and is where the owner's reactions get
  written back. Output lands in `Demand/social/posts/<week>/<day>/`.
- **`design-system`** — Web/UI only (Framer, landing pages). Not for step work.

### Platform Icons (Next.js)

Most icons in `platform/` come from the **MynaUI** set (by Praveen Juge) via the local `@iconify-json/mynaui` package — no MCP, no network. MynaUI became the system on 2026-07-30 (owner's call): the course cards had worn it since they were built, and the rest of the chrome was moved onto it to match. The old `src/lib/icon.tsx` renderer was removed then and has not come back.

**To use an icon:** `<MynaIcon name="search" />` from `platform/src/components/icons/myna.tsx` — plain name for MynaUI Line, `-solid` for its filled twin (what the sidebars mark the current row with). Optional props: `size`, `strokeWidth`, `className`, `style`. Browse names at [icones.js.org/collection/mynaui](https://icones.js.org/collection/mynaui).

**That module is generated.** Adding an icon = add the name to `ICONS` in `platform/scripts/gen-icons.mjs`, run `npm run gen:icons`, done. Only the paths actually drawn are inlined, which is why it works in client components — importing the 2,650-icon set into one would ship the lot to the browser. Never hand-edit the generated file; unknown names fail the generator loudly rather than rendering nothing.

**Five exceptions, all deliberate:**
- The composer's attachment chips use **Streamline Ultimate Colors (Free)** file-type badges (`reader/file-icons.tsx`) and the course cards use **Streamline Plump** gradient marks (`home/plump-glyphs.tsx`, `home/course-glyphs.tsx`). Both are multicolour on purpose — the colour is what carries the meaning — so they keep their own fills rather than following `currentColor`. CC BY 4.0, attribution still owed (as with MynaUI).
- The twelve **profile pictures** are **Streamline Kameleon Colors (Free)** (owner's pick, 2026-08-01), generated into `platform/src/components/identity/avatars.tsx` (`AVATARS` in `scripts/gen-avatars.mjs` → `npm run gen:avatars`). Each is a finished badge — a full-bleed coloured disc with its subject on it — so nothing is recoloured and nothing needs a shell drawn round it. The set has only four disc colours, so the table's order alternates them. Replaced the Plump avatars, whose two-colour recolour trick doesn't apply here.
- The reader sidebar's **lesson caret** is **Mingcute** (owner's pick, 2026-07-31): `<MingcuteIcon name="down-small-line" />` from `platform/src/components/icons/mingcute.tsx`, generated the same way (`ICONS` in `scripts/gen-mingcute-icons.mjs` → `npm run gen:mingcute`). Mingcute's grid draws a much smaller mark than MynaUI's at the same size and strokes it at 2 rather than 1.5, so anything borrowed from it needs its `size`/`strokeWidth` set against the MynaUI icons beside it. Keep this set narrow — MynaUI is still the system.
- **Solar** (by 480 Design) is on three surfaces: `/workspace` in Solar **Linear**, the dashboard's four **stat cards** in Solar **Duotone** (owner's pick, 2026-08-01), and the reader's **callout kinds** in Solar **Duotone** (owner's pick, 2026-08-02). `<SolarIcon name="chart-2-bold-duotone" />` from `platform/src/components/icons/solar.tsx`, generated like the rest (`ICONS` in `scripts/gen-solar-icons.mjs` → `npm run gen:solar`). A `-bold-duotone` name draws two `currentColor` fills, the back one at `opacity .5`, so the mark shades itself out of whatever hue its tile sets — no second colour to pass. **The standing lesson still holds: Duotone belongs on a tile that gives it its own hue, not in a row of outline chrome.** On 2026-08-02 the reader briefly had three Duotone marks in the checkpoint row (a thumbs pair on the answers, a bubble on the note button) and the owner moved all three back to MynaUI the same day, because Duotone is *filled* and sat heavy beside the hairlines around it. The callout mark is the other case: it sits alone on a container carrying its own hue, which is where the stat tiles put theirs. Adding a fourth surface is a decision, not a convenience.

Everything else monochrome is MynaUI.

### Domain, Link Previews and Sharing (Next.js)

The domain is **`booklesss.app`** (bought 2026-08-02). The brand host is one
constant, `SITE_URL` in `platform/src/lib/site.ts` — changing domain is that
line. **`metadataBase` does not use it**: `layout.tsx` prefers Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`, so previews resolve against whatever the
production host actually is (`booklesss.vercel.app` until the DNS is pointed)
and switch to booklesss.app on the next deploy after the domain is added in
Vercel. Nothing to edit when that happens.

**Every page emits the four tags WhatsApp reads** — `og:title`,
`og:description`, `og:url`, `og:image` — plus a canonical and a Twitter card.
Pages build theirs with `openGraph()` from `lib/site.ts`, and they must:
Next **replaces** a parent's `openGraph` wholesale rather than merging, so a
page setting one field by hand silently drops siteName, type and locale.

**Preview cards** are generated at build, one PNG per course and per step, from
one template in `lib/og.tsx` — 1200×630. They come from a **route handler**,
`app/og/[...slug]/route.tsx`, not the `opengraph-image.tsx` file convention:
Next refuses any file after a catch-all, and the reader is `(reader)/[...slug]`.
Constraints the card is built to, from Meta's own docs: under **600KB**
(WhatsApp drops it silently above that — ours are ~115KB), ≥300px wide, ratio
no narrower than 4:1, `<head>` inside the first 300KB, description shown to ~80
characters. No SVG. A new course gets a correct card with no design work.

**The card wears the social posters' look** (owner's call, 2026-08-03), so a
link preview and a carousel slide are recognisably the same object: the brand
gradient off `prog-post.mjs`, the **"Bklsss" wordmark with no glyph**, a purple
eyebrow, a Familjen Grotesk title and a Satoshi subtitle. Un-boxed — the white
panel inside a grey canvas is gone, because WhatsApp draws its own bubble round
the image and a bordered card inside that is a card inside a card. The wordmark
is suppressed on `/og/home.png` alone, where the title is already the name.

**Familjen Grotesk had to be vendored to get here.** `next/font/google` serves
it as woff2 and Satori reads only ttf/otf/woff, so `platform/assets/FamiljenGrotesk-Medium.ttf`
is the latin subset the app already ships, **instanced at wght 500** with
fontTools and re-flavoured to a plain TTF (the exact command is in `lib/og.tsx`).
Instanced rather than handed over as a variable font: Satori does not reliably
apply a `wght` axis, so a variable file renders at its default 400 whatever the
CSS asks for.

**Sharing** is one control in the header — `ShareControl.tsx`, where a dead
"Feedback" button used to be. It shares whatever page you are on (dashboard →
the app, course page → that course, step → that step; resolved by
`lib/share-target.ts`), opening the native share sheet on a phone and copying
the link where there isn't one. Do not add a second share button to a page
surface: the owner's rule (2026-08-02) is that there is exactly one place in
the app where sharing can be got wrong.

**Referral codes are deferred, not forgotten.** They wait for Clerk, so a
referral can point at a person rather than a device. Format is decided —
`?r=deeky-7fq` — and the seam is documented in `shareUrl()`.

### Platform Fonts (Next.js)

Four faces, all self-hosted from `_dev/fonts/` and subset by `python3 scripts/subset-fonts.py` (run it after any content change that could add a character — it derives the kept set from `course-data.json`):

| Variable | Face | Where |
|---|---|---|
| `--font-sans` / `font-sans` | **Inter** | App chrome: header, sidebars, dashboard, settings |
| `--font-display` / `font-display` | **Familjen Grotesk** | Headings, step titles, formulas |
| `--font-content` / `font-content` | **Aptos** | **The reading** inside a step: prose, list items, table cells |
| `--font-container` / `font-container` | **Satoshi** | **The containers** inside a step: callouts and cards (label *and* body), source chips, the tap-to-define popup, the section-note menu, table column headings |

**The `content` / `container` split is the owner's rule (2026-08-02)** and it is by *job*, not by element: a sentence someone reads is Aptos, and chrome that frames or annotates a sentence is Satoshi. The whole reading face was briefly swapped to Satoshi and that was too far. Satoshi is Fontshare / Indian Type Foundry (ITF Free Font Licence) and is on no device by default, which is why it is vendored rather than linked.

**Callouts and cards are containers, all the way through** — owner's call, same day, settling the question that was left open when the split first landed. Only their labels were Satoshi and their bodies stayed Aptos, on the reasoning that a callout *holds* a sentence rather than framing one. The owner's reaction on seeing it live: *"in the containers with key point and that you've moved the font back to Aptos, keep it as Satoshi Medium."* **A box lifted off the page to be remembered is not the reading**, and setting it in the reading face made it read as one more paragraph that happened to have a border. Card titles keep `font-semibold`, everything else in a container is `font-container font-medium`.

**Container surfaces set `font-medium` (500)** — owner's call, same day. Satoshi ships a real 500 here, so it is not a synthesised weight, and at chip and popup size the regular sat too light beside the Aptos it annotates. Pair it as `font-container font-medium`. The one exception is a table's column heading, which stays `font-semibold` because it is a heading, not body.

Everything else monochrome is MynaUI.

**Never** hardcode Framer CDN URLs for icons — always inline SVG so icons respond to `color` CSS.

### Transcription
`tools/transcribe.py` uses OpenAI Whisper (`small.en` model). Outputs `[video-name]_transcript.md` alongside the source video. Skips files already transcribed. Source video collection is in `Schools/UNZA/_pipeline/_video-archive/` (ECO 155 macroeconomics, MIT 14.01SC microeconomics).

## Project Tracking (Linear)

This project's Linear workspace is **Booklesss** (team: `Booklesss`, team id `3e290b53-b6cc-4f93-8ad4-03c0fc04a4c1`), reached via the **`linear-server`** MCP connection (tools prefixed `mcp__linear-server__*`).

**Do not use `mcp__claude_ai_Linear__*`** (the "claude.ai Linear" connector) for any Booklesss work — that connector is authorized to a different, unrelated Linear workspace (Khadzika, an industrial/mining tools business). If both tool sets are ever present in the same session, `linear-server` is the one scoped to this project.

This matters for the `wrap-session` skill (global, shared across projects): when it checks "is Linear configured for this project," the answer for Booklesss is specifically `linear-server`, not any other Linear connector that happens to be connected.

**Where `linear-server` comes from, per session type:**
- **Local (owner's Windows machine):** configured in `~/.claude.json` with a stored OAuth token, under BOTH project-key casings `C:/…/Booklesss` and `c:/…/Booklesss` (see PROJECT_MEMORY session 12 — sessions resolving the lowercase path land on a separate config entry).
- **Cloud/remote sessions:** comes from this repo's `.mcp.json` (`https://mcp.linear.app/mcp`). It needs a one-time OAuth authorization per user — until then the session lists it as "requires authentication" and the tools don't load. When authorizing, pick the **Booklesss** workspace in Linear's consent screen, not Khadzika.
- The sandbox in cloud sessions **cannot** reach `mcp.linear.app`/`api.linear.app` directly (egress proxy blocks them), so raw curl/JSON-RPC fallbacks only work on the local machine. If tools are absent and unauthorized, say so — don't fall back to `mcp__Linear__*` (Khadzika).

## Key Reference Files

| File | Purpose |
|------|---------|
| `README.md` | Owner's map: business state, money model, action queue |
| `Operations/workspace.md` | Slack workspace config, channel names, invite links |
| `Schools/[School]/[Course]/_course.md` | Step status tracker for each course |
| `Schools/[School]/[Course]/[lesson]/lesson.md` | Per-lesson step status and source notes |
| `Operations/daily-checklist.md` | Operational cadence and content status tracker |
| `Operations/leads.md` | WhatsApp lead tracking |
| `Operations/revenue-log.md` | Student conversions and revenue |
| `Operations/groups.md` | WhatsApp group marketing stats |
| `Operations/pricing-strategy.md` | Pricing tiers, unit economics, cost structure |

## Writing Style Rules (Enforced in All Content)

Banned words: "tapestry", "nuance", "multifaceted", "robust", "delve", "foster", "Furthermore", "It's worth noting", "landscape", "journey", "empower", "leverage" (as verb), "game-changer", "seamless", "holistic", "synergy". All examples use ZMW (Zambian kwacha) and local companies.
