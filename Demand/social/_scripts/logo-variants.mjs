/* Logo variants — a set of 9:16 posters that are nothing but the logo.
 *
 *   node _scripts/logo-variants.mjs            # -> today's folder, 6-logo/
 *   DAY=2026-08-04 node _scripts/logo-variants.mjs
 *
 * NO COPY ON ANY SLIDE (owner, 2026-08-03: "i dont add text like this anymore
 * — dont add any text"). Not a headline, not an eyebrow, not the corner stamp,
 * not a CTA. The whole post is the mark. The call to action lives in the
 * caption, which is the one place text still belongs.
 *
 * This is deliberately NOT a `prog-post.mjs` config. That file renders posts
 * about the product, and every slide type it owns carries either copy or the
 * corner wordmark. These are brand plates: one object, one ground, no chrome.
 *
 * The word is set two ways on purpose. "Bklsss" is the logo, and "Booklesss" is
 * the name — a reader who has only ever seen the abbreviation needs the long
 * form somewhere or the two never connect. Both are Familjen Grotesk Bold, the
 * same face `Brand/build_brand.py` draws the shipped files from.
 *
 * THE SAFE BOX STILL APPLIES to anything meant to be read: x 96–848, y
 * 300–1400, because the feed draws its own furniture over the rest. Each plate
 * declares `safe: true` and is measured, exactly as `prog-post.mjs` measures
 * its text. The macro plates opt out with `safe: false` — a letterform enlarged
 * past the frame is texture rather than a word, so there is nothing to keep
 * clear of a share button, and cropping it to the safe box would just make it
 * a small letter in a big empty frame.
 */
import { chromium, POSTS, FAMILJEN_DATA, dayFolder } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DAY = process.env.DAY || new Date().toLocaleDateString("en-CA");
const SLOT = process.env.SLOT || "6-logo";
const FAMILJEN = FAMILJEN_DATA();

const INK = "#0D0D0F";       // the poster black
const TILE = "#0b0b0b";      // the app's solid black, what the icon tile wears
const PAPER = "#FFFFFF";
const PURPLE = "#6C4CF0";    // the eyebrow purple, the only brand hue
const CREAM = "#FFFDE8";     // the paper every course cover is printed on

const SAFE = { top: 300, bottom: 1400, left: 96, right: 232 };

/* The brand gradient, lifted off prog-post.mjs so a plate and a carousel slide
 * sit on the same ground. */
const GRADIENT =
  `radial-gradient(1200px 900px at 88% 6%, rgba(139,124,255,.28), transparent 62%),` +
  `radial-gradient(1000px 820px at -8% 84%, rgba(96,166,255,.24), transparent 64%),` +
  `radial-gradient(900px 700px at 62% 104%, rgba(255,176,124,.20), transparent 62%),` +
  `linear-gradient(#FCFCFD,#F2F3F6)`;

const CSS = `
@font-face{font-family:FG;src:url(${FAMILJEN}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:FG,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
/* Centred on the SAFE box, not the frame: the right rail eats 232px and the
   left margin 96, so the readable centre is x=472. Centring on 540 pushes
   everything towards the share buttons. */
.safebox{position:absolute;left:${SAFE.left}px;top:${SAFE.top}px;
  width:${1080 - SAFE.left - SAFE.right}px;height:${SAFE.bottom - SAFE.top}px;
  display:flex;align-items:center;justify-content:center}
.w{font-weight:700;letter-spacing:-.031em;line-height:.82;white-space:nowrap}
.tile{display:flex;align-items:center;justify-content:center}
`;

/* Each plate is { name, bg, html, safe }. `bg` is a CSS background shorthand. */
const word = (t, o = {}) =>
  `<span class="w" style="font-size:${o.size}px;color:${o.color};` +
  `letter-spacing:${o.track ?? -0.031}em;${o.extra || ""}">${t}</span>`;

const PLATES = [
  // ---- the logo, plainly, on each of the three grounds it is allowed ----
  { name: "01-mark-light", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: INK })}</div>` },

  { name: "02-mark-dark", bg: TILE, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: PAPER })}</div>` },

  { name: "03-mark-cream", bg: CREAM, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: INK })}</div>` },

  { name: "04-mark-purple", bg: PURPLE, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: PAPER })}</div>` },

  // ---- the name in full, so the abbreviation has something to attach to ----
  { name: "05-name-light", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${word("Booklesss", { size: 150, color: INK })}</div>` },

  { name: "06-name-dark", bg: TILE, safe: true,
    html: `<div class="safebox">${word("Booklesss", { size: 150, color: PAPER })}</div>` },

  /* The two forms on one plate, stacked and optically matched: the short word
     set larger so both occupy the same measure, which is the whole point —
     they are the same object at two lengths, not two logos. */
  { name: "07-both", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div style="display:flex;flex-direction:column;gap:44px;align-items:flex-start">
      ${word("Booklesss", { size: 132, color: INK })}
      ${word("Bklsss", { size: 208, color: INK })}
    </div></div>` },

  // ---- the app icon, as it ships ----
  { name: "08-icon", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div class="tile" style="width:700px;height:700px;background:${TILE};
      box-shadow:0 3px 6px rgba(24,24,45,.07),0 22px 44px rgba(24,24,45,.12)">
      ${word("Bklsss", { size: 168, color: PAPER, track: -0.06 })}</div></div>` },

  { name: "09-icon-round", bg: GRADIENT, safe: true,
    html: `<div class="safebox"><div class="tile" style="width:700px;height:700px;background:${TILE};
      border-radius:158px;box-shadow:0 3px 6px rgba(24,24,45,.07),0 22px 44px rgba(24,24,45,.12)">
      ${word("Bklsss", { size: 150, color: PAPER, track: -0.06 })}</div></div>` },

  /* Outline. The wordmark reduced to its own edge — the shape is familiar
     enough by now to survive losing its fill, and it is the one treatment that
     shows the letterforms rather than the word. */
  { name: "10-outline", bg: GRADIENT, safe: true,
    html: `<div class="safebox">${word("Bklsss", { size: 232, color: "transparent",
      extra: `-webkit-text-stroke:3px ${INK}` })}</div>` },

  /* Macro. Enlarged past the frame on purpose — at this scale it is texture,
     not a word, so the safe box does not apply (see the header note). The
     letters are placed by translate rather than by cropping an image, so the
     curve stays vector-sharp at any output size. */
  { name: "11-macro-b", bg: CREAM, safe: false,
    html: `<div class="frame"><span class="w" style="font-size:2400px;color:${INK};
      transform:translate(-2%,4%)">B</span></div>` },

  { name: "12-macro-sss", bg: TILE, safe: false,
    html: `<div class="frame"><span class="w" style="font-size:1500px;color:${PAPER};
      letter-spacing:-.06em;transform:translate(0,2%)">sss</span></div>` },

  /* Bleed. The word wider than the frame, cropped by it — legible because the
     eye completes a familiar shape, and the first and last letters are the
     ones it can most afford to lose. */
  { name: "13-bleed", bg: GRADIENT, safe: false,
    html: `<div class="frame">${word("Bklsss", { size: 460, color: INK })}</div>` },

  /* Vertical. One letter per line, tight — the only arrangement here that is
     not the logo's own lockup, and it reads as a spine or a banner rather than
     as a signature. */
  { name: "14-vertical", bg: TILE, safe: true,
    html: `<div class="safebox"><div style="display:flex;flex-direction:column;align-items:center;line-height:.86">
      ${["B", "k", "l", "s", "s", "s"].map((c) =>
        `<span class="w" style="font-size:168px;color:${PAPER}">${c}</span>`).join("")}
    </div></div>` },

  /* Repeat. The mark as a field rather than a signature — low contrast so it
     reads as paper the brand is printed on. */
  { name: "15-field", bg: GRADIENT, safe: false,
    html: `<div class="frame"><div style="display:flex;flex-direction:column;gap:36px;transform:rotate(-8deg) scale(1.5)">
      ${Array.from({ length: 11 }, (_, i) =>
        `<span class="w" style="font-size:108px;color:${INK};opacity:${i % 2 ? 0.1 : 0.16};
          margin-left:${(i % 3) * 90 - 90}px">Bklsss Bklsss Bklsss</span>`).join("")}
    </div></div>` },

  /* Knockout. The word cut out of a solid field so the gradient shows through
     it — the mark as an aperture. `background-clip:text` on the ground itself,
     which is why the ground is a layer here rather than the body's background. */
  { name: "16-knockout", bg: TILE, safe: true,
    html: `<div class="safebox"><span class="w" style="font-size:232px;
      background:${GRADIENT};-webkit-background-clip:text;background-clip:text;color:transparent">Bklsss</span></div>` },
];

const OUT = path.join(POSTS, dayFolder(DAY).rel, SLOT);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });

for (const p of PLATES) {
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>` +
      `<body style="background:${p.bg}">${p.html}</body></html>`,
    { waitUntil: "load" },
  );
  await page.evaluate(() => document.fonts.ready);

  /* Same check prog-post.mjs runs on its copy, for the same reason: a mark
     under the share rail is a mark nobody sees. Only the plates that claim to
     be readable are measured — see the header note on the macro ones. */
  if (p.safe) {
    const spill = await page.evaluate((safe) => {
      const el = document.querySelector(".safebox > *");
      const r = el.getBoundingClientRect();
      const bad = [];
      if (r.top < safe.top) bad.push(`${Math.ceil(safe.top - r.top)}px above the top`);
      if (r.bottom > safe.bottom) bad.push(`${Math.ceil(r.bottom - safe.bottom)}px below the bottom`);
      if (r.left < safe.left) bad.push(`${Math.ceil(safe.left - r.left)}px past the left`);
      if (r.right > 1080 - safe.right) bad.push(`${Math.ceil(r.right - (1080 - safe.right))}px under the right rail`);
      return bad;
    }, SAFE);
    if (spill.length) {
      throw new Error(
        `plate "${p.name}" leaves the safe area — ${spill.join(", ")}\n` +
          `Drop its font-size. Do not widen the safe area.`,
      );
    }
  }

  await page.screenshot({ path: path.join(OUT, `${p.name}.png`) });
}

await browser.close();
console.log(`done -> ${OUT} (${PLATES.length} plates)`);
