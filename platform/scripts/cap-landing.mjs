/* Screenshots for the landing page.
 *
 *   cd platform && npx next dev -p 3100
 *   node scripts/cap-landing.mjs                     # -> public/landing/
 *   BASE_URL=http://localhost:3101 node scripts/cap-landing.mjs
 *
 * These live in the APP, not in Demand/social, and that is the whole point of
 * a separate script: the social captures run every shot through
 * `neutralize.mjs`, which relabels the courses to an invented Mathematics /
 * Computer Science curriculum so no post names a school. The landing page is
 * the product's own front door — showing invented courses there would be
 * claiming a catalogue that does not exist. So these are the real app, with
 * its real courses, unrelabelled.
 *
 * MOBILE LAYOUT, because Booklesss is a phone app and `DesktopGate` sends a
 * wide viewport to its phone anyway. 402x874 at deviceScaleFactor 3 gives a
 * 1206x2622 source, which is enough to render sharp inside a ~300px-wide frame
 * on a retina screen.
 *
 * THE PROGRESS IS SEEDED, and it is demo data — a reader about a month in, not
 * a finished course. The numbers on screen are the app's own arithmetic over
 * real checkpoint ids from `course-data.json`, so nothing here is drawn or
 * retouched; the shot is what the app renders given that history. Keep it
 * plausible if you re-seed: a landing page showing 100% of a course that
 * launched this month is a lie the screenshot tells for you.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLATFORM = path.resolve(HERE, "..");
const OUT = path.join(PLATFORM, "public", "landing");
const BASE = process.env.BASE_URL || "http://localhost:3100";

fs.mkdirSync(OUT, { recursive: true });

/* ---- the seed ---------------------------------------------------------- *
 * Built from the real course tree so every id is one the app will recognise;
 * an invented id renders as nothing and the dashboard photographs empty. */
const tree = JSON.parse(fs.readFileSync(path.join(PLATFORM, "src/lib/course-data.json"), "utf8"));
const lessons = [];
(function walk(nodes) {
  for (const n of nodes) {
    if (n.lesson) lessons.push({ id: n.id, sections: n.lesson.sections.map((s) => s.id) });
    if (n.children) walk(n.children);
  }
})(tree);

const iso = (d) => d.toLocaleDateString("en-CA");
const ago = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};

/* A month in: a few lessons closed, a couple part-read, nothing finished. */
const FULL = lessons.slice(0, 6);
const PARTIAL = lessons.slice(6, 9);

const done = {};
for (const l of FULL) done[l.id] = l.sections;
for (const l of PARTIAL) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 1));

/* Not every checkpoint lands first time — a wall of "got it" reads as a demo
 * rather than as studying. */
const grasp = {};
let i = 0;
for (const [lessonId, ids] of Object.entries(done)) {
  const row = {};
  for (const cid of ids) row[cid] = ++i % 7 === 0 ? "almost" : i % 11 === 0 ? "not" : "got";
  grasp[lessonId] = row;
}

/* `days` is a MAP of date -> {checks, secs, steps}, not a list of dates. A bare
 * list is the v2 shape; the migration accepts it but records `secs: 0` for
 * every day, which photographs as "Time this week —" on a dashboard that is
 * otherwise full. Write the current shape. */
const DAYS = [
  [0, 14, 2760], [1, 11, 2280], [2, 16, 3180], [4, 9, 1860],
  [5, 13, 2640], [6, 7, 1440], [8, 12, 2400], [9, 10, 1980], [12, 8, 1620],
];
const days = {};
for (const [n, checks, secs] of DAYS) days[ago(n)] = { checks, secs, steps: n % 3 === 0 ? 1 : 0 };

const SEED = JSON.stringify({
  done,
  grasp,
  days,
  touched: Object.fromEntries(FULL.map((l, n) => [l.id, ago(n)])),
  quiz: {},
});

const WHO = JSON.stringify({ name: "Chanda", avatar: "a3", id: "landing-shot", since: "2026-07-04T09:00:00.000Z" });

/* ---- browser ----------------------------------------------------------- */
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 402, height: 874 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
await ctx.addInitScript(
  ([seed, who]) => {
    try {
      localStorage.setItem("booklesss:progress:v6", seed);
      localStorage.setItem("booklesss:identity:v1", who);
      localStorage.removeItem("booklesss-offline-card-dismissed");
    } catch {}
  },
  [SEED, WHO],
);

const page = await ctx.newPage();

/* The Next dev badge sits over the bottom-left corner of every page. */
const clean = () =>
  page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });

const go = async (url, ready = "main") => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900); // the sparklines draw themselves in
  await clean();
};

/* Put a known element a known distance below the top of the viewport. Scrolling
 * by a raw pixel offset breaks the moment the content above it changes length. */
const bring = async (selector, topPx) => {
  await page.evaluate(
    ([sel, top]) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - top);
    },
    [selector, topPx],
  );
  await page.waitForTimeout(350);
};

const shot = async (name) => {
  await clean();
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`  ${name}.png`);
};

/* 1. The dashboard — what the studying adds up to. */
await go("/home");
await shot("dashboard");

/* 2. The reading itself, at the top of a step. */
await go("/getting-started/what-is-economics");
await shot("reader");

/* 3. Further down the same step — the worked example and the answer row. The
 * hero and the "read it in steps" row both need a reading shot, and running
 * the same crop in both reads as padding, so this is the second one: same
 * page, visibly different picture. */
await bring("main h2", 130).catch(() => {});
await page.waitForTimeout(400);
await shot("practice");

/* 4. The course, in order. The only shot that shows a course has a SHAPE
 * rather than being a pile of pages.
 *
 * Shot on a NARROWER viewport than the rest. The drawer is an overlay that
 * takes about three-quarters of the screen, so at 402px the reader stays
 * visible down the right-hand edge — inside a phone bezel on the landing page
 * that column of half-sentences reads as a badly cropped image rather than as
 * a drawer over a page. At 320 the drawer covers effectively the whole width
 * and the shot is unambiguous. Same app, same layout, just a smaller phone. */
const narrow = await browser.newContext({
  viewport: { width: 320, height: 780 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
await narrow.addInitScript(
  ([seed, who]) => {
    try {
      localStorage.setItem("booklesss:progress:v6", seed);
      localStorage.setItem("booklesss:identity:v1", who);
    } catch {}
  },
  [SEED, WHO],
);
const drawer = await narrow.newPage();
await drawer.goto(BASE + "/getting-started/what-is-economics", { waitUntil: "domcontentloaded", timeout: 120000 });
await drawer.waitForSelector("main", { timeout: 120000 });
await drawer.evaluate(() => document.fonts.ready);
await drawer.locator("header button").first().click();
await drawer.waitForTimeout(900);
await drawer.evaluate(() => {
  document.querySelectorAll("body *").forEach((el) => {
    const t = el.tagName.toLowerCase();
    if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
  });
});
await drawer.screenshot({ path: path.join(OUT, "contents.png") });
console.log("  contents.png");

await browser.close();
console.log(`\ndone -> ${OUT}`);
