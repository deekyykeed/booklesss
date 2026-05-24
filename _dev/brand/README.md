# Brand assets

Logo and brand image assets the PDF build (and marketing) consume.
Mirrors `_dev/fonts/` — build-time assets live under `_dev/`.

## Drop logos here

| File | Size | Use |
|------|------|-----|
| `booklesss-logo-black.png` | 239×62 | Wordmark (diamond + "Booklesss"), black — for light pages |
| `booklesss-logo-white.png` | 239×62 | Wordmark, white — used on the dark CF cover |
| `booklesss-mark-black.png` | 34×34 | Diamond mark only, black |
| `booklesss-mark-white.png` | 34×34 | Diamond mark only, white |

The CF cover is deep forest `#0F2A1E`, so the cover uses the **white** wordmark
(`build_cf_1_1...py` reads `LOGO_WHITE` from here); light body pages can use the
black versions.

White versions are pre-generated from the black source (white fill + original
alpha), not built on the fly. To regenerate after swapping a logo:

```python
from PIL import Image
img = Image.open("booklesss-logo-black.png").convert("RGBA")
w = Image.new("RGBA", img.size, (255,255,255,0)); w.putalpha(img.split()[3])
w.save("booklesss-logo-white.png")
```
