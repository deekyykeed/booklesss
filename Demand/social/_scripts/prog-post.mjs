/* Progress posts — build-in-public carousels about real features, shot from the
 * live app (mobile). 9:16, light. FULL-BLEED: the app screenshot fills the frame
 * (no cards / no boxes), zoomed into the part that matters, with a soft fade only
 * where the headline sits so the text stays readable. Honest framing: the AI
 * tutor is in preview, so the copy says "building this", not "it answers".
 *
 *   node _scripts/prog-post.mjs                 # POST=aitutor -> afternoon
 *   POST=reading node _scripts/prog-post.mjs    # -> evening
 *
 * Shots come from _source/feature-capture/ (run cap-feature.mjs first, dev up). */
import { chromium, POSTS, SOURCE, INTER_DATA, FAMILJEN_DATA, dayFolder } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DAY = process.env.DAY || new Date().toLocaleDateString("en-CA");
const POST = process.env.POST || "aitutor";

const CAP = path.join(SOURCE, "feature-capture");
const img = (f) => "data:image/png;base64," + fs.readFileSync(path.join(CAP, f)).toString("base64");
const AF_PAGE = img("af-page.png");
const AF_VOICE = img("af-voice.png");
const AF_TYPED = img("af-typed.png");
const EV_NAV = img("ev-nav.png");
const EV_READER = img("ev-reader.png");

const INTER = INTER_DATA();
const FAMILJEN = FAMILJEN_DATA();
const SAFE = { left: 88, right: 150 };
const INK = "#0D0D0F", SUB = "#5F5F68", EYE = "#6C4CF0", BG = "#F6F6F9";

const LOGO = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">
<path d="M3.46484 20.5359c1.46447 1.4645 3.82149 1.4645 8.53556 1.4645 4.714 0 7.071 0 8.5355 -1.4645 1.4645 -1.4645 1.4645 -3.8215 1.4645 -8.5355 0 -4.71407 0 -7.07109 -1.4645 -8.53556L3.46484 20.5359Z" fill="#737374"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355L20.5355 3.46447C19.0711 2 16.714 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447Z" fill="#000000"/></svg>`;

const GOOGLE_G = `<svg viewBox="0 0 48 48" width="54" height="54" xmlns="http://www.w3.org/2000/svg">
<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const LENS = `<svg width="46" height="46" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#4285F4" stroke-width="2"/><path d="m20 20-3.2-3.2" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/></svg>`;

const GRAIN = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter><rect width="220" height="220" filter="url(#n)" opacity="0.5"/></svg>`);

const CSS = `
@font-face{font-family:PSans;src:url(${INTER}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:PDisplay;src:url(${FAMILJEN}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:PSans,system-ui,sans-serif;position:relative;-webkit-font-smoothing:antialiased;background:${BG}}
.gradient{position:absolute;inset:0;z-index:0;background:
  radial-gradient(1000px 780px at 92% 2%, rgba(139,124,255,.30), transparent 60%),
  radial-gradient(820px 700px at -8% 64%, rgba(96,166,255,.24), transparent 62%),
  radial-gradient(760px 560px at 62% 104%, rgba(255,176,124,.18), transparent 60%),
  linear-gradient(#FCFCFD,#F2F3F6)}
.grain{position:absolute;inset:0;z-index:6;pointer-events:none;background-image:url("${GRAIN}");background-size:220px 220px;opacity:.26;mix-blend-mode:overlay}
.layer{position:absolute;inset:0;z-index:4}
.shot{position:absolute;inset:0;z-index:1;width:100%;height:100%;object-fit:cover}
/* the app dissolves up into the light where the headline sits — text-legible top,
   sharp app below. No card, no border. */
.fade{position:absolute;inset:0;z-index:2;background:linear-gradient(to bottom,
  ${BG} 0%, ${BG} 40%, rgba(246,246,249,0) 68%)}
.wm{position:absolute;left:${SAFE.left}px;top:300px;display:flex;align-items:center;gap:13px;z-index:7;color:${INK}}
.wm span{font-size:27px;font-weight:600;letter-spacing:-.022em}
.eyebrow{font-size:24px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${EYE}}
h1{font-family:PDisplay,PSans,sans-serif;font-weight:500;letter-spacing:-.035em;color:${INK}}
.sub{letter-spacing:-.008em;color:${SUB}}
`;

const wordmark = `<div class="wm">${LOGO(32)}<span>Bklsss</span></div>`;

// text-only slide (cover / closer) — sits on the brand gradient
const cover = (o) => ({ bg: "gradient", html: `<div class="layer">
  <div class="eyebrow" style="position:absolute;left:${SAFE.left}px;top:560px">${o.eyebrow}</div>
  <h1 style="position:absolute;left:${SAFE.left}px;top:612px;font-size:118px;line-height:.98">${o.title}</h1>
  <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right + 8}px;top:${o.subTop || 1040}px;font-size:38px;line-height:1.42">${o.sub}</p>
</div>` });

// full-bleed app shot, faded at the top for the headline
const feature = (o) => ({ bg: "shot", img: o.img, pos: o.pos || "center bottom", html: `<div class="layer">
  <h1 style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:${o.h1 || 360}px;font-size:${o.size || 106}px;line-height:1.0">${o.title}</h1>
  <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right + 8}px;top:${o.subTop || 660}px;font-size:${o.subSize || 39}px;line-height:1.4">${o.sub || ""}</p>
</div>` });

// closing Google search CTA — DM (never comment), trimmed, bigger sub
const searchCTA = () => ({ bg: "gradient", html: `<div class="layer">
  <h1 style="position:absolute;left:${SAFE.left}px;top:470px;font-size:104px;line-height:.98">Search<br>booklesss.</h1>
  <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:770px;font-size:38px;line-height:1.35">Three s&rsquo;s. We&rsquo;re the first result on Google.</p>
  <div style="position:absolute;left:${SAFE.left}px;right:${SAFE.left}px;top:895px;height:132px;background:#fff;border:1px solid #e6e6ea;border-radius:66px;box-shadow:0 2px 4px rgba(20,20,40,.05),0 18px 40px -14px rgba(20,20,50,.22);display:flex;align-items:center;gap:28px;padding:0 44px">
    <span style="display:flex;flex-shrink:0">${GOOGLE_G}</span>
    <span style="font-size:47px;color:#3c4043;letter-spacing:-.01em">bookle<b style="font-weight:800;color:#202124">sss</b><span style="display:inline-block;width:3px;height:46px;background:#4285F4;margin-left:4px;vertical-align:-8px"></span></span>
    <span style="margin-left:auto;display:flex;flex-shrink:0">${LENS}</span>
  </div>
  <p class="sub" style="position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;top:1110px;font-size:40px;line-height:1.35;color:${INK}">Or DM me <b>&ldquo;link&rdquo;</b>. &#128071;</p>
</div>` });

/* ---- posts ---- */
const CONFIGS = {
  aitutor: {
    slot: "afternoon",
    slides: [
      cover({ eyebrow: "Building in public", title: "An AI tutor,<br>in your notes.", sub: "A look at what we&rsquo;re wiring into the reader right now." }),
      feature({ img: AF_PAGE, title: "It lives right<br>in the page.", sub: "No new tab &mdash; it knows the exact step you&rsquo;re on.", pos: "center bottom" }),
      feature({ img: AF_VOICE, title: "Ask, or just<br>talk to it.", sub: "Voice mode &mdash; speak, and the whole thing lights up.", pos: "center bottom" }),
      feature({ img: AF_TYPED, title: "Or type it<br>out.", sub: "Ask about the exact step, in your own words.", pos: "center bottom" }),
      cover({ eyebrow: "In the works", title: "Coming to<br>Booklesss soon.", sub: "The AI tutor + voice mode &mdash; we&rsquo;re building it now. First look.", subTop: 1020 }),
      searchCTA(),
    ],
  },
  reading: {
    slot: "evening",
    slides: [
      cover({ eyebrow: "Building in public", title: "Your whole<br>course, sorted.", sub: "Every subject in one place &mdash; and actually nice to read." }),
      feature({ img: EV_NAV, title: "Every subject,<br>one tap away.", sub: "Jump anywhere in the course, instantly.", pos: "left top" }),
      feature({ img: EV_READER, title: "Made for<br>reading.", sub: "Plain English, clean pages, nothing in the way.", pos: "left top" }),
      cover({ eyebrow: "In the works", title: "More, every<br>week.", sub: "We&rsquo;re building Booklesss in the open. Follow along.", subTop: 1020 }),
      searchCTA(),
    ],
  },
};

const cfg = CONFIGS[POST];
if (!cfg) throw new Error(`unknown POST "${POST}" (aitutor | reading)`);
const OUT = path.join(POSTS, dayFolder(DAY).rel, cfg.slot);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ---- render ---- */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
for (let i = 0; i < cfg.slides.length; i++) {
  const s = cfg.slides[i];
  const base =
    s.bg === "shot"
      ? `<img class="shot" src="${s.img}" style="object-position:${s.pos}"><div class="fade"></div>`
      : `<div class="gradient"></div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${base}${s.html}${wordmark}<div class="grain"></div></body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, `${String(i + 1).padStart(2, "0")}.png`) });
}
await browser.close();
console.log("done ->", OUT, `(${cfg.slides.length} slides)`);
