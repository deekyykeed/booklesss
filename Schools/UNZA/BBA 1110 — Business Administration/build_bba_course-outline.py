"""
Booklesss — Course Outline: BBA 1110 — Principles of Business Administration
Profile: Course outline (syllabus overview) on the BBA identity.
Palette: Dark slate-charcoal cover · amber gold accent (#F59E0B) · Parastoo serif titles
Output: course root → "Course Outline - Business Administration.pdf"
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
# script sits at the course root: Schools/UNZA/BBA 1110.../  → 3 levels up to project root
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

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
C_COVER      = colors.HexColor("#1C2526")
C_PAGE       = colors.HexColor("#FAFAF8")
TITLE_DARK   = colors.HexColor("#FAFAF8")
HEADING_DARK = colors.HexColor("#1C2526")
C_AMBER      = colors.HexColor("#F59E0B")
C_AMBER_DK   = colors.HexColor("#92400E")
C_INK        = colors.HexColor("#1A1A1A")
C_STEEL      = colors.HexColor("#4B5563")
C_MIST       = colors.HexColor("#6B7280")
C_MIST_LT    = colors.HexColor("#9CA3AF")
C_RULE       = colors.HexColor("#E5E7EB")
BG_CALLOUT   = colors.HexColor("#FFFBEB")
BG_FORMULA   = colors.HexColor("#FEF3C7")
C_COVER_META = colors.HexColor("#CBD5E1")

# ── PAGE GEOMETRY ──────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

OUT_PATH = os.path.join(os.path.dirname(__file__),
                        "Course Outline - Business Administration.pdf")

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
    canvas.drawString(MX, H - MY + 7, "Course Outline — Principles of Business Administration")
    canvas.drawRightString(W - MX, H - MY + 7, "BBA 1110 · June 2026")
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
    story.append(Paragraph("COURSE OUTLINE", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Principles of<br/>Business Administration", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "The full course at a glance — eight lessons, from what a business is "
        "to how it manages change.",
        ST["cover_sub"]))
    story.append(Spacer(1, 120))
    story.append(Paragraph("BBA 1110 · University of Zambia", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("8 lessons · 9 steps · Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── ABOUT THE COURSE ────────────────────────────────────────────────────
    story += section("OVERVIEW", "About This Course")
    story.append(body(
        "BBA 1110 is the foundation course of the Business Administration programme. It builds "
        "the vocabulary and the mental model you carry into every later course: what a business "
        "is, the environment it operates in, and how managers plan, organise, direct, and control "
        "the work to reach an objective."
    ))
    story.append(body(
        "The course runs as eight lessons, and each lesson is its own Slack channel. A lesson "
        "is one frame of the subject; it holds the step — or steps — that cover that frame. "
        "Lessons are kept to a single step wherever the material allows; only Foundations runs "
        "to two, because its two topics are genuinely distinct. Every step is a Booklesss PDF "
        "you can read in a sitting, built around Zambian companies and ZMW figures so the "
        "examples match the market you know."
    ))
    story.append(fact(
        "Each lesson is its own channel for a reason: it keeps conversations split by topic. "
        "Someone working through Finance is never pulled into a Marketing thread, and the other "
        "way round — you study and discuss in the room for the frame you are in."
    ))

    # ── THE LESSONS — one continuous table, lessons as tinted sub-headers ────
    story += section("THE LESSONS", "The Course, Lesson by Lesson")

    LCW = [CONTENT_W * 0.07, CONTENT_W * 0.31, CONTENT_W * 0.62]
    lessons = [
        ("LESSON 1 · FOUNDATIONS", "#bba-foundations", [
            ("1.1", "Introduction to Business Administration",
             "What a business is, the three sectors of the economy, the five types of business "
             "organisation, business objectives, and the stakeholders who have a claim on the firm."),
            ("1.2", "Design & Structure of Organisations",
             "How a firm arranges people and authority: hierarchy, span of control, chain of "
             "command, centralisation versus delegation, and the common organisational structures."),
        ]),
        ("LESSON 2 · THE BUSINESS ENVIRONMENT", "#bba-environment", [
            ("2.1", "The Impact of the Environment",
             "The external forces that shape every business decision — political, economic, social, "
             "technological, legal, and environmental (PESTLE) — and how firms respond to them."),
        ]),
        ("LESSON 3 · MANAGEMENT FUNCTIONS", "#bba-management", [
            ("3.1", "Management Functions &amp; Processes",
             "The core work of a manager in one place: planning and organising, then leading and "
             "controlling — with leadership styles, motivation, delegation, and decision-making."),
        ]),
        ("LESSON 4 · PRODUCTION &amp; OPERATIONS", "#bba-production", [
            ("4.1", "Production",
             "How goods and services are made: production methods (job, batch, flow), operations "
             "management, quality, and productivity."),
        ]),
        ("LESSON 5 · MARKETING", "#bba-marketing", [
            ("5.1", "Marketing",
             "Identifying and satisfying customer needs: market research, segmentation, and the "
             "marketing mix — product, price, place, and promotion."),
        ]),
        ("LESSON 6 · FINANCE", "#bba-finance", [
            ("6.1", "Finance",
             "Where money comes from and how it is managed: sources of finance, cost behaviour, "
             "budgeting, and reading the basic financial statements."),
        ]),
        ("LESSON 7 · HUMAN RESOURCES", "#bba-human-resources", [
            ("7.1", "Human Resources",
             "Managing people: workforce planning, recruitment and selection, training and "
             "development, motivation, and the employment relationship."),
        ]),
        ("LESSON 8 · CHANGE MANAGEMENT", "#bba-change", [
            ("8.1", "Change &amp; the Management of Change",
             "Why organisations must change, where resistance comes from, and how managers lead "
             "change so it sticks."),
        ]),
    ]

    s_blk  = ParagraphStyle("s_blk", fontName="Body-Bold", fontSize=8,
                            textColor=C_AMBER_DK, leading=11, alignment=TA_LEFT)
    s_num  = ParagraphStyle("s_num", fontName="Body-Bold", fontSize=9,
                            textColor=C_AMBER_DK, leading=13, alignment=TA_LEFT)
    s_les  = ParagraphStyle("s_les", fontName="Body-Bold", fontSize=9,
                            textColor=C_INK, leading=13, alignment=TA_LEFT)

    rows = [[Paragraph("#", ST["th"]), Paragraph("Step", ST["th"]),
             Paragraph("What it covers", ST["th"])]]
    cmds = [
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_RULE),
        ("BACKGROUND",    (0,0), (-1, 0), BG_FORMULA),
        ("LINEBELOW",     (0,0), (-1, 0), 1,   C_AMBER),
    ]
    r = 1
    for lname, chan, steps in lessons:
        rows.append([Paragraph(
            f'{lname} &nbsp;&nbsp; <font color="#6B7280">{chan}</font>', s_blk), "", ""])
        cmds += [
            ("SPAN",       (0, r), (-1, r)),
            ("BACKGROUND", (0, r), (-1, r), colors.HexColor("#FEF8EC")),
            ("LINEBELOW",  (0, r), (-1, r), 0.5, C_AMBER),
            ("TOPPADDING", (0, r), (-1, r), 7),
            ("BOTTOMPADDING", (0, r), (-1, r), 5),
        ]
        r += 1
        for num, title, desc in steps:
            rows.append([Paragraph(num, s_num), Paragraph(title, s_les),
                         Paragraph(desc, ST["td"])])
            r += 1

    lt = Table(rows, colWidths=LCW, repeatRows=1)
    lt.setStyle(TableStyle(cmds))
    story.append(Spacer(1, 6))
    story.append(lt)
    story.append(Spacer(1, 12))

    # ── WHAT YOU'LL BE ABLE TO DO ───────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Be Able to Do")
    outcomes = [
        "Explain what a business is, the sectors it operates in, and the legal forms it can take.",
        "Describe how organisations are structured and why structure affects performance.",
        "Apply the four management functions — plan, organise, direct, control — to a real case.",
        "Outline how production, marketing, finance, and human resources work and connect.",
        "Analyse the external environment and stakeholder interests around a Zambian business.",
        "Explain how and why organisations manage change, and why people resist it.",
    ]
    for o in outcomes:
        story.append(Paragraph(f"• {o}", ST["outcome"]))
    story.append(Spacer(1, 8))

    story.append(callout(
        "Each lesson lands in its Slack channel as it is released. Start with Lesson 1.1 in "
        "#bba-foundations and work through in order — the course is built to be read that way."
    ))

    doc.build(story)
    print(f"Built: {OUT_PATH}")


if __name__ == "__main__":
    build()
