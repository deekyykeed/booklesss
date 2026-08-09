/* Capture for the 2026-08-09 posts.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0809.mjs
 *   ONLY=row BASE_URL=http://localhost:3101 node _scripts/cap-0809.mjs
 *
 * THE DASHBOARD'S DAY, PLUS THE ROW SETTLING. Since Saturday's shots (36aa0c5):
 * the checkpoint answers became Lordicon doodles with their words back and the
 * question changed underneath them (Hate / Save / Love — two verdicts and a
 * decision, not a comprehension scale); the greeting line stopped counting and
 * started comparing; the finished course card stopped saying Resume; and the
 * time tile's footer became the goal the student set.
 *
 *   row-*    the three answers: doodles, grey at rest, colour = your answer,
 *            one word under each mark
 *   card-*   the course card at the ends of a course's life: Start, Resume,
 *            Done ✓ · Read it again
 *   greet-*  the line under the greeting, which is always a comparison now
 *   tile-*   the Time tile, whose footer is the goal
 *
 * Shot from C:/bkls-shot pinned to 4b801bc (today's HEAD — the commit that
 * landed the Save doodle's own Lottie, without which that answer draws its
 * Tabler fallback). `next dev` on :3101 is enough; nothing here needs a
 * service worker. Auth stays off in the worktree.
 *
 * TWO KINDS OF CONTEXT, AND THEY MUST NOT MIX. The greeting is a random pick,
 * so the greet/tile contexts PIN Math.random to hold the same greeting across
 * four seeded states — safe there because those shots click NOTHING; every
 * state is a different localStorage seed. The row and the Completed tab are
 * produced by real taps, so their contexts carry no pin (a pinned
 * Math.random silently kills every React event handler — proved by bisection
 * on 2026-08-07).
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, BANNED, transform, scan } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

const ONLY = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
const wants = (name) => !ONLY.length || ONLY.includes(name);

/* ---- the tree, for honest seeds (rule 9: the app's own arithmetic) ---- */
const tree = JSON.parse(fs.readFileSync(path.join(PLATFORM, "src/lib/course-data.json"), "utf8"));
const roots = Object.values(tree);
const lessons = [];
const byCourse = {};
for (const root of roots) {
  const ids = [];
  (function walk(nodes) {
    for (const n of nodes || []) {
      if (n.lesson) {
        lessons.push({ id: n.id, sections: n.lesson.sections.map((s) => s.id) });
        ids.push(n.id);
      }
      if (n.children) walk(n.children);
    }
  })(root.children || []);
  byCourse[root.id] = ids;
}
const byId = (id) => lessons.find((l) => l.id === id);

const iso = (d) => d.toLocaleDateString("en-CA");
const ago = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};
const full = (ids) => {
  const done = {};
  for (const id of ids) {
    const l = byId(id);
    if (l) done[l.id] = l.sections;
  }
  return done;
};
const part = (ids) => {
  const done = {};
  for (const id of ids) {
    const l = byId(id);
    if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 1));
  }
  return done;
};
const day = (mins, course = "economics") => ({
  checks: mins > 30 ? 2 : mins > 12 ? 1 : 0,
  steps: mins > 40 ? 1 : 0,
  secs: mins * 60,
  courses: { [course]: mins * 60 },
  courseChecks: { [course]: mins > 30 ? 2 : mins > 12 ? 1 : 0 },
});

/* ---- identities. The GOAL one carries the week the student promised at
 * onboarding (5 study days × 60 min = a 5h week, Mon–Fri), which is what the
 * greeting line paces against and what the time tile's footer prints. The
 * FREE one never set a goal, so the line falls back to their own past weeks
 * and the tile's footer keeps the vs-last-week delta. ---- */
const identity = (target) =>
  JSON.stringify({
    name: "Chanda",
    avatar: "astronaut",
    school: "zcas",
    schoolName: "A university",
    programme: "bachelor-of-accounting",
    programmeName: "Accounting",
    year: 2,
    courses: ["economics", "strategic-management"],
    curriculum: ["introduction-to-economics"],
    coursesChosen: true,
    nameChosen: true,
    whatsapp: "+260971234567",
    studyWindow: "evening",
    heardFrom: "friend",
    ...(target ? { target } : {}),
    id: "capture-device",
    since: "2026-07-04T09:00:00.000Z",
    updatedAt: "2026-07-04T09:00:00.000Z",
  });
const ID_GOAL = identity({ days: 5, minutes: 60, weekdays: [0, 1, 2, 3, 4] });
const ID_FREE = identity(null);

/* ---- progress seeds. Today is a Sunday, so the rolling last-7 the dashboard
 * measures IS the calendar week the line talks about. Every sentence below
 * was computed from studyLine()'s own arithmetic before it was a filename:
 *
 *   GREET_A  goal set, nothing this week   → "Nothing logged this week yet —
 *            you're aiming at 5h."
 *   GREET_B  200 min, no current streak    → "3h 20m of your 5h week — about
 *            1h 40m behind pace."
 *   GREET_C  340 min, Thu–Sun streak       → "This week's goal is done —
 *            5h 40m against 5h. 4 days in a row."
 *   GREET_D  no goal; three past weeks average 140 min, this week 190, Sat+Sun
 *            streak → "3h 10m this week, 50m more than you usually do.
 *            2 days in a row."  (its Time tile: "+60m vs last week")
 * ---- */
const seed = (days, done = {}) => JSON.stringify({ done, days, touched: {}, grasp: {} });

const GREET_A = seed({ [ago(12)]: day(35), [ago(11)]: day(40), [ago(9)]: day(50), [ago(8)]: day(45) });
const GREET_B = seed({
  [ago(13)]: day(40), [ago(11)]: day(50), [ago(9)]: day(45),
  [ago(6)]: day(70), [ago(5)]: day(70), [ago(4)]: day(60),
});
const GREET_C = seed({
  [ago(13)]: day(45), [ago(12)]: day(50), [ago(10)]: day(40),
  [ago(6)]: day(80), [ago(4)]: day(70), [ago(3)]: day(60),
  [ago(2)]: day(60), [ago(1)]: day(40), [ago(0)]: day(30),
});
const GREET_D = seed({
  [ago(27)]: day(50), [ago(25)]: day(60), [ago(23)]: day(40),
  [ago(20)]: day(50), [ago(18)]: day(50), [ago(16)]: day(40),
  [ago(13)]: day(40), [ago(12)]: day(50), [ago(9)]: day(40),
  [ago(5)]: day(60), [ago(4)]: day(40), [ago(1)]: day(50), [ago(0)]: day(40),
});

/* The card's three claims. A finished 7-step course after a month of seeded
 * reading is the honest finish (rule 9) — same reasoning as cap-0807, which is
 * also why Done is shot on the short course rather than the 25-step one. */
const CARD_START = seed({});
const CARD_MID = seed(
  {
    [ago(6)]: day(17), [ago(5)]: day(24), [ago(4)]: day(38),
    [ago(1)]: day(46), [ago(0)]: day(31),
  },
  { ...full(byCourse.microeconomics.slice(0, 9)), ...part([byCourse.microeconomics[9]]) },
);
const CARD_DONE = seed(
  {
    [ago(16)]: day(40, "strategic-management"),
    [ago(14)]: day(35, "strategic-management"),
    [ago(10)]: day(45, "strategic-management"),
    [ago(8)]: day(30, "strategic-management"),
    [ago(4)]: day(25, "strategic-management"),
    [ago(2)]: day(20, "strategic-management"),
  },
  full(byCourse["strategic-management"]),
);

const browser = await chromium.launch();
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

const raw = async (url, ready) => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.waitForTimeout(1600);
};

const isolate = async (name, sels, { pad = 16, expect = null, settle = 0 } = {}) => {
  const list = Array.isArray(sels) ? sels : [sels];
  await prep();
  await page.locator(list[0]).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await prep();
  if (settle) await page.waitForTimeout(settle);

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

  if (expect) {
    const text = await page.evaluate(
      (ss) =>
        ss
          .map((s) => {
            const el = document.querySelector(s);
            return (el?.getAttribute("data-answered") || "") + " " + (el?.textContent || "");
          })
          .join(" ")
          .replace(/\s+/g, " ")
          .trim(),
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

/** A clicking context: NO Math.random pin, ever. */
const ctxLive = async ({ h = 1100, id = ID_GOAL, sd = null } = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: h },
    deviceScaleFactor: 8,
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(
    ([i, s]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", i);
        if (s) localStorage.setItem("booklesss:progress:v6", s);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [id, sd],
  );
  return ctx;
};

/** A pinned context: Math.random held so the greeting is the same word across
 *  four seeded states. Clicks are FORBIDDEN in pages from this context. */
const ctxPinned = async ({ id, sd }) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: 1100 },
    deviceScaleFactor: 8,
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(
    ([i, s]) => {
      Math.random = () => 0.42;
      try {
        localStorage.setItem("booklesss:identity:v1", i);
        if (s) localStorage.setItem("booklesss:progress:v6", s);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [id, sd],
  );
  return ctx;
};

const STEP = "/microeconomics/supply-demand/law-of-demand";

/* ====================================================================== *
 * 1 — THE THREE ANSWERS, SETTLED.                               (morning)
 *
 * Doodles now (Lordicon, self-hosted Lotties), grey at rest via CSS
 * grayscale, their own colours when chosen — and one word under each mark:
 * Hate / Save / Love. The question changed underneath the marks: two verdicts
 * and a decision, not a comprehension scale.
 *
 * The buttons carry no aria-label any more — their accessible name IS the
 * visible word — so the clicks target the caption text. Every state that
 * needs a tap gets a fresh page (the store is localStorage, so the previous
 * answer carries), and the settle waits out the tapped doodle's one-shot
 * animation so the shutter lands on its held final frame.
 * ====================================================================== */
if (wants("row")) {
  const group = ".grasp-group";
  const answer = async (word) => {
    await raw(STEP, "h1");
    const btn = page.locator(`${group} button:has-text("${word}")`).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(2400);
  };

  console.log("the three answers ->");
  const ctx = await ctxLive();
  page = await ctx.newPage();

  /* The doodles are a fetch; the rest state is only the rest state once the
     Lotties have replaced the Tabler fallbacks, hence the settle. */
  await raw(STEP, "h1");
  await isolate("row-1-rest.png", group, { pad: 8, settle: 1200, expect: /^HateSaveLove/ });

  await answer("Hate");
  await isolate("row-2-hate.png", group, { pad: 8, expect: /^not/ });

  await answer("Save");
  await isolate("row-3-save.png", group, { pad: 8, expect: /^almost/ });

  await answer("Love");
  await isolate("row-4-love.png", group, { pad: 8, expect: /^got/ });

  await ctx.close();
}

/* ====================================================================== *
 * 2 — THE CARD'S THREE CLAIMS.                                   (midday)
 *
 * Friday's own PLAN flagged it: the finished card was indistinguishable from
 * an untouched one — "Resume", step one, 0d streak — and said it was worth
 * settling before the set ran again. It settled on the 8th. Start and Resume
 * are the same card on different seeds; Done is a real state the card can
 * finally claim: the streak figure gone, a green check where the score was,
 * and the bar owning it — "Done ✓ · Read it again".
 *
 * Start and Resume load the Active tab cold (no clicks). Done needs the
 * Completed tab, which is a real tap against live React — it EARNS its place
 * (it only exists once a course is finished), so the tap is also the proof
 * the tab is there.
 * ====================================================================== */
if (wants("card")) {
  const shot = async (name, sd, { tab = null, expect } = {}) => {
    const ctx = await ctxLive({ h: 1500, sd });
    page = await ctx.newPage();
    await raw("/dashboard", "main");
    if (tab) {
      await page.locator(`[role="tab"]:has-text("${tab}")`).first().click();
      await page.waitForTimeout(1000);
    }
    await isolate(name, ".course-card", { expect });
    await ctx.close();
  };

  console.log("the card's three claims ->");
  await shot("card-1-start.png", CARD_START, { expect: /Start · / });
  await shot("card-2-resume.png", CARD_MID, { expect: /Resume · / });
  await shot("card-3-done.png", CARD_DONE, { tab: "Completed", expect: /Read it again/ });
}

/* ====================================================================== *
 * 3 — THE LINE UNDER THE GREETING.                            (afternoon)
 *
 * It counted; now it compares — against the goal the student set at
 * onboarding (paced by their own named study days, so a planned day off never
 * reads as "behind"), or, with no goal, against their own past weeks. Four
 * sentences, four seeds, no clicks; Math.random pinned so the greeting above
 * the line holds still and the only thing moving between slides is the claim.
 * ====================================================================== */
const greetShot = async (name, id, sd, expect, alsoTile = null) => {
  const ctx = await ctxPinned({ id, sd });
  page = await ctx.newPage();
  await raw("/dashboard", "main");
  if (name) await isolate(name, ["main h1", "main h1 + p"], { pad: 12, expect });
  if (alsoTile) {
    await page.evaluate(() => {
      const tile = [...document.querySelectorAll(".dash-stat")].find((t) =>
        t.querySelector(".dash-stat-label")?.textContent?.includes("Time this week"),
      );
      if (!tile) throw new Error("no Time tile");
      tile.setAttribute("data-tile", "");
    });
    await isolate(alsoTile.name, "[data-tile]", { expect: alsoTile.expect });
  }
  await ctx.close();
};

if (wants("greet")) {
  console.log("the line under the greeting ->");
  await greetShot("greet-1-aiming.png", ID_GOAL, GREET_A, /Nothing logged this week yet/);
  await greetShot("greet-2-behind.png", ID_GOAL, GREET_B, /behind pace/);
  await greetShot("greet-3-done.png", ID_GOAL, GREET_C, /goal is done/);
  await greetShot("greet-4-usual.png", ID_FREE, GREET_D, /more than you usually do/);
}

/* ====================================================================== *
 * 4 — THE TIME TILE'S FOOTER IS THE GOAL.                        (evening)
 *
 * It read "+56m first week" and the owner's note was to just say what the
 * target was. So: before a goal exists the footer keeps the vs-last-week
 * delta; with one set it reads "of 5h", grey while the week is short of it
 * and lit in the tile's own blue the week it is met. Same seeds as the
 * greeting states, same pinned contexts, no clicks.
 * ====================================================================== */
if (wants("tile")) {
  console.log("the time tile ->");
  await greetShot(null, ID_FREE, GREET_D, null, {
    name: "tile-1-delta.png",
    expect: /vs last week/,
  });
  await greetShot(null, ID_GOAL, GREET_B, null, {
    name: "tile-2-under.png",
    expect: /3h 20m.*of 5h/,
  });
  await greetShot(null, ID_GOAL, GREET_C, null, {
    name: "tile-3-met.png",
    expect: /5h 40m.*of 5h/,
  });
}

await browser.close();
console.log("\ndone — read every PNG before rendering.");
