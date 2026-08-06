/* Reference frames for 2026-08-06 — whole screens, shot to be LOOKED AT.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0806-ref.mjs
 *
 * Nothing here is posted. Two jobs:
 *
 *   ref-door-*   the front door at a ladder of moments through its entrance,
 *                so the four frames the carousel uses are CHOSEN off pictures
 *                rather than computed off the keyframes. The page plays itself
 *                in over about two seconds and the blur is the risk — a frame
 *                picked by arithmetic can land mid-de-blur and read as an
 *                out-of-focus screenshot rather than as a designed moment.
 *   ref-*        the app's screens, for picking the day's other subjects. The
 *                approach that worked on 5 Aug: reasoning about components off
 *                the source tree kept choosing things that photograph badly.
 *
 * THE ENTRANCE IS FROZEN, NOT RACED. `document.getAnimations()` returns the
 * live CSS animations and `currentTime` is settable, so each frame is the real
 * animation stopped at an exact millisecond — deterministic, and honest in the
 * way rule 9 means: it is the page's own motion, not a drawing of it.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, transform } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

const browser = await chromium.launch();

/* ====================================================================== *
 * 1 — THE FRONT DOOR
 *
 * A 9:16 VIEWPORT, which is the whole reason this can be a `plain()` post.
 * The front door is the one screen in the app that is exactly the shape of
 * the frame: it is `min-h-dvh` with nothing under it, so it renders to
 * whatever window it is given and a 405x720 shot fills 1080x1920 with no crop,
 * no fade and nothing to align. 405x720 is also a real phone — a 390-wide
 * handset with the browser's own chrome taking the rest.
 * ====================================================================== */
{
  const ctx = await browser.newContext({
    viewport: { width: 405, height: 720 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("h1", { timeout: 120000 });
  /* The photograph is the slide. Waiting for the <h1> only proves the markup
     arrived — a screenshot taken before the backdrop decodes is a black frame
     with type on it, which is a different design. */
  await page.waitForFunction(
    () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
    null,
    { timeout: 120000 },
  );
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });

  const at = async (ms) => {
    await page.evaluate((t) => {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = t;
      }
    }, ms);
    await page.waitForTimeout(120);
    const name = `ref-door-${String(ms).padStart(4, "0")}.png`;
    await page.screenshot({ path: out(name) });
    console.log("  " + name);
  };

  console.log("the front door, arriving ->");
  for (const ms of [0, 200, 350, 500, 650, 800, 1000, 1200, 1500, 1800, 2200, 3000]) await at(ms);

  /* And the faces row at four steps of its own 14s cycle, settled page. The
     track holds between steps, so these are the frames a visitor actually
     sees rather than the transitions between them. */
  console.log("the faces, cycling ->");
  for (const [i, ms] of [1000, 3800, 6600, 9400].entries()) {
    await page.evaluate(
      ([t, hero]) => {
        for (const a of document.getAnimations()) {
          a.pause();
          /* Everything except the faces is held at its settled state; only the
             track moves, so these four frames differ in one thing. */
          const el = a.effect?.target;
          a.currentTime = el?.classList?.contains("faces-track") ? t : hero;
        }
      },
      [ms, 3000],
    );
    await page.waitForTimeout(120);
    const name = `ref-faces-${i + 1}.png`;
    await page.screenshot({ path: out(name) });
    console.log("  " + name);
  }

  await ctx.close();
}

/* ====================================================================== *
 * 2 — THE APP, for picking the day's other subjects.
 *
 * Seeded exactly as 4 and 5 Aug seeded it, so the reader in today's shots is
 * the same person a month in and every number is the app's own arithmetic on
 * real section ids.
 * ====================================================================== */
const tree = JSON.parse(fs.readFileSync(path.join(PLATFORM, "src/lib/course-data.json"), "utf8"));
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

const FULL = [
  "intro-to-treasury",
  "treasury-levels-and-mandate",
  "treasury-controls-and-structure",
  "debtors-and-factoring",
  "free-cash-flows",
  "npv-and-payback",
];
const PARTIAL = ["working-capital-and-liquidity", "inventory-and-creditors", "irr-and-mirr"];

const done = {};
for (const id of FULL) {
  const l = byId(id);
  if (l) done[l.id] = l.sections;
}
for (const id of PARTIAL) {
  const l = byId(id);
  if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 1));
}

const SOFT = { "npv-and-payback": ["overview"], "irr-and-mirr": ["overview"] };
const HARD = { "inventory-and-creditors": ["overview"] };
const grasp = {};
for (const [lessonId, ids] of Object.entries(done)) {
  const row = {};
  for (const cid of ids) {
    row[cid] = (HARD[lessonId] ?? []).includes(cid)
      ? "not"
      : (SOFT[lessonId] ?? []).includes(cid)
        ? "almost"
        : "got";
  }
  grasp[lessonId] = row;
}

const touched = {
  "intro-to-treasury": ago(26),
  "treasury-levels-and-mandate": ago(21),
  "treasury-controls-and-structure": ago(14),
  "working-capital-and-liquidity": ago(0),
  "debtors-and-factoring": ago(5),
  "inventory-and-creditors": ago(2),
  "free-cash-flows": ago(9),
  "npv-and-payback": ago(4),
  "irr-and-mirr": ago(0),
};

const MINUTES = [
  18, 26, 0, 31, 22, 0, 0,
  29, 35, 0, 24, 41, 14, 0,
  27, 38, 19, 34, 0, 28, 36,
  32, 41, 0, 0, 27, 38, 22,
];
const days = {};
for (let i = 0; i < MINUTES.length; i++) {
  const mins = MINUTES[i];
  if (!mins) continue;
  const date = ago(MINUTES.length - 1 - i);
  const secs = mins * 60;
  const b = i >= MINUTES.length - 14 ? Math.round(secs * 0.45) : 0;
  const checks = mins > 30 ? 2 : mins > 12 ? 1 : 0;
  days[date] = {
    checks,
    steps: mins > 40 ? 1 : 0,
    secs,
    courses: b
      ? { "treasury-management": secs - b, "corporate-finance": b }
      : { "treasury-management": secs },
    courseChecks:
      b && checks > 1
        ? { "treasury-management": checks - 1, "corporate-finance": 1 }
        : { "treasury-management": checks },
  };
}
const SEED = JSON.stringify({ done, days, touched, grasp });

const identity = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  school: "other",
  schoolName: "A university",
  courses: ["economics", "treasury-management", "corporate-finance"],
  coursesChosen: true,
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
});

{
  const ctx = await browser.newContext({
    viewport: { width: 402, height: 900 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(
    ([id, sd]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
        localStorage.setItem("booklesss:progress:v6", sd);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [identity, SEED],
  );
  const page = await ctx.newPage();

  const prep = async () => {
    await page.evaluate(() => {
      document.querySelectorAll("body *").forEach((el) => {
        const t = el.tagName.toLowerCase();
        if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
      });
    });
    await page.evaluate(transform, { map: MAP, reader: null, deep: true });
  };

  const go = async (url, ready) => {
    await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector(ready, { timeout: 120000 });
    await page.waitForTimeout(1400);
    try {
      await prep();
    } catch {
      await page.waitForTimeout(1200);
      await prep();
    }
  };

  const shot = async (name) => {
    await prep();
    await page.screenshot({ path: out(name), fullPage: true });
    console.log("  " + name);
  };

  console.log("the app ->");
  await go("/dashboard", "main");
  await shot("ref-dash.png");

  await go("/economics", "main");
  await shot("ref-course.png");

  await go("/microeconomics/supply-demand/law-of-demand", ".checkpoint-row");
  await shot("ref-step.png");

  await ctx.close();
}

await browser.close();
console.log("done ->", DIR);
