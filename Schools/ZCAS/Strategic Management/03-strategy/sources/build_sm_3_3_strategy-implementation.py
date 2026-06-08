"""
Booklesss — Step 3.3: Strategy Implementation
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
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", ".."))

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

NLM_STEP_3_3_A = ""
VID_STEP_3_3   = ""

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "steps")
OUT_PATH = os.path.join(OUT_DIR, "Step 3.3 - Strategy Implementation.pdf")

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
    canvas.drawString(MX, H - MY + 7, "3.3 — Strategy Implementation")
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
            if os.path.exists(MARK_BLACK) else ">")
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
    story.append(Paragraph("STEP 3.3", ST["cover_step"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Strategy<br/>Implementation", ST["cover_title"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "McKinsey 7-S · Balanced Scorecard · Change management",
        ST["cover_sub"]))

    story.append(Spacer(1, 110))
    story.append(Paragraph("Strategic Management", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(Spacer(1, 14))

    nlm_items = []
    if NLM_STEP_3_3_A:
        nlm_items.append(("Audio overview", NLM_STEP_3_3_A))
    if VID_STEP_3_3:
        nlm_items.append(("Video overview", VID_STEP_3_3))
    if nlm_items:
        story.append(resources_box(nlm_items))

    # ── BODY ───────────────────────────────────────────────────────────────
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: ORIENTATION ─────────────────────────────────────────────
    story += section("ORIENTATION", "The Execution Problem")
    story.append(body(
        "You have completed the analytical and strategic choice phases: you understand the environment (Steps 2.1–2.2), "
        "you have made portfolio decisions (Step 3.1), and you have chosen a competitive position (Step 3.2). "
        "None of that matters until it is translated into action."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "McKinsey research shows that fewer than one in three strategically important initiatives "
        "is executed as planned. The root causes are almost never the strategy itself — "
        "they are execution failures: misaligned structures, wrong metrics, change resistance, "
        "and resources not matching priorities. This step is about preventing those failures."
    ))
    story.append(Spacer(1, 10))

    story.append(callout(
        "Strategic control: implementation is not a one-off event. It requires ongoing monitoring, "
        "comparison against targets, and willingness to adapt when the plan meets reality. "
        "Strategy without control drifts. Control without strategy optimises for the wrong outcomes."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 2: McKINSEY 7-S ────────────────────────────────────────────
    story += section("ALIGNMENT", "The McKinsey 7-S Framework")
    story.append(body(
        "The McKinsey 7-S Framework identifies seven internal elements that must point in the same direction "
        "for strategy to succeed. If even one is misaligned, execution suffers. "
        "The framework is useful precisely because it forces attention to the full system — "
        "not just structure and budget, but culture, leadership style, and shared values."
    ))
    story.append(Spacer(1, 10))

    seven_s_data = [
        ["Element", "What it means", "Key question"],
        ["Strategy", "The direction and choices the organisation is pursuing", "Is the strategy clear, specific, and understood at every level?"],
        ["Structure", "How authority, accountability, and decision-making are organised", "Does the structure enable strategy or create barriers to execution?"],
        ["Systems", "Processes, budgets, information flows, and measurement", "Do systems measure and reward behaviours the strategy requires?"],
        ["Style", "Leadership approach and cultural tone from the top", "Does leadership model the behaviour the strategy asks for?"],
        ["Staff", "People — hiring, development, talent pipeline", "Do we have the right people in the roles the strategy depends on?"],
        ["Skills", "Distinctive capabilities and organisational competencies", "What capabilities does the strategy require, and where are the gaps?"],
        ["Shared Values", "Core purpose and culture — the centre of the model", "Do people believe in what the organisation stands for?"],
    ]
    story.append(table_std(seven_s_data,
        [2.2*cm, CONTENT_W * 0.38, CONTENT_W - 2.2*cm - CONTENT_W * 0.38]))
    story.append(Spacer(1, 6))

    story.append(body(
        "<b>Zambian example:</b> A Zambian bank pursues a digital-first strategy to reach unbanked customers via mobile. "
        "Strategy is clear. But the branch structure remains hierarchical with decisions made centrally in Lusaka (Structure misaligned). "
        "Technology hiring is constrained by grade-band pay structures designed for branch roles (Staff misaligned). "
        "Performance bonuses still reward in-branch transactions, not mobile onboarding (Systems misaligned). "
        "This strategy will fail — not because the idea is wrong, but because six of the seven elements are pulling against it."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 3: BALANCED SCORECARD ──────────────────────────────────────
    story += section("MEASUREMENT", "The Balanced Scorecard")
    story.append(body(
        "Strategy is a hypothesis: <i>if we do X, then Y will result.</i> "
        "The Balanced Scorecard translates that hypothesis into measurable targets across four perspectives, "
        "making it possible to monitor whether the strategy is actually working — "
        "and to intervene before financial results deteriorate."
    ))
    story.append(Spacer(1, 8))

    bsc_data = [
        ["Perspective", "Strategic question", "What to measure"],
        ["Financial", "Is the strategy delivering financial returns?", "Revenue growth, profit margin, cash flow, ROI on strategic initiatives"],
        ["Customer", "Are target customers satisfied and loyal?", "Customer satisfaction score, retention rate, market share in target segment"],
        ["Internal Process", "Are we executing critical processes efficiently?", "Process cycle time, quality defect rate, speed of key workflows"],
        ["Learning & Growth", "Are we building the capabilities the strategy requires?", "Employee capability index, training hours, rate of innovation"],
    ]
    story.append(table_std(bsc_data,
        [2.4*cm, CONTENT_W * 0.38, CONTENT_W - 2.4*cm - CONTENT_W * 0.38]))
    story.append(Spacer(1, 6))

    story.append(body(
        "The power of the Balanced Scorecard is the <b>cause-and-effect chain</b>: "
        "invest in Learning &amp; Growth (train people) → improve Internal Processes (serve faster, with fewer errors) "
        "→ improve Customer outcomes (higher satisfaction, lower churn) → improve Financial results. "
        "Without this chain, a company can hit its financial targets by destroying the capabilities "
        "that will generate next year's results."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Balanced Scorecard in a Zambian Context"))
    story.append(body(
        "A Zambian telecommunications company pursuing customer retention might measure: "
        "<b>Financial</b> — ZMW revenue per subscriber and churn cost avoided; "
        "<b>Customer</b> — Net Promoter Score and complaint resolution rate; "
        "<b>Internal Process</b> — time-to-resolve a service fault; "
        "<b>Learning &amp; Growth</b> — percentage of frontline staff trained on new systems. "
        "These four numbers, reviewed monthly, tell a more complete strategic story than revenue alone."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 4: CHANGE MANAGEMENT ───────────────────────────────────────
    story += section("PEOPLE", "Change Management: The Human Side of Strategy")
    story.append(body(
        "Strategy is not just about systems and structure — it is fundamentally about people "
        "changing their behaviour. If the organisation has worked one way for years, "
        "a new strategy requires breaking old patterns and building new ones. "
        "This is where most implementation efforts fail: people resist change, "
        "especially when they don't understand why it is necessary."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Kotter's 8-Step Model"))
    story.append(body(
        "John Kotter's research identifies the sequence that separates successful transformations from failures:"
    ))
    story.append(Spacer(1, 6))

    kotter_data = [
        ["Step", "Action required", "Cost of skipping"],
        ["1. Establish urgency", "Make a clear, compelling case for why change is necessary now", "Inertia wins — people wait for someone else to move first"],
        ["2. Build a coalition", "Recruit powerful sponsors who believe in the change", "Isolated advocates cannot overcome systemic scepticism"],
        ["3. Form a vision", "Articulate a clear picture of what success looks like", "People don't know the destination and default to the past"],
        ["4. Communicate constantly", "Repeat the vision through every channel available", "Message gets lost — employees hear what they want to hear"],
        ["5. Remove barriers", "Give people permission and resources to act on the vision", "Bureaucracy blocks change before it starts"],
        ["6. Create early wins", "Identify and celebrate quick, visible victories", "Momentum dies; sceptics say 'I told you so'"],
        ["7. Build on wins", "Keep pressure on; avoid declaring victory prematurely", "Old habits resurface the moment leadership attention moves on"],
        ["8. Anchor the change", "Embed new behaviour in culture, systems, and hiring", "Change is fragile and reverts under pressure"],
    ]
    story.append(table_std(kotter_data,
        [3.2*cm, CONTENT_W * 0.40, CONTENT_W - 3.2*cm - CONTENT_W * 0.40]))
    story.append(Spacer(1, 6))

    story.append(fact(
        "Budget and time estimates for strategy implementation should include 30–40% effort on "
        "change management. If you are not investing in getting people to change behaviour, "
        "the strategy has no chance of landing."
    ))

    story.append(discussion_q(
        "Discussion Question 1: A large Zambian parastatal (ZESCO, Zambia Railways, or similar) "
        "has just appointed a new CEO with a mandate to transform the organisation. "
        "Using the McKinsey 7-S framework, identify the three elements most likely to resist change "
        "and explain why. What would Kotter's model say should happen in the first 90 days?"
    ))

    # ── SECTION 5: ORG STRUCTURES ──────────────────────────────────────────
    story += section("DESIGN", "Structure Follows Strategy")
    story.append(body(
        "Chandler's principle — that structure should follow strategy — sounds obvious but is violated constantly. "
        "Organisations redesign their strategy and then try to execute it with structures built for a different purpose. "
        "The result is friction: decisions made in the wrong place, accountability diffused, coordination failures. "
        "Choosing the right structure is not an HR exercise — it is a strategic decision."
    ))
    story.append(Spacer(1, 8))

    struct_data = [
        ["Structure", "How it works", "Best-fit strategy", "Key risk"],
        ["Functional", "Grouped by function: Finance, Sales, Operations, HR", "Cost leadership, operational efficiency, stability", "Silos create coordination failures across functions"],
        ["Divisional", "Grouped by product, geography, or customer segment", "Growth, diversification, multi-market strategy", "Duplication of functions increases cost"],
        ["Matrix", "Dual reporting — both functional and divisional lines", "Innovation, customisation, complex projects", "Conflict over authority; confusion about decisions"],
        ["Network", "Loosely coupled units, heavy outsourcing, partnerships", "Agility, specialisation, platform strategies", "Loss of control; consistency and quality risks"],
    ]
    story.append(table_std(struct_data,
        [2*cm, 2.6*cm, CONTENT_W - 7.6*cm, 3*cm]))
    story.append(Spacer(1, 6))

    story.append(body(
        "A Zambian fintech startup pursuing cost leadership in digital payments suits a functional structure — "
        "centralised technology development, lean operations, minimum overhead. "
        "A pharmaceutical company with multiple product categories suits divisional structure "
        "so each category can pursue its own market approach. "
        "The first sign that structure and strategy are misaligned: decisions keep escalating to levels "
        "that shouldn't need to make them."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 6: CONTROL ─────────────────────────────────────────────────
    story += section("CONTROL", "Strategic Control: Monitoring and Adapting")
    story.append(body(
        "Strategy implementation is not a project with a completion date — it is an ongoing process "
        "of monitoring, comparing actuals to targets, diagnosing gaps, and adapting. "
        "Strategic control is distinct from operational control: operational control asks "
        "'are we executing efficiently?' — strategic control asks 'is the strategy itself still valid?'"
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Types of Strategic Control"))
    story.append(bullet("<b>Premise control:</b> Monitor the assumptions behind the strategy. If the PESTEL factors that justified the strategy change materially, the strategy may need revision."))
    story.append(bullet("<b>Implementation control:</b> Track whether milestones are being hit and whether resources are being deployed as planned."))
    story.append(bullet("<b>Strategic surveillance:</b> Broad monitoring of the competitive environment for unexpected developments."))
    story.append(bullet("<b>Special alert control:</b> Pre-defined response protocols for sudden crises — a competitor acquisition, a regulatory change, a supply disruption."))
    story.append(Spacer(1, 10))

    story.append(discussion_q(
        "Discussion Question 2: You are a senior manager at First Quantum Minerals' Kansanshi copper mine "
        "during a period of falling global copper prices. "
        "The corporate strategy set two years ago assumed a copper price of USD 8,500 per tonne. "
        "The current price is USD 6,200. "
        "Walk through the four types of strategic control: what specific actions does each type require? "
        "At what price level would you trigger a fundamental strategy review — and what would that review examine?"
    ))

    # ── KEY TERMS ────────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Strategy implementation", "The process of translating strategic choices into action through structure, systems, people, and resources"],
        ["McKinsey 7-S", "A framework identifying seven elements that must align for strategy to succeed: Strategy, Structure, Systems, Style, Staff, Skills, Shared Values"],
        ["Balanced Scorecard", "A measurement system that tracks performance across four perspectives: Financial, Customer, Internal Process, and Learning & Growth"],
        ["Change management", "The structured approach to transitioning people, teams, and organisations from a current state to a desired future state"],
        ["Kotter's 8-Step Model", "A change management sequence: urgency, coalition, vision, communication, empowerment, early wins, consolidation, anchoring"],
        ["Strategic control", "Ongoing monitoring of whether the strategy is being implemented correctly and whether its underlying assumptions remain valid"],
        ["Premise control", "Monitoring the environmental assumptions that justified the strategy — if assumptions change, the strategy may need revision"],
        ["Functional structure", "Organisation grouped by function (finance, marketing, operations) — suited to cost leadership and efficiency strategies"],
        ["Divisional structure", "Organisation grouped by product, geography, or customer segment — suited to diversification and multi-market strategies"],
        ["Structure follows strategy", "Chandler's principle: organisational structure should be designed to enable execution of the chosen strategy, not the other way around"],
        ["Leading indicator", "A metric that predicts future performance (e.g., training completion predicts future process quality)"],
        ["Lagging indicator", "A metric that reflects past performance (e.g., profit margin reflects decisions made months earlier)"],
    ]
    story.append(table_std(terms, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Apply the McKinsey 7-S framework to diagnose alignment gaps in an organisation's strategy implementation",
        "Build a Balanced Scorecard with relevant KPIs across all four perspectives for a given strategic objective",
        "Describe Kotter's 8-step change model and explain the cost of skipping any step",
        "Match organisational structures to strategic contexts and identify misalignment when it occurs",
        "Distinguish between operational control and strategic control and apply the four types of strategic control",
    ]
    for o in outcomes:
        story.append(Paragraph(f"• {o}", ST["outcome"]))
    story.append(Spacer(1, 16))

    doc.build(story)
    print(f"Built: {OUT_PATH}")


if __name__ == "__main__":
    build()
