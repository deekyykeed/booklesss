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

# Google's OAuth consent screen, asked for 2026-08-03. Its own named output
# rather than a fourth ICON_SIZE, because 120 is below the PWA floor above and
# would read as an app icon we ship: this file exists for one upload field.
# Google's spec: square, 120x120, JPG/PNG/BMP, under 1MB.
#
# READ THE STANDING RULE BEFORE UPLOADING IT. Putting a logo on the consent
# screen is what puts the app INTO Google's brand-verification review — the
# app has been through that twice already. Generating the file is free; the
# upload is the decision.
CONSENT_SIZE = 120


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


# ---------------------------------------------------------------------------
# THE DISC — A CANDIDATE, NOT THE LOGO (owner, 2026-08-06)
#
# "I actually want to experiment using that logo on the page as my actual logo
# exactly as it is, just add a 1px black border to the whole thing" … "can you
# save it in the brand, id like to test it out and see if i can replace it as
# the new one later — just the circular one."
#
# So it ships as `booklesss-disc-*`, beside the wordmark rather than instead of
# it. THE STANDING RULE IN README.md STILL HOLDS until the owner says otherwise:
# the logo is the word. Nothing in this repo points at these files yet; they
# exist to be looked at.
#
# ⚠️ IT IS SET IN BURBANK BIG CONDENSED, WHICH IS NOT LICENSED HERE. Font Bureau
# retail. The woff2 has been in platform/src/fonts since it drew the old logo,
# with nothing recording a purchase — unlike Satoshi, whose licence is written
# down. Rendering it costs nothing; adopting it as the mark means buying the
# web licence, and foundries commonly treat logo use as a separate grant again.
# Settle that before this replaces anything, because a mark is the one asset
# that is expensive to change late.
#
# GEOMETRY IS MEASURED OFF THE LIVE PAGE, not re-derived. The hero draws a 50px
# disc with the B at font-size 40 in a 50px line box, underlined 5px thick at a
# 10px offset, clipped by the circle. Rendered, that puts the baseline at y=35
# and the bar at y=45..50 with its ends cut by the curve. Those two numbers are
# taken from a screenshot rather than from the font's ascender, because which
# ascender a browser uses for a line box is not something to guess at.
DISC_FONT = ROOT / "platform" / "src" / "fonts" / "burbank.woff2"
DISC_SIZES = [192, 512, 1024]

DISC_BOX = 50.0        # the drawn size on the page, and the SVG's viewBox
DISC_TYPE = 40.0       # font-size
DISC_BASELINE = 35.0   # measured
DISC_RULE_OFFSET = 10.0
DISC_RULE_THICK = 5.0


def disc_parts() -> tuple[str, float, float, float]:
    """The B as an SVG path in font units, its advance, upm, and the scale."""
    font = TTFont(DISC_FONT)
    glyphs = font.getGlyphSet()
    upm = font["head"].unitsPerEm
    glyph = glyphs[font.getBestCmap()[ord("B")]]
    pen = SVGPathPen(glyphs)
    glyph.draw(pen)
    return pen.getCommands(), glyph.width, upm, DISC_TYPE / upm


def disc_svg() -> str:
    """The mark: white B on a black circle, its underline cut by the curve."""
    path, advance, _upm, scale = disc_parts()
    adv = advance * scale
    x = (DISC_BOX - adv) / 2
    r = DISC_BOX / 2

    # The rule is clipped by the same circle that fills the disc — which is what
    # turns a full-width underline into a bar with rounded-off ends. Without the
    # clip it escapes the mark entirely.
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {DISC_BOX:.0f} {DISC_BOX:.0f}" '
        f'width="{DISC_BOX:.0f}" height="{DISC_BOX:.0f}">'
        f'<defs><clipPath id="d"><circle cx="{r}" cy="{r}" r="{r}"/></clipPath></defs>'
        f'<g clip-path="url(#d)">'
        f'<circle cx="{r}" cy="{r}" r="{r}" fill="#000000"/>'
        # scale(1 -1) because font outlines run y-up and SVG runs y-down.
        f'<path fill="{PAPER}" transform="translate({x:.3f} {DISC_BASELINE:.3f}) '
        f'scale({scale:.6f} {-scale:.6f})" d="{path}"/>'
        f'<rect x="{x:.3f}" y="{DISC_BASELINE + DISC_RULE_OFFSET:.3f}" '
        f'width="{adv:.3f}" height="{DISC_RULE_THICK:.3f}" fill="{PAPER}"/>'
        f"</g></svg>\n"
    )


def disc_png(size: int) -> Image.Image:
    """One disc, transparent outside the circle.

    Drawn at 4x and brought down — the circle's edge and the two cut ends of the
    rule are the whole silhouette, and Pillow does not antialias a shape it
    draws at final size. Down is fine; up is what this folder forbids."""
    ss = 4
    px = size * ss
    k = px / DISC_BOX  # page units -> pixels

    img = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse((0, 0, px - 1, px - 1), fill=(0, 0, 0, 255))

    _path, advance, upm, _scale = disc_parts()
    pt = round(DISC_TYPE * k)
    font = ImageFont.truetype(str(DISC_FONT), pt)
    adv_px = advance * (pt / upm)
    x = (px - adv_px) / 2

    # Anchor "ls": left edge, baseline — the same origin the SVG's translate
    # uses, so the two renders cannot drift apart.
    d.text((x, DISC_BASELINE * k), "B", font=font, fill=(255, 255, 255, 255), anchor="ls")
    top = (DISC_BASELINE + DISC_RULE_OFFSET) * k
    d.rectangle((x, top, x + adv_px, top + DISC_RULE_THICK * k), fill=(255, 255, 255, 255))

    # Everything outside the circle goes, which is what clips the rule's ends.
    mask = Image.new("L", (px, px), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, px - 1, px - 1), fill=255)
    img.putalpha(Image.composite(img.getchannel("A"), Image.new("L", (px, px), 0), mask))

    return img.resize((size, size), Image.LANCZOS)


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

    # Google's consent screen — see CONSENT_SIZE. Rendered from the outlines at
    # 120 like every other size here, not resized down from 192.
    p = HERE / "booklesss-google-consent-120.png"
    icon_png(CONSENT_SIZE).save(p)
    written.append(p.name)

    # The candidate disc — see the block above it. Skipped rather than fatal if
    # Burbank is absent, because it is not the brand and this script must keep
    # building the things that are.
    if DISC_FONT.exists():
        (HERE / "booklesss-disc.svg").write_text(disc_svg(), encoding="utf-8")
        written.append("booklesss-disc.svg")
        for size in DISC_SIZES:
            p = HERE / f"booklesss-disc-{size}.png"
            disc_png(size).save(p)
            written.append(p.name)
    else:
        print(f"  (disc skipped — no {DISC_FONT.name})")

    for name in written:
        p = HERE / name
        dims = ""
        if p.suffix == ".png":
            with Image.open(p) as im:
                dims = f"{im.width}x{im.height}"
        print(f"  {name:<34} {dims:>10}  {p.stat().st_size:>8,} bytes")


if __name__ == "__main__":
    main()
