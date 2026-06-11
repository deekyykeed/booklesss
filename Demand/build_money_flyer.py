#!/usr/bin/env python3
"""
Booklesss money-drop flyer.
Two pages at banknote dimensions (156mm x 78mm):
  Page 1 -- ZMW 500 note (looks like money, people pick it up)
  Page 2 -- Booklesss marketing side: cream/grain, no amber, apology hook,
            big QR code, minimal text, dark on cream.
"""

from pathlib import Path
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE   = Path(__file__).resolve().parent
ROOT   = HERE.parent
BRAND  = ROOT / "_dev" / "brand"
FONTS  = ROOT / "_dev" / "fonts"
GRAIN  = BRAND / "grain.png"
LOGO_B = BRAND / "booklesss-logo-black.png"
NOTE   = HERE  / "Zambia_BOZ_500_kwacha_2024.00.00_B176a_PNL_AA_3347547_r.jpg"
QR_TMP = HERE  / "_qr_temp.png"
OUT    = HERE  / "Booklesss_Money_Flyer.pdf"

_grain  = ImageReader(str(GRAIN))  if GRAIN.exists()  else None
_logo_b = ImageReader(str(LOGO_B)) if LOGO_B.exists() else None

# ── Register fonts ────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Parastoo",      FONTS / "Parastoo.ttf"))
pdfmetrics.registerFont(TTFont("Parastoo-Bold", FONTS / "Parastoo-Bold.ttf"))

# ── Palette: cream paper + dark ink only, no amber ────────────────────────────
DARK  = (0x1C/255, 0x25/255, 0x26/255)   # #1C2526 dark slate
MID   = (0x4A/255, 0x55/255, 0x68/255)   # muted grey for secondary text
CREAM = (1.0,      254/255, 242/255)      # #FFFEF2

# ── Geometry ──────────────────────────────────────────────────────────────────
W          = 156 * mm
H          =  78 * mm
LEFT_SPLIT = 0.52       # left panel gets slightly less — QR is the hero
MARGIN_L   = 8 * mm


def _qr_image():
    """Real QR, transparent background, rounded modules."""
    try:
        import qrcode
        from PIL import Image

        try:
            from qrcode.image.styledpil import StyledPilImage
            from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer

            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=20,
                border=2,
            )
            qr.add_data("https://booklesss.framer.ai")
            qr.make(fit=True)
            img = qr.make_image(
                image_factory=StyledPilImage,
                module_drawer=RoundedModuleDrawer(radius_ratio=0.5),
            ).convert("RGBA")

        except Exception:
            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=20,
                border=2,
            )
            qr.add_data("https://booklesss.framer.ai")
            qr.make(fit=True)
            img = qr.make_image(
                fill_color=(0x1C, 0x25, 0x26),
                back_color=(255, 254, 242),
            ).convert("RGBA")

        # Transparent background — cream/grain will show through
        pixels = img.load()
        for y in range(img.height):
            for x in range(img.width):
                r, g, b, a = pixels[x, y]
                if r > 180 and g > 180 and b > 180:
                    pixels[x, y] = (r, g, b, 0)
                else:
                    pixels[x, y] = (0x1C, 0x25, 0x26, 255)

        img.save(str(QR_TMP), "PNG")
        return QR_TMP

    except Exception:
        return None


def build():
    c = rl_canvas.Canvas(str(OUT), pagesize=(W, H))

    # ── PAGE 1: banknote ──────────────────────────────────────────────────────
    c.drawImage(str(NOTE), 0, 0, width=W, height=H, preserveAspectRatio=False)
    c.showPage()

    # ── PAGE 2: Booklesss flyer ───────────────────────────────────────────────

    # Cream background
    c.setFillColorRGB(*CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # Grain overlay — draw at full opacity, PNG alpha carries the texture
    if _grain is not None:
        # 1.6x scale makes the grain pattern visually larger; draw twice for opacity
        gw, gh = W * 1.6, H * 1.6
        ox, oy = -(gw - W) / 2, -(gh - H) / 2
        c.drawImage(_grain, ox, oy, width=gw, height=gh, mask="auto")
        c.drawImage(_grain, ox, oy, width=gw, height=gh, mask="auto")

    # ── LEFT PANEL ────────────────────────────────────────────────────────────
    X     = MARGIN_L
    LEND  = W * LEFT_SPLIT

    # Logo
    LOGO_H  = 5.5 * mm
    LOGO_WW = LOGO_H * 4.6
    if _logo_b is not None:
        c.drawImage(_logo_b, X, H - 10 * mm,
                width=LOGO_WW, height=LOGO_H,
                mask="auto", preserveAspectRatio=True)

    # Thin hairline separator between panels
    c.setStrokeColorRGB(*MID)
    c.setLineWidth(0.25)
    c.line(LEND, 5 * mm, LEND, H - 5 * mm)

    # Apology hook — the moment they flip it
    c.setFillColorRGB(*DARK)
    c.setFont("Parastoo-Bold", 9.5)
    c.drawString(X, H - 10 * mm - 12 * mm, "Sorry.")

    c.setFont("Parastoo", 8)
    c.drawString(X, H - 10 * mm - 12 * mm - 7 * mm, "Not real money.")

    # Value line
    c.setFont("Parastoo-Bold", 7.5)
    VY = H - 10 * mm - 12 * mm - 7 * mm - 10 * mm
    c.drawString(X, VY,            "But these notes")
    c.drawString(X, VY - 6 * mm,   "are free.")

    # Short explainer — 1 line only
    c.setFillColorRGB(*MID)
    c.setFont("Parastoo", 5.5)
    EXY = VY - 6 * mm - 7 * mm
    c.drawString(X, EXY, "Exam notes for ZCAS & UNZA students.")

    # URL at bottom
    c.setFillColorRGB(*DARK)
    c.setFont("Parastoo-Bold", 5.8)
    c.drawString(X, 4 * mm, "booklesss.framer.ai")

    # ── RIGHT PANEL: big QR ───────────────────────────────────────────────────
    QR_PAD  = 5 * mm
    QR_SIZE = H - 2 * QR_PAD
    RX      = LEND + 2 * mm
    RW      = W - RX - 3 * mm
    QR_X    = RX + (RW - QR_SIZE) / 2

    qr_path = _qr_image()
    if qr_path and qr_path.exists():
        c.drawImage(str(qr_path), QR_X, QR_PAD,
                    width=QR_SIZE, height=QR_SIZE, mask="auto")
        try:
            qr_path.unlink()
        except Exception:
            pass
    else:
        c.setStrokeColorRGB(*DARK)
        c.setLineWidth(0.6)
        c.rect(QR_X, QR_PAD, QR_SIZE, QR_SIZE, stroke=1, fill=0)
        c.setFillColorRGB(*MID)
        c.setFont("Parastoo", 6)
        c.drawCentredString(RX + RW / 2, QR_PAD + QR_SIZE / 2,
                            "booklesss.framer.ai")

    c.showPage()
    c.save()
    print(f"Built: {OUT}")


if __name__ == "__main__":
    build()
