# Brand

Every brand asset lives here. This is the only brand folder — build scripts,
marketing generators and the video project all read from it.

## The logo is the word

**Bklsss.** No mark, no glyph, nothing beside it. Set in Familjen Grotesk Bold.

The serif "Booklesss" lockup and the ◇ diamond were **retired on 2026-08-03**
(owner: *"no more of this diamond square shape — take it off"*). They are gone
from disk and out of all 33 build scripts. Do not reintroduce either, and do
not treat an old PDF still showing them as the reference.

| File | Size | Use |
|------|------|-----|
| `booklesss-wordmark-black.svg` | vector | **The logo.** Use this by default. |
| `booklesss-wordmark-white.svg` | vector | Same, for dark grounds |
| `booklesss-wordmark-black.png` | 1949×507 | For anything that can't take SVG |
| `booklesss-wordmark-white.png` | 1949×507 | Same, white |
| `booklesss-icon.svg` | vector | **The app icon** — the word on a black tile |
| `booklesss-icon-192.png` | 192×192 | The floor; a PWA icon may not be smaller |
| `booklesss-icon-512.png` | 512×512 | |
| `booklesss-icon-1024.png` | 1024×1024 | |

## Nothing here is ever an upscale

Every file is drawn from the font's own outlines by `build_brand.py`. The SVGs
are real paths and have no resolution; each PNG is rendered at its own size
rather than resized from one master. **If you need it bigger than what is here,
use the SVG** — or add the size to `ICON_SIZES` / `LOGO_HEIGHT` and re-run:

```bash
python Brand/build_brand.py
```

That is the whole reason this folder is generated rather than hand-collected.
The old serif lockup existed only at 239×62 and its diamond at 34×34, so
enlarging either turned it to mush — there was no detail in the file to enlarge.

## The specifics

- **Ink** `#121212`, the same black every cover uses.
- **Icon tile** `#0b0b0b` (`--color-btn`, the app's solid black), white word.
- **Tracking** −0.031 em on the logo, −0.060 em on the icon. Tighter on the
  icon because a square tile is bound by *width*: closing the letters up lets
  the same tile draw the word bigger. Keep the icon value in step with
  `platform/scripts/gen-pwa-icons.py`, which owns the app's own icons — if the
  two drift, the browser tab and this folder carry visibly different logos.
- **Aspect** 3.96 : 1 for the logo.

## The disc — on trial, not adopted

| File | Size | Use |
|------|------|-----|
| `booklesss-disc.svg` | vector | The candidate mark |
| `booklesss-disc-192.png` | 192×192 | transparent outside the circle |
| `booklesss-disc-512.png` | 512×512 | |
| `booklesss-disc-1024.png` | 1024×1024 | |

A white **B** on a black circle, underlined, with the rule cut off by the
curve. It is the mark the landing page wears, saved here on the owner's ask
(2026-08-06) so it can be looked at against everything else: *"id like to test
it out and see if i can replace it as the new one later — just the circular
one."*

**Nothing points at these files.** The rule at the top of this README still
stands — the logo is the word — and it stands until the owner replaces it, not
until someone finds a disc in this folder and assumes it won.

Geometry is measured off the live page rather than re-derived: a 50px circle,
the B at font-size 40 on a baseline at y=35, a 5px rule 10px below it, all
clipped by the circle. Those two numbers come from a screenshot, because which
ascender a browser picks for a line box is not a thing to guess at.

⚠️ **It is set in Burbank Big Condensed, which this repo has no licence for.**
Font Bureau retail. The `.woff2` has been in `platform/src/fonts/` since it drew
the old logo, with nothing recording a purchase — unlike Satoshi, whose licence
is written down. Looking at it costs nothing. **Adopting it means buying the web
licence, and foundries commonly treat logo use as a separate grant again.**
Settle that before it replaces anything: a mark is the one asset that is
expensive to change late.

## Why the icon has a tile and the logo does not

`prefers-color-scheme` reports the OS theme, **not** the colour of the surface
the mark is drawn on, and those disagree constantly — Google draws a favicon on
a white card whatever the phone is set to, so a transparent white wordmark
vanishes there in dark mode. A tile reads everywhere. The logo stays
transparent because whatever places it already knows its own background.

## Gone, and not coming back

- **The grain.** `grain.png` was painted over every PDF page; removed from disk
  and from all 33 scripts on 2026-08-03 (owner: *"get rid of the grain"*).
- **`Hero Section.png`, `Default.png`, `Default@4x.png`** — Framer-era exports
  of a site that no longer looks like that.
