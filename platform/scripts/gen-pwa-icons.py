"""Generates the PWA home-screen icons into public/icons/.

    python3 scripts/gen-pwa-icons.py

The app's logo is the wordmark, but a wordmark is illegible at 192px on a
phone home screen, so the icon is the wordmark's first letter on the app's
black button colour — the same mark the browser tab already shows.

Two shapes are emitted, and the difference matters:
  * "any"      — drawn edge to edge; the OS rounds the corners itself.
  * "maskable" — Android crops this to whatever shape the launcher uses
                 (circle, squircle, teardrop), so the letter is drawn
                 smaller to survive the worst-case circular crop. Ship an
                 icon without one and Android pillarboxes it inside a white
                 blob instead.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / "public" / "icons"
FONT = ROOT / "_dev" / "fonts" / "parkinsans-v3-latin-700.ttf"

INK = "#0b0b0b"      # --color-btn, the app's solid black
PAPER = "#ffffff"

# Android's maskable safe zone is the centre 80%; a circular crop is the
# worst case, so the glyph is kept well inside it.
SIZES_ANY = [192, 512]
SIZES_MASKABLE = [512]
APPLE = 180          # iOS uses its own, and never masks it


def draw(size: int, *, coverage: float) -> Image.Image:
    """One square icon: black tile, white B occupying `coverage` of the width."""
    img = Image.new("RGB", (size, size), INK)
    d = ImageDraw.Draw(img)

    # Fit the glyph by measurement rather than by a guessed point size —
    # Parkinsans' cap height is not a fixed fraction of its em.
    target = size * coverage
    pt = int(target * 1.4)
    while pt > 8:
        font = ImageFont.truetype(str(FONT), pt)
        box = d.textbbox((0, 0), "B", font=font)
        if (box[2] - box[0]) <= target and (box[3] - box[1]) <= target:
            break
        pt -= 2

    font = ImageFont.truetype(str(FONT), pt)
    box = d.textbbox((0, 0), "B", font=font)
    # Centre on the ink, not on the font's line box, which carries leading.
    x = (size - (box[2] - box[0])) / 2 - box[0]
    y = (size - (box[3] - box[1])) / 2 - box[1]
    d.text((x, y), "B", font=font, fill=PAPER)
    return img


def main() -> None:
    if not FONT.exists():
        raise SystemExit(f"font not found: {FONT}")
    OUT.mkdir(parents=True, exist_ok=True)

    written = []
    for size in SIZES_ANY:
        p = OUT / f"icon-{size}.png"
        draw(size, coverage=0.62).save(p)
        written.append(p)

    for size in SIZES_MASKABLE:
        p = OUT / f"icon-maskable-{size}.png"
        draw(size, coverage=0.44).save(p)
        written.append(p)

    p = OUT / "apple-touch-icon.png"
    draw(APPLE, coverage=0.62).save(p)
    written.append(p)

    for p in written:
        print(f"  {p.relative_to(Path(__file__).resolve().parents[1])}  {p.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
