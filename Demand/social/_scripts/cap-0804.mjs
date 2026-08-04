/* Capture for the 2026-08-04 posts.
 *
 *   node _scripts/cap-0804.mjs              # dev server on :3100
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0804.mjs
 *
 * NOTHING HERE IS ABOUT WHAT SHIPPED TODAY, and that is deliberate. Today's
 * commits are one feature — the sign-up/onboarding rebuild — and a sign-up
 * form is not a post (owner, 2026-08-04: *"I'm not posting onboarding things
 * online"*). A student follows a study app for the studying. So the day is
 * built from the product instead, four controls a student actually uses.
 *
 *   cc-*   one course card, at three stages
 *   sq-*   the search panel, at three queries
 *   st-*   one dashboard stat tile, at four measures
 *   ck-*   the checkpoint at the end of a section, at three answers
 *
 * Every shot is an ISOLATED COMPONENT on a transparent background, one control
 * per carousel, in the states a student puts it through — the 2 Aug rule. No
 * slide carries copy.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, BANNED, transform, scan } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

const who = (over) =>
  JSON.stringify({
    name: "Chanda",
    avatar: "astronaut",
    school: "other",
    schoolName: "A university",
    courses: [],
    coursesChosen: true,
    id: "capture-device",
    since: "2026-07-04T09:00:00.000Z",
    ...over,
  });

/* ---- the seeded progress ---------------------------------------------- *
 * A reader about a month in, built from the real course tree so every number
 * on a card is the app's own arithmetic on real section ids.
 */
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

/* ---- browser ----------------------------------------------------------- */
const browser = await chromium.launch();

const ctxFor = async ({ identity, seed = null, h = 874, scale = 8 }) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: h },
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(
    ([id, sd]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
        if (sd) localStorage.setItem("booklesss:progress:v6", sd);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [identity, seed],
  );
  return ctx;
};

let page;

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
    await page.waitForSelector(ready, { timeout: 120000 });
    await page.waitForTimeout(1500);
    await prep();
  }
};

/* ONE COMPONENT, ON NOTHING — see cap-0802.mjs for the full reasoning.
 *
 * `union` measures the box round the element's CHILDREN instead of the element
 * itself, for a component whose parts have no wrapper of their own. */
const isolate = async (name, sel, { nth = 0, pad = 16, union = false } = {}) => {
  await prep();
  await page.locator(sel).nth(nth).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await prep();

  const box = await page.evaluate(
    ([s, i, u]) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) throw new Error("no element for " + s);
      el.setAttribute("data-iso", "");
      const style = document.createElement("style");
      style.id = "iso-style";
      style.textContent =
        "html,body{background:transparent !important}" +
        "body *{visibility:hidden !important}" +
        "[data-iso],[data-iso] *{visibility:visible !important}";
      document.head.appendChild(style);
      window.__undoIsolate = () => {
        document.getElementById("iso-style")?.remove();
        document.querySelectorAll("[data-iso]").forEach((n) => n.removeAttribute("data-iso"));
      };
      if (!u) {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }
      const kids = [...el.children].map((k) => k.getBoundingClientRect()).filter((r) => r.height);
      if (!kids.length) throw new Error("nothing to union inside " + s);
      const x = Math.min(...kids.map((r) => r.left));
      const y = Math.min(...kids.map((r) => r.top));
      const right = Math.max(...kids.map((r) => r.right));
      const bottom = Math.max(...kids.map((r) => r.bottom));
      return { x, y, width: right - x, height: bottom - y };
    },
    [sel, nth, union],
  );

  const leaked = await page.evaluate(scan, { banned: BANNED, clip: box, pageSpace: false });
  if (leaked.length) {
    await page.evaluate(() => window.__undoIsolate?.());
    throw new Error(`${name}: banned words inside the component — ${leaked.join(", ")}.`);
  }

  await page.screenshot({
    path: out(name),
    omitBackground: true,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: box.width + pad * 2,
      height: box.height + pad * 2,
    },
  });
  await page.evaluate(() => window.__undoIsolate?.());
  console.log(`  ${name}  (${Math.round(box.width)}x${Math.round(box.height)} css)`);
};

console.log("capturing ->", DIR);

/* ================================================================== *
 * 1 — ONE COURSE CARD, AT THREE STAGES.  (morning)
 *
 * The component the house style calls the best thing the app owns: a folder
 * mark, a streak, a fortnight of that course's own reading drawn in its own
 * hue behind the text, a score, and a Resume button whose fill IS the progress
 * bar. Three states that differ in kind — a month in, just started, and never
 * opened, which draws no curve at all and says Start.
 *
 * ONE CARD, not the section it sits in. The section holds four of these and
 * photographing it means shrinking all four to fit, which is four components
 * at a third of the size rather than one at full size.
 *
 * 1200px tall window: a page clip is measured against the VIEWPORT, so a
 * component below the fold comes back clamped.
 * ================================================================== */
const card = async (name, nth) => {
  const ctx = await ctxFor({ identity: who({ target: { days: 4, minutes: 30 } }), seed: SEED, h: 1200 });
  page = await ctx.newPage();
  await go("/dashboard", "main");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await isolate(name, ".course-card", { nth });
  await ctx.close();
};

/* All three off one "show me everything" dashboard, so the cards are the app's
 * own arithmetic on a single seeded reader rather than three invented ones:
 * index 1 is a month in, 3 has one lesson touched, 2 has never been opened. */
await card("cc-deep.png", 1);
await card("cc-started.png", 3);
await card("cc-fresh.png", 2);

/* ================================================================== *
 * 2 — THE SEARCH PANEL, AT THREE QUERIES.  (afternoon)
 *
 * The panel, not the 32px button that opens it — the button alone is a
 * magnifier on a gradient, which tells a stranger nothing.
 *
 * The QUERY has to be a neutral word that also matches the real index: search
 * runs against the app's own data, and only the rendered result rows are
 * relabelled. A neutral word that matches nothing returns an empty panel three
 * times over.
 * ================================================================== */
/* SHOT INSIDE COURSE 1, and that is the whole trick. Search is per-course and
 * its results are the app's REAL step titles — only the ones `MAP` covers get
 * relabelled, and the banned-word scan cannot catch a title that is merely
 * off-syllabus rather than forbidden. Shot on course 4 it returned a screen of
 * hedging and forward rates under a card headed Marketing Management. Course 1
 * is the one whose whole tree is mapped, lesson and step, so every row that
 * comes back is neutral. */
const ctx2 = await ctxFor({ identity: who({ courses: ["economics"] }), seed: SEED });
page = await ctx2.newPage();
await go("/microeconomics/supply-demand/law-of-demand", ".checkpoint-row");

const PANEL = "div:has(> div > input[aria-label='Search the course'])";
const query = async (name, q) => {
  await page.fill('input[aria-label="Search the course"]', q);
  await page.waitForTimeout(800);
  await isolate(name, PANEL);
};

/* Opened and empty is the first state, and it is a real one: the panel offers
 * the whole course before you have typed anything. It is also the safe one —
 * a result row carries an excerpt of the step's own PROSE, and only titles are
 * relabelled, so most queries trip the scan on a word in the body. "policy"
 * and "value" both did. Two that survive are two, not three. */
await page.click('button[aria-label="Search"]');
await page.waitForTimeout(700);
await isolate("sq-a.png", PANEL);
await query("sq-b.png", "market");
await query("sq-c.png", "policy");
await ctx2.close();

/* ================================================================== *
 * 3 — ONE STAT TILE, AT FOUR MEASURES.  (midday)
 *
 * `.dash-stat` — a label, a number, a change on last week and that measure's
 * own curve, in its own hue. Four tiles is four states of one component, not
 * four components: each is the same tile answering a different question.
 * ================================================================== */
const ctx3 = await ctxFor({
  identity: who({ courses: ["treasury-management", "corporate-finance"], target: { days: 4, minutes: 30 } }),
  seed: SEED,
  h: 1200,
});
page = await ctx3.newPage();
await go("/dashboard", ".dash-stat");
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
for (const [i, n] of [[0, "st-1.png"], [1, "st-2.png"], [2, "st-3.png"], [3, "st-4.png"]]) {
  await isolate(n, ".dash-stat", { nth: i });
}
await ctx3.close();

/* ================================================================== *
 * 4 — THE CHECKPOINT, AT THREE ANSWERS.  (evening)
 *
 * The whole row — the question and the marks under it — rather than a mark on
 * its own. A thumb glyph floating on a gradient is the tap-to-define mistake
 * again: it is not pointing at anything a stranger can see.
 * ================================================================== */
const ctx4 = await ctxFor({ identity: who({ courses: ["treasury-management"] }) });
page = await ctx4.newPage();
await go("/treasury-management/treasury-operations/treasury-levels-and-mandate", ".checkpoint-row");

const ROW = ".checkpoint-row";
await isolate("ck-open.png", ROW, { nth: 0 });

/* By aria-label, never by index: the first rows are answered by the seed, so
 * an nth here picks a seeded row and files the wrong answer under the right
 * filename. */
const answer = async (label, name) => {
  await page.locator(`${ROW}`).nth(0).locator(`[aria-label="${label}"]`).click();
  await page.waitForTimeout(600);
  await isolate(name, ROW, { nth: 0 });
};
await answer("Got it", "ck-got.png");
await answer("Later", "ck-later.png");
await ctx4.close();

await browser.close();
console.log("done");
