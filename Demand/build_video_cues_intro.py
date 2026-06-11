#!/usr/bin/env python3
"""
Booklesss — Video Cue Cards #01: What is Booklesss?
Bullet prompts to riff around. Each scene on its own page.
"""

from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable
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
OUT   = HERE  / "Video_Cues_01_What_Is_Booklesss.pdf"

_grain = ImageReader(str(GRAIN)) if GRAIN.exists() else None
_logo  = ImageReader(str(LOGO))  if LOGO.exists()  else None

pdfmetrics.registerFont(TTFont("Parastoo",      FONTS / "Parastoo.ttf"))
pdfmetrics.registerFont(TTFont("Parastoo-Bold", FONTS / "Parastoo-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Aptos",         FONTS / "Aptos.ttf"))
pdfmetrics.registerFont(TTFont("Aptos-Bold",    FONTS / "Aptos-Bold.ttf"))

DARK  = colors.HexColor("#1C2526")
MID   = colors.HexColor("#6B7280")
LIGHT = colors.HexColor("#D1D5DB")
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
    canvas.drawRightString(PW - MARGIN, PH - 10 * mm, "VIDEO 01 — CUE CARDS")
    canvas.setStrokeColor(DARK)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 13 * mm, PW - MARGIN, 13 * mm)
    canvas.setFillColor(MID)
    canvas.setFont("Aptos", 7)
    canvas.drawString(MARGIN, 9 * mm, "booklesss.framer.ai")
    canvas.drawRightString(PW - MARGIN, 9 * mm, str(doc.page))
    canvas.restoreState()


# Each scene: (title, anchor_phrase_or_None, [prompt, ...])
# anchor = the one line to land. prompts = broad territories to explore, not exact lines.
SCENES = [
    (
        "THE HOOK",
        "The problem is not you. It's the notes.",
        [
            "Reading the same paragraph three or four times — still only kind of get it",
            "Self-doubt creeping in: maybe I'm just not smart enough for this",
            "Those notes are probably older than you",
            "Not set up to be understood on one read",
            "That's what I'm here to fix",
        ]
    ),
    (
        "HOW BOOKLESSS STARTED",
        "I felt like I was learning better.",
        [
            "Started making my own notes — stopped going back to the old ones",
            "Went online, looked things up from different places",
            "My notes were more engaging than the boring gray ones we were given",
            "Started Booklesss a couple of years ago — tried launching, didn't land",
            "Back now with a simpler approach — less friction, actually works",
        ]
    ),
    (
        "WHAT WE ACTUALLY DO",
        "Everything connects.",
        [
            "Researched properly from multiple trusted sources",
            "Current, well-written — easy to follow on the first read",
            "Each step flows into the next",
            "By the end of the course, it all holds together as one thing",
            "Covers almost all courses — good chance yours is in there",
        ]
    ),
    (
        "THE COMMUNITY — AND WHY NOT WHATSAPP",
        "It's nothing like a WhatsApp group.",
        [
            "WhatsApp is convenient — but everything becomes noise fast",
            "Communities feature exists, still doesn't fix the real problem",
            "Real problem: you want people in exactly the same place as you",
            "Asking in front of 200 people vs. 15 people on the same chapter",
            "Each lesson has its own channel — right room, right people, right moment",
        ]
    ),
    (
        "ACCOUNTABILITY",
        "It's not a discipline problem. It's an environment problem.",
        [
            "Tell yourself you'll study — week goes by, nothing happened",
            "You don't have the right people around you",
            "Set goals when you join — community holds you to them",
        ]
    ),
    (
        "THE POINTS THING",
        "You can get your money back.",
        [
            "Earn points for showing up, taking part, hitting your goals",
            "Points convert to real value",
            "Done the math on it — it works",
        ]
    ),
    (
        "WHERE TO FIND IT",
        "Jump onto Google and look for Booklesss.",
        [
            "Three s's — that part matters",
            "B-O-O-K-L-E-S-S-S",
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

    s_num = ParagraphStyle(
        "s_num",
        fontName="Aptos-Bold",
        fontSize=7,
        leading=10,
        textColor=MID,
        spaceAfter=1 * mm,
    )
    s_title = ParagraphStyle(
        "s_title",
        fontName="Parastoo-Bold",
        fontSize=20,
        leading=26,
        textColor=DARK,
        spaceAfter=5 * mm,
    )
    s_anchor = ParagraphStyle(
        "s_anchor",
        fontName="Parastoo-Bold",
        fontSize=13,
        leading=20,
        textColor=DARK,
        leftIndent=5 * mm,
        borderColor=DARK,
        borderWidth=0.5,
        borderPad=4 * mm,
        borderRadius=0,
        spaceAfter=7 * mm,
    )
    s_bullet = ParagraphStyle(
        "s_bullet",
        fontName="Parastoo",
        fontSize=17,
        leading=28,
        textColor=DARK,
        leftIndent=4 * mm,
        spaceAfter=3 * mm,
    )

    story = []

    for i, (title, anchor, bullets) in enumerate(SCENES):
        if i > 0:
            story.append(PageBreak())
        story.append(Spacer(1, 6 * mm))
        story.append(Paragraph(f"SCENE {i + 1}", s_num))
        story.append(Paragraph(title, s_title))
        if anchor:
            story.append(Paragraph(f"“{anchor}”", s_anchor))
        story.append(Spacer(1, 2 * mm))
        for b in bullets:
            story.append(Paragraph(f"– {b}", s_bullet))

    doc.build(story, onFirstPage=page_bg, onLaterPages=page_bg)
    print(f"Built: {OUT}")


if __name__ == "__main__":
    build()
