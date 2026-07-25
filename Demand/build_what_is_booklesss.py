"""
Booklesss — "What Is Booklesss?"
A plain-language explainer written to the student, for the student to read.
Not a script. Presses the real pain (old secondhand notes), explains what
Booklesss is, and ends on the one action: search Booklesss, three S's.
House style: cream paper, black type, Parastoo serif titles.
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

# ── ROOT (this script lives in Demand/, one level under project root) ────────
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# ── FONTS — vendored in _dev/fonts/, self-contained on any machine ──────────
FONT_DIR = os.path.join(_ROOT, "_dev", "fonts")

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

# ── BRAND ASSETS ─────────────────────────────────────────────────────────────
BRAND_DIR  = os.path.join(_ROOT, "_dev", "brand")
LOGO_BLACK = os.path.join(BRAND_DIR, "booklesss-logo-black.png")
MARK_BLACK = os.path.join(BRAND_DIR, "booklesss-mark-black.png")
GRAIN      = os.path.join(BRAND_DIR, "grain.png")
_logo_black = ImageReader(LOGO_BLACK) if os.path.exists(LOGO_BLACK) else None
_mark_black = ImageReader(MARK_BLACK) if os.path.exists(MARK_BLACK) else None
_grain      = ImageReader(GRAIN)      if os.path.exists(GRAIN)      else None

# ── COLOURS — cream paper, black type, no accents ────────────────────────────
C_COVER      = colors.HexColor("#FFFDE8")
C_PAGE       = colors.HexColor("#FFFEF2")
TITLE_DARK   = colors.HexColor("#121212")
HEADING_DARK = colors.HexColor("#3D3D3D")
C_INK        = colors.HexColor("#16201A")
C_STEEL      = colors.HexColor("#5F6B65")
C_MIST       = colors.HexColor("#6E6A5E")
C_RULE       = colors.HexColor("#E0DACB")
BG_PANEL     = colors.HexColor("#F5F0E8")

# ── PAGE GEOMETRY ────────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

OUT_DIR  = os.path.dirname(__file__)
OUT_PATH = os.path.join(OUT_DIR, "What Is Booklesss.pdf")

# ── STYLES ───────────────────────────────────────────────────────────────────
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
            fontName="Body-Bold", fontSize=7, textColor=C_INK,
            leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT,
            keepWithNext=1),
        "h2": ParagraphStyle("h2",
            fontName="Title-Bold", fontSize=17, textColor=HEADING_DARK,
            leading=20, spaceAfter=8, alignment=TA_LEFT, keepWithNext=1),
        "h3": ParagraphStyle("h3",
            fontName="Body-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT,
            keepWithNext=1),
        "lead": ParagraphStyle("lead",
            fontName="Body", fontSize=12, textColor=C_INK,
            leading=19, spaceAfter=9, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Body", fontSize=10.5, textColor=C_INK,
            leading=17, spaceAfter=6, alignment=TA_LEFT),
        "bullet": ParagraphStyle("bullet",
            fontName="Body", fontSize=10.5, textColor=C_INK,
            leading=17, spaceAfter=4, leftIndent=14, alignment=TA_LEFT),
        "fact": ParagraphStyle("fact",
            fontName="Body-Bold", fontSize=10.5, textColor=C_INK,
            leading=16, spaceAfter=6, alignment=TA_LEFT),
    }

ST = make_styles()

# ── CANVAS CALLBACKS ─────────────────────────────────────────────────────────
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
    canvas.drawRightString(W - MX, top_y, "WHAT BOOKLESSS IS")
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
    canvas.setStrokeColor(C_INK)
    canvas.setLineWidth(0.6)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "What Is Booklesss?")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · July 2026")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    _footer_left = "Booklesss | booklesss.framer.ai"
    canvas.drawString(MX, MY - 14, _footer_left)
    _tw = canvas.stringWidth(_footer_left, "Body", 7.5)
    canvas.linkURL("https://booklesss.framer.ai", (MX, MY - 16, MX + _tw, MY - 8))
    canvas.drawCentredString(W / 2, MY - 14, "For students")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")
    canvas.restoreState()

# ── HELPERS ──────────────────────────────────────────────────────────────────
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_INK,
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

def lead(text):
    return Paragraph(text, ST["lead"])

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
        ('BACKGROUND',    (0,0), (-1,-1), BG_PANEL),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_INK),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"), ParagraphStyle("cbt", fontName="Body",
                  fontSize=10.5, textColor=C_INK, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_PANEL),
        ('LINEBEFORE',    (0,0), (-1,-1), 2, C_INK),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_INK),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

# ── TRIPLE-MARK MOTIF ────────────────────────────────────────────────────────
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
        self._w = center_size + 2 * side_size + 2 * gap

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
        mid = getattr(self, "_aw", self._w) / 2.0
        hs, hc = self.ss / 2.0, self.cs / 2.0
        step = hc + self.gap + hs
        self._diamond(mid - step, cy, hs, fill=False)
        self._diamond(mid,        cy, hc, fill=True)
        self._diamond(mid + step, cy, hs, fill=False)
        c.restoreState()


# ── BUILD ────────────────────────────────────────────────────────────────────
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

    # ── COVER ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 120))
    story.append(LogoTriple(_mark_black) if _mark_black is not None
                 else TripleDiamond(color=HEADING_DARK))
    story.append(Spacer(1, 26))
    story.append(Paragraph("START HERE", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("What Is Booklesss?", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "The whole thing, in plain words. What it is, why it exists, and why "
        "there is honestly nothing else like it for students like you.",
        ST["cover_sub"]))
    story.append(Spacer(1, 200))
    story.append(Paragraph("A short read · July 2026", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── OPEN ─────────────────────────────────────────────────────────────────
    story += section("Start here", "First, the honest part")
    story.append(lead(
        "If someone sent you this, they think Booklesss can change how the rest of "
        "your semester goes. This explains what it actually is, in plain words, so you "
        "can decide for yourself."
    ))
    story.append(body(
        "So start here. You are probably not struggling because you are lazy, or slow, "
        "or not built for your course. You are struggling because of what you are being "
        "asked to learn from. And almost nobody says that out loud."
    ))

    # ── THE PROBLEM ──────────────────────────────────────────────────────────
    story += section("The problem", "Look at where your notes actually came from")
    story.append(body(
        "Trace the notes open in front of you back to their source. A classmate sent them "
        "to you. They got them from someone in the year above. That person got them from "
        "someone who has already graduated. Somewhere down that chain the pages were "
        "photocopied, screenshotted, and passed on so many times that nobody remembers "
        "who wrote them, or when."
    ))
    story.append(body(
        "So you end up revising from material that is older than your own syllabus. Pages "
        "are missing. The examples do not match what your lecturer actually stood up and "
        "taught this year. Half of it is written the way people write for themselves at 2am, "
        "in shorthand that only made sense to the person who wrote it."
    ))
    story.append(body(
        "Then exam week arrives, and you are trying to build one clear understanding out of "
        "three people's handwriting, a textbook you cannot quite follow, and a YouTube video "
        "made for students in a completely different country. When you get stuck late at "
        "night, there is nobody to ask."
    ))
    story.append(fact(
        "None of that is a you problem. It is a material problem. Nobody ever built you "
        "something good to learn from. That is the exact gap Booklesss exists to close."
    ))

    # ── WHAT IT IS ───────────────────────────────────────────────────────────
    story += section("What it is", "So, what is Booklesss?")
    story.append(body(
        "Booklesss is your course, rebuilt from the ground up. Clean, current notes for "
        "exactly what you are studying this semester, written to be understood the first "
        "time you read them, not to fill pages or impress an examiner."
    ))
    story.append(body(
        "But it is more than a set of notes. Booklesss is a community you are inside, not a "
        "folder you download once and forget about. Your notes sit in the same place as your "
        "coursemates and the people who made the material, so when something does not click, "
        "you can ask, and a real person answers."
    ))
    story.append(body(
        "And everything is broken into small steps. Each step takes one idea, explains it "
        "properly, shows you how it works with real examples, and then stops. You finish a "
        "step and you can feel that you understood it before you move to the next one. You are "
        "not handed a 200-page bundle and left to sink. You climb one clear rung at a time."
    ))

    # ── HOW IT WORKS ─────────────────────────────────────────────────────────
    story += section("How it works", "What that actually looks like")
    story.append(h3("The notes explain themselves"))
    story.append(body(
        "Every step is written for a student reading it alone, with no lecturer sitting next "
        "to them. Difficult terms are explained right where they appear. The examples use "
        "companies and figures you already recognise, in kwacha, not abstractions borrowed "
        "from another economy."
    ))
    story.append(h3("You can see yourself moving"))
    story.append(body(
        "Because the work is in steps, you always know where you are, what you have finished, "
        "and what is next. Progress stops being a vague feeling of falling behind and becomes "
        "something you can actually watch happen."
    ))
    story.append(h3("You are never stuck alone"))
    story.append(body(
        "The community is the point, not a bonus bolted on the side. Ask a question about a "
        "step and the answer comes from people working through the very same thing, and from "
        "the people who wrote it. The 11pm dead end stops being the end of the road."
    ))
    story.append(h3("It stays current"))
    story.append(body(
        "When your course changes, the notes change with it. You are not inheriting last "
        "year's version with a fresh cover on the front. What you read matches what you are "
        "actually being taught and tested on now."
    ))

    # ── WHY NOTHING ELSE ─────────────────────────────────────────────────────
    story += section("Why it stands alone", "There is genuinely nothing else like this")
    story.append(body(
        "You have already tried the alternatives, because everyone has. Last year's notes with "
        "a new date on the front. A group chat where good questions scroll away unanswered by "
        "morning. A random PDF someone dropped in the class WhatsApp. A video made for a "
        "syllabus that was never yours to begin with."
    ))
    story.append(body(
        "Every one of those is someone else's material, aimed at someone else, that you are "
        "quietly trying to bend into a shape that fits your course. Booklesss is the opposite "
        "of that. It is built for your course, kept current, with real people around it, for "
        "students right here. Nothing else is doing that. Not for you, and not for this."
    ))
    story.append(fact(
        "Booklesss is not a better version of the notes you already have. It is the first "
        "time the material was actually made for you."
    ))

    # ── WHAT CHANGES ─────────────────────────────────────────────────────────
    story += section("What changes for you", "What it feels like on the other side")
    story.append(body(
        "Picture opening your notes and understanding them on the first read. Picture walking "
        "into an exam having genuinely followed the material all semester, instead of cramming "
        "a stranger's handwriting the night before. Picture getting stuck and knowing exactly "
        "where to go and who to ask."
    ))
    story.append(body(
        "That is the whole point of Booklesss. Not to make studying look flashy. To make it "
        "make sense, and to stop you doing it alone."
    ))
    story.append(fact(
        "Booklesss does not ask you to work harder than you already do. It gives you material "
        "worth working from, and people to work through it with."
    ))

    # ── HOW TO GET IN ────────────────────────────────────────────────────────
    story += section("How to get in", "Finding us takes one search")
    story.append(body(
        "If you are reading this from a link, that link takes you straight in. If there is no "
        "link in front of you, it takes exactly one search to find us."
    ))
    story.append(callout(
        "Open Google and search <b>Booklesss</b>. That is Booklesss with three S's.\n"
        "<b>B - O - O - K - L - E - S - S - S.</b>  Three S's at the end.\n"
        "We will be the first thing you see."
    ))
    story.append(lead(
        "Come find out what studying was supposed to feel like."
    ))

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
