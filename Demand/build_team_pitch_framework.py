#!/usr/bin/env python3
"""
Booklesss — Team Pitch Framework
General reference for pitching to any potential collaborator.
"""

from pathlib import Path
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, HRFlowable, KeepTogether, PageBreak
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
OUT   = HERE  / "Team_Pitch_Framework.pdf"

_grain = ImageReader(str(GRAIN)) if GRAIN.exists() else None
_logo  = ImageReader(str(LOGO))  if LOGO.exists()  else None


def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, str(FONTS / filename)))

_reg("Body",       "Aptos.ttf")
_reg("Body-Bold",  "Aptos-Bold.ttf")
_reg("Title-Bold", "Parastoo-Bold.ttf")

C_CREAM = colors.HexColor("#FFFEF2")
C_DARK  = colors.HexColor("#1C2526")
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
    canvas.setFillColor(C_STEEL)
    canvas.setFont("Body-Bold", 7)
    canvas.drawRightString(W - MX, H - 10*mm, "TEAM PITCH — FRAMEWORK")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.5)
    canvas.line(MX, 13*mm, W - MX, 13*mm)
    canvas.setFillColor(C_MIST)
    canvas.setFont("Body", 7)
    canvas.drawString(MX, 9*mm, "Booklesss | booklesss.framer.ai")
    canvas.drawRightString(W - MX, 9*mm, str(doc.page))
    canvas.restoreState()


def eb(text):
    return Paragraph(text, ParagraphStyle(
        "eb", fontName="Body-Bold", fontSize=7, leading=10,
        textColor=C_JADE, spaceBefore=14, spaceAfter=2, keepWithNext=1
    ))

def hd(text):
    return Paragraph(text, ParagraphStyle(
        "hd", fontName="Title-Bold", fontSize=15, leading=19,
        textColor=C_DARK, spaceAfter=3, keepWithNext=1
    ))

def hl():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_JADE,
                    spaceAfter=7, spaceBefore=3)
    hr.keepWithNext = 1
    return hr

def bd(text):
    return Paragraph(text, ParagraphStyle(
        "bd", fontName="Body", fontSize=10.5, leading=17,
        textColor=C_DARK, spaceAfter=3
    ))

def bl(text):
    return Paragraph(f"• {text}", ParagraphStyle(
        "bl", fontName="Body", fontSize=10.5, leading=17,
        textColor=C_DARK, leftIndent=14, spaceAfter=2
    ))

def note(text):
    return Paragraph(text, ParagraphStyle(
        "nt", fontName="Body", fontSize=9, leading=14,
        textColor=C_MIST, leftIndent=0, spaceAfter=2, spaceBefore=2
    ))

def label(text):
    return Paragraph(text, ParagraphStyle(
        "lb", fontName="Body-Bold", fontSize=8, leading=12,
        textColor=C_STEEL, spaceAfter=3, spaceBefore=8, keepWithNext=1
    ))


def build():
    frame = Frame(MX, MY + 8*mm, CONTENT_W, H - MY*2 - 22*mm, id="body")
    tmpl  = PageTemplate(id="body", frames=[frame], onPage=page_bg)
    doc   = BaseDocTemplate(str(OUT), pagesize=A4, pageTemplates=[tmpl])

    story = [Spacer(1, 3*mm)]

    # Title
    story.append(Paragraph("Team Pitch Framework", ParagraphStyle(
        "title", fontName="Title-Bold", fontSize=26, leading=30,
        textColor=C_DARK, spaceAfter=2
    )))
    story.append(Paragraph(
        "Use this structure for any conversation where you want someone to join the Booklesss team.",
        ParagraphStyle(
            "sub", fontName="Body", fontSize=9.5, leading=14,
            textColor=C_MIST, spaceAfter=10
        )
    ))
    story.append(HRFlowable(
        width="100%", thickness=2, color=C_JADE,
        spaceAfter=8, spaceBefore=0
    ))

    # SECTION 1 — Open on them
    story.append(KeepTogether([
        eb("STEP 1 — OPEN ON THEM"),
        hd("Acknowledge what they're already doing"),
        hl(),
        bd(
            "Start with what they're already good at — tutoring, making content, "
            "knowing a subject, helping students. Don't pitch Booklesss first. "
            "The opening line should make them feel like this conversation is about them, not you."
        ),
        label("EXAMPLE OPENER"),
        bd(
            "<i>\"You're already doing X. You already know this course / this space. "
            "I want to talk about doing that in a way that reaches more people.\"</i>"
        ),
        note("Swap X for whatever is true about that person. Tutor, content maker, student rep — adapt it."),
    ]))

    # SECTION 2 — What Booklesss is
    story.append(KeepTogether([
        eb("STEP 2 — THE PITCH"),
        hd("What Booklesss is — in under 30 seconds"),
        hl(),
        bd(
            "Booklesss is organized course material — properly written notes, "
            "step by step, delivered through Slack. Each topic connects to the next. "
            "Students work through it together in small channels."
        ),
        bd(
            "The problem it fixes: university notes are scattered and disconnected. "
            "Students spend more time hunting for material than actually studying it."
        ),
        label("PROOF IT'S REAL"),
        bl("Website is live — booklesss.framer.ai"),
        bl("Courses running: Strategic Management and Treasury Management (ZCAS)"),
        bl("Material is built and posted — this is not an idea, it's already going"),
    ]))

    # SECTION 3 — Role
    story.append(KeepTogether([
        eb("STEP 3 — THE ROLE"),
        hd("What you actually need from them"),
        hl(),
        bd(
            "Be specific about the role — vague invitations don't land. "
            "People say yes to a clear thing, not to \"being part of something.\""
        ),
        label("COMMON ROLE TYPES"),
        bl("<b>Subject expert / content partner</b> — knows the course, reviews and shapes the lessons"),
        bl("<b>Course tutor</b> — runs Q&A sessions or office hours inside the Slack community"),
        bl("<b>Demand / outreach</b> — gets the word out on campus, WhatsApp groups, student circles"),
        note("Pick one role per person. Don't offer everything — it reads as unclear."),
    ]))

    # SECTION 4 — What they get
    story.append(KeepTogether([
        eb("STEP 4 — THE UPSIDE"),
        hd("What they get out of it"),
        hl(),
        bd("Be honest. This is early. Don't oversell — it damages trust immediately."),
        bl("Income share as the student base grows — not a flat fee that resets"),
        bl("Early position means they own a piece of what gets built, not a role that can be replaced later"),
        bl("Their work turns into a product that keeps running — not session-by-session"),
        note("If they push for exact numbers, give the model: X students at Y per month, their share is Z%. "
             "Real numbers, not promises."),
    ]))

    # SECTION 5 — The ask
    story.append(KeepTogether([
        eb("STEP 5 — THE ASK"),
        hd("One thing. Low commitment. See if it works."),
        hl(),
        bd(
            "Don't ask for a big commitment in the first conversation. "
            "Ask for one small, clear thing and deliver on it. "
            "That builds trust faster than any pitch."
        ),
        label("HOW TO CLOSE"),
        bd(
            "<i>\"Start with one course / one task. "
            "We do that one thing well and see how it feels. "
            "If it makes sense, we go further. If it doesn't, nothing is lost.\"</i>"
        ),
    ]))

    # SECTION 6 — Hard questions
    story.append(PageBreak())
    story.append(Spacer(1, 4*mm))
    story.append(KeepTogether([
        eb("HANDLE THESE"),
        hd("Questions they will ask"),
        hl(),
    ]))

    qa = [
        (
            "\"How much money is this?\"",
            "Give the model, not a promise. "
            "Tell them what a student pays, how many students are in now, "
            "and what a realistic near-term number looks like. "
            "Don't invent a salary. Tell them it grows with the platform."
        ),
        (
            "\"How much time does this take?\"",
            "Be specific. Content review is a few hours per step. "
            "Tutoring is one session per week if they want it. "
            "Don't say \"not much\" — give an actual number they can plan around."
        ),
        (
            "\"Is this just your idea or is it actually running?\"",
            "Point them to the website and the active courses. "
            "Two courses are live, material is posted. That's the answer."
        ),
        (
            "\"Who else is involved?\"",
            "Be honest about where you are. "
            "Say you're building the team now and that's why you're talking to them. "
            "Don't pretend there's a team if there isn't one yet."
        ),
        (
            "\"Why me specifically?\"",
            "This is the most important one. Have a real answer — "
            "not \"because you're good at studying\" but because of something specific "
            "they do that the platform needs right now. That's what makes them say yes."
        ),
    ]

    for q, a in qa:
        story.append(KeepTogether([
            label(q),
            bd(a),
        ]))

    doc.build(story)
    print(f"Built: {OUT}")


if __name__ == "__main__":
    build()
