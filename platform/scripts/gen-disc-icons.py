"""Wires the ◯B disc in as the app's real icon — the browser tab, the PWA
home-screen set, and iOS's own touch icon.

    pip install pillow
    python3 scripts/gen-disc-icons.py

REPLACES gen-pwa-icons.py's OUTPUT, not the script itself. That generator
still exists and still draws a correct wordmark tile; it is just not what
runs any more. If the disc is ever reverted, re-running gen-pwa-icons.py
puts the wordmark straight back — nothing here deletes it.

⚠️ THE DISC IS SET IN BURBANK BIG CONDENSED, WHICH THIS REPO HAS NO LICENCE
FOR (see Brand/README.md § "The disc — on trial, not adopted"). Wiring it in
here is the owner's explicit call (2026-08-07: "ship it now anyway"),
knowingly shipping an unlicensed font in a produced asset ahead of that
licence being settled. That is a decision to revisit, not a problem this
script solves — see the same section in Brand/README.md for the standing
note.

SOURCED FROM THE RENDERED PNGs, NOT THE FONT. gen-pwa-icons.py draws letterforms
from FamiljenGrotesk-Bold.ttf's own outlines because the wordmark is text with
no separate "master" anywhere. The disc is different: Brand/build_brand.py
already rasterises it at 1024px as the single source of truth (a circle
clipping a hand-placed B and underline — see that script for the geometry),
so every size below is downsampled from THAT master rather than re-derived,
the same reasoning the wordmark's own docstring gives for not re-deriving each
.ico frame from a smaller PNG: one master resized by an encoder is how favicons
end up illegible, whereas resizing DOWN from 1024 with LANCZOS stays sharp at
every size this needs.

MASKABLE NEEDS ITS OWN COMPOSE. The 512 disc PNG is transparent outside the
circle and the circle's ink touches the frame on every edge — deliberately,
for an icon meant to sit inside a square that already rounds its own corners.
Android's maskable icon is the opposite case: the WORST-CASE crop is circular,
so anything outside the centre 80% gets cut. Measured off the real pixels
(scripts/gen-disc-icons.py's own check, not assumed): the B and its underline
already reach every edge of the disc's own circle, at 100% of its radius — so
pasted in at full size, a maskable crop takes the ends off the glyph exactly
the way the wordmark's own docstring warns against. The fix is the same shape:
shrink the whole disc (circle included) to ~74% before compositing it onto a
plain black square. The circle's own edge disappears into that square rather
than leaving a visible seam, because both are the disc's exact black — #000000,
read off the source PNG rather than assumed to match --color-btn's #0b0b0b.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "Brand"
APP = Path(__file__).resolve().parents[1] / "src" / "app"
OUT = Path(__file__).resolve().parents[1] / "public" / "icons"

MASTER = BRAND / "booklesss-disc-1024.png"
DISC_INK = (0, 0, 0, 255)  # the disc's own circle fill, read off the PNG itself

SIZES_ICO = [16, 32, 48, 64]
APPLE = 180
MASKABLE_COVERAGE = 0.74  # keeps the glyph's farthest point ~74% of the radius


def load_master() -> Image.Image:
    if not MASTER.exists():
        raise SystemExit(f"master not found: {MASTER} — run Brand/build_brand.py first")
    return Image.open(MASTER).convert("RGBA")


def resized(master: Image.Image, size: int) -> Image.Image:
    return master.resize((size, size), Image.LANCZOS)


def maskable(master: Image.Image, size: int) -> Image.Image:
    """A solid tile at `size`, the disc pasted in at MASKABLE_COVERAGE so a
    circular crop can't clip the glyph. Solid, not transparent — a maskable
    icon's canvas is meant to be opaque; the circle's own edge is invisible
    against a same-colour square, which is what makes this safe to do."""
    canvas = Image.new("RGBA", (size, size), DISC_INK)
    inset = round(size * MASKABLE_COVERAGE)
    disc = master.resize((inset, inset), Image.LANCZOS)
    off = (size - inset) // 2
    canvas.paste(disc, (off, off), disc)
    return canvas


def main() -> None:
    master = load_master()
    OUT.mkdir(parents=True, exist_ok=True)
    written = []

    # icon.svg — the disc's own vector, as drawn. Real outlines, scale-free.
    p = APP / "icon.svg"
    p.write_text((BRAND / "booklesss-disc.svg").read_text(encoding="utf-8"), encoding="utf-8")
    written.append(p)

    # apple-icon.png — iOS reads this directly and never masks it, so full size.
    p = APP / "apple-icon.png"
    resized(master, APPLE).save(p)
    written.append(p)

    # favicon.ico — one frame per size a browser might ask for, each downsampled
    # straight from the 1024 master rather than chained through each other.
    frames = [resized(master, s) for s in SIZES_ICO]
    p = APP / "favicon.ico"
    frames[-1].save(p, format="ICO", sizes=[(s, s) for s in SIZES_ICO], append_images=frames[:-1])
    written.append(p)

    # The manifest's "any" icons — edge to edge, the OS rounds its own corners.
    for size in (192, 512):
        p = OUT / f"icon-{size}.png"
        resized(master, size).save(p)
        written.append(p)

    # The maskable icon — see the module docstring for why this one alone needs
    # composing rather than a plain resize.
    p = OUT / "icon-maskable-512.png"
    maskable(master, 512).save(p)
    written.append(p)

    root = Path(__file__).resolve().parents[1]
    for p in written:
        print(f"  {p.relative_to(root)}  {p.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
