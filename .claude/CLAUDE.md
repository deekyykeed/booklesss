# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Booklesss** is a Slack-based edtech platform delivering branded PDF study materials for Zambian university finance/business courses. The core pipeline: source material (PPTX/PDF) → Python ReportLab script → PDF → posted to Slack channels. No web framework, no database — just Python scripts and structured content.

**Active courses:** Strategic Management (ZCAS), Treasury Management BBF4302 (ZCAS), Corporate Finance BAC4301 (ZCAS — channels not yet created; do not post until channels exist), BBA 1110 (UNZA)
**Platform:** Slack — **workspace situation unresolved** (three workspaces exist; the public invite link points to `bookless10`, whose Pro trial has expired, but SM PDFs were uploaded to `booklesss20` — see the warning at the top of `Operations/workspace.md`). Confirm the target workspace with the owner before posting content or writing the invite link into anything. | Website: `booklesss.framer.ai`
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
Three custom skills in `.claude/skills/`, one per phase of the pipeline:
- **`lesson-skill`** — PLAN. Course architecture: takes a course's raw source, groups topics into lessons by mental frame (lesson = one Slack channel = noise isolation), sets steps-per-lesson by source depth, and emits `_course.md`, the folder scaffold, the channel map, and the course outline PDF. Runs before any writing.
- **`step-skill`** — WRITE + DESIGN. The PDF design system (colors, typography, callout specs) *and* the lesson-writing process (source → ReportLab script → PDF). Invoke for all PDF content — lesson steps, lead magnets, business documents. (Absorbed the former `booklesss-write` skill.)
- **`design-system`** — Web/UI only (Framer, landing pages). Not for PDF work.

### Platform Icons (Next.js)

All icons in `platform/` come from the **Solar** set (by 480 Design) via the local `@iconify-json/solar` package — no MCP, no network. The `Icon` component in `platform/src/lib/icon.tsx` resolves the icon data at render time on the server and inlines the SVG (zero client JS).

**To use an icon:** `<Icon name="magnifer-linear" />` — suffix `-linear` for Solar Line, `-bold` for Solar Bold. Optional props: `size`, `strokeWidth`, `className`, `style`. Unknown names warn in dev and render nothing. Browse names at [icones.js.org/collection/solar](https://icones.js.org/collection/solar).

The old Streamline-MCP workflow (`solar.tsx` with hand-inlined SVGs) belonged to the previous platform app, deleted 2026-07-24 — recoverable from git history before that date if ever needed.

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
