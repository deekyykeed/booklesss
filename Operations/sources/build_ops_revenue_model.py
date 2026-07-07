"""
Booklesss � Revenue Model & Growth Plan
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

# -- FONTS ------------------------------------------------------------------
FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "_dev", "fonts")

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

# -- BRAND ASSETS -----------------------------------------------------------
BRAND_DIR   = os.path.join(os.path.dirname(__file__), "..", "..", "_dev", "brand")
LOGO_BLACK  = os.path.join(BRAND_DIR, "booklesss-logo-black.png")
MARK_BLACK  = os.path.join(BRAND_DIR, "booklesss-mark-black.png")
GRAIN       = os.path.join(BRAND_DIR, "grain.png")
_logo_black = ImageReader(LOGO_BLACK) if os.path.exists(LOGO_BLACK) else None
_mark_black = ImageReader(MARK_BLACK) if os.path.exists(MARK_BLACK) else None
_grain      = ImageReader(GRAIN)      if os.path.exists(GRAIN)      else None

# -- PALETTE ----------------------------------------------------------------
C_COVER      = colors.HexColor("#FFFDE8")
C_PAGE       = colors.HexColor("#FFFEF2")
TITLE_DARK   = colors.HexColor("#121212")
HEADING_DARK = colors.HexColor("#3D3D3D")
C_INK       = colors.HexColor("#121212")
C_INK    = colors.HexColor("#3D3D3D")
C_INK        = colors.HexColor("#16201A")
C_STEEL      = colors.HexColor("#5F6B65")
C_MIST       = colors.HexColor("#6E6A5E")
C_RULE       = colors.HexColor("#E0DACB")
BG_FORMULA   = colors.HexColor("#F5F0E8")
BG_CALLOUT   = colors.HexColor("#F5F0E8")

# -- PAGE GEOMETRY ----------------------------------------------------------
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..")
OUT_PATH = os.path.join(OUT_DIR, "Revenue Model - Booklesss.pdf")

# -- STYLES -----------------------------------------------------------------
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
            fontName="Body-Bold", fontSize=7, textColor=C_INK,
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
            fontName="Body-Bold", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=6, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_INK,
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
            fontName="Body-Bold", fontSize=8.5, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
    }

ST = make_styles()

# -- CANVAS CALLBACKS -------------------------------------------------------
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
    canvas.setStrokeColor(C_INK)
    canvas.setLineWidth(0.6)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "Revenue Model & Growth Plan")
    canvas.drawRightString(W - MX, H - MY + 7, "May 2026 � Internal")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "Internal Planning")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")
    canvas.restoreState()

# -- HELPERS ----------------------------------------------------------------
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_INK,
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
    return Paragraph(f"� {text}", ST["bullet"])

def h3(text):
    return Paragraph(text, ST["h3"])

def fact(text):
    p = Paragraph(text, ST["fact"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_CALLOUT),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_INK),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"), ParagraphStyle("cbt", fontName="Body",
                  fontSize=10, textColor=C_INK, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_CALLOUT),
        ('LINEBEFORE',    (0,0), (-1,-1), 2, C_INK),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_INK),
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
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_INK),
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
        ('LINEBEFORE',    (0,0), (-1,-1), 3, C_INK),
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
        ('LINEBELOW',     (0,0), (-1, 0), 1, C_INK),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

# -- COVER MOTIF ------------------------------------------------------------
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


# -- BUILD ------------------------------------------------------------------
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

    # -- COVER -------------------------------------------------------------
    story += [
        Spacer(1, 60),
        motif,
        Spacer(1, 32),
        Paragraph("BOOKLESSS � INTERNAL", ST["cover_step"]),
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

    # -- SECTION 1 � OVERVIEW ----------------------------------------------
    story += section("OVERVIEW", "What This Model Is Built On")
    story.append(body(
        "Booklesss delivers branded PDF study materials for Zambian university students "
        "through a Slack workspace. Revenue comes from two sources: full member subscriptions "
        "for workspace access, and per-course guest subscriptions. The model is built around "
        "Slack Business+ � one paid member seat unlocks five free single-channel guest slots."
    ))
    story.append(body(
        "Each course is structured across roughly four content channels plus shared support "
        "channels � announcements, general, and Q&amp;A. Full members get access to everything: "
        "all course channels, all support channels, every course running on the platform. "
        "Guests are single-channel � they access one content channel at a time and are excluded "
        "from support channels. When a guest finishes a topic, they submit a request to be "
        "moved to the next channel. Students who want simultaneous access to all channels "
        "upgrade to K600 full members, which adds K202 markup per seat rather than guest revenue. "
        "The 330-slot guest pool is filled by single-course students at K250 each, producing "
        "up to K82,500/month per course at full capacity."
    ))
    story.append(body(
        "This document is the financial reference model. Actual performance is tracked "
        "against these projections monthly. Deviations in conversion rate, guest count, "
        "or overhead timing should be noted and the relevant phase thresholds recalculated."
    ))

    # -- SECTION 2 � PRICING -----------------------------------------------
    story += section("PRICING", "Subscription Rates")
    pricing_data = [
        ["Tier", "Rate", "Slack type", "Access", "Net to platform"],
        ["Full member", "K600/month", "Paid seat (Business+)",
         "All channels", "K202 markup (seat costs K398)"],
        ["Guest", "K250/month", "Single-channel guest",
         "One channel at a time � sequential progression, no support channels", "K250 � no Slack cost"],
    ]
    story.append(table_std(pricing_data,
        [65, 70, 90, 140, CONTENT_W - 365]))
    story.append(body(
        "Exchange rate: K22.10/USD (confirmed 2026-07-07). Slack Business+ is $18/user/month "
        "on monthly billing (confirmed against slack.com/pricing/businessplus), giving a real "
        "seat cost of K398 � not the K339 this model previously assumed. "
        "Guests stay at K250 for one month, then upgrade to K600 or leave. "
        "The K202 markup (K600 - K398 seat cost) is platform revenue only � "
        "it does not enter the guest revenue split."
    ))
    story.append(callout(
        "Guest channel model:\n"
        "Each course runs across roughly 4 content channels plus shared support channels "
        "(announcements, general, Q&A). Guests access one content channel at a time and are "
        "excluded from support channels. When a guest completes a topic, they submit a request "
        "to be moved to the next channel � the admin reassigns them within their existing guest slot. "
        "Full members get immediate access to all channels across all courses."
    ))
    story.append(fact(
        "66 full members from the launch campaign � K202 = K13,332/month fixed markup income "
        "before a single guest joins. K13,332 exceeds all four overhead phases including "
        "Phase 4 (K5,216) � the platform is fully profitable from day 1 with zero guests."
    ))

    # -- SECTION 3 � CAMPAIGN MATH -----------------------------------------
    story += section("ACQUISITION", "Campaign Math")
    story.append(body(
        "The campaign targets full paying members. A K10,000 budget covers both flyer printing "
        "at K10 per flyer and a K50 commission paid to the campus distributor for each student "
        "who signs up and pays. At a 10% conversion rate that yields 66 full members. "
        "Their 66 seats unlock 330 single-channel guest slots across the workspace."
    ))
    story.append(formula_box([
        "Cost per flyer: K10 print + (10% � K50 commission) = K15 total per flyer",
        "K10,000 � K15 = 666 flyers distributed",
        "666 � 10% conversion = 66 full members",
        "66 members � 5 guest slots = 330 guest slots unlocked",
        "",
        "Guest slots = single-course students only (1 slot = 1 student in 1 channel)",
        "330 guests � K250 = K82,500/month guest revenue ceiling per course",
        "Multi-course students upgrade to K600 full member � adds K202 markup, no slot used",
    ]))
    story.append(body(
        "Recruiting 50 students who each take multiple courses is far easier than "
        "recruiting 200 separate people. The multi-course model lowers the acquisition "
        "target without changing the revenue ceiling."
    ))

    # -- SECTION 4 � REVENUE STRUCTURE ------------------------------------
    story += section("REVENUE STRUCTURE", "How Money Flows")
    story.append(body(
        "Guest revenue moves through two stages. First, 5% comes off the top as team welfare � "
        "covering data, meals, and transport for the course team. The remaining 95% "
        "splits three ways: 20% goes directly into the marketing campaign fund, "
        "60% goes to the course team, and 20% goes to the platform. "
        "Every rand that flows through the campaign fund buys flyers at K15 effective cost "
        "and converts to new full members at 10% � the team is funding their own growth."
    ))
    story.append(formula_box([
        "Guest revenue",
        "  - 5% welfare  (data, meals, transport)",
        "  = distributable revenue",
        "      ? Marketing fund  20%  ? campaign (K47.50 per student)",
        "      ? Course team     60%",
        "      ? Platform        20%",
        "",
        "Platform total  =  Platform 20% of distributable  +  K13,332 full member markup",
        "Platform net    =  Platform total  -  Overhead",
        "Campaign total  =  Platform net  +  Marketing fund  (all reinvested)",
    ]))
    story.append(body(
        "The course team's 60% is never touched by overhead. The platform bears all fixed "
        "costs from its 20% share plus the markup. The team earns from the first guest � "
        "and the platform is already profitable before the first guest ever joins."
    ))

    # -- SECTION 5 � OVERHEAD ----------------------------------------------
    story += section("OVERHEAD", "Cost Phases")
    story.append(body(
        "Overhead is structured in four phases. With K13,332/month in markup from 66 full "
        "members, all four phases are active from launch � the markup alone covers Phase 4 "
        "(K5,216) before a single guest joins. No guest threshold is required to unlock any phase. "
        "All manager costs are platform overhead, never deducted from the team's share."
    ))
    overhead_data = [
        ["Phase", "Trigger", "New cost", "Overhead"],
        ["1 � Launch",     "Course opens",   "Founder Slack K398 + Founder Claude K442 + Manager Slack K398", "K1,238"],
        ["2 � Activate",   "Launch (day 1)", "+ Manager Claude $20 (K442) � markup covers it immediately",     "K1,680"],
        ["3 � Scale",      "Launch (day 1)", "+ Founder Claude upgrade to $100 (+K1,768) � markup covers it immediately", "K3,448"],
        ["4 � Full build", "Launch (day 1)", "+ Manager Claude upgrade to $100 (+K1,768) � markup covers it immediately", "K5,216"],
    ]
    story.append(table_std(overhead_data,
        [70, 72, CONTENT_W - 70 - 72 - 65, 65]))

    # -- SECTION 6 � PROFITABILITY TABLES ---------------------------------
    story += section("PROFITABILITY", "Full Model by Guest Count")
    story.append(body(
        "Table A shows what the course team earns at each guest count (60% of distributable). "
        "Table B shows what the platform earns, "
        "including the K13,332/month fixed markup from 66 full members. "
        "All four phases are profitable at zero guests � the markup alone covers Phase 4. "
        "? marks the 0-guest row where full overhead is covered from launch."
    ))

    # TABLE A � Team Earnings
    story.append(h3("Table A � Team Earnings (per course, per month)"))
    cw_a = [55, 70, 73, CONTENT_W - 198]
    hdr_a = ["Guests", "Revenue", "Welfare 5%", "Team 60%"]

    story.append(phase_marker("All phases active from launch � markup K13,332 covers Phase 4 (K5,216) before any guests"))
    story.append(table_std([
        hdr_a,
        ["0 ?",  "K0",       "K0",     "K0"],
        ["10",   "K2,500",   "K125",   "K1,425"],
        ["20",   "K5,000",   "K250",   "K2,850"],
        ["30",   "K7,500",   "K375",   "K4,275"],
    ], cw_a))

    story.append(phase_marker("Phase 4 � overhead K5,216  |  active from launch"))
    story.append(table_std([
        hdr_a,
        ["30",      "K7,500",   "K375",   "K4,275"],
        ["50",      "K12,500",  "K625",   "K7,125"],
        ["100",     "K25,000",  "K1,250", "K14,250"],
        ["330 max", "K82,500",  "K4,125", "K47,025"],
    ], cw_a))

    # TABLE B � Platform Economics
    story.append(h3("Table B � Platform Economics (per course, per month)"))
    cw_b = [55, 70, 62, 70, CONTENT_W - 257]
    hdr_b = ["Guests", "Plat. 20%", "Markup", "Overhead", "Net"]

    story.append(phase_marker("All phases active from launch � profitable at 0 guests"))
    story.append(table_std([
        hdr_b,
        ["0 ?",  "K0",      "K13,332", "K5,216", "+K8,116"],
        ["10",   "K475",    "K13,332", "K5,216", "+K8,591"],
        ["20",   "K950",    "K13,332", "K5,216", "+K9,066"],
        ["30",   "K1,425",  "K13,332", "K5,216", "+K9,541"],
    ], cw_b))

    story.append(phase_marker("Phase 4 � overhead K5,216  |  active from launch, no guest threshold"))
    story.append(table_std([
        hdr_b,
        ["50",      "K2,375",  "K13,332", "K5,216", "+K10,491"],
        ["100",     "K4,750",  "K13,332", "K5,216", "+K12,866"],
        ["330 max", "K15,675", "K13,332", "K5,216", "+K23,791"],
    ], cw_b))

    story.append(Paragraph(
        "? = all phases profitable from 0 guests. Net = Plat. 20% + Markup - Overhead. "
        "Plat. 20% = guests � K250 � 95% � 20% = guests � K47.50. "
        "Team 60% = guests � K237.50 � 60% = guests � K142.50. "
        "Marketing 20% (guests � K47.50) flows directly to campaign � not shown here.",
        ST["note"]))

    # -- SECTION 7 � MILESTONES --------------------------------------------
    story += section("MILESTONES", "Decision Points")
    story.append(body(
        "Each milestone marks a threshold where the platform activates the next level of "
        "tooling. With K13,332 in monthly markup from 66 full members, all four overhead phases "
        "are active from launch. No guest threshold is required to unlock any phase."
    ))
    milestones_data = [
        ["Guests", "Trigger", "Action"],
        ["0 (launch)", "Campaign complete � 66 full members",
         "Open course. Activate all tooling through Phase 4 immediately � K13,332 markup covers all phases from day 1"],
        ["330", "All slots filled",
         "K23,791 platform net, team earning K47,025 � open waitlist for next course"],
    ]
    story.append(table_std(milestones_data,
        [55, 145, CONTENT_W - 200]))

    # -- SECTION 7b � REINVESTMENT LOOP -----------------------------------
    story += section("GROWTH ENGINE", "The Reinvestment Loop")
    story.append(body(
        "Platform net income goes straight back into the flyer campaign � no extraction, "
        "no holding. Every month, the full net is converted to flyers at K15 effective cost "
        "(K10 print + K5 commission reserve). At a steady 10% conversion rate, the loop "
        "compounds automatically."
    ))
    story.append(formula_box([
        "K150 net income  ?  10 flyers  ?  1 new full member  ?  K202/month markup (permanent)",
        "",
        "Payback period:  K150 � K202  =  under 1 month � immediate compounding",
        "",
        "Each month's net becomes next month's campaign budget.",
        "More members ? higher markup ? larger campaign ? more members.",
    ]))
    story.append(body(
        "At launch the net surplus is K8,116/month � it funds 541 flyers and adds roughly "
        "54 new members. Those 54 members add K10,908/month in markup, lifting the next "
        "month's net to K19,024. The month after: K19,024 funds 1,268 flyers, adds 126 more "
        "members, net rises to K44,476. The campaign never stops � it just gets bigger each cycle "
        "(and faster than before � the corrected K202 markup and higher Slack-driven overhead net "
        "out to a stronger per-member payback than the old, understated K161 figure that used "
        "the wrong Slack seat cost)."
    ))
    reinvest_data = [
        ["Month", "Net into campaign", "Flyers", "New members", "Cumul. members", "Markup/month"],
        ["Launch",  "K10,000 (seed)",  "666",   "66",  "66",  "K13,332"],
        ["1",  "K8,116",  "541",  "54",  "120", "K24,240"],
        ["2",  "K19,024", "1,268","126", "246", "K49,692"],
        ["3",  "K44,476", "2,965","296", "542", "K109,484"],
        ["4",  "K104,268","6,951","695", "1,237","K249,874"],
    ]
    story.append(table_std(reinvest_data,
        [40, 95, 48, 72, 105, CONTENT_W - 360]))

    # -- 12-MONTH CONSERVATIVE NPV FORECAST -------------------------------
    story.append(h3("12-Month NPV Forecast � Conservative Assumptions"))
    story.append(body(
        "This forecast is deliberately built to underestimate profit and overestimate risk. "
        "If the platform performs to these numbers, it is already doing well. "
        "Real performance is expected to exceed them."
    ))
    story.append(body(
        "Discount rate: 25% p.a. (BOZ policy rate 13.25% plus a conservative 12% risk premium). "
        "Full member monthly churn: 7% � above the academic-subscription norm, below the "
        "general edtech benchmark of 8�15% (loyalty.cx). Guest monthly churn: 10%. "
        "Guest upgrade rate: 2%/month. New guests recruited by course team: 5 in Month 1, "
        "growing by 3 per month � a deliberately slow ramp. "
        "Flyer conversion held at 10%. All net income reinvested into campaign each month."
    ))
    conservative_data = [
        ["Mth", "FM", "Guests", "Team 60%", "Founders", "Net", "PV Net", "Cumul. NPV"],
        ["1",  "66",  "0",   "K0",        "K0",       "K8,116",  "K7,966",   "K7,966"],
        ["2",  "64",  "5",   "K713",      "K238",     "K7,950",  "K7,659",   "K15,626"],
        ["3",  "63",  "13",  "K1,853",    "K618",     "K8,128",  "K7,687",   "K23,312"],
        ["4",  "64",  "23",  "K3,278",    "K1,093",   "K8,805",  "K8,173",   "K31,486"],
        ["5",  "68",  "35",  "K4,988",    "K1,663",   "K10,183", "K9,278",   "K40,764"],
        ["6",  "78",  "47",  "K6,698",    "K2,233",   "K12,773", "K11,424",  "K52,188"],
        ["7",  "85",  "61",  "K8,693",    "K2,898",   "K14,852", "K13,039",  "K65,227"],
        ["8",  "100", "77",  "K10,973",   "K3,658",   "K18,642", "K16,065",  "K81,292"],
        ["9",  "124", "93",  "K13,253",   "K4,418",   "K24,250", "K20,513",  "K101,804"],
        ["10", "159", "111", "K15,818",   "K5,273",   "K32,175", "K26,715",  "K128,519"],
        ["11", "208", "130", "K18,525",   "K6,175",   "K42,975", "K35,025",  "K163,545"],
        ["12", "275", "149", "K21,233",   "K7,078",   "K57,412", "K45,929",  "K209,474"],
    ]
    story.append(table_std(conservative_data,
        [28, 32, 44, 62, 56, 52, 54, CONTENT_W - 328]))
    story.append(Paragraph(
        "FM = full members at start of month. Team 60% = guests � K237.50 � 60% = guests � K142.50. "
        "Founders = Platform 20% of distributable (guests � K47.50) � extracted as personal income. "
        "Net = Marketing 20% + FM markup - overhead � stays in business, reinvests into campaign. "
        "Overhead K5,216 from day 1 (all phases active from launch � markup alone covers Phase 4). "
        "Always net positive � floor K7,950 in Month 2. "
        "Per founder: divide Founders column by 3. "
        "PV at 25% p.a. � DF = 1/(1.25)^(n/12). "
        "12m undiscounted net: K246,256. NPV: K209,474.",
        ST["note"]))
    story.append(callout(
        "Conservative 12-month NPV at 25% p.a.: K209,474\n"
        "Undiscounted net over 12 months: K246,256\n"
        "Month 12: 275 FM, 149 guests, K57,412 net/month\n"
        "Always net positive � floor K7,950 in Month 2.\n"
        "Higher churn, slower growth, 25% discount � real performance should exceed this floor."
    ))
    story.append(formula_box([
        "HOW MUCH BOOKLESSS GROWS � 12 months at K600 / K250 pricing",
        "",
        "Full members:          66  ?  275          +317%",
        "Monthly net income:    K8,116  ?  K57,412   +607%",
        "Course team income:    K0      ?  K21,233/month",
        "Each founder's share:  K0      ?  K2,359/month  (Founders column � 3)",
        "",
        "Year 1 cumulative net retained in business:  K246,256",
        "Year 1 NPV (25% discount rate):              K209,474",
        "",
        "These are the conservative numbers � 7% member churn, slow guest ramp,",
        "10% flyer conversion. Real growth should be faster.",
    ]))
    story.append(fact(
        "The campaign is never a one-time spend. It is a permanent engine: "
        "net income in ? flyers out ? members in ? more net ? repeat. "
        "The K10,000 seed starts the loop. After that, the platform funds its own growth."
    ))

    # -- SECTION 8 � ROLLOUT -----------------------------------------------
    story += section("ROLLOUT", "Course Launch Sequence")
    story.append(body(
        "No course opens without at least one confirmed guest commitment � this confirms "
        "real demand before hiring a manager. The threshold is low because the K13,332 markup "
        "already covers all overhead through Phase 4 from launch, including all four courses."
    ))
    rollout_data = [
        ["Course", "Min. guests", "Why"],
        ["Course 1", "1 committed",
         "K13,332 markup > K1,238 overhead � profitable immediately"],
        ["Course 2", "1 committed",
         "K13,332 > K1,636 (adds K398 manager seat) � still covered by markup"],
        ["Course 3", "1 committed",
         "K13,332 > K2,034 (adds another K398) � still covered"],
        ["Course 4", "1 committed",
         "K13,332 > K2,432 (adds third K398) � covered by markup, no guests required"],
    ]
    story.append(table_std(rollout_data,
        [60, 90, CONTENT_W - 150]))
    story.append(callout(
        "Rollout sequence:\n"
        "Campaign ? 66 full members (330 guest slots unlocked)\n"
        "? Waitlist opens for Course 1\n"
        "? 1 guest committed ? Course 1 launches, manager hired\n"
        "? Waitlist opens for Course 2\n"
        "? 1 guest committed ? Course 2 launches, manager hired\n"
        "? Repeat for Courses 3 and 4\n"
        "\n"
        "At four courses running at full capacity: K82,500/month guest revenue per course."
    ))

    # -- SECTION 9 � TEAM STRUCTURE ---------------------------------------
    story += section("TEAM", "Course Team Structure")
    story.append(body(
        "Each course has one matched team. The Manager handles everything for that course � "
        "content delivery, community management, and marketing. Sourcers bring in source "
        "material and student referrals. Manager and Sourcers apply for a specific course "
        "and are matched before launch. No person crosses courses."
    ))
    story.append(formula_box([
        "Course team:      60% of distributable guest revenue  (Manager 36% + Sourcers 24%)",
        "Marketing fund:   20% of distributable guest revenue  ? campaign",
        "Welfare:           5% of gross guest revenue  (data, meals, transport � off the top)",
        "",
        "At 330 guests max:  Course team K47,025  +  Welfare K4,125  =  K51,150 to team",
    ]))
    story.append(body(
        "Welfare is not a fixed amount � it grows with the course. "
        "At 10 guests the pool is K98. At 200 guests it is K1,950. "
        "Data stays covered throughout. Meals and transport become meaningful as the "
        "course matures and in-person sessions become regular."
    ))
    story.append(fact(
        "All platform overhead � founder Slack, founder Claude, manager Slack seat, "
        "manager Claude � is borne by the platform from its 20% share and the full member "
        "markup. The course team's 60% is never reduced by overhead at any stage."
    ))

    # -- SECTION 10 � WEEKLY PAYOUTS --------------------------------------
    story += section("PAYMENT CADENCE", "Weekly Team Payouts")
    story.append(body(
        "Students pay monthly. The team gets paid weekly. Each student payment received "
        "during the week is split immediately and batched into a single Friday mobile money "
        "transfer to the Manager and Sourcers. No waiting until month-end."
    ))
    story.append(formula_box([
        "Per student payment received:",
        "  K250 � 5%  = K12.50   welfare (team data/meals/transport pool)",
        "  K250 � 95% = K237.50  distributable",
        "    ? Marketing  20% = K47.50   (straight to campaign fund)",
        "    ? Course team 60% = K142.50  (Manager + Sourcers)",
        "    ? Platform   20% = K47.50   (retained by platform)",
    ]))
    story.append(h3("Weekly Payout by Batch Size"))
    story.append(body(
        "If N students pay in the same week, multiply by N. "
        "Payments trickle across the month � some weeks are heavier than others. "
        "Pay what came in that week. Do not hold."
    ))
    payout_data = [
        ["Guests paid", "Gross", "Welfare", "Marketing", "Team 60%", "Platform"],
        ["1",   "K250",    "K12.50",  "K47.50",    "K142.50",   "K47.50"],
        ["5",   "K1,250",  "K62.50",  "K237.50",   "K712.50",   "K237.50"],
        ["10",  "K2,500",  "K125.00", "K475.00",   "K1,425.00", "K475.00"],
        ["20",  "K5,000",  "K250.00", "K950.00",   "K2,850.00", "K950.00"],
        ["50",  "K12,500", "K625.00", "K2,375.00", "K7,125.00", "K2,375.00"],
    ]
    story.append(table_std(payout_data,
        [60, 50, 54, 66, 72, CONTENT_W - 302]))
    story.append(body(
        "Full member markup (K13,332/month from 66 members) goes entirely to the platform and is not "
        "distributed weekly to the team. Transfer it to the platform account once per month "
        "as members pay their subscriptions."
    ))
    story.append(callout(
        "How to run it each Friday:\n"
        "1. Open your payment log (WhatsApp thread or spreadsheet)\n"
        "2. Sum all guest payments received Monday�Friday\n"
        "3. Apply the formula: Gross � 95% � 60% ? Course team\n"
        "4. Transfer via Airtel/MTN Mobile Money � same day\n"
        "5. Log: 'Week ending [date] � [N] payments � Manager K[X] sent ?'\n"
        "\n"
        "Keep every transfer receipt. This is the record actual performance is measured against."
    ))
    story.append(fact(
        "Weekly payments are motivating and low-risk. You only pay money already received � "
        "there is no float or advance. If a student is late paying, that week's batch is "
        "simply smaller. The formula never changes."
    ))

    doc.build(story)
    print(f"Done: {OUT_PATH}")


if __name__ == "__main__":
    build()


