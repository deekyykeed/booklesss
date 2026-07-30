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

/* Four weeks of study, deterministic so a re-run redraws the same curve.
 * 0 = a day nothing was read.
 *
 * The chart plots minutes per day across a rolling seven, so a zero genuinely
 * drops the line to the floor. Rest days are therefore kept ADJACENT rather
 * than alternating: two days off together draw one trough, which is both what
 * a week off actually looks like and a line you can read. Alternating them
 * draws a comb, and a comb photographs as decoration.
 *
 * The last seven give the "days this week" tile 5 / 7 against the previous
 * week's 6 — good, not perfect, which is the honest shape to show. */
const MINUTES = [
  18, 26, 0, 31, 22, 0, 0,
  29, 35, 0, 24, 41, 14, 0,
  // last week: six days, which is what the tile compares this week against
  27, 38, 19, 34, 0, 28, 36,
  // this week, ending today: five days, with the weekend off
  32, 41, 0, 0, 27, 38, 22,
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
};

/* `networkidle` is the wrong wait against a dev server: HMR holds a socket open
 * and a recompile mid-navigation never settles, so the run dies on a page that
 * is in fact fine. Wait for the DOM, then for something real to be on it. */
const go = async (url, ready = "main") => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(ready, { timeout: 60000 });
  await page.waitForTimeout(1100);
  await prep();
};

/* Put a known element a known distance below the viewport top. Raw pixel
 * offsets break the moment the content above changes length.
 *
 * The offsets below are large on purpose. The poster dissolves the top of every
 * shot into the background so the headline can sit over it, so a subject
 * photographed near the top of its crop arrives half-faded. Leaving ~160px of
 * page above the subject is what buys it a clear landing in the frame. */
const bring = async (sel, top = 150) => {
  await page.evaluate(
    ([s, t]) => {
      const el = document.querySelector(s);
      if (!el) throw new Error("no element for " + s);
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - t, behavior: "instant" });
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

/* Nothing is written without being checked first: the banned-word scan runs
 * against the exact crop about to be photographed, so a course code or a
 * school name cannot reach a post through an oversight. */
const shot = async (name, clip, full = false) => {
  await prep();
  const leaked = await page.evaluate(scan, { banned: BANNED, clip, pageSpace: full });
  if (leaked.length) {
    throw new Error(
      `${name}: banned words inside the crop — ${leaked.join(", ")}. ` +
        `Extend MAP in neutralize.mjs, or move the crop.`,
    );
  }
  await page.screenshot({ path: out(name), clip, fullPage: full });
  console.log("  " + name);
};

/* A macro of one real element: measure it, then build the tightest 9:16 crop
 * that holds it. Narrower crop = larger in the frame, so `width` is the zoom
 * control. Nothing is composed — it is the app, closer.
 *
 * The crop is taken against a FULL-PAGE screenshot, in document coordinates,
 * not against the viewport. The dashboard is barely taller than a phone
 * screen, so an element near its foot can never be scrolled to the top of the
 * viewport — a viewport crop of it silently clamps and photographs whatever
 * sits above instead, which is how three different "macros" came out as the
 * same picture. In page space there is no such ceiling.
 *
 * `padTop` is how much of the crop sits above the element. */
const macro = async (name, sel, { width = 250, padTop = 14, nth = 0 } = {}) => {
  const box = await page.evaluate(
    ([s, i]) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) throw new Error("no element for " + s);
      const r = el.getBoundingClientRect();
      return {
        x: r.x + window.scrollX,
        y: r.y + window.scrollY,
        w: r.width,
        h: r.height,
        docW: document.documentElement.scrollWidth,
        docH: document.documentElement.scrollHeight,
      };
    },
    [sel, nth],
  );
  /* A 9:16 crop is nearly twice as tall as it is wide, so a wide crop anchored
   * near the foot of a short page does not fit and would slide up — putting the
   * subject in the middle of the frame with something else on top. Shrink to
   * fit instead: the element stays where it was asked to be, and the shot just
   * comes in closer. */
  const room = box.docH - Math.max(0, box.y - padTop);
  let w = Math.min(box.docW, Math.max(width, 120));
  let h = Math.round((w * 16) / 9);
  if (h > room) {
    h = Math.floor(room);
    w = Math.round((h * 9) / 16);
    console.log(`    ${name}: ${width}px wide would overrun the page — closed in to ${w}px`);
  }
  /* Centre the crop on the element when it fits inside it. When the element is
   * WIDER than the crop, align left instead: the app's text is left-aligned, so
   * centring shaves the first letters off every line — "athematics", "esume" —
   * which reads as a mistake rather than as a close-up. Bleeding off the right
   * is how the eye expects a line to leave the frame. */
  const ideal = box.w > w ? box.x - 6 : box.x + box.w / 2 - w / 2;
  const x = Math.max(0, Math.min(box.docW - w, Math.round(ideal)));
  const y = Math.max(0, Math.min(box.docH - h, Math.round(box.y - padTop)));
  await shot(name, { x, y, width: w, height: h }, true);
};

console.log("capturing ->", DIR);

/* ---------- the home page: the scoreboard ---------- */
await go("/");

/* The dashboard's own opening line — the greeting and the state of play. */
await shot("w-top.png", { x: 0, y: 60, width: 402, height: 715 });

/* The chart card. As of today it is a rolling seven-day plot — no week pager
 * any more, it just always shows the last seven days. */
await bring(".dash-card", 320);
await shot("w-chart.png", MID);

/* Its headline: the overall score and the hours behind it, set in the same
 * face the course cards use. */
await macro("w-score-all.png", ".dash-card .font-display", { width: 300, padTop: 130 });

/* The plot itself, close in, where the per-course lines and the momentum
 * curve separate. */
await macro("w-curve.png", ".dash-card svg", { width: 340, padTop: 150 });

/* The four tiles, together and one at a time. */
await go("/");
await bring(".dash-stat", 340);
await shot("w-tiles.png", MID);
await macro("w-tile-days.png", ".dash-stat", { width: 232, nth: 0, padTop: 90 });
await macro("w-tile-stale.png", ".dash-stat", { width: 232, nth: 2, padTop: 90 });

/* The courses themselves. */
await go("/");
await bring("#courses", 330);
await shot("w-cards.png", TALL);
/* The card's own header row — the streak and who else is reading right now. */
await macro("w-live.png", ".course-card .live-dot", { width: 230, padTop: 200 });
/* The title line, where the performance score sits. */
await macro("w-score.png", ".course-card .font-display", { width: 290, padTop: 300 });
/* The resume button: its fill IS the progress bar, and it names the next step. */
await macro("w-resume.png", ".course-resume", { width: 330, padTop: 330 });

/* ---------- the reader ----------
 * Shot on the step whose body neutralize.mjs actually rewrites. The other
 * course's steps carry worked examples in kwacha with the course's own
 * formulas in them, and there is no honest way to relabel a table of numbers —
 * so those pages are simply not photographed. The crop scan enforces it. */
const LESSON = "/microeconomics/supply-demand/law-of-demand";
await go(LESSON);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await prep();
await shot("w-read-top.png", TALL);

await bring("#key-ideas", 340);
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
