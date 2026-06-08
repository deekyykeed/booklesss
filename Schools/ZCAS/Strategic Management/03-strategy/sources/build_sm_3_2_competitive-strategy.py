"""
Booklesss — Step 3.2: Competitive Strategy
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

NLM_STEP_3_2_A = ""
VID_STEP_3_2   = ""

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "steps")
OUT_PATH = os.path.join(OUT_DIR, "Step 3.2 - Competitive Strategy.pdf")

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
    canvas.drawString(MX, H - MY + 7, "3.2 — Competitive Strategy")
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
    story.append(Paragraph("STEP 3.2", ST["cover_step"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Competitive<br/>Strategy", ST["cover_title"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "Porter's Generic Strategies · Offensive &amp; defensive moves · Blue Ocean",
        ST["cover_sub"]))

    story.append(Spacer(1, 110))
    story.append(Paragraph("Strategic Management", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(Spacer(1, 14))

    nlm_items = []
    if NLM_STEP_3_2_A:
        nlm_items.append(("Audio overview", NLM_STEP_3_2_A))
    if VID_STEP_3_2:
        nlm_items.append(("Video overview", VID_STEP_3_2))
    if nlm_items:
        story.append(resources_box(nlm_items))

    # ── BODY ───────────────────────────────────────────────────────────────
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: ORIENTATION ─────────────────────────────────────────────
    story += section("ORIENTATION", "From Portfolio to Battlefield")
    story.append(body(
        "Step 3.1 answered the corporate question: <i>Which businesses should we be in?</i> "
        "This step answers the business-level question: <i>How do we compete and win in the business we have chosen?</i> "
        "The difference matters. A wrong corporate decision wastes years; a wrong competitive decision wastes resources "
        "and market position that are hard to recover."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "Michael Porter's core argument is that sustainable competitive advantage comes from choosing a clear position — "
        "and that the worst strategic error is trying to be everything to everyone. "
        "He calls this being 'stuck in the middle': neither cost-competitive nor meaningfully differentiated. "
        "Stuck-in-the-middle firms earn below-average returns across every industry."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 2: PORTER'S GENERIC STRATEGIES ─────────────────────────────
    story += section("COMPETITIVE POSITION", "Porter's Three Generic Strategies")
    story.append(body(
        "Porter identifies three viable strategic positions. Two dimensions define the space: "
        "the <b>source of advantage</b> (lower cost vs unique value) and the <b>competitive scope</b> "
        "(broad market vs narrow segment). These combine into three strategies."
    ))
    story.append(Spacer(1, 10))

    gen_data = [
        ["Strategy", "Source of advantage", "Scope", "How to win", "Core risk"],
        ["Cost Leadership", "Lower cost than rivals", "Broad market", "Produce and deliver at lower cost than anyone else — pass some savings to customers, keep rest as margin.", "Technology change erodes your cost advantage overnight. Rivals copy your efficiencies."],
        ["Differentiation", "Unique value customers prize", "Broad market", "Offer something competitors cannot easily replicate — brand, technology, service, design. Charge a premium.", "Premium narrows as competitors imitate. Customer preferences shift away from your differentiator."],
        ["Cost Focus", "Lower cost within a segment", "Narrow segment", "Be the low-cost provider for a specific customer group, geography, or product niche.", "Segment may shrink or lose attractiveness. Broad cost leaders may attack the segment."],
        ["Differentiation Focus", "Unique value within a segment", "Narrow segment", "Serve a specific segment so well that broader competitors cannot match you in that niche.", "Broad differentiators may narrow their focus. Segment needs may drift toward mainstream."],
    ]
    cw_strat = CONTENT_W / 5
    story.append(table_std(gen_data,
        [2.2*cm, 2.5*cm, 1.8*cm, CONTENT_W - 9.5*cm, 3*cm]))
    story.append(Spacer(1, 6))

    story.append(h3("Cost Leadership in Zambia"))
    story.append(body(
        "Shoprite and Pick n Pay compete on cost leadership in Zambian retail — scale buying, "
        "efficient logistics, no-frills store formats. A local chain that tries to match their prices "
        "without their scale is on a losing path. The correct response for a smaller retailer is "
        "not to compete on cost but to differentiate or focus."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Differentiation in Zambia"))
    story.append(body(
        "Zanaco's business banking offering differentiates through local relationships, Zambia-specific products, "
        "and access to government contracting networks — areas where an international bank cannot easily match. "
        "Zambeef differentiates on vertical integration (farm-to-shelf traceability) and cold-chain reliability, "
        "which smaller competitors cannot afford to replicate."
    ))
    story.append(Spacer(1, 8))

    story.append(callout(
        "Stuck in the Middle: A Zambian supermarket that tries to match Shoprite's prices AND offer "
        "premium imported goods AND compete on convenient locations simultaneously will be worse than "
        "Shoprite at cost, worse than specialty retailers at range, and worse at everything else. "
        "Pick one position and make it defensible."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 3: ACHIEVING COST LEADERSHIP ───────────────────────────────
    story += section("EXECUTION", "Achieving and Defending Each Position")
    story.append(h3("How to Achieve Cost Leadership"))
    story.append(body(
        "Cost leadership is not just about cutting prices — it is about structural cost advantages "
        "built into how the business operates."
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("Scale: higher volume spreads fixed costs over more units (Zambia's telecom operators)"))
    story.append(bullet("Experience curve: cumulative production lowers unit costs over time"))
    story.append(bullet("Process design: standardised, efficient workflows reduce labour and waste"))
    story.append(bullet("Supply chain: preferred supplier contracts, bulk purchasing, backward integration"))
    story.append(bullet("Technology: automation of routine tasks, digital delivery instead of physical"))
    story.append(Spacer(1, 8))

    story.append(h3("How to Achieve Differentiation"))
    story.append(body(
        "Differentiation must be perceived as valuable by customers AND hard for competitors to copy. "
        "Differences that customers don't notice or don't care about are irrelevant."
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("Brand: built over years, impossible to copy quickly (MTN's brand in Zambia)"))
    story.append(bullet("Proprietary technology or process: unique capability not available to rivals"))
    story.append(bullet("Customer relationships: deep loyalty and switching costs"))
    story.append(bullet("Quality signals: certifications, awards, reputation built over time"))
    story.append(bullet("Integration depth: like Zambeef's farm-to-retail chain, creating end-to-end control"))
    story.append(Spacer(1, 10))

    # ── SECTION 4: OFFENSIVE STRATEGIES ────────────────────────────────────
    story += section("COMPETITIVE MOVES", "Offensive Strategies: Going on the Attack")
    story.append(body(
        "Once a firm has a competitive position, the question becomes: how do you strengthen it? "
        "Offensive strategies are deliberate moves to improve competitive position, gain market share, "
        "or neutralise a rival's advantage. "
        "They are not random — each has a specific objective and a specific counter-risk."
    ))
    story.append(Spacer(1, 8))

    off_data = [
        ["Offensive move", "What it involves", "When to use it"],
        ["Attack competitor strengths", "Match or exceed rivals in their area of advantage — out-invest, out-innovate, undercut on price.", "When you have resources to sustain the fight and the long-term prize justifies the cost."],
        ["Attack competitor weaknesses", "Target gaps: underserved segments, slow distribution, weak customer service. Strike where rivals are thin.", "When rivals are overextended or have neglected specific customer segments or regions."],
        ["End-run (blue ocean)", "Bypass existing competition entirely by creating a new market space where rivals don't yet compete.", "When existing markets are saturated and there is a genuinely underserved need you can address."],
        ["Guerrilla offensives", "Small, targeted strikes — price promotions in specific regions, aggressive local marketing — to disrupt rather than defeat.", "When the firm lacks the scale for a direct assault but can inflict damage selectively and cheaply."],
        ["Pre-emptive strikes", "Lock up resources, talent, or partnerships before rivals can. First-mover advantage in a new segment.", "When a new opportunity is emerging and being first creates durable lock-in."],
    ]
    story.append(table_std(off_data,
        [3*cm, CONTENT_W * 0.42, CONTENT_W - 3*cm - CONTENT_W * 0.42]))
    story.append(Spacer(1, 6))

    story.append(fact(
        "First-mover advantages in Zambia: M-Pesa (now Airtel Money predecessor) entered mobile money "
        "early and built a customer base that later entrants struggled to displace. "
        "Network effects made it self-reinforcing — the more users, the more useful. "
        "Late entrants had to spend heavily on incentives just to reach parity."
    ))

    story.append(discussion_q(
        "Discussion Question 1: Think about an industry in Zambia where the competitive dynamics have "
        "shifted in the past five years — banking, telecom, retail, or fast food. "
        "What offensive moves triggered those shifts? Which companies responded well, and which were caught out? "
        "What does this tell you about the importance of monitoring rivals?"
    ))

    # ── SECTION 5: DEFENSIVE STRATEGIES ────────────────────────────────────
    story += section("PROTECTING POSITION", "Defensive Strategies: Holding Your Ground")
    story.append(body(
        "Competitive advantage is never permanent. Rivals attack, technology shifts, regulations change, "
        "and consumer preferences evolve. Defensive strategy is about making your position harder to attack "
        "and responding to threats before they erode your standing."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Raising Barriers to Attack"))
    story.append(bullet("Switching costs: make it expensive or inconvenient for customers to leave (loyalty programmes, data lock-in, long contracts)"))
    story.append(bullet("Broaden the product range: fill gaps that rivals could exploit for entry"))
    story.append(bullet("Exclusive supplier or distribution agreements: deny rivals access to key inputs or channels"))
    story.append(bullet("Signal strength: communicate convincingly that you will defend your position vigorously — deters opportunistic entry"))
    story.append(Spacer(1, 8))

    story.append(h3("Responding to an Attack"))
    story.append(body(
        "The correct response depends on the nature of the attack. "
        "If a rival is attacking your core customer segment with lower prices, the question is not "
        "'match the price' but 'why are customers defecting, and can we fix that without destroying margin?' "
        "A targeted response (price match only in the attacked segment, not market-wide) is cheaper and "
        "sends a signal without collapsing your entire pricing structure."
    ))
    story.append(Spacer(1, 8))

    story.append(callout(
        "Defensive principle: the goal is not to respond to every attack but to make your position "
        "structurally unattractive to attack. If rivals know you will defend aggressively and have the "
        "resources to do so, they will often look elsewhere. The best defence is building genuine advantages "
        "that competitors cannot easily replicate."
    ))
    story.append(Spacer(1, 10))

    story.append(discussion_q(
        "Discussion Question 2: You are the Strategy Director of a mid-sized Zambian bank. "
        "A new digital-only competitor has launched with zero-fee accounts and instant mobile onboarding. "
        "Your bank currently leads on branch network and business banking relationships. "
        "What competitive strategy do you adopt — and what specific defensive or offensive moves do you make "
        "in the next 12 months?"
    ))

    # ── KEY TERMS ────────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Competitive strategy", "The approach a business takes to compete and win within its chosen market"],
        ["Cost leadership", "Competing by being the lowest-cost producer in the industry while maintaining acceptable quality"],
        ["Differentiation", "Competing by offering unique value that customers prize and are willing to pay a premium for"],
        ["Focus strategy", "Competing by dominating a narrow market segment with either cost or differentiation advantage"],
        ["Stuck in the middle", "The losing position of firms that pursue neither cost leadership nor meaningful differentiation"],
        ["Competitive scope", "The breadth of the market a firm targets — broad (whole industry) or narrow (specific segment)"],
        ["Offensive strategy", "Deliberate moves to strengthen competitive position, gain share, or erode a rival's advantage"],
        ["Defensive strategy", "Actions taken to protect competitive position from attack and make it structurally unattractive for rivals"],
        ["First-mover advantage", "Benefits gained by entering a market before competitors — brand, customer lock-in, standard-setting"],
        ["Switching costs", "The cost (financial, operational, psychological) of moving from one supplier to another — a key defensive barrier"],
        ["Experience curve", "The systematic decline in unit costs as cumulative production increases, due to learning and efficiency gains"],
        ["Competitive dynamics", "The ongoing cycle of offensive moves, defensive responses, and counter-moves between rivals"],
    ]
    story.append(table_std(terms, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain Porter's three generic strategies and the logic behind each",
        "Identify firms stuck in the middle and explain why that position underperforms",
        "Describe how to build and defend cost leadership and differentiation positions",
        "Distinguish between offensive strategic moves and know when each is appropriate",
        "Design a defensive response to a competitive attack while protecting core margins",
    ]
    for o in outcomes:
        story.append(Paragraph(f"• {o}", ST["outcome"]))
    story.append(Spacer(1, 16))

    doc.build(story)
    print(f"Built: {OUT_PATH}")


if __name__ == "__main__":
    build()
