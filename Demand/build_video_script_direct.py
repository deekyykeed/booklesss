#!/usr/bin/env python3
"""
Booklesss — Video Script #02: Try Booklesss
Direct pitch to the viewer. "Imagine if..." angle.
~1.5 minutes.
"""

from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE  = Path(__file__).resolve().parent
ROOT  = HERE.parent
BRAND = ROOT / "_dev" / "brand"
FONTS = ROOT / "_dev" / "fonts"
GRAIN = BRAND / "grain.png"
LOGO  = BRAND / "booklesss-logo-black.png"
OUT   = HERE  / "Video_Script_02_Direct.pdf"

_grain = ImageReader(str(GRAIN)) if GRAIN.exists() else None
_logo  = ImageReader(str(LOGO))  if LOGO.exists()  else None

pdfmetrics.registerFont(TTFont("Parastoo",      FONTS / "Parastoo.ttf"))
pdfmetrics.registerFont(TTFont("Parastoo-Bold", FONTS / "Parastoo-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Aptos",         FONTS / "Aptos.ttf"))
pdfmetrics.registerFont(TTFont("Aptos-Bold",    FONTS / "Aptos-Bold.ttf"))

DARK  = colors.HexColor("#1C2526")
MID   = colors.HexColor("#6B7280")
CREAM = colors.HexColor("#FFFEF2")

PW, PH = A4
MARGIN = 24 * mm


def page_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, PW, PH, stroke=0, fill=1)
    if _grain is not None:
        gw, gh = PW * 1.6, PH * 1.6
        ox, oy = -(gw - PW) / 2, -(gh - PH) / 2
        canvas.drawImage(_grain, ox, oy, width=gw, height=gh, mask="auto")
        canvas.drawImage(_grain, ox, oy, width=gw, height=gh, mask="auto")
    canvas.setStrokeColor(DARK)
    canvas.setLineWidth(1.5)
    canvas.line(MARGIN, PH - 14 * mm, PW - MARGIN, PH - 14 * mm)
    if _logo is not None:
        lh = 5.5 * mm
        lw = lh * 4.6
        canvas.drawImage(_logo, MARGIN, PH - 13 * mm, width=lw, height=lh, mask="auto")
    canvas.setFillColor(MID)
    canvas.setFont("Aptos", 7)
    canvas.drawRightString(PW - MARGIN, PH - 10 * mm, "VIDEO 02 — DIRECT")
    canvas.setStrokeColor(DARK)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 13 * mm, PW - MARGIN, 13 * mm)
    canvas.setFillColor(MID)
    canvas.setFont("Aptos", 7)
    canvas.drawString(MARGIN, 9 * mm, "booklesss.framer.ai")
    canvas.drawRightString(PW - MARGIN, 9 * mm, str(doc.page))
    canvas.restoreState()


SECTIONS = [
    (
        "THE PICTURE",
        [
            "Imagine if everything you needed for your course "
            "was actually organized. "
            "Not scattered across slides that don't connect. "
            "Properly structured, properly written, "
            "easy to follow from start to finish.",

            "That's not how most university material works. "
            "And I think you know that. "
            "The notes are all over the place. "
            "Things don't connect to each other. "
            "You're left figuring out what matters on your own.",
        ]
    ),
    (
        "WHAT BOOKLESSS IS",
        [
            "Booklesss is the organized version "
            "of what you're already trying to study. "
            "Notes that are researched and written properly. "
            "Each topic connects to the next. "
            "By the time you get to your exam, "
            "it all makes sense as one thing — "
            "not just pieces you memorized.",

            "And you're not doing it alone. "
            "There's a community of students "
            "working through the exact same material — "
            "small channels, the right people, "
            "exactly where you are in the work.",
        ]
    ),
    (
        "WHERE TO FIND IT",
        [
            "Jump onto Google and look for Booklesss. "
            "Three s's. "
            "B-O-O-K-L-E-S-S-S.",

            "You won't be on your own with this anymore.",
        ]
    ),
]


def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN + 6 * mm,
        bottomMargin=MARGIN,
    )

    speak = ParagraphStyle(
        "speak",
        fontName="Parastoo",
        fontSize=17,
        leading=28,
        textColor=DARK,
        spaceAfter=6 * mm,
    )
    label = ParagraphStyle(
        "label",
        fontName="Aptos-Bold",
        fontSize=8,
        leading=11,
        textColor=DARK,
        spaceAfter=2 * mm,
    )

    story = []
    for i, (title, lines) in enumerate(SECTIONS):
        if i > 0:
            story.append(PageBreak())
        story.append(Spacer(1, 6 * mm))
        story.append(Paragraph(f"SCENE {i + 1}  —  {title}", label))
        story.append(Spacer(1, 2 * mm))
        for line in lines:
            story.append(Paragraph(line, speak))

    doc.build(story, onFirstPage=page_bg, onLaterPages=page_bg)
    print(f"Built: {OUT}")


if __name__ == "__main__":
    build()
