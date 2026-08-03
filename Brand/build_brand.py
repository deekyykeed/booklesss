"""Draws every Bklsss brand asset from the font, at any size, losslessly.

    pip install pillow fonttools
    python Brand/build_brand.py

WHY THIS EXISTS. The logo used to be live-rendered text inside two generators
(`Demand/social/_scripts/prog-post.mjs` and `platform/src/lib/og.tsx`), so the
brand could not be put on anything those two do not draw. The only logo files
on disk were the old serif lockup at 239x62 and its diamond at 34x34 — enlarge
either and it turns to mush, because a raster that small has no detail to
enlarge.

Everything here comes off the font's own outlines instead. The SVGs are real
paths and are resolution-free; the PNGs are rendered at whatever size is asked
for rather than resized from one master. Nothing in this folder is ever an
upscale of anything else. Want it bigger than what is here? Use the SVG, or add
the size to SIZES below and re-run.

THE LOGO IS THE WORD (owner's call, 2026-08-03). No mark beside it.

Two tracking values, on purpose:
  * the logo   -0.031 em — the OG card's setting (52px, letterSpacing -1.6)
  * the icon   -0.060 em — tighter, because a square tile is bound by WIDTH:
                 closing the letters up lets the same tile draw the word bigger.
                 Matches platform/scripts/gen-pwa-icons.py, which owns the app's
                 own icons; keep the two in step or the tab and the brand folder
                 carry visibly different logos.

The icon carries its own black tile and the logo does not. That is the same
decision gen-pwa-icons.py documents at length: `prefers-color-scheme` reports
the OS theme, not the colour of the surface the mark is drawn on, and those
disagree constantly (Google draws favicons on a white card whatever the phone
is set to). A tile reads everywhere. The logo stays transparent because
whatever places it knows its own background.
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
# The logo's own face. Lives in platform/assets because the OG card needs it at
# build time on Vercel; this is the same file, not a second copy.
FONT = ROOT / "platform" / "assets" / "FamiljenGrotesk-Bold.ttf"

WORD = "Bklsss"
INK = "#121212"      # the house black, the same one every cover uses
TILE = "#0b0b0b"     # --color-btn, the app's solid black — the icon's ground
PAPER = "#ffffff"

TRACK_LOGO = -1.6 / 52   # the OG card's letterSpacing, made resolution-free
TRACK_ICON = -0.06       # see the module docstring

# Every size shipped. 192 is the floor — a PWA icon may not be smaller, and
# anything below it is too small to be reused for anything else.
ICON_SIZES = [192, 512, 1024]
LOGO_HEIGHT = 512        # ink height in px; the width follows the aspect (~3.96:1)


def outline(track_em: float) -> tuple[str, tuple[float, float, float, float]]:
    """The word as one SVG path in font units, plus the bounds of its ink.

    Real outlines rather than a <text> element, so nothing downstream needs the
    font installed. Glyphs sit on advance widths with no kerning applied — for
    six letters of a geometric grotesk that is indistinguishable from the shaped
    result, and it keeps the path free of a shaping dependency."""
    font = TTFont(FONT)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    track = track_em * font["head"].unitsPerEm

    commands: list[str] = []
    x = 0.0
    x0 = y0 = float("inf")
    x1 = y1 = float("-inf")

    for ch in WORD:
        glyph = glyphs[cmap[ord(ch)]]
        bounds = BoundsPen(glyphs)
        glyph.draw(bounds)
        if bounds.bounds:
            gx0, gy0, gx1, gy1 = bounds.bounds
            x0, y0 = min(x0, x + gx0), min(y0, gy0)
            x1, y1 = max(x1, x + gx1), max(y1, gy1)
            # Translated by a TransformPen on the way into the path, not by
            # rewriting the path string after: SVGPathPen emits H and V
            # shorthand, and a hand-rolled "every other number is an x"
            # translator corrupts exactly those two.
            pen = SVGPathPen(glyphs)
            glyph.draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
            commands.append(pen.getCommands())
        x += glyph.width + track

    return "".join(commands), (x0, y0, x1, y1)


def logo_svg(colour: str) -> str:
    """The wordmark alone, transparent, cropped to its own ink."""
    path, (x0, y0, x1, y1) = outline(TRACK_LOGO)
    w, h = x1 - x0, y1 - y0
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" '
        f'width="{w / h * LOGO_HEIGHT:.0f}" height="{LOGO_HEIGHT}">'
        f'<path fill="{colour}" transform="translate({-x0:.2f} {y1:.2f}) scale(1 -1)" d="{path}"/>'
        "</svg>\n"
    )


def icon_svg() -> str:
    """The wordmark on its own square black tile."""
    path, (x0, y0, x1, y1) = outline(TRACK_ICON)
    w, h = x1 - x0, y1 - y0
    box = w / 0.78  # the word covers 78% of the tile's width, as the app's does
    tx = (box - w) / 2 - x0
    ty = (box - h) / 2 + y1
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box:.0f} {box:.0f}">'
        f'<rect width="{box:.0f}" height="{box:.0f}" fill="{TILE}"/>'
        f'<path fill="{PAPER}" transform="translate({tx:.2f} {ty:.2f}) scale(1 -1)" d="{path}"/>'
        "</svg>\n"
    )


def ink_layer(track_em: float, pt: int) -> Image.Image:
    """The word as a tight greyscale mask of nothing but its ink.

    Drawn glyph by glyph because Pillow has no letter-spacing — the only way to
    close the gaps is to place each character at its own pen position."""
    font = ImageFont.truetype(str(FONT), pt)
    track = track_em * pt
    advance = sum(font.getlength(c) for c in WORD) + track * (len(WORD) - 1)

    layer = Image.new("L", (int(advance + pt), int(pt * 2)), 0)
    d = ImageDraw.Draw(layer)
    x = pt * 0.5
    for ch in WORD:
        d.text((x, pt * 0.5), ch, font=font, fill=255)
        x += font.getlength(ch) + track
    # Crop to the ink. Centring on the font's line box would hang the mark low,
    # because that box carries ascender and descender room this string never uses.
    return layer.crop(layer.getbbox())


def logo_png(colour: tuple[int, int, int], height: int) -> Image.Image:
    """The wordmark, transparent outside its ink, at `height` px of ink.

    Rendered at the point size that lands on `height` directly rather than
    resized from a master — an upscale is exactly what this folder exists to
    avoid. The 1.4x probe is only to learn the ink-to-em ratio of this string."""
    probe = ink_layer(TRACK_LOGO, 200)
    ink = ink_layer(TRACK_LOGO, max(8, round(200 * height / probe.height)))
    img = Image.new("RGBA", ink.size, colour + (0,))
    img.putalpha(ink)
    return img


def icon_png(size: int) -> Image.Image:
    """One square icon: black tile, white word across 78% of it."""
    img = Image.new("RGB", (size, size), TILE)
    ink = ink_layer(TRACK_ICON, size * 3)  # oversized, then down — never up
    scale = size * 0.78 / ink.width
    ink = ink.resize((max(1, round(ink.width * scale)), max(1, round(ink.height * scale))), Image.LANCZOS)
    img.paste(PAPER, ((size - ink.width) // 2, (size - ink.height) // 2), ink)
    return img


def main() -> None:
    if not FONT.exists():
        raise SystemExit(f"font not found: {FONT}")

    written = []

    (HERE / "booklesss-wordmark-black.svg").write_text(logo_svg(INK), encoding="utf-8")
    (HERE / "booklesss-wordmark-white.svg").write_text(logo_svg(PAPER), encoding="utf-8")
    written += ["booklesss-wordmark-black.svg", "booklesss-wordmark-white.svg"]

    for name, rgb in (("black", (0x12, 0x12, 0x12)), ("white", (0xFF, 0xFF, 0xFF))):
        p = HERE / f"booklesss-wordmark-{name}.png"
        logo_png(rgb, LOGO_HEIGHT).save(p)
        written.append(p.name)

    (HERE / "booklesss-icon.svg").write_text(icon_svg(), encoding="utf-8")
    written.append("booklesss-icon.svg")
    for size in ICON_SIZES:
        p = HERE / f"booklesss-icon-{size}.png"
        icon_png(size).save(p)
        written.append(p.name)

    for name in written:
        p = HERE / name
        dims = ""
        if p.suffix == ".png":
            with Image.open(p) as im:
                dims = f"{im.width}x{im.height}"
        print(f"  {name:<34} {dims:>10}  {p.stat().st_size:>8,} bytes")


if __name__ == "__main__":
    main()
