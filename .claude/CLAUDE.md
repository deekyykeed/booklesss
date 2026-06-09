# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Booklesss** is a Slack-based edtech platform delivering branded PDF study materials for Zambian university finance/business courses. The core pipeline: source material (PPTX/PDF) → Python ReportLab script → PDF → posted to Slack channels. No web framework, no database — just Python scripts and structured content.

**Active courses:** Strategic Management (ZCAS), Treasury Management BBF4302 (ZCAS), Corporate Finance BAC4301 (ZCAS — channels not yet created; do not post until channels exist), BBA 1110 (UNZA)
**Platform:** Slack workspace `bookless10.slack.com` | Website: `booklesss.framer.ai`
**Founding rate deadline:** April 18, 2026 — mention in any marketing content

## Commands

**Generate a PDF:**
```bash
python3 "schools/[School]/[Course]/[lesson]/sources/build_[course]_[step]_[slug].py"
```

**Transcribe a video lecture:**
```bash
python3 _dev/transcribe.py "path/to/video.mp4"
```

**Bulk-transcribe a folder of videos:**
```bash
python3 _dev/transcribe_bulk.py "path/to/folder/"
```

No build system, no tests, no linter. Scripts are self-contained.

## Folder Structure

```
Booklesss/
├── Schools/
│   ├── ZCAS/                          ← Zambia Centre for Accountancy Studies
│   │   ├── Strategic Management/
│   │   ├── Treasury Management/
│   │   ├── Corporate Finance/
│   │   └── _pipeline/                 ← future ZCAS courses (currently empty)
│   └── UNZA/                          ← University of Zambia
│       ├── BBA 1110 — Business Administration/
│       └── _pipeline/                 ← 13 raw UNZA courses not yet in Booklesss
│
├── _dev/
│   ├── brand/                         ← logo, mark, grain.png
│   ├── fonts/                         ← Parastoo, Aptos, Parkinsans
│   └── tmp/                           ← scratch previews and text extracts
│
├── Operations/                        ← workspace.md, leads, revenue, checklist,
│                                        pricing-strategy.md, positioning.md
├── Demand/                            ← demand-side: marketing, leads, outreach
├── Brand/                             ← web/marketing assets (hero images etc.)
├── PROJECT_MEMORY.md
└── Thoughts.txt
```

### Active Course Anatomy

Each active course has this structure — every lesson is self-contained:

```
Strategic Management/
├── 01-foundations/
│   ├── steps/          ← built PDFs (Step 1.1.pdf, Step 1.2.pdf)
│   ├── sources/        ← source files used to write those steps
│   └── lesson.md       ← step status + note of any external sources
├── 02-environment/
├── 03-strategy/
├── past-papers/
└── _course.md
```

If a source (e.g. a textbook) feeds multiple lessons it is copied into each. The lesson folder is the unit of truth — everything needed to understand or rebuild its steps lives inside it. External dependencies are noted in `lesson.md`.

### Pipeline Courses

`schools/UNZA/_pipeline/` holds 13 UNZA courses (DEM 1110, ECN 1115, ECN 1215, GMS 1035, HRM 1015, IRS 1035, MATH 1110, PAM 1025, POL 1015, PSY, SOC 1110, DEV 1150, ECN 2115) plus a `_video-archive/` of lecture videos. These are raw source material — not yet in Booklesss. When a course is moved into Booklesss it gets the full lesson structure and is promoted from `_pipeline/` to an active folder in the school.

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
Each course has a distinct color system — do not mix them:

| Course | School | Cover BG | Accent | Display Font |
|--------|--------|----------|--------|--------------|
| Strategic Management | ZCAS | `#0F1F35` slate-navy | `#DC2626` cardinal red | Parastoo-Bold |
| Treasury Management | ZCAS | `#0B1D3A` deep navy | `#10B981` emerald | Parastoo-Bold |
| Corporate Finance | ZCAS | `#FFFEF2` cream | `#2FB99A` jade | Parastoo-Bold |
| Business Administration | UNZA | `#1C2526` dark slate-charcoal | `#F59E0B` amber gold | Parastoo-Bold |

### PDF Content Structure (All Lessons)
Every PDF follows this sequence: cover → 4–7 content sections → 2 embedded discussion questions → Key Terms table → Learning Outcomes → Community closer. Section headers always use an eyebrow tag (7pt bold ALL CAPS, accent color) above the H2. Body text is 10.5pt, leading 17pt.

### Community CTA Pattern
No hard CTAs. Two discussion questions embedded mid-content. Guide the reader toward the next step by weaving a natural hint into the body at the point where it's relevant — never a labelled "Next:" pointer.

### Clickable Step Cross-References
When a step's content references another step (e.g. "Step 2.1"), link it to that step's Slack file URL. Each build script holds a `STEP_LINKS` dict and a `step_ref()` helper. Known Slack file links are tracked in `operations/workspace.md`.

### Cover ADDED VALUE Box
Each step cover has an accent-bordered "ADDED VALUE" panel listing companion resources as clickable links (NotebookLM audio overviews, linked steps, etc.). Uses the `resources_box([(label, url), ...])` helper defined in each script.

### Lead Magnets
3–4 page PDF teasers for WhatsApp marketing. File name format: `[Hook Title] - Booklesss.pdf`. Use Zambian companies (Zanaco, Zambeef, ZESCO, First Quantum) and ZMW currency in examples. Include founding rate deadline in 2+ places.

### Skills (Claude Code Extensions)
Three custom skills in `.claude/skills/`, one per phase of the pipeline:
- **`lesson-skill`** — PLAN. Course architecture: takes a course's raw source, groups topics into lessons by mental frame (lesson = one Slack channel = noise isolation), sets steps-per-lesson by source depth, and emits `_course.md`, the folder scaffold, the channel map, and the course outline PDF. Runs before any writing.
- **`step-skill`** — WRITE + DESIGN. The PDF design system (colors, typography, callout specs) *and* the lesson-writing process (source → ReportLab script → PDF). Invoke for all PDF content — lesson steps, lead magnets, business documents. (Absorbed the former `booklesss-write` skill.)
- **`design-system`** — Web/UI only (Framer, landing pages). Not for PDF work.

### Transcription
`_dev/transcribe.py` uses OpenAI Whisper (`small.en` model). Outputs `[video-name]_transcript.md` alongside the source video. Skips files already transcribed. Source video collection is in `schools/UNZA/_pipeline/_video-archive/` (ECO 155 macroeconomics, MIT 14.01SC microeconomics).

## Key Reference Files

| File | Purpose |
|------|---------|
| `operations/workspace.md` | Slack workspace config, channel names, invite links |
| `schools/[School]/[Course]/_course.md` | Step status tracker for each course |
| `schools/[School]/[Course]/[lesson]/lesson.md` | Per-lesson step status and source notes |
| `operations/daily-checklist.md` | Operational cadence and content status tracker |
| `operations/leads.md` | WhatsApp lead tracking |
| `operations/revenue-log.md` | Student conversions and revenue |
| `operations/groups.md` | WhatsApp group marketing stats |
| `operations/pricing-strategy.md` | Founding rate, deadlines, cost structure |

## Writing Style Rules (Enforced in All Content)

Banned words: "tapestry", "nuance", "multifaceted", "robust", "delve", "foster", "Furthermore", "It's worth noting", "landscape", "journey", "empower", "leverage" (as verb), "game-changer", "seamless", "holistic", "synergy". All examples use ZMW (Zambian kwacha) and local companies.
