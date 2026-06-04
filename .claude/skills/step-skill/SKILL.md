---
name: step-skill
description: >
  The Booklesss PDF design system — produces any branded PDF in the house style
  (cream paper, course accent, Parastoo serif titles, per-page header/footer).
  Use this skill whenever the user wants to create, generate, or export any
  Booklesss PDF. Triggers: "write the PDF", "generate the lesson PDF", "create a
  lead magnet", "make an invoice", "send a quote", "build a receipt", "one-pager",
  "marketing PDF", "export to PDF". The skill is a shared brand
  foundation (fonts, palette, page geometry, reusable flowables, the page-break
  rule, writing style) plus a set of document profiles that sit on top of it —
  lesson notes, lead magnets, and business documents (quotes / invoices /
  proposals / receipts). Any new document type uses the same foundation with its
  own structure. Always generate by running a Python/ReportLab script via Bash —
  never a GUI library. PDFs carry no marketing links or external URLs in the body.
---

# step-skill

The shared design system for **every** Booklesss PDF. Think of it in two layers:

1. **Foundation** — the brand: fonts, palette, page geometry, reusable
   components, header/footer, the page-break rule, writing style. Identical
   across every document.
2. **Document profile** — the structure for a specific output: a lesson, a lead
   magnet, an invoice, a quote, a one-pager. Profiles pick from the foundation;
   they never redefine the brand.

> Building a kind of document not listed here (statement, certificate, etc.)?
> Use the foundation as-is and add a new profile. Don't fork the brand.

**Reference implementations**
- Lesson (most complete): [`_dev/scripts/build_cf_1_1_investment-fundamentals.py`](../../../_dev/scripts/build_cf_1_1_investment-fundamentals.py)

When this doc and a reference script disagree, the script wins — update this doc.

---

# Layer 1 — Foundation (every PDF)

## Fonts — vendored, self-contained

Fonts live in `_dev/fonts/` and are committed, so the build runs identically on
any machine. **Never hardcode Windows or Linux system-font paths.**

```python
FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "fonts")

def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, filename)))

_reg("Body",            "Aptos.ttf")
_reg("Body-Bold",       "Aptos-Bold.ttf")
_reg("Body-Italic",     "Aptos-Italic.ttf")
_reg("Body-BoldItalic", "Aptos-Bold-Italic.ttf")
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold",
                              italic="Body-Italic", boldItalic="Body-BoldItalic")
_reg("Display-Bold",    "parkinsans-v3-latin-700.ttf")  # geometric sans, sparing use
_reg("Title",           "Parastoo.ttf")                 # serif title (website hero font)
_reg("Title-Bold",      "Parastoo-Bold.ttf")
pdfmetrics.registerFontFamily("Title", normal="Title", bold="Title-Bold",
                              italic="Title", boldItalic="Title-Bold")
```

| Role | Font | Used for |
|------|------|----------|
| `Title` / `Title-Bold` | Parastoo (serif) | Document title, H2 headings |
| `Body` family | Aptos | Body text, bullets, tables, captions, line items |
| `Display-Bold` | Parkinsans | Reserve / optional display use |

## Brand assets

In `_dev/brand/`, loaded via `ImageReader` (guard each with `os.path.exists`):

| File | Use |
|------|-----|
| `booklesss-logo-black.png` | Logo on cream / light surfaces (header) |
| `booklesss-logo-white.png` | Logo on dark surfaces |
| `booklesss-mark-black.png` | Diamond glyph — the `LogoTriple` motif (light bg) |
| `booklesss-mark-white.png` | Diamond glyph for dark bg |
| `grain.png` | Subtle paper grain drawn over the page fill |

If the mark asset is missing, fall back to the vector `TripleDiamond` flowable.

## Palette

The house brand is warm cream paper with a single jade accent. This is the
default for every document.

```python
C_COVER      = colors.HexColor("#FFFDE8")  # warm cream — cover / first page
C_PAGE       = colors.HexColor("#FFFEF2")  # cream — interior pages (website bg)
TITLE_DARK   = colors.HexColor("#121212")  # title
HEADING_DARK = colors.HexColor("#3D3D3D")  # H2 / H3 headings
C_JADE       = colors.HexColor("#2FB99A")  # jade accent (eyebrows, rules, bars)
C_JADE_DK    = colors.HexColor("#0E5E52")  # deep jade — links, emphasised figures
C_INK        = colors.HexColor("#16201A")  # body text
C_STEEL      = colors.HexColor("#5F6B65")  # secondary labels
C_MIST       = colors.HexColor("#6E6A5E")  # eyebrow / sub / meta
C_RULE       = colors.HexColor("#E0DACB")  # warm rule / table dividers
BG_FORMULA   = colors.HexColor("#E9F0EA")  # pale jade panel (totals / calc blocks)
BG_CALLOUT   = colors.HexColor("#E7F3ED")  # soft jade callout / note box
```

**Rules that hold for every document:**
- Accent (jade) runs through eyebrows, hairlines, left-bar boxes, totals, and
  links — **never the body text.** Body is always `C_INK`.
- One accent only. No second decorative colour.
- Cream + grain is the default surface. **Exception:** a business document meant
  to be printed or scanned in bulk (an invoice posted to a client) may use a
  plain white body for legibility — keep the jade accent and the logo so it still
  reads as Booklesss.

### Course accents (lesson PDFs only)

Lesson notes for the other two courses keep their own cover/accent identity:

| Course | Cover bg | Accent | Display |
|--------|----------|--------|---------|
| Corporate Finance | `#FFFDE8` cream | `#2FB99A` jade | Parastoo serif *(reference brand)* |
| Treasury Management | `#0B1D3A` deep navy | `#10B981` emerald | Georgia Bold *(older system)* |
| Strategic Management | `#FFFDE8` cream | `#DC2626` cardinal red | Parastoo serif *(v2 — matches CF structure)* |

Non-lesson documents (invoices, quotes, one-pagers) always use the cream + jade
house brand, not a course accent.

## Page geometry

```python
W, H      = A4
MX        = 2.2 * cm          # side margins
MY        = 2.0 * cm          # top / bottom margins
CONTENT_W = W - 2 * MX
```

Two page templates on one `BaseDocTemplate`:
- `cover` — frame fills the page; `onPage=cover_bg`.
- `body` — frame inset for header/footer; `onPage=page_bg`, `onPageEnd=body_page`.

Switch from cover to body with `NextPageTemplate("body")` then `PageBreak()`.
A short one-page document (a single-page invoice) can run on the body template
alone — no separate cover.

## Type scale (ParagraphStyle)

| Style | Font | Size | Leading | Notes |
|-------|------|------|---------|-------|
| `cover_title` | Title-Bold | 42 | 46 | centred |
| `cover_step` | Body-Bold | 9 | 13 | centred, `HEADING_DARK` |
| `cover_sub` | Body | 11.5 | 17 | centred, `C_MIST` |
| `eyebrow` | Body-Bold | 7 | 10 | `C_JADE`, ALL CAPS, `keepWithNext=1` |
| `h2` | Title-Bold | 17 | 20 | `HEADING_DARK`, `keepWithNext=1` |
| `h3` | Body-Bold | 11 | 15 | `C_STEEL`, `keepWithNext=1` |
| `body` | Body | 10.5 | 17 | `C_INK` |
| `bullet` | Body | 10.5 | 17 | `leftIndent=14` |
| `fact` | Body-Bold | 10 | 16 | `C_JADE_DK` (key fact / total box) |
| `formula` / `formula_r` | Body-Bold | 10 | 16 | `C_JADE_DK`, L / R aligned |
| `th` / `td` | Body-Bold / Body | 9 | 13 | table header / cell |
| `discuss_q` | Body-Italic | 10 | 16 | lesson discussion question |
| `outcome` | Body | 10 | 16 | numbered list |
| `community` / `community_link` | Body / Body-Bold | 9.5 | 15 | lesson closer |

Body leading is ~1.6×. Never cramp it.

## ⚠️ Page-break rule (required, every document)

Headers must never be orphaned at the foot of a page, separated from the content
they introduce. Enforced with `keepWithNext`:

1. `eyebrow`, `h2`, `h3` styles set **`keepWithNext=1`**.
2. The `hairline()` flowable sets **`hr.keepWithNext = 1`** after construction.

This chains eyebrow → H2 → rule → first paragraph so the block stays together
across a page break. Any new heading-like style must also set `keepWithNext=1`.

```python
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_JADE,
                    spaceAfter=10, spaceBefore=4)
    hr.keepWithNext = 1   # keep the rule with the H2 above and first line below
    return hr
```

Use `KeepTogether([...])` for any block that must not split internally — boxes,
totals, worked examples, a line-item group. Every helper box below already does.

## Reusable components

All defined in the reference script. Build a document by appending these to
`story[]`. They are document-type-agnostic — a `calc_table` works just as well
for an FCF waterfall as for an invoice total.

| Helper | Returns | Purpose |
|--------|---------|---------|
| `section(eyebrow, heading)` | list | Spacer + eyebrow tag + H2 + hairline. Opens a block. |
| `body(text)` | Paragraph | Body paragraph. HTML markup ok (`<b>`, `<i>`, `<link>`). |
| `bullet(text)` | Paragraph | Indented `•` bullet. |
| `h3(text)` | Paragraph | Sub-heading. |
| `hairline()` | HRFlowable | 0.5pt jade rule, `keepWithNext`. |
| `fact(text)` | KeepTogether | Jade-tinted left-bar box — a takeaway, total, or key figure. |
| `callout(text)` | KeepTogether | Jade callout box; `\n` → `<br/>`. Notes, terms, payment details. |
| `formula_box(lines)` | KeepTogether | Pale-jade panel, left bar; one line per item. |
| `calc_table(rows, title=None)` | KeepTogether | Right-aligned money column. Rows `(label, value)` or `(label, value, True)` for a jade rule above (subtotal / total). |
| `table_std(data, col_widths)` | KeepTogether | Standard table; row 0 is the header (jade underline). Line items, key terms, anything tabular. **`col_widths` must sum to `CONTENT_W` exactly — never leave unused width.** |
| `discussion_q(text)` | KeepTogether | Italic question box *(lesson profile)*. |
| `resources_box(items)` | KeepTogether | Cover resource panel. `items` = list of `(label, url)` tuples. Red-bordered box labelled **ADDED VALUE**, with the Booklesss diamond mark as the bullet and a clickable underlined label per item. Add to cover when a step has companion resources (NotebookLM audio, past papers, etc.). Falls back to `▸` if the mark asset is missing. |

### Cover motif flowables
- `LogoTriple(img)` — centred trio of the real diamond mark. Use when the mark
  asset loads.
- `TripleDiamond()` — vector `◇◆◇` fallback.

### Canvas callbacks (per page)
- `cover_bg` — cream fill + grain, top brand row: logo (left), document/course
  label (right), warm hairline under.
- `page_bg` — cream fill + grain for interior pages.
- `body_page` — course-accent rule under a running header (title left, version/date right)
  and a warm rule above the footer (`Booklesss | booklesss.framer.ai` / label / `Page N`).
  The footer URL must be clickable — use `canvas.linkURL` over the drawn text:
  ```python
  _footer_left = "Booklesss | booklesss.framer.ai"
  canvas.drawString(MX, MY - 14, _footer_left)
  _tw = canvas.stringWidth(_footer_left, "Body", 7.5)
  canvas.linkURL("https://booklesss.framer.ai", (MX, MY - 16, MX + _tw, MY - 8))
  ```

## Writing style (every document)

- Plain English. Direct, peer-to-peer. No textbook or chatbot voice.
- ZMW currency and Zambian companies in examples (Zanaco, Zambeef, ZESCO, First
  Quantum, Mutengo).
- **Banned words:** tapestry, nuance, multifaceted, robust, delve, foster,
  Furthermore, It's worth noting, landscape, journey, empower, leverage (verb),
  game-changer, seamless, holistic, synergy.
- One em dash per document maximum. No forced rule-of-three. No emoji in body.
- Real calculated values — no round fake numbers. The humanizer is built in;
  don't run a separate pass.

## File naming & locations

Filenames are the public title (Slack and email show them). Human-readable,
title case, ` - ` separator, no slugs, no underscores, no version numbers, no
course codes in the name.

| Type | Format | Example |
|------|--------|---------|
| Lesson | `Step [X.Y] - [Full Title].pdf` | `Step 1.1 - Investment Fundamentals.pdf` |
| Lead magnet | `[Hook Title] - Booklesss.pdf` | `3 Questions Your CF Exam Will Ask - Booklesss.pdf` |
| Invoice | `Invoice [No] - [Client].pdf` | `Invoice 0042 - Zanaco.pdf` |
| Quote | `Quote [No] - [Client].pdf` | `Quote 0042 - Zanaco.pdf` |

Build scripts: `_dev/scripts/build_[...].py`.
Lessons output to `courses/[Course]/[lesson-folder]/`.
Business documents output to `operations/` (or wherever the user specifies).

## How to generate (every document)

1. Copy the reference script (or the closest profile) and rename it.
2. Keep the foundation intact: fonts, palette, geometry, header/footer,
   `keepWithNext` rule.
3. Apply the document profile's structure (below).
4. Write content directly into `build()` as `story[]` appends — no markdown
   intermediates.
5. Run via Bash and confirm the output path:

```bash
python3 _dev/scripts/build_[...].py
```

Open the PDF and check: headers not orphaned at page feet, boxes/tables not split
awkwardly, totals aligned.

**Table column-width rule (enforced on every PDF):**
- `col_widths` must always sum to exactly `CONTENT_W` — tables must span the full
  text area, no narrower.
- Header text must never wrap. At 9pt Body-Bold Aptos, budget ~5.5pt per character
  plus 16pt cell padding (8px each side). Minimum column width =
  `ceil(header_chars × 5.5) + 16`, rounded up to the nearest 5pt.
  Quick reference: "Priority" (8 chars) → min 60pt; "Variable" (8 chars) → min 60pt;
  "Description" (11 chars) → min 76pt; "Role" (4 chars) → fine at any reasonable width.
- When distributing widths, set all fixed columns first, then assign the remainder to
  the widest data column using `CONTENT_W - sum(fixed_cols)`. Never hardcode all
  four widths independently and hope they add up.

---

# Layer 2 — Document profiles

## Profile: Lesson notes

Full study document given to paying students inside Slack.

1. **Cover** — `LogoTriple` motif, `STEP X.Y · TOPIC` eyebrow, Parastoo title,
   one-sentence subtitle, course meta. Then `NextPageTemplate("body")` + break.
2. **Orientation** — a "Start here" section framing the reader's perspective for
   this step (one or two short paragraphs). **Do not list the full course skeleton
   here** — no 10-step map.
3. **4–7 content sections** — each `section("CONCEPT 0X", "Title")`, then body,
   `h3` parts, `formula_box` / `calc_table` / `table_std`, closing `fact()`.
4. **Two discussion questions** — `discussion_q(...)`, embedded mid-content. Real
   questions, no "discuss below", no CTA dressed as a question.
5. **Key Terms** — `section("REFERENCE", "Key Terms")` + two-column `table_std`.
6. **Learning Outcomes** — `section("OUTCOMES", ...)` + numbered `outcome` lines.

**No explicit CTA or community closer section.** The reader already has the PDF —
they're in the workspace. Don't pitch the platform, don't label a "what's next" block.
Instead, guide naturally through the content:
- Weave a hint toward the next step into the body at the point where it's
  genuinely relevant (e.g. after the stage that the next step covers in depth).
  Write it as a continuation of the idea, not a signpost.
- No "students", no "Next:", no labelled pointers.
- One or two touches is enough — the content should make the reader want to continue,
  not tell them to.

No workspace invite links in the body. Workspace is `bookless10.slack.com`.
(CF Slack channels are not yet created — do not post CF content until they exist.)

**Clickable step cross-references:** When the content mentions another step (e.g. "Step 2.1"),
make it a clickable link to that step's Slack file URL. Use a `STEP_LINKS` dict at the top of
the script and a `step_ref()` helper — renders as a link when the URL is known, plain text when not:

```python
STEP_LINKS = {
    "1.2": "https://booklesss20.slack.com/files/...",
    "2.1": None,  # fill in when uploaded
}

def step_ref(n):
    url = STEP_LINKS.get(n)
    if url:
        return f'<link href="{url}"><u>Step {n}</u></link>'
    return f"Step {n}"
```

Slack file links for all uploaded steps are tracked in `operations/workspace.md`.

## Profile: Lead magnet

3–4 page teaser used as a free marketing handout. Save in
`courses/[Course]/[lesson-folder]/lead-magnets/`.

- 2–3 genuinely useful concepts, ZMW + Zambian companies. Tease, don't give the
  whole lesson.
- **First-page preview:** the title must sit in the top ~20% of page 1 — the cover
  frame uses a small top padding (`topPadding = MY + 30`), not a large fraction of
  page height, or a generated thumbnail comes out blank.
- **Founding rate deadline: April 18, 2026.** Mention in at least two places
  (cover + a nudge box before the CTA). Check `Finances/pricing-strategy.md` for
  the current deadline/rate; if it has passed, drop founding language.

## Profile: Business document (quote / invoice / proposal / receipt)

Same foundation, no lesson furniture (no discussion questions, no community
closer, no course accent). Build from the foundation components:

- **Header block** — logo (`booklesss-logo-black.png`), document type + number,
  issue date, and (for invoices) due date. The `cover_bg` brand row already gives
  you logo-left / label-right; reuse it or place a `table_std` header row.
- **From / To** — two short blocks: Booklesss details and the client's, as plain
  `body` paragraphs or a two-column `table_std`.
- **Line items** — `table_std` with columns like
  `["Description", "Qty", "Unit (ZMW)", "Amount (ZMW)"]`. Right-align money.
- **Totals** — `calc_table` with `(label, value, True)` on the subtotal/total
  rows to draw the jade rule. Subtotal → tax/VAT → **Total** in `fact()` weight.
- **Payment details / notes** — `callout(...)`: bank details, payment terms,
  thank-you line. One block, jade left bar.
- **Footer** — the standard `body_page` footer carries
  `Booklesss | booklesss.framer.ai` and page number; that's enough.

A single-page invoice can skip the cover template and run on `body` alone. Use
plain white body fill instead of cream if the client will print it.

When the user asks for a quote or invoice, confirm the inputs you don't have:
client name, line items + amounts, invoice/quote number, dates, and payment
details. Don't invent figures.
