#!/usr/bin/env python3
"""
BOOKLESSS CAROUSEL TEMPLATE
────────────────────────────
1. Copy this entire _template/ folder
2. Rename the copy → NN-your-slug/  (e.g. 02-what-booklesss-is/)
3. Rename this file → build_carousel_NN.py
4. Update OUT_NAME and TOTAL below
5. Edit the slide() calls inside build()
6. python3 build_carousel_NN.py

One slide = one slide() call:
  slide(c, grain, logo, n, "LABEL", big=[...], body=[...])

Type scale:
  big  — 40 pt Parastoo-Bold  — punchy 2–4 word lines (hook, reveal, CTA)
  body — 28 pt Parastoo       — short explanation, 3–6 lines max
  label — 7 pt Aptos-Bold tracked — eyebrow above every block

Line length guide:
  big  — keep lines under 13 chars
  body — keep lines under 18 chars
  Pass '' in a body list for a half-line gap.

Lines that run long are auto-shrunk to fit the column, but that breaks the
type scale across slides — treat the shrink as a safety net, not a licence.
Content is optically centred in the live zone; no manual y positions.
"""

from pathlib import Path
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE  = Path(__file__).resolve().parent
ROOT  = HERE.parent.parent.parent
BRAND = ROOT / "Brand"
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
LIVE_W = W - 2 * PAD
TINY  =  7
BIG   = 40
BODY  = 28

LIVE_TOP = H - 20 * mm
LIVE_BOT = 16 * mm


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

def _big(c, lines, y, size):
    ld = size * 1.45
    c.setFont("Parastoo-Bold", size); c.setFillColorRGB(*INK)
    for line in lines:
        c.drawString(PAD, y, line); y -= ld
    return y

def _body(c, lines, y, size):
    ld = size * 1.55
    c.setFont("Parastoo", size); c.setFillColorRGB(*MID)
    for line in lines:
        if line == "": y -= ld * 0.5
        else: c.drawString(PAD, y, line); y -= ld
    return y

def _fit(lines, font, size):
    """Largest size ≤ `size` at which every line fits the column."""
    if not lines:
        return size
    maxw = max(pdfmetrics.stringWidth(l, font, size) for l in lines if l)
    return size if maxw <= LIVE_W else size * LIVE_W / maxw


def slide(c, grain, logo, n, label, big=None, body=None, gap=6 * mm):
    """Draw one slide: eyebrow label + optional big block + optional body block,
    optically centred in the live zone. Content never runs past the column."""
    big, body = big or [], body or []
    big_size  = _fit(big,  "Parastoo-Bold", BIG)
    body_size = _fit(body, "Parastoo",      BODY)
    ld_big, ld_body = big_size * 1.45, body_size * 1.55

    # Visual height: label cap-top → last baseline → descender. Mirrors the
    # draw calls below; trailing leading after the last line is NOT height.
    h = TINY * 0.7 + TINY * 1.4 + 8 * mm          # label cap + gap to first baseline
    if big:
        h += (len(big) - 1) * ld_big
    if body:
        if big:
            h += ld_big + gap
        h += sum(ld_body * (0.5 if l == "" else 1.0) for l in body) - ld_body
    h += (body_size if body else big_size) * 0.25  # descender below last baseline

    spare = (LIVE_TOP - LIVE_BOT) - h
    top   = LIVE_TOP - max(spare, 0) * 0.45        # optical centre, slightly high

    _bg(c, grain); _chrome(c, logo, n)
    y = _label(c, label, top - TINY * 0.7)
    if big:
        y = _big(c, big, y, big_size)
        if body:
            y -= gap
    if body:
        _body(c, body, y, body_size)
    c.showPage()


# ── SLIDES — edit below this line ─────────────────────────────────────────────

def build():
    grain = ImageReader(str(BRAND / "grain.png"))                if (BRAND / "grain.png").exists()                else None
    logo  = ImageReader(str(BRAND / "booklesss-wordmark-black.png")) if (BRAND / "booklesss-wordmark-black.png").exists() else None

    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # 1 / N — HOOK: 2–4 big lines, max 13 chars each
    slide(c, grain, logo, 1, "LABEL HERE",
          big=["Short punchy", "hook here."])

    # 2 / N — BODY: max 18 chars per line, '' = half-line gap
    slide(c, grain, logo, 2, "LABEL HERE",
          body=["Short explanation",
                "line by line.",
                "",
                "After the gap."])

    # 3 / N — CTA (always last)
    slide(c, grain, logo, 3, "START HERE",
          big=["booklesss", ".framer.ai"],
          body=["ZCAS · UNZA", "students."])

    c.save()
    print(f"Built: {OUT}  ({TOTAL} slides)")


if __name__ == "__main__":
    build()
