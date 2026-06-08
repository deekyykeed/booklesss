"""
Booklesss — Step 1.1: Introduction to Corporate Strategy
Course: Strategic Management
Palette: Cream paper · cardinal red accent (#DC2626) · Parastoo serif titles
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
BRAND_DIR  = os.path.join(_ROOT, "_dev", "brand")
LOGO_BLACK = os.path.join(BRAND_DIR, "booklesss-logo-black.png")
MARK_BLACK = os.path.join(BRAND_DIR, "booklesss-mark-black.png")
GRAIN      = os.path.join(BRAND_DIR, "grain.png")
_logo_black = ImageReader(LOGO_BLACK) if os.path.exists(LOGO_BLACK) else None
_mark_black = ImageReader(MARK_BLACK) if os.path.exists(MARK_BLACK) else None
_grain      = ImageReader(GRAIN)      if os.path.exists(GRAIN)      else None

# ── COLOURS — SM: cream paper + cardinal red accent ─────────────────────────
C_COVER      = colors.HexColor("#FFFDE8")   # warm cream — cover page
C_PAGE       = colors.HexColor("#FFFEF2")   # cream — body pages
TITLE_DARK   = colors.HexColor("#121212")
HEADING_DARK = colors.HexColor("#3D3D3D")
C_RED        = colors.HexColor("#DC2626")   # cardinal red — SM accent
C_RED_DK     = colors.HexColor("#991B1B")   # deep red — text on light bg
C_INK        = colors.HexColor("#16201A")   # body text
C_STEEL      = colors.HexColor("#5F6B65")   # secondary labels
C_MIST       = colors.HexColor("#6E6A5E")   # eyebrow / sub / meta
C_RULE       = colors.HexColor("#E0DACB")   # warm rule / table dividers
BG_FORMULA   = colors.HexColor("#FFF0F0")   # pale red panel (callout / fact)
BG_CALLOUT   = colors.HexColor("#FEF2F2")   # soft red callout box

# ── PAGE GEOMETRY ──────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

NLM_STEP_1_1_A = (
    "https://notebooklm.google.com/notebook/8f3349b6-3792-49d2-af92-26a8c08710ca"
    "/artifact/f2bd06b2-a7b7-4a55-99a8-459008081e99"
)
NLM_STEP_1_1_B = (
    "https://notebooklm.google.com/notebook/8f3349b6-3792-49d2-af92-26a8c08710ca"
    "/artifact/e00c1e2b-6219-4f32-bae6-ed7b31e19634"
)

# Slack file links — fill in as each step is uploaded to the workspace
STEP_LINKS = {
    "1.2": "https://booklesss20.slack.com/files/U0B2W0BJGUT/F0B81C99WSJ/step_1.2_-_vision__mission___objectives.pdf",
    "2.1": None,
    "2.2": None,
    "3.1": None,
    "3.2": None,
}

def step_ref(n):
    url = STEP_LINKS.get(n)
    if url:
        return f'<link href="{url}"><u>Step {n}</u></link>'
    return f"Step {n}"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "steps")
OUT_PATH = os.path.join(OUT_DIR, "Step 1.1 - Introduction to Corporate Strategy.pdf")

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
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_RED_DK,
            leading=16, alignment=TA_LEFT),
        "formula_r": ParagraphStyle("formula_r",
            fontName="Body-Bold", fontSize=10, textColor=C_RED_DK,
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
        "community": ParagraphStyle("community",
            fontName="Body", fontSize=9.5, textColor=C_STEEL,
            leading=15, spaceAfter=5, alignment=TA_LEFT),
        "community_link": ParagraphStyle("community_link",
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
    canvas.drawString(MX, H - MY + 7, "1.1 — Introduction to Corporate Strategy")
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

def formula_box(lines):
    items = [[Paragraph(ln, ST["formula"])] for ln in lines]
    inner = Table(items, colWidths=[CONTENT_W - 26])
    inner.setStyle(TableStyle([
        ("TOPPADDING",    (0,0), (-1,-1), 2),
        ("BOTTOMPADDING", (0,0), (-1,-1), 2),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))
    outer = Table([[inner]], colWidths=[CONTENT_W])
    outer.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), BG_FORMULA),
        ("LINEBEFORE",    (0,0), (-1,-1), 2.5, C_RED),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([outer, Spacer(1, 10)])

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

def resources_box(items):
    """Cover resource panel. items = list of (label, url) tuples."""
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

def community_closer():
    return [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "Take the ZESCO or Zanaco question to <b>#sm-foundations</b> — past exam questions "
            "on strategy and competitive advantage are going up there too.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            "Step 1.2 is Vision, Mission & Objectives.",
            ST["community_link"]),
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
    story.append(Spacer(1, 120))
    story.append(LogoTriple(_mark_black) if _mark_black is not None
                 else TripleDiamond(color=HEADING_DARK))
    story.append(Spacer(1, 26))
    story.append(Paragraph("STEP 1.1 · FOUNDATIONS", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Introduction to<br/>Corporate Strategy", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "What strategy is, the levels it operates at, and the frameworks "
        "your exam will test you on.",
        ST["cover_sub"]))
    story.append(Spacer(1, 110))
    story.append(Paragraph("Strategic Management", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(Spacer(1, 14))
    story.append(resources_box([
        ("Audio overview", NLM_STEP_1_1_A),
        ("Video overview", NLM_STEP_1_1_B),
    ]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── SECTION 1 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 01", "What Is Corporate Strategy?")
    story.append(body(
        "Strategy is the direction and scope of an organisation over the long-term, "
        "achieving advantage through its configuration of resources and competencies "
        "<i>(Johnson, Scholes and Whittington)</i>. It is not operations — strategy sets "
        "where the business is going; operations execute that direction day to day."
    ))
    story.append(fact(
        "Strategy answers three questions: Where are we now? Where do we want to go? "
        "How do we get there? Every framework in this course maps onto one of these three."
    ))

    # ── SECTION 2 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 02", "The Three Levels of Strategy")
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
        "Classify the level before analysing the decision — that's what the question is testing."
    ))

    story.append(discussion_q(
        "ZESCO announces it will expand into solar energy generation for rural communities. "
        "Identify which level of strategy this represents and justify your answer. "
        "Then name two decisions that must follow at the business level and two at the functional level "
        "to make the corporate decision viable."
    ))

    # ── SECTION 3 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 03", "Mintzberg's Five Ps of Strategy")
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
        "Pattern is emergent — it shows up in consistent decisions over time whether or not "
        "anyone planned it. A company can have an emergent pattern that contradicts its written plan."
    ))

    # ── SECTION 4 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 04", "The Strategic Management Process")
    story.append(body(
        "Strategic management is a cycle of four stages. "
        "Know each by name — 'describe the process' is a standard long-answer question."
    ))
    story.append(table_std([
        ["Stage", "What happens"],
        ["1. Environmental Analysis",
         f"Scan external threats and opportunities; audit internal resources and capabilities. "
         f"Tools: PESTEL, Porter's Five Forces ({step_ref('2.1')}), SWOT, VRIO ({step_ref('2.2')})."],
        ["2. Strategy Formulation",
         f"Set mission and objectives; generate strategic options; choose direction. "
         f"Tools: Ansoff, BCG, Generic Strategies ({step_ref('3.1')}, {step_ref('3.2')})."],
        ["3. Strategy Implementation",
         "Convert chosen strategy into structures, budgets, processes, and people."],
        ["4. Evaluation and Control",
         "Monitor performance against targets; feed findings back into the next planning cycle."],
    ], [CONTENT_W * 0.27, CONTENT_W * 0.73]))
    story.append(body(
        "Formulation begins with purpose — what is this organisation for and what is it "
        "trying to achieve? Get that wrong and every option you evaluate will be measured "
        "against the wrong target. Mission, vision, and objectives are the starting point."
    ))

    # ── SECTION 5 ──────────────────────────────────────────────────────────
    story += section("CONCEPT 05", "Competitive Advantage and Generic Strategies")
    story.append(body(
        "A competitive advantage is an attribute that allows a firm to outperform rivals — "
        "through lower cost or higher perceived value. It is <b>sustainable</b> when rivals "
        "cannot easily replicate it. Porter mapped five specific approaches:"
    ))
    story.append(table_std([
        ["Strategy", "How it competes", "Scope"],
        ["Low-Cost Provider",       "Lowest industry cost base. Compete on price.",                       "Broad"],
        ["Focused Low-Cost",        "Lowest cost within one specific niche.",                              "Narrow"],
        ["Broad Differentiation",   "Distinctive product — quality, brand, innovation. Premium price.",   "Broad"],
        ["Focused Differentiation", "Unique features for a narrow customer group. Premium price.",        "Narrow"],
        ["Best-Cost Provider",      "Good quality at a competitive price — middle ground.",               "Value buyers"],
    ], [CONTENT_W * 0.28, CONTENT_W * 0.56, CONTENT_W * 0.16]))

    story.append(callout(
        "Scope — broad vs. narrow — is independent of cost vs. differentiation. "
        "When reading a case: identify the scope first, then identify the source of advantage. "
        "Mixing these up is the most common error in generic strategy questions."
    ))

    story.append(discussion_q(
        "Zanaco operates branches across Zambia including rural areas that run at a loss. "
        "The bank treats this as part of its identity rather than a profitability question. "
        "Using Porter's five generic strategies, identify which strategy Zanaco follows and "
        "explain your reasoning. Then identify one specific threat from a mobile money competitor "
        "and name the stage of the strategic management process where Zanaco should address it."
    ))

    # ── KEY TERMS ──────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    story.append(table_std([
        ["Term", "Definition"],
        ["Strategy",
         "Direction and scope of an organisation over the long-term, achieving advantage through resource configuration"],
        ["Corporate Level",
         "Decisions about which industries and markets to compete in; portfolio allocation across business units"],
        ["Business Level",
         "How to compete within a specific business unit or market"],
        ["Functional Level",
         "Day-to-day implementation of strategy through operational functions"],
        ["Mintzberg's Five Ps",
         "Plan, Ploy, Pattern, Position, Perspective — five ways strategy forms in organisations"],
        ["Emergent Strategy",
         "A pattern in decisions that arises over time without a deliberate plan (Mintzberg's Pattern)"],
        ["Competitive Advantage",
         "An attribute enabling a firm to outperform rivals through lower cost or higher value"],
        ["Porter's Generic Strategies",
         "Five approaches: low-cost provider, focused low-cost, broad differentiation, focused differentiation, best-cost provider"],
    ], [CONTENT_W * 0.38, CONTENT_W * 0.62]))

    # ── LEARNING OUTCOMES ──────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able to Do")
    for i, outcome in enumerate([
        "Define strategy using Johnson, Scholes and Whittington's definition and state the three strategic questions it answers",
        "Classify any strategic decision as corporate, business, or functional level and justify the classification",
        "Name and define all five of Mintzberg's Ps and distinguish deliberate (Plan) from emergent (Pattern) strategy",
        "Describe the four stages of the strategic management process in sequence",
        "Identify which of Porter's five generic strategies a firm is using from a case description, separating scope from source of advantage",
    ], 1):
        story.append(Paragraph(f"{i}.  {outcome}", ST["outcome"]))

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
