/* Day carousels — renders the day's three 9:16 carousels straight to
 * posts/<DAY>/{morning,afternoon,evening}/NN.png.
 *
 * Self-contained: crops come from _source/carousel-crops, fonts are the vendored
 * copies in _source/fonts (embedded as data: URIs). No build, no running server.
 *
 *   node _scripts/5-day-carousels.mjs            # DAY defaults below
 *   DAY=2026-07-26 node _scripts/5-day-carousels.mjs
 *
 * All light. Dark backgrounds wait until the app ships a real dark mode — a light
 * screenshot on a dark canvas doesn't sit right. Edit SLOTS copy, then re-run.
 */
import { chromium, CROPS, POSTS, INTER_DATA, FAMILJEN_DATA, dayFolder } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DAY = process.env.DAY || new Date().toLocaleDateString("en-CA"); // today, local (YYYY-MM-DD)
// e.g. posts/2026-W30 (Jul 20-26)/2026-07-25 Saturday/ — weekday named, grouped by week
const OUT = path.join(POSTS, dayFolder(DAY).rel);
fs.mkdirSync(OUT, { recursive: true });   // keep any existing PLAN.md; only the slot dirs are cleared below

const uri = (f) => "data:image/png;base64," + fs.readFileSync(path.join(CROPS, f)).toString("base64");
const IMG = Object.fromEntries(
  fs.readdirSync(CROPS).filter((f) => f.endsWith(".png")).map((f) => [f.replace(".png", ""), uri(f)]),
);
// Solar Bold Duotone "Bolt" (same icon family as the app's own logo), brand-recoloured
const FLASH = fs.readFileSync(path.join(CROPS, "solar-bolt.svg"), "utf8").replace(/<desc>[\s\S]*?<\/desc>/, "");

// vendored fonts, embedded so nothing has to be served
const INTER = INTER_DATA();
const FAMILJEN = FAMILJEN_DATA();

const SAFE = { left: 88, right: 150 };
const H = 1920;   // 9:16 — full-screen vertical (Reels / TikTok / Stories)

const LOGO = (s, dark) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">
<path d="M3.46484 20.5359c1.46447 1.4645 3.82149 1.4645 8.53556 1.4645 4.714 0 7.071 0 8.5355 -1.4645 1.4645 -1.4645 1.4645 -3.8215 1.4645 -8.5355 0 -4.71407 0 -7.07109 -1.4645 -8.53556L3.46484 20.5359Z" fill="${dark ? "#9a9aa0" : "#737374"}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355L20.5355 3.46447C19.0711 2 16.714 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447Z" fill="${dark ? "#ffffff" : "#000000"}"/></svg>`;

// canonical four-colour Google "G"
const GOOGLE_G = `<svg viewBox="0 0 48 48" width="54" height="54" xmlns="http://www.w3.org/2000/svg">
<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const LENS = `<svg width="46" height="46" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#4285F4" stroke-width="2"/><path d="m20 20-3.2-3.2" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/></svg>`;

const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter><rect width="220" height="220" filter="url(#n)" opacity="0.5"/></svg>`,
  );

const BASE_CSS = `
@font-face{font-family:PSans;src:url(${INTER}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:PDisplay;src:url(${FAMILJEN}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:${H}px;overflow:hidden}
body{font-family:PSans,system-ui,sans-serif;position:relative;-webkit-font-smoothing:antialiased}
.bg{position:absolute;inset:0;z-index:0}
.grain{position:absolute;inset:0;z-index:3;pointer-events:none;background-image:url("${GRAIN}");background-size:220px 220px;opacity:.30;mix-blend-mode:overlay}
.layer{position:absolute;inset:0;z-index:2}
.wm{position:absolute;left:${SAFE.left}px;top:300px;display:flex;align-items:center;gap:13px;z-index:5}
.wm span{font-size:27px;font-weight:600;letter-spacing:-.022em}
.eyebrow{font-size:22px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
h1{font-family:PDisplay,PSans,sans-serif;font-weight:500;letter-spacing:-.035em}
.sub{letter-spacing:-.012em}
.body{font-size:34px;line-height:1.5;letter-spacing:-.006em}
`;

const LIGHT_BG = `<div class="bg" style="background:
  radial-gradient(1000px 780px at 92% 2%, rgba(139,124,255,.38), transparent 60%),
  radial-gradient(820px 700px at -8% 64%, rgba(96,166,255,.30), transparent 62%),
  radial-gradient(760px 560px at 62% 104%, rgba(255,176,124,.22), transparent 60%),
  linear-gradient(#FCFCFD,#F3F4F7);"></div><div class="grain"></div>`;
const DARK_BG = `<div class="bg" style="background:
  radial-gradient(1100px 820px at 88% 0%, rgba(139,124,255,.34), transparent 58%),
  radial-gradient(900px 720px at -10% 72%, rgba(72,132,224,.26), transparent 60%),
  radial-gradient(700px 560px at 60% 110%, rgba(255,150,90,.12), transparent 60%),
  linear-gradient(#141419,#0C0C10);"></div><div class="grain" style="opacity:.22"></div>`;

const ink = (d) => (d ? "#F4F4F7" : "#0D0D0F");
const subc = (d) => (d ? "rgba(233,233,238,.64)" : "#6A6A72");
const eyec = (d) => (d ? "#A99BFF" : "#6C4CF0");
const wordmark = (d) => `<div class="wm" style="color:${ink(d)}">${LOGO(32, d)}<span>Bklsss</span></div>`;

/* ---- boxless templates ---- */
function cover(o) {
  const d = !!o.dark;
  return { dark: d, html: `<div class="layer">
    <div class="eyebrow" style="position:absolute;left:${SAFE.left}px;top:560px;color:${eyec(d)}">${o.eyebrow}</div>
    <h1 style="position:absolute;left:${SAFE.left}px;top:612px;font-size:122px;line-height:.96;color:${ink(d)}">${o.title}</h1>
    <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right + 8}px;top:${o.subTop || 1030}px;font-size:33px;line-height:1.4;color:${subc(d)}">${o.sub}</p>
  </div>` };
}
// the signature: crop bleeds off the bottom, faded at top — NO container
function bleed(o) {
  const d = !!o.dark;
  return { dark: d, html: `<div class="layer">
    <h1 style="position:absolute;left:${SAFE.left}px;top:430px;font-size:100px;line-height:1.0;color:${ink(d)}">${o.title}</h1>
    <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right + 8}px;top:${o.subTop || 690}px;font-size:30px;line-height:1.42;color:${subc(d)}">${o.sub || ""}</p>
    <div style="position:absolute;left:0;right:0;top:${o.imgTop}px;bottom:0;overflow:hidden;
      -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 160px);
      mask-image:linear-gradient(to bottom,transparent 0,#000 160px)">
      <img src="${o.img}" style="position:absolute;display:block;width:${o.imgW}px;left:${o.imgL || 0}px;top:0">
    </div>
  </div>` };
}
function promise(o) {
  const d = !!o.dark;
  return { dark: d, html: `<div class="layer">
    <div style="position:absolute;left:${SAFE.left}px;top:600px;width:104px;height:104px">${FLASH.replace("<svg ", '<svg width="104" height="104" ')}</div>
    <h1 style="position:absolute;left:${SAFE.left}px;top:760px;font-size:112px;line-height:.98;color:${ink(d)}">${o.title}</h1>
    <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:${o.lineTop || 1080}px;font-size:34px;line-height:1.4;color:${subc(d)}">${o.line}</p>
  </div>` };
}
// the CTA: a Google search bar with "booklesss" typed. No button.
function searchCTA(o) {
  const d = !!o.dark;
  return { dark: d, html: `<div class="layer">
    <h1 style="position:absolute;left:${SAFE.left}px;top:470px;font-size:104px;line-height:.98;color:${ink(d)}">Search<br>booklesss.</h1>
    <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:760px;font-size:31px;line-height:1.4;color:${subc(d)}">Three s&rsquo;s. We&rsquo;re the first result on Google.</p>
    <div style="position:absolute;left:${SAFE.left}px;right:${SAFE.left}px;top:880px;height:132px;background:#fff;border:1px solid #e6e6ea;border-radius:66px;
      box-shadow:0 2px 4px rgba(20,20,40,.05),0 18px 40px -14px rgba(20,20,50,.22);display:flex;align-items:center;gap:28px;padding:0 44px">
      <span style="display:flex;flex-shrink:0">${GOOGLE_G}</span>
      <span style="font-size:47px;color:#3c4043;letter-spacing:-.01em">bookle<b style="font-weight:800;color:#202124">sss</b><span style="display:inline-block;width:3px;height:46px;background:#4285F4;margin-left:4px;vertical-align:-8px"></span></span>
      <span style="margin-left:auto;display:flex;flex-shrink:0">${LENS}</span>
    </div>
    <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:1090px;font-size:31px;line-height:1.45;color:${subc(d)}">Or DM me <b style="color:${ink(d)}">&ldquo;link&rdquo;</b> &mdash; I&rsquo;ll send it straight over. &#128071;</p>
  </div>` };
}
// full clear app — NOT faded at the top, just the actual app (soft bottom edge only)
function full(o) {
  const d = !!o.dark;
  return { dark: d, html: `<div class="layer">
    <h1 style="position:absolute;left:${SAFE.left}px;top:430px;font-size:96px;line-height:1.0;color:${ink(d)}">${o.title}</h1>
    <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right + 8}px;top:${o.subTop || 660}px;font-size:30px;line-height:1.42;color:${subc(d)}">${o.sub || ""}</p>
    <div style="position:absolute;left:0;right:0;top:${o.top}px;bottom:0;overflow:hidden;
      -webkit-mask-image:linear-gradient(to top,transparent 0,#000 150px);mask-image:linear-gradient(to top,transparent 0,#000 150px)">
      <img src="${o.img}" style="position:absolute;display:block;width:${o.imgW}px;left:${o.imgL || 0}px;top:0">
    </div>
  </div>` };
}

/* crop geometries — all neutral/multi-subject, all SUPERZOOMS into a specific
 * area of interest (never the whole app). All light: dark bg waits for the app
 * to get a real dark mode. */
const B_ACTIVE = { img: IMG["active-neu"], imgW: 1080, imgL: 0, imgTop: 944 };   // the fave: selected-lesson pill
const B_SUBJECTS = { img: IMG.subjects, imgW: 900, imgL: 78, imgTop: 1000 };     // the subject shelf
const B_LESSONS = { img: IMG["lessons-neu"], imgW: 1080, imgL: 0, imgTop: 900 }; // a subject's lesson list
const B_TOC = { img: IMG.toc, imgW: 1560, imgL: -20, imgTop: 1000 };             // the on-this-page outline
const B_READER = { img: IMG["reader-neu"], imgW: 1440, imgL: -150, imgTop: 1010 };// a lesson's heading + lead

/* ---- the day: three light carousels (>=4 each). About Booklesss the
 *      platform — every subject, never one course. All superzoom + type. ---- */
const SLOTS = {
  morning: [
    cover({ eyebrow: "One home for everything", title: "All your notes.<br>Sorted.", sub: "Every course, every lesson &mdash; finally in one place." }),
    bleed({ ...B_SUBJECTS, title: "Every subject,<br>side by side.", sub: "Switch between them in a tap." }),
    bleed({ ...B_LESSONS, title: "Know exactly<br>what&rsquo;s next.", sub: "A clear path from the first lesson to the last." }),
    promise({ title: "Studying,<br>without the mess.", line: "Open it and you&rsquo;re already sorted." }),
    searchCTA({}),
  ],
  afternoon: [
    cover({ eyebrow: "Built to be read", title: "Notes you&rsquo;ll<br>actually read.", sub: "Plain English. Clean pages. Nothing in the way.", subTop: 1010 }),
    bleed({ ...B_READER, title: "Made for<br>reading.", sub: "Every lesson, calm and clear." }),
    bleed({ ...B_ACTIVE, title: "It keeps<br>your place.", sub: "Pick up right where you left off." }),
    promise({ title: "Less friction.<br>More learning.", line: "The textbook, minus the pain." }),
    searchCTA({}),
  ],
  evening: [
    cover({ eyebrow: "For people who love good software", title: "We sweat<br>the details.", sub: "The kind of thing you feel before you notice it.", subTop: 1010 }),
    bleed({ ...B_TOC, title: "See the shape<br>of every lesson.", sub: "Overview, key ideas, practice, done." }),
    bleed({ ...B_ACTIVE, title: "A 3px detail<br>we argued over.", sub: "It rides with you, frame-perfect." }),
    promise({ title: "Booklesss.", line: "Learn anything, without the textbook." }),
    searchCTA({}),
  ],
};

/* ---- render ---- */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
for (const [slot, slides] of Object.entries(SLOTS)) {
  const dir = path.join(OUT, slot);
  fs.rmSync(dir, { recursive: true, force: true });   // clear stale images, leave PLAN.md untouched
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const body = (s.dark ? DARK_BG : LIGHT_BG) + s.html + wordmark(s.dark);
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>${body}</body></html>`;
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(dir, `${String(i + 1).padStart(2, "0")}.png`) });
  }
  console.log("  •", slot, `(${slides.length} images)`);
}
await browser.close();
console.log("done ->", OUT);
