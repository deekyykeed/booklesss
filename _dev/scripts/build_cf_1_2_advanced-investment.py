"""
Booklesss — Step 1.2: Advanced Investment Appraisal
Course: BAC4301 Corporate Finance
Palette: Booklesss house brand — cream paper (#FFFEF2), jade accent (#2FB99A)
Builds to the v2 standard set on Step 1.1.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak, NextPageTemplate, Flowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
import os, sys

# ── FONTS ──────────────────────────────────────────────────────────────────
# Aptos for body, Parastoo (serif) for cover title + headings.
# Both vendored in _dev/fonts/ so the build is self-contained on any machine.
FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "fonts")

def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, filename)))

_reg("Body",             "Aptos.ttf")
_reg("Body-Bold",        "Aptos-Bold.ttf")
_reg("Body-Italic",      "Aptos-Italic.ttf")
_reg("Body-BoldItalic",  "Aptos-Bold-Italic.ttf")
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold",
                              italic="Body-Italic", boldItalic="Body-BoldItalic")
_reg("Display-Bold",     "parkinsans-v3-latin-700.ttf")
_reg("Title",            "Parastoo.ttf")        # serif title (website hero font)
_reg("Title-Bold",       "Parastoo-Bold.ttf")
pdfmetrics.registerFontFamily("Title", normal="Title", bold="Title-Bold",
                              italic="Title", boldItalic="Title-Bold")

# ── BRAND ASSETS ───────────────────────────────────────────────────────────
BRAND_DIR  = os.path.join(os.path.dirname(__file__), "..", "brand")
LOGO_WHITE = os.path.join(BRAND_DIR, "booklesss-logo-white.png")  # for dark surfaces
LOGO_BLACK = os.path.join(BRAND_DIR, "booklesss-logo-black.png")  # for cream pages
MARK_BLACK = os.path.join(BRAND_DIR, "booklesss-mark-black.png")  # diamond glyph
GRAIN      = os.path.join(BRAND_DIR, "grain.png")
_logo_white = ImageReader(LOGO_WHITE) if os.path.exists(LOGO_WHITE) else None
_logo_black = ImageReader(LOGO_BLACK) if os.path.exists(LOGO_BLACK) else None
_mark_black = ImageReader(MARK_BLACK) if os.path.exists(MARK_BLACK) else None
_grain      = ImageReader(GRAIN)      if os.path.exists(GRAIN)      else None

# ── COLOURS — Booklesss brand (website: cream + editorial serif) ────────────
C_COVER      = colors.HexColor("#FFFDE8")   # warm cream — cover (first page) only
C_PAGE       = colors.HexColor("#FFFEF2")   # cream — body pages (website bg)
TITLE_DARK   = colors.HexColor("#121212")   # cover title  (--Logo_Dark)
HEADING_DARK = colors.HexColor("#3D3D3D")   # headings     (--Text_Dark_Used_on_H1_only)
C_JADE     = colors.HexColor("#2FB99A")   # jade accent (interior)
C_JADE_DK  = colors.HexColor("#0E5E52")   # deep jade (text / links on light bg)
C_INK      = colors.HexColor("#16201A")   # body text
C_STEEL    = colors.HexColor("#5F6B65")   # secondary labels
C_MIST     = colors.HexColor("#6E6A5E")   # warm grey (cover eyebrow / sub / meta)
C_RULE     = colors.HexColor("#E0DACB")   # warm rule / table dividers
C_WHITE    = colors.white
BG_FORMULA = colors.HexColor("#E9F0EA")   # pale jade panel (formula / calc)
BG_CALLOUT = colors.HexColor("#E7F3ED")   # soft jade callout / fact box

# ── PAGE GEOMETRY ──────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Corporate Finance", "01-investment")
OUT_PATH = os.path.join(OUT_DIR, "Step 1.2 - Advanced Investment Appraisal.pdf")

# ── STYLES ─────────────────────────────────────────────────────────────────
def make_styles():
    return {
        "cover_step": ParagraphStyle("cover_step",
            fontName="Body-Bold", fontSize=9, textColor=HEADING_DARK,
            leading=13, spaceAfter=0, alignment=TA_CENTER),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Title-Bold", fontSize=42, textColor=TITLE_DARK,
            leading=46, spaceAfter=0, alignment=TA_CENTER),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=11.5, textColor=C_MIST,
            leading=17, spaceAfter=4, alignment=TA_CENTER),
        "cover_meta": ParagraphStyle("cover_meta",
            fontName="Body", fontSize=9, textColor=C_MIST,
            leading=14, spaceAfter=2, alignment=TA_CENTER),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_JADE,
            leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT,
            keepWithNext=1),
        "h2": ParagraphStyle("h2",
            fontName="Title-Bold", fontSize=17, textColor=HEADING_DARK,
            leading=20, spaceAfter=8, alignment=TA_LEFT,
            keepWithNext=1),
        "h3": ParagraphStyle("h3",
            fontName="Body-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT,
            keepWithNext=1),
        "body": ParagraphStyle("body",
            fontName="Body", fontSize=10.5, textColor=C_INK,
            leading=17, spaceAfter=6, alignment=TA_LEFT),
        "bullet": ParagraphStyle("bullet",
            fontName="Body", fontSize=10.5, textColor=C_INK,
            leading=17, spaceAfter=4, leftIndent=14, alignment=TA_LEFT),
        "fact": ParagraphStyle("fact",
            fontName="Body-Bold", fontSize=10, textColor=C_JADE_DK,
            leading=16, spaceAfter=6, leftIndent=0, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_JADE_DK,
            leading=16, alignment=TA_LEFT),
        "formula_r": ParagraphStyle("formula_r",
            fontName="Body-Bold", fontSize=10, textColor=C_JADE_DK,
            leading=16, alignment=TA_RIGHT),
        "th": ParagraphStyle("th",
            fontName="Body-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Body", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "outcome": ParagraphStyle("outcome",
            fontName="Body", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=5, leftIndent=14, alignment=TA_LEFT),
        "arc": ParagraphStyle("arc",
            fontName="Body", fontSize=9, textColor=C_STEEL,
            leading=14, spaceAfter=3, leftIndent=14, alignment=TA_LEFT),
        "community": ParagraphStyle("community",
            fontName="Body", fontSize=9.5, textColor=C_STEEL,
            leading=15, spaceAfter=5, alignment=TA_LEFT),
    }

ST = make_styles()

# ── CANVAS CALLBACKS ───────────────────────────────────────────────────────
def _paint_paper(canvas, bg):
    """Paper fill + subtle grain — the Booklesss surface."""
    canvas.setFillColor(bg)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    if _grain is not None:
        canvas.drawImage(_grain, 0, 0, width=W, height=H, mask="auto")

def cover_bg(canvas, doc):
    canvas.saveState()
    _paint_paper(canvas, C_COVER)
    # top brand row: black logo (left) + module (right) + warm hairline
    top_y = H - MY + 6
    if _logo_black is not None:
        iw, ih = _logo_black.getSize()
        lh = 15
        canvas.drawImage(_logo_black, MX, top_y - 5, width=lh * iw / ih, height=lh,
                         preserveAspectRatio=True, mask="auto")
    else:
        canvas.setFont("Body-Bold", 8.5)
        canvas.setFillColor(HEADING_DARK)
        canvas.drawString(MX, top_y, "BOOKLESSS")
    canvas.setFont("Body", 8.5)
    canvas.setFillColor(C_MIST)
    canvas.drawRightString(W - MX, top_y, "BAC4301 · CORPORATE FINANCE")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.8)
    canvas.line(MX, top_y - 6, W - MX, top_y - 6)
    canvas.restoreState()

def page_bg(canvas, doc):
    canvas.saveState()
    _paint_paper(canvas, C_PAGE)
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    pn = doc.page
    canvas.setStrokeColor(C_JADE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "1.2 — Advanced Investment Appraisal")
    canvas.drawRightString(W - MX, H - MY + 7, "v2 · May 2026")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "BAC4301 — Corporate Finance")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")
    canvas.restoreState()

# ── HELPERS ────────────────────────────────────────────────────────────────
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_JADE,
                    spaceAfter=10, spaceBefore=4)
    hr.keepWithNext = 1   # keep the rule with the H2 above and first line below
    return hr

def section(eyebrow, heading):
    return [
        Spacer(1, 4),
        Paragraph(eyebrow.upper(), ST["eyebrow"]),
        Paragraph(heading, ST["h2"]),
        hairline(),
    ]

def body(text):
    return Paragraph(text, ST["body"])

def bullet(text):
    return Paragraph(f"• {text}", ST["bullet"])

def h3(text):
    return Paragraph(text, ST["h3"])

def fact(text):
    p = Paragraph(text, ST["fact"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_CALLOUT),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])

def formula_box(lines):
    items = [[Paragraph(ln, ST["formula"])] for ln in lines]
    inner = Table(items, colWidths=[CONTENT_W - 26])
    inner.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
    ]))
    outer = Table([[inner]], colWidths=[CONTENT_W])
    outer.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_FORMULA),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([outer, Spacer(1, 10)])

def calc_table(rows, title=None):
    """Right-aligned financial waterfall: rows are (label, value) or
    (label, value, rule_above=True) to draw a jade subtotal rule above the row."""
    data, rule_rows, r = [], [], 0
    if title:
        data.append([Paragraph(f"<b>{title}</b>", ST["formula"]), Paragraph("", ST["formula_r"])])
        r += 1
    for row in rows:
        label, val = row[0], row[1]
        if len(row) > 2 and row[2]:
            rule_rows.append(r)
        data.append([Paragraph(label, ST["formula"]), Paragraph(val, ST["formula_r"])])
        r += 1
    inner = Table(data, colWidths=[CONTENT_W - 26 - 70, 70])
    ts = [
        ('TOPPADDING',    (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
    ]
    for rr in rule_rows:
        ts.append(('LINEABOVE',  (0,rr), (-1,rr), 0.6, C_JADE))
        ts.append(('TOPPADDING', (0,rr), (-1,rr), 6))
    inner.setStyle(TableStyle(ts))
    outer = Table([[inner]], colWidths=[CONTENT_W])
    outer.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_FORMULA),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([outer, Spacer(1, 10)])

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"), ParagraphStyle("cbt", fontName="Body", fontSize=10,
                  textColor=C_JADE_DK, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_CALLOUT),
        ('LINEBEFORE',    (0,0), (-1,-1), 2, C_JADE),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

def discussion_q(text):
    p = Paragraph(text, ST["discuss_q"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_CALLOUT),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def table_std(data, col_widths):
    rows = []
    for i, row in enumerate(data):
        styled = [Paragraph(str(c), ST["th"] if i == 0 else ST["td"]) for c in row]
        rows.append(styled)
    t = Table(rows, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_RULE),
        ('BACKGROUND',    (0,0), (-1, 0), BG_FORMULA),
        ('LINEBELOW',     (0,0), (-1, 0), 1, C_JADE),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def community_closer():
    return [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is Step 1.2 in the Corporate Finance series running inside the Booklesss study group on Slack. "
            "The channel for this topic is <b>#cf-investment</b> — that's where BAC4301 students are working "
            "through investment appraisal together, sharing past paper questions, and picking apart the "
            "APV and capital-rationing calculations from this step.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            "If you're already in the group, head to <b>#cf-investment</b> — that's where the conversation on "
            "this step is happening.",
            ST["community"]),
    ]

# ── TRIPLE-MARK MOTIF — three copies of the real Booklesss diamond ─────────
class LogoTriple(Flowable):
    """Centred trio of the actual logo mark: large centre, two lighter sides."""
    # Website spec: outer 18px, centre 24px, gap 11px → ×0.75 (56px=42pt) → pt
    def __init__(self, img, center=18, side=13.5, gap=8.25, side_alpha=0.3):
        super().__init__()
        self.img = img
        self.center, self.side, self.gap = center, side, gap
        self.side_alpha = side_alpha
        self._h = center

    def wrap(self, aw, ah):
        self._aw = aw
        return aw, self._h

    def _draw_mark(self, x_center, size):
        self.canv.drawImage(self.img, x_center - size / 2.0, self._h / 2.0 - size / 2.0,
                            width=size, height=size, mask="auto", preserveAspectRatio=True)

    def draw(self):
        c = self.canv
        mid = getattr(self, "_aw", self._h) / 2.0
        step = self.center / 2.0 + self.gap + self.side / 2.0
        c.saveState()
        c.setFillAlpha(self.side_alpha)      # lighter side marks, like the website
        self._draw_mark(mid - step, self.side)
        self._draw_mark(mid + step, self.side)
        c.restoreState()
        self._draw_mark(mid, self.center)    # solid centre mark


# ── TRIPLE-DIAMOND MOTIF (vector ◇◆◇ — fallback if no mark asset) ───────────
class TripleDiamond(Flowable):
    """Centred ◇◆◇ — outlined, solid (larger), outlined. The Booklesss mark."""
    def __init__(self, center_size=15, side_size=10, gap=13,
                 color=None, stroke_width=1.3):
        super().__init__()
        self.cs, self.ss, self.gap = center_size, side_size, gap
        self.color = color or HEADING_DARK
        self.sw = stroke_width
        self._h = center_size
        self._w = center_size + 2 * side_size + 2 * gap

    def wrap(self, aw, ah):
        self._aw = aw
        return aw, self._h

    def _diamond(self, cx, cy, half, fill):
        p = self.canv.beginPath()
        p.moveTo(cx, cy + half); p.lineTo(cx + half, cy)
        p.lineTo(cx, cy - half); p.lineTo(cx - half, cy); p.close()
        self.canv.drawPath(p, stroke=1, fill=1 if fill else 0)

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(self.color); c.setFillColor(self.color)
        c.setLineWidth(self.sw)
        cy = self._h / 2.0
        mid = getattr(self, "_aw", self._w) / 2.0
        hs, hc = self.ss / 2.0, self.cs / 2.0
        step = hc + self.gap + hs
        self._diamond(mid - step, cy, hs, fill=False)
        self._diamond(mid,        cy, hc, fill=True)
        self._diamond(mid + step, cy, hs, fill=False)
        c.restoreState()


# ── BUILD ──────────────────────────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4,
                          topMargin=MY, bottomMargin=MY,
                          leftMargin=MX, rightMargin=MX)

    cover_tpl = PageTemplate(id="cover",
        frames=[Frame(MX, MY, CONTENT_W, H - 2*MY)],
        onPage=cover_bg, pagesize=A4)
    body_tpl = PageTemplate(id="body",
        frames=[Frame(MX, MY + 5, CONTENT_W, H - 2*MY - 15)],
        onPage=page_bg, onPageEnd=body_page, pagesize=A4)
    doc.addPageTemplates([cover_tpl, body_tpl])

    story = []

    # ── COVER ──────────────────────────────────────────────────────────────
    story.append(Spacer(1, 120))
    story.append(LogoTriple(_mark_black) if _mark_black is not None
                 else TripleDiamond(color=HEADING_DARK))
    story.append(Spacer(1, 26))
    story.append(Paragraph("STEP 1.2 · INVESTMENT", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Advanced Investment Appraisal", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "Adjusted present value, issue costs, and capital rationing — what NPV becomes "
        "once your company borrows to fund a project and can't afford to back every good one.",
        ST["cover_sub"]))
    story.append(Spacer(1, 210))
    story.append(Paragraph("BAC4301 · Corporate Finance", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── ORIENTATION: FOUNDER FRAMING ───────────────────────────────────────
    story += section("START HERE", "Same Company, Two New Pressures")
    story.append(body(
        "Keep reading as the founder. In Step 1.1 you valued projects as if your company paid "
        "for everything out of its own pocket — all equity, no borrowing, and enough money to fund "
        "every project that cleared the hurdle. That kept the maths clean while you learned NPV, IRR, and MIRR."
    ))
    story.append(body(
        "Real companies don't run that way. You borrow to fund big projects, and borrowing changes the value "
        "of the deal because interest is tax-deductible. And you almost never have enough cash to back every "
        "project with a positive NPV at once. This step handles both pressures: <b>APV</b> values a project "
        "and its financing separately, and <b>capital rationing</b> tells you which projects to pick when the money runs out."
    ))
    story.append(Spacer(1, 4))
    story.append(fact(
        "Everything here is built on Step 1.1. APV is just NPV done twice — once for the project, once for the "
        "financing — and capital rationing is NPV ranked under a budget. The discounting machinery does not change."
    ))
    story.append(Spacer(1, 6))

    # ── SECTION 1: WHY BASIC NPV ISN'T ALWAYS ENOUGH ───────────────────────
    story += section("CONCEPT 01", "Where Basic NPV Runs Out of Road")
    story.append(body(
        "In Step 1.1 you discounted free cash flows at a single cost of capital and accepted any project with a "
        "positive NPV. That single rate quietly assumes one thing: the project is financed the same way as the rest "
        "of the company, and the company's mix of debt and equity stays put. Discount at the firm's cost of capital, "
        "and you have baked the firm's existing financing into the answer."
    ))
    story.append(body(
        "Two situations break that assumption. First, a project financed mostly by a new loan changes how much debt "
        "the company carries — so its financing is not the company's usual mix. Second, the financing itself creates "
        "value the project's cash flows never show: interest on debt is tax-deductible, so borrowing hands you a tax "
        "saving, while raising the money costs fees. A single discount rate can't cleanly carry all of that."
    ))
    story.append(body(
        "Adjusted present value (APV) fixes this by refusing to mix the two questions. It values the project as if it "
        "were all-equity financed, then values the financing side effects separately, and adds them. You see exactly "
        "how much of the deal's worth comes from the project and how much from the way you paid for it."
    ))
    story.append(fact(
        "Use APV when the financing changes the company's debt level or has its own cash effects (tax shields, issue "
        "costs, subsidised loans). When financing is just the company's normal mix, ordinary NPV is enough."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 2: APV — THE TWO-PART STRUCTURE ────────────────────────────
    story += section("CONCEPT 02", "Adjusted Present Value — Project First, Financing Second")
    story.append(body(
        "APV splits the value of a geared (debt-financed) project into two parts you calculate on their own:"
    ))
    story.append(formula_box([
        "APV  =  Base-case NPV  +  PV of financing side effects",
        "",
        "Base-case NPV   = the project valued as if it were 100% equity financed",
        "Financing effects = tax shield on debt interest, less the cost of raising the finance",
    ]))
    story.append(body(
        "The base-case NPV is the investment decision on its own. You discount the project's free cash flows at the "
        "<b>ungeared (unlevered) cost of equity</b>, written K<sub>u</sub> — the return equity investors would want if "
        "the project carried no debt at all. That rate reflects only business risk, not financing risk. (Where K<sub>u</sub> "
        "comes from — the asset beta and CAPM — is Step 2.1; here you are given it.)"
    ))
    story.append(body(
        "The financing side effects are the financing decision on its own. Two items show up most often, and because both "
        "are low-risk and fairly predictable, they are discounted at the <b>cost of debt</b> (or the risk-free rate), not at K<sub>u</sub>:"
    ))
    story.append(bullet(
        "<b>Interest tax shield</b> — interest on the debt is tax-deductible, so each year's interest saves you "
        "(interest × tax rate) in tax. That saving is a real cash inflow. Add its present value."
    ))
    story.append(bullet(
        "<b>Issue costs</b> — raising debt or equity costs fees. That is a real cash outflow. Subtract it. "
        "Issue costs of debt are tax-deductible; issue costs of equity are not."
    ))
    story.append(callout(
        "The APV layout:\n"
        "  Base-case NPV (discount at Ku)        X\n"
        "  − PV of issue costs                   (X)\n"
        "  + PV of interest tax shield            X\n"
        "  = Adjusted present value               X\n"
        "Decision rule: accept the project if APV is positive."
    ))
    story.append(fact(
        "APV = the project's value if all-equity financed, plus the value the financing adds (tax shield) minus what "
        "it costs (issue fees). It keeps the investment decision and the financing decision in separate columns."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: ISSUE COSTS & GROSSING UP ───────────────────────────────
    story += section("CONCEPT 03", "Issue Costs and Grossing Up")
    story.append(body(
        "Before the worked example, one detail trips students up every year: when finance has issue costs, the amount "
        "you raise has to cover both the project and the fees. If you need a clean ZMW 2.4 million in hand and the issuer "
        "charges 4% of the total raised, you cannot just raise ZMW 2.4 million — the fee comes out of it and leaves you short."
    ))
    story.append(body(
        "So you <b>gross up</b>. The ZMW 2.4 million you actually need is 96% of the gross amount (because 4% is eaten by fees):"
    ))
    story.append(formula_box([
        "Gross amount to raise  =  Net needed / (1 − issue cost %)",
        "                       =  2,400,000 / 0.96  =  ZMW 2,500,000",
        "",
        "Issue cost  =  2,500,000 × 4%  =  ZMW 100,000",
        "        (or in one step:  2,400,000 × 4/96  =  ZMW 100,000)",
    ]))
    story.append(body(
        "In an APV, the issue cost is the figure you subtract. If the cost relates to debt, it is tax-deductible, so you "
        "use the after-tax figure: a gross debt issue cost of ZMW 338.60 at a 30% tax rate is ZMW 338.60 × (1 − 0.30) = "
        "<b>ZMW 237</b> after tax. An equity issue cost gets no such relief — you subtract it in full."
    ))
    story.append(fact(
        "Gross up so the cash you raise still covers the project after fees. Then carry debt issue costs into the APV "
        "net of tax, and equity issue costs in full."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: FULL APV WORKED EXAMPLE ─────────────────────────────────
    story += section("CONCEPT 04", "APV End to End — Mutengo Mills")
    story.append(body(
        "Mutengo Mills is appraising a new milling line. Project cash flows are below, figures in ZMW '000. The ungeared "
        "cost of equity is 10%. The line will be part-funded by a ZMW 6,000 (i.e. ZMW 6 million) bank loan at 8% interest, "
        "repaid in equal instalments of ZMW 1,500 a year over four years. Tax is 30%, and the gross issue cost of the debt "
        "is ZMW 338.60."
    ))

    story.append(h3("Step 1 — Base-case NPV (discount the project at Ku = 10%)"))
    story.append(table_std([
        ["Year", "Cash Flow (ZMW '000)", "Discount Factor (10%)", "Present Value (ZMW '000)"],
        ["0", "(10,000)", "1.000", "(10,000)"],
        ["1", "1,500", "0.909", "1,364"],
        ["2", "2,500", "0.826", "2,065"],
        ["3", "4,500", "0.751", "3,380"],
        ["4", "5,000", "0.683", "3,415"],
        ["", "", "Base-case NPV =", "224"],
    ], [1.5*cm, 3.5*cm, 3.3*cm, 3.4*cm]))
    story.append(body(
        "On its own, the project is barely worth doing: a base-case NPV of just ZMW 224,000. If that were the whole story, "
        "you would think hard before committing. But you are funding it partly with debt, and that changes the picture."
    ))

    story.append(h3("Step 2 — PV of the interest tax shield (discount at the 8% cost of debt)"))
    story.append(body(
        "The loan is repaid ZMW 1,500 a year, so the balance — and the interest on it — falls each year. Interest is "
        "8% of the opening balance; the tax shield is 30% of that interest; discount each shield at the 8% cost of debt."
    ))
    story.append(table_std([
        ["Year", "Loan at start", "Interest (8%)", "Tax shield (30%)", "DF (8%)", "PV (ZMW '000)"],
        ["1", "6,000", "480", "144", "0.926", "133"],
        ["2", "4,500", "360", "108", "0.857", "93"],
        ["3", "3,000", "240", "72", "0.794", "57"],
        ["4", "1,500", "120", "36", "0.735", "26"],
        ["", "", "", "", "PVITS =", "309"],
    ], [1.2*cm, 2.4*cm, 2.3*cm, 2.6*cm, 1.7*cm, 2.5*cm]))

    story.append(h3("Step 3 — Issue cost, net of tax"))
    story.append(body(
        "The gross debt issue cost is ZMW 338.60. Debt issue costs are tax-deductible, so the after-tax cost is "
        "ZMW 338.60 × (1 − 0.30) = ZMW 237 (in '000 terms, ZMW 237)."
    ))

    story.append(h3("Step 4 — Assemble the APV"))
    story.append(calc_table([
        ("Base-case NPV", "224"),
        ("− PV of debt issue cost (after tax)", "(237)"),
        ("+ PV of interest tax shield", "309"),
        ("Adjusted present value (APV)", "296", True),
    ], title="APV  (ZMW '000)"))
    story.append(body(
        "The APV is ZMW 296,000 — comfortably positive, and noticeably better than the ZMW 224,000 base case. The extra "
        "ZMW 72,000 is the net gift of the financing: a ZMW 309,000 tax shield on the borrowed money, less the ZMW 237,000 "
        "cost of raising it. The way you paid for the project made a marginal deal clearly worth doing."
    ))
    story.append(fact(
        "APV here = 224 − 237 + 309 = ZMW 296,000. A project that looked weak on its cash flows alone becomes a clear "
        "accept once the tax shield on its debt is counted. That is exactly the value ordinary NPV would have hidden."
    ))
    story.append(Spacer(1, 8))

    # ── DISCUSSION QUESTION 1 ──────────────────────────────────────────────
    story.append(discussion_q(
        "<i>Your company can fund a ZMW 10 million expansion two ways: entirely from retained earnings, or by borrowing "
        "ZMW 6 million at 8% and putting in ZMW 4 million of equity. The base-case NPV is identical either way. Using APV "
        "thinking, why is the borrowed route worth more to your shareholders — and what single change to Zambia's tax rules "
        "would make that advantage vanish completely?</i>"
    ))

    # ── SECTION 5: CAPITAL RATIONING — SINGLE PERIOD ───────────────────────
    story += section("CONCEPT 05", "Capital Rationing — Choosing When You Can't Fund Everything")
    story.append(body(
        "APV told you whether one project is worth doing. Capital rationing answers a different question: you have several "
        "projects that each clear the hurdle, but not enough money to back them all. Which combination do you choose?"
    ))
    story.append(body(
        "First, name the constraint. <b>Hard rationing</b> is external — the bank simply won't lend you more, at any price. "
        "<b>Soft rationing</b> is self-imposed — your board has capped this year's investment budget to keep control, even "
        "though more finance is available. The maths is the same; the cause is what differs."
    ))
    story.append(h3("Single-period rationing: the profitability index"))
    story.append(body(
        "When the shortage is in one period only (say, a fixed budget this year), you want the most NPV per kwacha invested, "
        "not just the biggest NPV. The tool is the <b>profitability index (PI)</b>:"
    ))
    story.append(formula_box([
        "Profitability Index (PI)  =  PV of future cash flows  /  Initial investment",
        "",
        "PI > 1  means the project's inflows are worth more than its cost (positive NPV).",
        "Rank projects by PI, then take them in order until the budget runs out.",
    ]))
    story.append(body(
        "Mutengo has ZMW 5,000,000 to invest this year and four divisible projects (each can be part-funded). All are "
        "discounted at the firm's cost of capital:"
    ))
    story.append(table_std([
        ["Project", "Outlay (ZMW)", "PV of inflows (ZMW)", "NPV (ZMW)", "PI", "Rank"],
        ["A", "2,000,000", "2,600,000", "600,000", "1.30", "1"],
        ["B", "1,000,000", "1,250,000", "250,000", "1.25", "2"],
        ["C", "1,500,000", "1,800,000", "300,000", "1.20", "3"],
        ["D", "2,500,000", "2,750,000", "250,000", "1.10", "4"],
    ], [1.4*cm, 2.6*cm, 3.0*cm, 2.4*cm, 1.1*cm, 1.1*cm]))
    story.append(body(
        "Take projects in PI order until the ZMW 5,000,000 is gone:"
    ))
    story.append(calc_table([
        ("A — full (PI 1.30)", "2,000,000"),
        ("B — full (PI 1.25)", "1,000,000"),
        ("C — full (PI 1.20)", "1,500,000"),
        ("D — 20% of it, the budget left (PI 1.10)", "500,000"),
        ("Total invested", "5,000,000", True),
    ], title="Spending the budget (ZMW)"))
    story.append(body(
        "That mix delivers the most value the budget can buy: 600,000 + 250,000 + 300,000 + (20% × 250,000) = "
        "<b>ZMW 1,200,000</b> of total NPV. Notice D is taken last and only partly, even though its NPV (250,000) ties B's — "
        "because each kwacha put into D works less hard. <b>Highest NPV is not the same as best use of a tight budget.</b>"
    ))
    story.append(callout(
        "The PI ranking works cleanly only when projects are divisible (you can fund a fraction). If they are "
        "all-or-nothing (indivisible), you can't take 20% of D — you instead test whole combinations that fit the "
        "budget and pick the one with the highest combined NPV."
    ))
    story.append(fact(
        "Under a single-period budget, rank by profitability index, not by NPV. PI measures value created per kwacha "
        "invested — exactly what you are short of."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: MULTI-PERIOD RATIONING ──────────────────────────────────
    story += section("CONCEPT 06", "Multi-Period Rationing — When the Budget Bites Every Year")
    story.append(body(
        "The profitability index works for one tight year. But suppose the budget is limited in several years at once, "
        "and projects draw on those budgets in different amounts each year. A simple ranking can't juggle three or four "
        "constraints together — you need <b>linear programming</b> to find the mix that maximises total NPV while staying "
        "inside every annual limit."
    ))
    story.append(body(
        "Kabwe Holdings has approved these investment budgets, and is choosing among four projects. Figures in ZMW '000:"
    ))
    story.append(table_std([
        ["Project", "Year 1", "Year 2", "Year 3", "Project NPV"],
        ["Project 1", "7,000", "10,000", "4,000", "8,000"],
        ["Project 2", "9,000", "0", "12,000", "11,000"],
        ["Project 3", "0", "6,000", "8,000", "6,000"],
        ["Project 4", "5,000", "6,000", "7,000", "4,000"],
        ["Budget available", "16,000", "14,000", "17,000", ""],
    ], [2.6*cm, 2.2*cm, 2.2*cm, 2.2*cm, 2.6*cm]))
    story.append(body(
        "Let x₁, x₂, x₃, x₄ be the proportion of each project undertaken, where 0 ≤ x ≤ 1. The problem becomes:"
    ))
    story.append(formula_box([
        "Maximise total NPV:",
        "   8,000·x₁ + 11,000·x₂ + 6,000·x₃ + 4,000·x₄",
        "",
        "Subject to the annual budgets:",
        "   Year 1:   7,000·x₁ + 9,000·x₂ +      0·x₃ + 5,000·x₄  ≤ 16,000",
        "   Year 2:  10,000·x₁ +      0·x₂ + 6,000·x₃ + 6,000·x₄  ≤ 14,000",
        "   Year 3:   4,000·x₁ + 12,000·x₂ + 8,000·x₃ + 7,000·x₄  ≤ 17,000",
        "   and 0 ≤ x₁, x₂, x₃, x₄ ≤ 1",
    ]))
    story.append(body(
        "Solved (by Excel Solver or any LP tool), the optimum is x₁ = 1, x₂ = 1, x₃ = 0, x₄ = 0: take Projects 1 and 2 in "
        "full, drop 3 and 4. Total NPV = 8,000 + 11,000 = <b>ZMW 19,000</b> (i.e. ZMW 19 million)."
    ))
    story.append(body(
        "Projects 3 and 4 also fit inside the budgets — but their combined NPV is only ZMW 10 million, well below 19. "
        "The constraints alone don't pick the winner; the objective function does. (If projects must be whole rather than "
        "fractional, the same setup becomes integer programming, which forces each x to be 0 or 1.)"
    ))
    story.append(fact(
        "When budgets bind in more than one period, linear programming maximises total NPV across all the constraints at "
        "once. Fitting the budget is necessary but not sufficient — the best feasible mix is the one with the highest combined NPV."
    ))
    story.append(Spacer(1, 8))

    # ── DISCUSSION QUESTION 2 ──────────────────────────────────────────────
    story.append(discussion_q(
        "<i>You rank four divisible projects by profitability index and the budget runs out part-way through the fourth. "
        "A colleague says you should instead just pick the three projects with the highest individual NPVs. Build your own "
        "small numerical example where the two methods disagree — and explain which one actually maximises the value created "
        "from a fixed pot of cash, and why.</i>"
    ))

    story.append(PageBreak())

    # ── KEY TERMS ──────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    story.append(table_std([
        ["Term", "Definition"],
        ["Adjusted Present Value (APV)", "Project value split into base-case (all-equity) NPV plus the PV of financing side effects"],
        ["Base-case NPV", "The project valued as if 100% equity financed, discounting cash flows at the ungeared cost of equity"],
        ["Ungeared cost of equity (Ku)", "The return equity investors require with no debt in place; reflects business risk only"],
        ["Financing side effects", "Cash effects created by how a project is funded — chiefly the interest tax shield and issue costs"],
        ["Interest tax shield", "The tax saved because debt interest is tax-deductible: interest × tax rate, each period"],
        ["Issue costs", "Fees paid to raise finance. Debt issue costs are tax-deductible; equity issue costs are not"],
        ["Grossing up", "Scaling the amount raised so it still covers the project after issue fees: net / (1 − fee %)"],
        ["Capital rationing", "Having more positive-NPV projects than money to fund them"],
        ["Hard rationing", "External limit — lenders will not advance more finance at any price"],
        ["Soft rationing", "Internal limit — management caps the investment budget by choice"],
        ["Profitability Index (PI)", "PV of future cash flows ÷ initial investment; ranks projects by value created per kwacha"],
        ["Divisible project", "A project that can be part-funded, taking a fraction of it for a proportional share of NPV"],
        ["Single-period rationing", "Budget binds in one period only; solved by ranking on the profitability index"],
        ["Multi-period rationing", "Budget binds in several periods; solved by linear (or integer) programming"],
        ["Objective function", "The quantity an LP maximises — here, total NPV across the chosen projects"],
    ], [4.7*cm, CONTENT_W - 4.7*cm]))

    # ── LEARNING OUTCOMES ──────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able to Do")
    for i, outcome in enumerate([
        "Explain why a single discount rate breaks down when a project changes the firm's financing, and when to switch to APV",
        "Set out the APV structure: base-case NPV plus the PV of financing side effects",
        "Calculate a base-case NPV by discounting project cash flows at the ungeared cost of equity (Ku)",
        "Calculate the present value of an interest tax shield on a repaying loan, discounted at the cost of debt",
        "Gross up for issue costs and carry debt issue costs into an APV net of tax",
        "Assemble a full APV and apply the accept-if-positive decision rule",
        "Distinguish hard from soft capital rationing",
        "Rank and select divisible projects under a single-period budget using the profitability index",
        "Recognise when multi-period rationing requires linear programming and set up the objective function and constraints",
    ], 1):
        story.append(Paragraph(f"{i}.  {outcome}", ST["outcome"]))

    story.append(Spacer(1, 16))
    story.append(h3("Where You Go Next"))
    story.append(body(
        "You can now value a project together with the way it's financed, and choose between good projects when money is "
        "tight. <b>Step 1.3 — International Project Appraisal</b> takes the same NPV and APV machinery across the border: "
        "what changes when the cash flows come back in dollars or rand, when foreign tax rules bite, and when exchange rates "
        "move against you between now and the day the money lands."
    ))
    story.append(body(
        "Still the same picture you've been building since Step 1.1 — you are adding one more real-world pressure to a "
        "toolkit you already own, not starting over."
    ))

    # ── COMMUNITY CLOSER ───────────────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
