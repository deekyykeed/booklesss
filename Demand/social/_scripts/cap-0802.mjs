/* Capture for the 2026-08-02 posts.
 *
 *   node _scripts/cap-0802.mjs              # dev server on :3100
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0802.mjs
 *
 * Writes _source/feature-capture/b-*.png.
 *
 * WHAT IS DIFFERENT ABOUT TODAY (owner's call, 2 Aug): the subject is a single
 * COMPONENT, not a page. Yesterday every slide was an area of the interface —
 * a panel with its prose, a screen with its heading. Today each slide is one
 * control or one card, cropped to its own edges and enlarged until it fills the
 * frame's width. That reverses yesterday's "crops are areas, never controls"
 * instruction, and it is deliberate: yesterday's posts showed what the app is,
 * today's show what changed in it, and what changed is component-sized.
 *
 * Which makes `part()` the whole script. It crops in PAGE space against a
 * full-page screenshot, centres the element in a 9:16 box, and has no 300px
 * floor — a 34px button cropped at 150px wide is the point, not a mistake.
 *
 * Two standing rules are enforced here rather than remembered:
 *
 *  1. NEVER A SPECIFIC COURSE OR SCHOOL. Everything is relabelled by
 *     neutralize.mjs and then *scanned* — a banned word inside the exact crop
 *     throws instead of writing the PNG. Tight crops make this easier, not
 *     harder: a 200px box around a button contains no prose at all. The one
 *     place it bites is the card set, whose body text IS the subject of its
 *     slide, so neutralize.mjs now carries placeholder card copy.
 *  2. NOTHING IS DRAWN. If a component photographs badly the fix is the crop or
 *     the app's own state, never a retouch.
 *
 * Two contexts, because the day's components live in two places:
 *   1. the reading step — checkpoint marks and the section-note menu, shot on
 *      the neutral-relabelled step every previous capture has used;
 *   2. the step carrying the new `cards` block, which exists in exactly one
 *      place in the content tree.
 * Plus the home page for the stat tiles, on the first context.
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

/* Someone about a month in — the same reader yesterday's posts were shot on,
 * so the tiles carry a history rather than a first day. */
const FULL = ["what-is-economics", "how-to-use", "glossary", "law-of-supply", "equilibrium", "ped", "free-cash-flows"];
const PARTIAL = ["yed", "npv-and-payback"];

/* The step the component shots are taken on. Deliberately NOT in FULL: its
 * first two sections are answered and its last two are open, so one page
 * carries both an answered checkpoint row and an untouched one. */
const STAGE = "law-of-demand";
const STAGE_ANSWERS = { overview: "got", "key-ideas": "not" };

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

/* Four weeks, deterministic so a re-run redraws the same curve. Rest days sit
 * next to each other: two days off together draw one trough, which is what a
 * weekend looks like — alternating them draws a comb. */
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
    courses: b ? { economics: secs - b, "corporate-finance": b } : { economics: secs },
    courseChecks: b && checks > 1 ? { economics: checks - 1, "corporate-finance": 1 } : { economics: checks },
  };
}

const SEED = JSON.stringify({ done, days, touched, grasp });

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

const phone = async () => {
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

/* `networkidle` is the wrong wait against a dev server: HMR holds a socket open
 * and a recompile mid-navigation never settles. Wait for the DOM, then for
 * something real on it.
 *
 * The relabel is retried once. Arriving at a route the dev server has not
 * compiled yet means the first paint can be replaced a beat later, and a
 * transform running across that swap dies with "execution context was
 * destroyed" — which is the page working, not failing. */
const go = async (url, ready = "main", opts = {}) => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.waitForTimeout(1300);
  try {
    await prep(opts);
  } catch {
    await page.waitForSelector(ready, { timeout: 120000 });
    await page.waitForTimeout(1500);
    await prep(opts);
  }
};

/* Nothing is written without being checked first. */
const shot = async (name, clip, { full = false, ...opts } = {}) => {
  await prep(opts);
  const leaked = await page.evaluate(scan, { banned: BANNED, clip, pageSpace: full });
  if (leaked.length) {
    throw new Error(
      `${name}: banned words inside the crop — ${leaked.join(", ")}. ` +
        `Extend MAP in neutralize.mjs, or tighten the crop.`,
    );
  }
  await page.screenshot({ path: out(name), clip, fullPage: full });
  console.log("  " + name);
};

/* ONE COMPONENT, cropped to its own edges and blown up.
 *
 * Cropped in document coordinates against a full-page screenshot, never
 * against the viewport: a component near the foot of a short page can't be
 * scrolled to the middle of the screen, and a viewport crop of it silently
 * clamps and photographs whatever happens to be above.
 *
 * THE CROP IS SIZED FROM THE COMPONENT, not from a number picked in advance.
 * `pad` is how much room it gets either side, so the same value frames a 34px
 * button and a 370px card sensibly, and moving one of them in the app doesn't
 * silently turn its slide into a picture of its neighbour. That is what a fixed
 * `width` did on the first pass: 215px around a 168px stat tile pulled in the
 * column beside it, and 300px around a 370px card cut the card in half.
 * A negative `pad` bleeds the component off both sides, which is how a tile in
 * a grid loses the one next to it.
 *
 * There is no minimum. Yesterday's `area()` refused to go below 300px because a
 * picture of one control was the thing being avoided; today one control is the
 * brief, and 120px (9x) is a normal value here.
 *
 * `lift` then moves the component off centre, in fractions of the crop height.
 * POSITIVE puts it higher up the frame. A 9:16 box around a wide, short control
 * is mostly page whichever way you cut it, so the choice is which page: a
 * checkpoint row lifted DOWN keeps the section it is answering above it, which
 * is the difference between a control in context and a control adrift.
 */
const part = async (name, sel, { pad = 12, width, nth = 0, lift = 0, ...opts } = {}) => {
  await prep(opts);

  /* A full-page screenshot renders position:sticky elements wherever the page
   * happens to be scrolled to, so the reader's floating header lands as a band
   * across the middle of any crop taken further down. Parking the page at the
   * top puts it back at y=0, where it belongs and where no crop goes. Measure
   * AFTER scrolling: the document coordinates are the same either way, but the
   * scan compares against window.scrollY and would otherwise use two origins. */
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(350);
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
        h: r.height,
        docW: document.documentElement.scrollWidth,
        docH: document.documentElement.scrollHeight,
      };
    },
    [sel, nth],
  );

  let w = Math.min(box.docW, Math.round(width ?? box.w + pad * 2));
  let h = Math.round((w * 16) / 9);
  if (h > box.docH) {
    h = box.docH;
    w = Math.round((h * 9) / 16);
    console.log(`    ${name}: would overrun the page — closed in to ${w}px`);
  }

  /* Centre the component in the crop, then move it by `lift`. Left-align
   * instead when it is MUCH wider than the crop: the app's text is
   * left-aligned, so centring a paragraph shaves the first letter off every
   * line. The threshold matters — at a bare `box.w > w` a deliberate 5px bleed
   * counted as "wider" and slid the whole tile right, cutting the mark off its
   * corner. A crop within 15% of its subject is a bleed, not a pan. */
  const idealX = box.w > w * 1.15 ? box.x - 8 : box.x + box.w / 2 - w / 2;
  const idealY = box.y + box.h / 2 - h / 2 + lift * h;
  const x = Math.max(0, Math.min(box.docW - w, Math.round(idealX)));
  const y = Math.max(0, Math.min(box.docH - h, Math.round(idealY)));
  console.log(`    ${name}: ${Math.round(box.w)}x${Math.round(box.h)} -> crop ${w}x${h} (${(1080 / w).toFixed(1)}x)`);
  await shot(name, { x, y, width: w, height: h }, { full: true, ...opts });
};

console.log("capturing ->", DIR);

/* ---------- 1. the reading step: two controls at the foot of a section ------ */
const ctx1 = await phone();
page = await ctx1.newPage();

await go("/microeconomics/supply-demand/law-of-demand", ".checkpoint-row", { reader: true });

const R = { reader: true };
const rows = page.locator(".checkpoint-row");

/* The row as a reader meets it: nothing answered, both marks hairline, the
 * note button at the other end of the same line. Pushed DOWN the frame so the
 * end of the section it belongs to sits above it — the row is an answer to
 * something, and a control with nothing above it is a puzzle. */
/* THE ANSWER MARKS ARE FRAMED AT COLUMN WIDTH, NOT AS MACROS, and that is a
 * measurement rather than a preference.
 *
 * The pair sits in a 74px band of clear page (the paragraph above ends 20px
 * up, the section rule is 20px down). A 9:16 crop tall enough to clear that
 * band on both sides works out 42px wide — narrower than the two 34px marks it
 * is meant to contain. So every macro of them includes the paragraph above,
 * and because the group is RIGHT-aligned, the crop's left edge falls in the
 * middle of that paragraph and slices every line mid-word: "ing new this week."
 * Lifting the marks clear of it instead pushes them into the top 300px the
 * feed's own header covers.
 *
 * The note button escapes this only because it is LEFT-aligned — its crop
 * starts at the reading column's left edge, so the lines above it are whole.
 *
 * So: three states of the row at 2.8x, each on a different section, so the
 * prose above changes and three shots of one component do not read as one shot
 * posted three times.
 */
await part("b-row.png", ".checkpoint-row", { pad: 6, nth: 2, lift: -0.05, ...R });

/* Marked to come back to: the bookmark fills, takes its amber, and the tick
 * beside it drops to 55% — the answer given stops competing with the one that
 * wasn't. Seeded rather than clicked, so it is a device that has been read on
 * before rather than one where everything happened in the last two seconds. */
await part("b-later.png", ".checkpoint-row", { pad: 6, nth: 1, lift: -0.05, ...R });

/* And the other decision, on the last section of the step. */
await rows.nth(3).getByRole("radio", { name: "Got it" }).click();
await page.waitForTimeout(450);
await part("b-got.png", ".checkpoint-row", { pad: 6, nth: 3, lift: 0.06, ...R });

/* ---------- 2. the note button, and the menu behind it ---------- *
 * `.grasp-btn[aria-expanded]` picks the note buttons ONLY. A bare `.grasp-btn`
 * is every control in the row — note, bookmark, tick — so nth:1 was the second
 * button of the FIRST row rather than the note button of the second. */
const NOTE_BTN = ".grasp-btn[aria-expanded]";

/* Closed. The dots went on today: a bare speech bubble said nothing about what
 * pressing it would ask. */
await part("b-note.png", NOTE_BTN, { pad: 44, nth: 0, lift: 0.22, ...R });

/* Open. Five options, and the thing today's fix was about — it hangs off the
 * button's LEFT edge now, because that is the edge the button is on. */
await page.locator(".checkpoint-row").nth(1).locator(NOTE_BTN).first().click();
await page.waitForTimeout(600);
await part("b-menu.png", '[role="menu"]', { pad: 22, ...R });

/* Answered: the option ticks, the menu closes, and the button fills in so the
 * reader can see what they said. */
await page.locator('[role="menu"] button', { hasText: "Needs an example" }).first().click();
await page.waitForTimeout(600);
await part("b-noted.png", NOTE_BTN, { pad: 44, nth: 1, lift: 0.22, ...R });

/* ---------- 3. the four stat tiles ---------- *
 * A tile is 181x131 — nearly two and a half times wider than tall, where the
 * frame is nine to sixteen. There is no crop that fills a 9:16 box with one
 * tile and nothing else, so the choice is which neighbour bleeds in. Sideways
 * is fatal (the duotone mark lives in the top-right corner and is the whole
 * point of the shot); vertically it is the tile above and below, four inches
 * of the grid the tile belongs to, which reads as a close-up rather than as a
 * mistake. So: just wide enough to keep the mark, and let the column bleed. */
await go("/", ".dash-stat");
for (let i = 0; i < 4; i++) {
  await part(`b-tile-${i + 1}.png`, ".dash-stat", { pad: 7, nth: i });
}

await ctx1.close();

/* ---------- 4. the card set ---------- *
 * The only place in the tree carrying a `cards` block. Its body copy is
 * relabelled by neutralize.mjs — unlike every other crop today this text is
 * the subject of the slide, so it has to be legible AND neutral, and the scan
 * is what proves the second half. */
const ctx2 = await phone();
page = await ctx2.newPage();
await go("/treasury-management/treasury-operations/treasury-levels-and-mandate", ".checkpoint-row");

const CARDS = "#task-levels .flex.flex-col.gap-3";

/* All three, which is the point: they are a set on one axis, and a set is the
 * thing a table was failing to be. The block is shorter than a 9:16 box even at
 * its own width, so the slack is pushed to the foot rather than split — a crop
 * that opens mid-sentence reads as a mistake, one that opens on a card's own
 * top edge reads as framing. */
await part("b-cards.png", CARDS, { pad: 1, lift: -0.06 });

/* And the three marks, which are the reason this is a card set and not a list.
 * A single CARD is not a shot: it is 184px tall inside a 665px frame at its own
 * width, so a crop centred on one photographs all three and the "close-up"
 * comes out identical to the wide one. The 28px mark is the only part of the
 * block small enough for a 9:16 box to actually be about it. */
for (let i = 0; i < 3; i++) {
  await part(`b-glyph-${i + 1}.png`, `${CARDS} > div svg`, { pad: 46, nth: i });
}

await ctx2.close();
await browser.close();
console.log("done ->", DIR);
