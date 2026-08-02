/* Capture for the 2026-08-02 posts — ISOLATED COMPONENTS.
 *
 *   node _scripts/cap-0802.mjs              # dev server on :3100
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0802.mjs
 *
 * Writes _source/feature-capture/c-*.png, each one a single component on a
 * TRANSPARENT background.
 *
 * WHAT IS DIFFERENT ABOUT TODAY (owner's call, 2 Aug, second pass):
 * "just literally remove everything else other than just that one component."
 *
 * The first pass today cropped a rectangle around each component, which is not
 * the same thing — a 9:16 box around a 131px stat tile still photographs the
 * tile below it, and the slide comes out being about a grid. So there is no
 * crop rectangle here at all. Each shot is an ELEMENT screenshot: Playwright
 * clips to the component's own box, `omitBackground` drops the page's white,
 * and every ancestor's background is cleared first so nothing paints behind it.
 * What lands on disk is the component and its own alpha — a card with its
 * rounded corners cut out, a pair of marks with nothing but the glyphs.
 *
 * The poster then floats it on the brand gradient and tilts it in perspective
 * (see `object()` in prog-post.mjs). Which is only possible because the PNG has
 * real transparency: a rectangular crop tilted in 3D shows its own cut edges.
 *
 * THE SHOTS ARE STATES, NOT VIEWS. One component per carousel, three or four
 * scenarios of it — the checkpoint pair untouched, bookmarked, ticked; the same
 * tile for four different numbers. So the ordering below matters: each shot is
 * taken after the click that puts the app in that state.
 *
 * `deviceScaleFactor: 8`, not 3. A 34px control blown up to fill a 1080px frame
 * is a 10x enlargement, and 3x pixels do not survive it. Everything drawn here
 * is SVG or type, so the only cost of asking for more is memory.
 *
 * The two standing rules still hold and are still enforced: nothing is drawn
 * (only real app state, seeded where it needs data), and nothing names a course
 * or a school (the scan runs against the element's own box before each write).
 * Isolation makes the second one easier — a component's own box rarely contains
 * prose. The exceptions are the card and the definition popup, whose body text
 * IS the subject of their slides, so neutralize.mjs carries placeholder copy for
 * both.
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

const FULL = ["what-is-economics", "how-to-use", "glossary", "law-of-supply", "equilibrium", "ped", "free-cash-flows"];
const PARTIAL = ["yed", "npv-and-payback"];

/* The step the reader shots are taken on. Its last two sections are left open
 * so the checkpoint states can be produced by clicking rather than seeded. */
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

/* Four weeks, deterministic so a re-run redraws the same sparklines. Rest days
 * sit next to each other: two together draw one trough, which is what a weekend
 * looks like — alternating them draws a comb. */
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
    deviceScaleFactor: 8,
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

const prep = async ({ reader = false } = {}) => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
  await page.evaluate(transform, { map: MAP, reader: reader ? READER : null, deep: true });
};

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

/* ONE COMPONENT, ON NOTHING.
 *
 * An element screenshot is a CLIP OF THE PAGE at the element's rect, not a
 * render of the element in isolation — so everything painted underneath comes
 * with it. Clearing the ancestors' backgrounds is not enough either, because
 * the thing painting is often a SIBLING: a fixed page wash, the content
 * surface, a card the component happens to sit on. The first version of this
 * did exactly that and every shot came back as an opaque white oblong with the
 * component sitting on it, which is the same failure as cropping a rectangle,
 * only more expensively arrived at.
 *
 * So: hide everything, then unhide the component and its own subtree.
 * `visibility` rather than `display`, so nothing reflows and the element keeps
 * the position and size it had on the real page. With the page's own canvas
 * background cleared too, `omitBackground` then leaves genuine alpha
 * everywhere the component does not draw — which is what lets the poster tilt
 * it in 3D without showing a cut edge.
 */
const isolate = async (name, sel, { nth = 0, ...opts } = {}) => {
  await prep(opts);

  /* A clipped page screenshot is measured against the VIEWPORT, so anything
   * below the fold fails with "clipped area is outside the resulting image".
   * `locator.screenshot()` used to scroll for us; a padded clip has to do it
   * itself, and before measuring, or the rect is the one from before the
   * scroll. Safe for the definition card too, which closes itself on scroll:
   * it is `position: fixed` and already on screen, so this is a no-op there. */
  await page.locator(sel).nth(nth).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await prep(opts);

  const undo = await page.evaluate(
    ([s, i]) => {
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
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    },
    [sel, nth],
  );

  /* The scan runs against the element's own box in VIEWPORT coordinates, which
   * is the region the element screenshot will contain. Isolation makes this
   * cheap to satisfy and no less necessary: the card and the popup carry prose. */
  const leaked = await page.evaluate(scan, { banned: BANNED, clip: undo, pageSpace: false });
  if (leaked.length) {
    await page.evaluate(() => window.__undoIsolate?.());
    throw new Error(
      `${name}: banned words inside the component — ${leaked.join(", ")}. ` +
        `Extend MAP in neutralize.mjs.`,
    );
  }

  /* A PADDED CLIP, not `locator.screenshot()`. An element screenshot stops at
   * the border box, and a component's own parts can stand outside it: the
   * definition card's arrow is positioned at top:-9px, so it came out as a grey
   * nub clipped along the card's edge and read as damage. Everything else on
   * the page is hidden by now, so widening the rect cannot pull in anything but
   * the component's own overhang and its own shadow. */
  const PAD = 16;
  await page.screenshot({
    path: out(name),
    omitBackground: true,
    clip: {
      x: Math.max(0, undo.x - PAD),
      y: Math.max(0, undo.y - PAD),
      width: undo.width + PAD * 2,
      height: undo.height + PAD * 2,
    },
  });
  await page.evaluate(() => window.__undoIsolate?.());
  console.log(`  ${name}  (${Math.round(undo.width)}x${Math.round(undo.height)} css)`);
};

console.log("capturing ->", DIR);

/* ---------- 1. the checkpoint pair, in three states ---------- */
const ctx1 = await phone();
page = await ctx1.newPage();

await go("/microeconomics/supply-demand/law-of-demand", ".checkpoint-row", { reader: true });

const R = { reader: true };
const rows = page.locator(".checkpoint-row");

/* Untouched: two hairline marks, neither chosen. */
await isolate("c-marks-none.png", ".grasp-group", { nth: 2, ...R });

/* Bookmarked: it fills, takes its amber, and the tick beside it drops to 55%. */
await rows.nth(2).getByRole("radio", { name: "Later" }).click();
await page.waitForTimeout(500);
await isolate("c-marks-later.png", ".grasp-group", { nth: 2, ...R });

/* Ticked: the same control, the other decision. Taken on the next section so
 * the click that produced it is a real one rather than an undo of the last. */
await rows.nth(3).getByRole("radio", { name: "Got it" }).click();
await page.waitForTimeout(500);
await isolate("c-marks-got.png", ".grasp-group", { nth: 3, ...R });

/* And each answered mark ALONE, which is the slide that actually carries.
 * The pair is 78x34 and most of that width is the gap between them, so blown
 * up to fit the frame the glyphs themselves stay small and the composition is
 * two icons adrift. One 34x34 mark is square, so the same frame gives it four
 * times the presence.
 *
 * Both rows are answered by now, so `[data-active]` matches exactly two
 * buttons in document order: the row-2 thumb-down, then the row-3 thumb-up. */
await isolate("c-thumb-down.png", ".grasp-btn[data-active]", { nth: 0, ...R });
await isolate("c-thumb-up.png", ".grasp-btn[data-active]", { nth: 1, ...R });

/* ---------- 2. the note control, in three states ---------- *
 * `.grasp-btn[aria-expanded]` is the note button only — a bare `.grasp-btn` is
 * every control in the row, so nth would count the answers too. */
const NOTE_BTN = ".grasp-btn[aria-expanded]";

await isolate("c-note-shut.png", NOTE_BTN, { nth: 0, ...R });

await page.locator(".checkpoint-row").nth(1).locator(NOTE_BTN).first().click();
await page.waitForTimeout(700);
await isolate("c-note-menu.png", '[role="menu"]', { ...R });

await page.locator('[role="menu"] button', { hasText: "Needs an example" }).first().click();
await page.waitForTimeout(700);
await isolate("c-note-said.png", NOTE_BTN, { nth: 1, ...R });

/* ---------- 3. one stat tile, four numbers ---------- */
await go("/", ".dash-stat");
const TILES = ["perf", "coverage", "streak", "time"];
for (let i = 0; i < 4; i++) {
  await isolate(`c-tile-${TILES[i]}.png`, ".dash-stat", { nth: i });
}

await ctx1.close();

/* ---------- 4. one card, three kinds ---------- *
 * The only place in the tree carrying a `cards` block. Its body copy is
 * relabelled by neutralize.mjs: unlike a control, a card IS its text, so it has
 * to be legible and neutral at once, and the scan proves the second half. */
const ctx2 = await phone();
page = await ctx2.newPage();
await go("/treasury-management/treasury-operations/treasury-levels-and-mandate", ".checkpoint-row");

const CARDS = "#task-levels .flex.flex-col.gap-3 > div";
const KINDS = ["plan", "practise", "review"];
for (let i = 0; i < 3; i++) {
  await isolate(`c-card-${KINDS[i]}.png`, CARDS, { nth: i });
}

/* ---------- 5. the definition popup ---------- *
 * The word first, on its own — a rule under a word is the whole affordance and
 * it is worth one slide. Then the card it opens, twice, on two different terms
 * so the second slide is not the first one again.
 *
 * Both the terms and their definitions are relabelled: the popup's entire
 * content is its subject, so there is nothing to crop away. */
/* `.cursor-help`, not `[aria-expanded]`: the section-note button carries
 * aria-expanded too and renders inside the same <section>, so nth would be
 * counting two different components. */
const TERM_BTN = "#task-levels button.cursor-help";

await isolate("c-term-word.png", TERM_BTN, { nth: 0 });

/* Opening one of these is a two-step affair, and the retry is not paranoia.
 * The card closes itself on ANY scroll (`window.addEventListener("scroll",
 * onMove, true)`), and Playwright scrolls an element into view as part of
 * clicking it — so a term far enough down the page can be opened and closed by
 * the same gesture, leaving no tooltip and no error. Scrolling first, settling,
 * then clicking avoids it; the retry covers the case where the settle was not
 * long enough. */
const openTerm = async (sel, nth = 0) => {
  const btn = page.locator(sel).nth(nth);
  for (let attempt = 0; attempt < 3; attempt++) {
    await btn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await btn.click();
    await page.waitForTimeout(700);
    if (await page.locator('[role="tooltip"]').count()) return;
  }
  throw new Error(`could not open the definition card for ${sel} [${nth}]`);
};

await openTerm(TERM_BTN, 0);
await isolate("c-term-a.png", '[role="tooltip"]');

/* Escape rather than a click elsewhere: a stray pointerdown on the page can
 * land on another term and open a second card behind the first. */
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

await openTerm("#cost-vs-profit-centre button.cursor-help", 1);
await isolate("c-term-b.png", '[role="tooltip"]');

await ctx2.close();
await browser.close();
console.log("done ->", DIR);
