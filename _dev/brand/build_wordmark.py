"""Turn the Bklsss wordmark into real files.

The logo is the word (owner's call, 2026-08-03) and until now it existed only as
live-rendered text inside two generators — `Demand/social/_scripts/prog-post.mjs`
and `platform/src/lib/og.tsx`. Nothing could put it on a PDF, a slide or a
sticker without re-implementing it.

Set from the OG card's spec, which is the newest surface and the one that set
the wordmark deliberately: Familjen Grotesk Bold (700), tracking -1.6 at 52px
= -0.0308em. Outlined to paths in the SVG, so nothing downstream needs the font.
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]  # _dev/brand/ -> project root
FONT = ROOT / "platform/assets/FamiljenGrotesk-Bold.ttf"
OUT = Path(__file__).resolve().parent

WORD = "Bklsss"
TRACK_EM = -1.6 / 52  # the OG card's letterSpacing, made resolution-free
INK = "#121212"       # the house black, same as every cover


def outline_svg(colour: str, path: Path) -> None:
    """Draw the word as one filled path, in font units, then scale to 1000 tall."""
    font = TTFont(FONT)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upem = font["head"].unitsPerEm
    track = TRACK_EM * upem

    pen_paths, x = [], 0.0
    for ch in WORD:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        d = pen.getCommands()
        if d:
            pen_paths.append(f'<path transform="translate({x:.1f} 0)" d="{d}"/>')
        x += glyphs[name].width + track
    width = x - track  # the last letter carries no trailing gap

    # y-extent from the drawn glyphs, not the font's line box — a logo is sized
    # by its own ink, and a wordmark boxed to the ascender floats in whatever
    # frame it is dropped into.
    ymin = min(font["glyf"][cmap[ord(c)]].yMin for c in WORD if font["glyf"][cmap[ord(c)]].numberOfContours)
    ymax = max(font["glyf"][cmap[ord(c)]].yMax for c in WORD if font["glyf"][cmap[ord(c)]].numberOfContours)
    h = ymax - ymin

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {h:.1f}" '
        f'width="{width / h * 200:.1f}" height="200" fill="{colour}">'
        f'<g transform="translate(0 {ymax:.1f}) scale(1 -1)">' + "".join(pen_paths) + "</g></svg>"
    )
    path.write_text(svg, encoding="utf-8")
    return width / h


def raster(colour, path, height=240, pad=0.18):
    """PNG twin, transparent outside the ink — for anything that can't take SVG."""
    size = int(height / 0.72)  # cap height is ~0.72 em in this face
    f = ImageFont.truetype(str(FONT), size)
    track = TRACK_EM * size

    # measure first, on a throwaway canvas
    probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    widths = [probe.textlength(c, font=f) for c in WORD]
    total = sum(widths) + track * (len(WORD) - 1)
    box = probe.textbbox((0, 0), WORD, font=f)

    m = int(height * pad)
    img = Image.new("RGBA", (int(total) + 2 * m, int(box[3] - box[1]) + 2 * m), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x = float(m)
    for c, w in zip(WORD, widths):
        d.text((x, m - box[1]), c, font=f, fill=colour)
        x += w + track
    img.save(path)
    return img.size


if __name__ == "__main__":
    ratio = outline_svg(INK, OUT / "booklesss-wordmark-black.svg")
    outline_svg("#FFFFFF", OUT / "booklesss-wordmark-white.svg")
    a = raster(INK, OUT / "booklesss-wordmark-black.png")
    b = raster("#FFFFFF", OUT / "booklesss-wordmark-white.png")
    print(f"aspect {ratio:.3f} : 1   png {a}  {b}")
