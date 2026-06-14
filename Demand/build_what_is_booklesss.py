#!/usr/bin/env python3
"""
Booklesss — What Is Booklesss
External one-pager. Send to tutors or anyone asking what this is.
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
OUT   = HERE  / "What Is Booklesss.pdf"

_grain = ImageReader(str(GRAIN)) if GRAIN.exists() else None
_logo  = ImageReader(str(LOGO))  if LOGO.exists()  else None


def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, str(FONTS / filename)))

_reg("Body",       "Aptos.ttf")
_reg("Body-Bold",  "Aptos-Bold.ttf")
_reg("Title-Bold", "Parastoo-Bold.ttf")

C_CREAM = colors.HexColor("#FFFEF2")
C_DARK  = colors.HexColor("#121212")
C_JADE  = colors.HexColor("#2FB99A")
C_STEEL = colors.HexColor("#5F6B65")
C_MIST  = colors.HexColor("#6E6A5E")
C_RULE  = colors.HexColor("#E0DACB")

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
    canvas.setStrokeColor(C_DARK)
    canvas.setLineWidth(1.5)
    canvas.line(MX, H - 14*mm, W - MX, H - 14*mm)
    if _logo:
        lh = 5.5 * mm
        lw = lh * 4.6
        canvas.drawImage(_logo, MX, H - 13*mm, width=lw, height=lh, mask="auto")
    canvas.setFillColor(C_MIST)
    canvas.setFont("Body", 7)
    canvas.drawRightString(W - MX, H - 10*mm, "booklesss.framer.ai")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.5)
    canvas.line(MX, 13*mm, W - MX, 13*mm)
    canvas.setFillColor(C_MIST)
    canvas.setFont("Body", 7)
    canvas.drawString(MX, 9*mm, "Booklesss")
    canvas.drawRightString(W - MX, 9*mm, str(doc.page))
    canvas.restoreState()


def eb(text):
    return Paragraph(text, ParagraphStyle(
        "eb", fontName="Body-Bold", fontSize=7, leading=10,
        textColor=C_JADE, spaceBefore=16, spaceAfter=2, keepWithNext=1
    ))

def hd(text):
    return Paragraph(text, ParagraphStyle(
        "hd", fontName="Title-Bold", fontSize=15, leading=20,
        textColor=C_DARK, spaceAfter=3, keepWithNext=1
    ))

def hl():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_JADE,
                    spaceAfter=8, spaceBefore=3)
    hr.keepWithNext = 1
    return hr

def bd(text):
    return Paragraph(text, ParagraphStyle(
        "bd", fontName="Body", fontSize=10.5, leading=17,
        textColor=C_DARK, spaceAfter=4
    ))

def bl(text):
    return Paragraph(f"• {text}", ParagraphStyle(
        "bl", fontName="Body", fontSize=10.5, leading=17,
        textColor=C_DARK, leftIndent=14, spaceAfter=3
    ))


def section(eyebrow_text, heading_text, items):
    return KeepTogether([eb(eyebrow_text), hd(heading_text), hl()] + items)


def build():
    frame = Frame(MX, MY + 8*mm, CONTENT_W, H - MY*2 - 22*mm, id="body")
    tmpl  = PageTemplate(id="body", frames=[frame], onPage=page_bg)
    doc   = BaseDocTemplate(str(OUT), pagesize=A4, pageTemplates=[tmpl])

    story = [Spacer(1, 4*mm)]

    # Title block
    story.append(Paragraph("What Is Booklesss", ParagraphStyle(
        "title", fontName="Title-Bold", fontSize=30, leading=34,
        textColor=C_DARK, spaceAfter=4
    )))
    story.append(Paragraph("Old notes. New understanding.", ParagraphStyle(
        "tag", fontName="Body", fontSize=11, leading=15,
        textColor=C_JADE, spaceAfter=12
    )))
    story.append(HRFlowable(
        width="100%", thickness=2, color=C_JADE,
        spaceAfter=4, spaceBefore=0
    ))

    # SECTION 1 — The problem
    story.append(section(
        "THE PROBLEM",
        "University material that was never written to be understood",
        [
            bd(
                "Zambian university students are studying from course material that is years — "
                "sometimes decades — old. It was written for a different era. Nothing connects "
                "to anything else. Students spend more time figuring out what matters than "
                "actually learning it."
            ),
            bd(
                "The problem is not that lecturers are careless. "
                "The problem is that the material is just old — and no one has rebuilt it."
            ),
        ]
    ))

    # SECTION 2 — What Booklesss is
    story.append(section(
        "WHAT BOOKLESSS IS",
        "Independently researched course notes. Built from scratch.",
        [
            bd(
                "Booklesss researches each course topic from current, reliable sources — "
                "not a reformat of lecture slides. The notes are written to be understood, "
                "structured so each topic connects to the next, and delivered step by step "
                "through Slack."
            ),
            bd(
                "By the time a student finishes a course, it makes sense as a whole thing — "
                "not just a pile of topics they memorized to survive the exam."
            ),
        ]
    ))

    # SECTION 3 — How it works
    story.append(section(
        "HOW IT WORKS",
        "One course. Step by step. Everything in one place.",
        [
            bl("Each course is broken into lessons. Each lesson is a set of clearly written steps."),
            bl("Steps are delivered as PDFs through dedicated Slack channels — one channel per lesson."),
            bl(
                "Students work through the material together. "
                "The channel keeps the conversation focused on that topic."
            ),
            bl("Everything is mobile-first. Students access it on their phones, whenever they need it."),
        ]
    ))

    # SECTION 4 — For tutors
    story.append(section(
        "FOR TUTORS",
        "Your knowledge. Built into something that lasts.",
        [
            bd(
                "If you already tutor students in a course, you know what the exam actually tests "
                "and where students get stuck. That knowledge is exactly what Booklesss is built on."
            ),
            bl("You help shape the lessons — what goes in, what order, what matters for the exam."),
            bl("You review the material for accuracy before it goes to students."),
            bl(
                "Your work turns into a product that runs every semester — "
                "not a session that resets."
            ),
            bl("You earn as students join, not a flat rate that doesn't grow."),
        ]
    ))

    # SECTION 5 — Where it is now
    story.append(section(
        "WHERE IT IS NOW",
        "Live. Running. Being built.",
        [
            bl("Website: booklesss.framer.ai"),
            bl("Active courses: Strategic Management and Treasury Management — ZCAS"),
            bl("Course material is built and posted. Students are in."),
            bd(
                "This is not an idea waiting to launch. "
                "It is running, and the next phase is bringing the right people in "
                "to build it further."
            ),
        ]
    ))

    doc.build(story)
    print(f"Built: {OUT}")


if __name__ == "__main__":
    build()
