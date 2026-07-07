#!/usr/bin/env python3
"""
Booklesss carousel 01 — Your notes are older than you.
9:16 (108mm × 192mm). One page = one slide.
Run: python3 build_carousel_01.py
Output: Carousel_01.pdf (in this folder)
"""

from pathlib import Path
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE  = Path(__file__).resolve().parent
ROOT  = HERE.parent.parent.parent      # → Booklesss/
BRAND = ROOT / "_dev" / "brand"
FONTS = ROOT / "_dev" / "fonts"
OUT   = HERE / "Carousel_01.pdf"

TOTAL = 6   # ← update if you add/remove slides

# ── Fonts ─────────────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Parastoo-Bold", FONTS / "Parastoo-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Parastoo",      FONTS / "Parastoo.ttf"))
pdfmetrics.registerFont(TTFont("Aptos-Bold",    FONTS / "Aptos-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Aptos",         FONTS / "Aptos.ttf"))

# ── Palette ───────────────────────────────────────────────────────────────────
BG   = (1.0,        253/255, 232/255)    # #FFFDE8 cream
INK  = (0x12/255,  0x12/255, 0x12/255)  # #121212
MID  = (0x3D/255,  0x3D/255, 0x3D/255)  # #3D3D3D
SOFT = (0x5F/255,  0x6B/255, 0x65/255)  # #5F6B65
RULE = (0xC8/255,  0xC2/255, 0xB5/255)

# ── Geometry ──────────────────────────────────────────────────────────────────
W, H  = 108 * mm, 192 * mm
PAD   = 10 * mm
CT    = H - 34 * mm    # content top (below header rule)
CB    = 18 * mm        # content bottom (above footer rule)

# ── Type sizes (points) ───────────────────────────────────────────────────────
BIG   = 36             # hook / punchy lines
BODY  = 26             # explanatory text
TINY  = 7              # labels, footer

LD_BIG  = BIG  * 1.42  # ~51pt leading
LD_BODY = BODY * 1.50  # ~39pt leading


# ── Shared helpers ────────────────────────────────────────────────────────────

def _bg(c, grain):
    c.setFillColorRGB(*BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    if grain:
        gw, gh = W * 1.6, H * 1.6
        ox, oy = -(gw - W) / 2, -(gh - H) / 2
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")


def _chrome(c, logo, n):
    """Header (logo + counter + rule) and footer (URL + rule) on every slide."""
    LH, LW = 5 * mm, 5 * mm * 4.6
    if logo:
        c.drawImage(logo, PAD, H - PAD - LH,
                    width=LW, height=LH, mask="auto", preserveAspectRatio=True)

    # Slide counter — top right
    label = f"{n} / {TOTAL}"
    tw = c.stringWidth(label, "Aptos-Bold", TINY)
    t  = c.beginText(W - PAD - tw, H - PAD - LH + 0.5 * mm)
    t.setFont("Aptos-Bold", TINY)
    t.setFillColorRGB(*SOFT)
    t.setCharSpace(0.8)
    t.textLine(label)
    c.drawText(t)

    # Header rule
    hr = H - PAD - LH - 3 * mm
    c.setStrokeColorRGB(*RULE)
    c.setLineWidth(0.4)
    c.line(PAD, hr, W - PAD, hr)

    # Footer rule + URL
    c.line(PAD, CB - 2 * mm, W - PAD, CB - 2 * mm)
    c.setFillColorRGB(*SOFT)
    c.setFont("Aptos", TINY)
    c.drawString(PAD, PAD + 2 * mm, "booklesss.framer.ai")


def _label(c, text, y):
    """Tracked-caps eyebrow. Returns y after the label + gap."""
    t = c.beginText(PAD, y)
    t.setFont("Aptos-Bold", TINY)
    t.setFillColorRGB(*SOFT)
    t.setCharSpace(1.8)
    t.textLine(text.upper())
    c.drawText(t)
    return y - TINY * 1.4 - 5 * mm


def _big(c, lines, y):
    """36pt Parastoo-Bold. Returns y below the last line."""
    c.setFont("Parastoo-Bold", BIG)
    c.setFillColorRGB(*INK)
    for line in lines:
        c.drawString(PAD, y, line)
        y -= LD_BIG
    return y


def _body(c, lines, y):
    """26pt Parastoo regular. Returns y below the last line.
    Pass '' for a half-line blank gap."""
    c.setFont("Parastoo", BODY)
    c.setFillColorRGB(*MID)
    for line in lines:
        if line == "":
            y -= LD_BODY * 0.5
        else:
            c.drawString(PAD, y, line)
            y -= LD_BODY
    return y


# ── Build ─────────────────────────────────────────────────────────────────────

def build():
    grain = ImageReader(str(BRAND / "grain.png"))                if (BRAND / "grain.png").exists()                else None
    logo  = ImageReader(str(BRAND / "booklesss-logo-black.png")) if (BRAND / "booklesss-logo-black.png").exists() else None

    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # ── 1 of 6 — Hook ────────────────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 1)
    y = CT
    y = _label(c, "ZCAS  ·  UNZA", y)
    _big(c, [
        "Your notes",
        "are probably",
        "older than",
        "you.",
    ], y)
    c.showPage()

    # ── 2 of 6 — The problem ─────────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 2)
    y = CT
    y = _label(c, "THE PROBLEM", y)
    _big(c, [
        "Old slides.",
        "Scattered files.",
        "Nothing connects.",
    ], y)
    c.showPage()

    # ── 3 of 6 — What it costs ───────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 3)
    y = CT
    y = _label(c, "WHAT THAT COSTS", y)
    _body(c, [
        "Every semester you patch it",
        "together from five different",
        "sources.",
        "",
        "You still walk into the exam",
        "unsure.",
    ], y)
    c.showPage()

    # ── 4 of 6 — The fix ─────────────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 4)
    y = CT
    y = _label(c, "THE FIX", y)
    y = _big(c, ["Rebuilt.", "From scratch."], y)
    y -= 5 * mm
    _body(c, [
        "Every topic. Written to make",
        "sense on the first read.",
        "Not lifted from old slides.",
    ], y)
    c.showPage()

    # ── 5 of 6 — Community ───────────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 5)
    y = CT
    y = _label(c, "YOU'RE NOT ALONE", y)
    _body(c, [
        "Small Slack channels.",
        "One topic at a time.",
        "Students at the same point",
        "in the work as you.",
    ], y)
    c.showPage()

    # ── 6 of 6 — CTA ─────────────────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 6)
    y = CT
    y = _label(c, "START HERE", y)
    y = _big(c, ["booklesss", ".framer.ai"], y)
    y -= 5 * mm
    _body(c, ["ZCAS and UNZA students."], y)
    c.showPage()

    c.save()
    print(f"Built: {OUT}  ({TOTAL} slides)")


if __name__ == "__main__":
    build()
