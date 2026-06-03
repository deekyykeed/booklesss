"""
Booklesss — Step 1.2: Vision, Mission & Objectives
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

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "01-foundations")
OUT_PATH = os.path.join(OUT_DIR, "Step 1.2 - Vision, Mission & Objectives.pdf")

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
        "community": ParagraphStyle("community",
            fontName="Body", fontSize=9.5, textColor=C_STEEL,
            leading=15, spaceAfter=5, alignment=TA_LEFT),
        "community_end": ParagraphStyle("community_end",
            fontName="Body-Bold", fontSize=9.5, textColor=C_RED_DK,
            leading=15, alignment=TA_LEFT),
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
    canvas.drawString(MX, H - MY + 7, "1.2 — Vision, Mission & Objectives")
    canvas.drawRightString(W - MX, H - MY + 7, "v2 · June 2026")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
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

def community_closer():
    return [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is Step 1.2 in the Strategic Management series inside the Booklesss "
            "study group on Slack. The channel is <b>#sm-foundations</b> — that's where "
            "students are working through foundation concepts, sharing exam questions, "
            "and testing each other on definitions that come up every year.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            "Already in the workspace? You know where to find it. "
            "If not, ask whoever shared this with you for the invite.",
            ST["community_end"]),
    ]

# ── TRIPLE-MARK MOTIF ──────────────────────────────────────────────────────
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
        mid = getattr(self, "_aw", self.cs) / 2.0
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
    story.append(Spacer(1, 115))
    story.append(LogoTriple(_mark_black) if _mark_black is not None
                 else TripleDiamond(color=HEADING_DARK))
    story.append(Spacer(1, 26))
    story.append(Paragraph("STEP 1.2 · FOUNDATIONS", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Vision, Mission<br/>& Objectives", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "Where the company is going, why it exists today, "
        "and how you measure whether it is getting there.",
        ST["cover_sub"]))
    story.append(Spacer(1, 160))
    story.append(Paragraph("Strategic Management", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── SECTION 1 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 01", "The Four Components of Organisational Direction")
    story.append(body(
        "Before executing strategy, every organisation must establish direction. "
        "Four components work together — each answers a different question and none substitutes for the others:"
    ))
    story.append(table_std([
        ["Component",        "The question it answers",                    "Time focus"],
        ["Strategic Vision",  "Where are we going and why?",               "Long-term future"],
        ["Mission Statement", "What do we do right now, and for whom?",    "Present day"],
        ["Core Values",       "What principles govern how we behave?",     "Ongoing"],
        ["Objectives",        "What specific results must we achieve?",    "Short and long-term"],
    ], [CONTENT_W * 0.28, CONTENT_W * 0.48, CONTENT_W * 0.24]))

    # ── SECTION 2 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 02", "Strategic Vision")
    story.append(body(
        "A strategic vision describes management's aspirations for the company's future "
        "and the course charted to achieve them. It answers <i>where are we going?</i> — "
        "not what the company does today."
    ))
    story.append(body(
        "A good vision is specific enough to guide resource allocation decisions, "
        "forward-looking (not a description of current operations), feasible, "
        "and short enough to be memorable. Generic superlatives — "
        "'be the best', 'lead the industry' — tell no one where to go."
    ))
    story.append(fact(
        "Exam test: does the statement describe a future destination with enough "
        "specificity to guide decisions? If it could belong to any company in any industry, "
        "it has failed as a vision."
    ))

    # ── SECTION 3 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 03", "Mission Statement")
    story.append(body(
        "The mission is grounded in the present. It answers "
        "<i>what do we do, for whom, and how?</i> A well-crafted mission identifies "
        "the products or services offered, the needs satisfied, the customer groups served, "
        "and what sets the organisation apart from rivals."
    ))

    story.append(h3("Vision vs. Mission — The Key Distinction"))
    story.append(table_std([
        ["",               "Vision",                                    "Mission"],
        ["Time",           "Future state — where we are going",         "Present state — why we exist today"],
        ["Core question",  "Where are we headed?",                      "What do we do, for whom, and how?"],
        ["Exam test",      "Forward-looking and specific enough to guide decisions?",
                           "Describes current purpose, scope, and what sets the organisation apart?"],
    ], [CONTENT_W * 0.20, CONTENT_W * 0.40, CONTENT_W * 0.40]))

    story.append(callout(
        "The most common exam error: confusing vision and mission. "
        "A mission written in the future tense is probably a vision. "
        "A vision describing current operations is probably a mission. "
        "Pin each to its question before analysing it."
    ))

    story.append(discussion_q(
        "<i>Zanaco was originally established to extend banking to Zambians excluded from "
        "commercial banks. It has since grown into one of the country's largest banks "
        "with retail, corporate, and mobile arms. "
        "Draft a one-sentence mission statement for Zanaco as it operates today. "
        "Then assess: 'To be the most trusted and accessible bank in Zambia' — "
        "is this a vision, a mission, or neither? What is missing?</i>"
    ))

    # ── SECTION 4 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 04", "Core Values")
    story.append(body(
        "Core values are the beliefs and behavioural norms employees are expected to display "
        "in pursuing the firm's vision and mission. When leadership genuinely models them, "
        "they become the reference point for decisions in situations where no rule exists. "
        "Values that conflict with strategy create internal contradiction — "
        "and values that leadership does not live destroy credibility faster than having none at all."
    ))

    # ── SECTION 5 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 05", "Setting Objectives")
    story.append(body(
        "Objectives convert vision and mission into measurable targets. "
        "Without them, the vision has no way to track whether the organisation is moving toward it."
    ))

    story.append(h3("Financial vs. Strategic Objectives"))
    story.append(table_std([
        ["Type", "Targets", "Example"],
        ["Financial",
         "Revenue, profit, margins, return on investment, cash flow.",
         "ZESCO: ZMW 2.4 billion revenue, 18% operating margin by year-end."],
        ["Strategic",
         "Market position, customer relationships, product capability — the non-financial drivers of future performance.",
         "ZESCO: 85% rural electrification coverage within five years."],
    ], [CONTENT_W * 0.20, CONTENT_W * 0.42, CONTENT_W * 0.38]))

    story.append(body(
        "Financial results are <b>lagging indicators</b> — they reflect decisions made months ago. "
        "Strategic objectives are <b>leading indicators</b>: winning on market standing and customer "
        "satisfaction today predicts financial performance tomorrow. "
        "Optimising only for financial targets at the cost of strategic ones is how companies "
        "post strong short-term results while eroding long-term position."
    ))

    story.append(h3("Well-Stated Objectives — Four Requirements"))
    story.append(bullet("<b>Specific</b> — precise enough that everyone agrees on what success looks like."))
    story.append(bullet("<b>Measurable</b> — a number or observable milestone, not a direction."))
    story.append(bullet("<b>Challenging</b> — ambitious enough to push performance, not so easy it creates complacency."))
    story.append(bullet("<b>Time-bound</b> — a deadline, not an open-ended aspiration."))
    story.append(Spacer(1, 6))

    story.append(body(
        "<b>Stretch objectives</b> push targets high enough to force creative thinking about how "
        "to achieve results, not just whether to aim for them. A company with <b>strategic intent</b> "
        "commits its full resources relentlessly to one ambitious long-term goal — it functions as "
        "an obsession that focuses the whole organisation."
    ))

    story.append(h3("The Balanced Scorecard"))
    story.append(body(
        "The Balanced Scorecard prevents the failure of hitting financial targets while eroding "
        "the foundations that sustain them. It tracks performance across four perspectives:"
    ))
    story.append(table_std([
        ["Perspective",        "What it measures"],
        ["Financial",          "Revenue, profit, return on investment."],
        ["Customer",           "Market share, retention, satisfaction."],
        ["Internal Processes", "Efficiency, quality, speed of delivery."],
        ["Learning and Growth","Employee capability, technology, culture."],
    ], [CONTENT_W * 0.35, CONTENT_W * 0.65]))

    story.append(callout(
        "Exam tip on the Balanced Scorecard: why are financial objectives alone insufficient? "
        "Because they are lagging. The other three perspectives show whether the organisation "
        "is building or eroding the capacity to perform financially in the future."
    ))

    story.append(discussion_q(
        "<i>First Quantum Minerals consistently meets annual financial targets — "
        "copper volume, revenue, and cost per tonne all on track. "
        "But it repeatedly misses strategic objectives on community investment, "
        "local supplier development, and environmental rehabilitation. "
        "Management says: 'the financials prove we are executing well.' "
        "Using the theory from this step, explain what is actually happening "
        "and where this company is likely to be in ten years if the pattern continues.</i>"
    ))

    # ── KEY TERMS ──────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    story.append(table_std([
        ["Term", "Definition"],
        ["Strategic Vision",      "Management's aspirations for the company's future and the course charted to achieve them — answers 'where are we going?'"],
        ["Mission Statement",     "The company's current purpose — what it does, for whom, and how — answers 'why do we exist today?'"],
        ["Core Values",           "Beliefs and behavioural norms employees display in pursuing the firm's vision and mission"],
        ["Objectives",            "Specific, measurable performance targets that convert vision and mission into trackable results"],
        ["Financial Objectives",  "Targets for revenue, profit, margins, and return on investment — lagging indicators"],
        ["Strategic Objectives",  "Targets for market position, customers, and capability — leading indicators of future financial performance"],
        ["Stretch Objectives",    "Targets set beyond current comfortable reach to push the organisation to its full potential"],
        ["Balanced Scorecard",    "Framework tracking performance across financial, customer, internal processes, and learning and growth perspectives"],
    ], [CONTENT_W * 0.32, CONTENT_W * 0.68]))

    # ── LEARNING OUTCOMES ──────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able to Do")
    for i, outcome in enumerate([
        "Name the four components of organisational direction and state the question each one answers",
        "Define strategic vision, state the requirements of an effective vision statement, and identify common pitfalls",
        "Distinguish precisely between vision and mission — what each answers and how each is tested in exams",
        "Distinguish financial from strategic objectives, explain why financial results are lagging indicators, and explain why both types are necessary",
        "Explain stretch objectives, strategic intent, and the purpose of the Balanced Scorecard",
    ], 1):
        story.append(Paragraph(f"{i}.  {outcome}", ST["outcome"]))

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Next: Step 2.1 — The External Environment (PESTEL and Porter's Five Forces)",
        ParagraphStyle("nxt", fontName="Body-Bold", fontSize=9,
                       textColor=C_STEEL, leading=14, spaceBefore=6)))

    # ── COMMUNITY CLOSER ───────────────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
