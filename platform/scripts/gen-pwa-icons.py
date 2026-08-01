"""Generates every app icon: the PWA home-screen set and the browser tab's.

    pip install pillow fonttools
    python3 scripts/gen-pwa-icons.py

The app's logo is the wordmark, but a wordmark is illegible at 192px on a
phone home screen, so the icon is the wordmark's first letter on the app's
black button colour.

Four shapes are emitted, and the differences matter:
  * "any"      — drawn edge to edge; the OS rounds the corners itself.
  * "maskable" — Android crops this to whatever shape the launcher uses
                 (circle, squircle, teardrop), so the letter is drawn
                 smaller to survive the worst-case circular crop. Ship an
                 icon without one and Android pillarboxes it inside a white
                 blob instead.
  * apple      — iOS ignores the manifest and reads its own link.
  * the tab    — icon.svg for anything modern, favicon.ico for everything else.

The last three live in src/app rather than public/, because that is where
Next's file conventions look: favicon.ico, icon.svg and apple-icon.png there
are hashed, served and linked on every page with nothing declared in
layout.tsx. Declaring `icons` in layout's metadata instead suppresses them —
that is what kept icon.svg out of the head while apple-touch-icon.png sat in
public/. The manifest's own icons stay in public/icons: the manifest names
them itself, so they need no convention.

The tab icon is drawn twice over rather than shared with the PNGs above,
because the two are read at completely different sizes. The .ico carries four
renders (16 through 64), each drawn at 4x and downsampled, so a 16px tab is a
letter and not a smudge — one master resized by the encoder is exactly how
favicons end up illegible. The .svg is the same mark as a real outline, taken
from the font's own glyph, so it stays sharp wherever a browser scales it.
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
APP = Path(__file__).resolve().parents[1] / "src" / "app"
OUT = Path(__file__).resolve().parents[1] / "public" / "icons"
FONT = ROOT / "_dev" / "fonts" / "parkinsans-v3-latin-700.ttf"

INK = "#0b0b0b"      # --color-btn, the app's solid black
PAPER = "#ffffff"
MARK = "B"           # the wordmark's first letter

# Android's maskable safe zone is the centre 80%; a circular crop is the
# worst case, so the glyph is kept well inside it.
SIZES_ANY = [192, 512]
SIZES_MASKABLE = [512]
APPLE = 180          # iOS uses its own, and never masks it
# What goes in favicon.ico. 16 and 32 are what tabs and bookmarks actually
# draw; 48 and 64 are for Windows' larger shortcut tiles and hi-dpi tabs.
SIZES_ICO = [16, 32, 48, 64]
SVG_BOX = 64         # icon.svg's viewBox; scale-free, so the number is arbitrary


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


def crisp(size: int, *, coverage: float) -> Image.Image:
    """One icon drawn at 4x and shrunk down. Pillow's own ICO resize is bicubic
    and leaves 16px letterforms muddy; LANCZOS off a 4x render doesn't.

    RGBA even though the mark is opaque: frames of 64px and up are stored as
    PNG inside the .ico, and Next's icon pipeline refuses to decode one that
    isn't RGBA — it fails the build of every page, not just the icon."""
    shrunk = draw(size * 4, coverage=coverage).resize((size, size), Image.LANCZOS)
    return shrunk.convert("RGBA")


def svg_mark() -> str:
    """The mark as a standalone SVG — the letter as an outline, not as text, so
    it needs no font on the machine drawing it."""
    font = TTFont(FONT)
    glyphs = font.getGlyphSet()
    name = font.getBestCmap()[ord(MARK)]

    bounds = BoundsPen(glyphs)
    glyphs[name].draw(bounds)
    x0, y0, x1, y1 = bounds.bounds

    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)

    # Font units are y-up and sit anywhere on the em; SVG is y-down. So flip Y
    # and place the glyph's own bounding box in the middle of the tile.
    scale = SVG_BOX * 0.62 / max(x1 - x0, y1 - y0)
    tx = SVG_BOX / 2 - scale * (x0 + x1) / 2
    ty = SVG_BOX / 2 + scale * (y0 + y1) / 2

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SVG_BOX} {SVG_BOX}">'
        f'<rect width="{SVG_BOX}" height="{SVG_BOX}" fill="{INK}"/>'
        f'<path fill="{PAPER}" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f} -{scale:.5f})"'
        f' d="{pen.getCommands()}"/>'
        "</svg>\n"
    )


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

    p = APP / "apple-icon.png"
    draw(APPLE, coverage=0.62).save(p)
    written.append(p)

    # The tab. One .ico holding every size a browser might ask for, plus the
    # outline version for browsers that prefer it.
    frames = [crisp(s, coverage=0.62) for s in SIZES_ICO]
    p = APP / "favicon.ico"
    frames[-1].save(p, format="ICO", sizes=[(s, s) for s in SIZES_ICO], append_images=frames[:-1])
    written.append(p)

    p = APP / "icon.svg"
    p.write_text(svg_mark(), encoding="utf-8")
    written.append(p)

    root = Path(__file__).resolve().parents[1]
    for p in written:
        print(f"  {p.relative_to(root)}  {p.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
