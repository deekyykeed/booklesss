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

Type system — two clearly separated voices per slide:
  big  — 44 pt Parastoo-Bold, leading 1.15 — the statement. Tight block,
         poster energy. EVERY slide leads with one. 1–4 lines.
  body — 18 pt Parastoo, leading 1.45 — the supporting line. Small on
         purpose; it explains, it never competes. 1–4 lines, optional.
  label — 7 pt Aptos-Bold tracked caps — eyebrow above the block.

Line length guide:
  big  — a line renders at 44 pt if it fits; the whole block shrinks to the
         widest line otherwise. Keep every line ≤ 11 chars-ish so slides stay
         in the 41–44 pt band. Never let one long line drag a block small.
  body — keep lines under 28 chars. Pass '' for a half-line gap.

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

W, H   = 108 * mm, 192 * mm
PAD    = 10 * mm
LIVE_W = W - 2 * PAD
TINY   =  7
BIG    = 44          # display statement
BODY   = 18          # supporting line — small on purpose
K_BIG  = 1.15        # display leading factor: tight, block reads as one unit
K_BODY = 1.45        # body leading factor

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

def _big(c, lines, y, size):
    ld = size * K_BIG
    c.setFont("Parastoo-Bold", size); c.setFillColorRGB(*INK)
    for line in lines:
        c.drawString(PAD, y, line); y -= ld
    return y

def _body(c, lines, y, size):
    ld = size * K_BODY
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


def slide(c, grain, logo, n, label, big=None, body=None, gap=8 * mm):
    """Draw one slide: eyebrow label + big statement + optional supporting body,
    optically centred in the live zone. Content never runs past the column."""
    big, body = big or [], body or []
    big_size  = _fit(big,  "Parastoo-Bold", BIG)
    body_size = _fit(body, "Parastoo",      BODY)
    ld_big, ld_body = big_size * K_BIG, body_size * K_BODY

    # Gap from label baseline to the first baseline must clear the display
    # ascenders (Parastoo caps reach ~0.72 em above the baseline).
    first_gap = (big_size if big else body_size) * 0.72 + 12

    # Visual height: label cap-top → last baseline → descender. Mirrors the
    # draw calls below; trailing leading after the last line is NOT height.
    h = TINY * 0.7 + first_gap                     # label cap + gap to first baseline
    if big:
        h += (len(big) - 1) * ld_big
    if body:
        if big:
            h += ld_big + gap
        h += sum(ld_body * (0.5 if l == "" else 1.0) for l in body) - ld_body
    h += (body_size if body else big_size) * 0.25  # descender below last baseline

    spare = (LIVE_TOP - LIVE_BOT) - h
    top   = LIVE_TOP - max(spare, 0) * 0.44        # optical centre, slightly high

    _bg(c, grain); _chrome(c, logo, n)
    _label(c, label, top - TINY * 0.7)
    y = top - TINY * 0.7 - first_gap
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
    logo  = ImageReader(str(BRAND / "booklesss-logo-black.png")) if (BRAND / "booklesss-logo-black.png").exists() else None

    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # 1 / N — HOOK: big statement only
    slide(c, grain, logo, 1, "LABEL HERE",
          big=["Short", "punchy", "hook."])

    # 2 / N — POINT: big statement + small supporting line
    slide(c, grain, logo, 2, "LABEL HERE",
          big=["The point,", "stated big."],
          body=["One or two quiet lines that", "explain it. Max 28 chars each."])

    # 3 / N — CTA (always last)
    slide(c, grain, logo, 3, "START HERE",
          big=["booklesss", ".framer.ai"],
          body=["ZCAS · UNZA students."])

    c.save()
    print(f"Built: {OUT}  ({TOTAL} slides)")


if __name__ == "__main__":
    build()
