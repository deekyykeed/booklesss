"""
Booklesss — launch blog post (August 2026).

A read-it-in-five-minutes argument for why a student should get into Booklesss,
written for the weekend the course reader opens. Presses the real pain (notes
nobody wrote), says what the reader actually is, explains the mechanics that
make it different, and ends on one action: comment Booklesss under the post.

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

RUNNING_TITLE = "Nobody Ever Built You Something Good To Learn From"
RUNNING_META  = "Launch · August 2026"

OUT_DIR  = os.path.join(_ROOT, "Demand")
OUT_PATH = os.path.join(
    OUT_DIR, "Nobody Ever Built You Something Good To Learn From - Booklesss.pdf")


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
    story.append(Spacer(1, 96))
    story.append(Paragraph("OPENS SATURDAY, 8 AUGUST", ST["cover_step"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Nobody Ever Built You<br/>Something Good<br/>To Learn From", ST["cover_title"]))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "So we did. Four courses, written from nothing, that open on your phone "
        "and remember where you stopped. Here is what it is, why it works "
        "differently to everything you have been handed so far, and how to get in "
        "this weekend.",
        ST["cover_sub"]))
    story.append(Spacer(1, 150))
    story.append(Paragraph("A five-minute read · August 2026", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.app", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── 1. THE PROBLEM ───────────────────────────────────────────────────────
    story += section("Start here", "Try to name who wrote your notes")
    story.append(lead(
        "Open whatever you are revising from tonight and try to name the person who "
        "wrote it. Most students cannot."
    ))
    story.append(body(
        "A classmate sent them to you. They got them from someone in the year above, "
        "who got them from someone who graduated three years ago. Somewhere down that "
        "chain the pages were photocopied, screenshotted and forwarded so many times "
        "that the author is gone and so are four of the pages. Half of it is written in "
        "the shorthand people use at 2am for themselves, and the examples do not match "
        "what your lecturer taught this semester."
    ))
    story.append(body(
        "So the week before the exam you are building one clear understanding out of "
        "three people's handwriting, a textbook priced for somebody in another country, "
        "and a video made for a syllabus that is not yours. At eleven at night, when a "
        "sentence stops making sense, there is nobody to ask."
    ))
    story.append(fact(
        "That is not a discipline problem and it is not an intelligence problem. It is a "
        "materials problem. Nobody ever built you anything good to learn from."
    ))

    # ── 2. WHAT IT IS ────────────────────────────────────────────────────────
    story += section("What it is", "A course you read, not a folder you download")
    story.append(body(
        "Booklesss is one place you open on your phone. You pick a course, you get a "
        "list of steps, and each step is about ten minutes of reading written to be "
        "understood the first time rather than skimmed the night before. Nothing to "
        "install, nothing to lose in a WhatsApp thread. Close it on the bus and it opens "
        "on the same paragraph in your room."
    ))
    story.append(body(
        "Every step was written from scratch, in plain English, with the examples in "
        "kwacha and the companies ones you have heard of. Four courses are on it this "
        "weekend."
    ))
    story.append(table_std([
        ["Course", "Steps", "What it goes through"],
        ["Economics", "25",
         "Supply and demand, market structures, inflation, how people decide"],
        ["Corporate Finance", "25",
         "Time value of money, appraisal, cost of capital, capital structure"],
        ["Treasury Management", "21",
         "Liquidity and cash, funding, risk and hedging, controls"],
        ["Strategic Management", "7",
         "Environment analysis, competitive position, choosing a strategy"],
    ], [4.4 * cm, 1.4 * cm, CONTENT_W - 5.8 * cm]))
    story.append(body(
        "That is 78 steps already written, with more added every week. If you have sat "
        "one of those courses you know what a semester of it costs you in photocopying "
        "alone."
    ))

    # ── 3. WHY IT WORKS ──────────────────────────────────────────────────────
    story += section("Why it is different", "You cannot tick your way through it")
    story.append(body(
        "This is the part that matters, and it is the part no PDF and no group chat can "
        "do. Five things are built into the reading itself."
    ))

    story.append(h3("A section ends with a question, not a tick box"))
    story.append(body(
        "Finish a section and you are asked something about what you just read. Get it "
        "wrong the first time and you are told only that it was wrong, then sent back to "
        "the text. You are deliberately not shown the right answer, because then "
        "\"try again\" would just mean clicking the green one. Miss it twice and the "
        "answer and the reason are both shown, and you still have to pick it yourself to "
        "move on. <b>The tick is always earned.</b>"
    ))

    story.append(h3("Any word you do not know is one tap away"))
    story.append(body(
        "Words the material assumes you already own are underlined. Tap one and the "
        "definition appears beside it, then goes away. A definition sitting in brackets "
        "in the sentence is read by everyone, including the person who already knew the "
        "word, and it breaks the sentence for them every time. This way it is paid for "
        "only by the reader who needs it."
    ))

    story.append(h3("Every claim shows you where it came from"))
    story.append(body(
        "Under the paragraph that makes a claim sits a row of small chips naming the "
        "sources it rests on. Not a reading list at the end that nobody opens. Directly "
        "under the sentence, so you can see at a glance what a paragraph is standing on "
        "and go check it if you want to."
    ))

    story.append(h3("The study clock undercounts on purpose"))
    story.append(body(
        "Time only counts while the tab is actually in front of you and you have moved "
        "in the last minute. Leave a step open while you make tea and the clock stops. "
        "Read a long passage perfectly still and that minute is quietly lost. It is "
        "built to be too strict rather than too generous, because a study streak you can "
        "fake is worth nothing to you."
    ))

    story.append(h3("It asks you how the section read"))
    story.append(body(
        "Beside each checkpoint you can say how the writing landed. That goes straight "
        "into the next version of the step. Students who join this weekend are not "
        "reading a finished product, they are deciding what it becomes."
    ))
    story.append(fact(
        "Your progress is measured rather than claimed. What survives is what you can "
        "actually answer, which is also the only thing worth having in an exam hall."
    ))

    # ── 4. THE BIGGER IDEA ───────────────────────────────────────────────────
    story += section("The bigger idea", "Your timetable is not on the internet")
    story.append(body(
        "Building a course for every student in Zambia meant first finding out what "
        "every student is taught. Ten universities were checked properly, page by page, "
        "in the first week of August."
    ))
    story.append(body(
        "Seven of them publish no course list anywhere. Not a bad one. None. Programme "
        "names and entry requirements, and then nothing. Of the three that publish "
        "anything, one prints \"Coming soon\" on 98 of its 111 programme pages and "
        "another says \"No Course List Found\" on 106 of 107. <b>Nobody has written down "
        "what Zambian students are being taught.</b>"
    ))
    story.append(body(
        "So it is being written down by the students. When you sign up you are asked "
        "your university, your programme, your year, and the courses you are actually "
        "taking this semester. Where the timetable is known you tick it in about fifteen "
        "seconds. Where it is not, you type it, and what you type is offered to the next "
        "person on your programme."
    ))
    story.append(fact(
        "The first student on a programme types eight course names into an empty box. "
        "The fifth confirms a list better than anything the university has ever "
        "published."
    ))
    story.append(body(
        "602 distinct courses are mapped so far, deduped across campuses so that "
        "building one serves everybody who sits it. Four are built. The rest are ranked "
        "by how many students each would reach, which is how the order is decided. "
        "Signing up and putting your real timetable in is how yours moves up that list."
    ))

    # ── 5. WHERE IT GOES ─────────────────────────────────────────────────────
    story += section("Where it goes", "Passing is the entry point, not the point")
    story.append(body(
        "Every question you answer is a small piece of evidence that you can do a "
        "specific thing. Discount a cash flow. Read a hedge. Spot where a strategy is "
        "exposed. On their own they are checkpoints. Stacked up over two years they are "
        "something a line on a CV cannot be: proof, with a record behind it."
    ))
    story.append(body(
        "Where this is going is the most reliable place in the country for a business to "
        "find someone who can genuinely do the work, instead of someone who wrote that "
        "they can. That is not built yet and you should not join for it. It is being "
        "built in order, and the studying is the part that is ready now."
    ))

    # ── 6. HONEST ────────────────────────────────────────────────────────────
    story += section("Be clear about it", "What you are actually getting on Saturday")
    # The intro and its bullets are one block: a list that splits across a page
    # break leaves a single orphaned bullet under the heading.
    story.append(KeepTogether([
        body("Four courses is not your whole degree, so here is the plain version."),
        bullet("Four courses are live. If yours is not one of them, it is not there yet."),
        bullet("Steps are added every week, and the ones already up get rewritten when "
               "readers say they were unclear."),
        bullet("Something will break. You will be told when it does rather than finding "
               "it quietly fixed."),
        bullet("What you say about a section changes it. That is the whole point of "
               "joining in the first week."),
        Spacer(1, 6),
    ]))
    story.append(callout(
        "<b>If your course is not one of the four, come in anyway.</b>\n"
        "Sign up, put your real timetable in, and yours enters the queue with your name "
        "on the count. The order is decided by how many students ask for a course, and "
        "right now a single student moves a course several places."
    ))

    # ── 7. CTA ───────────────────────────────────────────────────────────────
    story += section("How to get in", "One word")
    story.append(body(
        "Booklesss opens this Saturday, 8 August. There is nothing to download, no card "
        "to enter, and it works on the phone you are reading this on."
    ))
    story.append(Spacer(1, 4))
    story.append(callout(
        "<b>Comment \"Booklesss\" under the post</b> and the link comes to you the "
        "morning it opens.\n"
        "That is it. First names on the list get first pick of the courses that get "
        "built next."
    ))
    story.append(body(
        "You have already done the hard part, which was showing up to the lectures. The "
        "only thing missing was something decent to read afterwards."
    ))

    doc.build(story)
    print(f"Written: {OUT_PATH}")


if __name__ == "__main__":
    build()
