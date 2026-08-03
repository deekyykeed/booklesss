"""Generates every app icon: the PWA home-screen set and the browser tab's.

    pip install pillow fonttools
    python3 scripts/gen-pwa-icons.py

THE MARK IS THE WORDMARK — "Bklsss", set in Familjen Grotesk Bold, the same
face and the same string the header and the social posters use (owner,
2026-08-03: "its just the usual Bklsss in the familjen logo"). It replaced a
lone "B" in Parkinsans, which was neither the logo nor the logo's font.

WHERE THE WORDMARK CANNOT GO, AND WHY. Six letters need width. Two surfaces
physically cannot give it:
  * the 16px .ico frame — six glyphs across 16 pixels is under 3px each, which
    is a grey smear, not a word. That one frame keeps the "B" (now also
    Familjen Bold, so it is the wordmark's own first letter rather than a
    different typeface). Every larger frame — 32, 48, 64, which is what retina
    tabs, bookmark bars and Windows tiles actually draw — carries the wordmark.
    Different artwork per size is the entire point of a multi-size .ico.
  * the maskable PWA icon — Android crops it to a circle at worst, and a
    circular crop takes the ends off anything wide. "B" again.
Everywhere with room (icon.svg, apple-icon, the 192/512 "any" icons) is the
full wordmark.

DARK / LIGHT. icon.svg carries no background and swaps its fill on
`prefers-color-scheme`, so the wordmark is near-black on a light tab strip and
near-white on a dark one. Firefox and Safari honour that; Chrome's support for
media queries inside an SVG favicon is unreliable, which is exactly what the
.ico fallback is for — it keeps its solid black tile, so it reads on either.
A theme-responsive .ico is not possible: the format has no media queries.

Four shapes are emitted, and the differences matter:
  * "any"      — drawn edge to edge; the OS rounds the corners itself.
  * "maskable" — Android crops this to whatever shape the launcher uses
                 (circle, squircle, teardrop), so the mark is drawn smaller to
                 survive the worst-case circular crop. Ship an icon without one
                 and Android pillarboxes it inside a white blob instead.
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
because the two are read at completely different sizes. Each .ico frame is
drawn at 4x and downsampled — one master resized by the encoder is exactly how
favicons end up illegible. The .svg is the same mark as real outlines, taken
from the font's own glyphs, so it stays sharp wherever a browser scales it.

Glyphs are laid out on advance widths alone; no kerning is applied. For six
letters of a geometric grotesk that is indistinguishable from the real thing,
and it keeps the SVG path free of a shaping dependency.
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
APP = Path(__file__).resolve().parents[1] / "src" / "app"
OUT = Path(__file__).resolve().parents[1] / "public" / "icons"
# The logo's own face. Vendored beside the OG card's copy rather than pulled
# from _dev/fonts, which carries no Familjen Grotesk.
FONT = Path(__file__).resolve().parents[1] / "assets" / "FamiljenGrotesk-Bold.ttf"

INK = "#0b0b0b"      # --color-btn, the app's solid black
PAPER = "#ffffff"
WORDMARK = "Bklsss"  # the logo, in full
MARK = "B"           # its first letter, for the two places the full word can't fit

# Android's maskable safe zone is the centre 80%; a circular crop is the
# worst case, so the glyph is kept well inside it.
SIZES_ANY = [192, 512]
SIZES_MASKABLE = [512]
APPLE = 180          # iOS uses its own, and never masks it
# What goes in favicon.ico. 16 and 32 are what tabs and bookmarks actually
# draw; 48 and 64 are for Windows' larger shortcut tiles and hi-dpi tabs.
SIZES_ICO = [16, 32, 48, 64]
SVG_BOX = 64         # icon.svg's viewBox; scale-free, so the number is arbitrary


def draw(size: int, *, text: str, coverage: float) -> Image.Image:
    """One square icon: black tile, white `text` occupying `coverage` of the
    width. Used for both the wordmark and the single letter — the only
    difference is which string comes in and how wide it ends up."""
    img = Image.new("RGB", (size, size), INK)
    d = ImageDraw.Draw(img)

    # Fit by measurement rather than by a guessed point size — a font's cap
    # height is not a fixed fraction of its em, and a six-letter string is
    # bound by width where a single letter is bound by height.
    target = size * coverage
    pt = int(target * 1.4)
    while pt > 4:
        font = ImageFont.truetype(str(FONT), pt)
        box = d.textbbox((0, 0), text, font=font)
        if (box[2] - box[0]) <= target and (box[3] - box[1]) <= target:
            break
        pt -= 1

    font = ImageFont.truetype(str(FONT), pt)
    box = d.textbbox((0, 0), text, font=font)
    # Centre on the ink, not on the font's line box, which carries leading.
    x = (size - (box[2] - box[0])) / 2 - box[0]
    y = (size - (box[3] - box[1])) / 2 - box[1]
    d.text((x, y), text, font=font, fill=PAPER)
    return img


def crisp(size: int, *, text: str, coverage: float) -> Image.Image:
    """One icon drawn at 4x and shrunk down. Pillow's own ICO resize is bicubic
    and leaves 16px letterforms muddy; LANCZOS off a 4x render doesn't.

    RGBA even though the mark is opaque: frames of 64px and up are stored as
    PNG inside the .ico, and Next's icon pipeline refuses to decode one that
    isn't RGBA — it fails the build of every page, not just the icon."""
    shrunk = draw(size * 4, text=text, coverage=coverage).resize((size, size), Image.LANCZOS)
    return shrunk.convert("RGBA")


def outline(text: str) -> tuple[str, tuple[float, float, float, float]]:
    """`text` as one SVG path in font units, plus its ink bounding box.

    Real outlines rather than a <text> element, so the file needs no font on
    whatever machine draws it. Glyphs are placed on advance widths; no kerning
    (see the module docstring)."""
    font = TTFont(FONT)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()

    commands: list[str] = []
    x = 0.0
    x0 = y0 = float("inf")
    x1 = y1 = float("-inf")

    for ch in text:
        name = cmap[ord(ch)]
        glyph = glyphs[name]

        bounds = BoundsPen(glyphs)
        glyph.draw(bounds)
        # A space has no outline and so no bounds — advance past it and move on.
        if bounds.bounds:
            gx0, gy0, gx1, gy1 = bounds.bounds
            x0, y0 = min(x0, x + gx0), min(y0, gy0)
            x1, y1 = max(x1, x + gx1), max(y1, gy1)

            # Each glyph is drawn at the origin, so it is translated to its own
            # pen position on the way into the path — by a TransformPen, not by
            # rewriting the path string afterwards. SVGPathPen emits H and V
            # shorthand as well as M/L/C/Q, and a hand-rolled translator that
            # assumed "every other number is an x" silently corrupts those two.
            pen = SVGPathPen(glyphs)
            glyph.draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
            commands.append(pen.getCommands())

        x += glyph.width

    return "".join(commands), (x0, y0, x1, y1)


def svg_mark() -> str:
    """The wordmark as a standalone SVG, with no background and a fill that
    follows the browser's colour scheme — see the module docstring for which
    browsers honour that and what covers the rest."""
    path, (x0, y0, x1, y1) = outline(WORDMARK)

    w, h = x1 - x0, y1 - y0
    # A wide viewBox rather than a square one: a browser fits the whole box
    # into its square icon slot, so a square box would surround the wordmark
    # with dead space and draw it smaller still.
    pad = h * 0.18
    box_w, box_h = w + pad * 2, h + pad * 2

    # Font units are y-up and sit anywhere on the em; SVG is y-down. Flip Y and
    # bring the ink's own bounding box to the origin.
    tx = pad - x0
    ty = pad + y1

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box_w:.0f} {box_h:.0f}">'
        "<style>"
        f"path{{fill:{INK}}}"
        f"@media(prefers-color-scheme:dark){{path{{fill:{PAPER}}}}}"
        "</style>"
        f'<path transform="translate({tx:.2f} {ty:.2f}) scale(1 -1)" d="{path}"/>'
        "</svg>\n"
    )


def main() -> None:
    if not FONT.exists():
        raise SystemExit(f"font not found: {FONT}")
    OUT.mkdir(parents=True, exist_ok=True)

    written = []
    # The home-screen icons have all the room they need, so they get the word.
    # 0.78 rather than the letter's 0.62: a wordmark is bound by width, and at
    # 0.62 it sat as a thin strip in the middle of a mostly empty tile.
    for size in SIZES_ANY:
        p = OUT / f"icon-{size}.png"
        draw(size, text=WORDMARK, coverage=0.78).save(p)
        written.append(p)

    # Also the wordmark, and this one matters most: when a PWA is installed,
    # Android's launcher PREFERS the maskable icon, so whatever is here is what
    # sits on the home screen. An earlier pass put the bare "B" here on the
    # assumption that a circular crop takes the ends off anything wide — wrong,
    # and the geometry says so. A rectangle inscribed in a circle can be nearly
    # the full diameter across provided it is short: at the wordmark's ~3.25:1
    # ratio, 0.72 of the canvas is 369x113px, whose diagonal is 386px, inside
    # the 410px safe circle (the centre 80% of 512). Keep this under 0.74 —
    # past that the corners of the word leave the circle and a round launcher
    # icon clips the first and last "s".
    for size in SIZES_MASKABLE:
        p = OUT / f"icon-maskable-{size}.png"
        draw(size, text=WORDMARK, coverage=0.72).save(p)
        written.append(p)

    p = APP / "apple-icon.png"
    draw(APPLE, text=WORDMARK, coverage=0.78).save(p)
    written.append(p)

    # The tab. One .ico holding every size a browser might ask for. 16 is the
    # one frame too small for six letters — see the module docstring.
    frames = [
        crisp(s, text=(MARK if s <= 16 else WORDMARK), coverage=(0.62 if s <= 16 else 0.86))
        for s in SIZES_ICO
    ]
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
