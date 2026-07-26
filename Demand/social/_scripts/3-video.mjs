/* Step 3 — record the 9:16 motion clip.
 * Writes marketing/social/05-sidebar-motion.{webm,mp4}
 *
 * The real app runs in an iframe inside a poster-styled stage; a synthetic
 * pointer is drawn over it (the OS cursor isn't captured) and Playwright's
 * real mouse follows it, so hover and click states are genuine. */
import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";
import { createRequire } from "module";
import { chromium, BASE, LESSON, SOCIAL, SCRIPTS, INTER, FAMILJEN, LOGO } from "./paths.mjs";

const VIDDIR = path.join(SCRIPTS, ".rec");
fs.rmSync(VIDDIR, { recursive: true, force: true });
fs.mkdirSync(VIDDIR, { recursive: true });
fs.mkdirSync(SOCIAL, { recursive: true });

/* h264 encoder. Playwright ships an ffmpeg, but it is VP8-only — so this
 * prefers a real one and degrades to "webm only" rather than failing. */
function findFfmpeg() {
  if (process.env.FFMPEG && fs.existsSync(process.env.FFMPEG)) return process.env.FFMPEG;
  for (const from of [import.meta.url, path.join(os.homedir(), "package.json")]) {
    try { return createRequire(from)("ffmpeg-static"); } catch { /* not installed here */ }
  }
  return null;
}

/* Wider than we show on purpose: at 1200 the header's right-hand controls sit
 * outside the crop, so the frame edge lands in body text instead of slicing a
 * button in half. */
const IFRAME_W = 1200;
const IFRAME_H = 900;
const SCALE = 1.6;
const WIN = { left: 60, top: 505, width: 960, height: 1300 };

const STAGE = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:PSans;src:url(${INTER}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:PDisplay;src:url(${FAMILJEN}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:PSans,system-ui,sans-serif;color:#171717;background:#F7F7F9;position:relative;-webkit-font-smoothing:antialiased}
body::before{content:"";position:absolute;inset:0;
  background:
    radial-gradient(1000px 780px at 92% -4%, rgba(139,124,255,.38), transparent 60%),
    radial-gradient(820px 700px at -8% 62%, rgba(96,166,255,.30), transparent 62%),
    radial-gradient(760px 560px at 62% 106%, rgba(255,176,124,.22), transparent 60%),
    linear-gradient(#FCFCFD,#F3F4F7);}
/* full-bleed overlay: must not eat the clicks meant for the app below it */
.frame{position:absolute;inset:0;padding:76px;z-index:2;pointer-events:none}
.brand{display:flex;align-items:center;gap:14px}
.brand .wm{font-size:34px;font-weight:600;letter-spacing:-.022em}
h1{font-family:PDisplay,PSans,sans-serif;font-weight:500;font-size:84px;line-height:1.0;
   letter-spacing:-.035em;color:#0D0D0F;margin-top:78px}
.sub{font-size:29px;line-height:1.4;color:#6A6A72;letter-spacing:-.012em;margin-top:26px}

.win{position:absolute;z-index:3;left:${WIN.left}px;top:${WIN.top}px;width:${WIN.width}px;height:${WIN.height}px;
  border-radius:26px;overflow:hidden;background:#FCFCFC;border:1px solid rgba(0,0,0,.05);
  box-shadow:0 2px 4px rgba(18,18,38,.04),0 14px 28px -10px rgba(18,18,38,.10),0 56px 92px -30px rgba(18,18,48,.22);}
.win iframe{position:absolute;left:0;top:0;width:${IFRAME_W}px;height:${IFRAME_H}px;border:0;
  transform:scale(${SCALE});transform-origin:0 0;}

/* synthetic pointer — the real one isn't captured */
#cur{position:absolute;left:0;top:0;width:30px;height:30px;z-index:9;pointer-events:none;
  transform:translate(-100px,-100px);
  transition:transform 620ms cubic-bezier(.65,.02,.28,1);will-change:transform}
#cur i{position:absolute;inset:0;border-radius:999px;background:rgba(23,23,23,.82);
  box-shadow:0 2px 10px rgba(0,0,0,.28),0 0 0 6px rgba(23,23,23,.10);
  transition:transform 160ms ease}
#cur.press i{transform:scale(.62)}
#cur b{position:absolute;inset:0;border-radius:999px;border:2px solid rgba(23,23,23,.5);opacity:0}
#cur.press b{animation:ping 520ms ease-out}
@keyframes ping{from{opacity:.7;transform:scale(1)}to{opacity:0;transform:scale(2.6)}}
</style></head><body>
<div class="frame">
  <div class="brand">${LOGO()}<span class="wm">Bklsss</span></div>
  <h1>Move through<br>the course.</h1>
  <p class="sub">Nothing reloads. Nothing jumps.</p>
</div>
<div class="win"><iframe id="app" src="${LESSON}"></iframe></div>
<div id="cur"><i></i><b></b></div>
</body></html>`;

const browser = await chromium.launch();

/* Warm the routes first. A cold first hit stretches the take by seconds and
 * shows up as dead air in the recording. */
{
  const warm = await browser.newPage();
  for (const p of [
    LESSON, "/microeconomics/supply-demand/law-of-supply", "/microeconomics/supply-demand/equilibrium",
    "/microeconomics/supply-demand/elasticity/ped", "/microeconomics/consumer-choice/utility",
  ]) await warm.goto(BASE + p, { waitUntil: "networkidle" }).catch(() => {});
  await warm.close();
}

const ctx = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2,
  recordVideo: { dir: VIDDIR, size: { width: 1080, height: 1920 } },
});
const page = await ctx.newPage();
await page.route("**/__stage", (r) => r.fulfill({ status: 200, contentType: "text/html", body: STAGE }));
await page.goto(BASE + "/__stage", { waitUntil: "networkidle" });
await page.waitForTimeout(2500); // settle; trimmed off the head by ffmpeg below

/* Visual page coords for a nav row inside the scaled iframe. */
async function spot(label) {
  return page.evaluate((label) => {
    const f = document.getElementById("app");
    const rows = [...f.contentDocument.querySelectorAll("aside a.step, aside button.step")];
    const el = rows.find((n) => n.textContent.trim().startsWith(label));
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const fb = f.getBoundingClientRect();
    const s = fb.width / f.offsetWidth;
    return { x: fb.left + (r.left + 60) * s, y: fb.top + (r.top + r.height / 2) * s };
  }, label);
}

async function moveTo(label) {
  const p = await spot(label);
  if (!p) { console.warn("no row:", label); return null; }
  await page.evaluate(({ x, y }) => {
    document.getElementById("cur").style.transform = `translate(${x - 15}px, ${y - 15}px)`;
  }, p);
  await page.waitForTimeout(640);
  await page.mouse.move(p.x, p.y); // let the row's real hover state land
  await page.waitForTimeout(140);
  return p;
}

async function clickRow(label, settle = 1000) {
  const p = await moveTo(label);
  if (!p) return;
  await page.evaluate(() => {
    const c = document.getElementById("cur");
    c.classList.remove("press"); void c.offsetWidth; c.classList.add("press");
  });
  await page.waitForTimeout(120);
  await page.mouse.click(p.x, p.y);
  await page.evaluate(() => setTimeout(() => document.getElementById("cur").classList.remove("press"), 200));
  await page.waitForTimeout(settle);
  // A click that silently misses is invisible in the recording — report it here.
  const path_ = await page.evaluate(() => document.getElementById("app").contentDocument.location.pathname);
  console.log(`  ${label} -> ${path_}`);
}

/* ---- the take ---- */
await page.waitForTimeout(700);
await clickRow("The law of supply", 800);        // indicator slides down one row
await clickRow("Market equilibrium", 800);       // and again
await clickRow("Elasticity", 650);               // folder expands
await clickRow("Price elasticity", 900);         // a level deeper
await clickRow("Consumer choice", 700);          // another folder
await clickRow("Utility & marginal", 950);       // indicator crosses sections
await clickRow("Getting started", 800);          // and one collapses
await page.waitForTimeout(1000);

await page.close();
await ctx.close();
await browser.close();

const src = path.join(VIDDIR, fs.readdirSync(VIDDIR).find((f) => f.endsWith(".webm")));
fs.copyFileSync(src, path.join(SOCIAL, "05-sidebar-motion.webm"));

const FFMPEG = findFfmpeg();
if (!FFMPEG) {
  console.log("\nwebm written. For an mp4, `npm i -g ffmpeg-static` or set FFMPEG=<path to ffmpeg>.");
} else {
  const mp4 = path.join(SOCIAL, "05-sidebar-motion.mp4");
  execFileSync(FFMPEG, [
    "-y", "-ss", "2.4", "-i", src,     // -ss trims the load/settle dead air
    "-vf", "fps=30",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    mp4,
  ], { stdio: "ignore" });
  console.log("\nvideo ->", mp4);
}
fs.rmSync(VIDDIR, { recursive: true, force: true });
