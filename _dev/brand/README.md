# Brand assets

Logo and brand image assets the PDF build (and marketing) consume.
Mirrors `_dev/fonts/` — build-time assets live under `_dev/`.
The top-level `Brand/` folder is a raw drop zone; nothing reads from it.

## Two identities are live — know which one you are reaching for

**Booklesss serif + diamond** is the older one and still the only one on paper:
~19 PDF build scripts draw it. **Bklsss**, the word alone, is the newer one
(owner's call, 2026-08-03) and is on every screen a stranger meets — the social
posters and the link-preview cards. Neither has replaced the other yet. Which
one wins is an open decision, not a design; do not quietly propagate one onto
the other's surfaces.

### The word — `Bklsss` (screens)

| File | Use |
|------|-----|
| `booklesss-wordmark-black.svg` | The logo. Outlined paths, no font needed. Use this by default. |
| `booklesss-wordmark-white.svg` | Same, for dark grounds |
| `booklesss-wordmark-black.png` | 981×312, transparent — for anything that can't take SVG |
| `booklesss-wordmark-white.png` | Same, white |

Set in **Familjen Grotesk Bold (700)**, tracking **−0.031 em**, ink `#121212`,
aspect **3.96 : 1**. That is the OG card's spec (`platform/src/lib/og.tsx`),
which is the surface that chose the wordmark deliberately.

**The two live surfaces do not agree on the face.** `og.tsx` sets it in
Familjen Grotesk; `Demand/social/_scripts/prog-post.mjs` lets `.wm span`
inherit the body, which is **Inter** 700. The files here follow `og.tsx`. If
the posters are the reference instead, regenerate against `Inter` and say so
here — right now the two differ by a face nobody chose.

Regenerate (after a font swap, or to settle the face above) with the script
kept beside this note:

```bash
python _dev/brand/build_wordmark.py
```

### The serif + diamond (paper)

| File | Size | Use |
|------|------|-----|
| `booklesss-logo-black.png` | 239×62 | Lockup (diamond + "Booklesss"), black — for light pages |
| `booklesss-logo-white.png` | 239×62 | Lockup, white — for dark covers |
| `booklesss-mark-black.png` | 34×34 | Diamond mark only, black |
| `booklesss-mark-white.png` | 34×34 | Diamond mark only, white |

Every course cover is cream `#FFFDE8` and takes the **black** lockup. The white
pair predates that and is kept for any dark ground that turns up.

White versions are pre-generated from the black source (white fill + original
alpha), not built on the fly. To regenerate after swapping a logo:

```python
from PIL import Image
img = Image.open("booklesss-logo-black.png").convert("RGBA")
w = Image.new("RGBA", img.size, (255,255,255,0)); w.putalpha(img.split()[3])
w.save("booklesss-logo-white.png")
```

### Paper texture

`grain.png` — the film grain painted over every PDF page. ~3px, coarse on
purpose; a finer grain disappears at print size.
