# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Booklesss** is a Slack-based edtech platform delivering branded PDF study materials for Zambian university finance/business courses. The core pipeline: source material (PPTX/PDF) → Python ReportLab script → PDF → posted to Slack channels. No web framework, no database — just Python scripts and structured content.

**Active courses:** Strategic Management, Treasury Management (BBF4302), Corporate Finance (BAC4301 — all 10 PDFs written, but Slack channels not yet created; do not post CF content until channels exist)
**Platform:** Slack workspace `bookless10.slack.com` | Website: `booklesss.framer.ai`
**Founding rate deadline:** April 18, 2026 — mention in any marketing content

## Commands

**Generate a PDF:**
```bash
python3 _dev/scripts/build_[course]_[step]_[slug].py
```

**Transcribe a video lecture:**
```bash
python3 _dev/scripts/transcribe.py "path/to/video.mp4"
```

**Bulk-transcribe a folder of videos:**
```bash
python3 _dev/scripts/transcribe_bulk.py "path/to/folder/"
```

No build system, no tests, no linter. Scripts are self-contained.

## Architecture

### Content Pipeline
Each lesson step gets one Python script in `_dev/scripts/` (naming: `build_[course]_[step]_[slug].py`). The script is both the content and the build tool — all text is written directly into the script, which outputs a PDF to `courses/[Course]/content/[lesson-folder]/`. There are no intermediate markdown files. Exception: TM Step 1.1 uses the legacy name `build_lesson_1_1_tm.py`.

Scripts are ~700 lines and follow a fixed structure:
1. Font registration — scripts use Linux paths (`/usr/share/fonts/truetype/dejavu` for DejaVuSerif, `/usr/share/fonts/truetype/liberation` for LiberationSans). These fonts must be installed on the build machine.
2. Color palette constants (per-course)
3. Page geometry (A4, 2.2cm side margins)
4. ReportLab `ParagraphStyle` definitions
5. Canvas callbacks for cover page and body pages (header/footer on every page)
6. Helper functions: `hairline()`, `section()`, `callout()`, `channel_button()`
7. `build()` function that assembles `story[]` and writes the PDF
8. `if __name__ == "__main__": build()`

### Course Visual Identity
Each course has a distinct color system — do not mix them:

| Course | Cover BG | Accent | Display Font |
|--------|----------|--------|--------------|
| Strategic Management | `#0F1F35` slate-navy | `#DC2626` cardinal red | Georgia Bold |
| Treasury Management | `#0B1D3A` deep navy | `#10B981` emerald | Georgia Bold |
| Corporate Finance | `#1A1200` deep espresso | `#C9A020` gold | Arial Black |

### PDF Content Structure (All Lessons)
Every PDF follows this sequence: cover → 4–7 content sections → 2 embedded discussion questions → Key Terms table → Learning Outcomes → Community closer. Section headers always use an eyebrow tag (7pt bold ALL CAPS, accent color) above the H2. Body text is 10.5pt, leading 17pt.

### Community CTA Pattern
Never hard CTAs. Two discussion questions mid-content (italic, light green left-bar callout box). Community closer at the end: 2 soft paragraphs naming the Slack channel, with the permanent invite link `https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg` as anchor text ("join the group here").

### Lead Magnets
3–4 page PDF teasers for WhatsApp marketing. Saved in `courses/[Course]/content/[lesson-folder]/lead-magnets/`. File name format: `[Hook Title] - Booklesss.pdf`. Use Zambian companies (Zanaco, Zambeef, ZESCO, First Quantum) and ZMW currency in examples. Include founding rate deadline in 2+ places.

### Skills (Claude Code Extensions)
Three custom skills in `.claude/skills/`:
- **`booklesss-write`** — Full content pipeline: reads source → writes script → runs it. Always invoke this for writing new lesson steps, not the pdf skill directly.
- **`booklesss-pdf`** — PDF generation details (colors, typography, callout specs). Used by booklesss-write.
- **`design-system`** — Web/UI only (Framer, landing pages). Not for PDF work.

### Transcription
`_dev/scripts/transcribe.py` uses OpenAI Whisper (`small.en` model). Outputs `[video-name]_transcript.md` alongside the source video. Skips files already transcribed. Source video collection is in `Unza fom Titsa/` (ECO 155 macroeconomics, MIT 14.01SC microeconomics).

## Key Reference Files

| File | Purpose |
|------|---------|
| `operations/workspace.md` | Slack workspace config, channel names, invite links |
| `courses/[Course]/_course.md` | Step status tracker for each course |
| `operations/daily-checklist.md` | Operational cadence and content status tracker |
| `operations/leads.md` | WhatsApp lead tracking |
| `operations/revenue-log.md` | Student conversions and revenue |
| `operations/groups.md` | WhatsApp group marketing stats |
| `Finances/pricing-strategy.md` | Founding rate, deadlines, cost structure |

## Writing Style Rules (Enforced in All Content)

Banned words: "tapestry", "nuance", "multifaceted", "robust", "delve", "foster", "Furthermore", "It's worth noting", "landscape", "journey", "empower", "leverage" (as verb), "game-changer", "seamless", "holistic", "synergy". All examples use ZMW (Zambian kwacha) and local companies.
