"""
Booklesss — "The Problem We're Solving"
A serious, problem-first essay: what Booklesss actually exists to solve.
Not a script, not an advert. Names the gap between being taught and being able
to learn, and what we are building to close it. Reflects the real platform.
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

OUT_DIR  = os.path.dirname(__file__)
OUT_PATH = os.path.join(OUT_DIR, "The Problem Booklesss Solves.pdf")

# ── STYLES ───────────────────────────────────────────────────────────────────
def make_styles():
    return {
        "cover_step": ParagraphStyle("cover_step",
            fontName="Body-Bold", fontSize=9, textColor=HEADING_DARK,
            leading=13, spaceAfter=0, alignment=TA_CENTER),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Title-Bold", fontSize=40, textColor=TITLE_DARK,
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
        "lead": ParagraphStyle("lead",
            fontName="Body", fontSize=12, textColor=C_INK,
            leading=19, spaceAfter=9, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Body", fontSize=10.5, textColor=C_INK,
            leading=17, spaceAfter=6, alignment=TA_LEFT),
        "fact": ParagraphStyle("fact",
            fontName="Body-Bold", fontSize=10.5, textColor=C_INK,
            leading=16, spaceAfter=6, alignment=TA_LEFT),
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
    canvas.drawRightString(W - MX, top_y, "WHY BOOKLESSS EXISTS")
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
    canvas.drawString(MX, H - MY + 7, "The Problem We're Solving")
    canvas.drawRightString(W - MX, H - MY + 7, "Booklesss")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFillColor(C_STEEL)
    _footer_left = "Booklesss | booklesss.framer.ai"
    canvas.drawString(MX, MY - 14, _footer_left)
    _tw = canvas.stringWidth(_footer_left, "Body", 7.5)
    canvas.linkURL("https://booklesss.framer.ai", (MX, MY - 16, MX + _tw, MY - 8))
    canvas.drawCentredString(W / 2, MY - 14, "Why Booklesss exists")
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
    story.append(Paragraph("BOOKLESSS · WHY WE EXIST", ST["cover_step"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("The Problem We're Solving", ST["cover_title"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(
        "Studying is harder than it needs to be. Not because the work itself is hard, "
        "but because everything you need is scattered, and the way we study has not kept "
        "up. This is about making it simple.",
        ST["cover_sub"]))
    story.append(Spacer(1, 196))
    story.append(Paragraph("A short read · July 2026", ST["cover_meta"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ST["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── STUDYING IS HARDER THAN IT NEEDS TO BE ───────────────────────────────
    story += section("The problem", "Studying is harder than it needs to be")
    story.append(lead(
        "Most students never stop to question one thing: studying takes far more effort than "
        "the actual learning does."
    ))
    story.append(body(
        "Before you understand a single idea, you have to gather your material, work out what "
        "matters, put it in some kind of order, and find a way through it. The real work, the "
        "understanding, only begins after all of that. Most of your energy goes into the setup, "
        "not the learning."
    ))
    story.append(body(
        "That is what Booklesss is built around. Not that studying is hard, but that we have "
        "quietly made it harder than it needs to be."
    ))

    # ── THE WAY WE STUDY HASN'T KEPT UP ──────────────────────────────────────
    story += section("What changed, and what didn't", "The way we study has stood still")
    story.append(body(
        "Almost everything about being a student has moved on. How you talk to people, how you "
        "find things out, how you get things done, all of it has changed. Studying has not. It "
        "still looks much the way it did decades ago: a stack of material, worked through on "
        "your own, held in your head, and hoped to stick."
    ))
    story.append(body(
        "Your notes might be perfectly good. They might also be a few years old, with nobody "
        "keeping them current. Either way, notes on a page can only do so much. They cannot "
        "show you where you are, answer you when you have a question, or move you on to what "
        "comes next. They sit still, and the rest is left to you."
    ))

    # ── EVERYTHING IN ONE PLACE ──────────────────────────────────────────────
    story += section("The idea", "Everything in one place")
    story.append(body(
        "Booklesss begins by bringing everything together. One place to read, to follow, and "
        "to study from, laid out in the order that actually makes sense. No hunting across "
        "folders, chats and tabs for the piece you need. It is all here, in sequence, so you "
        "can simply start."
    ))
    story.append(body(
        "Each topic is broken into small steps that lead into the next, so the course holds "
        "together as one clear line instead of a scattered pile. You always know where you "
        "are, and what comes after."
    ))

    # ── MATERIAL THAT WORKS WITH YOU ─────────────────────────────────────────
    story += section("What makes it different", "Material that works with you")
    story.append(body(
        "Then the material stops sitting still. On Booklesss, what you are reading responds to you."
    ))
    story.append(body(
        "Meet a word or an idea you do not know, and you can tap it to have it explained right "
        "there, without leaving the page. Have a question, and you can ask it and get an answer, "
        "instead of writing it in a margin and moving on. There is an AI you can talk to about "
        "what you are reading, and people working through the same material alongside you. The "
        "page stops being something you read at, and becomes something you can work with."
    ))
    story.append(body(
        "And it keeps your place, so studying feels like moving forward instead of starting over "
        "each time you sit down."
    ))

    # ── MAKING STUDYING EASY ─────────────────────────────────────────────────
    story += section("The point", "Making studying simple")
    story.append(body(
        "None of this is about doing the work for you. It is about clearing away everything that "
        "gets in the way of it, so the effort you spend goes into understanding, not into setup. "
        "The old way of studying quietly stopped serving students some time ago; this is an "
        "attempt to put that right."
    ))
    story.append(fact(
        "That is the whole aim of Booklesss: to make studying simple. Everything in one place, "
        "in the right order, that you can actually talk to."
    ))
    story.append(body(
        "It is being built now. You can find it by searching <b>Booklesss</b> on Google, spelled "
        "with three S's."
    ))
    story.append(lead(
        "Come and see what studying feels like when everything is finally in one place, and it "
        "works with you."
    ))

    doc.build(story)
    print(f"\nPDF saved to:\n  {os.path.abspath(OUT_PATH)}\n")


if __name__ == "__main__":
    build()
