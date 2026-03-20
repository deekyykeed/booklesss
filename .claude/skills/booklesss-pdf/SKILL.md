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
| Font | Calibri (all weights) |
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

## Cross-reference block
Every document ends with a "See Also" section listing related Booklesss documents. Format:

```
┌─────────────────────────────────────────────────────┐
│  Also in this series                                │
│  → 1.2 Working Capital & Liquidity Management       │
│  → 1.3 Inventory Management, EOQ & Creditor Mgmt   │
│  Full course available at booklesss20.slack.com     │
└─────────────────────────────────────────────────────┘
```

---

## Tracking links (lead magnets only)
The CTA button in every lead magnet has a slot for a unique tracking URL.
When generating, prompt the user: "Which WhatsApp group is this for? I'll add a unique tracking link."
Format: `https://bit.ly/booklesss-[group-slug]`
Log each link in `marketing/groups.md`.

---

## File naming

| Type | Path | Filename |
|------|------|----------|
| Lesson PDF | `[Course]\lesson-0N-[name]\notes\` | `[L]_[S]_[slug]_v1.pdf` |
| Lead magnet | `marketing\lead-magnets\` | `[slug]-lead-magnet_v1.pdf` |

Increment version number (v2, v3) when content changes. Never overwrite v1.

---

## How to generate

1. Read the source .md file (for lesson type) or build content from scratch (lead magnet)
2. Write a Python script using ReportLab + Pillow
3. Run it via Bash: `python3 [script_path]`
4. Confirm the output path to the user
5. Update the cross-references in related documents if needed

### Python stack
```python
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics import renderPDF
from PIL import Image, ImageDraw
import io
```

Font registration (always include):
```python
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Calibri",        F + r"\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold",   F + r"\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Italic", F + r"\calibrii.ttf"))
```

---

## Lesson PDF structure

1. **Cover card** — course code, lesson title, Booklesss logo area, amber strip top/bottom
2. **One section per card from the .md file** — each `##` heading becomes a new section with a navy heading, body text, and any formulas or tables
3. **Key Terms** — two-column table
4. **Learning Outcomes** — numbered list
5. **See Also** — cross-reference box with links to related lessons
6. **Back cover strip** — navy bar, website URL, founding member CTA if pre-April 12

---

## Lead Magnet PDF structure

1. **Cover** — bold hook title, course, Booklesss brand, "Free Guide"
2. **Intro** — 1 paragraph: who this is for, what they'll get
3. **Content sections (2–3)** — real, useful concepts. Each has: heading, explanation, one worked example using ZMW
4. **The gap** — a section that says "there's more" without giving it away. E.g. "There are 8 more lessons covering [topics]..."
5. **CTA page** — founding member offer, deadline, Slack link, bit.ly tracking link as a button

---

## Writing rules (lead magnets)

- Hook title: specific + exam-focused. "3 Treasury Management Concepts That Will Show Up in Your Exam" beats "Introduction to Treasury Management"
- Worked examples always in ZMW, always Zambian companies
- Tone: direct, student-to-student, no corporate fluff. Run through /humanizer before final output
- CTA copy must include: founding member rate (K550), deadline (April 12), what they get (all 11 lessons, quizzes, leaderboard)
- Never give away the full lesson — tease 2–3 concepts, leave the rest for inside Booklesss
