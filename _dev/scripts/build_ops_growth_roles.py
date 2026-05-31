"""
Booklesss — Roles for Growth
Internal planning document: hiring sequence and incentive design
Palette: house brand — cream + jade
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

# ── FONTS ──────────────────────────────────────────────────────────────────
FONT_DIR = os.path.join(os.path.dirname(__file__), "..", "fonts")

def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, filename)))

_reg("Body",             "Aptos.ttf")
_reg("Body-Bold",        "Aptos-Bold.ttf")
_reg("Body-Italic",      "Aptos-Italic.ttf")
_reg("Body-BoldItalic",  "Aptos-Bold-Italic.ttf")
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold",
                              italic="Body-Italic", boldItalic="Body-BoldItalic")
_reg("Display-Bold",     "parkinsans-v3-latin-700.ttf")
_reg("Title",            "Parastoo.ttf")
_reg("Title-Bold",       "Parastoo-Bold.ttf")
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

# ── PALETTE ────────────────────────────────────────────────────────────────
C_COVER      = colors.HexColor("#FFFDE8")
C_PAGE       = colors.HexColor("#FFFEF2")
TITLE_DARK   = colors.HexColor("#121212")
HEADING_DARK = colors.HexColor("#3D3D3D")
C_JADE       = colors.HexColor("#2FB99A")
C_JADE_DK    = colors.HexColor("#0E5E52")
C_INK        = colors.HexColor("#16201A")
C_STEEL      = colors.HexColor("#5F6B65")
C_MIST       = colors.HexColor("#6E6A5E")
C_RULE       = colors.HexColor("#E0DACB")
BG_FORMULA   = colors.HexColor("#E9F0EA")
BG_CALLOUT   = colors.HexColor("#E7F3ED")

# ── PAGE GEOMETRY ──────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..", "operations")
OUT_PATH = os.path.join(OUT_DIR, "Roles for Growth - Booklesss.pdf")

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
            fontName="Body-Bold", fontSize=7, textColor=C_JADE,
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
            fontName="Body-Bold", fontSize=10, textColor=C_JADE_DK,
            leading=16, spaceAfter=6, leftIndent=0, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_JADE_DK,
            leading=16, alignment=TA_LEFT),
        "formula_r": ParagraphStyle("formula_r",
            fontName="Body-Bold", fontSize=10, textColor=C_JADE_DK,
            leading=16, alignment=TA_RIGHT),
        "th": ParagraphStyle("th",
            fontName="Body-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Body", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "note": ParagraphStyle("note",
            fontName="Body-Italic", fontSize=8.5, textColor=C_MIST,
            leading=13, spaceAfter=4, alignment=TA_LEFT),
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
        canvas.drawImage(_logo_black, MX, top_y - 5, width=lh * iw / ih, height=lh,
                         preserveAspectRatio=True, mask="auto")
    else:
        canvas.setFont("Body-Bold", 8.5)
        canvas.setFillColor(HEADING_DARK)
        canvas.drawString(MX, top_y, "BOOKLESSS")
    canvas.setFont("Body", 8.5)
    canvas.setFillColor(C_MIST)
    canvas.drawRightString(W - MX, top_y, "INTERNAL PLANNING")
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
    canvas.setStrokeColor(C_JADE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "Roles for Growth")
    canvas.drawRightString(W - MX, H - MY + 7, "May 2026 — Internal")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "Internal Planning")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")
    canvas.restoreState()

# ── HELPERS ────────────────────────────────────────────────────────────────
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_JADE,
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
        ('BACKGROUND',    (0,0), (-1,-1), BG_CALLOUT),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"), ParagraphStyle("cbt", fontName="Body",
                  fontSize=10, textColor=C_JADE_DK, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_CALLOUT),
        ('LINEBEFORE',    (0,0), (-1,-1), 2, C_JADE),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

def formula_box(lines):
    items = [[Paragraph(ln, ST["formula"])] for ln in lines]
    inner = Table(items, colWidths=[CONTENT_W - 26])
    inner.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
    ]))
    outer = Table([[inner]], colWidths=[CONTENT_W])
    outer.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_FORMULA),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_JADE),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([outer, Spacer(1, 10)])

def table_std(data, col_widths):
    rows = []
    for i, row in enumerate(data):
        styled = [Paragraph(str(c), ST["th"] if i == 0 else ST["td"]) for c in row]
        rows.append(styled)
    t = Table(rows, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_RULE),
        ('BACKGROUND',    (0,0), (-1, 0), BG_FORMULA),
        ('LINEBELOW',     (0,0), (-1, 0), 1, C_JADE),
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
    def __init__(self, center_size=15, side_size=10, gap=13, color=None, stroke_width=1.3):
        super().__init__()
        self.cs, self.ss, self.gap = center_size, side_size, gap
        self.color = color or HEADING_DARK
        self.sw = stroke_width
        self._h = center_size

    def wrap(self, aw, ah):
        self._aw = aw
        return aw, self._h

    def _diamond(self, cx, cy, s):
        p = self.canv.beginPath()
        p.moveTo(cx,       cy + s/2)
        p.lineTo(cx + s/2, cy)
        p.lineTo(cx,       cy - s/2)
        p.lineTo(cx - s/2, cy)
        p.close()
        return p

    def draw(self):
        c = self.canv
        c.saveState()
        mid = getattr(self, "_aw", 100) / 2
        cy = self._h / 2
        step = self.cs / 2 + self.gap + self.ss / 2
        c.setStrokeColor(self.color)
        c.setLineWidth(self.sw)
        c.setFillColor(colors.white)
        c.drawPath(self._diamond(mid - step, cy, self.ss), stroke=1, fill=0)
        c.drawPath(self._diamond(mid + step, cy, self.ss), stroke=1, fill=0)
        c.setFillColor(self.color)
        c.drawPath(self._diamond(mid, cy, self.cs), stroke=0, fill=1)
        c.restoreState()


# ── BUILD ──────────────────────────────────────────────────────────────────
def build():
    doc = BaseDocTemplate(
        OUT_PATH,
        pagesize=A4,
        leftMargin=MX, rightMargin=MX,
        topMargin=MY + 12, bottomMargin=MY + 12,
    )

    cover_frame = Frame(0, 0, W, H, leftPadding=MX, rightPadding=MX,
                        topPadding=MY + 30, bottomPadding=MY, id="cover")
    body_frame  = Frame(MX, MY, W - 2*MX, H - 2*MY - 12,
                        leftPadding=0, rightPadding=0,
                        topPadding=12, bottomPadding=12, id="body")

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="body",  frames=[body_frame],  onPage=page_bg, onPageEnd=body_page),
    ])

    motif = LogoTriple(_mark_black) if _mark_black else TripleDiamond()
    story = []

    # ── COVER ─────────────────────────────────────────────────────────────
    story += [
        Spacer(1, 60),
        motif,
        Spacer(1, 32),
        Paragraph("BOOKLESSS — INTERNAL", ST["cover_step"]),
        Spacer(1, 8),
        Paragraph("Roles for Growth", ST["cover_title"]),
        Spacer(1, 14),
        Paragraph(
            "Who to hire, when, and how to align each person with the platform's future",
            ST["cover_sub"]),
        Spacer(1, 12),
        Paragraph("May 2026", ST["cover_meta"]),
        NextPageTemplate("body"),
        PageBreak(),
    ]

    # ── SECTION 1: PHILOSOPHY ─────────────────────────────────────────────
    story += section("THE APPROACH", "Hiring Philosophy")
    story.append(body(
        "Every person who works on this platform should have a direct financial reason to make "
        "it succeed. No flat salaries at this stage — every role is structured around commission, "
        "revenue share, or royalties. This keeps costs variable while the platform is growing and "
        "means the people doing the work are running the same calculation you are: "
        "more students, better retention, stronger content."
    ))
    story.append(body(
        "Costs stay purely variable until monthly revenue reaches K10,000. After that, "
        "selected roles can move to a hybrid structure. Until then, if the platform "
        "doesn't earn, nobody earns."
    ))
    story.append(fact(
        "Hire milestone-gated, not time-gated. The question is not 'when do we hire?' — "
        "it is 'what revenue level unlocks each role?'"
    ))

    # ── SECTION 2: HIRING SEQUENCE ────────────────────────────────────────
    story += section("SEQUENCE", "When to Hire Each Role")
    story.append(body(
        "The six roles below are ordered by priority. Each one addresses a specific bottleneck "
        "in the platform. Don't hire ahead of the bottleneck — the role won't have enough to do."
    ))
    seq_data = [
        ["Priority", "Role", "Unlocks when..."],
        ["1", "Campus Representative",
         "You have a free trial offer and no time to recruit yourself"],
        ["2", "Community Host",
         "You have 10+ active students and discussions need a daily steward"],
        ["3", "Course Author",
         "You want to launch a 4th course without writing it yourself"],
        ["4", "Operations & Collections Lead",
         "You're manually chasing 15+ renewals per month"],
        ["5", "Growth Lead",
         "The WhatsApp funnel needs full-time attention to convert at scale"],
        ["6", "Curriculum Strategist",
         "You have 3+ active courses and the roadmap needs a dedicated owner"],
    ]
    story.append(table_std(seq_data, [40, 130, CONTENT_W - 170]))

    # ── SECTION 3: ROLE 01 ────────────────────────────────────────────────
    story += section("ROLE 01", "Campus Representative")
    story.append(body(
        "Campus Reps are students at target universities — UNZA, CBU, Mulungushi — "
        "who recruit their classmates. They know the courses, they know the pain points, "
        "and they have the peer trust that a flyer or a WhatsApp message from a stranger "
        "doesn't. First target: one Rep at UNZA, one at CBU."
    ))
    story.append(h3("What they own"))
    story += [
        bullet("Identify classmates sitting relevant courses and introduce them to the free trial"),
        bullet("Share lead magnets in course WhatsApp groups and study circles"),
        bullet("Follow up on warm leads and walk trial students through joining Slack"),
        bullet("Report conversion numbers monthly"),
    ]
    story.append(h3("Compensation"))
    story.append(formula_box([
        "K100 per referred student who completes their first paid month",
        "K50 / month per active referred student while they remain subscribed",
        "",
        "Example: 10 active referrals  →  K500 / month ongoing",
    ]))
    story.append(callout(
        "The ongoing K50 tail is the key design choice. A Rep who sends low-quality leads "
        "— students who try once and leave — earns less than one who sends students who stay. "
        "They stop earning the moment a referral churns."
    ))

    # ── SECTION 4: ROLE 02 ────────────────────────────────────────────────
    story += section("ROLE 02", "Community Host")
    story.append(body(
        "The Community Host owns the Slack channels for one course. Their job is to make "
        "the community feel alive — starting discussions, answering questions, welcoming "
        "new members, and running a weekly prompt tied to the current lesson. "
        "First hire: one Host for Treasury Management, the most active course."
    ))
    story.append(h3("What they own"))
    story += [
        bullet("Daily presence in the course channels (minimum one post per weekday)"),
        bullet("Weekly discussion prompt linked to the current lesson step"),
        bullet("Welcoming new students within 48 hours of them joining"),
        bullet("Flagging students who go quiet for more than two weeks"),
    ]
    story.append(h3("Compensation"))
    story.append(formula_box([
        "K300 / month base",
        "K30 per monthly active user (MAU) in their channels above 10",
        "",
        "Example: 25 MAU  →  K300 + (15 × K30) = K750 / month",
    ]))
    story.append(callout(
        "The MAU bonus means the Host earns more only if students stay engaged. "
        "Their job is retention, not just posting — the compensation is designed to "
        "make that obvious."
    ))

    # ── SECTION 5: ROLE 03 ────────────────────────────────────────────────
    story += section("ROLE 03", "Course Author")
    story.append(body(
        "Course Authors write the lesson steps for a single course. They are subject matter "
        "experts — typically graduates or final-year students who scored well in that paper. "
        "They own the accuracy of the content and update it when syllabi change. "
        "First hire: one Author for a 4th course, most likely Financial Accounting "
        "or Business Finance."
    ))
    story.append(h3("What they own"))
    story += [
        bullet("Write all 10 lesson steps following the Booklesss PDF design system"),
        bullet("Maintain content accuracy and update steps when the syllabus changes"),
        bullet("Coordinate with the Curriculum Strategist on the editorial calendar"),
    ]
    story.append(h3("Compensation"))
    story.append(formula_box([
        "K500 per lesson step delivered and approved  (10 steps = K5,000 on completion)",
        "8% monthly royalty on revenue from students enrolled in their course",
        "",
        "Example: 20 students × K250 / month = K5,000 course revenue  →  K400 royalty / month",
    ]))
    story.append(callout(
        "The royalty means an Author earns more if students stay subscribed. They are "
        "incentivised to write content that helps students pass — not just content that "
        "looks polished on delivery day. Bad content drives churn, and churn cuts their royalty."
    ))

    # ── SECTION 6: ROLE 04 ────────────────────────────────────────────────
    story += section("ROLE 04", "Operations & Collections Lead")
    story.append(body(
        "This role handles the financial plumbing: tracking MoMo payments, managing the "
        "revenue log, following up on renewals at day 25, and flagging students who have "
        "lapsed without cancelling. Part-time to start. One person can handle this up to "
        "around 60 active students."
    ))
    story.append(h3("What they own"))
    story += [
        bullet("Log all payments in the revenue log within 24 hours of receipt"),
        bullet("Send renewal reminders at day 25 of each student's billing cycle"),
        bullet("Flag and follow up on unpaid accounts via WhatsApp"),
        bullet("Deliver a monthly financial summary to the founder"),
    ]
    story.append(h3("Compensation"))
    story.append(formula_box([
        "K200 flat per month while total collected revenue is under K3,000",
        "5% of all revenue collected above K3,000 / month",
        "",
        "Example: K8,000 collected  →  K200 + (5% × K5,000) = K450 / month",
    ]))

    # ── SECTION 7: ROLE 05 ────────────────────────────────────────────────
    story += section("ROLE 05", "Growth Lead")
    story.append(body(
        "The Growth Lead runs the WhatsApp marketing operation — distributing lead magnets, "
        "managing group conversations, and moving prospects from first contact to free trial "
        "sign-up. Part-time initially, with a clear path to full-time once the funnel is "
        "converting consistently."
    ))
    story.append(h3("What they own"))
    story += [
        bullet("Distribute lead magnets across target university WhatsApp groups"),
        bullet("Manage warm conversations and answer questions about the platform"),
        bullet("Drive free trial sign-ups and hand new trials off to the Community Host"),
        bullet("Track funnel numbers monthly: leads contacted, trials started, conversions"),
    ]
    story.append(h3("Compensation"))
    story.append(formula_box([
        "K150 per free trial activation they drive",
        "K300 bonus per trial that converts to a paid plan within 30 days",
        "",
        "Example: 10 trials, 4 convert  →  (10 × K150) + (4 × K300) = K2,700 / month",
    ]))
    story.append(callout(
        "Two payments — one for the trial, one for the conversion — separate volume from "
        "quality. A Growth Lead who floods the funnel with unqualified contacts earns the "
        "K150 once and nothing more. One who sends serious students earns K450 per head."
    ))

    # ── SECTION 8: ROLE 06 — THE FUTURE-THINKING ROLE ─────────────────────
    story += section("ROLE 06 — THE FUTURE-THINKING ROLE", "Curriculum Strategist")
    story.append(body(
        "The Curriculum Strategist decides which courses Booklesss adds next. They research "
        "syllabi at UNZA, CBU, and Mulungushi, talk to students and lecturers, commission "
        "Course Authors, and own the content roadmap. This is the role where short-term "
        "thinking is actively punished by the incentive structure."
    ))
    story.append(h3("What they own"))
    story += [
        bullet("Identify and vet the next 2–3 courses to build, ranked by student demand"),
        bullet("Commission Course Authors and hold them to the content standard"),
        bullet("Monitor university exam calendars and adjust the roadmap accordingly"),
        bullet("Decide when to retire or update courses as syllabi change"),
    ]
    story.append(h3("Compensation"))
    story.append(formula_box([
        "No base salary",
        "12% royalty on all revenue from courses they greenlight",
        "Vesting: 1% per month over 12 months from the course launch date",
        "If a course is killed before 12 months: vesting stops, accrued royalties are paid",
        "",
        "Example: course at K4,000 / month in month 8  →  8% vested  →  K320 / month",
    ]))
    story.append(callout(
        "Why the 12-month vest creates the right thinking:\n"
        "A strategist on a vesting royalty will only greenlight courses with genuine, durable "
        "demand. Before saying yes to a new course, they have to ask: Will UNZA still offer "
        "this in two years? Does this paper have three exam sittings per year or just one? "
        "Is the student population large enough to generate meaningful revenue? These are "
        "questions that only matter if you are thinking 12 months out — which is exactly the "
        "point. The royalty vest means they stay engaged through the full launch arc. They "
        "collect nothing if the course dies in month three."
    ))
    story.append(fact(
        "First hire note: the founder holds this role for the first 12 months. "
        "Only bring in an external Strategist once 3+ active courses are running and the "
        "pattern is clear enough to hand off with confidence."
    ))

    # ── SECTION 9: SUMMARY TABLE ──────────────────────────────────────────
    story += section("REFERENCE", "Compensation at a Glance")
    comp_data = [
        ["Role", "Base", "Variable", "Variable trigger"],
        ["Campus Representative", "—",         "K100 + K50/mo per referral",    "Per paid student referred"],
        ["Community Host",        "K300/mo",    "K30 per MAU above 10",          "Monthly active users"],
        ["Course Author",         "K500/step",  "8% royalty on course rev.",     "Students enrolled in course"],
        ["Ops & Collections",     "K200/mo *",  "5% above K3,000",               "Revenue collected"],
        ["Growth Lead",           "—",          "K150/trial + K300 on convert",  "Trials driven and converted"],
        ["Curriculum Strategist", "—",          "12% royalty, 12-mo vest",       "Revenue from greenlights"],
    ]
    story.append(table_std(comp_data, [105, 58, 130, CONTENT_W - 105 - 58 - 130]))
    story.append(Paragraph(
        "* Ops base applies only while monthly collected revenue is under K3,000.",
        ST["note"]))

    # ── SECTION 10: CLOSING ───────────────────────────────────────────────
    story += section("CLOSING", "Hire From Your Students First")
    story.append(body(
        "Every one of these roles can be filled by someone already inside the Booklesss "
        "community. A student who scored a distinction in Treasury Management is a stronger "
        "candidate for Course Author than a graduate who has never used the platform. "
        "A student who refers three classmates before you even ask is your first Campus Rep. "
        "Watch who shows up, helps others, and cares about the outcomes — then give them "
        "the title and the economics to match."
    ))
    story.append(body(
        "Hiring externally is a last resort when the community doesn't produce the right "
        "candidate. Post to your existing students before posting anywhere else."
    ))

    doc.build(story)
    print(f"Done: {OUT_PATH}")


if __name__ == "__main__":
    build()
