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

DARK / LIGHT — settled, and not the way it first looks. Every icon here sits on
its own black tile, and none of them carries a `prefers-color-scheme` rule.

A transparent favicon that swaps ink colour on the OS theme was tried first and
is wrong, because `prefers-color-scheme` reports the OS theme and NOT the
colour of the surface the icon is drawn on. Those disagree all the time:
Google's search results put a favicon on a white card whatever the phone is
set to, so a dark-mode white wordmark disappears; a dark tab strip under a
light OS theme loses a black one the same way. Owner, 2026-08-03, on seeing it:
"I may need a black background so that's readable on Google and vice versa."

A tile solves both, and everywhere else besides — the Android task switcher,
the bookmark bar, the history list, "add to home screen". It also makes
icon.svg and favicon.ico the same picture, so nothing depends on whether a
given browser honours media queries inside an SVG.

Do not "improve" this back to a transparent mark.

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
MARK = "B"           # its first letter, for the one place the full word can't fit

# Letter-spacing, as a fraction of the em. Negative closes the gaps up (owner,
# 2026-08-03: "reduce the space between the letters so its shorter"), and on an
# icon that is not only a look — a shorter mark is bound by width at a larger
# scale, so the same tile draws the word bigger. Familjen Grotesk sets fairly
# open by default; -0.06 reads as a lockup rather than as running text.
# Applied identically to the PNGs and to icon.svg, or the tab and the home
# screen would carry visibly different logos.
TRACKING_EM = -0.06

# Android's maskable safe zone is the centre 80%; a circular crop is the
# worst case, so the glyph is kept well inside it.
SIZES_ANY = [192, 512]
SIZES_MASKABLE = [512]
APPLE = 180          # iOS uses its own, and never masks it
# What goes in favicon.ico. 16 and 32 are what tabs and bookmarks actually
# draw; 48 and 64 are for Windows' larger shortcut tiles and hi-dpi tabs.
SIZES_ICO = [16, 32, 48, 64]
SVG_BOX = 64         # icon.svg's viewBox; scale-free, so the number is arbitrary


def ink_layer(text: str, pt: int = 320) -> Image.Image:
    """`text` as a tight greyscale mask of nothing but its ink, tracked.

    Drawn glyph by glyph rather than with one `d.text(...)` call, because
    Pillow has no letter-spacing: the only way to close the gaps is to place
    each character at its own pen position. Rendered once at a large point size
    and scaled down by the caller, so every icon comes off the same master."""
    font = ImageFont.truetype(str(FONT), pt)
    tracking = TRACKING_EM * pt

    advance = sum(font.getlength(c) for c in text) + tracking * (len(text) - 1)
    layer = Image.new("L", (int(advance + pt * 2), int(pt * 2.5)), 0)
    d = ImageDraw.Draw(layer)

    x = pt * 0.5
    for ch in text:
        d.text((x, pt * 0.5), ch, font=font, fill=255)
        x += font.getlength(ch) + tracking

    # Crop to the ink itself. Centring on the font's line box instead would
    # hang the mark low, because that box carries ascender and descender room
    # this string never uses.
    return layer.crop(layer.getbbox())


def draw(size: int, *, text: str, coverage: float) -> Image.Image:
    """One square icon: black tile, white `text` fitted into `coverage` of it."""
    img = Image.new("RGB", (size, size), INK)

    target = size * coverage
    ink = ink_layer(text)
    scale = min(target / ink.width, target / ink.height)
    ink = ink.resize((max(1, round(ink.width * scale)), max(1, round(ink.height * scale))), Image.LANCZOS)

    img.paste(PAPER, ((size - ink.width) // 2, (size - ink.height) // 2), ink)
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

    # Same tracking as the PNGs, converted from ems into this font's own units.
    tracking = TRACKING_EM * font["head"].unitsPerEm

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

        x += glyph.width + tracking

    return "".join(commands), (x0, y0, x1, y1)


def svg_mark() -> str:
    """The wordmark as a standalone SVG, on its own black tile.

    THE TILE IS THE POINT, and it is why this file carries no
    `prefers-color-scheme` rule any more. A transparent favicon takes the
    colour of whatever is behind it, and `prefers-color-scheme` does not tell
    you what that is — it reports the OS theme, which disagrees with the actual
    surface constantly:

      * Google's search results draw a favicon on a WHITE card whatever the
        phone's theme is. In dark mode a transparent mark is white ink, so it
        vanishes.
      * A dark tab strip under a light OS theme is the same failure the other
        way round: black ink on near-black chrome.

    A mark that brings its own background reads in both, and in the Android
    task switcher, the bookmark bar and the history list besides. It also makes
    this file and favicon.ico the same picture, so there is no longer a
    browser-support caveat to hedge about."""
    path, (x0, y0, x1, y1) = outline(WORDMARK)

    w, h = x1 - x0, y1 - y0
    # Generous side padding, because this is now a tile rather than loose ink —
    # the wordmark should not touch its own edges. Vertical padding is larger
    # so the tile is not a letterbox slot.
    pad_x, pad_y = h * 0.34, h * 0.46
    box_w, box_h = w + pad_x * 2, h + pad_y * 2

    # Font units are y-up and sit anywhere on the em; SVG is y-down. Flip Y and
    # bring the ink's own bounding box to the origin.
    tx = pad_x - x0
    ty = pad_y + y1

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box_w:.0f} {box_h:.0f}">'
        f'<rect width="{box_w:.0f}" height="{box_h:.0f}" fill="{INK}"/>'
        f'<path fill="{PAPER}" transform="translate({tx:.2f} {ty:.2f}) scale(1 -1)" d="{path}"/>'
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
