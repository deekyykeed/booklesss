/* Step 2 — compose the 9:16 stills (1080x1920 @2x = 2160x3840).
 * Reads marketing/_source, writes marketing/social/0*.png
 *
 * The page is served from the app's own origin so it can use the app's real
 * font files; the crops are inlined as data URIs. */
import fs from "fs";
import path from "path";
import { chromium, BASE, SOURCE, SOCIAL, INTER, FAMILJEN, LOGO } from "./paths.mjs";

fs.mkdirSync(SOCIAL, { recursive: true });
const b64 = (n) => "data:image/png;base64," + fs.readFileSync(path.join(SOURCE, n)).toString("base64");
const SIDEBAR = b64("sidebar.png");
const WINDOW = b64("window.png");
const DETAIL = b64("detail.png");

// Fine film grain — kills gradient banding and stops the flat areas going
// blotchy once a platform re-compresses the upload.
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter><rect width="220" height="220" filter="url(#n)" opacity="0.5"/></svg>`,
  );

const SHELL = (body, extraCss = "") => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:PSans;src:url(${INTER}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:PDisplay;src:url(${FAMILJEN}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
body{
  font-family:PSans,system-ui,sans-serif;color:#171717;background:#F7F7F9;
  position:relative;-webkit-font-smoothing:antialiased;
}
/* ambient light — the lavender/blue cast the app's own canvas carries */
body::before{
  content:"";position:absolute;inset:0;z-index:0;
  background:
    radial-gradient(1000px 780px at 92% -4%, rgba(139,124,255,.38), transparent 60%),
    radial-gradient(820px 700px at -8% 62%, rgba(96,166,255,.30), transparent 62%),
    radial-gradient(760px 560px at 62% 106%, rgba(255,176,124,.22), transparent 60%),
    linear-gradient(#FCFCFD, #F3F4F7);
}
body::after{
  content:"";position:absolute;inset:0;z-index:3;pointer-events:none;
  background-image:url("${GRAIN}");background-size:220px 220px;opacity:.30;mix-blend-mode:overlay;
}
.frame{position:absolute;inset:0;padding:76px;z-index:2}
.brand{display:flex;align-items:center;gap:14px}
.brand .wm{font-size:34px;font-weight:600;letter-spacing:-.022em}
.brand .free{
  font-size:13px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:#525252;
  border:1px solid #D4D4D4;background:#fff;border-radius:999px;padding:6px 11px;line-height:1;
  box-shadow:0 1px 2px rgba(0,0,0,.06)
}
h1{
  font-family:PDisplay,PSans,sans-serif;
  font-weight:500;font-size:92px;line-height:1.0;letter-spacing:-.035em;color:#0D0D0F;
  margin-top:84px;
}
.sub{
  font-size:30px;line-height:1.44;color:#6A6A72;letter-spacing:-.012em;
  max-width:760px;margin-top:28px;
}
.shot{
  position:absolute;border-radius:24px;overflow:hidden;background:#FCFCFC;
  border:1px solid rgba(0,0,0,.05);
  box-shadow:
    0 2px 4px rgba(18,18,38,.04),
    0 14px 28px -10px rgba(18,18,38,.10),
    0 56px 92px -30px rgba(18,18,48,.22);
}
.shot img{display:block;position:absolute}
${extraCss}
</style></head><body><div class="frame">${body}</div></body></html>`;

/* ------------------------------------------------------------------ */

const posters = {
  // 1 — the sidebar as a tall floating panel, bleeding off the bottom edge
  "01-sidebar": SHELL(`
    <div class="brand">${LOGO()}<span class="wm">Bklsss</span><span class="free">Free</span></div>
    <h1>Never lose<br>your place.</h1>
    <p class="sub">The whole course in one rail — always showing exactly where you are.</p>
    <div class="shot" style="left:250px;top:606px;width:580px;height:1400px">
      <img src="${SIDEBAR}" style="width:580px;left:0;top:0">
    </div>
  `),

  // 2 — the product in context, zoomed on the left third
  "02-app": SHELL(`
    <div class="brand">${LOGO()}<span class="wm">Bklsss</span></div>
    <h1>Your whole course,<br>one glance.</h1>
    <p class="sub">Nested chapters, instant jumps, zero page reloads.</p>
    <div class="shot" style="left:44px;top:596px;width:1000px;height:1250px">
      <img src="${WINDOW}" style="width:2000px;left:0;top:0">
    </div>
  `),

  // 3 — macro crop, full-bleed off the bottom, dissolving in at the top
  "03-detail": SHELL(`
    <div class="brand">${LOGO()}<span class="wm">Bklsss</span></div>
    <h1>Details<br>you can feel.</h1>
    <p class="sub">A 3px indicator that slides with you, lesson to lesson.</p>
    <div class="bleed"><img src="${DETAIL}"></div>
  `,
  `h1{font-size:118px;letter-spacing:-.04em}
   .bleed{position:absolute;left:0;right:0;top:924px;bottom:0;overflow:hidden;
     -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 150px);
     mask-image:linear-gradient(to bottom,transparent 0,#000 150px);}
   .bleed img{display:block;width:1080px;position:absolute;left:0;top:0}`),

  // 4 — no copy: a clean plate to caption however you like
  "04-plain": SHELL(`
    <div class="shot" style="left:190px;top:262px;width:700px;height:1990px">
      <img src="${SIDEBAR}" style="width:700px;left:0;top:0">
    </div>
  `),
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });

for (const [name, html] of Object.entries(posters)) {
  await page.route("**/__poster", (r) => r.fulfill({ status: 200, contentType: "text/html", body: html }));
  await page.goto(BASE + "/__poster");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SOCIAL, `${name}.png`) });
  await page.unroute("**/__poster");
  console.log("wrote", name);
}
await browser.close();
