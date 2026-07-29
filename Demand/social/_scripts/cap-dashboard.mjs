/* Capture for the 2026-07-28 progress posts — the dashboard rebuilt around
 * measurement, and the reader gone quieter. Shot from the real app's MOBILE
 * layout (house rule), full-bleed crops, no boxes.
 *
 *   node _scripts/cap-dashboard.mjs          # needs the dev server on :3100
 *
 * Writes _source/feature-capture/{d,r}-*.png.
 *
 * The whole dashboard is a reading of localStorage, so a virgin browser has
 * nothing to plot. We seed a month of study before shooting: real checkpoint
 * ids off the course tree, minutes attributed per course, weekends light, and
 * Corporate Finance appearing only in the last few days — because that is when
 * it actually launched. Every number on screen is then the app's own
 * arithmetic, not a mock-up.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
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

const done = {};
for (const id of ["law-of-demand", "law-of-supply", "market-equilibrium", "elasticity"]) {
  const l = byId(id);
  if (l) done[l.id] = l.sections;
}
for (const id of ["consumer-choice", "free-cash-flows"]) {
  const l = byId(id);
  if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 2));
}

/* A month of days. Deterministic, not random, so a re-run reproduces the same
 * chart — a poster that redraws differently every render can't be corrected. */
const MINUTES = [
  // four weeks back → this week. 0 = a day nothing was read.
  22, 31, 0, 18, 27, 9, 0,
  35, 28, 41, 0, 24, 12, 0,
  19, 44, 33, 26, 0, 15, 8,
  38, 29, 47, 21, 36, 14, 0,
  // this week: Monday, then today
  42, 26,
];
const days = {};
const today = new Date();
for (let i = 0; i < MINUTES.length; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - (MINUTES.length - 1 - i));
  const date = d.toLocaleDateString("en-CA");
  const mins = MINUTES[i];
  if (!mins) continue;
  const secs = mins * 60;
  /* Corporate Finance only exists in the last five days — it launched
   * yesterday, so crediting it a month of reading would be a lie told by a
   * chart. */
  const cf = i >= MINUTES.length - 5 ? Math.round(secs * 0.55) : 0;
  days[date] = {
    checks: mins > 30 ? 2 : mins > 12 ? 1 : 0,
    steps: mins > 40 ? 1 : 0,
    secs,
    byCourse: cf ? { economics: secs - cf, "corporate-finance": cf } : { economics: secs },
  };
}
const SEED = JSON.stringify({ done, days });

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

const clean = async () => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
};

const go = async (url) => {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await clean();
};

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
  await clean();
};

/* Every crop is exactly 9:16 so it fills the poster frame when scaled. */
const TALL = { x: 0, y: 156, width: 402, height: 715 };
const MID = { x: 0, y: 159, width: 402, height: 715 };
const DRAWER = { x: 0, y: 40, width: 300, height: 533 };

/* The reader routes off the nav tree, and Corporate Finance's wrapper node was
 * dropped on 2026-07-28 so the course's unit is now top level — hence
 * /investment-appraisal/… , while /corporate-finance is still the course home
 * (that comes from course-index.json, not the tree). */
const LESSON_NPV = "/investment-appraisal/npv-and-payback";

/* ---------- afternoon: the studying, measured ---------- */
await go("/");
/* The chart card. The current week is drawn only as far as today, with the
 * momentum tail projecting the rest — which is the thing that shipped. */
await bring(".dash-card", 210);
await page.screenshot({ path: out("d-chart.png"), clip: MID });

/* Paged back a week, where a full seven-day curve is on show. */
await page.click('button[aria-label="Earlier week"]');
await page.waitForTimeout(700);
await clean();
await page.screenshot({ path: out("d-week.png"), clip: MID });

await go("/");
await bring(".dash-stat", 260);
await page.screenshot({ path: out("d-tiles.png"), clip: MID });

await go("/");
await bring("#courses", 200);
await page.screenshot({ path: out("d-courses.png"), clip: TALL });

/* ---------- evening: the reader ---------- */
await go(LESSON_NPV);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await clean();
await page.screenshot({ path: out("r-top.png"), clip: TALL });

await bring("#time-value", 230);
await page.screenshot({ path: out("r-read.png"), clip: MID });

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(750);
await clean();
await page.screenshot({ path: out("r-nav.png"), clip: DRAWER });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

/* The course home, now a docs index rather than a second dashboard. */
await go("/corporate-finance");
await page.screenshot({ path: out("r-index.png"), clip: TALL });

await browser.close();
console.log("captured ->", DIR);
