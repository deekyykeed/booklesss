/* Capture for the 2026-08-06 posts.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0806.mjs
 *
 * TODAY HAS A SHIP AND IT IS THE FRONT DOOR — the first day in three that
 * does. The other three commits are the onboarding return path and the
 * sign-in/sign-up form, which rule 6 puts off limits however much work went
 * into them. So: one carousel about what shipped, two about the product.
 *
 *   door-*   the front door, at three moments of its own entrance
 *   hi-*     the greeting and the fact under it, at four things a student
 *            can be in the middle of
 *   unit-*   the course page's unit block, at three degrees of clearing
 *
 * `next dev` is enough today — nothing here needs a service worker (that was
 * the offline card, 4 Aug). Auth still has to be off in the shot worktree:
 * `authEnabled` in lib/auth.ts is NEXT_PUBLIC_SUPABASE_URL && ANON_KEY and
 * both are commented out in C:/bkls-shot/platform/.env.local, which is what
 * lets a headless browser reach a seeded /dashboard.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, BANNED, transform, scan } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

const browser = await chromium.launch();

/* ====================================================================== *
 * 1 — THE FRONT DOOR, ARRIVING.                              (morning)
 *
 * A 9:16 VIEWPORT, WHICH IS WHY THIS CAN BE A `plain()` POST AT ALL. The
 * front door is the only screen in the app shaped like the frame: one
 * `min-h-dvh` screen with nothing under it, so it renders to whatever window
 * it is given and 405x720 fills 1080x1920 with no crop, no fade and nothing
 * to align. 405x720 is a real phone, too — a 390-wide handset with the
 * browser's own chrome taking the rest of the height.
 *
 * THREE MOMENTS OF THE PAGE'S OWN ENTRANCE, frozen rather than raced.
 * `document.getAnimations()` hands back the live CSS animations and
 * `currentTime` is settable, so each frame is the real thing stopped at an
 * exact millisecond. Nothing is drawn and nothing is retouched (rule 9) —
 * this is the page, at 0.8s, 1.5s and settled.
 *
 * WHY THOSE THREE. The design's argument is in its timing: everything rises,
 * de-blurs and lands inside a second, and then the button arrives a full
 * second after the rest. The page finishes settling, THEN offers the tap. A
 * ladder of twelve frames was shot first (cap-0806-ref.mjs) and everything
 * before ~700ms is mid-blur — a frame picked by arithmetic reads as an
 * out-of-focus screenshot rather than as a designed moment, which is exactly
 * what looking at the pictures first is for.
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
  /* The photograph IS the slide. Waiting on the <h1> only proves the markup
     arrived; a shutter before the backdrop decodes is a black frame with type
     on it, which is a different design. */
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

  /* No relabel and no scan on these three, and that is not an oversight: the
     front door carries no course, no lesson and no step title. The only words
     on it are the product's own name and one sentence about what it does. */
  const at = async (ms, name) => {
    await page.evaluate((t) => {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = t;
      }
    }, ms);
    await page.waitForTimeout(150);
    await page.screenshot({ path: out(name) });
    console.log(`  ${name}  (the door at ${ms}ms)`);
  };

  console.log("the front door ->");
  await at(800, "door-1-settled.png");   // everything but the button
  await at(1500, "door-2-offer.png");    // the button on its way up
  await at(3000, "door-3-full.png");     // the page as a visitor leaves it

  await ctx.close();
}

/* ====================================================================== *
 * THE SEEDED READER — shared by everything below.
 *
 * Built from the real course tree so every number on screen is the app's own
 * arithmetic on real section ids (rule 9). The four greeting states are four
 * different readers rather than one reader edited: the sentence under the
 * greeting is derived, so the only honest way to change it is to change what
 * the reader actually did.
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

/** All of a lesson's sections, i.e. the lesson finished. */
const full = (ids) => {
  const done = {};
  for (const id of ids) {
    const l = byId(id);
    if (l) done[l.id] = l.sections;
  }
  return done;
};
/** All but the last section — a lesson someone is in the middle of. */
const part = (ids) => {
  const done = {};
  for (const id of ids) {
    const l = byId(id);
    if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 1));
  }
  return done;
};

/** A day's row in the study log, in the store's own shape. */
const day = (mins, course = "economics") => ({
  checks: mins > 30 ? 2 : mins > 12 ? 1 : 0,
  steps: mins > 40 ? 1 : 0,
  secs: mins * 60,
  courses: { [course]: mins * 60 },
  courseChecks: { [course]: mins > 30 ? 2 : mins > 12 ? 1 : 0 },
});

const who = (over = {}) =>
  JSON.stringify({
    name: "Chanda",
    avatar: "astronaut",
    school: "other",
    schoolName: "A university",
    courses: ["economics"],
    coursesChosen: true,
    id: "capture-device",
    since: "2026-07-04T09:00:00.000Z",
    ...over,
  });

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
  await page.waitForTimeout(1500);
  try {
    await prep();
  } catch {
    await page.waitForTimeout(1200);
    await prep();
  }
};

/* ONE COMPONENT, ON NOTHING — see cap-0802.mjs for the full reasoning.
 *
 * `sels` is a LIST, because two of today's subjects are not one element. The
 * greeting is an <h1> and the <p> under it, siblings inside a container that
 * also holds the whole rest of the dashboard, so neither the element nor
 * `union` over its children gives the right box. Marking several elements and
 * unioning THEIR rects does.
 */
const isolate = async (name, sels, { pad = 16, expect = null } = {}) => {
  const list = Array.isArray(sels) ? sels : [sels];
  await prep();
  await page.locator(list[0]).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await prep();

  const box = await page.evaluate((ss) => {
    const els = ss.map((s) => document.querySelector(s));
    if (els.some((e) => !e)) throw new Error("missing element among " + ss.join(", "));
    els.forEach((e) => e.setAttribute("data-iso", ""));
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
    const rs = els.map((e) => e.getBoundingClientRect());
    const x = Math.min(...rs.map((r) => r.left));
    const y = Math.min(...rs.map((r) => r.top));
    return {
      x,
      y,
      width: Math.max(...rs.map((r) => r.right)) - x,
      height: Math.max(...rs.map((r) => r.bottom)) - y,
    };
  }, list);

  const leaked = await page.evaluate(scan, { banned: BANNED, clip: box, pageSpace: false });
  if (leaked.length) {
    await page.evaluate(() => window.__undoIsolate?.());
    throw new Error(`${name}: banned words inside the component — ${leaked.join(", ")}.`);
  }

  /* The state's own words, checked at the shutter. Every one of these four
     greetings is a DERIVED sentence — get the seed subtly wrong and the
     component still renders, still looks deliberate, and says something else
     entirely. */
  if (expect) {
    const text = await page.evaluate(
      (ss) => ss.map((s) => document.querySelector(s)?.textContent || "").join(" ").replace(/\s+/g, " ").trim(),
      list,
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

const ctxFor = async ({ identity, seed, hour, h = 1000, scale = 8 }) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: h },
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
  });
  /* The greeting reads the clock, so the clock is set rather than waited for.
     Fixed to TODAY at the given hour, which is what keeps the seed's own day
     keys — ago(0) is today — pointing at the same day the page thinks it is. */
  if (hour !== undefined) {
    const t = new Date();
    t.setHours(hour, 20, 0, 0);
    await ctx.clock.setFixedTime(t);
  }
  await ctx.addInitScript(
    ([id, sd]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
        if (sd) localStorage.setItem("booklesss:progress:v6", sd);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
      /* One line out of the band's pool, chosen the same way every run. The
         pick is `pool[floor(random * length)]`; pinning random pins the line,
         so a re-render of this post is the post rather than a new roll. */
      Math.random = () => 0.42;
    },
    [identity, seed],
  );
  return ctx;
};

/* ====================================================================== *
 * 2 — THE GREETING, AND THE FACT UNDER IT.                    (midday)
 *
 * ONE COMPONENT, FOUR STATES THAT DIFFER IN KIND — and the states are not
 * four times of day, they are four things a student can be in the middle of.
 * The sentence under the greeting has exactly four forms in HomeView, each
 * derived from what the reader actually did:
 *
 *   nothing yet   "You haven't started yet — the first step takes about ten
 *                  minutes."
 *   streak, idle  "N-day streak going. Do a section today to keep it."
 *   studied today "You've studied today — N days in a row. M sections done."
 *   lapsed        "M sections done across K days."
 *
 * The greeting above it moves with the clock as well, so no two slides share
 * a word. The line is the argument: the app opens with a different sentence
 * depending on where you actually are, and none of the four is encouragement
 * — they are all facts it can prove.
 * ====================================================================== */
const GREETINGS = [
  {
    name: "hi-1-new.png",
    hour: 9,
    /* A reader who arrived today. `since` is today, so the greeting pool is
       the first-visit-safe half — nothing claims to know them (greeting.ts
       rule 3), which is the honest pairing for "you haven't started yet". */
    identity: who({ since: new Date().toISOString(), name: "" }),
    seed: JSON.stringify({ done: {}, days: {}, touched: {}, grasp: {} }),
    expect: /haven't started yet/i,
  },
  {
    name: "hi-2-streak.png",
    hour: 15,
    identity: who(),
    seed: (() => {
      const done = { ...full(["what-is-economics", "how-to-use"]), ...part(["law-of-demand"]) };
      const days = {};
      /* Three days running, ending YESTERDAY. The streak is alive and today is
         not in it, which is the only state in which the app asks for
         something. */
      for (const n of [1, 2, 3]) days[ago(n)] = day([22, 31, 18][n - 1]);
      return JSON.stringify({ done, days, touched: { "law-of-demand": ago(1) }, grasp: {} });
    })(),
    expect: /streak going/i,
  },
  {
    name: "hi-3-today.png",
    hour: 19,
    identity: who(),
    seed: (() => {
      const done = {
        ...full([
          "what-is-economics",
          "how-to-use",
          "glossary",
          "law-of-demand",
          "law-of-supply",
          "equilibrium",
        ]),
        ...part(["ped", "utility"]),
      };
      const days = {};
      for (const n of [0, 1, 2, 3, 5, 6, 8, 9, 12]) days[ago(n)] = day([34, 26, 41, 18, 29, 22, 37, 15, 24][[0, 1, 2, 3, 5, 6, 8, 9, 12].indexOf(n)]);
      return JSON.stringify({ done, days, touched: { equilibrium: ago(0) }, grasp: {} });
    })(),
    expect: /studied today/i,
  },
  {
    name: "hi-4-lapsed.png",
    hour: 22,
    identity: who(),
    seed: (() => {
      const done = {
        ...full(["what-is-economics", "how-to-use", "glossary", "law-of-demand"]),
        ...part(["law-of-supply"]),
      };
      const days = {};
      /* Nothing for a week. No streak left to lose, so the line stops asking
         and just reports. */
      for (const n of [7, 8, 9, 11, 12]) days[ago(n)] = day([27, 33, 19, 24, 30][[7, 8, 9, 11, 12].indexOf(n)]);
      return JSON.stringify({ done, days, touched: { "law-of-supply": ago(7) }, grasp: {} });
    })(),
    expect: /sections done across/i,
  },
];

console.log("the greeting ->");
for (const g of GREETINGS) {
  const ctx = await ctxFor({ identity: g.identity, seed: g.seed, hour: g.hour });
  page = await ctx.newPage();
  await go("/dashboard", "main h1");
  await isolate(g.name, ["main h1", "main h1 + p"], { expect: g.expect });
  await ctx.close();
}

/* ====================================================================== *
 * 3 — THE UNIT BLOCK, AT THREE DEGREES OF CLEARING.        (afternoon)
 *
 * NOT THE DRAWER TREE FROM 5 AUG. That is the navigation — where can I go
 * from here — shown in a 283px rail. This is the course page's syllabus: a
 * unit's name, the COUNT beside it, and every step in it at full width. The
 * count is the part the tree has never had, and it is the whole argument: a
 * course is units, and each one tells you how much of it is behind you
 * without you having to add anything up.
 *
 * One seeded reader, three units of the same course — finished, part way,
 * untouched. Grouped in the render so the three register on each other.
 * ====================================================================== */
{
  const done = {
    /* Getting started, all three steps. */
    ...full(["what-is-economics", "how-to-use", "glossary"]),
    /* Nine of the fifteen in the second unit, and two more part way, so the
       rings in one frame run full, part-drawn and empty. */
    ...full([
      "law-of-demand",
      "law-of-supply",
      "equilibrium",
      "ped",
      "yed",
      "xed",
      "utility",
      "indifference",
      "budget",
    ]),
    ...part(["costs", "revenue-profit"]),
    /* The third unit is untouched, which is the third picture. */
  };
  const days = {};
  for (const n of [0, 1, 2, 4, 5, 7, 8, 11]) days[ago(n)] = day(28);

  const ctx = await ctxFor({
    identity: who(),
    seed: JSON.stringify({ done, days, touched: { costs: ago(0) }, grasp: {} }),
    h: 1600, // a unit of fifteen rows is taller than a phone; a page clip is
             // measured against the viewport and comes back silently clamped
  });
  page = await ctx.newPage();
  await go("/economics", "main");

  console.log("the unit block ->");
  await isolate("unit-1-done.png", ["section#getting-started"], { expect: /3\s*\/\s*3/ });
  await isolate("unit-2-part.png", ["section#microeconomics"], { expect: /9\s*\/\s*15/ });
  await isolate("unit-3-open.png", ["section#macroeconomics"], { expect: /0\s*\/\s*7/ });

  await ctx.close();
}

/* ====================================================================== *
 * 4 — ONE STAT TILE, AT THREE POINTS IN ONE STUDENT'S HISTORY. (midday)
 *
 * THE TILE HAS BEEN POSTED TWICE AND THIS IS A DIFFERENT QUESTION. 2 Aug
 * showed one tile at four numbers and 4 Aug at four measures — both of them
 * "what does this tile count?". Neither asked the thing a student actually
 * cares about, which is whether the number moves. So: the same tile, the same
 * measure, one reader at a fortnight, a month and six weeks in.
 *
 * Every figure is the app's own arithmetic — the score, the change on last
 * week and the curve are all derived from the study log below, so the only
 * way to make the number climb is to give the reader more of a history.
 * ====================================================================== */
const HISTORY = [
  {
    name: "tile-1-early.png",
    /* A fortnight in, and not every day. */
    weeks: [
      [0, 18], [1, 0], [2, 24], [3, 0], [4, 15], [5, 0], [6, 0],
      [7, 21], [8, 0], [9, 17], [10, 0], [11, 0], [12, 22], [13, 0],
    ],
    lessons: { done: ["what-is-economics", "how-to-use"], part: ["glossary"] },
  },
  {
    name: "tile-2-month.png",
    weeks: null, // filled below
    lessons: {
      done: ["what-is-economics", "how-to-use", "glossary", "law-of-demand"],
      part: ["law-of-supply", "equilibrium"],
    },
  },
  {
    name: "tile-3-settled.png",
    weeks: null,
    lessons: {
      done: [
        "what-is-economics",
        "how-to-use",
        "glossary",
        "law-of-demand",
        "law-of-supply",
        "equilibrium",
        "ped",
        "yed",
      ],
      part: ["xed", "utility"],
    },
  },
];

/* A month and six weeks in, denser each time — more days turned up and longer
 * on them. Written as a generator rather than three hand-typed tables so the
 * three are the same reader getting into a rhythm, not three different people.
 * Rest days come in PAIRS: alternating days off draw a comb in the curve. */
const run = (weeks, base) =>
  Array.from({ length: weeks * 7 }, (_, i) => {
    const w = Math.floor(i / 7);
    const off = i % 7 === 5 || i % 7 === 6; // the weekend, together
    return [i, off && w % 2 === 0 ? 0 : Math.round(base + w * 3 + ((i * 7) % 11))];
  });
HISTORY[1].weeks = run(4, 16);
HISTORY[2].weeks = run(6, 19);

console.log("the stat tile ->");
for (const h of HISTORY) {
  const span = h.weeks.length;
  const days = {};
  for (const [i, mins] of h.weeks) {
    if (!mins) continue;
    days[ago(span - 1 - i)] = day(mins);
  }
  const done = { ...full(h.lessons.done), ...part(h.lessons.part) };

  const ctx = await ctxFor({
    identity: who({ target: { days: 4, minutes: 30 } }),
    seed: JSON.stringify({ done, days, touched: { [h.lessons.part[0]]: ago(0) }, grasp: {} }),
    h: 1200,
  });
  page = await ctx.newPage();
  await go("/dashboard", ".dash-stat");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  /* The figure counts UP on first paint (useCountUp), so a shutter taken too
     early photographs a number the student never has. Wait for it to stop
     moving rather than for a fixed delay. */
  await page.waitForFunction(
    () => {
      const el = document.querySelector(".dash-stat");
      if (!el) return false;
      const now = el.textContent;
      const settled = window.__last === now;
      window.__last = now;
      return settled;
    },
    null,
    { timeout: 30000, polling: 400 },
  );
  await isolate(h.name, [".dash-stat"], { expect: /Performance/i });
  await ctx.close();
}

await browser.close();
console.log("done ->", DIR);
