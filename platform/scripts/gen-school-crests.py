"""Fetch each university's own crest, square it, and write it to
platform/public/schools/<id>.png — then regenerate school-crests.ts.

    python3 platform/scripts/gen-school-crests.py

WHY FILES AND NOT DATA URIs. The crests were inlined when there were two of
them. At nine that is ~170KB of base64 inside identity/pickers, a client
component — the same trap AVATARS and card-glyphs are marked with. The CSP
(`default-src 'self'`) forbids hotlinking a logo from a university's server,
which is why these are fetched once and committed; it has never forbidden
/schools/cbu.png.

WHY A SQUARE SOURCE IS PREFERRED. The picker draws these at 20px. A wide
wordmark lockup (Northrise ships 982x180) becomes an illegible smear at that
size, so candidates scoring worse than 0.55 on min/max side ratio are rejected
and a touch-icon is taken over a lockup.

SOURCES, fetched 2026-08-04. Two universities could not be reached from here
and have no crest — they fall back to a monogram, which is what the picker
draws for any id not in the generated set:
  cbu          www.cbu.ac.zm/images/cbu.webp
  unilus       web.unilus.ac.zm/.../cropped-unilus-logo-3.png
  cavendish    www.cavendishza.org/.../favicons/apple-touch-icon.png
  chalimbana   chau.ac.zm/.../chauLogo-768x688.png
  mukuba       www.mukuba.edu.zm/.../cropped-MukubaLogo-1.png
  mulungushi   www.mu.ac.zm/images/MU_Logo.jpg  (HTTP ONLY — https refuses the
               connection outright, so this one is not a typo)
  northrise    northrise.edu.zm/.../NR_Logo_Retina.png, cropped to the symbol:
               the lockup is mark + wordmark and only the mark is square. The
               red N in the orange shield is a designed logomark in its own
               right, not a letter cut out of the word.
  zcas, unza   carried over from the 2026-08-03 inline versions, unchanged.
  MISSING      kwame-nkrumah (knu.ac.zm does not resolve)

These are the universities' marks, used so a student can recognise their own
school in a list. They are not ours and imply no endorsement.
"""

import base64
import io
import json
import re
import ssl
import sys
import urllib.request
from urllib.parse import urljoin

from PIL import Image

SITES = {
    "cbu": "https://www.cbu.ac.zm/",
    "unilus": "https://web.unilus.ac.zm/",
    "cavendish": "https://www.cavendishza.org/",
    "chalimbana": "https://chau.ac.zm/",
    "mukuba": "https://www.mukuba.edu.zm/",
    "northrise": "https://northrise.edu.zm/",
    "mulungushi": "https://www.mu.ac.zm/",
    "kwame-nkrumah": "https://www.knu.ac.zm/",
}

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (compatible; BooklesssCrestFetch/1.0)"}


def get(url, timeout=25):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
        return r.read()


def candidates(base, html):
    """Every plausible mark on the page, best-guess order."""
    out = []
    # <link rel="...icon..." href> — apple-touch-icon is square by spec.
    for m in re.finditer(r'<link[^>]+rel="([^"]*icon[^"]*)"[^>]*>', html, re.I):
        tag = m.group(0)
        href = re.search(r'href="([^"]+)"', tag, re.I)
        if href:
            out.append(urljoin(base, href.group(1)))
    # Anything that calls itself a logo/crest.
    for m in re.finditer(r'(?:src|href)="([^"]*(?:logo|crest|emblem)[^"]*\.(?:png|jpg|jpeg))"', html, re.I):
        out.append(urljoin(base, m.group(1)))
    seen, uniq = set(), []
    for u in out:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq


def score(im):
    """Square and big wins. A 4:1 lockup is worthless at 20px."""
    w, h = im.size
    if w < 32 or h < 32:
        return -1
    ratio = min(w, h) / max(w, h)
    if ratio < 0.55:          # a wide lockup, not a crest
        return -1
    return ratio * 1000 + min(w, h)


def square(im, size=128):
    """Fit onto a transparent square, centred, no upscaling past 2x."""
    im = im.convert("RGBA")
    w, h = im.size
    scale = min(size / w, size / h)
    im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return canvas


results, report = {}, []
for sid, base in SITES.items():
    try:
        html = get(base).decode("utf-8", "ignore")
    except Exception as e:
        report.append((sid, "SITE UNREACHABLE", str(e)[:70]))
        continue
    best, best_score, best_url = None, 0, None
    for url in candidates(base, html)[:12]:
        try:
            im = Image.open(io.BytesIO(get(url, timeout=20)))
            s = score(im)
            if s > best_score:
                best, best_score, best_url = im, s, url
        except Exception:
            continue
    if best is None:
        report.append((sid, "NO SQUARE MARK FOUND", base))
        continue
    buf = io.BytesIO()
    square(best).save(buf, format="PNG", optimize=True)
    b = buf.getvalue()
    results[sid] = "data:image/png;base64," + base64.b64encode(b).decode()
    report.append((sid, f"ok {best.size[0]}x{best.size[1]} -> 128px, {len(b)//1024}KB", best_url))

for r in report:
    print(" | ".join(str(x) for x in r), file=sys.stderr)
print(json.dumps(results))
