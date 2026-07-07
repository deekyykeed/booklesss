#!/usr/bin/env python3
"""
Booklesss social media ad.
108mm × 192mm (9:16) — Stories / Reels format.
Cream paper + black only — no colour accents.
Output: Demand/Booklesss_Social_Ad.pdf
"""

from pathlib import Path
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE  = Path(__file__).resolve().parent
ROOT  = HERE.parent.parent
BRAND = ROOT / "_dev" / "brand"
FONTS = ROOT / "_dev" / "fonts"
OUT   = HERE.parent / "Booklesss_Social_Ad.pdf"

# ── Fonts ─────────────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Parastoo-Bold", FONTS / "Parastoo-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Parastoo",      FONTS / "Parastoo.ttf"))
pdfmetrics.registerFont(TTFont("Aptos",         FONTS / "Aptos.ttf"))
pdfmetrics.registerFont(TTFont("Aptos-Bold",    FONTS / "Aptos-Bold.ttf"))

# ── Palette: cream + black only ───────────────────────────────────────────────
BG      = (1.0,        253  / 255, 232  / 255)  # #FFFDE8 warm cream
INK     = (0x12 / 255, 0x12 / 255, 0x12 / 255) # #121212 headline / logo
HEADING = (0x3D / 255, 0x3D / 255, 0x3D / 255) # #3D3D3D sub-headings
BODY    = (0x5F / 255, 0x6B / 255, 0x65 / 255) # #5F6B65 body / secondary
RULE    = (0xC8 / 255, 0xC2 / 255, 0xB5 / 255) # warm grey rule

# ── Page geometry (9:16 Stories / Reels) ─────────────────────────────────────
W   = 108 * mm   # 1080px at 96dpi equivalent
H   = 192 * mm   # 1920px
PAD = 10 * mm


def build():
    grain     = ImageReader(str(BRAND / "grain.png"))                if (BRAND / "grain.png").exists()                else None
    logo_blk  = ImageReader(str(BRAND / "booklesss-logo-black.png")) if (BRAND / "booklesss-logo-black.png").exists() else None
    mark_blk  = ImageReader(str(BRAND / "booklesss-mark-black.png")) if (BRAND / "booklesss-mark-black.png").exists() else None

    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # ── Background ────────────────────────────────────────────────────────────
    c.setFillColorRGB(*BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    if grain:
        gw, gh = W * 1.6, H * 1.6
        ox, oy = -(gw - W) / 2, -(gh - H) / 2
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")
        c.drawImage(grain, ox, oy, width=gw, height=gh, mask="auto")

    # ── Logo (top-left) ───────────────────────────────────────────────────────
    LOGO_H = 6 * mm
    LOGO_W = LOGO_H * 4.6
    if logo_blk:
        c.drawImage(logo_blk, PAD, H - PAD - LOGO_H,
                    width=LOGO_W, height=LOGO_H,
                    mask="auto", preserveAspectRatio=True)

    # ── Course tag (top-right, body grey) ─────────────────────────────────────
    TAG = "ZCAS  \xb7  UNZA"
    tw  = c.stringWidth(TAG, "Aptos-Bold", 6.5)
    t   = c.beginText(W - PAD - tw, H - PAD - LOGO_H + 0.5 * mm)
    t.setFont("Aptos-Bold", 6.5)
    t.setFillColorRGB(*BODY)
    t.setCharSpace(1.0)
    t.textLine(TAG)
    c.drawText(t)

    # ── Headline — sits in the upper third, large and bold ────────────────────
    # 9:16 is tall — headline in top 40%, support in middle, CTA at bottom
    c.setFillColorRGB(*INK)
    c.setFont("Parastoo-Bold", 32)
    LINE_GAP = 14 * mm
    HL_TOP   = H - 48 * mm   # first baseline from bottom

    c.drawString(PAD, HL_TOP,              "Your notes")
    c.drawString(PAD, HL_TOP - LINE_GAP,   "are probably")
    c.drawString(PAD, HL_TOP - 2*LINE_GAP, "older than you.")

    # ── Warm rule ─────────────────────────────────────────────────────────────
    RULE_Y = HL_TOP - 2 * LINE_GAP - 10 * mm
    c.setStrokeColorRGB(*RULE)
    c.setLineWidth(0.6)
    c.line(PAD, RULE_Y, W - PAD, RULE_Y)

    # ── Positioning line (tracked caps) ───────────────────────────────────────
    t2 = c.beginText(PAD, RULE_Y - 9 * mm)
    t2.setFont("Aptos-Bold", 7)
    t2.setFillColorRGB(*HEADING)
    t2.setCharSpace(1.2)
    t2.textLine("OLD NOTES. NEW UNDERSTANDING.")
    c.drawText(t2)

    # ── Support text ──────────────────────────────────────────────────────────
    c.setFillColorRGB(*BODY)
    c.setFont("Aptos", 8.5)
    c.drawString(PAD, RULE_Y - 20 * mm, "Study notes rebuilt from scratch.")
    c.drawString(PAD, RULE_Y - 30 * mm, "Built to make sense on the first read.")
    c.drawString(PAD, RULE_Y - 40 * mm, "ZCAS and UNZA students.")

    # ── Diamond mark — centred in the lower space ─────────────────────────────
    MARK_SZ = 22 * mm
    if mark_blk:
        mx = (W - MARK_SZ) / 2
        my = PAD + 30 * mm
        c.drawImage(mark_blk, mx, my,
                    width=MARK_SZ, height=MARK_SZ,
                    mask="auto", preserveAspectRatio=True)

    # ── URL (ink, bottom-centre) ──────────────────────────────────────────────
    c.setFillColorRGB(*INK)
    c.setFont("Aptos-Bold", 8.5)
    URL   = "booklesss.framer.ai"
    url_w = c.stringWidth(URL, "Aptos-Bold", 8.5)
    ux    = (W - url_w) / 2
    c.drawString(ux, PAD + 14 * mm, URL)
    c.linkURL("https://booklesss.framer.ai",
              (ux, PAD + 11 * mm, ux + url_w, PAD + 21 * mm))

    c.showPage()
    c.save()
    print("Built: " + str(OUT))


if __name__ == "__main__":
    build()
