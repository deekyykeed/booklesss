#!/usr/bin/env python3
"""
Booklesss — Video Script #01 SHORT: What is Booklesss?
~1.5 minutes. Three scenes, one continuous flow.
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
OUT   = HERE  / "Video_Script_01_Short.pdf"

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
CW     = PW - 2 * MARGIN


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
    canvas.drawRightString(PW - MARGIN, PH - 10 * mm, "VIDEO 01 — SHORT")
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
        "THE PROBLEM",
        [
            "You know that thing where you sit down with your notes, "
            "read the same paragraph a few times, "
            "and still only kind of get it? "
            "And somewhere in the back of your head "
            "you're thinking — maybe I'm just not good at this.",

            "The problem is not you. It's the notes.",

            "Those notes are probably older than you. "
            "They were never set up for you to read once and understand — "
            "you have to loop through them just to get the basic idea.",
        ]
    ),
    (
        "WHAT BOOKLESSS IS",
        [
            "I felt the same thing in school. "
            "So I started making my own notes instead — "
            "going online, reading from different places, "
            "putting it together in a way that actually made sense. "
            "And I felt like I was learning better.",

            "That's what Booklesss is. "
            "Notes that are properly researched, "
            "easy to follow on the first read, "
            "where everything connects. "
            "And you're joining a community of students "
            "working through the same material — "
            "not a WhatsApp group, "
            "just small focused channels "
            "where asking a question actually feels comfortable.",

            "I tried launching this before and it didn't go anywhere. "
            "I'm back now because I found a way to do it properly.",
        ]
    ),
    (
        "WHERE TO FIND IT",
        [
            "Jump onto Google and look for Booklesss. "
            "Three s's. "
            "B-O-O-K-L-E-S-S-S.",

            "And when you get there and sign up — "
            "you'll be in a space with people "
            "who are working through the exact same material as you. "
            "Same course, same questions, same point in the work. "
            "You won't be sitting with this on your own anymore.",
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
        borderPad=0,
    )

    story = []

    for i, (section_title, lines) in enumerate(SECTIONS):
        if i > 0:
            story.append(PageBreak())
        story.append(Spacer(1, 6 * mm))
        story.append(Paragraph(f"SCENE {i + 1}  —  {section_title}", label))
        story.append(Spacer(1, 2 * mm))
        for line in lines:
            story.append(Paragraph(line, speak))

    doc.build(story, onFirstPage=page_bg, onLaterPages=page_bg)
    print(f"Built: {OUT}")


if __name__ == "__main__":
    build()
