"""Rebuilds the self-hosted Aptos woff2 files as content-driven subsets.

    python3 scripts/subset-fonts.py

Aptos ships ~1,090 mapped codepoints — Cyrillic, Greek, the lot. The four
weights were 301 KB of a 909 KB first visit, a third of it, for a Zambian
finance course that renders none of that.

The kept set is not guessed. It is every character that actually appears in
the course content, plus the ranges any UI could reasonably produce, so
nothing can render as a tofu box. Rerun this whenever a course adds a
character the current subset lacks — the report prints what it kept, and the
build fails loudly rather than silently dropping a glyph.

Sources are the TTFs in _dev/fonts/, never the existing woff2 — subsetting an
already-subset font would quietly compound.
"""

import json
import subprocess
import sys
from pathlib import Path

PLATFORM = Path(__file__).resolve().parents[1]
ROOT = PLATFORM.parent
SRC = ROOT / "_dev" / "fonts"
OUT = PLATFORM / "src" / "fonts"
CONTENT = PLATFORM / "src" / "lib" / "course-data.json"

FACES = {
    "Aptos.ttf": "aptos.woff2",
    "Aptos-Bold.ttf": "aptos-bold.woff2",
    "Aptos-Italic.ttf": "aptos-italic.woff2",
    "Aptos-Bold-Italic.ttf": "aptos-bold-italic.woff2",
}

# Kept whatever the content says, so a student typing into the composer, or a
# lesson gaining a new symbol, doesn't hit a missing glyph.
BASE_RANGES = [
    (0x0020, 0x007E),  # ASCII
    (0x00A0, 0x00FF),  # Latin-1: accents, ×, ÷, £, °, ±
    (0x0100, 0x017F),  # Latin Extended-A
    (0x2010, 0x203A),  # dashes, curly quotes, ellipsis, dagger, ‰
    (0x2070, 0x209F),  # super/subscripts — r², CFₜ and the like
    (0x20A0, 0x20BF),  # currency symbols
    (0x2190, 0x21B5),  # arrows
    (0x2200, 0x22FF),  # maths: ∑ √ ≈ ≤ ≥ ∞ ∫
    (0x25A0, 0x25CF),  # bullets and geometric marks
]


def content_codepoints() -> set[int]:
    """Every character the built course actually contains."""
    if not CONTENT.exists():
        raise SystemExit(f"missing {CONTENT} — run `npm run gen:course` first")
    text = CONTENT.read_text(encoding="utf-8")
    return {ord(ch) for ch in text}


def main() -> None:
    keep = content_codepoints()
    before_content = len(keep)
    for lo, hi in BASE_RANGES:
        keep.update(range(lo, hi + 1))
    # Control characters carry no glyph and only confuse the report.
    keep = {c for c in keep if c >= 0x20}

    OUT.mkdir(parents=True, exist_ok=True)
    unicodes = ",".join(f"U+{c:04X}" for c in sorted(keep))

    total_before = 0
    total_after = 0
    for ttf, woff2 in FACES.items():
        source = SRC / ttf
        if not source.exists():
            raise SystemExit(f"source font not found: {source}")
        target = OUT / woff2
        was = target.stat().st_size if target.exists() else 0

        subprocess.run(
            [
                sys.executable, "-m", "fontTools.subset", str(source),
                f"--unicodes={unicodes}",
                "--flavor=woff2",
                f"--output-file={target}",
                # Keep the shaping tables that make text look right: ligatures,
                # kerning, and the numeral features the reader's tables use.
                "--layout-features=kern,liga,clig,calt,tnum,onum,frac",
                "--no-hinting",
                "--desubroutinize",
                "--drop-tables+=DSIG",
            ],
            check=True,
        )

        now = target.stat().st_size
        total_before += was
        total_after += now
        print(f"  {woff2:<26} {was/1024:6.0f} KB -> {now/1024:5.0f} KB")

    print(f"\n  characters in the course content : {before_content}")
    print(f"  codepoints kept in the subset    : {len(keep)}")
    print(f"  total {total_before/1024:.0f} KB -> {total_after/1024:.0f} KB "
          f"({(1 - total_after/total_before) * 100:.0f}% smaller)")


if __name__ == "__main__":
    main()
