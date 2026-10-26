"""
Booklesss — launch blog post (August 2026).

A serious, value-led argument for a student to get into Booklesss, written for
the weekend the course reader opens. The case is the gap between reading
something and being able to do it, and what the reader does about that gap.

Deliberately NOT in here (owner, 2026-08-06): the photocopied-notes story and
who wrote whose material, counts of courses and steps, and the curriculum /
timetable machinery. None of them is the value, and the first is corny.

House style: cream paper, black type, Parastoo serif titles. No accent colour,
no em dashes, no pricing (the founding rate expired and the replacement offer
is undecided).
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak, NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
import os

# ── ROOT (this script lives in Demand/sources/, two levels under the root) ───
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

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
_reg("Title",            "Parastoo.ttf")
_reg("Title-Bold",       "Parastoo-Bold.ttf")
pdfmetrics.registerFontFamily("Title", normal="Title", bold="Title-Bold",
                              italic="Title", boldItalic="Title-Bold")

# ── BRAND ASSETS ─────────────────────────────────────────────────────────────
BRAND_DIR  = os.path.join(_ROOT, "Brand")
LOGO_BLACK = os.path.join(BRAND_DIR, "booklesss-wordmark-black.png")
_logo_black = ImageReader(LOGO_BLACK) if os.path.exists(LOGO_BLACK) else None

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

RUNNING_TITLE = "The Difference Between Reading It And Having It"
RUNNING_META  = "Launch · August 2026"

OUT_DIR  = os.path.join(_ROOT, "Demand")
OUT_PATH = os.path.join(
    OUT_DIR, "The Difference Between Reading It And Having It - Booklesss.pdf")


# ── STYLES ───────────────────────────────────────────────────────────────────
def make_styles():
    return {
        "cover_step": ParagraphStyle("cover_step",
            fontName="Body-Bold", fontSize=9, textColor=HEADING_DARK,
            leading=13, spaceAfter=0, alignment=TA_CENTER),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Title-Bold", fontSize=38, textColor=TITLE_DARK,
            leading=44, spaceAfter=0, alignment=TA_CENTER),
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
        "th": ParagraphStyle("th",
            fontName="Body-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Body", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "cta": ParagraphStyle("cta",
            fontName="Title-Bold", fontSize=20, textColor=TITLE_DARK,
            leading=25, spaceAfter=6, alignment=TA_LEFT),
    }


ST = make_styles()


# ── CANVAS CALLBACKS ─────────────────────────────────────────────────────────
def _paint_paper(canvas, bg):
    canvas.setFillColor(bg)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)


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
    canvas.drawRightString(W - MX, top_y, "LAUNCH")
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
    canvas.drawString(MX, H - MY + 7, RUNNING_TITLE)
    canvas.drawRightString(W - MX, H - MY + 7, RUNNING_META)
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    _footer_left = "Booklesss | booklesss.app"
    canvas.drawString(MX, MY - 14, _footer_left)
    _tw = canvas.stringWidth(_footer_left, "Body", 7.5)
    canvas.linkURL("https://booklesss.app", (MX, MY - 16, MX + _tw, MY - 8))
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
        ('BACKGROUND',    (0, 0), (-1, -1), BG_PANEL),
        ('LINEBEFORE',    (0, 0), (-1, -1), 2.5, C_INK),
        ('TOPPADDING',    (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LEFTPADDING',   (0, 0), (-1, -1), 10),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])


def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"),
                  ParagraphStyle("cbt", fontName="Body", fontSize=10.5,
                                 textColor=C_INK, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, -1), BG_PANEL),
        ('LINEBEFORE',    (0, 0), (-1, -1), 2, C_INK),
        ('LINEBELOW',     (0, 0), (-1, -1), 0.5, C_INK),
        ('TOPPADDING',    (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LEFTPADDING',   (0, 0), (-1, -1), 10),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])


def table_std(data, col_widths):
    rows = [[Paragraph(c, ST["th"] if r == 0 else ST["td"]) for c in row]
            for r, row in enumerate(data)]
    t = Table(rows, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW',     (0, 0), (-1, 0), 0.9, C_INK),
        ('LINEBELOW',     (0, 1), (-1, -2), 0.4, C_RULE),
        ('TOPPADDING',    (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 8),
    ]))
    return KeepTogether([t, Spacer(1, 12)])


# ── BUILD ────────────────────────────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4,
                          topMargin=MY, bottomMargin=MY,
                          leftMargin=MX, rightMargin=MX,
                          title=RUNNING_TITLE, author="Booklesss")

    cover_tpl = PageTemplate(id="cover",
        frames=[Frame(MX, MY, CONTENT_W, H - 2 * MY)],
        onPage=cover_bg, pagesize=A4)
    body_tpl = PageTemplate(id="body",
        frames=[Frame(MX, MY + 5, CONTENT_W, H - 2 * MY - 15)],
        onPage=page_bg, onPageEnd=body_page, pagesize=A4)
    doc.addPageTemplates([cover_tpl, body_tpl])

    story = []

    # ── COVER ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 104))
    story.append(Paragraph("OPENS SATURDAY, 8 AUGUST", ST["cover_step"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "The Difference Between<br/>Reading It<br/>And Having It", ST["cover_title"]))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "Booklesss is a course you can check yourself against, weeks before "
        "anyone else checks you. Here is what it does and why it is worth your "
        "evening.",
        ST["cover_sub"]))
    story.append(Spacer(1, 150))
    story.append(Paragraph("A short read \u00b7 August 2026", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss \u00b7 booklesss.app", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── 1. THE GAP ───────────────────────────────────────────────────────────
    story += section("Start here", "You can revise for a week and not know whether it worked")
    story.append(lead(
        "The hard part of a course is not getting hold of the material. It is that "
        "nothing tells you whether you have understood it until the paper is in front "
        "of you."
    ))
    story.append(body(
        "Reading feels like progress. You go through a chapter, the sentences make "
        "sense as you read them, and you close it with the impression of having learned "
        "something. Weeks later the question is phrased a way you did not expect, and "
        "the impression turns out to have been the whole of it."
    ))
    story.append(body(
        "So every hour you study is a bet placed without a result. You find out once, "
        "at the end, when there is nothing left to do about it. That is the real problem "
        "with how studying works now, and more material does not fix it."
    ))
    story.append(fact(
        "What is missing is not access to notes. It is an honest answer about where you "
        "stand, early enough that you can still do something with it."
    ))

    # ── 2. WHAT IT DOES ──────────────────────────────────────────────────────
    story += section("What it does", "A course that answers back")
    story.append(body(
        "Booklesss is a course you read on your phone, one section at a time, and every "
        "section ends by asking you something about what you just read."
    ))
    story.append(body(
        "Get it wrong the first time and you are told only that it is wrong, then sent "
        "back to the text. You are deliberately not shown the right answer, because then "
        "trying again would mean picking the green one. Miss it twice and the answer and "
        "the reasoning both appear, and you still have to select it yourself."
    ))
    story.append(body(
        "The wrong options are not filler either. Each one is a mistake students "
        "actually make at that exact point, so the option you reach for tells you which "
        "misunderstanding you are carrying and where to go back to."
    ))
    story.append(fact(
        "What you have finished is what you can answer. Progress here is a measurement "
        "rather than a feeling, and you get it weeks before the exam gives you one."
    ))

    # ── 3. HOW IT IS WRITTEN ─────────────────────────────────────────────────
    story += section("How it is written", "Written to be understood the first time")
    story.append(body(
        "The material is not a syllabus retyped or a lecture transcribed. It is written "
        "against rules, and these are the ones you will feel:"
    ))
    story.append(KeepTogether([
        bullet("<b>One idea per section</b>, and a section is short enough to finish in "
               "a sitting. Three finished in an evening is worth more than one abandoned "
               "two thirds of the way through."),
        bullet("<b>A term is defined where you meet it</b>, in the same sentence, and "
               "used plainly after that. The jargon around it is underlined, and one tap "
               "gives you the meaning without breaking the sentence for someone who "
               "already knew the word."),
        bullet("<b>Plain words for the ordinary parts, exact words for the technical "
               "parts.</b> The vocabulary being taught is never watered down. Everything "
               "carrying it is the simplest available, so a sentence never costs you "
               "twice."),
        bullet("<b>Workings are laid out as workings.</b> Figures aligned, subtotals "
               "ruled off, kwacha, negatives in brackets. The way it is done on paper "
               "and the way a marker expects to see it."),
        bullet("<b>One boxed sentence per section</b>, carrying the thing that has to "
               "survive when the rest of the detail is gone."),
        bullet("<b>Examples come from what your course actually teaches</b>, at their "
               "original figures, so you can hold the step and the lecture side by side "
               "instead of translating between two versions of the same topic."),
        Spacer(1, 6),
    ]))

    # ── 4. WHO IT IS FOR ─────────────────────────────────────────────────────
    story += section("Who it is written for", "You are handed the judgement, not the mark scheme")
    story.append(body(
        "Most notes teach you what an exam will ask. Booklesss teaches you what the "
        "decision costs."
    ))
    story.append(body(
        "The sentences land on a choice you would have to make. What a business can "
        "survive without while it is small. What you are actually buying when you hire. "
        "What a hedge protects and what it gives up to do it. It is written to someone "
        "who intends to run something, because most of the people reading it do."
    ))
    story.append(body(
        "That is the harder way to write and it produces better exam answers as a side "
        "effect. Understand why a treasury function is split the way it is and you "
        "answer a question on segregation of duties correctly without ever having "
        "memorised the phrase. Memorise the phrase instead and you are one rewording "
        "away from losing the marks."
    ))
    story.append(fact(
        "Understanding survives a question you have not seen before. Memorising does "
        "not, and the paper is written by someone who knows that."
    ))

    # ── 5. THE SHAPE ─────────────────────────────────────────────────────────
    story += section("The shape", "You hold the whole course before you have finished it")
    story.append(body(
        "You are given the structure of the course up front rather than a topic at a "
        "time. Early on you already know what the final section deals with and why it "
        "sits at the end."
    ))
    story.append(body(
        "So the course stops being a sequence of new territory and becomes a picture you "
        "are filling in. Depth lands on a frame you already hold, which is the whole "
        "difference between remembering twelve topics and understanding one subject. By "
        "the end it reads as confirmation rather than discovery, and that is what makes "
        "revision short."
    ))

    # ── 6. WHAT IT ADDS UP TO ────────────────────────────────────────────────
    story += section("What it adds up to", "A record of what you can actually do")
    story.append(body(
        "Every checkpoint you clear is a specific piece of evidence. You can discount a "
        "cash flow. You can see where a strategy is exposed. You can say what a hedge "
        "gives up. On their own they are checkpoints. Across a semester they are a "
        "record of demonstrated work, and nothing else you are given at university is "
        "that."
    ))
    story.append(body(
        "A grade compresses a year into a single letter and says nothing about which "
        "parts you own. This accumulates the opposite: specific, dated, and yours. Where "
        "it goes next is the most reliable place in this country for a business to find "
        "someone who can genuinely do the work rather than someone who wrote that they "
        "can. That part is being built in order, and the studying is the part that is "
        "ready now."
    ))

    # ── 7. CTA ───────────────────────────────────────────────────────────────
    story += section("How to get in", "One word")
    story.append(body(
        "Booklesss opens this Saturday, 8 August. Economics, Corporate Finance, "
        "Treasury Management and Strategic Management are on it, with more added every "
        "week. Nothing to download, no card to enter, and it runs on the phone you are "
        "reading this on."
    ))
    story.append(body(
        "It is early, and that is the argument for coming in now rather than the "
        "disclaimer. What you say about a section goes into the next version of it, so "
        "the people who arrive this week shape more of the course than the ones who "
        "arrive after it settles."
    ))
    story.append(Spacer(1, 4))
    story.append(callout(
        "<b>Comment \"Booklesss\" under the post</b> and the link comes to you the "
        "morning it opens."
    ))

    doc.build(story)
    print(f"Written: {OUT_PATH}")


if __name__ == "__main__":
    build()
