#!/usr/bin/env python3
"""
BOOKLESSS CAROUSEL TEMPLATE
────────────────────────────
To start a new carousel:
1. Copy this entire _template/ folder
2. Rename the copy → NN-your-slug/  (e.g. 02-what-booklesss-does/)
3. Rename this file → build_carousel_NN.py
4. Update OUT_NAME and TOTAL below
5. Edit the slide blocks inside build()
6. python3 build_carousel_NN.py

Type sizes:
  BIG  = 36pt Parastoo-Bold   — punchy 2–4 word lines
  BODY = 26pt Parastoo        — 1–3 sentence explanations
  Use _big() for hooks, _body() for explanations.
  Pass '' in a _body() list for a half-line gap.
  Keep each slide to 4–6 lines max.
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

OUT_NAME = "Carousel_NN.pdf"  # ← CHANGE THIS
TOTAL    = 6                   # ← CHANGE THIS (number of slides)
OUT      = HERE / OUT_NAME

# ── Fonts ─────────────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Parastoo-Bold", FONTS / "Parastoo-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Parastoo",      FONTS / "Parastoo.ttf"))
pdfmetrics.registerFont(TTFont("Aptos-Bold",    FONTS / "Aptos-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Aptos",         FONTS / "Aptos.ttf"))

# ── Palette ───────────────────────────────────────────────────────────────────
BG   = (1.0,        253/255, 232/255)
INK  = (0x12/255,  0x12/255, 0x12/255)
MID  = (0x3D/255,  0x3D/255, 0x3D/255)
SOFT = (0x5F/255,  0x6B/255, 0x65/255)
RULE = (0xC8/255,  0xC2/255, 0xB5/255)

# ── Geometry ──────────────────────────────────────────────────────────────────
W, H  = 108 * mm, 192 * mm
PAD   = 10 * mm
CT    = H - 34 * mm
CB    = 18 * mm
BIG   = 36
BODY  = 26
TINY  = 7
LD_BIG  = BIG  * 1.42
LD_BODY = BODY * 1.50


# ── Helpers (do not edit) ─────────────────────────────────────────────────────

def _bg(c, grain):
    c.setFillColorRGB(*BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    if grain:
        gw, gh = W * 1.6, H * 1.6
        ox, oy = -(gw - W) / 2, -(gh - H) / 2
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")


def _chrome(c, logo, n):
    LH, LW = 5 * mm, 5 * mm * 4.6
    if logo:
        c.drawImage(logo, PAD, H - PAD - LH,
                    width=LW, height=LH, mask="auto", preserveAspectRatio=True)
    label = f"{n} / {TOTAL}"
    tw = c.stringWidth(label, "Aptos-Bold", TINY)
    t  = c.beginText(W - PAD - tw, H - PAD - LH + 0.5 * mm)
    t.setFont("Aptos-Bold", TINY); t.setFillColorRGB(*SOFT); t.setCharSpace(0.8)
    t.textLine(label); c.drawText(t)
    hr = H - PAD - LH - 3 * mm
    c.setStrokeColorRGB(*RULE); c.setLineWidth(0.4)
    c.line(PAD, hr, W - PAD, hr)
    c.line(PAD, CB - 2 * mm, W - PAD, CB - 2 * mm)
    c.setFillColorRGB(*SOFT); c.setFont("Aptos", TINY)
    c.drawString(PAD, PAD + 2 * mm, "booklesss.framer.ai")


def _label(c, text, y):
    t = c.beginText(PAD, y)
    t.setFont("Aptos-Bold", TINY); t.setFillColorRGB(*SOFT); t.setCharSpace(1.8)
    t.textLine(text.upper()); c.drawText(t)
    return y - TINY * 1.4 - 5 * mm


def _big(c, lines, y):
    c.setFont("Parastoo-Bold", BIG); c.setFillColorRGB(*INK)
    for line in lines:
        c.drawString(PAD, y, line); y -= LD_BIG
    return y


def _body(c, lines, y):
    c.setFont("Parastoo", BODY); c.setFillColorRGB(*MID)
    for line in lines:
        if line == "":
            y -= LD_BODY * 0.5
        else:
            c.drawString(PAD, y, line); y -= LD_BODY
    return y


# ── Slides — EDIT BELOW ───────────────────────────────────────────────────────

def build():
    grain = ImageReader(str(BRAND / "grain.png"))                if (BRAND / "grain.png").exists()                else None
    logo  = ImageReader(str(BRAND / "booklesss-logo-black.png")) if (BRAND / "booklesss-logo-black.png").exists() else None

    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # ── 1 of N — HOOK ────────────────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 1)
    y = CT
    y = _label(c, "LABEL HERE", y)
    _big(c, [
        "Short punchy",
        "line here.",
    ], y)
    c.showPage()

    # ── 2 of N ───────────────────────────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 2)
    y = CT
    y = _label(c, "LABEL HERE", y)
    _body(c, [
        "Explanation line one.",
        "Explanation line two.",
        "",
        "After the gap.",
    ], y)
    c.showPage()

    # ── 3 of N — CTA (always last) ───────────────────────────────────────────
    _bg(c, grain); _chrome(c, logo, 3)
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
