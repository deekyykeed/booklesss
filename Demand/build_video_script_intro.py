#!/usr/bin/env python3
"""
Booklesss — Video Script #01: What is Booklesss?
Simple talking-to-a-friend script. Big text, no structure labels.
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
OUT   = HERE  / "Video_Script_01_What_Is_Booklesss.pdf"

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

    # Top bar: thin dark rule
    canvas.setStrokeColor(DARK)
    canvas.setLineWidth(1.5)
    canvas.line(MARGIN, PH - 14 * mm, PW - MARGIN, PH - 14 * mm)

    # Logo
    if _logo is not None:
        lh = 5.5 * mm
        lw = lh * 4.6
        canvas.drawImage(_logo, MARGIN, PH - 13 * mm,
                         width=lw, height=lh, mask="auto")

    # "VIDEO 01" top right
    canvas.setFillColor(MID)
    canvas.setFont("Aptos", 7)
    canvas.drawRightString(PW - MARGIN, PH - 10 * mm, "VIDEO 01 — INTRO")

    # Bottom rule + page
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
        "THE HOOK",
        [
            "You know that thing where you sit down with your notes, "
            "read the same paragraph three or four times, "
            "and still only kind of get it? "
            "And somewhere in the back of your head "
            "you're thinking — maybe I'm just not good at this.",

            "The problem is not you. It's the notes.",

            "I felt the same thing.",

            "Those notes are probably older than you. "
            "They are not set up for you to read once and understand. "
            "You have to go through them a couple of times "
            "just to get the basic idea of what's being said.",

            "And that's what I'm trying to fix.",
        ]
    ),
    (
        "HOW BOOKLESSS STARTED",
        [
            "At some point I started making my own notes "
            "and pretty much stopped going back to the old ones. "
            "I'd go online, look things up, "
            "read around the topic from different places. "
            "And I felt I was learning better — "
            "because the notes I was writing for myself, "
            "and the way they were structured, "
            "were actually more engaging "
            "than the boring gray notes we were given.",

            "So I started doing that a lot. "
            "And at some point I started Booklesss. "
            "I tried launching it a couple of years ago "
            "and it didn't really go anywhere. "
            "But the reason I'm bringing it back is "
            "because I found a way to do it. "
            "A way that doesn't have too much friction — "
            "where a student can come in "
            "and actually understand what's going on. "
            "And it's achieving what it's supposed to achieve. "
            "Much better than before.",
        ]
    ),
    (
        "WHAT WE ACTUALLY DO",
        [
            "The notes on Booklesss are better researched. "
            "We pull from multiple trusted sources online — "
            "things that are current and actually well written. "
            "And they're put together in a way that's easy to follow "
            "on the first read.",

            "And everything connects. "
            "Each step leads into the next. "
            "By the time you finish the course, "
            "it all holds together as one thing.",

            "We cover almost all the courses. "
            "There's a good chance yours is already in there. "
            "And if it's not, it's probably coming.",
        ]
    ),
    (
        "THE COMMUNITY — AND WHY NOT WHATSAPP",
        [
            "But the part I care about just as much as the notes "
            "is the community side.",

            "And I'll say this now — it's nothing like a WhatsApp group.",

            "Most study groups end up on WhatsApp because everyone's already there. "
            "I get that. "
            "But if you've been in one of those groups, "
            "you know what happens. "
            "Everything goes into one place. "
            "The assignment, the memes, "
            "the stuff that has nothing to do with anything — "
            "it all becomes noise. You just tune out.",

            "WhatsApp has Communities now, fair enough. "
            "But it doesn't fix the real problem. "
            "The real problem is about where your head is when you're studying. "
            "When you're trying to understand something, "
            "the people you want around you "
            "are the people in exactly the same place as you. "
            "Not two hundred people from the whole course. "
            "Just the ones working through the same thing right now.",

            "And there's something else. "
            "Asking a question in front of two hundred people "
            "feels uncomfortable. "
            "You hold back. You might just not ask. "
            "But in a small channel of maybe fifteen people "
            "who are all on the same chapter — you just ask. "
            "That's a completely different thing.",

            "That's how Booklesss is set up. "
            "Each lesson has its own channel. "
            "You're not talking to the whole course — "
            "you're in the right room, with the right people, "
            "at the right point in the material. "
            "And there's someone in each of those spaces "
            "who knows that content well and is there to help. "
            "A WhatsApp group just can't do that.",
        ]
    ),
    (
        "ACCOUNTABILITY",
        [
            "You know how you tell yourself you're going to study, "
            "and then a week goes by and nothing has happened? "
            "I don't think that's a discipline problem. "
            "I think it's an environment problem. "
            "You just don't have the right people around you "
            "to actually keep going.",

            "When you join Booklesss, you set your own goals — "
            "how much you're putting in, what you want to get through, "
            "how many days a week you're committing to. "
            "And the community holds you to that. "
            "There's something about being around people "
            "who are showing up and who expect you to as well — "
            "it actually changes how you study.",
        ]
    ),
    (
        "THE POINTS THING",
        [
            "One more thing. "
            "If you're a full member, it's possible "
            "to get your money back — or pay a lot less "
            "than what you signed up for. "
            "You earn points for showing up, for taking part, "
            "for hitting the goals you set. "
            "And those points convert into real value. "
            "I've done the math on it. It works.",
        ]
    ),
    (
        "WHERE TO FIND IT",
        [
            "Jump onto Google and look for Booklesss. "
            "Three s's. "
            "B-O-O-K-L-E-S-S-S.",
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
