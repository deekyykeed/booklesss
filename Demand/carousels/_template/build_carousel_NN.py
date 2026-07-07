#!/usr/bin/env python3
"""
BOOKLESSS CAROUSEL TEMPLATE
────────────────────────────
1. Copy this entire _template/ folder
2. Rename the copy → NN-your-slug/  (e.g. 02-what-booklesss-is/)
3. Rename this file → build_carousel_NN.py
4. Update OUT_NAME and TOTAL below
5. Edit the slide blocks inside build()
6. python3 build_carousel_NN.py

Type scale:
  _big()   — 40 pt Parastoo-Bold  — punchy 2–4 word lines (hook, reveal, CTA)
  _body()  — 28 pt Parastoo       — short explanation, 3–5 lines max
  _label() — 7 pt Aptos-Bold tracked — eyebrow above every block

Line length guide (max chars to stay inside the column):
  _big()   — keep lines under 13 chars
  _body()  — keep lines under 18 chars
  Pass ''  in a _body() list for a half-line gap.

Content is auto-centred vertically — no manual y positions needed.
Just call _vcenter() with the total block height, then draw.
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

OUT_NAME = "Carousel_NN.pdf"   # ← CHANGE THIS (e.g. "Carousel_02.pdf")
TOTAL    = 3                    # ← CHANGE THIS (number of slides)
OUT      = HERE / OUT_NAME

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
TINY  =  7
BIG   = 40
BODY  = 28
LD_BIG  = BIG  * 1.45
LD_BODY = BODY * 1.55

LIVE_TOP = H - 20 * mm
LIVE_BOT = 16 * mm


# ── Height estimators ─────────────────────────────────────────────────────────

def _h_label():
    return TINY * 1.4 + 8 * mm

def _h_big(lines):
    return len(lines) * LD_BIG

def _h_body(lines):
    return sum(LD_BODY * (0.5 if l == "" else 1.0) for l in lines)

def _vcenter(block_h):
    """Returns y for the top of a content block, optically centred in live zone."""
    spare = (LIVE_TOP - LIVE_BOT) - block_h
    return LIVE_TOP - max(spare, 0) * 0.42


# ── Draw helpers (do not edit) ────────────────────────────────────────────────

def _bg(c, grain):
    c.setFillColorRGB(*BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    if grain:
        gw, gh = W * 1.6, H * 1.6
        ox, oy = -(gw - W) / 2, -(gh - H) / 2
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")

def _chrome(c, logo, n):
    LH = 5 * mm; LW = LH * 4.6
    if logo:
        c.drawImage(logo, PAD, H - PAD - LH,
                    width=LW, height=LH, mask="auto", preserveAspectRatio=True)
    lbl = f"{n} / {TOTAL}"
    tw  = c.stringWidth(lbl, "Aptos-Bold", TINY)
    t   = c.beginText(W - PAD - tw, H - PAD - LH + 0.5 * mm)
    t.setFont("Aptos-Bold", TINY); t.setFillColorRGB(*SOFT); t.setCharSpace(0.8)
    t.textLine(lbl); c.drawText(t)
    c.setStrokeColorRGB(*RULE); c.setLineWidth(0.4)
    c.line(PAD, H - PAD - LH - 3 * mm, W - PAD, H - PAD - LH - 3 * mm)
    c.line(PAD, LIVE_BOT - 2 * mm, W - PAD, LIVE_BOT - 2 * mm)
    c.setFillColorRGB(*SOFT); c.setFont("Aptos", TINY)
    c.drawString(PAD, PAD + 2 * mm, "booklesss.framer.ai")

def _label(c, text, y):
    t = c.beginText(PAD, y)
    t.setFont("Aptos-Bold", TINY); t.setFillColorRGB(*SOFT); t.setCharSpace(1.8)
    t.textLine(text.upper()); c.drawText(t)
    return y - TINY * 1.4 - 8 * mm

def _big(c, lines, y):
    c.setFont("Parastoo-Bold", BIG); c.setFillColorRGB(*INK)
    for line in lines: c.drawString(PAD, y, line); y -= LD_BIG
    return y

def _body(c, lines, y):
    c.setFont("Parastoo", BODY); c.setFillColorRGB(*MID)
    for line in lines:
        if line == "": y -= LD_BODY * 0.5
        else: c.drawString(PAD, y, line); y -= LD_BODY
    return y


# ── SLIDES — edit below this line ─────────────────────────────────────────────

def build():
    grain = ImageReader(str(BRAND / "grain.png"))                if (BRAND / "grain.png").exists()                else None
    logo  = ImageReader(str(BRAND / "booklesss-logo-black.png")) if (BRAND / "booklesss-logo-black.png").exists() else None

    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # ── 1 / N — HOOK ─────────────────────────────────────────────────────────
    bl = ["Short punchy", "hook here."]       # ← 2–4 lines, max 13 chars each
    _bg(c, grain); _chrome(c, logo, 1)
    y = _vcenter(_h_label() + _h_big(bl))
    y = _label(c, "LABEL HERE", y)            # ← eyebrow label
    _big(c, bl, y)
    c.showPage()

    # ── 2 / N — BODY ─────────────────────────────────────────────────────────
    bo = [
        "Short explanation",     # ← max 18 chars per line
        "line by line.",
        "",                      # ← half-line gap
        "After the gap.",
    ]
    _bg(c, grain); _chrome(c, logo, 2)
    y = _vcenter(_h_label() + _h_body(bo))
    y = _label(c, "LABEL HERE", y)
    _body(c, bo, y)
    c.showPage()

    # ── 3 / N — CTA (always last) ────────────────────────────────────────────
    bl  = ["booklesss", ".framer.ai"]
    bo  = ["ZCAS · UNZA", "students."]
    gap = 6 * mm
    _bg(c, grain); _chrome(c, logo, 3)
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
