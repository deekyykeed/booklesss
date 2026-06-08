"""
Booklesss — Strategic Management: Study Pill
Complete course consolidation — all 7 steps, one document.
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
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))

# ── FONTS ──────────────────────────────────────────────────────────────────
FONT_DIR = os.path.join(_ROOT, "_dev", "fonts")

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
BRAND_DIR   = os.path.join(_ROOT, "_dev", "brand")
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
           "schools", "ZCAS", "Strategic Management")
OUT_PATH = os.path.join(OUT_DIR, "Strategic Management - Study Pill.pdf")

# ── STYLES ─────────────────────────────────────────────────────────────────
def make_styles():
    return {
        "cover_label": ParagraphStyle("cover_label",
            fontName="Body-Bold", fontSize=9, textColor=HEADING_DARK,
            leading=13, spaceAfter=0, alignment=TA_CENTER),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Title-Bold", fontSize=46, textColor=TITLE_DARK,
            leading=50, spaceAfter=0, alignment=TA_CENTER),
        "cover_pill": ParagraphStyle("cover_pill",
            fontName="Title-Bold", fontSize=26, textColor=C_RED,
            leading=32, spaceAfter=0, alignment=TA_CENTER),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=11, textColor=C_MIST,
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
        "part_num": ParagraphStyle("part_num",
            fontName="Body-Bold", fontSize=8, textColor=C_RED,
            leading=12, spaceAfter=4, alignment=TA_LEFT),
        "part_title": ParagraphStyle("part_title",
            fontName="Title-Bold", fontSize=22, textColor=TITLE_DARK,
            leading=26, spaceAfter=4, alignment=TA_LEFT),
        "part_sub": ParagraphStyle("part_sub",
            fontName="Body", fontSize=10, textColor=C_MIST,
            leading=15, spaceAfter=2, alignment=TA_LEFT),
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
    canvas.drawString(MX, H - MY + 7, "Study Pill — Strategic Management")
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

def part_header(number, title, subtitle=""):
    items = [
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=2, color=C_RED, spaceAfter=10, spaceBefore=2),
        Paragraph(f"PART {number}", ST["part_num"]),
        Paragraph(title, ST["part_title"]),
    ]
    if subtitle:
        items.append(Paragraph(subtitle, ST["part_sub"]))
    items.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE,
                             spaceAfter=14, spaceBefore=6))
    return items

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

def table_flow(data, col_widths):
    """Long tables that span pages — no KeepTogether, header repeats."""
    rows = []
    for i, row in enumerate(data):
        styled = [Paragraph(str(c), ST["th"] if i == 0 else ST["td"]) for c in row]
        rows.append(styled)
    t = Table(rows, colWidths=col_widths, repeatRows=1, splitByRow=True)
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
    return [Spacer(1, 6), t, Spacer(1, 10)]

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
        mid = getattr(self, "_aw", self.cs) / 2.0
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

    # ── COVER ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 60))
    if _mark_black:
        story.append(LogoTriple(_mark_black))
    else:
        story.append(TripleDiamond())
    story.append(Spacer(1, 30))
    story.append(Paragraph("COMPLETE COURSE", ST["cover_label"]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Strategic<br/>Management", ST["cover_title"]))
    story.append(Spacer(1, 16))
    story.append(Paragraph("Study Pill", ST["cover_pill"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "All 7 steps · Every framework · One study session",
        ST["cover_sub"]))
    story.append(Spacer(1, 100))
    story.append(Paragraph("3 lessons · 7 steps · 30+ frameworks and tools", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))

    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # PART 1 — FOUNDATIONS
    # ════════════════════════════════════════════════════════════════════════
    story += part_header("1", "FOUNDATIONS",
                         "Steps 1.1–1.2 · Strategy · Vision · Mission · Objectives")

    # ── WHAT IS STRATEGY ────────────────────────────────────────────────────
    story += section("STRATEGY", "What Is Corporate Strategy?")
    story.append(body(
        "Strategy is the direction and scope of an organisation over the long-term, "
        "achieving advantage through its configuration of resources and competencies "
        "<i>(Johnson, Scholes and Whittington)</i>. Strategy sets where the business "
        "is going; operations execute that direction day to day."
    ))
    story.append(fact(
        "Strategy answers three questions: Where are we now? Where do we want to go? "
        "How do we get there? Every framework in this course maps onto one of these three."
    ))

    # ── THREE LEVELS ────────────────────────────────────────────────────────
    story += section("LEVELS", "The Three Levels of Strategy")
    story.append(body(
        "Strategy operates at three levels. Identifying which level a decision belongs to "
        "is a core exam skill — case questions frequently ask you to classify and explain."
    ))
    story.append(table_std([
        ["Level", "Focus", "Example (Zambeef)"],
        ["Corporate",
         "Which industries and markets to compete in. Portfolio decisions. Capital allocation across units.",
         "Zambeef expands cold-chain operations into East Africa alongside its Zambian business."],
        ["Business (Competitive)",
         "How to compete within a specific market. Which customers to serve. How to beat rivals.",
         "Zambeef retail competes on freshness and convenience rather than undercutting market stalls on price."],
        ["Functional / Operational",
         "Day-to-day implementation through HR, marketing, finance, and operations.",
         "Zambeef marketing allocates ZMW 80,000 to a loyalty scheme for repeat customers."],
    ], [CONTENT_W * 0.20, CONTENT_W * 0.42, CONTENT_W * 0.38]))
    story.append(callout(
        "Corporate = 'what businesses should we be in?'\n"
        "Business = 'how do we compete in this business?'\n"
        "Functional = 'how do we execute that strategy day to day?'\n"
        "Classify the level before analysing the decision."
    ))

    # ── MINTZBERG ───────────────────────────────────────────────────────────
    story += section("MINTZBERG", "The Five Ps of Strategy")
    story.append(body(
        "Mintzberg argued strategy is not always deliberate. He identified five forms it takes:"
    ))
    story.append(table_std([
        ["P", "What it means"],
        ["Plan",        "A conscious, top-down process — analyse, choose, implement. The formal written strategy."],
        ["Ploy",        "A tactical manoeuvre against a specific rival. Not the long-run position — just the move."],
        ["Pattern",     "Consistent behaviour that emerges over time, planned or not. Strategy as what you repeatedly do."],
        ["Position",    "How the firm places itself relative to competitors and the external environment."],
        ["Perspective", "The organisation's ingrained worldview — its shared assumptions about how to compete."],
    ], [CONTENT_W * 0.14, CONTENT_W * 0.86]))
    story.append(callout(
        "Plan vs. Pattern is the most tested pair. Plan is deliberate and top-down. "
        "Pattern is emergent — consistent decisions over time whether or not anyone planned it. "
        "A company can have an emergent pattern that contradicts its written plan."
    ))

    # ── STRATEGIC MANAGEMENT PROCESS ────────────────────────────────────────
    story += section("PROCESS", "The Strategic Management Process")
    story.append(body(
        "Strategic management is a cycle of four stages. "
        "'Describe the process' is a standard long-answer question — know each stage by name."
    ))
    story.append(table_std([
        ["Stage", "What happens"],
        ["1. Environmental Analysis",
         "Scan external threats and opportunities; audit internal resources and capabilities. Tools: PESTEL, Porter's Five Forces, SWOT, VRIO."],
        ["2. Strategy Formulation",
         "Set mission and objectives; generate strategic options; choose direction. Tools: Ansoff, BCG, Generic Strategies."],
        ["3. Strategy Implementation",
         "Convert chosen strategy into structures, budgets, processes, and people."],
        ["4. Evaluation and Control",
         "Monitor performance against targets; feed findings back into the next planning cycle."],
    ], [CONTENT_W * 0.27, CONTENT_W * 0.73]))

    # ── ORGANISATIONAL DIRECTION ─────────────────────────────────────────────
    story += section("DIRECTION", "The Four Components of Organisational Direction")
    story.append(table_std([
        ["Component",        "The question it answers",                    "Time focus"],
        ["Strategic Vision",  "Where are we going and why?",               "Long-term future"],
        ["Mission Statement", "What do we do right now, and for whom?",    "Present day"],
        ["Core Values",       "What principles govern how we behave?",     "Ongoing"],
        ["Objectives",        "What specific results must we achieve?",    "Short and long-term"],
    ], [CONTENT_W * 0.28, CONTENT_W * 0.48, CONTENT_W * 0.24]))

    # ── VISION ──────────────────────────────────────────────────────────────
    story += section("VISION", "Strategic Vision")
    story.append(body(
        "A strategic vision describes management's aspirations for the company's future "
        "and the course charted to achieve them. It answers <i>where are we going?</i> — "
        "not what the company does today."
    ))
    story.append(body(
        "A good vision is specific enough to guide resource allocation decisions, "
        "forward-looking, feasible, and short enough to be memorable. "
        "Generic superlatives — 'be the best', 'lead the industry' — tell no one where to go."
    ))
    story.append(fact(
        "Exam test: does the statement describe a future destination with enough "
        "specificity to guide decisions? If it could belong to any company in any industry, "
        "it has failed as a vision."
    ))

    # ── MISSION ─────────────────────────────────────────────────────────────
    story += section("MISSION", "Mission Statement")
    story.append(body(
        "The mission is grounded in the present. It answers "
        "<i>what do we do, for whom, and how?</i> A well-crafted mission identifies "
        "the products or services offered, the needs satisfied, the customer groups served, "
        "and what sets the organisation apart from rivals."
    ))
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

    # ── CORE VALUES ─────────────────────────────────────────────────────────
    story += section("VALUES", "Core Values")
    story.append(body(
        "Core values are the beliefs and behavioural norms employees are expected to display "
        "in pursuing the firm's vision and mission. When leadership genuinely models them, "
        "they become the reference point for decisions in situations where no rule exists. "
        "Values that conflict with strategy create internal contradiction — "
        "and values that leadership does not live destroy credibility faster than having none at all."
    ))

    # ── OBJECTIVES ──────────────────────────────────────────────────────────
    story += section("OBJECTIVES", "Setting Objectives")
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
        "Strategic objectives are <b>leading indicators</b>: winning on market standing today "
        "predicts financial performance tomorrow. Optimising only for financial targets "
        "is how companies post strong short-term results while eroding long-term position."
    ))
    story.append(h3("Well-Stated Objectives — Four Requirements"))
    story.append(bullet("<b>Specific</b> — precise enough that everyone agrees on what success looks like."))
    story.append(bullet("<b>Measurable</b> — a number or observable milestone, not a direction."))
    story.append(bullet("<b>Challenging</b> — ambitious enough to push performance, not so easy it creates complacency."))
    story.append(bullet("<b>Time-bound</b> — a deadline, not an open-ended aspiration."))
    story.append(Spacer(1, 6))
    story.append(body(
        "<b>Stretch objectives</b> push targets high enough to force creative thinking about how "
        "to achieve results. A company with <b>strategic intent</b> commits its full resources "
        "relentlessly to one ambitious long-term goal — an obsession that focuses the whole organisation."
    ))
    story.append(h3("The Balanced Scorecard"))
    story.append(body(
        "The Balanced Scorecard prevents hitting financial targets while eroding "
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
        "Why are financial objectives alone insufficient? Because they are lagging. "
        "The other three perspectives show whether the organisation is building or eroding "
        "the capacity to perform financially in the future."
    ))

    # ════════════════════════════════════════════════════════════════════════
    # PART 2 — ENVIRONMENT
    # ════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story += part_header("2", "ENVIRONMENT",
                         "Steps 2.1–2.2 · PESTEL · Porter's Five Forces · SWOT · Value Chain · VRIO")

    # ── TWO LAYERS ──────────────────────────────────────────────────────────
    story += section("ORIENTATION", "Two Layers of the Outside World")
    story.append(table_std([
        ["Layer",                "What it covers",                                                    "Primary tool"],
        ["Macro environment",    "Broad forces that affect all industries — politics, economics, "
                                 "society, technology, ecology, law. No single company controls them.", "PESTEL Analysis"],
        ["Industry environment", "The competitive structure of the specific market you operate in — "
                                 "who the rivals are, where the power sits, what threatens your position.", "Porter's Five Forces"],
    ], [CONTENT_W * 0.26, CONTENT_W * 0.52, CONTENT_W * 0.22]))
    story.append(body(
        "PESTEL answers: <i>what forces are shaping the world we compete in?</i> "
        "Porter's Five Forces answers: <i>what is the competitive structure of our specific industry?</i> "
        "Neither replaces the other."
    ))

    # ── PESTEL ──────────────────────────────────────────────────────────────
    story += section("PESTEL", "PESTEL Analysis")
    story.append(table_std([
        ["Factor",         "What to monitor"],
        ["Political",      "Government stability, tax policy, trade regulations, foreign investment rules, state ownership requirements."],
        ["Economic",       "GDP growth, inflation, interest rates, exchange rates, employment levels, credit availability."],
        ["Social",         "Demographics, urbanisation, education levels, cultural attitudes, consumer behaviour shifts."],
        ["Technological",  "Digital infrastructure, automation, fintech disruption, mobile penetration, platform ecosystems."],
        ["Environmental",  "Climate risk, ecological regulations, sustainability requirements from investors and lenders."],
        ["Legal",          "Competition law, employment law, consumer protection, sector licensing and regulatory frameworks."],
    ], [CONTENT_W * 0.22, CONTENT_W * 0.78]))
    story.append(h3("Political and Economic Factors in Zambia"))
    story.append(body(
        "When the Zambian government adjusted mining royalty rates in 2019 — raising them for open-cast mines "
        "to 9% at copper prices above USD 7,500 per tonne — First Quantum and other mining houses had to rebuild "
        "their investment cases overnight. No amount of internal efficiency offsets a policy change "
        "that moves the cost line by that magnitude."
    ))
    story.append(body(
        "Between 2015 and 2023, the kwacha depreciated from roughly K8 per USD to over K25. "
        "Any company holding USD-denominated debt or importing inputs in foreign currency absorbed "
        "that depreciation directly as a cost increase. Combined with inflation peaking above 22% in 2021, "
        "the economic environment forced constant revision of pricing, sourcing, and financing."
    ))
    story.append(h3("Social and Technological Factors in Zambia"))
    story.append(body(
        "Zambia's population is young — over 60% are under 25 — and rapidly urbanising. "
        "Mobile money penetration has outpaced formal banking: MTN Mobile Money and Airtel Money "
        "collectively serve more Zambians than all commercial banks combined by transaction volume. "
        "A distribution strategy built around physical branches in 2015 was positioned for the wrong "
        "market by 2022."
    ))
    story.append(fact(
        "Exam application: PESTEL is not a checklist to fill in — it is a thinking tool. "
        "The question is not 'what are the factors?' but 'which factors are most material "
        "to this specific company in this specific context, and how do they interact?'"
    ))

    # ── PORTER'S FIVE FORCES ────────────────────────────────────────────────
    story += section("FIVE FORCES", "Porter's Five Forces")
    story.append(body(
        "The framework maps the competitive structure of an industry — where the power sits, "
        "what threatens margins, and whether an industry is structurally attractive "
        "or structurally difficult to profit in."
    ))
    story.append(table_std([
        ["Force",                              "What it measures"],
        ["1. Competitive Rivalry",             "The intensity of competition among existing players."],
        ["2. Threat of New Entrants",          "How easily new competitors can enter the industry."],
        ["3. Bargaining Power of Suppliers",   "How much leverage suppliers have over pricing and terms."],
        ["4. Bargaining Power of Buyers",      "How much power customers have to demand lower prices or better terms."],
        ["5. Threat of Substitutes",           "How easily customers can switch to a different product that serves the same underlying need."],
    ], [CONTENT_W * 0.40, CONTENT_W * 0.60]))
    story.append(body(
        "Zambia's commercial banking sector: rivalry among Zanaco, Absa, FNB, Stanbic is intense — "
        "same urban, salaried customer base, low switching costs, thin differentiation. "
        "Bank of Zambia requires K104 million in minimum paid-up capital for a banking licence — "
        "a substantial barrier. But Airtel and MTN entered as mobile money operators under a different "
        "regulatory category with their existing subscriber bases. The framework only reveals this "
        "threat if you ask: who can serve the same need by a different route?"
    ))
    story.append(body(
        "Zambeef depends on ZESCO for cold-chain electricity — the sole grid provider. "
        "When ZESCO implements load-shedding, Zambeef runs generators at cost or absorbs spoilage. "
        "Supplier power is extreme when there is no alternative."
    ))
    story.append(callout(
        "Key exam distinction: substitutes are NOT competitive rivalry. "
        "Rivalry is between companies in the same industry (Zanaco vs. Absa). "
        "Substitution comes from a different category serving the same underlying need "
        "(mobile money vs. a bank current account). "
        "A substitute can be more dangerous precisely because it arrives from outside your frame."
    ))

    # ── INTERNAL ORIENTATION ────────────────────────────────────────────────
    story += section("ORIENTATION", "Looking Inward After Looking Out")
    story.append(body(
        "The same question as the external analysis, just from the inside: "
        "given what the world looks like, what does your organisation actually have to work with? "
        "SWOT surfaces relative strengths and weaknesses, the Value Chain shows where value is created "
        "or lost, and VRIO tests whether a specific resource is genuinely a source of competitive advantage."
    ))

    # ── SWOT ────────────────────────────────────────────────────────────────
    story += section("SWOT", "SWOT — The Internal Half")
    story.append(table_std([
        ["Dimension",    "What it captures",                                              "Internal or External?"],
        ["Strengths",    "Resources and capabilities that give the organisation an edge.", "Internal"],
        ["Weaknesses",   "Gaps and limitations where the organisation underperforms.",    "Internal"],
        ["Opportunities","Favourable external conditions from PESTEL or Porter's.",        "External"],
        ["Threats",      "Adverse external conditions that could damage performance.",    "External"],
    ], [CONTENT_W * 0.22, CONTENT_W * 0.60, CONTENT_W * 0.18]))
    story.append(body(
        "Strengths and weaknesses are relative, not absolute. "
        "Zambeef's vertically integrated cold chain is a strength when supply chain reliability matters. "
        "When ZESCO implements sustained load-shedding, that same integration becomes a vulnerability — "
        "every link depends on electricity the company does not control. "
        "A strength in one environment can be a weakness in another."
    ))
    story.append(fact(
        "Exam test for SWOT: a strength must be relevant to the strategy and superior "
        "to what rivals have. If every competitor in the industry has the same capability, "
        "it is not a strength — it is the minimum requirement for competing."
    ))

    # ── VALUE CHAIN ─────────────────────────────────────────────────────────
    story += section("VALUE CHAIN", "Porter's Value Chain")
    story.append(body(
        "The Value Chain breaks a company's operations into the sequence of activities "
        "that create value for the customer. The analysis asks where the company creates "
        "more value than it costs to produce — and where it does not."
    ))
    story.append(table_std([
        ["Category", "Activity",              "What it covers"],
        ["Primary",  "Inbound Logistics",     "Receiving, storing, and distributing inputs — raw materials, components, stock."],
        ["Primary",  "Operations",            "Transforming inputs into the finished product or service."],
        ["Primary",  "Outbound Logistics",    "Storing and distributing the finished product to customers."],
        ["Primary",  "Marketing & Sales",     "Making customers aware of and willing to buy the product."],
        ["Primary",  "Service",               "After-sale activities that maintain or enhance the product's value."],
        ["Support",  "Procurement",           "Acquiring the inputs used across all primary activities."],
        ["Support",  "Technology Development","Systems, R&D, and process improvements that support primary activities."],
        ["Support",  "Human Resources",       "Recruiting, training, and retaining the people who run every activity."],
        ["Support",  "Firm Infrastructure",   "Finance, planning, legal, and general management."],
    ], [CONTENT_W * 0.18, CONTENT_W * 0.28, CONTENT_W * 0.54]))
    story.append(body(
        "Zambeef's competitive position rests on its primary activities: "
        "inbound logistics (own farms), operations (own abattoirs and processing), "
        "and outbound logistics (own cold-chain fleet and retail outlets). "
        "A competitor sourcing externally and distributing through third-party retailers "
        "has less control at each link. That gap is where Zambeef's advantage lives."
    ))

    # ── VRIO ────────────────────────────────────────────────────────────────
    story += section("VRIO", "The VRIO Framework")
    story.append(body(
        "VRIO tests whether a specific resource or capability translates into competitive advantage — "
        "and if so, whether that advantage is sustainable."
    ))
    story.append(table_std([
        ["Value", "Rarity", "Inimitable", "Organised", "Competitive implication"],
        ["No",  "—",   "—",   "—",   "Competitive disadvantage — the resource destroys rather than creates value."],
        ["Yes", "No",  "—",   "—",   "Competitive parity — everyone has it; it's the industry standard, not an edge."],
        ["Yes", "Yes", "No",  "—",   "Temporary advantage — rivals can copy it; the lead erodes over time."],
        ["Yes", "Yes", "Yes", "No",  "Unrealised advantage — the capability exists but the company is not structured to exploit it."],
        ["Yes", "Yes", "Yes", "Yes", "Sustained competitive advantage — the source of above-average returns over time."],
    ], [CONTENT_W * 0.11, CONTENT_W * 0.11, CONTENT_W * 0.14, CONTENT_W * 0.14, CONTENT_W * 0.50]))
    story.append(body(
        "First Quantum's mineral rights at Kansanshi pass all four tests: valuable (copper production), "
        "rare (specific rights to that ore body), inimitable (enormous capital and geological knowledge "
        "required to replicate), and organised (dedicated operational systems and technical expertise). "
        "The result is a sustained competitive position smaller miners cannot match."
    ))
    story.append(body(
        "MTN Zambia's mobile money platform is valuable and rare. But it is becoming imitable — "
        "Airtel Money has built comparable scale. Unless MTN deepens inimitability through data "
        "advantages or ecosystem lock-in, the advantage is temporary. "
        "VRIO asks not just 'do we have it?' but 'how long will it hold?'"
    ))
    story.append(callout(
        "Common exam error: treating all company resources as strengths. "
        "VRIO separates resources that create advantage from those that simply keep the company in the game. "
        "A bank with ATMs across Lusaka has Value — but so does every other bank. "
        "It passes V, fails R. That is parity, not advantage."
    ))

    # ════════════════════════════════════════════════════════════════════════
    # PART 3 — STRATEGY
    # ════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story += part_header("3", "STRATEGY",
                         "Steps 3.1–3.3 · Corporate · Competitive · Implementation")

    # ── CORPORATE STRATEGY: LEVELS ──────────────────────────────────────────
    story += section("LEVELS", "Where Strategy-Making Happens")
    story.append(body(
        "Parts 1 and 2 built the analytical foundation. Now the work shifts from analysis to choice. "
        "Strategic choices happen at three distinct levels — each answering a different question, "
        "involving different decision-makers, and operating on a different time horizon."
    ))
    story.append(table_std([
        ["Level", "Who decides", "Core question", "Time horizon"],
        ["Corporate", "Board / Group CEO",
         "Which businesses should we be in? How do we allocate capital across them?", "5–10 years"],
        ["Business",  "Divisional MD / BU head",
         "How do we compete and win within our chosen market?", "2–5 years"],
        ["Functional","Functional heads (CFO, CMO, COO)",
         "How does each function support the business strategy?", "1–2 years"],
    ], [2.2*cm, 2.8*cm, CONTENT_W - 7.5*cm, 2.5*cm]))

    # ── CORPORATE STRATEGY: DIRECTIONS ──────────────────────────────────────
    story += section("CORPORATE STRATEGY", "The Four Corporate-Level Strategy Directions")
    story.append(body(
        "At the corporate level, the fundamental question is: <i>What direction should this "
        "organisation move in?</i> Every corporate-level decision fits one of four directions."
    ))
    story.append(table_std([
        ["Direction",    "What it means",                                                   "When to choose it"],
        ["Growth",       "Expand — into new products, markets, or businesses.",
         "When the environment offers real opportunity and the firm has capability and capital to capture it."],
        ["Stability",    "Maintain the current position. Protect what works without significant new investment.",
         "When the market is mature and disruption carries more risk than growth."],
        ["Retrenchment", "Pull back — cut costs, exit underperforming businesses, refocus on core strengths.",
         "When performance is declining or parts of the portfolio are destroying value."],
        ["Combination",  "Apply different directions to different business units simultaneously.",
         "When the portfolio is diverse — some units merit growth, others stability or exit."],
    ], [2.4*cm, CONTENT_W * 0.42, CONTENT_W - 2.4*cm - CONTENT_W * 0.42]))
    story.append(body(
        "Most large Zambian organisations are combination strategists without labelling it: "
        "Zambeef invests aggressively in cold-chain capacity (growth) while running its retail "
        "outlets as mature steady earners (stability). First Quantum expands into new minerals "
        "while exiting mines that no longer cover their cost of capital (retrenchment)."
    ))

    # ── GROWTH PATHS ────────────────────────────────────────────────────────
    story += section("GROWTH PATHS", "How Organisations Expand: Four Paths")
    story.append(h3("1. Concentrated Growth (Intensification)"))
    story.append(body(
        "Focus resources on profitable growth within the <b>existing product in the existing market</b>. "
        "Zambia's mobile-money market used concentrated growth for years — MTN, Airtel, and Zamtel "
        "competing intensely for the same customer base before market saturation pushed them toward new segments."
    ))
    story.append(h3("2. Market and Product Development"))
    story.append(body(
        "<b>Market development</b> takes an existing product into a new market "
        "(e.g., Zambian Breweries expanding into rural areas or neighbouring countries). "
        "<b>Product development</b> launches new products for existing customers "
        "(e.g., a bank launching insurance products to its account holders). "
        "Both leverage something the firm already knows well — lower risk than full diversification."
    ))
    story.append(h3("3. Vertical Integration"))
    story.append(bullet(
        "<b>Backward integration:</b> Control upstream — Zambeef's ownership of feedlots, abattoirs, "
        "and processing plants. Controls input costs and quality at every stage from farm to packaged product."
    ))
    story.append(bullet(
        "<b>Forward integration:</b> A manufacturer opening its own retail outlets instead of selling "
        "through distributors. Advantage: margin capture and direct customer relationships. "
        "Risk: retail requires different capabilities than manufacturing."
    ))
    story.append(h3("4. Horizontal Integration"))
    story.append(body(
        "Acquire or merge with a <b>competitor at the same stage</b> of the value chain. "
        "Goal: scale, market share, and elimination of a rival. "
        "Stanbic's acquisition of CFC Bank in Zambia is horizontal integration — same industry, "
        "same customer base, merged to achieve scale. "
        "Risk: mergers are expensive to execute, and cultural clashes frequently destroy the value they were meant to create."
    ))

    # ── DIVERSIFICATION ─────────────────────────────────────────────────────
    story += section("DIVERSIFICATION", "Moving Beyond the Core Business")
    story.append(h3("Related Diversification (Concentric)"))
    story.append(body(
        "Enter businesses that share technology, customers, distribution channels, or brand with the core. "
        "A Zambian bank entering asset management, insurance, or stockbroking: same customers, "
        "complementary products, shared compliance infrastructure. "
        "The test is whether real synergies exist — specific cost savings or revenue enhancements, "
        "not just the word 'synergy.'"
    ))
    story.append(h3("Unrelated Diversification (Conglomerate)"))
    story.append(body(
        "Enter businesses with no strategic connection to the core. The only rationale is financial — "
        "the acquirer believes it can manage the business better, or that different cash flows reduce overall risk. "
        "Most large conglomerates eventually break up because the parts are worth more separately than together."
    ))
    story.append(fact(
        "The three tests for any diversification: (1) Industry attractiveness — is the target industry "
        "genuinely attractive? (2) Cost of entry — will you pay so much that future profits can never "
        "justify the price? (3) Better-off test — will the combined entity be better off than the "
        "businesses operating independently?"
    ))

    # ── BCG MATRIX ──────────────────────────────────────────────────────────
    story += section("PORTFOLIO ANALYSIS", "The BCG Matrix: Allocating Capital Across the Portfolio")
    story.append(body(
        "The BCG Growth-Share Matrix maps every business unit on two dimensions: "
        "<b>market growth rate</b> and <b>relative market share</b>. "
        "It answers: where do we invest, where do we harvest, and where do we exit?"
    ))
    story.append(table_std([
        ["Quadrant",       "Market growth", "Relative share", "Strategic logic",                                                  "Cash flow"],
        ["Stars",          "High",          "High",           "Invest heavily to maintain position. Will become Cash Cows as market matures.", "Roughly neutral"],
        ["Cash Cows",      "Low",           "High",           "Milk the profits. Don't over-invest; extract cash to fund Stars and Question Marks.", "Strong positive"],
        ["Question Marks", "High",          "Low",            "Invest to become a Star, or exit before the market matures and you're stuck as a Dog.", "Negative"],
        ["Dogs",           "Low",           "Low",            "Exit or reposition. Rarely justify their cost of capital.",        "Neutral to negative"],
    ], [2.2*cm, 1.8*cm, 2.2*cm, CONTENT_W - 8.7*cm, 2.5*cm]))
    story.append(body(
        "Zambian Breweries: <b>Mosi Lager</b> (dominant mass-market beer, high share in a mature market) "
        "is a classic <b>Cash Cow</b> — the earnings engine. Sorghum-based affordable beers sit somewhere "
        "between Cash Cow and Star. Premium imported brands are <b>Question Marks</b> — invest seriously "
        "in premium positioning, or leave that segment to independents."
    ))
    story.append(callout(
        "BCG limitation: The matrix assumes market share drives profitability and that high-growth markets "
        "are always worth entering. Neither is universally true. "
        "Use BCG as a starting framework, not a formula — the three diversification tests still apply."
    ))

    # ── COMPETITIVE STRATEGY: ORIENTATION ───────────────────────────────────
    story += section("COMPETITIVE STRATEGY", "From Portfolio to Battlefield")
    story.append(body(
        "Corporate strategy answered: <i>Which businesses should we be in?</i> "
        "Competitive strategy answers: <i>How do we compete and win in the business we have chosen?</i> "
        "Porter's core argument is that sustainable competitive advantage comes from choosing a clear position — "
        "and that the worst strategic error is being stuck in the middle: "
        "neither cost-competitive nor meaningfully differentiated. "
        "Stuck-in-the-middle firms earn below-average returns across every industry."
    ))

    # ── PORTER'S GENERIC STRATEGIES ─────────────────────────────────────────
    story += section("GENERIC STRATEGIES", "Porter's Three Generic Strategies")
    story.append(body(
        "Two dimensions define the competitive space: the <b>source of advantage</b> "
        "(lower cost vs unique value) and the <b>competitive scope</b> (broad market vs narrow segment)."
    ))
    story.append(table_std([
        ["Strategy",              "Source of advantage",         "Scope",         "How to win",                                                          "Core risk"],
        ["Cost Leadership",       "Lower cost than rivals",      "Broad market",  "Produce at lower cost than anyone — pass some savings on, keep rest as margin.", "Technology change erodes cost advantage overnight."],
        ["Differentiation",       "Unique value customers prize","Broad market",  "Offer something competitors cannot easily replicate — brand, technology, service. Charge a premium.", "Competitors imitate. Preferences shift."],
        ["Cost Focus",            "Lower cost within a segment", "Narrow segment","Be the low-cost provider for a specific niche.",                      "Segment shrinks. Broad cost leaders attack."],
        ["Differentiation Focus", "Unique value within a segment","Narrow segment","Serve a segment so well that broader competitors cannot match you.",  "Broad differentiators narrow their focus."],
    ], [2.2*cm, 2.5*cm, 1.8*cm, CONTENT_W - 9.5*cm, 3*cm]))
    story.append(callout(
        "Stuck in the Middle: A Zambian supermarket that tries to match Shoprite's prices AND offer "
        "premium imported goods AND compete on convenient locations will be worse than Shoprite at cost, "
        "worse than specialty retailers at range, and worse at everything else. "
        "Pick one position and make it defensible."
    ))

    # ── ACHIEVING EACH POSITION ──────────────────────────────────────────────
    story += section("EXECUTION", "Achieving and Defending Each Position")
    story.append(h3("How to Achieve Cost Leadership"))
    story.append(bullet("Scale: higher volume spreads fixed costs over more units (Zambia's telecom operators)"))
    story.append(bullet("Experience curve: cumulative production lowers unit costs over time"))
    story.append(bullet("Process design: standardised, efficient workflows reduce labour and waste"))
    story.append(bullet("Supply chain: preferred supplier contracts, bulk purchasing, backward integration"))
    story.append(bullet("Technology: automation of routine tasks, digital delivery instead of physical"))
    story.append(Spacer(1, 8))
    story.append(h3("How to Achieve Differentiation"))
    story.append(bullet("Brand: built over years, impossible to copy quickly (MTN's brand in Zambia)"))
    story.append(bullet("Proprietary technology or process: unique capability not available to rivals"))
    story.append(bullet("Customer relationships: deep loyalty and switching costs"))
    story.append(bullet("Quality signals: certifications, awards, reputation built over time"))
    story.append(bullet("Integration depth: like Zambeef's farm-to-retail chain, creating end-to-end control"))
    story.append(Spacer(1, 8))

    # ── OFFENSIVE STRATEGIES ────────────────────────────────────────────────
    story += section("OFFENSIVE MOVES", "Offensive Strategies: Going on the Attack")
    story.append(table_std([
        ["Offensive move",           "What it involves",                                                        "When to use it"],
        ["Attack competitor strengths",  "Match or exceed rivals in their area of advantage — out-invest, out-innovate, undercut on price.", "When you have resources to sustain the fight and the prize justifies the cost."],
        ["Attack competitor weaknesses", "Target gaps: underserved segments, slow distribution, weak customer service.", "When rivals are overextended or have neglected specific segments."],
        ["End-run (blue ocean)",         "Bypass competition by creating a new market space where rivals don't yet compete.", "When existing markets are saturated and there is a genuine underserved need."],
        ["Guerrilla offensives",         "Small targeted strikes — price promotions in specific regions, aggressive local marketing.", "When the firm lacks scale for direct assault but can inflict damage selectively."],
        ["Pre-emptive strikes",          "Lock up resources, talent, or partnerships before rivals can.",           "When a new opportunity is emerging and being first creates durable lock-in."],
    ], [3*cm, CONTENT_W * 0.42, CONTENT_W - 3*cm - CONTENT_W * 0.42]))
    story.append(fact(
        "First-mover advantages in Zambia: Airtel Money's predecessor entered mobile money early "
        "and built a customer base that later entrants struggled to displace. "
        "Network effects made it self-reinforcing — the more users, the more useful. "
        "Late entrants had to spend heavily on incentives just to reach parity."
    ))

    # ── DEFENSIVE STRATEGIES ────────────────────────────────────────────────
    story += section("DEFENSIVE MOVES", "Defensive Strategies: Holding Your Ground")
    story.append(h3("Raising Barriers to Attack"))
    story.append(bullet("Switching costs: make it expensive or inconvenient for customers to leave (loyalty programmes, data lock-in, long contracts)"))
    story.append(bullet("Broaden the product range: fill gaps that rivals could exploit for entry"))
    story.append(bullet("Exclusive supplier or distribution agreements: deny rivals access to key inputs or channels"))
    story.append(bullet("Signal strength: communicate convincingly that you will defend your position vigorously — deters opportunistic entry"))
    story.append(Spacer(1, 8))
    story.append(h3("Responding to an Attack"))
    story.append(body(
        "If a rival attacks your core segment with lower prices, the question is not 'match the price' "
        "but 'why are customers defecting, and can we fix that without destroying margin?' "
        "A targeted response — price match only in the attacked segment, not market-wide — "
        "sends a signal without collapsing your entire pricing structure."
    ))
    story.append(callout(
        "Defensive principle: the goal is not to respond to every attack but to make your position "
        "structurally unattractive to attack. If rivals know you will defend aggressively and have the "
        "resources to do so, they will often look elsewhere. "
        "The best defence is building genuine advantages that competitors cannot easily replicate."
    ))

    # ── IMPLEMENTATION: ORIENTATION ─────────────────────────────────────────
    story += section("IMPLEMENTATION", "The Execution Problem")
    story.append(body(
        "Analysis and strategic choice are complete. None of it matters until translated into action. "
        "McKinsey research shows fewer than one in three strategically important initiatives "
        "is executed as planned. The root causes are almost never the strategy itself — "
        "they are execution failures: misaligned structures, wrong metrics, change resistance, "
        "and resources not matching priorities."
    ))
    story.append(callout(
        "Implementation is not a one-off event. It requires ongoing monitoring, "
        "comparison against targets, and willingness to adapt when the plan meets reality. "
        "Strategy without control drifts. Control without strategy optimises for the wrong outcomes."
    ))

    # ── McKINSEY 7-S ────────────────────────────────────────────────────────
    story += section("ALIGNMENT", "The McKinsey 7-S Framework")
    story.append(body(
        "Seven internal elements must point in the same direction for strategy to succeed. "
        "If even one is misaligned, execution suffers."
    ))
    story.append(table_std([
        ["Element",       "What it means",                                          "Key question"],
        ["Strategy",      "The direction and choices the organisation is pursuing", "Is the strategy clear and understood at every level?"],
        ["Structure",     "How authority, accountability, and decision-making are organised", "Does the structure enable strategy or create barriers?"],
        ["Systems",       "Processes, budgets, information flows, and measurement", "Do systems measure and reward behaviours the strategy requires?"],
        ["Style",         "Leadership approach and cultural tone from the top",     "Does leadership model the behaviour the strategy asks for?"],
        ["Staff",         "People — hiring, development, talent pipeline",          "Do we have the right people in the roles the strategy depends on?"],
        ["Skills",        "Distinctive capabilities and organisational competencies","What capabilities does the strategy require, and where are the gaps?"],
        ["Shared Values", "Core purpose and culture — the centre of the model",    "Do people believe in what the organisation stands for?"],
    ], [2.2*cm, CONTENT_W * 0.38, CONTENT_W - 2.2*cm - CONTENT_W * 0.38]))
    story.append(body(
        "<b>Zambian bank example:</b> Digital-first strategy to reach unbanked customers via mobile. "
        "Strategy is clear. Branch structure remains hierarchical with decisions made centrally (Structure misaligned). "
        "Technology hiring constrained by grade-band pay built for branch roles (Staff misaligned). "
        "Bonuses still reward in-branch transactions, not mobile onboarding (Systems misaligned). "
        "Six of seven elements pulling against the strategy — it will fail."
    ))

    # ── BALANCED SCORECARD ──────────────────────────────────────────────────
    story += section("MEASUREMENT", "The Balanced Scorecard: Measuring What Matters")
    story.append(body(
        "Strategy is a hypothesis: <i>if we do X, then Y will result.</i> "
        "The Balanced Scorecard translates that hypothesis into measurable targets across four perspectives, "
        "making it possible to monitor whether the strategy is working "
        "and to intervene before financial results deteriorate."
    ))
    story.append(table_std([
        ["Perspective",       "Strategic question",                            "What to measure"],
        ["Financial",         "Is the strategy delivering financial returns?", "Revenue growth, profit margin, cash flow, ROI on strategic initiatives"],
        ["Customer",          "Are target customers satisfied and loyal?",     "Customer satisfaction score, retention rate, market share in target segment"],
        ["Internal Process",  "Are we executing critical processes efficiently?","Process cycle time, quality defect rate, speed of key workflows"],
        ["Learning & Growth", "Are we building the capabilities the strategy requires?","Employee capability index, training hours, rate of innovation"],
    ], [2.4*cm, CONTENT_W * 0.38, CONTENT_W - 2.4*cm - CONTENT_W * 0.38]))
    story.append(body(
        "The <b>cause-and-effect chain</b>: invest in Learning &amp; Growth (train people) → "
        "improve Internal Processes (serve faster, fewer errors) → improve Customer outcomes "
        "(higher satisfaction, lower churn) → improve Financial results. "
        "Without this chain, a company can hit financial targets by destroying the capabilities "
        "that will generate next year's results."
    ))

    # ── KOTTER ──────────────────────────────────────────────────────────────
    story += section("CHANGE MANAGEMENT", "Kotter's 8-Step Model")
    story.append(body(
        "Strategy fundamentally requires people to change behaviour. "
        "Kotter's research identifies the sequence that separates successful transformations from failures:"
    ))
    story.append(table_std([
        ["Step",                   "Action required",                                        "Cost of skipping"],
        ["1. Establish urgency",   "Make a compelling case for why change is necessary now", "Inertia wins — people wait for someone else to move first"],
        ["2. Build a coalition",   "Recruit powerful sponsors who believe in the change",    "Isolated advocates cannot overcome systemic scepticism"],
        ["3. Form a vision",       "Articulate a clear picture of what success looks like",  "People don't know the destination and default to the past"],
        ["4. Communicate constantly","Repeat the vision through every channel available",    "Message gets lost — employees hear what they want to hear"],
        ["5. Remove barriers",     "Give people permission and resources to act on the vision","Bureaucracy blocks change before it starts"],
        ["6. Create early wins",   "Identify and celebrate quick, visible victories",        "Momentum dies; sceptics say 'I told you so'"],
        ["7. Build on wins",       "Keep pressure on; avoid declaring victory prematurely",  "Old habits resurface the moment leadership attention moves on"],
        ["8. Anchor the change",   "Embed new behaviour in culture, systems, and hiring",   "Change is fragile and reverts under pressure"],
    ], [3.2*cm, CONTENT_W * 0.40, CONTENT_W - 3.2*cm - CONTENT_W * 0.40]))
    story.append(fact(
        "Budget and time estimates for implementation should include 30-40% effort on "
        "change management. If you are not investing in getting people to change behaviour, "
        "the strategy has no chance of landing."
    ))

    # ── ORG STRUCTURES ──────────────────────────────────────────────────────
    story += section("STRUCTURE", "Structure Follows Strategy")
    story.append(body(
        "Chandler's principle: structure should follow strategy. Organisations redesign their strategy "
        "and then try to execute it with structures built for a different purpose. "
        "The result is friction — decisions made in the wrong place, accountability diffused, "
        "coordination failures. Choosing the right structure is a strategic decision, not an HR exercise."
    ))
    story.append(table_std([
        ["Structure",  "How it works",                                          "Best-fit strategy",                         "Key risk"],
        ["Functional", "Grouped by function: Finance, Sales, Operations, HR",  "Cost leadership, efficiency, stability",    "Silos create coordination failures across functions"],
        ["Divisional", "Grouped by product, geography, or customer segment",   "Growth, diversification, multi-market",     "Duplication of functions increases cost"],
        ["Matrix",     "Dual reporting — functional and divisional lines",      "Innovation, customisation, complex projects","Conflict over authority; confusion about decisions"],
        ["Network",    "Loosely coupled units, heavy outsourcing, partnerships","Agility, specialisation, platform strategies","Loss of control; consistency and quality risks"],
    ], [2*cm, 2.6*cm, CONTENT_W - 7.6*cm, 3*cm]))

    # ── STRATEGIC CONTROL ───────────────────────────────────────────────────
    story += section("STRATEGIC CONTROL", "Monitoring and Adapting")
    story.append(body(
        "Strategic control asks 'is the strategy itself still valid?' — distinct from operational "
        "control, which asks 'are we executing efficiently?' Four types:"
    ))
    story.append(bullet("<b>Premise control:</b> Monitor the assumptions that justified the strategy. If the PESTEL factors change materially, the strategy may need revision."))
    story.append(bullet("<b>Implementation control:</b> Track whether milestones are hit and resources deployed as planned."))
    story.append(bullet("<b>Strategic surveillance:</b> Broad monitoring of the competitive environment for unexpected developments."))
    story.append(bullet("<b>Special alert control:</b> Pre-defined response protocols for sudden crises — a competitor acquisition, a regulatory change, a supply disruption."))
    story.append(Spacer(1, 14))

    # ════════════════════════════════════════════════════════════════════════
    # MASTER KEY TERMS
    # ════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story += section("REFERENCE", "Master Key Terms — Complete Course Glossary")

    story.append(h3("Foundations (Steps 1.1–1.2)"))
    story += table_flow([
        ["Term", "Definition"],
        ["Strategy",                "Direction and scope of an organisation over the long-term, achieving advantage through its configuration of resources and competencies (Johnson, Scholes and Whittington)"],
        ["Emergent Strategy",       "A pattern in decisions that arises over time without a deliberate plan — Mintzberg's Pattern P"],
        ["Competitive Advantage",   "An attribute enabling a firm to outperform rivals through lower cost or higher perceived value"],
        ["Mintzberg's Five Ps",     "Plan, Ploy, Pattern, Position, Perspective — five ways strategy forms in organisations"],
        ["Strategic Vision",        "Management's aspirations for the company's future — answers 'where are we going?'"],
        ["Mission Statement",       "The company's current purpose — what it does, for whom, and how — answers 'why do we exist today?'"],
        ["Core Values",             "Beliefs and behavioural norms employees display in pursuing the firm's vision and mission"],
        ["Financial Objectives",    "Targets for revenue, profit, margins, and return on investment — lagging indicators"],
        ["Strategic Objectives",    "Targets for market position, customers, and capability — leading indicators of future financial performance"],
        ["Stretch Objectives",      "Targets set beyond current comfortable reach to push the organisation to its full potential"],
        ["Balanced Scorecard",      "A measurement system tracking performance across four perspectives: Financial, Customer, Internal Process, and Learning & Growth"],
        ["Leading Indicator",       "A metric that predicts future performance (e.g., training completion predicts future process quality)"],
        ["Lagging Indicator",       "A metric that reflects past performance (e.g., profit margin reflects decisions made months earlier)"],
    ], [CONTENT_W * 0.32, CONTENT_W * 0.68])

    story.append(h3("Environment (Steps 2.1–2.2)"))
    story += table_flow([
        ["Term", "Definition"],
        ["Macro environment",              "The broad external forces — political, economic, social, technological, environmental, and legal — that affect all organisations and cannot be controlled by any single firm"],
        ["PESTEL Analysis",                "A framework for scanning the macro environment across six categories: Political, Economic, Social, Technological, Environmental, and Legal"],
        ["Industry environment",           "The competitive structure of the specific market an organisation operates in — shaped by rivals, entrants, suppliers, buyers, and substitutes"],
        ["Porter's Five Forces",           "A framework analysing industry structure through five sources of competitive pressure: rivalry, new entrants, supplier power, buyer power, and substitutes"],
        ["Barriers to Entry",              "Factors making it costly or difficult for new competitors to enter — capital requirements, regulation, brand loyalty, economies of scale"],
        ["Bargaining Power of Suppliers",  "The ability of input suppliers to raise prices or restrict terms — strongest when suppliers are few and alternatives limited"],
        ["Bargaining Power of Buyers",     "The ability of customers to push down prices or demand better terms — strongest when buyers are large, concentrated, and face low switching costs"],
        ["Threat of Substitutes",          "The risk that customers switch to a different product from a different category serving the same underlying need"],
        ["SWOT Analysis",                  "A framework identifying internal Strengths and Weaknesses alongside external Opportunities and Threats"],
        ["Value Chain",                    "Porter's framework mapping an organisation's activities into the sequence that creates value — primary activities and support activities"],
        ["Primary Activities",             "The five directly value-creating activities: inbound logistics, operations, outbound logistics, marketing and sales, and service"],
        ["Support Activities",             "Activities that enable the primary activities: procurement, technology development, human resources, and firm infrastructure"],
        ["VRIO Framework",                 "A test of whether a resource creates sustained competitive advantage: Valuable, Rare, Inimitable, and Organised to exploit"],
        ["Sustained Competitive Advantage","A position of above-average performance that persists because the underlying capability passes all four VRIO tests"],
        ["Core Competency",                "A capability central to the firm's strategy and performance, typically passing at least V, R, and I of VRIO"],
    ], [CONTENT_W * 0.32, CONTENT_W * 0.68])

    story.append(h3("Strategy (Steps 3.1–3.3)"))
    story += table_flow([
        ["Term", "Definition"],
        ["Corporate strategy",        "Top-level decisions about which businesses an organisation is in and how capital is allocated across them"],
        ["Retrenchment strategy",     "Pulling back — reducing scope, cutting costs, or exiting underperforming businesses"],
        ["Concentrated growth",       "Growing by deepening penetration of the existing product in the existing market"],
        ["Vertical integration",      "Expanding along the supply chain — backward toward suppliers or forward toward customers"],
        ["Horizontal integration",    "Acquiring or merging with a competitor at the same stage of the value chain"],
        ["Related diversification",   "Entering new businesses that share technology, customers, or channels with the core"],
        ["Unrelated diversification", "Entering businesses with no strategic connection to the core — pure financial rationale"],
        ["BCG Matrix",                "A portfolio tool mapping business units by market growth rate and relative market share"],
        ["Cash Cow",                  "High-share, low-growth unit — generates cash, needs minimal reinvestment"],
        ["Star",                      "High-share, high-growth unit — invest to maintain; will become Cash Cow as market matures"],
        ["Question Mark",             "Low-share, high-growth unit — invest to win or exit before the market matures"],
        ["Dog",                       "Low-share, low-growth unit — exit or reposition; rarely worth continued investment"],
        ["Cost leadership",           "Competing by being the lowest-cost producer in the industry while maintaining acceptable quality"],
        ["Differentiation",           "Competing by offering unique value that customers prize and are willing to pay a premium for"],
        ["Focus strategy",            "Competing by dominating a narrow market segment with either cost or differentiation advantage"],
        ["Stuck in the middle",       "The losing position of firms that pursue neither cost leadership nor meaningful differentiation"],
        ["First-mover advantage",     "Benefits gained by entering a market before competitors — brand, customer lock-in, standard-setting"],
        ["Experience curve",          "Systematic decline in unit costs as cumulative production increases, due to learning and efficiency gains"],
        ["Switching costs",           "The cost (financial, operational, psychological) of moving from one supplier to another — a key defensive barrier"],
        ["McKinsey 7-S",              "Seven elements that must align for strategy to succeed: Strategy, Structure, Systems, Style, Staff, Skills, Shared Values"],
        ["Kotter's 8-Step Model",     "A change management sequence: urgency, coalition, vision, communication, empowerment, early wins, consolidation, anchoring"],
        ["Strategic control",         "Ongoing monitoring of whether the strategy is being implemented correctly and whether its underlying assumptions remain valid"],
        ["Premise control",           "Monitoring the environmental assumptions that justified the strategy — if assumptions change, the strategy may need revision"],
        ["Structure follows strategy","Chandler's principle: organisational structure should be designed to enable execution of the chosen strategy, not the other way around"],
    ], [CONTENT_W * 0.32, CONTENT_W * 0.68])

    doc.build(story)
    print(f"Built: {OUT_PATH}")


if __name__ == "__main__":
    build()
