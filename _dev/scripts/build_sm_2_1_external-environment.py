"""
Booklesss — Step 2.1: The External Environment
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

NLM_STEP_2_1_A = (
    "https://notebooklm.google.com/notebook/b20f56d1-54d3-4c25-9c49-855b36d8226d"
    "/artifact/07b10d07-1e91-42e6-a526-2b0b33cf8dd2"
)

VID_STEP_2_1 = (
    "https://notebooklm.google.com/notebook/b20f56d1-54d3-4c25-9c49-855b36d8226d"
    "/artifact/a657d67f-57f1-4c43-8ef6-c287422e667b"
)

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "02-environment")
OUT_PATH = os.path.join(OUT_DIR, "Step 2.1 - The External Environment.pdf")

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
    canvas.drawString(MX, H - MY + 7, "2.1 — The External Environment")
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
    story.append(Paragraph("STEP 2.1 · ENVIRONMENT", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("The External<br/>Environment", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "The macro forces and competitive pressures every "
        "strategy must account for, before planning begins.",
        ST["cover_sub"]))
    story.append(Spacer(1, 110))
    story.append(Paragraph("Strategic Management", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(Spacer(1, 14))
    story.append(resources_box([
        ("Audio overview", NLM_STEP_2_1_A),
        ("Video overview", VID_STEP_2_1),
    ]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── SECTION 1 — ORIENTATION ────────────────────────────────────────────
    story += section("ORIENTATION", "Two Layers of the Outside World")
    story.append(body(
        "Before choosing a strategy, an organisation must understand the environment "
        "it is competing in. That environment has two distinct layers — and analysing "
        "only one of them means planning in half the picture."
    ))
    story.append(table_std([
        ["Layer",                "What it covers",
         "Primary tool"],
        ["Macro environment",    "Broad forces that affect all industries — politics, economics, "
                                 "society, technology, ecology, law. No single company controls them.",
         "PESTEL Analysis"],
        ["Industry environment", "The competitive structure of the specific market you operate in — "
                                 "who the rivals are, where the power sits, what threatens your position.",
         "Porter's Five Forces"],
    ], [CONTENT_W * 0.26, CONTENT_W * 0.52, CONTENT_W * 0.22]))
    story.append(body(
        "PESTEL answers: <i>what forces are shaping the world we compete in?</i> "
        "Porter's Five Forces answers: <i>what is the competitive structure of our specific industry?</i> "
        "Neither replaces the other."
    ))

    # ── SECTION 2 — PESTEL ─────────────────────────────────────────────────
    story += section("CONCEPT 01", "PESTEL Analysis")
    story.append(body(
        "PESTEL maps the macro environment — the forces no single company controls "
        "but every company must respond to. Each letter covers a different category "
        "of external influence."
    ))
    story.append(table_std([
        ["Factor",         "What to monitor"],
        ["Political",      "Government stability, tax policy, trade regulations, foreign "
                           "investment rules, state ownership requirements."],
        ["Economic",       "GDP growth, inflation, interest rates, exchange rates, "
                           "employment levels, credit availability."],
        ["Social",         "Demographics, urbanisation, education levels, cultural "
                           "attitudes, consumer behaviour shifts."],
        ["Technological",  "Digital infrastructure, automation, fintech disruption, "
                           "mobile penetration, platform ecosystems."],
        ["Environmental",  "Climate risk, ecological regulations, sustainability requirements "
                           "from investors and lenders."],
        ["Legal",          "Competition law, employment law, consumer protection, "
                           "sector licensing and regulatory frameworks."],
    ], [CONTENT_W * 0.22, CONTENT_W * 0.78]))

    story.append(h3("Political and Economic Factors in Zambia"))
    story.append(body(
        "Political decisions directly reset the rules of the game. When the Zambian government "
        "adjusted mining royalty rates in 2019 — raising them for open-cast mines to 9% at copper "
        "prices above USD 7,500 per tonne — First Quantum and other mining houses had to rebuild "
        "their investment cases overnight. No amount of internal efficiency offsets a policy change "
        "that moves the cost line by that magnitude."
    ))
    story.append(body(
        "Economic conditions set the baseline pressure on every business. Between 2015 and 2023, "
        "the kwacha depreciated from roughly K8 per USD to over K25. Any company holding "
        "USD-denominated debt or importing inputs in foreign currency absorbed that depreciation "
        "directly as a cost increase. Combined with inflation peaking above 22% in 2021, "
        "the economic environment forced constant revision of pricing, sourcing, and financing — "
        "not because of anything those companies did, but because of macro conditions they could not control."
    ))

    story.append(h3("Social and Technological Factors in Zambia"))
    story.append(body(
        "Zambia's population is young — over 60% are under 25 — and rapidly urbanising. "
        "That demographic profile drives demand for mobile-first products. Mobile money penetration "
        "has outpaced formal banking: MTN Mobile Money and Airtel Money collectively serve more "
        "Zambians than all commercial banks combined by transaction volume. A company that built "
        "its distribution strategy around physical branches in 2015 and failed to track this "
        "social and technological shift was positioned for the wrong market by 2022."
    ))

    story.append(fact(
        "Exam application: PESTEL is not a checklist to fill in — it is a thinking tool. "
        "The question is not 'what are the factors?' but 'which factors are most material "
        "to this specific company in this specific context, and how do they interact?'"
    ))

    story.append(discussion_q(
        "<i>Zambia Breweries is planning a major expansion of production capacity. "
        "Identify three PESTEL factors that would be most critical to this decision. "
        "For each one, explain why it is specifically material to a Zambian beverage "
        "manufacturer — not just to businesses in general.</i>"
    ))

    # ── SECTION 3 — PORTER'S FIVE FORCES ──────────────────────────────────
    story += section("CONCEPT 02", "Porter's Five Forces")
    story.append(body(
        "PESTEL tells you about the world. Porter's Five Forces tells you about the battlefield. "
        "The framework maps the competitive structure of an industry — where the power sits, "
        "what threatens margins, and whether an industry is structurally attractive "
        "or structurally difficult to profit in."
    ))
    story.append(table_std([
        ["Force",                              "What it measures"],
        ["1. Competitive Rivalry",             "The intensity of competition among existing players."],
        ["2. Threat of New Entrants",           "How easily new competitors can enter the industry."],
        ["3. Bargaining Power of Suppliers",    "How much leverage suppliers have over pricing and terms."],
        ["4. Bargaining Power of Buyers",       "How much power customers have to demand lower prices or better terms."],
        ["5. Threat of Substitutes",            "How easily customers can switch to a different product that serves the same underlying need."],
    ], [CONTENT_W * 0.40, CONTENT_W * 0.60]))

    story.append(body(
        "The combined strength of all five forces determines how much of the value created "
        "in an industry firms can actually capture as profit. When forces are collectively strong — "
        "intense rivalry, easy entry, powerful buyers, powerful suppliers, credible substitutes — "
        "even well-run companies struggle to earn above-average returns."
    ))

    story.append(h3("Competitive Rivalry and Threat of New Entrants — Zambian Banking"))
    story.append(body(
        "Zambia's commercial banking sector shows how two forces interact. Rivalry among existing "
        "banks — Zanaco, Standard Chartered, Absa, FNB, Stanbic — is intense. They compete for "
        "the same urban, salaried customer base with largely similar products. "
        "Switching costs for individual customers are low; the differentiation is thin."
    ))
    story.append(body(
        "The Bank of Zambia requires K104 million in minimum paid-up capital for a commercial "
        "banking licence — a substantial barrier that protects incumbents from traditional new entrants. "
        "But Airtel and MTN did not enter as banks. They entered as mobile money operators under "
        "a different regulatory category, with their existing subscriber bases as instant distribution. "
        "The Five Forces framework only reveals this threat if you ask the right question: "
        "who can serve the same customer need by a different route?"
    ))

    story.append(h3("Supplier Power, Buyer Power, and Substitutes"))
    story.append(body(
        "Zambeef depends on ZESCO for the cold-chain electricity that keeps its processing plants "
        "and distribution network running. ZESCO is the sole provider of grid electricity — "
        "there is no alternative supplier to negotiate with. When ZESCO implements load-shedding, "
        "Zambeef runs generators at cost or absorbs spoilage losses. Supplier power is extreme, "
        "and the company's strategy must treat it as a structural constraint."
    ))
    story.append(body(
        "Buyer power operates differently at different scales. An individual consumer buying "
        "Zambeef products from Shoprite has almost no bargaining power. "
        "But First Quantum sells copper concentrate to a small number of international smelters "
        "and trading houses — sophisticated buyers with alternatives who negotiate hard on "
        "pricing and off-take terms. "
        "Substitute threats are often the most misread force: mobile money is not a bank competitor, "
        "it is a substitute for the core function banking once monopolised — storing and transferring value."
    ))

    story.append(callout(
        "Key exam distinction: the threat of substitutes is NOT the same as competitive rivalry. "
        "Rivalry is between companies in the same industry (Zanaco vs. Absa). "
        "Substitution comes from a different category that serves the same underlying need "
        "(mobile money vs. a bank current account). A substitute can be more dangerous "
        "precisely because it arrives from outside the frame you are watching."
    ))

    story.append(discussion_q(
        "<i>Airtel Money entered the Zambian market using its existing mobile subscriber base "
        "and a telecoms licence, bypassing the K104 million capital requirement for commercial banks. "
        "Which of Porter's Five Forces did this strategy most directly exploit? "
        "What are the implications for established banks that defined their competitive "
        "landscape as 'other commercial banks'?</i>"
    ))

    story.append(body(
        "PESTEL and Porter's Five Forces answer different questions, but the answers are connected. "
        "A PESTEL scan that identifies rapid mobile technology adoption and a young, mobile-first "
        "population is describing the same shift that Porter's analysis captures as a rising "
        "threat of substitutes and a new category of entrant. The two frameworks together give "
        "you the full picture of the external environment."
    ))
    story.append(body(
        "What they do not tell you is whether your organisation can actually respond to what "
        "it finds. That depends on what is inside — the capabilities, resources, and structure "
        "that either give it an edge or leave it exposed. Step 2.2 takes that up."
    ))

    # ── KEY TERMS ──────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    story.append(table_std([
        ["Term",                          "Definition"],
        ["Macro environment",              "The broad external forces — political, economic, social, "
                                           "technological, environmental, and legal — that affect all "
                                           "organisations and cannot be controlled by any single firm."],
        ["PESTEL Analysis",                "A framework for scanning the macro environment across six "
                                           "categories: Political, Economic, Social, Technological, "
                                           "Environmental, and Legal."],
        ["Industry environment",           "The competitive structure of the specific market an organisation "
                                           "operates in — shaped by rivals, potential entrants, suppliers, "
                                           "buyers, and substitutes."],
        ["Porter's Five Forces",           "A framework for analysing industry structure through five sources "
                                           "of competitive pressure: rivalry, new entrants, supplier power, "
                                           "buyer power, and substitutes."],
        ["Competitive Rivalry",            "The intensity of competition among existing players in an industry."],
        ["Barriers to Entry",              "Factors that make it costly or difficult for new competitors to "
                                           "enter an industry — capital requirements, regulation, brand "
                                           "loyalty, economies of scale."],
        ["Bargaining Power of Suppliers",  "The ability of input suppliers to raise prices or restrict terms — "
                                           "strongest when suppliers are few and alternatives are limited."],
        ["Bargaining Power of Buyers",     "The ability of customers to push down prices or demand better "
                                           "terms — strongest when buyers are large, concentrated, and face "
                                           "low switching costs."],
        ["Threat of Substitutes",          "The risk that customers switch to a different product from a "
                                           "different category that serves the same underlying need."],
    ], [CONTENT_W * 0.35, CONTENT_W * 0.65]))

    # ── LEARNING OUTCOMES ──────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able to Do")
    for i, outcome in enumerate([
        "Distinguish the macro environment from the industry environment and state the primary analytical tool for each",
        "Apply PESTEL Analysis to identify and assess the macro-environmental factors most material to a given organisation",
        "Name and define each of Porter's Five Forces and explain how each affects industry profitability",
        "Explain the difference between competitive rivalry and the threat of substitutes, and illustrate with an example",
        "Use PESTEL and Porter's Five Forces together to build a picture of the external environment a strategy must navigate",
    ], 1):
        story.append(Paragraph(f"{i}.  {outcome}", ST["outcome"]))

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
