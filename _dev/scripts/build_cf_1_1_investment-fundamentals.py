"""
Booklesss — Step 1.1: Investment Fundamentals
Course: BAC4301 Corporate Finance
Palette: Forest & Jade — forest cover (#0F2A1E), jade accent (#2FB99A)
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
# Booklesss CF type system: Aptos for body, Parkinsans for display/titles.
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

INVITE_URL = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Corporate Finance", "01-investment")
OUT_PATH = os.path.join(OUT_DIR, "Step 1.1 - Investment Fundamentals.pdf")

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
            leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Title-Bold", fontSize=17, textColor=HEADING_DARK,
            leading=20, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Body-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT),
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
        "community_link": ParagraphStyle("community_link",
            fontName="Body-Bold", fontSize=9.5, textColor=C_JADE_DK,
            leading=15, alignment=TA_LEFT),
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
    canvas.drawString(MX, H - MY + 7, "1.1 — Investment Fundamentals")
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
    return HRFlowable(width="100%", thickness=0.5, color=C_JADE,
                      spaceAfter=10, spaceBefore=4)

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
    (label, value, rule_above=True) to draw a gold subtotal rule above the row."""
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
            "This is Step 1.1 in the Corporate Finance series running inside the Booklesss study group on Slack. "
            "The channel for this topic is <b>#cf-investment</b> — that's where BAC4301 students are working "
            "through investment appraisal together, sharing past paper questions, and picking apart the "
            "calculations from this step.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            f'If you\'re already there, you know where to find it. '
            f'If not, <link href="{INVITE_URL}"><u><b>join the group here.</b></u></link>',
            ST["community_link"]),
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
    story.append(Paragraph("STEP 1.1 · INVESTMENT", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Investment Fundamentals", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "Free cash flows, NPV, IRR, and MIRR — the tools that tell you whether a "
        "project is worth your money before you commit a single kwacha.",
        ST["cover_sub"]))
    story.append(Spacer(1, 210))
    story.append(Paragraph("BAC4301 · Corporate Finance", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── ORIENTATION: FOUNDER FRAMING + FULL COURSE SKELETON ────────────────
    story += section("START HERE", "You're Running the Money for Your Own Company")
    story.append(body(
        "Read this the way a founder reads it. You are not studying some distant corporation — "
        "you are the person who decides where your company's cash goes. Every tool in this step "
        "answers a question you will actually face: <i>is this worth my money, and can I prove it "
        "before I commit a single kwacha?</i>"
    ))
    story.append(body(
        "Here is the whole of Corporate Finance — all ten steps — laid out before you start. "
        "You don't learn it in disconnected chunks. You hold the full map from day one, then fill "
        "in the depth. By Step 10.1 you are not discovering new territory; you are completing a "
        "picture you have had in your head since today."
    ))
    for step, desc in [
        ("Step 1.1", "Investment Fundamentals — FCF, NPV, IRR, MIRR  ← you are here"),
        ("Step 2.1", "Advanced Investment Appraisal — APV and capital rationing"),
        ("Step 3.1", "International Project Appraisal — cross-border NPV and FX risk"),
        ("Step 4.1", "Cost of Capital — WACC and CAPM (where the discount rate comes from)"),
        ("Step 5.1", "Capital Structure — debt vs equity, Modigliani-Miller"),
        ("Step 6.1", "Company Valuation — DCF, multiples, asset-based methods"),
        ("Step 7.1", "Mergers and Acquisitions — valuing targets, deal structures, EMH"),
        ("Step 8.1", "Interest Rate Risk — FRAs, swaps, hedging"),
        ("Step 9.1", "Currency Risk — forwards, options, transaction exposure"),
        ("Step 10.1", "Dividend Policy — payout theories and signalling"),
    ]:
        story.append(Paragraph(f"<b>{step}</b>  —  {desc}", ST["arc"]))
    story.append(Spacer(1, 8))
    story.append(fact(
        "Everything that follows is built on this step. NPV, free cash flow, and discounting "
        "reappear in every step after it — master them here and the rest of the course is depth, not new ground."
    ))
    story.append(Spacer(1, 6))

    # ── SECTION 1: FREE CASH FLOW ──────────────────────────────────────────
    story += section("CONCEPT 01", "Free Cash Flow — What Your Company Actually Earns")
    story.append(body(
        "Every investment decision starts with one question: how much cash will this actually produce? "
        "Not accounting profit — cash. Profit is what the income statement shows after adjustments for "
        "depreciation, accruals, and timing. Cash is what lands in your account."
    ))
    story.append(body(
        "Free cash flow (FCF) is the cash left after your company has covered its operating costs, paid tax, "
        "and reinvested what it needs to keep running and growing. It belongs to everyone who put capital in — "
        "both debt holders and shareholders. Think of it as the true earnings of the business."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("FCF to the Firm"))
    story.append(body(
        "Start with operating profit before interest and tax (PBIT). Add back depreciation — it reduced profit "
        "on paper but no cash left when the charge was recorded (it left when you bought the asset). "
        "Deduct tax paid, then subtract the cash the business needs to invest to stay operational."
    ))
    story.append(calc_table([
        ("Net operating profit (PBIT)", "X"),
        ("+ Depreciation (non-cash, add back)", "X"),
        ("− Taxation", "(X)"),
        ("Operating cash flows", "X", True),
        ("− Replacement of non-current assets (RAI)", "(X)"),
        ("− Incremental non-current assets (IAI)", "(X)"),
        ("− Incremental working capital (IWCI)", "(X)"),
        ("Free cash flow to the firm", "X", True),
    ], title="FCF to the Firm"))

    story.append(h3("FCF to Equity"))
    story.append(body(
        "Once you have FCF to the firm, debt holders take their share first. "
        "What remains belongs to shareholders."
    ))
    story.append(calc_table([
        ("Free cash flow to the firm", "X"),
        ("− Debt interest paid", "(X)"),
        ("− Loan repayments", "(X)"),
        ("+ New debt raised", "X"),
        ("Free cash flow to equity", "X", True),
    ], title="FCF to Equity"))

    story.append(h3("Worked Example — Zambeef Processing Division"))
    story.append(body(
        "Zambeef is reviewing the cash position of one of its cold-chain facilities. "
        "Figures are in ZMW '000:"
    ))
    story.append(table_std([
        ["Item", "ZMW '000"],
        ["Operating profit (PBIT)", "300"],
        ["Depreciation", "120"],
        ["Tax paid", "(140)"],
        ["Replacement capex (RAI)", "(10)"],
        ["New investment capex (IAI)", "(15)"],
        ["Increase in working capital (IWCI)", "(50)"],
        ["Interest paid", "(5)"],
        ["Loan repaid", "(20)"],
    ], [CONTENT_W * 0.72, CONTENT_W * 0.28]))

    story.append(callout(
        "FCF to the firm:  300 + 120 − 140 − 10 − 15 − 50  =  ZMW 205,000\n"
        "FCF to equity:    205 − 5 − 20  =  ZMW 180,000"
    ))
    story.append(fact(
        "Free cash flow is what remains after the company has kept running, replaced its assets, "
        "and funded its growth — it is what actually belongs to investors, not the profit number on the income statement."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 2: NPV ─────────────────────────────────────────────────────
    story += section("CONCEPT 02", "Net Present Value — The Right Way to Say Yes or No")
    story.append(body(
        "Your company is deciding whether to invest ZMW 24,000 in a new distribution route. "
        "The route will generate cash for five years. The question is not whether total cash in exceeds "
        "ZMW 24,000 — it's whether those future cash flows are worth ZMW 24,000 today."
    ))
    story.append(body(
        "Money received in the future is worth less than money today. ZMW 7,800 arriving in one year "
        "is not the same as ZMW 7,800 now — because ZMW 7,800 now could be invested and earn a return. "
        "NPV accounts for this by discounting all future cash flows back to today's value."
    ))
    story.append(formula_box([
        "Discount Factor  =  (1 + r)^−n  =  1 / (1 + r)^n",
        "",
        "At cost of capital 10%:",
        "  Year 1: 1 / (1.10)¹ = 0.909",
        "  Year 2: 1 / (1.10)² = 0.826",
        "  Year 3: 1 / (1.10)³ = 0.751",
        "",
        "Rule: NPV > 0 → accept.   NPV < 0 → reject.",
    ]))

    story.append(h3("Worked Example — Distribution Project"))
    story.append(table_std([
        ["Year", "Cash Flow (ZMW)", "Discount Factor (10%)", "Present Value (ZMW)"],
        ["0", "(24,000)", "1.000", "(24,000)"],
        ["1", "7,800", "0.909", "7,090"],
        ["2", "6,000", "0.826", "4,956"],
        ["3", "4,200", "0.751", "3,154"],
        ["4", "7,400", "0.683", "5,054"],
        ["5", "9,200", "0.621", "5,713"],
        ["", "", "NPV =", "1,967"],
    ], [1.5*cm, 3.2*cm, 3.5*cm, 3.0*cm]))

    story.append(body(
        "NPV = ZMW 1,967. The project creates ZMW 1,967 of value in today's money, above and beyond "
        "recovering the investment and earning the required 10% return. Accept it."
    ))
    story.append(fact(
        "A positive NPV means today's value of future earnings exceeds the cost of the investment — "
        "the project creates wealth for your company."
    ))
    story.append(Spacer(1, 8))

    # ── DISCUSSION QUESTION 1 ──────────────────────────────────────────────
    story.append(discussion_q(
        "<i>Your company is comparing two projects. Project A: NPV of ZMW 1,967, requires ZMW 24,000. "
        "Project B: NPV of ZMW 1,400, requires ZMW 10,000. You can only fund one. Which do you choose — "
        "and does the answer change if you have ZMW 50,000 available? What does your decision reveal about "
        "how you think about allocating capital inside the business?</i>"
    ))

    # ── SECTION 3: DPP ─────────────────────────────────────────────────────
    story += section("CONCEPT 03", "Discounted Payback — When Do You Get Your Money Back?")
    story.append(body(
        "Discounted payback period (DPP) is how long it takes for the cumulative present value of cash "
        "inflows to recover the initial investment. It's a stricter version of simple payback — "
        "you're asking when you get your money back in real terms, after accounting for the time value of money."
    ))
    story.append(body(
        "A project is acceptable if its DPP falls within the company's target. "
        "Using the same ZMW 24,000 distribution project:"
    ))
    story.append(table_std([
        ["Year", "Cash Flow (ZMW)", "Discount Factor", "Present Value (ZMW)", "Cumulative PV (ZMW)"],
        ["0", "(24,000)", "1.000", "(24,000)", "(24,000)"],
        ["1", "7,800", "0.909", "7,090", "(16,910)"],
        ["2", "6,000", "0.826", "4,956", "(11,954)"],
        ["3", "4,200", "0.751", "3,154", "(8,800)"],
        ["4", "7,400", "0.683", "5,054", "(3,746)"],
        ["5", "9,200", "0.621", "5,713", "1,967"],
    ], [1.2*cm, 2.5*cm, 2.2*cm, 2.8*cm, 2.8*cm]))

    story.append(formula_box([
        "DPP = 4 + (3,746 / 5,713) = 4 + 0.66 = 4.66 years",
        "",
        "The remaining shortfall after Year 4 is ZMW 3,746.",
        "Year 5 brings in PV of ZMW 5,713 — recovery happens 3,746/5,713 through Year 5.",
        "",
        "If the target payback is 4 years, this project does not meet it.",
        "Note: the project still has a positive NPV. DPP and NPV can conflict.",
    ]))

    story.append(fact(
        "Discounted payback tells you when you recover your investment in real terms — use it as a "
        "liquidity check, not as the main decision rule. A project can miss the payback target and still be worth doing."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: IRR ─────────────────────────────────────────────────────
    story += section("CONCEPT 04", "Internal Rate of Return — The Break-Even Discount Rate")
    story.append(body(
        "The internal rate of return (IRR) is the discount rate that makes NPV equal to zero. "
        "It's the rate your project earns on the capital tied up in it. "
        "If your company's cost of capital is 10% and the project earns 13%, it clears the hurdle. Accept it."
    ))
    story.append(body(
        "IRR is found by interpolation: calculate NPV at two different discount rates — one that gives a "
        "positive NPV and one that gives a negative NPV — then estimate where NPV crosses zero."
    ))
    story.append(formula_box([
        "IRR = A + [ a / (a − b) ] × (B − A)",
        "",
        "A = lower discount rate with positive NPV (a)",
        "B = higher discount rate with negative NPV (b)",
    ]))

    story.append(h3("Worked Example"))
    story.append(body(
        "Same ZMW 24,000 project. Calculate NPV at 10% and 14%:"
    ))
    story.append(table_std([
        ["Year", "Cash Flow", "DF at 10%", "PV at 10%", "DF at 14%", "PV at 14%"],
        ["0", "(24,000)", "1.000", "(24,000)", "1.000", "(24,000)"],
        ["1", "7,800", "0.909", "7,090", "0.877", "6,841"],
        ["2", "6,000", "0.826", "4,956", "0.769", "4,614"],
        ["3", "4,200", "0.751", "3,154", "0.675", "2,835"],
        ["4", "7,400", "0.683", "5,054", "0.592", "4,381"],
        ["5", "9,200", "0.621", "5,713", "0.477", "4,775"],
        ["", "", "NPV =", "1,967", "NPV =", "(554)"],
    ], [1.2*cm, 1.8*cm, 1.6*cm, 1.7*cm, 1.6*cm, 1.7*cm]))

    story.append(formula_box([
        "IRR = 10% + [ 1,967 / (1,967 + 554) ] × (14% − 10%)",
        "    = 10% + [ 1,967 / 2,521 ] × 4%",
        "    = 10% + 3.12%  =  13.12%",
        "",
        "IRR (13.12%) > cost of capital (10%) → accept.",
    ]))

    story.append(h3("Where IRR Fails"))
    story.append(body(
        "IRR has two problems that matter in practice."
    ))
    story.append(bullet(
        "<b>Multiple IRRs.</b> If a project has cash flows that change sign more than once — "
        "an outflow mid-project, for example — there can be two or more IRRs. "
        "The accept/reject rule breaks down completely."
    ))
    story.append(bullet(
        "<b>Unrealistic reinvestment assumption.</b> IRR assumes that every kwacha of cash "
        "generated by the project is immediately reinvested at the IRR itself. For a project "
        "with 13% IRR, that means finding 13% returns for reinvested cash throughout the project life. "
        "That is almost never possible. NPV avoids this problem by assuming reinvestment at the cost of capital."
    ))
    story.append(fact(
        "IRR tells you the break-even discount rate — not the actual return — unless cash flows "
        "can genuinely be reinvested at that same rate throughout the project. In most real projects, they cannot."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 5: MIRR ────────────────────────────────────────────────────
    story += section("CONCEPT 05", "Modified IRR — A More Honest Return")
    story.append(body(
        "MIRR fixes IRR's reinvestment problem by separating the two rates: your cost of capital "
        "for outflows, and a realistic reinvestment rate for inflows. It asks: given what you can "
        "actually earn on cash coming back during the project, what is the real return?"
    ))
    story.append(formula_box([
        "MIRR = ⁿ√( FVCF / PVCF ) − 1",
        "",
        "FVCF = future value of inflows, compounded at the reinvestment rate",
        "PVCF = present value of outflows, discounted at cost of capital",
        "n    = project life in years",
        "",
        "Step 1: Discount all outflows to Year 0 at cost of capital.",
        "Step 2: Compound all inflows to Year n at the reinvestment rate.",
        "Step 3: Calculate the rate that equates PVCF and FVCF over n years.",
    ]))

    story.append(h3("Worked Example"))
    story.append(body(
        "Same ZMW 24,000 project. Cost of capital: 10%. Reinvestment rate: 12%."
    ))
    story.append(body(
        "Step 1: Outflow at Year 0 = ZMW 24,000 (already at present value)."
    ))
    story.append(body(
        "Step 2: Compound each inflow to Year 5 at 12%:"
    ))
    story.append(table_std([
        ["Year", "Cash Flow (ZMW)", "Compound Factor", "Future Value at Year 5 (ZMW)"],
        ["1", "7,800", "1.12⁴ = 1.5735", "12,273"],
        ["2", "6,000", "1.12³ = 1.4049", "8,430"],
        ["3", "4,200", "1.12² = 1.2544", "5,268"],
        ["4", "7,400", "1.12¹ = 1.1200", "8,288"],
        ["5", "9,200", "1.12⁰ = 1.0000", "9,200"],
        ["", "", "Total FVCF =", "43,459"],
    ], [1.2*cm, 3.0*cm, 2.8*cm, 3.5*cm]))

    story.append(formula_box([
        "MIRR = ⁵√( 43,459 / 24,000 ) − 1",
        "     = ⁵√( 1.8108 ) − 1",
        "     = 1.1260 − 1",
        "     =  12.6%",
        "",
        "MIRR (12.6%) > cost of capital (10%) → project is acceptable.",
        "",
        "Compare: IRR was 13.12%. MIRR gives the lower, more honest figure.",
        "IRR overstated the return by assuming 13.12% reinvestment.",
    ]))

    story.append(fact(
        "MIRR replaces IRR's impossible reinvestment assumption with a rate you actually expect to earn — "
        "giving a more accurate picture of what the project truly returns to your business."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: INFLATION AND TAX ───────────────────────────────────────
    story += section("CONCEPT 06", "Inflation and Tax — Two Adjustments You Cannot Skip")

    story.append(h3("Handling Inflation"))
    story.append(body(
        "Inflation affects both cash flows and discount rates. You can handle it two ways — "
        "both give the same NPV when done correctly."
    ))
    story.append(bullet(
        "<b>Nominal method.</b> Inflate each cash flow at its specific rate, then discount at the "
        "nominal cost of capital. Use this when different items inflate at different rates — "
        "wages at 8%, raw materials at 5%, selling prices at 6%."
    ))
    story.append(bullet(
        "<b>Real method.</b> Strip inflation from cash flows and discount at the real rate. "
        "Only works when everything inflates uniformly at the general rate."
    ))
    story.append(formula_box([
        "Fisher Equation: (1 + nominal rate) = (1 + real rate) × (1 + inflation rate)",
        "",
        "Example: real rate 5%, inflation 8%",
        "Nominal rate = (1.05 × 1.08) − 1 = 13.4%",
    ]))

    story.append(h3("Handling Tax"))
    story.append(body(
        "Tax affects investment appraisal in two ways. First, the company pays tax on operating cash flows — "
        "this is an outflow that reduces FCF. Second, tax allowable depreciation (capital allowances) "
        "reduces taxable profit, generating a tax saving that acts as a cash inflow."
    ))
    story.append(callout(
        "Always include: (1) tax on operating cash flows as an outflow, and "
        "(2) the tax saving from capital allowances as an inflow. "
        "Leaving either out will give you the wrong NPV."
    ))
    story.append(fact(
        "Tax on operating flows reduces your FCF. Capital allowances reduce your tax bill. "
        "Both are real cash movements and both change the NPV of a project."
    ))
    story.append(Spacer(1, 10))

    # ── DISCUSSION QUESTION 2 ──────────────────────────────────────────────
    story.append(discussion_q(
        "<i>First Quantum is evaluating a ZMW 3 million processing upgrade. Cash flows: ZMW 600,000 in Year 1, "
        "increasing by ZMW 160,000 each year for five more years. The cost of capital is 21% and the "
        "reinvestment rate is 8%. Would you calculate IRR or MIRR first — and why does the gap between "
        "those two rates matter more for a long-horizon project than a short one?</i>"
    ))

    story.append(PageBreak())

    # ── KEY TERMS ──────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    story.append(table_std([
        ["Term", "Definition"],
        ["Free Cash Flow (FCF)", "Cash available after operating costs, tax, and reinvestment in working capital and fixed assets"],
        ["FCF to the Firm", "FCF available to all providers of capital — debt holders and equity holders"],
        ["FCF to Equity", "FCF remaining for shareholders after interest and loan repayments"],
        ["PBIT", "Profit before interest and tax — the starting point for FCF calculation"],
        ["Net Present Value (NPV)", "Sum of all discounted future cash flows minus the initial investment"],
        ["Discount Factor", "Multiplier that converts a future cash flow to present value: 1 / (1+r)^n"],
        ["Discounted Payback Period (DPP)", "Time to recover the initial investment using present-value cash flows"],
        ["Internal Rate of Return (IRR)", "The discount rate at which NPV = 0; the project's break-even rate"],
        ["Modified IRR (MIRR)", "IRR recalculated using a realistic reinvestment rate, giving a more accurate return figure"],
        ["Reinvestment Rate", "The rate at which interim cash flows are actually expected to be reinvested; used in MIRR"],
        ["Cost of Capital", "The required return used as the discount rate; derived from WACC/CAPM in Step 4.1"],
        ["Nominal Rate", "The stated rate, including inflation"],
        ["Real Rate", "The rate adjusted for inflation"],
        ["Fisher Equation", "(1 + nominal) = (1 + real) × (1 + inflation) — links the three rates"],
        ["Capital Allowance", "Tax-deductible depreciation that generates a tax saving on investments"],
        ["RAI / IAI / IWCI", "Replacement assets / Incremental assets / Incremental working capital — the three investment deductions in FCF"],
    ], [4.5*cm, CONTENT_W - 4.5*cm]))

    # ── LEARNING OUTCOMES ──────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able to Do")
    for i, outcome in enumerate([
        "Calculate free cash flow to the firm and free cash flow to equity from accounting data",
        "Apply the NPV decision rule and explain in plain terms what a positive NPV means",
        "Calculate the discounted payback period and identify when it conflicts with NPV",
        "Compute IRR by linear interpolation and apply the accept/reject rule",
        "Explain the two main limitations of IRR: multiple IRRs and the reinvestment assumption",
        "Calculate MIRR and explain why it gives a more accurate return figure than IRR",
        "Handle inflation in NPV analysis using both the nominal and real methods",
        "Identify the two ways tax affects appraisal: tax on operating flows and capital allowance savings",
    ], 1):
        story.append(Paragraph(f"{i}.  {outcome}", ST["outcome"]))

    story.append(Spacer(1, 16))
    story.append(h3("Where You Go Next"))
    story.append(body(
        "You came in with the full map of the course (look back at the first page). You now own the "
        "first piece of it — the toolkit every other step leans on. <b>Step 2.1 — Advanced Investment "
        "Appraisal</b> takes the same NPV machinery and handles the harder cases: projects financed "
        "partly by debt (APV), and what you do when you can't fund every good project at once "
        "(capital rationing)."
    ))
    story.append(body(
        "Nothing in Step 2.1 replaces what you learned here — it extends it. That is the whole idea: "
        "you are not starting over each step, you are deepening one picture you already hold."
    ))

    # ── COMMUNITY CLOSER ───────────────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
