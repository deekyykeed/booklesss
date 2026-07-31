/* Capture for the 2026-07-31 posts — the day the tick became a question.
 * Shot from the real app's MOBILE layout (house rule), full-bleed 9:16 crops,
 * no boxes, nothing drawn by hand.
 *
 *   node _scripts/cap-0731.mjs          # needs the dev server on :3100
 *
 * Writes _source/feature-capture/f-*.png.
 *
 * Two standing rules are enforced here rather than remembered:
 *
 *  1. NEVER A SPECIFIC COURSE OR SCHOOL. Every shot is relabelled to a neutral
 *     two-subject curriculum by neutralize.mjs and then *scanned* — a banned
 *     word still on screen throws instead of writing the PNG.
 *
 *  2. NOTHING IS DRAWN. If a screen photographs badly it is because the data
 *     behind it is thin, so we seed data into the app and shoot it again.
 *
 * WHAT CHANGED SINCE cap-day.mjs (and why this is a new file, not an edit):
 *
 *  - The store is **v6**, not v3. v3's `quiz` records — how many comprehension
 *    questions were answered right first time — no longer exist; the quiz was
 *    deleted and replaced by a three-way self-rating held in `grasp`
 *    (lessonId -> checkpointId -> "got" | "almost" | "not"). Seeding v3 would
 *    still migrate, but it would arrive with `grasp: {}` and every checkpoint
 *    row would photograph unanswered — which is the one thing today's posts
 *    are about.
 *  - The tiles are Performance / Streak / Coverage / Time this week. "First
 *    try", "Going stale" and "Weakest step" are gone with the quiz.
 *  - There is no live-reader count to shoot. `presence.tsx` was deleted.
 *
 * The step the reader shots are taken on is left **part-answered** on purpose:
 * two sections rated, two still open, so a single page carries both states and
 * no slide has to reuse another's crop. The closer is then shot for real — by
 * answering the remaining rows in the browser, not by seeding a finished step.
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
const FULL = ["what-is-economics", "how-to-use", "glossary", "law-of-supply", "equilibrium", "ped", "free-cash-flows"];
const PARTIAL = ["yed", "npv-and-payback"];

/* The step every reader shot is taken on. Deliberately NOT in FULL: it is
 * left with its first two sections answered and its last two open, so one page
 * carries an answered row and an unanswered row and neither slide has to
 * borrow the other's crop. */
const STAGE = "law-of-demand";
const STAGE_ANSWERS = { overview: "got", "key-ideas": "almost" };

const done = {};
for (const id of FULL) {
  const l = byId(id);
  if (l) done[l.id] = l.sections;
}
for (const id of PARTIAL) {
  const l = byId(id);
  if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 2));
}
done[STAGE] = Object.keys(STAGE_ANSWERS);

/* How each cleared section landed. Mostly "got" — someone a month in is
 * mostly following it — with a scatter of "almost" and one honest "not", which
 * is what stops the closer from only ever reporting a clean sweep. Any answer
 * clears the checkpoint, so `grasp` and `done` agree by construction. */
const SOFT = {
  ped: ["overview"],
  equilibrium: ["key-ideas"],
  "npv-and-payback": ["overview"],
};
const HARD = { ped: ["key-ideas"] };
const grasp = {};
for (const [lessonId, ids] of Object.entries(done)) {
  const row = {};
  for (const cid of ids) {
    row[cid] = (HARD[lessonId] ?? []).includes(cid) ? "not" : (SOFT[lessonId] ?? []).includes(cid) ? "almost" : "got";
  }
  grasp[lessonId] = row;
}
grasp[STAGE] = { ...STAGE_ANSWERS };

/* When each finished step was last opened. */
const touched = {
  "what-is-economics": ago(30),
  "how-to-use": ago(24),
  glossary: ago(11),
  "law-of-demand": ago(0),
  "law-of-supply": ago(9),
  equilibrium: ago(6),
  ped: ago(3),
  yed: ago(2),
  "free-cash-flows": ago(4),
  "npv-and-payback": ago(0),
};

/* Four weeks of study, deterministic so a re-run redraws the same curve.
 * 0 = a day nothing was read.
 *
 * Rest days are kept ADJACENT rather than alternating: two days off together
 * draw one trough, which is what a weekend actually looks like. Alternating
 * them draws a comb, and a comb photographs as decoration.
 *
 * The last seven give five study days and ~2h40 of reading — full marks on
 * both effort terms, which is the point the score post has to be able to make
 * honestly. The week before is six days and slightly more time, so the delta
 * comes from coverage rather than from a manufactured slump. */
const MINUTES = [
  18, 26, 0, 31, 22, 0, 0,
  29, 35, 0, 24, 41, 14, 0,
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

const SEED = JSON.stringify({ done, days, touched, grasp });

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
    localStorage.setItem("booklesss:progress:v6", seed);
  } catch {}
}, SEED);
const page = await ctx.newPage();

/* Everything that has to be true at the instant of the shot. React re-renders
 * undo a relabel done once up front, so this runs immediately before every
 * screenshot. */
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
 * and a recompile mid-navigation never settles. Wait for the DOM, then for
 * something real to be on it. */
const go = async (url, ready = "main") => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(ready, { timeout: 60000 });
  await page.waitForTimeout(1100);
  await prep();
};

/* Put a known element a known distance below the viewport top. Raw pixel
 * offsets break the moment the content above changes length. The offsets are
 * large on purpose: the poster dissolves the top of every shot, so a subject
 * photographed near the top of its crop arrives half-faded. */
const bring = async (sel, top = 150, nth = 0) => {
  await page.evaluate(
    ([s, t, i]) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) throw new Error("no element for " + s);
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - t, behavior: "instant" });
    },
    [sel, top, nth],
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
 * against the exact crop about to be photographed. */
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

/* A macro of one real element, cropped against a FULL-PAGE screenshot in
 * document coordinates — never against the viewport, where an element near the
 * foot of a short page silently clamps and photographs whatever is above.
 *
 * `width` is the zoom control: narrower crop = larger in the frame. Give a
 * full-width element (a checkpoint row, the step closer) a width at least as
 * wide as it is, or the left-align rule below will bleed its right-hand end —
 * and on a row of three buttons the right-hand end is the answer. */
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
   * near the foot of a short page does not fit and would slide up. Shrink to
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
   * centring shaves the first letters off every line. */
  const ideal = box.w > w ? box.x - 6 : box.x + box.w / 2 - w / 2;
  const x = Math.max(0, Math.min(box.docW - w, Math.round(ideal)));
  const y = Math.max(0, Math.min(box.docH - h, Math.round(box.y - padTop)));
  await shot(name, { x, y, width: w, height: h }, true);
};

console.log("capturing ->", DIR);

/* ---------- the reader: today's headline ----------
 * Shot on the step whose body neutralize.mjs actually rewrites. The other
 * course's steps carry worked examples in kwacha with the course's own
 * formulas in them, and there is no honest way to relabel a table of numbers —
 * so those pages are simply not photographed. The crop scan enforces it. */
const LESSON = "/microeconomics/supply-demand/law-of-demand";
await go(LESSON, ".checkpoint-row");

/* The reading page itself, before any of the measuring. */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await prep();
await shot("f-read-top.png", TALL);

await bring("#key-ideas", 340);
await shot("f-read.png", MID);

/* The question at the end of a section, in context — the third row, which the
 * seed leaves unanswered, so all three answers read at full strength. */
await bring(".checkpoint-row", 470, 2);
await shot("f-check.png", MID);

/* The two answered rows, each on a different part of the step so no two slides
 * share a crop: the green "Got it" under the opening idea, the amber "Almost"
 * under the key ideas.
 *
 * Both are the FULL 402 page width, not a narrower macro. The row is nearly as
 * wide as the phone, so any narrower crop is left-aligned by the rule below and
 * shaves the right-hand end off — and on a row of three buttons the right-hand
 * end is "Got it", the answer the whole feature is about. A 402 crop still
 * lands at 2.79x in the poster, which is plenty. */
await macro("f-answered.png", ".grasp-group", { width: 402, padTop: 300, nth: 0 });
await macro("f-almost.png", ".grasp-group", { width: 402, padTop: 400, nth: 1 });

/* Finish the step for real, in the browser, rather than seeding a finished one
 * — the closer's line is then the app's own arithmetic on answers that were
 * actually given. Two of the four are less than "Got it", so it reports what
 * did not land instead of a clean sweep. */
const rows = page.locator(".checkpoint-row");
await rows.nth(2).getByRole("radio", { name: "Almost" }).click();
await page.waitForTimeout(350);
await rows.nth(3).getByRole("radio", { name: "Got it" }).click();
await page.waitForTimeout(700);
await bring(".step-complete", 420);
await shot("f-closer.png", MID);

/* The way around the subject. The drawer is frosted, so whatever sits behind it
 * shows through — open it at the top of the page and the reader's callout box
 * reads straight through the nav labels like a rendering fault. Park the page
 * on a run of body text first, where the bleed-through is just soft grey. */
await bring("#in-practice", 40);
await page.waitForTimeout(300);
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(800);
await prep();
await shot("f-nav.png", DRAWER);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

/* ---------- the home page: the scoreboard ---------- */
await go("/", ".dash-stat");

/* The dashboard's opening line — the greeting and the state of play. */
await shot("f-top.png", { x: 0, y: 60, width: 402, height: 715 });

/* The four tiles together, then one at a time. Each carries its own 14-day
 * mini chart now, which is the thing the tiles post has to show. */
await bring(".dash-stat", 340);
await shot("f-tiles.png", MID);
await macro("f-perf.png", ".dash-stat", { width: 232, nth: 0, padTop: 90 });
await macro("f-streak.png", ".dash-stat", { width: 232, nth: 1, padTop: 90 });
await macro("f-coverage.png", ".dash-stat", { width: 232, nth: 2, padTop: 90 });
await macro("f-time.png", ".dash-stat", { width: 232, nth: 3, padTop: 90 });

/* The courses themselves — back on the wide layout, and without the live
 * count that came off them today. */
await go("/", "#courses");
await bring("#courses", 330);
await shot("f-cards.png", TALL);
/* The resume button: its fill IS the progress bar, and it names the next step.
 * Full page width for the same reason as the answer rows — the button spans
 * almost the whole card, and a 330 crop took the right-hand end of both card
 * titles with it ("65%" and "71%" both lost their last character). */
await macro("f-resume.png", ".course-resume", { width: 402, padTop: 330 });

await browser.close();
console.log("done ->", DIR);
