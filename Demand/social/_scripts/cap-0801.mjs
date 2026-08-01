/* Capture for the 2026-08-01 posts.
 *
 *   node _scripts/cap-0801.mjs              # dev server on :3100
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0801.mjs
 *
 * Writes _source/feature-capture/a-*.png.
 *
 * WHAT IS DIFFERENT ABOUT TODAY (owner's call, 1 Aug): the slides carry NO
 * copy. Every one of them is the app itself — an area of the interface,
 * enlarged, with nothing written over it. Two things follow from that:
 *
 *  1. The crops are AREAS, not macros. A panel with the prose it belongs to, a
 *     row of tiles with the line above it, a screen with its heading. A
 *     close-up of one button or one icon is explicitly not wanted — the
 *     subject is the interface, not a control. Nothing here crops below 300
 *     CSS px wide for that reason.
 *  2. Framing has nowhere to hide. On a copy slide the top of the shot
 *     dissolves under a headline, so a crop that starts mid-sentence is never
 *     seen; here the crop IS the slide, top edge included. So every shot is
 *     positioned by `bring()` against a real element, and read back before it
 *     is used.
 *
 * Two standing rules are enforced here rather than remembered:
 *
 *  1. NEVER A SPECIFIC COURSE OR SCHOOL. Everything is relabelled to a neutral
 *     curriculum by neutralize.mjs and then *scanned* — a banned word still on
 *     screen throws instead of writing the PNG. With no copy on the slides the
 *     screenshot is the whole post, so this matters more today, not less.
 *  2. NOTHING IS DRAWN. If a screen photographs badly it is because the data
 *     behind it is thin, so we seed data into the app and shoot it again.
 *
 * NEW SINCE cap-0731.mjs:
 *  - The app asks who is reading before it shows anything (IdentityGate), so
 *    every shot that is not OF that form seeds an identity as well as
 *    progress. Without it every screenshot is a modal over a blurred page.
 *  - The home page's courses are the reader's OWN courses now, so the seeded
 *    identity has to be enrolled in the two the shots are about.
 *  - A third context shoots the identity form itself, unseeded.
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

/* Steps finished, and two part-way — the shape of someone a month in. */
const FULL = ["what-is-economics", "how-to-use", "glossary", "law-of-supply", "equilibrium", "ped", "free-cash-flows"];
const PARTIAL = ["yed", "npv-and-payback"];

/* The step every reader shot is taken on. Deliberately NOT in FULL: its first
 * two sections are answered and its last two are open, so one page carries an
 * answered row and an unanswered row and no crop has to borrow another's. */
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

const SOFT = { ped: ["overview"], equilibrium: ["key-ideas"], "npv-and-payback": ["overview"] };
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

/* Four weeks of study, deterministic so a re-run redraws the same curve. Rest
 * days sit next to each other on purpose: two days off together draw one
 * trough, which is what a weekend looks like — alternating them draws a comb,
 * and a comb photographs as decoration rather than as somebody's week. */
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
  /* The second course only appears in the last fortnight — it was started
   * then, and crediting it a month of reading would be a lie told by a chart. */
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

/* Who the device belongs to. The home page lists THEIR courses and measures
 * the tiles against them, so this is what puts two courses on the page. */
const WHO = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  school: "zcas",
  schoolName: null,
  courses: ["economics", "corporate-finance"],
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
});

/* ---- browser ---- */
const browser = await chromium.launch();

/** A phone, optionally already knowing who is reading. The identity form is
 *  not dismissible by design, so an unidentified context can only shoot the
 *  form itself — which is one of today's slots. */
const phone = async (identified = true) => {
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
        if (who) localStorage.setItem("booklesss:identity:v1", who);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [SEED, identified ? WHO : null],
  );
  return ctx;
};

let page;

/* Everything that has to be true at the instant of the shot. React re-renders
 * undo a relabel done once up front, so this runs immediately before every
 * screenshot. */
const prep = async ({ reader = false } = {}) => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
  await page.evaluate(transform, { map: MAP, reader: reader ? READER : null, deep: true });
};

/* `networkidle` is the wrong wait against a dev server: HMR holds a socket
 * open and a recompile mid-navigation never settles. Wait for the DOM, then
 * for something real on it. */
const go = async (url, ready = "main", opts = {}) => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.waitForTimeout(1300);
  await prep(opts);
};

/* Put a known element a known distance below the viewport top. Raw pixel
 * offsets break the moment the content above it changes length. */
const bring = async (sel, top = 150, nth = 0, opts = {}) => {
  await page.evaluate(
    ([s, t, i]) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) throw new Error("no element for " + s);
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - t, behavior: "instant" });
    },
    [sel, top, nth],
  );
  await page.waitForTimeout(500);
  await prep(opts);
};

/* Nothing is written without being checked first: the banned-word scan runs
 * against the exact crop about to be photographed. */
const shot = async (name, clip, { full = false, ...opts } = {}) => {
  await prep(opts);
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

/* A 9:16 crop of the phone screen. Anything shorter would leave a hard edge
 * where the image stops, because today there is no fade over it. */
const SCREEN = (y = 156) => ({ x: 0, y, width: 402, height: 715 });
const DRAWER = { x: 0, y: 40, width: 300, height: 533 };

/* An AREA of the interface, cropped against a FULL-PAGE screenshot in document
 * coordinates — never against the viewport, where an element near the foot of
 * a short page silently clamps and photographs whatever is above it.
 *
 * `width` is the zoom: a narrower crop lands larger in the frame. The floor is
 * 300 — below that a crop stops being an area of the UI and becomes a picture
 * of one control, which is the thing today's brief rules out. */
const area = async (name, sel, { width = 402, padTop = 60, nth = 0, ...opts } = {}) => {
  await prep(opts);
  const box = await page.evaluate(
    ([s, i]) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) throw new Error("no element for " + s);
      const r = el.getBoundingClientRect();
      return {
        x: r.x + window.scrollX,
        y: r.y + window.scrollY,
        w: r.width,
        docW: document.documentElement.scrollWidth,
        docH: document.documentElement.scrollHeight,
      };
    },
    [sel, nth],
  );
  const room = box.docH - Math.max(0, box.y - padTop);
  let w = Math.min(box.docW, Math.max(width, 300));
  let h = Math.round((w * 16) / 9);
  if (h > room) {
    h = Math.floor(room);
    w = Math.round((h * 9) / 16);
    console.log(`    ${name}: ${width}px wide would overrun the page — closed in to ${w}px`);
  }
  /* Left-align when the element is wider than the crop: the app's text is
   * left-aligned, so centring shaves the first letter off every line. */
  const ideal = box.w > w ? box.x - 8 : box.x + box.w / 2 - w / 2;
  const x = Math.max(0, Math.min(box.docW - w, Math.round(ideal)));
  const y = Math.max(0, Math.min(box.docH - h, Math.round(box.y - padTop)));
  await shot(name, { x, y, width: w, height: h }, { full: true, ...opts });
};

console.log("capturing ->", DIR);

/* ---------- 1. the reading page ---------- */
const ctx1 = await phone(true);
page = await ctx1.newPage();

const LESSON = "/microeconomics/supply-demand/law-of-demand";
await go(LESSON, ".checkpoint-row", { reader: true });

/* The top of a step: where it sits, its title, and the paragraph it opens on. */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await shot("a-read-top.png", SCREEN(96), { reader: true });

/* The key-ideas list, with the heading that introduces it. */
await bring("#key-ideas", 250, 0, { reader: true });
await shot("a-list.png", SCREEN(), { reader: true });

/* The question a section ends on, unanswered. */
await bring(".checkpoint-row", 430, 2, { reader: true });
await shot("a-check.png", SCREEN(159), { reader: true });

/* And an answered one, further up the same step. */
await area("a-answered.png", ".grasp-group", { width: 402, padTop: 320, nth: 0, reader: true });

/* Reading further down: body copy with a section heading in the frame. */
await bring("#in-practice", 300, 0, { reader: true });
await shot("a-read-mid.png", SCREEN(), { reader: true });

/* And the section that closes the reading, before the step's own closer. */
await bring("#summary", 300, 0, { reader: true });
await shot("a-summary.png", SCREEN(), { reader: true });

/* The panel that closes a step. Answer the two open rows in the browser first,
 * so the count it reports is the app's own arithmetic on real answers rather
 * than a seeded number. */
const rows = page.locator(".checkpoint-row");
await rows.nth(2).getByRole("radio", { name: "Almost" }).click();
await page.waitForTimeout(350);
await rows.nth(3).getByRole("radio", { name: "Got it" }).click();
await page.waitForTimeout(800);
/* Anchored on the panel and cropped in page space rather than shot through the
 * viewport: the closer sits at the foot of the step, so a viewport crop puts
 * it at the top of the frame with half a screen of empty page under it. */
await area("a-closer.png", ".step-complete", { width: 402, padTop: 430, reader: true });

/* The way around the subject. The drawer is frosted, so whatever sits behind
 * it shows through — park the page on a run of body text first, where the
 * bleed-through is soft grey rather than a panel edge reading as a fault. */
await bring("#in-practice", 40, 0, { reader: true });
await page.waitForTimeout(300);
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(900);
await shot("a-nav.png", DRAWER, { reader: true });
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

/* ---------- 2. the course, and the home page ---------- */
await go("/economics", "main");
await shot("a-course-top.png", SCREEN(90));
await bring("h2", 280, 0);
await shot("a-course-list.png", SCREEN());

await go("/", ".dash-stat");
await shot("a-home-top.png", SCREEN(60));

await bring(".dash-stat", 300, 0);
await shot("a-tiles.png", SCREEN());
await area("a-tiles-in.png", ".dash-stat", { width: 330, padTop: 80 });

await bring("#courses", 280);
await shot("a-cards.png", SCREEN());

await ctx1.close();

/* ---------- 3. the form that asks who is reading ---------- */
const ctx2 = await phone(false);
page = await ctx2.newPage();
await go("/", '[role="dialog"]');

/* A dialog hangs from the top of the screen, so its crop starts higher than an
 * in-page one or it loses its own heading. */
const DIALOG = { x: 0, y: 30, width: 402, height: 715 };
await shot("a-who.png", DIALOG);

await page.fill('[role="dialog"] input', "Chanda");
await page.waitForTimeout(300);
await shot("a-who-named.png", DIALOG);

/* Past the university step without photographing it: every option on it is a
 * real school, and naming one is the thing these posts never do. */
await page.click('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(600);
await page.click('[role="dialog"] fieldset button');
await page.waitForTimeout(400);
await page.click('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(900);
await shot("a-courses.png", DIALOG);

await ctx2.close();
await browser.close();
console.log("done ->", DIR);
