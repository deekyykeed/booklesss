---
name: booklesss-pdf
description: >
  Generates branded Booklesss PDF documents — lesson notes and lead magnets.
  Use this skill whenever the user wants to create, generate, or export a PDF
  for Booklesss. Trigger on: "write the PDF", "generate the lesson PDF",
  "create a lead magnet", "make the PDF for lesson X", "export to PDF",
  "marketing PDF", "WhatsApp doc". Two document types: lesson (full lesson
  notes as a polished study document) and lead-magnet (3–4 page teaser for
  WhatsApp marketing with CTA). Every PDF gets the Booklesss footer, amber
  accent, cross-references to related docs, and a unique tracking link slot.
  Always generate by running the Python script via Bash — do not use a library
  that requires a GUI. Save lesson PDFs alongside the .md file. Save lead
  magnets to marketing/lead-magnets/.
---

# booklesss-pdf

Generate a branded Booklesss PDF document.

---

## Two document types

### lesson
A full study notes PDF based on the lesson .md file. 8–10 pages. Given to paying students inside Slack. Not for public distribution.

### lead-magnet
A 3–4 page teaser PDF for WhatsApp marketing. Gives real value but leaves the student wanting more. Has a strong CTA (join Booklesss, founding member rate, deadline). Use unique tracking links per group.

---

## Brand standards (never deviate)

| Element | Value |
|---------|-------|
| Background | `#F5F0E8` cream |
| Navy | `#1B2A4A` |
| Amber | `#C17E3A` |
| Teal | `#0E6B6B` |
| Body text | `#2C2C2C` |
| Cover title font | **Arial Black** (`ariblk.ttf`) |
| Section heading font | **Segoe UI Black** (`seguibl.ttf`) |
| Body / all other text | **Calibri** (all weights) |
| Page size | A4 |
| Margins | 2.5cm all sides |

### Footer — on every page, every document
```
Left:  Booklesss | booklesss.framer.ai
Right: Page N
Centre: [course code] — [lesson title]
```
A 1pt amber line above the footer text on every page.

### Header — on every page except the cover
```
Left:  [document title short form]
Right: [date or version e.g. v1 · March 2026]
A 1pt amber line below.
```

---

## Font registration (always include all three families)

```python
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Calibri",        F + r"\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold",   F + r"\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Italic", F + r"\calibrii.ttf"))
pdfmetrics.registerFontFamily(
    "Calibri", normal="Calibri", bold="Calibri-Bold",
    italic="Calibri-Italic", boldItalic="Calibri-Bold")
pdfmetrics.registerFont(TTFont("ArialBlack",   F + r"\ariblk.ttf"))
pdfmetrics.registerFont(TTFont("SegoeUIBlack", F + r"\seguibl.ttf"))
```

---

## Cross-reference block (every document)

Every document — lesson or lead magnet — ends with a cross-reference box pointing to related content. This creates an interconnected web: every PDF the student reads leads them to the next one.

**Format:**
```
┌─────────────────────────────────────────────────────┐
│  Also in this series                                │
│  → 1.2 Working Capital & Liquidity Management       │
│  → 1.3 Inventory Management, EOQ & Creditor Mgmt   │
│  Full course available at booklesss20.slack.com     │
└─────────────────────────────────────────────────────┘
```

**Rules:**
- List the 2–3 most relevant neighbouring steps
- Always end with `Full course available at booklesss20.slack.com`
- In lead magnets: the cross-reference doubles as a secondary CTA — "there's more"
- Before generating, check `operations/daily-checklist.md` (Content Status Tracker) to know which steps exist so you can link real titles

---

## Deadline awareness

**Current founding member deadline: April 18, 2026.**
Check `finance/pricing-strategy.md` for the current deadline before generating any lead magnet.

Every lead magnet must mention the deadline in **at least two places**:
1. On the cover (small but visible — below the subtitle)
2. On the content pages — an amber-bordered nudge box before the CTA page
3. Prominently on the CTA page itself

If the deadline has passed, remove founding rate language and use standard rate (K800/month).

---

## Tracking links (lead magnets only)

The CTA in every lead magnet has a slot for a unique tracking URL.
When generating, ask: "Which WhatsApp group is this for? I'll add a unique tracking link."
Format: `https://bit.ly/booklesss-[group-slug]`
Log each link in `marketing/groups.md`.

---

## Humanizer pass (required for lead magnets)

All lead magnet body copy must be humanized before the PDF is generated:
- Run every body paragraph through `/humanizer` mentally or explicitly
- Watch for: em dashes, "it's worth noting", "furthermore", rule-of-three, passive voice stacking
- Tone: direct, student-to-student. Like a classmate who studied harder than you sharing their notes
- No corporate language. No filler. Every sentence earns its place.

Lesson PDFs are less strict — they're internal study docs — but still avoid obvious AI patterns in explanatory text.

---

## File naming

| Type | Path | Filename |
|------|------|----------|
| Lesson PDF | `courses/[Course]/lesson-0N-[name]/notes/` | `[L]_[S]_[slug]_v1.pdf` |
| Lead magnet | `marketing/lead-magnets/` | `[slug]-lead-magnet_v1.pdf` |

Increment version number (v2, v3) when content changes. Never overwrite v1.

---

## How to generate

1. Read the source .md file (lesson type) or draft content from scratch (lead magnet)
2. Humanize all body copy before writing the script
3. Write a Python script using ReportLab
4. Run via Bash: `python3 [script_path]`
5. Confirm the output path to the user
6. Update the cross-references in related documents if any new steps were added

### Python stack
```python
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak, NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
```

---

## Lesson PDF structure

1. **Cover** — course code, lesson title in ArialBlack, Booklesss branding, amber strip
2. **One section per `##` heading** — SegoeUIBlack section title, body in Calibri, formulas in teal box, tables as needed
3. **Key Terms** — two-column amber-bordered table
4. **Learning Outcomes** — numbered list
5. **See Also** — cross-reference box with links to related steps
6. **Back strip** — navy bar, website URL, founding member CTA (check deadline)

---

## Lead Magnet PDF structure

1. **Cover (navy)** — ArialBlack title, "FREE GUIDE" tag, subtitle, founding rate + deadline nudge in amber text
2. **Content pages (cream)** — 2–3 real, useful concepts. Each: SegoeUIBlack heading, amber rule, explanation, worked ZMW example in amber box
3. **Deadline nudge box** — amber-bordered, before the final page break: "These X concepts are from Step Y of Z. Full course inside Booklesss. K550/month, closes [date]."
4. **CTA page (teal)** — SegoeUIBlack headline, what's inside bullet list, founding offer box (amber), Slack link, bit.ly tracking link

---

## Writing rules (lead magnets)

- Hook title: specific + exam-focused. "3 Treasury Management Concepts That Will Show Up in Your Exam" beats "Introduction to Treasury Management"
- Worked examples: always ZMW, always Zambian companies (Zambeef, Zanaco, ZESCO, First Quantum, Mutengo)
- Tone: direct, confident, peer-to-peer. Like a classmate who knows this cold.
- CTA copy must include: K550 founding rate, the exact deadline date, what they get (all lessons + quizzes + leaderboard)
- Never give away the full lesson — tease 2–3 concepts, leave the rest for inside Booklesss
- Deadline in at least 2 places: cover + deadline nudge box
