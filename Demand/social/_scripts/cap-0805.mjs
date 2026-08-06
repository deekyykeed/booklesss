/* Capture for the 2026-08-05 posts.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0805.mjs
 *
 * NOTHING HERE IS ABOUT WHAT SHIPPED TODAY, and that is deliberate for the
 * second day running. Today's commits are the auth surface being torn out of
 * Clerk and rebuilt on Supabase — a sign-up form, which is not a subject
 * (RULES.md rule 6). So the day is the PRODUCT: controls a student uses, one
 * component per carousel, in the states a student puts it through.
 *
 *   ab-*   the ActionBar, one shape doing four different jobs
 *   op-*   the step's "on this page" rail, at three reading positions
 *   cm-*   the comment box, bound to the section you are reading
 *   ref-*  reference frames — whole screens, for choosing subjects. NOT posted.
 *
 * A PRODUCTION SERVER, not `next dev`: two of the four ActionBar states live on
 * the offline card, which only renders when a service worker is active, and
 * `RegisterSW` unregisters the worker on anything but production.
 *
 *   cd C:/bkls-shot/platform && npx next build && npx next start -p 3101
 *
 * AND AUTH HAS TO BE OFF IN THAT WORKTREE. `authEnabled` in lib/auth.ts is
 * `NEXT_PUBLIC_SUPABASE_URL && NEXT_PUBLIC_SUPABASE_ANON_KEY` as of today — it
 * replaced `clerkEnabled` and reads a different pair of keys. Both are
 * commented out in C:/bkls-shot/platform/.env.local so /dashboard renders
 * against the seeded record instead of holding behind its onboarding gate.
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
 * on a card is the app's own arithmetic on real section ids. Lifted whole from
 * cap-0804.mjs — same reader, so today's shots and yesterday's agree.
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

/* THE STEP EVERY READER SHOT IS TAKEN ON, and the choice is not arbitrary.
 *
 * Course 1 is the one whose whole tree `MAP` covers, lesson and step, and this
 * step's four sections are the generic set — Overview, Key ideas, In practice,
 * Summary — so a contents list of it names no syllabus before the relabel even
 * runs. The step the reader shots used yesterday is the opposite: its sections
 * are its own headings ("Treasury as a cost centre"), which the scan throws on
 * and rightly. */
const STEP = "/microeconomics/supply-demand/law-of-demand";
const STEP_ID = "law-of-demand";

/* Two comments already written, so the box has something under it in the state
 * where that is the point. Written into the store's own key in its own shape —
 * the panel reads them back and renders them itself, rather than being typed
 * into the DOM. */
const COMMENTS = JSON.stringify({
  [STEP_ID]: {
    "key-ideas": {
      text: "Second one is the bit I keep losing — write it out before the test.",
      at: "2026-07-29T19:14:00.000Z",
    },
    "in-practice": {
      text: "The worked example is what made it land. Come back to this one.",
      at: "2026-08-01T20:02:00.000Z",
    },
  },
});

/* ---- browser ----------------------------------------------------------- */
const browser = await chromium.launch();

const ctxFor = async ({ identity, seed = null, comments = null, h = 900, scale = 8, ios = false }) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: h },
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
    /* The install bar exists when the browser has offered a prompt OR the
     * device is an iPhone (`canInstall` in OfflineTools). A headless Chromium
     * fires no `beforeinstallprompt`, so an iPhone is the only way to
     * photograph it — and it is the honest one anyway: half this product's
     * students are on Safari, where installing has to be explained rather than
     * offered. */
    ...(ios
      ? {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
        }
      : {}),
  });
  await ctx.addInitScript(
    ([id, sd, cm]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
        if (sd) localStorage.setItem("booklesss:progress:v6", sd);
        if (cm) localStorage.setItem("booklesss:step-comments:v1", cm);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [identity, seed, comments],
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
 * `expect` is the state's own words as a regex, checked at the shutter rather
 * than before it (see cap-0804-night.mjs). */
const isolate = async (name, sel, { nth = 0, pad = 16, union = false, expect = null } = {}) => {
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

  if (expect) {
    const text = await page.evaluate(
      ([s, i]) => (document.querySelectorAll(s)[i]?.textContent || "").replace(/\s+/g, " ").trim(),
      [sel, nth],
    );
    if (!expect.test(text)) {
      await page.evaluate(() => window.__undoIsolate?.());
      throw new Error(`${name}: the state is gone — expected ${expect} but it reads "${text}".`);
    }
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

/* A whole screen, for looking at rather than posting. Named ref-* so nothing
 * downstream can mistake one for a slide. */
const reference = async (name) => {
  await prep();
  await page.screenshot({ path: out(name), fullPage: true });
  console.log(`  ${name}  (reference)`);
};

/* THE RIGHT DRAWER HAS NO BUTTON ON A PHONE (removed 2026-08-01) — it is a
 * swipe, so the capture has to perform one. Playwright's touchscreen has no
 * swipe, so this goes through CDP: MobileNav listens on `window` for
 * touchstart/move/end and wants >=12px to decide the gesture is horizontal and
 * then 55px of travel to open. Two moves, well past both. */
const openContext = async () => {
  const cdp = await page.context().newCDPSession(page);
  const swipe = async (y) => {
    const send = (type, x) =>
      cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: type === "touchEnd" ? [] : [{ x, y }],
      });
    await send("touchStart", 360);
    await send("touchMove", 320);
    await send("touchMove", 180);
    await send("touchEnd", 180);
    await page.waitForTimeout(500);
  };
  /* SEVERAL HEIGHTS, BECAUSE WHERE THE FINGER LANDS DECIDES WHETHER THE GESTURE
   * IS A SWIPE AT ALL. MobileNav refuses to track a drag that starts inside
   * anything scrolling sideways or wearing [data-no-swipe] — a table, a source
   * strip, a code block — so one fixed y opens the drawer on some scroll
   * positions and silently does nothing on others. It failed exactly that way
   * on the first run: the top of the step opened, the middle did not. */
  for (const y of [300, 180, 520, 640, 420]) {
    await swipe(y);
    const open = await page
      .waitForSelector(".rightbar-panel .step-bar", { state: "visible", timeout: 2500 })
      .then(() => true)
      .catch(() => false);
    if (open) {
      await page.waitForTimeout(650);
      return;
    }
  }
  throw new Error("the step-context drawer would not open — no swipe height was accepted.");
};

console.log("capturing ->", DIR);

/* Reference frames — whole screens, to be looked at rather than posted — are
 * in cap-0805-ref.mjs. They are what the day's subjects were chosen off. */

/* ================================================================== *
 * 1 — THE ACTION BAR, AT FOUR JOBS.  (morning)
 *
 * `.action-bar` — full width, label left, arrow right, and a fill behind the
 * label that is the number it is reporting. Extracted from the course card on
 * 4 Aug at the owner's request ("the exact button in the course card should be
 * its own component and ill use it throughout all the buttons within the app")
 * and never posted.
 *
 * FOUR STATES THAT DIFFER IN KIND, not four buttons: a fill that is how far
 * through a course you are, no fill at all because you have never opened it, a
 * fill that is a download counting up, and the app's ink for the one action on
 * a screen that is the point of it.
 * ================================================================== */
const bar = async (name, sel, opts = {}) => isolate(name, sel, opts);

{
  const ctx = await ctxFor({ identity: who({ target: { days: 4, minutes: 30 } }), seed: SEED, h: 1200 });
  page = await ctx.newPage();
  await go("/dashboard", ".course-card");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  /* Off the same seeded dashboard as yesterday's cards, so the fill on the
     Resume bar is the arithmetic behind the card it came out of. Index 1 is a
     month in; index 2 has never been opened and says Start with no fill. */
  await bar("ab-resume.png", ".course-card .action-bar", { nth: 1, expect: /Resume/ });
  await bar("ab-start.png", ".course-card .action-bar", { nth: 2, expect: /Start/ });
  await ctx.close();
}

/* The other two live on the offline card, which needs the worker. */
const offline = async () => {
  await go("/dashboard", "main");
  const ok = await page
    .waitForSelector(".dash-offline .action-bar", { timeout: 30000 })
    .then(() => true)
    .catch(() => false);
  if (!ok)
    throw new Error(
      "no .dash-offline .action-bar — no service worker. This capture needs a PRODUCTION server (next build && next start), not next dev.",
    );
  await page.waitForTimeout(600);
};

/* The black one, and the only variant the bar has besides the white default:
   the app's ink, for the one action on a screen that is the point of it.
   "Install the app" replaced "Add to home screen" today (owner's call) — the
   old label named the browser's menu item and read as bookmarking; this one
   names what you get. */
{
  const ctx = await ctxFor({ identity: who({ courses: ["treasury-management"] }), seed: SEED, ios: true });
  page = await ctx.newPage();
  await offline();
  await bar("ab-install.png", ".dash-offline .action-bar", { nth: 0, expect: /Install the app/ });
  await ctx.close();
}

/* Mid-save, slowed at the CONTEXT — CDP throttling does not reach a service
   worker's own network target, so the save finishes before the shutter (see
   cap-0804-night.mjs). The fill IS the download here, which is the whole
   reason the shape was worth sharing. */
{
  const ctx = await ctxFor({ identity: who({ courses: ["treasury-management"] }), seed: SEED });
  page = await ctx.newPage();
  await offline();
  await ctx.route("**/*", async (route) => {
    await new Promise((r) => setTimeout(r, 600));
    await route.continue();
  });
  await page.getByRole("button", { name: "Save all lessons" }).click();
  await page.waitForFunction(
    () => [...document.querySelectorAll(".dash-offline .action-bar")].some((b) => /Saving [1-9]\d*\/\d+/.test(b.textContent || "")),
    null,
    { timeout: 60000 },
  );
  await bar("ab-saving.png", ".dash-offline .action-bar", { nth: 0, expect: /Saving \d+\/\d+/ });
  await ctx.close();
}

/* ================================================================== *
 * 2 — "ON THIS PAGE", AT THREE READING POSITIONS.  (midday)
 *
 * The step's own contents list with the reader's position drawn on it: a rail,
 * a bar that tracks whichever section is on screen, and a mark against each
 * section that has been answered. Three states that differ in kind — the top
 * of a step, the middle, and the end with every section answered.
 *
 * On a phone this panel is a DRAWER, and has been buttonless since 1 Aug, so
 * the capture swipes (see openContext).
 *
 * The section headings are generic by construction — Overview, Key ideas, In
 * practice, Summary — so this component names no syllabus even before the
 * relabel runs.
 * ================================================================== */
const TOC = ".rightbar-panel div:has(> .step-bar)";

/* Answer the first `n` sections the way a reader does — by pressing the mark
 * at the foot of each one — so the ticks in the contents list are the app's own
 * record rather than a seeded lie. The two answers are "Got it" and "Later",
 * and the last one answered takes "Later": a step where every section landed
 * first time is not what a real one looks like, and the two marks are drawn
 * differently, which is the state the list exists to report. */
const answerUpTo = async (n) => {
  for (let i = 0; i < n; i++) {
    const label = i === n - 1 && n > 1 ? "Later" : "Got it";
    const row = page.locator(".checkpoint-row").nth(i);
    await row.scrollIntoViewIfNeeded();
    await row.locator(`[aria-label="${label}"]`).click();
    await page.waitForTimeout(350);
  }
};

const reader = async ({ comments = null } = {}) => {
  const ctx = await ctxFor({ identity: who({ courses: ["economics"] }), seed: SEED, comments, h: 900 });
  page = await ctx.newPage();
  await go(STEP, ".checkpoint-row");
  return ctx;
};

/* `section` is which section to leave on screen — the rail's bar tracks
 * whatever is in view, so the shot is aimed by scrolling to a heading rather
 * than to a pixel. */
const toScreen = async (section) => {
  await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: "start" }), section);
  await page.waitForTimeout(900);
};

const toc = async (name, { answered, section, expect }) => {
  const ctx = await reader();
  if (answered) await answerUpTo(answered);
  await toScreen(section);
  await openContext();
  await isolate(name, TOC, { expect });
  await ctx.close();
};

await toc("op-top.png", { answered: 0, section: "overview", expect: /Overview/ });
await toc("op-mid.png", { answered: 2, section: "in-practice", expect: /In practice/ });
await toc("op-end.png", { answered: 4, section: "summary", expect: /Summary/ });

/* ================================================================== *
 * 3 — THE COMMENT BOX, AT THREE STATES.  (afternoon)
 *
 * It binds itself to whatever section is on screen and re-labels as you
 * scroll, so there is no section to pick and no wondering what a note will
 * attach to. Three states that differ in kind: empty and bound to one section,
 * bound to a different one further down the same step, and a box with the
 * notes already written in this step listed under it.
 * ================================================================== */
const CM = ".rightbar-panel div:has(> div > label[for^='comment-'])";

const comment = async (name, { section, comments = null, typed = null, expect = null }) => {
  const ctx = await reader({ comments });
  await toScreen(section);
  await openContext();
  if (typed) {
    await page.locator(`${CM} textarea`).first().fill(typed);
    await page.waitForTimeout(300);
  }
  await isolate(name, CM, { expect });
  await ctx.close();
};

/* ================================================================== *
 * 4 — THE COURSE TREE, AT THREE DEGREES OF CLEARING.  (night)
 *
 * THE SAME COMPONENT AS THE 3 AUG MORNING POST, ON ITS SECOND AXIS — which is
 * a shape this account has used before and which shipped: the `cards` block
 * went out on 2 Aug at three KINDS and on 3 Aug at three FILL LEVELS. That
 * post was about the tree growing folders and showed it at three depths. This
 * one is about the ring on every step row: what it looks like before you have
 * opened anything, part way through a folder, and with the folder cleared.
 *
 * Same tree, same depth, same rows, every time. Only the rings move — which is
 * the argument, and the reason the three have to register on each other.
 * ================================================================== */
const NAVLIST = "nav > div.relative.flex.flex-col";

/* The rings read the app's own record, so each state is a real progress store
 * rather than three drawings. Built from the course tree by id, like SEED. */
const clearing = (spec) => {
  const done = {};
  const grasp = {};
  for (const [id, n] of Object.entries(spec)) {
    const l = byId(id);
    if (!l) throw new Error("no lesson " + id);
    const ids = n === "all" ? l.sections : l.sections.slice(0, n);
    done[id] = ids;
    grasp[id] = Object.fromEntries(ids.map((c) => [c, "got"]));
  }
  return JSON.stringify({ done, days: {}, touched: {}, grasp });
};

const navShot = async (name, spec) => {
  const ctx = await ctxFor({ identity: who({ courses: ["economics"] }), seed: clearing(spec), h: 1500 });
  page = await ctx.newPage();
  await go(STEP, ".checkpoint-row");
  await page.click('button[aria-label="Open navigation"]');
  await page.waitForTimeout(800);
  await isolate(name, NAVLIST, { expect: /What drives effort/ });
  await ctx.close();
};

await navShot("nv-none.png", {});
await navShot("nv-part.png", { "law-of-demand": "all", "law-of-supply": 1 });
await navShot("nv-full.png", { "law-of-demand": "all", "law-of-supply": "all", equilibrium: "all" });

await comment("cm-empty.png", { section: "overview", expect: /On Overview/ });
await comment("cm-typed.png", {
  section: "in-practice",
  typed: "The coffee example is the one that made it click — same price, different reason.",
  expect: /On In practice/,
});
await comment("cm-list.png", { section: "summary", comments: COMMENTS, expect: /On Summary/ });

await browser.close();
console.log("done");
