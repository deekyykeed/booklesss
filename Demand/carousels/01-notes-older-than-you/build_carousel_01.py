#!/usr/bin/env python3
"""
Booklesss carousel 01 — Your notes are older than you.
9:16 (108mm × 192mm). One page = one slide.
Run: python3 build_carousel_01.py
"""

from pathlib import Path
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE  = Path(__file__).resolve().parent
ROOT  = HERE.parent.parent.parent
BRAND = ROOT / "_dev" / "brand"
FONTS = ROOT / "_dev" / "fonts"
OUT   = HERE / "Carousel_01.pdf"

TOTAL = 6

pdfmetrics.registerFont(TTFont("Parastoo-Bold", FONTS / "Parastoo-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Parastoo",      FONTS / "Parastoo.ttf"))
pdfmetrics.registerFont(TTFont("Aptos-Bold",    FONTS / "Aptos-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Aptos",         FONTS / "Aptos.ttf"))

BG   = (1.0,       253/255, 232/255)
INK  = (0x12/255, 0x12/255, 0x12/255)
MID  = (0x3D/255, 0x3D/255, 0x3D/255)
SOFT = (0x5F/255, 0x6B/255, 0x65/255)
RULE = (0xC8/255, 0xC2/255, 0xB5/255)

W, H  = 108 * mm, 192 * mm
PAD   = 10 * mm
TINY  =  7          # label / footer size (pt)
BIG   = 40          # punchy headline (pt)
BODY  = 28          # explanatory text (pt)
LD_BIG  = BIG  * 1.45   # ~58 pt  — room between headline lines
LD_BODY = BODY * 1.55   # ~43 pt  — room between body lines

# Live zone: between the header rule and the footer rule
LIVE_TOP = H - 20 * mm   # ~547 pt from bottom  (20 mm from top)
LIVE_BOT = 16 * mm        # ~45 pt from bottom


# ── Height estimators (keep in sync with draw functions) ──────────────────────

def _h_label():
    """Height consumed by a label + its gap below."""
    return TINY * 1.4 + 8 * mm

def _h_big(lines):
    return len(lines) * LD_BIG

def _h_body(lines):
    return sum(LD_BODY * (0.5 if l == "" else 1.0) for l in lines)


def _vcenter(block_h):
    """Y for the top of a content block, placed at optical centre (bias 0.42)."""
    live_h = LIVE_TOP - LIVE_BOT
    spare  = live_h - block_h
    # If content is taller than live zone, pin to top; otherwise bias upward.
    return LIVE_TOP - max(spare, 0) * 0.42


# ── Shared draw helpers ───────────────────────────────────────────────────────

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
    LH = 5 * mm
    LW = LH * 4.6
    if logo:
        c.drawImage(logo, PAD, H - PAD - LH,
                    width=LW, height=LH, mask="auto", preserveAspectRatio=True)
    lbl = f"{n} / {TOTAL}"
    tw  = c.stringWidth(lbl, "Aptos-Bold", TINY)
    t   = c.beginText(W - PAD - tw, H - PAD - LH + 0.5 * mm)
    t.setFont("Aptos-Bold", TINY); t.setFillColorRGB(*SOFT); t.setCharSpace(0.8)
    t.textLine(lbl); c.drawText(t)
    # header rule
    c.setStrokeColorRGB(*RULE); c.setLineWidth(0.4)
    c.line(PAD, H - PAD - LH - 3 * mm, W - PAD, H - PAD - LH - 3 * mm)
    # footer rule + URL
    c.line(PAD, LIVE_BOT - 2 * mm, W - PAD, LIVE_BOT - 2 * mm)
    c.setFillColorRGB(*SOFT); c.setFont("Aptos", TINY)
    c.drawString(PAD, PAD + 2 * mm, "booklesss.framer.ai")


def _label(c, text, y):
    """7 pt tracked-caps eyebrow. Returns y below the label + gap."""
    t = c.beginText(PAD, y)
    t.setFont("Aptos-Bold", TINY); t.setFillColorRGB(*SOFT); t.setCharSpace(1.8)
    t.textLine(text.upper()); c.drawText(t)
    return y - TINY * 1.4 - 8 * mm


def _big(c, lines, y):
    """40 pt Parastoo-Bold. Returns y below the last line."""
    c.setFont("Parastoo-Bold", BIG); c.setFillColorRGB(*INK)
    for line in lines:
        c.drawString(PAD, y, line); y -= LD_BIG
    return y


def _body(c, lines, y):
    """28 pt Parastoo. Pass '' for a half-line gap. Returns y below last line."""
    c.setFont("Parastoo", BODY); c.setFillColorRGB(*MID)
    for line in lines:
        if line == "":
            y -= LD_BODY * 0.5
        else:
            c.drawString(PAD, y, line); y -= LD_BODY
    return y


# ── Slides ────────────────────────────────────────────────────────────────────

def build():
    grain = ImageReader(str(BRAND / "grain.png"))                if (BRAND / "grain.png").exists()                else None
    logo  = ImageReader(str(BRAND / "booklesss-logo-black.png")) if (BRAND / "booklesss-logo-black.png").exists() else None

    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # ── 1 / 6 — Hook ─────────────────────────────────────────────────────────
    bl = ["Your notes", "are probably", "older than", "you."]
    _bg(c, grain); _chrome(c, logo, 1)
    y = _vcenter(_h_label() + _h_big(bl))
    y = _label(c, "ZCAS  ·  UNZA", y)
    _big(c, bl, y)
    c.showPage()

    # ── 2 / 6 — The problem ──────────────────────────────────────────────────
    bl = ["Old slides.", "Old files.", "All of it."]
    _bg(c, grain); _chrome(c, logo, 2)
    y = _vcenter(_h_label() + _h_big(bl))
    y = _label(c, "THE PROBLEM", y)
    _big(c, bl, y)
    c.showPage()

    # ── 3 / 6 — What it costs ────────────────────────────────────────────────
    bo = [
        "Every semester,",
        "you patch it",
        "from five files.",
        "",
        "Walk in unsure.",
    ]
    _bg(c, grain); _chrome(c, logo, 3)
    y = _vcenter(_h_label() + _h_body(bo))
    y = _label(c, "WHAT THAT COSTS", y)
    _body(c, bo, y)
    c.showPage()

    # ── 4 / 6 — The fix ──────────────────────────────────────────────────────
    bl = ["Rebuilt.", "From scratch."]
    bo = ["Every topic.", "Written to click", "on the first read."]
    gap = 6 * mm
    _bg(c, grain); _chrome(c, logo, 4)
    y = _vcenter(_h_label() + _h_big(bl) + gap + _h_body(bo))
    y = _label(c, "THE FIX", y)
    y = _big(c, bl, y)
    y -= gap
    _body(c, bo, y)
    c.showPage()

    # ── 5 / 6 — Community ────────────────────────────────────────────────────
    bo = [
        "Small channels.",
        "One topic each.",
        "",
        "Students where",
        "you are.",
    ]
    _bg(c, grain); _chrome(c, logo, 5)
    y = _vcenter(_h_label() + _h_body(bo))
    y = _label(c, "YOU'RE NOT ALONE", y)
    _body(c, bo, y)
    c.showPage()

    # ── 6 / 6 — CTA ──────────────────────────────────────────────────────────
    bl = ["booklesss", ".framer.ai"]
    bo = ["ZCAS · UNZA", "students."]
    gap = 6 * mm
    _bg(c, grain); _chrome(c, logo, 6)
    y = _vcenter(_h_label() + _h_big(bl) + gap + _h_body(bo))
    y = _label(c, "START HERE", y)
    y = _big(c, bl, y)
    y -= gap
    _body(c, bo, y)
    c.showPage()

    c.save()
    print(f"Built: {OUT}  ({TOTAL} slides)")


if __name__ == "__main__":
    build()
