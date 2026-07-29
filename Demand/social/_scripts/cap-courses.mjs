/* Capture for the 2026-07-27 progress posts — the second course landing, and
 * what a Corporate Finance lesson actually looks like. Shot from the real app's
 * MOBILE layout (house rule), full-bleed crops, no boxes.
 *
 *   node _scripts/cap-courses.mjs            # needs the dev server on :3100
 *
 * Writes _source/feature-capture/cf-*.png.
 *
 * The dashboard reads progress out of localStorage, so a virgin browser shows
 * the zero state ("You haven't started yet") — true, but it photographs as an
 * empty app. We seed a plausible amount of study first, taken from the real
 * course data, so the rings and streak in the shot are the app's own arithmetic
 * on real checkpoint ids rather than mocked-up numbers.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

/* ---- build the progress seed from the real course tree ---- */
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
/* Four economics steps finished, one part-way — the shape of someone a couple
 * of weeks in, not someone who has finished a course they only just opened. */
for (const id of ["law-of-demand", "law-of-supply", "market-equilibrium", "elasticity"]) {
  const l = byId(id);
  if (l) done[l.id] = l.sections;
}
for (const id of ["consumer-choice", "free-cash-flows"]) {
  const l = byId(id);
  if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 2));
}
/* Study days ending today, so the streak in the shot is live. */
const today = new Date();
const days = [];
for (let i = 4; i >= 0; i--) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  days.push(d.toLocaleDateString("en-CA"));
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
    localStorage.setItem("booklesss:progress:v2", seed);
  } catch {}
}, SEED);
const page = await ctx.newPage();

/* The Next dev badge sits over the bottom-left corner of every shot. */
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
  await page.waitForTimeout(700);
  await clean();
};

/* Scroll an element to a chosen distance from the top of the viewport, so the
 * block we care about lands where the crop wants it rather than wherever
 * scrollIntoView happens to put it. */
const bring = async (sel, top = 150) => {
  await page.evaluate(
    ([s, t]) => {
      const el = document.querySelector(s);
      if (!el) throw new Error("no element for " + s);
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - t });
    },
    [sel, top],
  );
  await page.waitForTimeout(450);
  await clean();
};

/* 9:16 crops of the phone. TALL is the full column below the header; MID is a
 * tighter band for a single block, so its type reads large in the frame. The
 * nav drawer is only 300 wide, so it gets its own 9:16 crop — clipping to the
 * drawer alone drops the sliver of reader text behind it. */
/* Every crop is exactly 9:16 so that, scaled to the poster's width, it fills
 * the 1080x1920 frame — a shorter shot leaves a hard edge where the image stops
 * and the background takes over. */
const TALL = { x: 0, y: 156, width: 402, height: 715 };
const MID = { x: 0, y: 159, width: 402, height: 715 };
const DRAWER = { x: 0, y: 40, width: 300, height: 533 };

const LESSON_NPV = "/corporate-finance/investment-appraisal/npv-and-payback";

/* ---------- afternoon: a second course ---------- */
await go("/");
await bring("#courses", 120);
await page.screenshot({ path: out("cf-dash.png"), clip: TALL });

await go("/corporate-finance");
await page.screenshot({ path: out("cf-home.png"), clip: TALL });

await go(LESSON_NPV);
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(700);
await clean();
await page.screenshot({ path: out("cf-nav.png"), clip: DRAWER });
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

/* Search reaches across every course, which is the clearest way to show that
 * there is now more than one to reach across. */
await page.click('button[aria-label="Search"]');
await page.waitForTimeout(500);
await page.fill('input[aria-label="Search the course"]', "cash flow");
await page.waitForTimeout(700);
await clean();
/* The search panel hangs from the top of the screen, so its crop starts higher
 * than the in-page ones — otherwise the field itself falls outside the frame. */
await page.screenshot({ path: out("cf-search.png"), clip: { x: 0, y: 56, width: 402, height: 715 } });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

/* ---------- evening: inside a finance lesson ---------- */
await go(LESSON_NPV);
await bring("#time-value", 250);
await page.screenshot({ path: out("cf-formula.png"), clip: MID });

/* The worked-example table scrolls sideways on a phone; scroll it to the end so
 * the present-value column and the NPV total are both in the shot. */
await bring("#npv-worked", 190);
await page.evaluate(() => {
  const box = document.querySelector("#npv-worked .overflow-x-auto");
  if (box) box.scrollLeft = box.scrollWidth;
});
await page.waitForTimeout(400);
await clean();
await page.screenshot({ path: out("cf-table.png"), clip: MID });

/* The comprehension check is a dialog you have to open — the tick is earned by
 * answering, so that is what the shot should show. */
await bring("#time-value", 100);
await page.click("#time-value .checkpoint-btn");
await page.waitForTimeout(700);
await clean();
await page.screenshot({ path: out("cf-check.png"), clip: TALL });

await browser.close();
console.log("captured ->", DIR);
