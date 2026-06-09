"""
Booklesss — Step 1.1: Introduction to Business Administration
Course: BBA 1110 — Principles of Business Administration
Palette: Dark slate-charcoal cover · amber gold accent (#F59E0B) · Parastoo serif titles
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
# dark charcoal cover → use the WHITE brand assets
LOGO_WHITE = os.path.join(BRAND_DIR, "booklesss-logo-white.png")
MARK_WHITE = os.path.join(BRAND_DIR, "booklesss-mark-white.png")
GRAIN      = os.path.join(BRAND_DIR, "grain.png")
_logo_white = ImageReader(LOGO_WHITE) if os.path.exists(LOGO_WHITE) else None
_mark_white = ImageReader(MARK_WHITE) if os.path.exists(MARK_WHITE) else None
_grain      = ImageReader(GRAIN)      if os.path.exists(GRAIN)      else None

# ── COLOURS — BBA: dark charcoal cover + amber gold accent ─────────────────
C_COVER      = colors.HexColor("#1C2526")   # dark slate-charcoal — cover
C_PAGE       = colors.HexColor("#FAFAF8")   # clean near-white — body pages
TITLE_DARK   = colors.HexColor("#FAFAF8")   # near-white — cover title
HEADING_DARK = colors.HexColor("#1C2526")   # near-black — body headings (matches cover)
C_AMBER      = colors.HexColor("#F59E0B")   # amber gold — BBA accent
C_AMBER_DK   = colors.HexColor("#92400E")   # dark amber — body accent text
C_INK        = colors.HexColor("#1A1A1A")   # near-black body text
C_STEEL      = colors.HexColor("#4B5563")   # grey-600 secondary labels
C_MIST       = colors.HexColor("#6B7280")   # grey-500 meta / eyebrow on body
C_MIST_LT    = colors.HexColor("#9CA3AF")   # grey-400 cover meta
C_RULE       = colors.HexColor("#E5E7EB")   # grey-200 rule / table dividers
BG_CALLOUT   = colors.HexColor("#FFFBEB")   # pale amber panel
BG_FORMULA   = colors.HexColor("#FEF3C7")   # amber wash — header rows / fact bg
C_COVER_META = colors.HexColor("#CBD5E1")   # light slate — cover meta text

# ── PAGE GEOMETRY ──────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

# Slack file links — fill in as each step is uploaded
STEP_LINKS = {
    "2.1": None,
    "3.1": None,
    "4.1": None,
}

def step_ref(n):
    url = STEP_LINKS.get(n)
    if url:
        return f'<link href="{url}"><u>Step {n}</u></link>'
    return f"Step {n}"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "steps")
OUT_PATH = os.path.join(OUT_DIR, "Step 1.1 - Introduction to Business Administration.pdf")

# ── STYLES ─────────────────────────────────────────────────────────────────
def make_styles():
    return {
        "cover_step": ParagraphStyle("cover_step",
            fontName="Body-Bold", fontSize=9, textColor=C_AMBER,
            leading=13, spaceAfter=0, alignment=TA_CENTER),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Title-Bold", fontSize=40, textColor=TITLE_DARK,
            leading=44, spaceAfter=0, alignment=TA_CENTER),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=11.5, textColor=C_MIST_LT,
            leading=17, spaceAfter=4, alignment=TA_CENTER),
        "cover_meta": ParagraphStyle("cover_meta",
            fontName="Body", fontSize=9, textColor=C_COVER_META,
            leading=14, spaceAfter=2, alignment=TA_CENTER),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_AMBER,
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
            fontName="Body-Bold", fontSize=10, textColor=C_AMBER_DK,
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
        "community_link": ParagraphStyle("community_link",
            fontName="Body-Bold", fontSize=9.5, textColor=C_AMBER_DK,
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
    # Logo (white or black — use black mark; on dark bg it renders as-is)
    if _logo_white is not None:
        iw, ih = _logo_white.getSize()
        lh = 15
        canvas.drawImage(_logo_white, MX, top_y - 5,
                         width=lh * iw / ih, height=lh,
                         preserveAspectRatio=True, mask="auto")
    else:
        canvas.setFont("Body-Bold", 8.5)
        canvas.setFillColor(C_AMBER)
        canvas.drawString(MX, top_y, "BOOKLESSS")
    canvas.setFont("Body", 8.5)
    canvas.setFillColor(C_COVER_META)
    canvas.drawRightString(W - MX, top_y, "BUSINESS ADMINISTRATION")
    canvas.setStrokeColor(C_AMBER)
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
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.6)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "1.1 — Introduction to Business Administration")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · June 2026")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    _footer_left = "Booklesss | booklesss.framer.ai"
    canvas.drawString(MX, MY - 14, _footer_left)
    _tw = canvas.stringWidth(_footer_left, "Body", 7.5)
    canvas.linkURL("https://booklesss.framer.ai", (MX, MY - 16, MX + _tw, MY - 8))
    canvas.drawCentredString(W / 2, MY - 14, "Business Administration")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")
    canvas.restoreState()

# ── HELPERS ────────────────────────────────────────────────────────────────
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_AMBER,
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
        ("LINEBEFORE",    (0,0), (-1,-1), 2.5, C_AMBER),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"),
                  ParagraphStyle("cbt", fontName="Body", fontSize=10,
                                 textColor=C_AMBER_DK, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), BG_CALLOUT),
        ("LINEBEFORE",    (0,0), (-1,-1), 2, C_AMBER),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_AMBER),
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
        ("LINEBEFORE",    (0,0), (-1,-1), 2.5, C_AMBER),
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
        ("LINEBELOW",     (0,0), (-1, 0), 1,   C_AMBER),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def resources_box(items):
    """Cover resource panel. items = list of (label, url) tuples."""
    s_hd = ParagraphStyle("res_hd", fontName="Body-Bold", fontSize=7,
                           textColor=C_AMBER, leading=10, alignment=TA_LEFT)
    s_lnk = ParagraphStyle("res_lnk", fontName="Body-Bold", fontSize=9,
                            textColor=C_COVER_META, leading=15, alignment=TA_LEFT)
    rows = [[Paragraph("ADDED VALUE", s_hd)]]
    _blt = (f'<img src="{MARK_WHITE}" width="8" height="8" valign="middle"/>'
            if os.path.exists(MARK_WHITE) else "▸")
    for label, url in items:
        if url and url != "#":
            rows.append([Paragraph(
                f'<link href="{url}">{_blt}  <u>{label}</u></link>', s_lnk)])
        else:
            rows.append([Paragraph(f"{_blt}  {label}", s_lnk)])
    t = Table(rows, colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1,-1), colors.HexColor("#243436")),
        ("BOX",           (0, 0), (-1,-1), 0.8, C_AMBER),
        ("TOPPADDING",    (0, 0), (-1,-1), 5),
        ("BOTTOMPADDING", (0, 0), (-1,-1), 5),
        ("LEFTPADDING",   (0, 0), (-1,-1), 12),
        ("RIGHTPADDING",  (0, 0), (-1,-1), 12),
        ("TOPPADDING",    (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0,-1), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 6)])


class LogoTriple(Flowable):
    """Centred trio of the real Booklesss mark PNG (centre solid, sides faded)."""
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
        self.color = color or C_AMBER
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
    story.append(LogoTriple(_mark_white) if _mark_white is not None
                 else TripleDiamond(color=C_AMBER))
    story.append(Spacer(1, 26))
    story.append(Paragraph("STEP 1.1 · FOUNDATIONS", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Introduction to<br/>Business Administration", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "What business is, how it organises itself, "
        "what it exists to achieve, and who gets a say.",
        ST["cover_sub"]))
    story.append(Spacer(1, 110))
    story.append(Paragraph("BBA 1110 — Principles of Business Administration", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(Spacer(1, 14))
    story.append(resources_box([
        ("Audio overview — coming once uploaded to NotebookLM", "#"),
        (f"Next: {step_ref('2.1')} — Design & Structure of Organisations", "#"),
    ]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── SECTION 1: What Is Business? ──────────────────────────────────────
    story += section("CONCEPT 01", "What Is Business?")
    story.append(body(
        "A business is any organisation that transforms resources — land, labour, and capital "
        "— into goods or services that satisfy the wants of buyers. The transformation adds "
        "value: the finished output is worth more than the inputs consumed to produce it. "
        "That margin, when positive and sustained, is profit."
    ))
    story.append(body(
        "Business administration is the systematic management of how that transformation "
        "happens: planning what to produce, organising the people and resources required, "
        "directing the work, and controlling the outcome against the plan. These four activities "
        "— plan, organise, direct, control — reappear in every topic of this course."
    ))
    story.append(fact(
        "Every organisation — whether a roadside Kantemba or First Quantum Minerals — "
        "performs the same four management functions. The scale changes; the logic does not."
    ))
    story.append(body(
        "Businesses are classified by the sector of the economy they operate in:"
    ))
    story.append(table_std([
        ["Sector", "Activity", "Zambian example"],
        ["Primary",
         "Extraction of raw materials directly from nature.",
         "Copper mining (ZCCM-IH, First Quantum Minerals), maize farming, fishing."],
        ["Secondary",
         "Processing or manufacturing raw materials into finished goods.",
         "Zambeef processing livestock; Zambia Sugar refining cane; National Breweries."],
        ["Tertiary",
         "Providing services rather than physical goods.",
         "Zanaco (banking), MTN Zambia (telecoms), ZESCO (electricity distribution)."],
    ], [CONTENT_W * 0.16, CONTENT_W * 0.42, CONTENT_W * 0.42]))

    # ── SECTION 2: Types of Business Organisation ─────────────────────────
    story += section("CONCEPT 02", "Types of Business Organisation")
    story.append(body(
        "The legal form a business takes determines who owns it, who is liable for its debts, "
        "how it raises capital, and how it is controlled. Five forms appear on every exam."
    ))
    story.append(table_std([
        ["Form", "Key features", "Liability", "Zambian example"],
        ["Sole Trader",
         "Owned and managed by one person. Simplest to set up. All profit belongs to the owner.",
         "Unlimited — personal assets at risk.",
         "A roadside Kantemba stall; a freelance accountant."],
        ["Partnership",
         "2–20 owners share capital, profit, loss, and management. Governed by a partnership deed.",
         "Unlimited for ordinary partners.",
         "A law firm or medical practice with shared ownership."],
        ["Private Limited Company (Ltd)",
         "Separate legal entity. Shareholders own it; directors manage it. Shares not publicly traded.",
         "Limited to share value.",
         "Most Zambian SMEs registered as private companies."],
        ["Public Limited Company (PLC / listed)",
         "Shares traded on a public stock exchange. Can raise large capital from the public.",
         "Limited to share value.",
         "Zambeef Products PLC on the Lusaka Securities Exchange (LuSE)."],
        ["Public Sector Organisation",
         "Owned by government on behalf of citizens. Objective is service delivery, not profit.",
         "Government backed.",
         "ZESCO (national electricity utility); University of Zambia."],
    ], [CONTENT_W * 0.21, CONTENT_W * 0.35, CONTENT_W * 0.19, CONTENT_W * 0.25]))

    story.append(callout(
        "Limited liability is the pivotal concept. In a sole proprietorship or general "
        "partnership, the owner’s personal assets — home, car, savings — can be seized "
        "to settle business debts. Incorporation creates a legal barrier between the individual "
        "and the firm. That protection is what drives most businesses to incorporate as they grow."
    ))

    story.append(discussion_q(
        "Chanda runs a tailoring business from her home in Lusaka. She earns ZMW 8,000 a month "
        "and has one employee. Her sister wants to join the business, contribute ZMW 20,000 in "
        "capital, and share the profits equally. "
        "Identify the current legal form of Chanda’s business and the form it would become "
        "if the sister joins. State two advantages and one disadvantage of the new form compared "
        "to the current one."
    ))

    # ── SECTION 3: Business Objectives ────────────────────────────────────
    story += section("CONCEPT 03", "What Businesses Exist to Achieve")
    story.append(body(
        "An objective is a specific, measurable target that directs the organisation’s "
        "decisions. Different ownership structures produce different objectives — and within "
        "a single firm, objectives evolve as the business moves through its life stages."
    ))
    story.append(table_std([
        ["Objective", "What it means", "Who prioritises it"],
        ["Profit maximisation",
         "Generate the highest possible surplus of revenue over costs.",
         "Shareholders in listed PLCs; sole traders with no growth ambition."],
        ["Satisficing",
         "Earn enough profit to satisfy shareholders while pursuing other goals. "
         "Not maximum profit — sufficient profit.",
         "Owner-managers balancing profit with work-life balance or social aims."],
        ["Survival",
         "Remain solvent during a downturn, new competition, or startup phase. "
         "Revenue covers costs; cash flow is positive.",
         "New businesses; firms under financial stress."],
        ["Growth",
         "Increase revenue, market share, or geographic reach. Often pursued at the "
         "expense of short-run profit.",
         "Businesses reinvesting to scale — e.g. Shoprite expanding into new regions."],
        ["Social / ethical",
         "Serve community needs, minimise harm, operate sustainably. "
         "Profit is a constraint, not the goal.",
         "Public sector bodies, cooperatives, NGOs, B-Corp certified firms."],
    ], [CONTENT_W * 0.22, CONTENT_W * 0.48, CONTENT_W * 0.30]))

    story.append(body(
        "ZESCO illustrates why sector matters. As a state-owned utility, ZESCO’s primary "
        "objective is reliable electricity supply to households and industry across Zambia — "
        "including rural areas where it would never be profitable to operate. A private company "
        "serving the same market would exit the unprofitable routes. Government ownership keeps "
        "those routes open because the social objective overrides profit."
    ))
    story.append(fact(
        "Objectives are not fixed. A business that survives its startup phase shifts to growth. "
        "A growth-focused firm that faces a recession shifts to survival. "
        "Reading which objective applies in a case question is half the analytical work."
    ))

    # ── SECTION 4: Stakeholders ────────────────────────────────────────────
    story += section("CONCEPT 04", "Who Has a Stake?")
    story.append(body(
        "A stakeholder is any individual or group affected by the organisation’s activities "
        "— or whose actions can affect the organisation. Stakeholders are not all equal: "
        "some can shut the business down (government, banks), others can only complain "
        "(local residents)."
    ))
    story.append(table_std([
        ["Stakeholder", "Primary interest", "Potential conflict with the firm"],
        ["Shareholders / owners",
         "Profit and capital growth. Return on their investment.",
         "May demand short-run profits that sacrifice long-run investment."],
        ["Employees",
         "Job security, fair wages, safe working conditions, career development.",
         "Wage increases reduce profit available for shareholders."],
        ["Customers",
         "Quality goods and services at fair prices.",
         "Lower prices cut margins; quality improvements raise costs."],
        ["Suppliers",
         "Prompt payment, long-term contracts, fair terms.",
         "Firm may delay payment or switch to cheaper suppliers to cut costs."],
        ["Government",
         "Tax revenue, employment, legal compliance, economic development.",
         "Regulations and taxes constrain business decisions."],
        ["Local community",
         "Employment, minimal environmental harm, contribution to local economy.",
         "Expansion may bring noise, pollution, or traffic."],
        ["Lenders (banks)",
         "Interest payments and return of principal. Low default risk.",
         "Debt obligations constrain cash flow and limit strategic flexibility."],
    ], [CONTENT_W * 0.24, CONTENT_W * 0.40, CONTENT_W * 0.36]))

    story.append(body(
        "Stakeholder conflicts are resolved through negotiation, regulation, or power. "
        "Shareholders are legally the owners and take precedence in most private companies "
        "— but governments set the floor through labour law, environmental regulation, "
        "and tax codes that constrain what shareholders can demand."
    ))

    story.append(discussion_q(
        "Zambia Sugar PLC announces plans to expand its Mazabuka estate by 3,000 hectares. "
        "The expansion will create 800 jobs but will displace 200 smallholder farming families "
        "currently leasing that land. "
        "Identify four stakeholder groups affected by this decision. For each, state their "
        "primary interest and whether it aligns with or conflicts with the expansion. "
        "Then state which stakeholder group has the most power to halt the project and why."
    ))

    # ── KEY TERMS ──────────────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    story.append(table_std([
        ["Term", "Definition"],
        ["Business",
         "An organisation that transforms land, labour, and capital into goods or services "
         "for buyers, generating value through that transformation."],
        ["Business Administration",
         "The systematic management of an organisation’s affairs: planning, organising, "
         "directing, and controlling resources to achieve objectives."],
        ["Primary sector",
         "Economic activity involving direct extraction of natural resources (mining, farming, fishing)."],
        ["Secondary sector",
         "Economic activity involving processing or manufacturing of raw materials into finished goods."],
        ["Tertiary sector",
         "Economic activity involving the provision of services rather than physical goods."],
        ["Sole Trader",
         "A business owned and managed by one person with unlimited personal liability for debts."],
        ["Limited Liability",
         "Legal protection that caps an investor’s financial loss at the value of their shareholding."],
        ["Objective",
         "A specific, measurable target that directs the decisions of an organisation."],
        ["Profit maximisation",
         "The goal of generating the highest possible surplus of revenue over total costs."],
        ["Satisficing",
         "Earning sufficient rather than maximum profit, allowing pursuit of other goals alongside profitability."],
        ["Stakeholder",
         "Any individual or group that is affected by the organisation’s activities, "
         "or whose actions can affect the organisation."],
    ], [CONTENT_W * 0.28, CONTENT_W * 0.72]))

    # ── LEARNING OUTCOMES ──────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Know After This Step")
    outcomes = [
        "Define business and explain how it creates value through resource transformation.",
        "Distinguish the three sectors of the economy and give a Zambian example for each.",
        "Compare five types of business organisation, including their liability implications.",
        "Explain why different ownership structures produce different primary objectives.",
        "Define stakeholder, classify stakeholders as internal or external, and identify "
        "typical conflicts between them.",
    ]
    for o in outcomes:
        story.append(Paragraph(f"• {o}", ST["outcome"]))
    story.append(Spacer(1, 6))

    # ── COMMUNITY CLOSER ───────────────────────────────────────────────────
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14))
    story.append(Paragraph(
        "Bring the Chanda tailoring question or the Zambia Sugar stakeholder exercise to "
        "<b>#bba-foundations</b> — these types of classify-and-justify questions "
        "are exactly what the continuous assessment tests.",
        ST["community"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Step 2.1 goes deeper into how organisations are structured internally.",
        ST["community_link"]))

    doc.build(story)
    print(f"Built: {OUT_PATH}")


if __name__ == "__main__":
    build()
