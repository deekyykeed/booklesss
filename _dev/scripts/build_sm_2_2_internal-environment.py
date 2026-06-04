"""
Booklesss — Step 2.2: The Internal Environment
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

NLM_STEP_2_2_A = (
    "https://notebooklm.google.com/notebook/89076579-e60e-4522-bfee-4481dc033cdf"
    "/artifact/e5cafde0-ade6-4cce-8ac6-5cc5e764c6bb"
)

VID_STEP_2_2 = (
    "https://notebooklm.google.com/notebook/89076579-e60e-4522-bfee-4481dc033cdf"
    "/artifact/559e1060-6017-4027-8563-cce407e8caa0"
)

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "02-environment")
OUT_PATH = os.path.join(OUT_DIR, "Step 2.2 - The Internal Environment.pdf")

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
    canvas.drawString(MX, H - MY + 7, "2.2 — The Internal Environment")
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
    story.append(Paragraph("STEP 2.2 · ENVIRONMENT", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("The Internal<br/>Environment", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "What your organisation can do, what it does well, "
        "and where it falls short — the inside view strategy depends on.",
        ST["cover_sub"]))
    story.append(Spacer(1, 110))
    story.append(Paragraph("Strategic Management", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(Spacer(1, 14))
    story.append(resources_box([
        ("Audio overview", NLM_STEP_2_2_A),
        ("Video overview", VID_STEP_2_2),
    ]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── ORIENTATION ────────────────────────────────────────────────────────
    story += section("ORIENTATION", "Looking Inward After Looking Out")
    story.append(body(
        "Step 2.1 mapped the external environment — the forces and competitive pressures "
        "that shape every industry. This step turns the lens inward. "
        "The same question applies, just from a different angle: "
        "given what the world looks like, what does your organisation actually have to work with?"
    ))
    story.append(body(
        "Three frameworks do this work together. SWOT surfaces strengths and weaknesses "
        "relative to the environment. Porter's Value Chain shows <i>where</i> in the organisation "
        "value is created or lost. VRIO tests whether a specific resource or capability "
        "is genuinely a source of competitive advantage — or just something the company happens to have."
    ))

    # ── SECTION 1 — SWOT ──────────────────────────────────────────────────
    story += section("CONCEPT 01", "SWOT — The Internal Half")
    story.append(body(
        "SWOT analysis covers both internal and external dimensions. "
        "Strengths and Weaknesses are internal — things the organisation controls. "
        "Opportunities and Threats are external — drawn from PESTEL and Porter's Five Forces analysis. "
        "This step focuses on S and W."
    ))
    story.append(table_std([
        ["Dimension",   "What it captures",
         "Internal or External?"],
        ["Strengths",   "Resources, capabilities, and advantages that give the "
                        "organisation an edge over rivals.",
         "Internal"],
        ["Weaknesses",  "Gaps, limitations, and areas where the organisation "
                        "underperforms relative to what the strategy requires.",
         "Internal"],
        ["Opportunities","Favourable external conditions the organisation can "
                         "exploit — from PESTEL or Porter's analysis.",
         "External"],
        ["Threats",     "Adverse external conditions that could damage performance "
                        "or competitive position.",
         "External"],
    ], [CONTENT_W * 0.22, CONTENT_W * 0.60, CONTENT_W * 0.18]))

    story.append(body(
        "The critical point about strengths and weaknesses: they are relative, not absolute. "
        "A strength is only meaningful if it matters in the current competitive environment. "
        "Zambeef's vertically integrated cold chain — owning farms, abattoirs, cold storage, "
        "and retail outlets — is a genuine strength when supply chain reliability matters. "
        "But when ZESCO implements sustained load-shedding, that same integration becomes "
        "a vulnerability: every link in the chain depends on electricity that the company "
        "does not control. A strength in one environment can be a weakness in another."
    ))

    story.append(fact(
        "Exam test for SWOT: a strength must be relevant to the strategy and superior "
        "to what rivals have. If every competitor in the industry has the same capability, "
        "it is not a strength — it is the minimum requirement for competing."
    ))

    story.append(discussion_q(
        "<i>Zanaco is one of the few commercial banks in Zambia with a government ownership stake. "
        "In a SWOT analysis, is this a strength, a weakness, or both? "
        "Consider: what does it give the bank, what does it constrain, "
        "and under what conditions does it shift from one category to the other?</i>"
    ))

    # ── SECTION 2 — VALUE CHAIN ────────────────────────────────────────────
    story += section("CONCEPT 02", "Porter's Value Chain")
    story.append(body(
        "Porter's Value Chain breaks a company's operations into the sequence of activities "
        "that create value for the customer. The analysis asks where in that sequence "
        "the company creates more value than it costs to produce — and where it does not."
    ))
    story.append(table_std([
        ["Category",   "Activity",              "What it covers"],
        ["Primary",    "Inbound Logistics",      "Receiving, storing, and distributing inputs — raw materials, "
                                                 "components, stock."],
        ["Primary",    "Operations",             "Transforming inputs into the finished product or service."],
        ["Primary",    "Outbound Logistics",     "Storing and distributing the finished product to customers."],
        ["Primary",    "Marketing & Sales",      "Making customers aware of and willing to buy the product."],
        ["Primary",    "Service",                "After-sale activities that maintain or enhance the product's value."],
        ["Support",    "Procurement",            "Acquiring the inputs used across all primary activities."],
        ["Support",    "Technology Development", "Systems, R&D, and process improvements that support primary activities."],
        ["Support",    "Human Resources",        "Recruiting, training, and retaining the people who run every activity."],
        ["Support",    "Firm Infrastructure",    "Finance, planning, legal, and general management."],
    ], [CONTENT_W * 0.18, CONTENT_W * 0.28, CONTENT_W * 0.54]))

    story.append(body(
        "The value chain is most useful not as a description of what a company does, "
        "but as a diagnostic of <i>where</i> it wins or loses. "
        "Zambeef's competitive position rests on its primary activities: "
        "inbound logistics (own farms supplying consistent quality inputs), "
        "operations (own abattoirs and processing), and outbound logistics "
        "(own cold-chain distribution fleet and retail outlets). "
        "A competitor sourcing from external suppliers and distributing through third-party retailers "
        "has less control at each link. That gap is where Zambeef's advantage lives."
    ))

    story.append(body(
        "Support activities matter too. A company with strong HR management that retains skilled "
        "cold-chain technicians has a support advantage that is hard to see from the outside "
        "but very expensive to replicate. Technology development — how quickly a company can "
        "digitise its operations or adopt new processing equipment — determines how long "
        "any primary activity advantage actually lasts."
    ))

    # ── SECTION 3 — VRIO ──────────────────────────────────────────────────
    story += section("CONCEPT 03", "The VRIO Framework")
    story.append(body(
        "SWOT and the value chain identify what a company has and where it operates. "
        "VRIO tests whether a specific resource or capability actually translates into "
        "competitive advantage — and if so, whether that advantage is sustainable."
    ))
    story.append(table_std([
        ["Value", "Rarity", "Inimitable", "Organised", "Competitive implication"],
        ["No",    "—",      "—",          "—",          "Competitive disadvantage — the resource destroys rather than creates value."],
        ["Yes",   "No",     "—",          "—",          "Competitive parity — everyone has it; it's the industry standard, not an edge."],
        ["Yes",   "Yes",    "No",         "—",          "Temporary advantage — rivals can copy it; the lead erodes over time."],
        ["Yes",   "Yes",    "Yes",        "No",         "Unrealised advantage — the capability exists but the company is not structured to exploit it."],
        ["Yes",   "Yes",    "Yes",        "Yes",        "Sustained competitive advantage — the source of above-average returns over time."],
    ], [CONTENT_W * 0.11, CONTENT_W * 0.11, CONTENT_W * 0.14, CONTENT_W * 0.14, CONTENT_W * 0.50]))

    story.append(h3("Applying VRIO — Two Zambian Examples"))
    story.append(body(
        "First Quantum's mineral rights and processing infrastructure at Kansanshi pass all four "
        "VRIO tests. The resource is valuable (copper production generates significant returns), "
        "rare (specific rights to that ore body are not available to others), "
        "inimitable (the capital cost and geological knowledge required to replicate it are enormous), "
        "and the company is organised around exploiting it through dedicated operational systems "
        "and technical expertise. The result is a sustained competitive position "
        "that smaller miners in the same geography cannot match."
    ))
    story.append(body(
        "MTN Zambia's mobile money platform is valuable and rare — few organisations have "
        "4 million registered users and the agent network to serve them. "
        "But it is becoming imitable: Airtel Money has built comparable scale, "
        "and the regulatory environment is opening mobile money to new entrants. "
        "Unless MTN deepens the inimitability (through data advantages, ecosystem lock-in, "
        "or product breadth no competitor has yet matched), the advantage is temporary. "
        "VRIO forces you to ask not just 'do we have it?' but 'how long will it hold?'"
    ))

    story.append(callout(
        "Common exam error: treating all company resources as strengths. "
        "VRIO separates resources that genuinely create advantage from those that "
        "simply keep the company in the game. A bank that has ATMs across Lusaka has Value — "
        "but so does every other bank. It passes V, fails R. That is parity, not advantage."
    ))

    story.append(discussion_q(
        "<i>MTN Zambia has built a mobile money platform with over 4 million registered users "
        "and one of the widest agent networks in the country. "
        "Apply the VRIO framework to this capability. "
        "Does it currently represent a sustained competitive advantage, a temporary advantage, "
        "or competitive parity? What would need to change — in the company or the environment — "
        "to shift your answer?</i>"
    ))

    story.append(body(
        "SWOT, the value chain, and VRIO each answer part of the same question: "
        "what does this organisation bring to the competitive environment it faces? "
        "Together, they complete the picture that Step 2.1 started from the outside. "
        "Whether those internal capabilities are enough to pursue a specific strategic direction "
        "is the question Lesson 3 addresses."
    ))

    # ── KEY TERMS ──────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    story.append(table_std([
        ["Term",                    "Definition"],
        ["Internal environment",     "The resources, capabilities, processes, and culture inside an "
                                     "organisation — the factors it controls and that determine what "
                                     "it can do."],
        ["SWOT Analysis",            "A framework identifying internal Strengths and Weaknesses alongside "
                                     "external Opportunities and Threats. The internal half (S and W) "
                                     "is the focus of this step."],
        ["Strength",                 "A resource or capability that gives the organisation a relative "
                                     "advantage over rivals in the current competitive environment."],
        ["Weakness",                 "A gap or limitation that puts the organisation at a disadvantage "
                                     "relative to what the strategy requires or what rivals can do."],
        ["Value Chain",              "Porter's framework mapping an organisation's activities into the "
                                     "sequence that creates value — primary activities (direct) and "
                                     "support activities (enabling)."],
        ["Primary Activities",       "The five directly value-creating activities: inbound logistics, "
                                     "operations, outbound logistics, marketing and sales, and service."],
        ["Support Activities",       "Activities that enable the primary activities: procurement, "
                                     "technology development, human resources, and firm infrastructure."],
        ["VRIO Framework",           "A test of whether a resource creates sustained competitive advantage: "
                                     "Valuable, Rare, Inimitable, and Organised to exploit."],
        ["Sustained Competitive Advantage", "A position of above-average performance that persists "
                                            "because the underlying capability passes all four VRIO tests."],
        ["Core Competency",          "A capability that is central to the firm's strategy and performance, "
                                     "typically passing at least the V, R, and I tests of VRIO."],
    ], [CONTENT_W * 0.35, CONTENT_W * 0.65]))

    # ── LEARNING OUTCOMES ──────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able to Do")
    for i, outcome in enumerate([
        "Distinguish the internal from the external dimensions of SWOT, and explain why strengths and weaknesses are relative rather than absolute",
        "Apply Porter's Value Chain to identify where in an organisation's activities value is created, and where advantage or weakness lies",
        "Apply the VRIO framework to a specific resource or capability and determine whether it represents competitive parity, temporary advantage, or sustained competitive advantage",
        "Explain why a resource that passes only the Value test is not a source of competitive advantage",
        "Use SWOT, the value chain, and VRIO together to build an integrated picture of an organisation's internal strategic position",
    ], 1):
        story.append(Paragraph(f"{i}.  {outcome}", ST["outcome"]))

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
