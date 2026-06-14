#!/usr/bin/env python3
"""
Booklesss — Duncan Pitch Sheet
Reference sheet for the call. One page.
"""

from pathlib import Path
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, HRFlowable, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm, mm
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
OUT   = HERE  / "Duncan_Pitch.pdf"

_grain = ImageReader(str(GRAIN)) if GRAIN.exists() else None
_logo  = ImageReader(str(LOGO))  if LOGO.exists()  else None


def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, str(FONTS / filename)))

_reg("Body",       "Aptos.ttf")
_reg("Body-Bold",  "Aptos-Bold.ttf")
_reg("Title-Bold", "Parastoo-Bold.ttf")

C_CREAM = colors.HexColor("#FFFEF2")
C_DARK  = colors.HexColor("#1C2526")
C_GOLD  = colors.HexColor("#F59E0B")
C_STEEL = colors.HexColor("#5F6B65")

W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX


def page_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_CREAM)
    canvas.rect(0, 0, W, H, stroke=0, fill=1)
    if _grain:
        gw, gh = W * 1.6, H * 1.6
        ox, oy = -(gw - W) / 2, -(gh - H) / 2
        canvas.drawImage(_grain, ox, oy, width=gw, height=gh, mask="auto")
        canvas.drawImage(_grain, ox, oy, width=gw, height=gh, mask="auto")
    # Header line + logo
    canvas.setStrokeColor(C_DARK)
    canvas.setLineWidth(1.5)
    canvas.line(MX, H - 14*mm, W - MX, H - 14*mm)
    if _logo:
        lh = 5.5 * mm
        lw = lh * 4.6
        canvas.drawImage(_logo, MX, H - 13*mm, width=lw, height=lh, mask="auto")
    canvas.setFillColor(C_STEEL)
    canvas.setFont("Body-Bold", 7)
    canvas.drawRightString(W - MX, H - 10*mm, "TEAM PITCH")
    # Footer line
    canvas.setStrokeColor(C_DARK)
    canvas.setLineWidth(0.5)
    canvas.line(MX, 13*mm, W - MX, 13*mm)
    canvas.setFillColor(C_STEEL)
    canvas.setFont("Body", 7)
    canvas.drawString(MX, 9*mm, "Booklesss | booklesss.framer.ai")
    canvas.restoreState()


def s_eyebrow(text):
    return Paragraph(text, ParagraphStyle(
        "eb", fontName="Body-Bold", fontSize=7, leading=10,
        textColor=C_GOLD, spaceBefore=12, spaceAfter=2, keepWithNext=1
    ))

def s_heading(text):
    return Paragraph(text, ParagraphStyle(
        "hd", fontName="Title-Bold", fontSize=15, leading=19,
        textColor=C_DARK, spaceAfter=3, keepWithNext=1
    ))

def s_hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_GOLD,
                    spaceAfter=7, spaceBefore=3)
    hr.keepWithNext = 1
    return hr

def s_body(text):
    return Paragraph(text, ParagraphStyle(
        "bd", fontName="Body", fontSize=10.5, leading=17,
        textColor=C_DARK, spaceAfter=3
    ))

def s_bullet(text):
    return Paragraph(f"• {text}", ParagraphStyle(
        "bl", fontName="Body", fontSize=10.5, leading=17,
        textColor=C_DARK, leftIndent=14, spaceAfter=2
    ))


SECTIONS = [
    (
        "WHAT HE'S ALREADY DOING",
        "His knowledge is the asset",
        [
            s_body(
                "He's already tutoring students one-on-one in his former course. "
                "He knows what the exam tests, where people get stuck, and what the "
                "official notes don't explain. Right now that knowledge disappears after each session."
            ),
        ]
    ),
    (
        "WHAT BOOKLESSS IS",
        "In one sentence",
        [
            s_body(
                "Properly written course notes, broken into steps, delivered through Slack — "
                "so each topic connects to the next and students actually understand the material, not just memorize it."
            ),
        ]
    ),
    (
        "WHAT THE ROLE ACTUALLY IS",
        "Subject knowledge. Nothing else.",
        [
            s_bullet("Shape the lesson content — what goes in, in what order"),
            s_bullet("Flag what the exam actually focuses on"),
            s_bullet("Review drafts to make sure nothing is wrong or missing"),
            s_body("No coding. No design. Just the course knowledge he already has."),
        ]
    ),
    (
        "WHAT HE GETS",
        "Early position, not a favour",
        [
            s_bullet("Income share as students join — not a flat tutoring rate"),
            s_bullet("His knowledge builds into something permanent instead of resetting every semester"),
            s_bullet("First person in on a course that is being built right now"),
        ]
    ),
    (
        "THE ASK",
        "One course. See if it works.",
        [
            s_body(
                "Start with one course. Build one set of lessons together. "
                "If it makes sense, go further. If it doesn't, nothing is lost. "
                "That's the whole conversation."
            ),
        ]
    ),
]


def build():
    frame = Frame(MX, MY + 8*mm, CONTENT_W, H - MY*2 - 22*mm, id="body")
    tmpl  = PageTemplate(id="body", frames=[frame], onPage=page_bg)
    doc   = BaseDocTemplate(str(OUT), pagesize=A4, pageTemplates=[tmpl])

    story = [Spacer(1, 3*mm)]

    story.append(Paragraph("Duncan — Why Booklesss", ParagraphStyle(
        "title", fontName="Title-Bold", fontSize=26, leading=30,
        textColor=C_DARK, spaceAfter=2
    )))
    story.append(Paragraph("Reference for the call", ParagraphStyle(
        "sub", fontName="Body", fontSize=9, leading=13,
        textColor=C_STEEL, spaceAfter=10
    )))
    story.append(HRFlowable(
        width="100%", thickness=2, color=C_GOLD,
        spaceAfter=6, spaceBefore=0
    ))

    for eb, hd, items in SECTIONS:
        block = [s_eyebrow(eb), s_heading(hd), s_hairline()] + items
        story.append(KeepTogether(block))

    doc.build(story)
    print(f"Built: {OUT}")


if __name__ == "__main__":
    build()
