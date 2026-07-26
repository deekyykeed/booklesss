import { createRequire } from "module";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

/* Everything resolves from this file, not the shell's cwd, so the scripts run
 * the same from anywhere. This folder now lives at Demand/social/ (moved out of
 * the platform app 2026-07-25). */
export const SCRIPTS = path.dirname(fileURLToPath(import.meta.url));
export const MARKETING = path.resolve(SCRIPTS, "..");          // Demand/social
export const ROOT = path.resolve(MARKETING, "..", "..");       // Booklesss repo root
export const PLATFORM = path.join(ROOT, "platform");           // the Next.js app
export const SOURCE = path.join(MARKETING, "_source");
export const CROPS = path.join(SOURCE, "carousel-crops");
export const FONTS = path.join(SOURCE, "fonts");
export const SOCIAL = path.join(MARKETING, "stills");          // standalone stills + motion clip
export const POSTS = path.join(MARKETING, "posts");

/* Human-navigable folder naming: a day lands under a readable week folder, with
 * its weekday spelled out — posts/2026-W30 (Jul 20-26)/2026-07-25 Saturday/ .
 * Both levels lead with the ISO date/week so a file explorer still sorts them
 * chronologically. dayFolder("2026-07-25") -> { week, day, rel }. */
const _WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const _MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function _isoWeek(d) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - day + 3);                       // nearest Thursday
  const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const wk = 1 + Math.round(((t - first) / 86400000 - 3 + ((first.getUTCDay() + 6) % 7)) / 7);
  return { week: wk, year: t.getUTCFullYear() };
}
export function dayFolder(dateStr) {
  const [y, m, dd] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, dd));
  const w = _isoWeek(d);
  const mon = new Date(d); mon.setUTCDate(mon.getUTCDate() - ((mon.getUTCDay() + 6) % 7));
  const sun = new Date(mon); sun.setUTCDate(sun.getUTCDate() + 6);
  const range = _MO[mon.getUTCMonth()] + " " + mon.getUTCDate() +
    (mon.getUTCMonth() === sun.getUTCMonth() ? "-" : " - " + _MO[sun.getUTCMonth()] + " ") + sun.getUTCDate();
  const week = `${w.year}-W${String(w.week).padStart(2, "0")} (${range})`;
  const day = `${dateStr} ${_WD[d.getUTCDay()]}`;
  return { week, day, rel: path.join(week, day) };
}

// Playwright is a devDependency of the platform app, so borrow it from there.
const require = createRequire(path.join(PLATFORM, "package.json"));
export const { chromium, devices } = require("playwright");

export const BASE = process.env.BASE_URL || "http://localhost:3100";
export const LESSON = "/microeconomics/supply-demand/law-of-demand";

/* Capture from the app's MOBILE layout, not desktop — the 9:16 posts are for
 * mobile feeds and the desktop layout doesn't sit right in a tall frame. Pass
 * this to newPage() in the capture scripts (1-capture / 3-video / 4 / 4b):
 *   const page = await browser.newPage(PHONE);   // or devices["iPhone 13"]
 * NOTE: moving crops to mobile means re-tuning the crop geometries in
 * 5-day-carousels.mjs — the current _source/carousel-crops/ were shot on desktop. */
export const PHONE = { viewport: { width: 402, height: 874 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

/* Fonts. The scripts that screenshot the *live app* (1/2/3) still reference the
 * hashed build files by URL — re-run `npm run build` in platform/ and refresh
 * these two constants if the hashes ever change (ls platform/.next/static/media).
 * The day-carousel generator (5) instead embeds the vendored copies in
 * _source/fonts/ directly, so it needs neither a build nor a running server. */
export const INTER = "/_next/static/media/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2";
export const FAMILJEN = "/_next/static/media/f5edcc6a132fb1ad-s.p.3ii__yurxaf4q.woff2";

/* data: URIs for the vendored fonts — no server, no build required. */
const dataFont = (p) => "data:font/woff2;base64," + fs.readFileSync(p).toString("base64");
export const INTER_DATA = () => dataFont(path.join(FONTS, "inter.woff2"));
export const FAMILJEN_DATA = () => dataFont(path.join(FONTS, "familjen-grotesk.woff2"));

export const LOGO = (s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">
<path d="M3.46484 20.5359c1.46447 1.4645 3.82149 1.4645 8.53556 1.4645 4.714 0 7.071 0 8.5355 -1.4645 1.4645 -1.4645 1.4645 -3.8215 1.4645 -8.5355 0 -4.71407 0 -7.07109 -1.4645 -8.53556L3.46484 20.5359Z" fill="#737374"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355L20.5355 3.46447C19.0711 2 16.714 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447Z" fill="#000000"/></svg>`;
