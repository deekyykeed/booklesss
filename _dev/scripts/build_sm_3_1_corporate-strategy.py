"""
Booklesss — Step 3.1: Corporate Strategy
Course: Strategic Management
Style: Cream paper · cardinal red accent · Parastoo serif titles · Aptos body
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
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

# ── COLOURS ─────────────────────────────────────────────────────────────────
C_COVER      = colors.HexColor("#FFFDE8")
C_PAGE       = colors.HexColor("#FFFEF2")
TITLE_DARK   = colors.HexColor("#121212")
HEADING_DARK = colors.HexColor("#3D3D3D")
C_RED        = colors.HexColor("#DC2626")
C_RED_DK     = colors.HexColor("#991B1B")
C_INK        = colors.HexColor("#1A1A16")
C_STEEL      = colors.HexColor("#5F6B65")
C_MIST       = colors.HexColor("#6E6A5E")
C_RULE       = colors.HexColor("#E0DACB")
BG_FORMULA   = colors.HexColor("#FFF0F0")
BG_CALLOUT   = colors.HexColor("#FEF2F2")

# ── PAGE GEOMETRY ──────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

# NLM links — to be filled when available
NLM_STEP_3_1_A = ""
VID_STEP_3_1   = ""

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "03-strategy")
OUT_PATH = os.path.join(OUT_DIR, "Step 3.1 - Corporate Strategy.pdf")

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
            fontName="Body-Bold", fontSize=7, textColor=C_RED,
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
            fontName="Body-Bold", fontSize=10, textColor=C_RED_DK,
            leading=16, spaceAfter=6, alignment=TA_LEFT),
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
        canvas.drawImage(_logo_black, MX, top_y - 5,
                         width=lh * iw / ih, height=lh,
                         preserveAspectRatio=True, mask="auto")
    else:
        canvas.setFont("Body-Bold", 8.5)
        canvas.setFillColor(HEADING_DARK)
        canvas.drawString(MX, top_y, "BOOKLESSS")
    canvas.setFont("Body", 8.5)
    canvas.setFillColor(C_MIST)
    canvas.drawRightString(W - MX, top_y, "STRATEGIC MANAGEMENT")
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
    canvas.setStrokeColor(C_RED)
    canvas.setLineWidth(0.6)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "3.1 — Corporate Strategy")
    canvas.drawRightString(W - MX, H - MY + 7, "v2 · June 2026")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    _footer_left = "Booklesss | booklesss.framer.ai"
    canvas.drawString(MX, MY - 14, _footer_left)
    _tw = canvas.stringWidth(_footer_left, "Body", 7.5)
    canvas.linkURL("https://booklesss.framer.ai", (MX, MY - 16, MX + _tw, MY - 8))
    canvas.drawCentredString(W / 2, MY - 14, "Strategic Management")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")
    canvas.restoreState()

# ── HELPERS ────────────────────────────────────────────────────────────────
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_RED,
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
        ("BACKGROUND",    (0,0), (-1,-1), BG_CALLOUT),
        ("LINEBEFORE",    (0,0), (-1,-1), 2.5, C_RED),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"),
                  ParagraphStyle("cbt", fontName="Body", fontSize=10,
                                 textColor=C_RED_DK, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), BG_CALLOUT),
        ("LINEBEFORE",    (0,0), (-1,-1), 2, C_RED),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_RED),
        ("TOPPADDING",    (0,0), (-1,-1), 9),
        ("BOTTOMPADDING", (0,0), (-1,-1), 9),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

def discussion_q(text):
    p = Paragraph(text, ST["discuss_q"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), BG_CALLOUT),
        ("LINEBEFORE",    (0,0), (-1,-1), 2.5, C_RED),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def resources_box(items):
    s_hd = ParagraphStyle("res_hd", fontName="Body-Bold", fontSize=7,
                           textColor=C_RED, leading=10, alignment=TA_LEFT)
    s_lnk = ParagraphStyle("res_lnk", fontName="Body-Bold", fontSize=9,
                            textColor=C_RED_DK, leading=15, alignment=TA_LEFT)
    rows = [[Paragraph("ADDED VALUE", s_hd)]]
    _blt = (f'<img src="{MARK_BLACK}" width="8" height="8" valign="middle"/>'
            if os.path.exists(MARK_BLACK) else "▸")
    for label, url in items:
        rows.append([Paragraph(f'<link href="{url}">{_blt}  <u>{label}</u></link>', s_lnk)])
    t = Table(rows, colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1,-1), BG_CALLOUT),
        ("BOX",           (0, 0), (-1,-1), 0.8, C_RED),
        ("TOPPADDING",    (0, 0), (-1,-1), 5),
        ("BOTTOMPADDING", (0, 0), (-1,-1), 5),
        ("LEFTPADDING",   (0, 0), (-1,-1), 12),
        ("RIGHTPADDING",  (0, 0), (-1,-1), 12),
        ("TOPPADDING",    (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0,-1), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 6)])

def table_std(data, col_widths):
    rows = []
    for i, row in enumerate(data):
        styled = [Paragraph(str(c), ST["th"] if i == 0 else ST["td"]) for c in row]
        rows.append(styled)
    t = Table(rows, colWidths=col_widths)
    t.setStyle(TableStyle([
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_RULE),
        ("BACKGROUND",    (0,0), (-1, 0), BG_FORMULA),
        ("LINEBELOW",     (0,0), (-1, 0), 1,   C_RED),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
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
    def __init__(self, center_size=15, side_size=10, gap=13,
                 color=None, stroke_width=1.3):
        super().__init__()
        self.cs, self.ss, self.gap = center_size, side_size, gap
        self.color = color or HEADING_DARK
        self.sw = stroke_width
        self._h = center_size

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
        mid = getattr(self, "_aw", self._h) / 2.0
        step = self.cs / 2.0 + self.gap + self.ss / 2.0
        c.setFillAlpha(0.25)
        self._diamond(mid - step, cy, self.ss / 2.0, fill=True)
        self._diamond(mid + step, cy, self.ss / 2.0, fill=True)
        c.setFillAlpha(1.0)
        self._diamond(mid, cy, self.cs / 2.0, fill=False)
        c.restoreState()


# ── BUILD ──────────────────────────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4,
                          leftMargin=MX, rightMargin=MX,
                          topMargin=MY + 18, bottomMargin=MY + 18)

    cover_frame = Frame(MX, MY, W - 2*MX, H - 2*MY,
                        id="cover", showBoundary=0)
    body_frame  = Frame(MX, MY + 14, W - 2*MX, H - 2*MY - 28,
                        id="body",  showBoundary=0)

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="Body",  frames=[body_frame],  onPage=page_bg,
                     onPageEnd=body_page),
    ])

    story = [NextPageTemplate("Cover")]

    # ── COVER ──────────────────────────────────────────────────────────────
    story.append(Spacer(1, 38))
    if _mark_black:
        story.append(LogoTriple(_mark_black))
    else:
        story.append(TripleDiamond())
    story.append(Spacer(1, 20))
    story.append(Paragraph("STEP 3.1", ST["cover_step"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Corporate<br/>Strategy", ST["cover_title"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "Levels of strategy · Growth &amp; diversification · BCG Matrix",
        ST["cover_sub"]))

    story.append(Spacer(1, 110))
    story.append(Paragraph("Strategic Management", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(Spacer(1, 14))

    nlm_items = []
    if NLM_STEP_3_1_A:
        nlm_items.append(("Audio overview", NLM_STEP_3_1_A))
    if VID_STEP_3_1:
        nlm_items.append(("Video overview", VID_STEP_3_1))
    if nlm_items:
        story.append(resources_box(nlm_items))

    # ── BODY ───────────────────────────────────────────────────────────────
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: ORIENTATION ──────────────────────────────────────────────
    story += section("ORIENTATION", "Where Strategy-Making Happens")
    story.append(body(
        "In Lessons 1 and 2 you built the analytical foundation: you know what strategy is (Step 1.1), "
        "what the organisation stands for (Step 1.2), what external forces are at work (Step 2.1), "
        "and what the organisation is genuinely capable of (Step 2.2). Now the work shifts from analysis to choice."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "Strategic choices happen at three distinct levels. Each level answers a different question, "
        "involves different decision-makers, and operates on a different time horizon. "
        "Getting the levels confused is one of the most common strategy mistakes — "
        "corporate leadership meddling in operational decisions, or business units making portfolio choices "
        "that should sit with the board."
    ))
    story.append(Spacer(1, 10))

    levels_data = [
        ["Level", "Who decides", "Core question", "Time horizon"],
        ["Corporate", "Board / Group CEO", "Which businesses should we be in? How do we allocate capital across them?", "5–10 years"],
        ["Business", "Divisional MD / BU head", "How do we compete and win within our chosen market?", "2–5 years"],
        ["Functional", "Functional heads (CFO, CMO, COO…)", "How does each function support the business strategy?", "1–2 years"],
    ]
    story.append(table_std(levels_data,
        [2.2*cm, 2.8*cm, CONTENT_W - 7.5*cm, 2.5*cm]))
    story.append(Spacer(1, 4))

    story.append(body(
        "This step is about <b>corporate-level strategy</b> — the top of the hierarchy. "
        "It is the most consequential and the hardest to reverse. Entering a new industry or acquiring "
        "a business takes years to undo if it turns out to be wrong. That is why the analytical work "
        "of Lessons 1 and 2 must come first."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 2: CORPORATE STRATEGIES ──────────────────────────────────────
    story += section("STRATEGIC CHOICE", "The Four Corporate-Level Strategy Directions")
    story.append(body(
        "At the corporate level, the fundamental question is: <i>What direction should this organisation move in?</i> "
        "There are four broad directions, and every corporate-level decision fits into one of them."
    ))
    story.append(Spacer(1, 8))

    corp_data = [
        ["Direction", "What it means", "When to choose it"],
        ["Growth", "Expand — into new products, markets, or businesses. Increase revenue and competitive scope.", "When the environment offers real opportunity and the firm has the capability and capital to capture it."],
        ["Stability", "Maintain the current position. Protect what works without significant new investment.", "When the market is mature, the firm is performing well, and disruption carries more risk than growth."],
        ["Retrenchment", "Pull back — cut costs, exit underperforming businesses, refocus on core strengths.", "When performance is declining, resources are stretched, or parts of the portfolio are destroying value."],
        ["Combination", "Apply different directions to different business units simultaneously.", "When the portfolio is diverse — some units merit growth investment, others stability or exit."],
    ]
    story.append(table_std(corp_data,
        [2.4*cm, CONTENT_W * 0.42, CONTENT_W - 2.4*cm - CONTENT_W * 0.42]))
    story.append(Spacer(1, 6))

    story.append(body(
        "Most large Zambian organisations are combination strategists without labelling it: "
        "Zambeef invests aggressively in cold-chain capacity (growth) while running its retail outlets "
        "as mature steady earners (stability). First Quantum Minerals expands into new minerals and geographies "
        "while exiting mines that no longer cover their cost of capital (retrenchment)."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 3: GROWTH PATHS ──────────────────────────────────────────────
    story += section("GROWTH STRATEGIES", "How Organisations Expand: Four Paths")
    story.append(body(
        "When an organisation chooses growth, it still needs to decide <i>how</i> to grow. "
        "The four main growth paths carry very different risk profiles and capability requirements."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("1. Concentrated Growth (Intensification)"))
    story.append(body(
        "Focus resources on profitable growth within the <b>existing product in the existing market</b>. "
        "The logic is simple: if the current market is not fully captured, why look elsewhere? "
        "Zambia's mobile-money market used concentrated growth for years — MTN, Airtel, and Zamtel "
        "competed intensely for the same customer base before market saturation pushed them toward new segments."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("2. Market and Product Development"))
    story.append(body(
        "<b>Market development</b> takes an existing product into a new market (e.g., Zambian Breweries "
        "expanding distribution into rural areas or neighbouring countries). "
        "<b>Product development</b> launches new products for existing customers "
        "(e.g., a bank launching insurance and pension products to its existing account holders). "
        "Both are lower-risk than full diversification because the firm leverages something it already knows well."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("3. Vertical Integration"))
    story.append(body(
        "Expand along the supply chain — either <b>backward</b> (toward suppliers) or <b>forward</b> (toward customers)."
    ))
    story.append(Spacer(1, 4))
    story.append(bullet(
        "<b>Backward integration:</b> A flour miller that acquires wheat farms controls its own input costs. "
        "Zambeef's ownership of its own feedlots, abattoirs, and processing plants is backward integration — "
        "controlling every stage from animal to packaged product."
    ))
    story.append(bullet(
        "<b>Forward integration:</b> A manufacturer that opens its own retail outlets (instead of selling through distributors) "
        "is integrating forward. The advantage is margin capture and direct customer relationships; "
        "the risk is that running retail requires very different capabilities than manufacturing."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("4. Horizontal Integration"))
    story.append(body(
        "Acquire or merge with a <b>competitor at the same stage</b> of the value chain. "
        "The goal is scale, market share, and elimination of a rival. "
        "Stanbic Bank's acquisition of CFC Bank in Zambia is horizontal integration — "
        "same industry, same customer base, merged to achieve scale. "
        "The risk is that mergers are expensive to execute, and cultural clashes frequently destroy the value they were meant to create."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 4: DIVERSIFICATION ────────────────────────────────────────────
    story += section("DIVERSIFICATION", "Moving Beyond the Core Business")
    story.append(body(
        "Diversification means entering a business that is genuinely new to the firm — "
        "different products, different markets, different competitive dynamics. "
        "It is the highest-risk growth path, and the evidence from decades of research is humbling: "
        "most diversification moves destroy shareholder value. Yet done well, diversification can "
        "reduce risk by spreading income across businesses and create value when real synergies exist."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Related Diversification (Concentric)"))
    story.append(body(
        "Enter businesses that share technology, customers, distribution channels, or brand with the core business. "
        "The test is whether real synergies exist — not just the word 'synergy,' but specific cost savings or "
        "revenue enhancements that would not exist if the businesses were separate. "
        "A Zambian bank entering asset management, insurance, or stockbroking is related diversification: "
        "same customers, complementary products, shared compliance infrastructure."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Unrelated Diversification (Conglomerate)"))
    story.append(body(
        "Enter businesses with no strategic connection to the core. The only rationale is financial — "
        "the acquirer believes it can manage the business better than current owners, "
        "or that cash flows from different industries reduce overall risk. "
        "Unrelated diversification is notoriously hard to execute: managing a mining company and a supermarket chain "
        "requires completely different capabilities. Most large conglomerates eventually break up "
        "because the parts are worth more separately than together."
    ))
    story.append(Spacer(1, 8))

    story.append(fact(
        "The three tests for any diversification: (1) Industry attractiveness — is the target industry "
        "genuinely attractive, or are you buying into a declining sector? (2) Cost of entry — will you pay "
        "so much to acquire that future profits can never justify the price? (3) Better-off test — "
        "will the combined entity be better off than the businesses operating independently?"
    ))
    story.append(Spacer(1, 8))

    story.append(discussion_q(
        "Discussion Question 1: Zambeef operates beef, chicken, fish, retail (Zambeef shops), and cold-chain logistics. "
        "Is this related or unrelated diversification? What synergies exist? "
        "Which parts of the portfolio do you think pass the three diversification tests — "
        "and which might not?"
    ))

    # ── SECTION 5: BCG MATRIX ─────────────────────────────────────────────────
    story += section("PORTFOLIO ANALYSIS", "The BCG Matrix: Allocating Capital Across the Portfolio")
    story.append(body(
        "When an organisation runs multiple businesses or product lines, it needs a way to decide "
        "where to invest, where to harvest, and where to exit. "
        "The BCG Growth-Share Matrix (developed by Boston Consulting Group) is the most widely used tool for this. "
        "It maps every business unit on two dimensions: <b>market growth rate</b> and <b>relative market share</b>."
    ))
    story.append(Spacer(1, 10))

    bcg_data = [
        ["Quadrant", "Market growth", "Relative market share", "Strategic logic", "Cash flow"],
        ["Stars", "High", "High", "Invest heavily to maintain position. Stars will become Cash Cows as the market matures.", "Roughly neutral — generates cash but also consumes it to fund growth"],
        ["Cash Cows", "Low", "High", "Milk the profits. The market has matured but you still lead it. Don't over-invest; extract cash to fund Stars and Question Marks.", "Strong positive — the engine of the portfolio"],
        ["Question Marks", "High", "Low", "Decide quickly: invest to become a Star, or exit before the market matures and you're stuck as a Dog.", "Negative — growing market demands investment but low share means limited return"],
        ["Dogs", "Low", "Low", "Exit or reposition. Low-growth, low-share businesses consume management attention and rarely justify their cost of capital.", "Neutral to negative — often better to divest"],
    ]
    story.append(table_std(bcg_data,
        [2.2*cm, 1.8*cm, 2.2*cm, CONTENT_W - 8.7*cm, 2.5*cm]))
    story.append(Spacer(1, 6))

    story.append(h3("BCG Applied: Zambian Breweries Portfolio"))
    story.append(body(
        "Zambian Breweries (part of AB InBev) operates a range of products. "
        "Applying a rough BCG lens: <b>Mosi Lager</b> (the dominant mass-market beer, high share in a mature market) "
        "is a classic <b>Cash Cow</b> — the company's earnings engine. "
        "<b>Eagle Lager</b> and <b>Rhino Lager</b> (affordable sorghum-based beers targeting lower-income consumers) "
        "sit somewhere between Cash Cow and Star depending on growth trends in that segment. "
        "Premium imported brands that Zambian Breweries distributes (lower share, emerging premium market) "
        "are <b>Question Marks</b> — the company must decide whether to invest seriously in premium positioning "
        "or leave that segment to independents."
    ))
    story.append(Spacer(1, 8))

    story.append(callout(
        "BCG limitation: The matrix assumes that market share drives profitability (via experience curve effects) "
        "and that high-growth markets are always worth entering. Neither is universally true. "
        "Use BCG as a starting framework, not a formula — the three diversification tests still apply."
    ))
    story.append(Spacer(1, 8))

    story.append(discussion_q(
        "Discussion Question 2: Pick a Zambian organisation with multiple products or business units "
        "(Zambeef, Zanaco, MTN Zambia, ZESCO, or any other). Map its major units onto the BCG Matrix. "
        "Based on your analysis: where should capital be allocated, where should it be harvested, "
        "and is there anything that should be exited?"
    ))

    # ── KEY TERMS ────────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Corporate strategy", "The top-level decisions about which businesses an organisation is in and how capital is allocated across them"],
        ["Business strategy", "How a single business unit competes and wins within its chosen market"],
        ["Functional strategy", "How individual functions (finance, marketing, operations) support the business strategy"],
        ["Growth strategy", "A corporate direction that seeks to expand revenue, scope, or market position"],
        ["Stability strategy", "Maintaining the current position without significant new investment or expansion"],
        ["Retrenchment strategy", "Pulling back — reducing scope, cutting costs, or exiting underperforming businesses"],
        ["Concentrated growth", "Growing by deepening penetration of the existing product in the existing market"],
        ["Vertical integration", "Expanding along the supply chain — backward toward suppliers or forward toward customers"],
        ["Horizontal integration", "Acquiring or merging with a competitor at the same stage of the value chain"],
        ["Related diversification", "Entering new businesses that share technology, customers, or channels with the core"],
        ["Unrelated diversification", "Entering businesses with no strategic connection to the core — pure financial rationale"],
        ["BCG Matrix", "A portfolio tool that maps business units by market growth rate and relative market share"],
        ["Cash Cow", "High-share, low-growth unit — generates cash but needs minimal reinvestment"],
        ["Star", "High-share, high-growth unit — invest to maintain; will become Cash Cow as market matures"],
        ["Question Mark", "Low-share, high-growth unit — invest to win or exit before the market matures"],
        ["Dog", "Low-share, low-growth unit — exit or reposition; rarely worth continued investment"],
    ]
    story.append(table_std(terms, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the three levels of strategy and identify which decisions belong at each level",
        "Describe the four corporate strategy directions and the conditions that favour each",
        "Distinguish between the four growth paths — concentration, integration, market development, and diversification",
        "Apply the three diversification tests to evaluate whether a new business makes strategic sense",
        "Use the BCG Matrix to analyse a multi-business portfolio and make capital allocation recommendations",
    ]
    for o in outcomes:
        story.append(Paragraph(f"• {o}", ST["outcome"]))
    story.append(Spacer(1, 16))

    doc.build(story)
    print(f"Built: {OUT_PATH}")


if __name__ == "__main__":
    build()
