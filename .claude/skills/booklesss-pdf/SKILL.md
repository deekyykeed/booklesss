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
  that requires a GUI. Save all PDFs — lessons and lead magnets — inside the
  lesson folder they belong to: courses/[Course]/content/[lesson-folder]/
---

# booklesss-pdf

Generate a branded Booklesss PDF document.

---

## Per-course visual identity

Each course has a distinct palette, font pairing, and personality. Never mix styles across courses. When generating a PDF, check which course it belongs to and apply the correct system below.

---

### Treasury Management — BBF4302

| Element | Value |
|---------|-------|
| Cover bg | `#0B1D3A` deep navy |
| Accent | `#10B981` emerald |
| Grid lines (cover/CTA) | `#132646` navy-toned |
| Display font | Georgia Bold (serif — gravitas) |
| Body font | Trebuchet MS |
| Callout note bg | `#ECFDF5` emerald-50 |
| Result/highlight | `#065F46` dark emerald |
| **Feel** | Premium treasury report. Serious money. |

Reference script: `_dev/scripts/build_tm_lead_magnet_v4.py`

---

### Corporate Finance — BAC4301

| Element | Value |
|---------|-------|
| Cover bg | `#1A1200` deep espresso |
| Accent | `#C9A020` gold |
| Display font | Arial Black (bold modern corporate) |
| Body font | Calibri |
| Callout note bg | `#FEF9E7` gold-tinted cream |
| Result/highlight | `#7A5C00` dark gold |
| **Feel** | Investment banking. Deal analysis. IBD aesthetic. |

---

### Strategic Management

| Element | Value |
|---------|-------|
| Cover bg | `#0F1F35` slate-navy |
| Accent | `#DC2626` cardinal red |
| Display font | Georgia Bold (editorial authority) |
| Body font | Calibri |
| Callout note bg | `#FEF2F2` red-tinted cream |
| Result/highlight | `#991B1B` dark red |
| **Feel** | Management consulting. Direction and urgency. |

---

**Rule:** body pages are always white `#FFFFFF` regardless of course. Only cover and CTA pages use the dark cover bg. The accent colour runs through eyebrow tags, hairlines, left-bar boxes, and result lines — never the body text.

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
| Navy | `#1B2A4A` — cover + strong emphasis ONLY |
| Amber | `#C17E3A` — single accent, used sparingly |
| Teal | `#0E6B6B` — secondary accent |
| Primary text | `#18181B` — zinc-950, never pure black |
| Secondary text | `#71717A` — steel, for subheadings + labels |
| Tertiary / meta | `#94A3B8` — muted slate, for metadata + captions |
| Cover title font | **Arial Black** (`ariblk.ttf`) |
| Section heading font | **Calibri Bold** (`calibrib.ttf`) |
| Body / all other text | **Calibri** (all weights) |
| Page size | A4 |
| Margins | 2cm sides, 1.8cm top/bottom |

---

## Design taste standard (applied to every PDF)

These principles are extracted from the taste/minimalist/high-end design skills and translated for print. Apply them every time a PDF is generated.

### Typography hierarchy

Every section heading must be preceded by an **eyebrow tag** — a small label in amber ALL CAPS that tells the reader where they are before the heading lands.

```
CONCEPT 01                    ← 7pt Calibri Bold, #C17E3A, ALL CAPS, spacious
The Cash Conversion Cycle     ← 16pt Calibri Bold, #18181B, tight leading
```

Full hierarchy (size, weight, color):
| Level | Size | Weight | Color | Use |
|-------|------|--------|-------|-----|
| Eyebrow tag | 7pt | Bold | `#C17E3A` | Before every H2 |
| H2 (section) | 16pt | Bold | `#18181B` | Section title |
| H3 (sub-section) | 12pt | Bold | `#71717A` | Sub-heading |
| Body | 10.5pt | Regular | `#18181B` | All body text |
| Caption / meta | 8pt | Regular | `#94A3B8` | Footnotes, labels, metadata |

Leading (line height): 1.65× for body (= 17.3pt at 10.5pt). Never cramped.

### Color discipline
- Max ONE accent color per element — amber for headings/rules, teal for secondary callouts, navy for cover only
- Body text is always `#18181B` — never pure navy, never pure black
- Secondary labels and subheadings in `#71717A` (steel), not ink-black
- Saturate nothing above 80%

### Callout box backgrounds (muted pastels — not heavy fills)
Replace heavy navy/teal background boxes with light, editorial pastel backgrounds:

| Type | Background | Border | Text |
|------|-----------|--------|------|
| Warning / Caution | `#FBF3DB` pale yellow | 0.5pt `#956400` | `#956400` |
| Info / Note | `#E1F3FE` pale blue | 0.5pt `#1F6C9F` | `#1F6C9F` |
| Success / Formula | `#EDF3EC` pale green | 0.5pt `#346538` | `#346538` |
| Worked example | `#F5F0E8` cream + amber left bar | 2pt amber left only | `#18181B` |
| CTA / Deadline | `#1B2A4A` navy | none | `#FFFFFF` |

### Rules and dividers
- Section dividers: **0.5pt amber hairline** — not 2–3pt thick bars
- Table borders: **0.5pt** `rgba(0,0,0,0.12)` — barely visible, structural only
- No thick decorative bars filling the full page width

### Spacing
- Before each section (eyebrow + heading block): 18pt spacer
- After heading before body: 8pt spacer
- Between body paragraphs: 6pt spacer
- Inside callout boxes: 10pt padding all sides
- Tables: internal cell padding 6pt top/bottom, 8pt left/right

### Layout principles
- **Left-aligned throughout** — no centered body text
- **Asymmetric hierarchy** — vary element widths (full-width body, inset formula boxes, narrow callouts)
- **Breathe** — generous whitespace between sections. If a page looks packed, add a spacer
- **Cards only for elevation** — only use bordered boxes when they serve a purpose (formulas, worked examples, CTAs). Not decorative

### Anti-slop rules (forbidden patterns)
- No navy background on body content pages (only cover + CTA page)
- No centered headings unless on the cover
- No thick horizontal rules as decoration
- No "Elevate", "Seamless", "Unleash", "Game-changer" in any copy
- No pure black (`#000000`) anywhere
- No round fake numbers — use real calculated values
- Body text color is NEVER the same as the accent color

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

PDF filenames are the public face of the document. WhatsApp and Slack display the filename as the document title — it must read like a real title, not a code.

**Rule: always use a human-readable title. No slugs, no underscores, no version numbers in the filename.**

| Type | Format | Example |
|------|--------|---------|
| Lesson PDF | `Step [X.Y] - [Full Title].pdf` | `Step 1.1 - Introduction to Treasury Management.pdf` |
| Lead magnet | `[Hook Title] - Booklesss.pdf` | `3 Questions Your TM Exam Will Ask - Booklesss.pdf` |

- Use ` - ` (space hyphen space) as separator
- Title case for all words
- No underscores, no version numbers, no course codes in the filename
- Lead magnets always end with ` - Booklesss` so the brand shows in previews
- Lesson PDFs include the step number so students can find them in order

---

## Before generating — required inputs

Before writing the Python script, confirm:

1. **Document type** — lesson or lead magnet?
2. **Slack channel link** — where students discuss this lesson.
   (e.g. `https://bookless10.slack.com/channels/tm-working-capital`)
   If not provided, ask: "What's the Slack channel link for this lesson?"
   This is **not optional** — the channel button must appear in every lesson PDF.

---

## Slack channel button (lesson PDFs only)

Every lesson PDF must include a prominent, clickable channel button — **not a footer link**. Place it at the end of the document, just before or replacing the cross-reference block.

### Button design spec

```
┌──────────────────────────────────────────────────────────┐
│  JOIN THE DISCUSSION                                      │
│  Ask questions, share answers → #tm-working-capital       │
│  [full channel URL as clickable link]                     │
└──────────────────────────────────────────────────────────┘
```

- Background: course accent color (e.g. `#10B981` emerald for TM)
- Text: `#FFFFFF` white
- Eyebrow: `JOIN THE DISCUSSION` — 7pt bold ALL CAPS
- Body: `Ask questions, share your answers →` then channel name in bold
- The entire box is a clickable hyperlink to the channel URL
- Width: full text frame width
- Padding: 12pt all sides

### ReportLab implementation

```python
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors

def channel_button(channel_url, channel_name, accent_hex):
    accent = HexColor(accent_hex)
    label = Paragraph(
        'JOIN THE DISCUSSION',
        ParagraphStyle('btn_eyebrow', fontName='Calibri-Bold',
                       fontSize=7, textColor=colors.white, spaceAfter=4)
    )
    body = Paragraph(
        f'<link href="{channel_url}">Ask questions, share your answers — <u><b>open #{channel_name} in Slack</b></u></link>',
        ParagraphStyle('btn_body', fontName='Calibri', fontSize=10,
                       textColor=colors.white, leading=15)
    )
    t = Table([[label], [body]], colWidths=[CONTENT_WIDTH])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), accent),
        ('TOPPADDING',    (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING',   (0,0), (-1,-1), 14),
        ('RIGHTPADDING',  (0,0), (-1,-1), 14),
    ]))
    return t
```

---

## How to generate

1. Confirm channel link and document type (see Required inputs above)
2. Read the source .md file (lesson type) or draft content from scratch (lead magnet)
3. Humanize all body copy before writing the script
4. Write a Python script using ReportLab — include channel button for lesson type
5. Run via Bash: `python3 [script_path]`
6. Confirm the output path to the user
7. Update the cross-references in related documents if any new steps were added

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
