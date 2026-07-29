/* Capture for the 2026-07-29 posts — the day the home page turned into a
 * scoreboard. Shot from the real app's MOBILE layout (house rule), full-bleed
 * 9:16 crops, no boxes, nothing drawn by hand.
 *
 *   node _scripts/cap-day.mjs            # needs the dev server on :3100
 *
 * Writes _source/feature-capture/w-*.png.
 *
 * Two standing rules are enforced here rather than remembered:
 *
 *  1. NEVER A SPECIFIC COURSE OR SCHOOL. Booklesss is not one syllabus and not
 *     one university, so no capture may say it is. Every shot is relabelled to
 *     a neutral two-subject curriculum by neutralize.mjs and then *scanned* —
 *     a banned word still on screen throws instead of writing the PNG.
 *
 *  2. NOTHING IS DRAWN. The poster never illustrates a feature with UI we made
 *     up. If a screen photographs badly it is because the data behind it is
 *     thin, so we seed data into the app and shoot it again. Every pixel of
 *     product in a post is the product.
 *
 * The seed is a full v3 progress state — cleared checkpoints, a month of study
 * days with per-course seconds, last-touched dates, and quiz records — because
 * all four dashboard tiles read different parts of it and a virgin browser
 * photographs as an empty app. The values are deterministic so a re-render
 * reproduces the same chart, and plausible: someone a month in, mid-course,
 * with one step going stale and one step they answered badly.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, READER, BANNED, transform, scan } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

/* ---- the seed, built from the real course tree ---- */
const tree = Object.values(
  JSON.parse(fs.readFileSync(path.join(PLATFORM, "src/lib/course-data.json"), "utf8")),
);
const lessons = [];
(function walk(nodes) {
  for (const n of nodes) {
    if (n.lesson) lessons.push({ id: n.id, sections: n.lesson.sections.map((s) => s.id) });
    if (n.children) walk(n.children);
  }
})(tree);
const byId = (id) => lessons.find((l) => l.id === id);

const iso = (d) => d.toLocaleDateString("en-CA");
const ago = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};

/* Steps finished, and two part-way — the shape of someone mid-course. */
const FULL = ["what-is-economics", "how-to-use", "glossary", "law-of-demand", "law-of-supply", "equilibrium", "ped", "free-cash-flows"];
const PARTIAL = ["yed", "npv-and-payback"];
const done = {};
for (const id of FULL) {
  const l = byId(id);
  if (l) done[l.id] = l.sections;
}
for (const id of PARTIAL) {
  const l = byId(id);
  if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 2));
}

/* When each finished step was last opened. Two were left alone over three
 * weeks ago, which is what puts a real figure in the "Going stale" tile
 * instead of the empty state. */
const touched = {
  "what-is-economics": ago(30),
  "how-to-use": ago(24),
  glossary: ago(11),
  "law-of-demand": ago(27),
  "law-of-supply": ago(9),
  equilibrium: ago(6),
  ped: ago(3),
  yed: ago(2),
  "free-cash-flows": ago(4),
  "npv-and-payback": ago(0),
};

/* Comprehension checks: answered, and how many right first time. 20/25 = 80%
 * overall, with one step at 50% for the weakest-step tile to name. */
const quiz = {
  "law-of-demand": { first: 4, total: 4 },
  "law-of-supply": { first: 3, total: 4 },
  equilibrium: { first: 4, total: 5 },
  ped: { first: 2, total: 4 },
  "free-cash-flows": { first: 4, total: 4 },
  "npv-and-payback": { first: 3, total: 4 },
};

/* Thirty days of study, deterministic so a re-run redraws the same curve.
 * 0 = a day nothing was read. The last seven end on today and give the "days
 * this week" tile a 5 / 7 — good, not perfect, which is the honest shape. */
const MINUTES = [
  18, 26, 0, 31, 22, 0, 0,
  29, 35, 0, 24, 41, 14, 0,
  33, 27, 44, 0, 19, 38, 0,
  25, 46,
  // this week (Thu → today)
  26, 0, 34, 41, 0, 38, 22,
];
const days = {};
for (let i = 0; i < MINUTES.length; i++) {
  const mins = MINUTES[i];
  if (!mins) continue;
  const date = ago(MINUTES.length - 1 - i);
  const secs = mins * 60;
  /* The second course only appears in the last fortnight — it was added then,
   * and crediting it a month of reading would be a lie told by a chart. */
  const b = i >= MINUTES.length - 14 ? Math.round(secs * 0.45) : 0;
  const checks = mins > 30 ? 2 : mins > 12 ? 1 : 0;
  days[date] = {
    checks,
    steps: mins > 40 ? 1 : 0,
    secs,
    courses: b ? { economics: secs - b, "corporate-finance": b } : { economics: secs },
    courseChecks: b && checks > 1 ? { economics: checks - 1, "corporate-finance": 1 } : { economics: checks },
  };
}

const SEED = JSON.stringify({ done, days, touched, quiz });

/* ---- capture ---- */
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 402, height: 874 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
await ctx.addInitScript((seed) => {
  try {
    localStorage.setItem("booklesss:progress:v3", seed);
  } catch {}
}, SEED);
const page = await ctx.newPage();

/* Everything that has to be true at the instant of the shot. React re-renders
 * (the live count ticks, the study clock accrues) undo a relabel done once up
 * front, so this runs immediately before every screenshot. */
const prep = async () => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
  await page.evaluate(transform, { map: MAP, reader: READER, deep: true });
  const leaked = await page.evaluate(scan, BANNED);
  if (leaked.length) throw new Error(`banned words still on screen: ${leaked.join(", ")} — extend MAP in neutralize.mjs`);
};

const go = async (url) => {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await prep();
};

/* Put a known element a known distance below the viewport top. Raw pixel
 * offsets break the moment the content above changes length. */
const bring = async (sel, top = 150) => {
  await page.evaluate(
    ([s, t]) => {
      const el = document.querySelector(s);
      if (!el) throw new Error("no element for " + s);
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - t });
    },
    [sel, top],
  );
  await page.waitForTimeout(500);
  await prep();
};

/* Every crop is exactly 9:16, so scaled to the poster's width it fills the
 * 1080x1920 frame — a shorter shot leaves a hard edge where the image stops. */
const TALL = { x: 0, y: 156, width: 402, height: 715 };
const MID = { x: 0, y: 159, width: 402, height: 715 };
const DRAWER = { x: 0, y: 40, width: 300, height: 533 };

const shot = async (name, clip) => {
  await page.screenshot({ path: out(name), clip });
  console.log("  " + name);
};

/* A macro of one real element: measure it, then build the tightest 9:16 crop
 * that holds it. Narrower crop = larger in the frame, so `width` is the zoom
 * control. Nothing is composed — it is the app, closer. */
const macro = async (name, sel, { width = 250, padTop = 14, nth = 0 } = {}) => {
  const box = await page.evaluate(
    ([s, i]) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) throw new Error("no element for " + s);
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    },
    [sel, nth],
  );
  const w = Math.min(402, Math.max(width, 120));
  const h = Math.round((w * 16) / 9);
  const x = Math.max(0, Math.min(402 - w, Math.round(box.x + box.w / 2 - w / 2)));
  const y = Math.max(0, Math.min(874 - h, Math.round(box.y - padTop)));
  await shot(name, { x, y, width: w, height: h });
};

console.log("capturing ->", DIR);

/* ---------- the home page: the scoreboard ---------- */
await go("/");

/* The dashboard's own opening line — the greeting and the state of play. */
await shot("w-top.png", { x: 0, y: 60, width: 402, height: 715 });

/* The chart card as it stands today: this week drawn only as far as today,
 * the momentum tail projecting the rest. */
await bring(".dash-card", 200);
await shot("w-chart.png", MID);

/* Paged back a week, where a whole seven-day curve is on show. */
await page.click('button[aria-label="Earlier week"]');
await page.waitForTimeout(700);
await prep();
await shot("w-chart-week.png", MID);

/* The four tiles, together and one at a time. */
await go("/");
await bring(".dash-stat", 250);
await shot("w-tiles.png", MID);
await macro("w-tile-days.png", ".dash-stat", { width: 232, nth: 0 });
await macro("w-tile-stale.png", ".dash-stat", { width: 232, nth: 2 });

/* The courses themselves. */
await go("/");
await bring("#courses", 190);
await shot("w-cards.png", TALL);
await macro("w-card.png", ".course-card", { width: 372, padTop: 10 });
/* The card's own header row — the streak and who else is reading right now. */
await macro("w-live.png", ".course-card .live-dot", { width: 200, padTop: 60 });
/* The title line, where the performance score sits. */
await macro("w-score.png", ".course-card .font-display", { width: 300, padTop: 40 });
/* The resume button: its fill IS the progress bar, and it names the next step. */
await macro("w-resume.png", ".course-resume", { width: 300, padTop: 76 });

/* ---------- the reader ---------- */
const LESSON = "/investment-appraisal/npv-and-payback";
await go(LESSON);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await prep();
await shot("w-read-top.png", TALL);

await bring("#key-ideas", 210);
await shot("w-read.png", MID);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(800);
await prep();
await shot("w-nav.png", DRAWER);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

await browser.close();
console.log("done ->", DIR);
