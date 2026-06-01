"""
Booklesss — Revenue Model & Growth Plan
Internal reference: financial model, pricing, rollout plan
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
import os

# ── FONTS ──────────────────────────────────────────────────────────────────
FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "fonts")

def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, filename)))

_reg("Body",            "Aptos.ttf")
_reg("Body-Bold",       "Aptos-Bold.ttf")
_reg("Body-Italic",     "Aptos-Italic.ttf")
_reg("Body-BoldItalic", "Aptos-Bold-Italic.ttf")
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold",
                              italic="Body-Italic", boldItalic="Body-BoldItalic")
_reg("Display-Bold",    "parkinsans-v3-latin-700.ttf")
_reg("Title",           "Parastoo.ttf")
_reg("Title-Bold",      "Parastoo-Bold.ttf")
pdfmetrics.registerFontFamily("Title", normal="Title", bold="Title-Bold",
                              italic="Title", boldItalic="Title-Bold")

# ── BRAND ASSETS ───────────────────────────────────────────────────────────
BRAND_DIR   = os.path.join(os.path.dirname(__file__), "..", "brand")
LOGO_BLACK  = os.path.join(BRAND_DIR, "booklesss-logo-black.png")
MARK_BLACK  = os.path.join(BRAND_DIR, "booklesss-mark-black.png")
GRAIN       = os.path.join(BRAND_DIR, "grain.png")
_logo_black = ImageReader(LOGO_BLACK) if os.path.exists(LOGO_BLACK) else None
_mark_black = ImageReader(MARK_BLACK) if os.path.exists(MARK_BLACK) else None
_grain      = ImageReader(GRAIN)      if os.path.exists(GRAIN)      else None

# ── PALETTE ────────────────────────────────────────────────────────────────
C_COVER      = colors.HexColor("#FFFDE8")
C_PAGE       = colors.HexColor("#FFFEF2")
TITLE_DARK   = colors.HexColor("#121212")
HEADING_DARK = colors.HexColor("#3D3D3D")
C_JADE       = colors.HexColor("#2FB99A")
C_JADE_DK    = colors.HexColor("#0E5E52")
C_INK        = colors.HexColor("#16201A")
C_STEEL      = colors.HexColor("#5F6B65")
C_MIST       = colors.HexColor("#6E6A5E")
C_RULE       = colors.HexColor("#E0DACB")
BG_FORMULA   = colors.HexColor("#E9F0EA")
BG_CALLOUT   = colors.HexColor("#E7F3ED")

# ── PAGE GEOMETRY ──────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..", "operations")
OUT_PATH = os.path.join(OUT_DIR, "Revenue Model - Booklesss.pdf")

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
            leading=16, spaceAfter=6, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_JADE_DK,
            leading=16, alignment=TA_LEFT),
        "th": ParagraphStyle("th",
            fontName="Body-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Body", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "note": ParagraphStyle("note",
            fontName="Body-Italic", fontSize=8.5, textColor=C_MIST,
            leading=13, spaceAfter=4, alignment=TA_LEFT),
        "phase_label": ParagraphStyle("phase_label",
            fontName="Body-Bold", fontSize=8.5, textColor=C_JADE_DK,
            leading=13, alignment=TA_LEFT),
    }

ST = make_styles()

# ── CANVAS CALLBACKS ───────────────────────────────────────────────────────
def _paint_paper(canvas, bg):
    canvas.setFillColor(bg)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    if _grain is not None:
        canvas.drawImage(_grain, 0, 0, width=W, height=H, mask="auto")

def cover_bg(canvas, doc):
    canvas.saveState()
    _paint_paper(canvas, C_COVER)
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
    canvas.drawRightString(W - MX, top_y, "INTERNAL PLANNING")
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
    canvas.drawString(MX, H - MY + 7, "Revenue Model & Growth Plan")
    canvas.drawRightString(W - MX, H - MY + 7, "May 2026 — Internal")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "Internal Planning")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")
    canvas.restoreState()

# ── HELPERS ────────────────────────────────────────────────────────────────
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_JADE,
                    spaceAfter=10, spaceBefore=4)
    hr.keepWithNext = 1
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

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"), ParagraphStyle("cbt", fontName="Body",
                  fontSize=10, textColor=C_JADE_DK, leading=16, alignment=TA_LEFT))
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

def phase_marker(text):
    p = Paragraph(text, ST["phase_label"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_FORMULA),
        ('LINEBEFORE',    (0,0), (-1,-1), 3, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([Spacer(1, 4), t, Spacer(1, 3)])

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

# ── COVER MOTIF ────────────────────────────────────────────────────────────
class LogoTriple(Flowable):
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
        c.setFillAlpha(self.side_alpha)
        self._draw_mark(mid - step, self.side)
        self._draw_mark(mid + step, self.side)
        c.restoreState()
        self._draw_mark(mid, self.center)


class TripleDiamond(Flowable):
    def __init__(self, center_size=15, side_size=10, gap=13, color=None, stroke_width=1.3):
        super().__init__()
        self.cs, self.ss, self.gap = center_size, side_size, gap
        self.color = color or HEADING_DARK
        self.sw = stroke_width
        self._h = center_size

    def wrap(self, aw, ah):
        self._aw = aw
        return aw, self._h

    def _diamond(self, cx, cy, s):
        p = self.canv.beginPath()
        p.moveTo(cx,       cy + s/2)
        p.lineTo(cx + s/2, cy)
        p.lineTo(cx,       cy - s/2)
        p.lineTo(cx - s/2, cy)
        p.close()
        return p

    def draw(self):
        c = self.canv
        c.saveState()
        mid = getattr(self, "_aw", 100) / 2
        cy = self._h / 2
        step = self.cs / 2 + self.gap + self.ss / 2
        c.setStrokeColor(self.color)
        c.setLineWidth(self.sw)
        c.setFillColor(colors.white)
        c.drawPath(self._diamond(mid - step, cy, self.ss), stroke=1, fill=0)
        c.drawPath(self._diamond(mid + step, cy, self.ss), stroke=1, fill=0)
        c.setFillColor(self.color)
        c.drawPath(self._diamond(mid, cy, self.cs), stroke=0, fill=1)
        c.restoreState()


# ── BUILD ──────────────────────────────────────────────────────────────────
def build():
    doc = BaseDocTemplate(
        OUT_PATH,
        pagesize=A4,
        leftMargin=MX, rightMargin=MX,
        topMargin=MY + 12, bottomMargin=MY + 12,
    )

    cover_frame = Frame(0, 0, W, H, leftPadding=MX, rightPadding=MX,
                        topPadding=MY + 30, bottomPadding=MY, id="cover")
    body_frame  = Frame(MX, MY, W - 2*MX, H - 2*MY - 12,
                        leftPadding=0, rightPadding=0,
                        topPadding=12, bottomPadding=12, id="body")

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="body",  frames=[body_frame],  onPage=page_bg, onPageEnd=body_page),
    ])

    motif = LogoTriple(_mark_black) if _mark_black else TripleDiamond()
    story = []

    # ── COVER ─────────────────────────────────────────────────────────────
    story += [
        Spacer(1, 60),
        motif,
        Spacer(1, 32),
        Paragraph("BOOKLESSS — INTERNAL", ST["cover_step"]),
        Spacer(1, 8),
        Paragraph("Revenue Model<br/>&amp; Growth Plan", ST["cover_title"]),
        Spacer(1, 14),
        Paragraph(
            "Pricing structure, profitability thresholds, course rollout sequence, and team economics",
            ST["cover_sub"]),
        Spacer(1, 12),
        Paragraph("May 2026", ST["cover_meta"]),
        NextPageTemplate("body"),
        PageBreak(),
    ]

    # ── SECTION 1 — OVERVIEW ──────────────────────────────────────────────
    story += section("OVERVIEW", "What This Model Is Built On")
    story.append(body(
        "Booklesss delivers branded PDF study materials for Zambian university students "
        "through a Slack workspace. Revenue comes from two sources: full member subscriptions "
        "for workspace access, and per-course guest subscriptions. The model is built around "
        "Slack Business+ — one paid member seat unlocks five free single-channel guest slots."
    ))
    story.append(body(
        "Full members pay once and access every course channel. Guests pay per course they "
        "enroll in. Most students take four courses simultaneously, so each unique guest "
        "student generates revenue across four channels at once — the same 200-slot pool "
        "produces roughly K39,000 in guest revenue whether it holds 200 single-course students "
        "or 50 four-course students."
    ))
    story.append(body(
        "This document is the financial reference model. Actual performance is tracked "
        "against these projections monthly. Deviations in conversion rate, guest count, "
        "or overhead timing should be noted and the relevant phase thresholds recalculated."
    ))

    # ── SECTION 2 — PRICING ───────────────────────────────────────────────
    story += section("PRICING", "Subscription Rates")
    pricing_data = [
        ["Tier", "Rate", "Slack type", "Access", "Net to platform"],
        ["Full member", "K390/month", "Paid seat",
         "All channels", "K51 markup (seat costs K339)"],
        ["Guest", "K195/month", "Single-channel guest",
         "One course channel", "K195 — no Slack cost"],
    ]
    story.append(table_std(pricing_data,
        [65, 70, 90, 80, CONTENT_W - 305]))
    story.append(body(
        "Exchange rate: K18.82 per USD. Guest rate is half the full member rate. "
        "Guests stay at K195 for one month, then upgrade to K390 or leave. "
        "The K51 markup (K390 − K339 seat cost) is platform revenue only — "
        "it does not enter the 70/30 course split."
    ))
    story.append(fact(
        "40 full members from the launch campaign × K51 = K2,040/month fixed markup income "
        "before a single guest joins. K2,040 exceeds both Phase 1 (K1,054) and Phase 2 "
        "(K1,430) overhead — the platform is profitable from day 1 with zero guests."
    ))

    # ── SECTION 3 — CAMPAIGN MATH ─────────────────────────────────────────
    story += section("ACQUISITION", "Campaign Math")
    story.append(body(
        "The campaign targets full paying members. A K10,000 budget covers both flyer printing "
        "at K20 per flyer and a K50 commission paid to the campus distributor for each student "
        "who signs up and pays. At a 10% conversion rate that yields 40 full members. "
        "Their 40 seats unlock 200 single-channel guest slots across the workspace."
    ))
    story.append(formula_box([
        "Cost per flyer: K20 print + (10% × K50 commission) = K25 total per flyer",
        "K10,000 ÷ K25 = 400 flyers distributed",
        "400 × 10% conversion = 40 full members",
        "40 members × 5 guest slots = 200 guest slots unlocked",
        "",
        "Multi-course scenario: students taking 4 courses use 4 slots each",
        "200 slots ÷ 4 = 50 unique guest students at full utilisation",
        "Revenue: 50 × K195 × 4 courses = K39,000  vs.  200 × K195 = K39,000  (identical)",
    ]))
    story.append(body(
        "Recruiting 50 students who each take multiple courses is far easier than "
        "recruiting 200 separate people. The multi-course model lowers the acquisition "
        "target without changing the revenue ceiling."
    ))

    # ── SECTION 4 — REVENUE STRUCTURE ────────────────────────────────────
    story += section("REVENUE STRUCTURE", "How Money Flows")
    story.append(body(
        "Guest revenue moves through two stages. First, 5% comes off the top as team welfare — "
        "covering data, meals, and transport for the course team. This scales automatically "
        "as the course grows: the team eats better as guest numbers rise. "
        "The remaining 95% splits 70/30 between the course team and the platform."
    ))
    story.append(formula_box([
        "Guest revenue",
        "  − 5% team welfare  (data, meals, transport)",
        "  = distributable revenue",
        "      → Course team 70%:   Manager 42%  +  Sourcers 28%",
        "      → Platform 30%",
        "",
        "Platform total  =  Platform 30% of distributable  +  K2,040 full member markup",
        "Platform net    =  Platform total  −  Overhead",
    ]))
    story.append(body(
        "The course team's 70% is never touched by overhead. The platform bears all fixed "
        "costs from its 30% share plus the markup. The team earns from the first guest — "
        "and the platform is already profitable before the first guest ever joins."
    ))

    # ── SECTION 5 — OVERHEAD ──────────────────────────────────────────────
    story += section("OVERHEAD", "Cost Phases")
    story.append(body(
        "Overhead is structured in four phases. With K2,040/month in markup from 40 full "
        "members, Phases 1 and 2 are both active from launch — the markup alone covers them. "
        "Phases 3 and 4 unlock as guest revenue builds past the break-even thresholds. "
        "All manager costs are platform overhead, never deducted from the team's share."
    ))
    overhead_data = [
        ["Phase", "Trigger", "New cost", "Overhead"],
        ["1 — Launch",     "Course opens",   "Founder Slack K339 + Founder Claude K376 + Manager Slack K339", "K1,054"],
        ["2 — Activate",   "Launch (day 1)", "+ Manager Claude $20 (K376) — markup covers it immediately",     "K1,430"],
        ["3 — Scale",      "17 guests",      "+ Founder Claude upgrade to $100 (+K1,506)",                     "K2,936"],
        ["4 — Full build", "44 guests",      "+ Manager Claude upgrade to $100 (+K1,506)",                     "K4,442"],
    ]
    story.append(table_std(overhead_data,
        [70, 72, CONTENT_W - 70 - 72 - 65, 65]))

    # ── SECTION 6 — PROFITABILITY TABLES ─────────────────────────────────
    story += section("PROFITABILITY", "Full Model by Guest Count")
    story.append(body(
        "Table A shows what the course team earns at each guest count. "
        "Table B shows what the platform earns, including the K2,040/month fixed markup "
        "from 40 full members. Phases 1 and 2 are profitable at zero guests. "
        "Phase 3 break-even is at 17 guests; Phase 4 at 44 guests. "
        "✓ marks the first row where each phase covers its overhead."
    ))

    # TABLE A — Team Earnings
    story.append(h3("Table A — Team Earnings (per course, per month)"))
    cw_a = [55, 62, 73, 82, CONTENT_W - 272]
    hdr_a = ["Guests", "Revenue", "Welfare 5%", "Manager 42%", "Sourcers 28%"]

    story.append(phase_marker("Phases 1 & 2 — overhead K1,430  |  both active from launch"))
    story.append(table_std([
        hdr_a,
        ["0 ✓",  "K0",      "K0",    "K0",      "K0"],
        ["10",   "K1,950",  "K98",   "K778",    "K519"],
        ["20",   "K3,900",  "K195",  "K1,556",  "K1,037"],
        ["30",   "K5,850",  "K293",  "K2,334",  "K1,556"],
    ], cw_a))

    story.append(phase_marker("Phase 3 — overhead K2,936  |  upgrade founder Claude at 17 guests"))
    story.append(table_std([
        hdr_a,
        ["17 ✓", "K3,315",  "K166",  "K1,323",  "K882"],
        ["50",   "K9,750",  "K488",  "K3,891",  "K2,594"],
    ], cw_a))

    story.append(phase_marker("Phase 4 — overhead K4,442  |  upgrade manager Claude at 44 guests"))
    story.append(table_std([
        hdr_a,
        ["44 ✓",    "K8,580",  "K429",   "K3,423",  "K2,282"],
        ["100",     "K19,500", "K975",   "K7,781",  "K5,187"],
        ["200 max", "K39,000", "K1,950", "K15,561", "K10,374"],
    ], cw_a))

    # TABLE B — Platform Economics
    story.append(h3("Table B — Platform Economics (per course, per month)"))
    cw_b = [55, 70, 62, 70, CONTENT_W - 257]
    hdr_b = ["Guests", "Plat. 30%", "Markup", "Overhead", "Net"]

    story.append(phase_marker("Phases 1 & 2 — overhead K1,430  |  profitable at 0 guests"))
    story.append(table_std([
        hdr_b,
        ["0 ✓",  "K0",      "K2,040", "K1,430", "+K610"],
        ["10",   "K556",    "K2,040", "K1,430", "+K1,166"],
        ["20",   "K1,112",  "K2,040", "K1,430", "+K1,722"],
        ["30",   "K1,667",  "K2,040", "K1,430", "+K2,277"],
    ], cw_b))

    story.append(phase_marker("Phase 3 — overhead K2,936  |  break-even at 17 guests"))
    story.append(table_std([
        hdr_b,
        ["17 ✓", "K945",    "K2,040", "K2,936", "+K49"],
        ["50",   "K2,779",  "K2,040", "K2,936", "+K1,883"],
    ], cw_b))

    story.append(phase_marker("Phase 4 — overhead K4,442  |  break-even at 44 guests"))
    story.append(table_std([
        hdr_b,
        ["44 ✓",    "K2,445",  "K2,040", "K4,442", "+K43"],
        ["100",     "K5,558",  "K2,040", "K4,442", "+K3,156"],
        ["200 max", "K11,115", "K2,040", "K4,442", "+K8,713"],
    ], cw_b))

    story.append(Paragraph(
        "✓ = phase break-even. Net = Plat. 30% + Markup − Overhead. "
        "Plat. 30% = guests × K195 × 95% × 30% = guests × K55.58.",
        ST["note"]))

    # ── SECTION 7 — MILESTONES ────────────────────────────────────────────
    story += section("MILESTONES", "Decision Points")
    story.append(body(
        "Each milestone marks a threshold where the platform activates the next level of "
        "tooling. With K2,040 in monthly markup, Phases 1 and 2 are both active from launch. "
        "Only Phases 3 and 4 require guest revenue to unlock."
    ))
    milestones_data = [
        ["Guests", "Trigger", "Action"],
        ["0 (launch)", "Campaign complete — 40 full members",
         "Open course. Activate manager Claude $20 immediately — markup covers Phase 2 from day 1"],
        ["17", "Phase 3 break-even",
         "Upgrade founder Claude to $100 (K1,882/month). Net goes from +K1,883 to +K49 then builds"],
        ["44", "Phase 4 break-even",
         "Upgrade manager Claude to $100 (K1,882/month). Net goes from +K3,156 to +K43 then builds"],
        ["200", "All slots filled",
         "K8,713 net, team earning K27,885 — open waitlist for next course"],
    ]
    story.append(table_std(milestones_data,
        [55, 145, CONTENT_W - 200]))

    # ── SECTION 8 — ROLLOUT ───────────────────────────────────────────────
    story += section("ROLLOUT", "Course Launch Sequence")
    story.append(body(
        "No course opens without at least one confirmed guest commitment — this confirms "
        "real demand before hiring a manager. The threshold is low because the K2,040 markup "
        "already covers all overhead through Phase 2 from launch."
    ))
    rollout_data = [
        ["Course", "Min. guests", "Why"],
        ["Course 1", "1 committed",
         "K2,040 markup > K1,054 overhead — profitable immediately"],
        ["Course 2", "1 committed",
         "K2,040 > K1,393 (adds K339 manager seat) — still covered by markup"],
        ["Course 3", "1 committed",
         "K2,040 > K1,732 (adds another K339) — still covered"],
        ["Course 4", "1 committed",
         "K2,040 vs K2,071 (adds third K339) — K31 gap, covered by 1 guest"],
    ]
    story.append(table_std(rollout_data,
        [60, 90, CONTENT_W - 150]))
    story.append(callout(
        "Rollout sequence:\n"
        "Campaign → 40 full members (200 guest slots unlocked)\n"
        "→ Waitlist opens for Course 1\n"
        "→ 1 guest committed → Course 1 launches, manager hired\n"
        "→ Waitlist opens for Course 2\n"
        "→ 1 guest committed → Course 2 launches, manager hired\n"
        "→ Repeat for Courses 3 and 4\n"
        "\n"
        "At four courses running with 50 four-course students: K39,000/month total guest revenue."
    ))

    # ── SECTION 9 — TEAM STRUCTURE ───────────────────────────────────────
    story += section("TEAM", "Course Team Structure")
    story.append(body(
        "Each course has one matched team. The Manager handles everything for that course — "
        "content delivery, community management, and marketing. Sourcers bring in source "
        "material and student referrals. Manager and Sourcers apply for a specific course "
        "and are matched before launch. No person crosses courses."
    ))
    story.append(formula_box([
        "Manager:   42% of distributable guest revenue",
        "Sourcers:  28% of distributable guest revenue  (split among the sourcing team)",
        "Welfare:    5% of gross guest revenue  (data, meals, transport — off the top)",
        "",
        "At 200 guests max:  Manager K15,561  +  Sourcers K10,374  +  Welfare K1,950  =  K27,885 to team",
    ]))
    story.append(body(
        "Welfare is not a fixed amount — it grows with the course. "
        "At 10 guests the pool is K98. At 200 guests it is K1,950. "
        "Data stays covered throughout. Meals and transport become meaningful as the "
        "course matures and in-person sessions become regular."
    ))
    story.append(fact(
        "All platform overhead — founder Slack, founder Claude, manager Slack seat, "
        "manager Claude — is borne by the platform from its 30% share and the full member "
        "markup. The course team's 70% is never reduced by overhead at any stage."
    ))

    # ── SECTION 10 — WEEKLY PAYOUTS ──────────────────────────────────────
    story += section("PAYMENT CADENCE", "Weekly Team Payouts")
    story.append(body(
        "Students pay monthly. The team gets paid weekly. Each student payment received "
        "during the week is split immediately and batched into a single Friday mobile money "
        "transfer to the Manager and Sourcers. No waiting until month-end."
    ))
    story.append(formula_box([
        "Per student payment received:",
        "  K195 × 5%  = K9.75  welfare (retained for team data/meals/transport pool)",
        "  K195 × 95% = K185.25  distributable",
        "    → Manager  42% = K77.81",
        "    → Sourcers 28% = K51.87  (divided among sourcing team)",
        "    → Platform 30% = K55.58  (retained by platform)",
    ]))
    story.append(h3("Weekly Payout by Batch Size"))
    story.append(body(
        "If N students pay in the same week, multiply by N. "
        "Payments trickle across the month — some weeks are heavier than others. "
        "Pay what came in that week. Do not hold."
    ))
    payout_data = [
        ["Guests paid", "Gross", "Welfare", "Manager", "Sourcers", "Platform share"],
        ["1",   "K195",    "K9.75",  "K77.81",   "K51.87",   "K55.58"],
        ["5",   "K975",    "K48.75", "K389.03",  "K259.35",  "K277.88"],
        ["10",  "K1,950",  "K97.50", "K778.05",  "K518.70",  "K555.75"],
        ["20",  "K3,900",  "K195",   "K1,556.10","K1,037.40","K1,111.50"],
        ["50",  "K9,750",  "K487.50","K3,890.25","K2,593.50","K2,778.75"],
    ]
    story.append(table_std(payout_data,
        [70, 55, 55, 72, 72, CONTENT_W - 324]))
    story.append(body(
        "Full member markup (K2,040/month) goes entirely to the platform and is not "
        "distributed weekly to the team. Transfer it to the platform account once per month "
        "as members pay their subscriptions."
    ))
    story.append(callout(
        "How to run it each Friday:\n"
        "1. Open your payment log (WhatsApp thread or spreadsheet)\n"
        "2. Sum all guest payments received Monday–Friday\n"
        "3. Apply the formula: Gross × 95% × 42% → Manager, × 28% → Sourcers\n"
        "4. Transfer via Airtel/MTN Mobile Money — same day\n"
        "5. Log: 'Week ending [date] — [N] payments — Manager K[X] sent ✓'\n"
        "\n"
        "Keep every transfer receipt. This is the record actual performance is measured against."
    ))
    story.append(fact(
        "Weekly payments are motivating and low-risk. You only pay money already received — "
        "there is no float or advance. If a student is late paying, that week's batch is "
        "simply smaller. The formula never changes."
    ))

    doc.build(story)
    print(f"Done: {OUT_PATH}")


if __name__ == "__main__":
    build()
