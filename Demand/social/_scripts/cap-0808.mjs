/* Capture for the 2026-08-08 posts.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0808.mjs
 *   ONLY=faces BASE_URL=http://localhost:3101 node _scripts/cap-0808.mjs
 *
 * THE FEEDBACK ROW'S DAY — twelve commits between last night and this
 * afternoon, and the row came out the other side as four bare marks from one
 * drawn family. Plus the callout kinds (D-12 closed overnight) and the
 * "Getting started" folder landing in all three authored courses.
 *
 *   faces-*  the three reactions: line-drawn until chosen, colour = your answer,
 *            and the middle answer back after weeks of being unreachable
 *   flag-*   the flag at the other end: tap it, say which verdict, and the flag
 *            BECOMES that verdict's mark
 *   co-*     the callout at its three kinds: key point / watch out / in the exam
 *   fold-*   the top of a course tree: the Getting started folder, read, and
 *            folded away
 *
 * Shot from C:/bkls-shot pinned to 36aa0c5 (today's HEAD — the TM Title Case
 * pass, which is also the commit that regenerated course-data.json with the
 * kinds in it). `next dev` on :3101 is enough; nothing here needs a service
 * worker. Auth stays off in the worktree, which is what lets the taps land
 * signed-out.
 *
 * THE TALLY IS DELIBERATELY NOT SHOT. Reaction counts are gated behind five
 * answers per section and `students` has 2 rows, so any tally in a frame would
 * be an invented crowd — the one class of number rule 9 exists to keep off a
 * poster. On dev the counts fetch fails soft and the row simply has none,
 * which is the honest state.
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

/* The seeded reader — same month-in shape as cap-0807. Most of today's shots
 * are controls at rest, so the seed only matters to the tree set, which builds
 * its own per state. */
const tree = JSON.parse(fs.readFileSync(path.join(PLATFORM, "src/lib/course-data.json"), "utf8"));
const lessons = [];
(function walk(nodes) {
  for (const n of nodes || []) {
    if (n.lesson) lessons.push({ id: n.id, sections: n.lesson.sections.map((s) => s.id) });
    if (n.children) walk(n.children);
  }
})(Array.isArray(tree) ? tree : Object.values(tree));
const byId = (id) => lessons.find((l) => l.id === id);

const IDENTITY = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  courses: ["economics"],
  coursesChosen: true,
  nameChosen: true,
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
  updatedAt: "2026-07-04T09:00:00.000Z",
});

/** A progress store where the named lessons have the named sections cleared. */
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

/* CLICK BEFORE THE FIRST RELABEL, NEVER AFTER IT — see cap-0807 for the
 * reasoning (transform rewrites text nodes React still owns; the next state
 * change reconciles against a stolen tree and the tap silently does nothing).
 * `raw()` navigates without relabelling; `isolate()` relabels at the shutter. */
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

const ctxFor = async ({ h = 1100, seed = null } = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: h },
    deviceScaleFactor: 8,
    isMobile: true,
    hasTouch: true,
  });
  /* No Math.random pin — every state here is produced by clicking. */
  await ctx.addInitScript(
    ([id, sd]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
        if (sd) localStorage.setItem("booklesss:progress:v6", sd);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [IDENTITY, seed],
  );
  return ctx;
};

const STEP = "/microeconomics/supply-demand/law-of-demand";

/* ====================================================================== *
 * 1 — THE THREE FACES.                                          (morning)
 *
 * `.grasp-group` is 112x28 css: three 28px buttons and two 14px gaps — 4:1,
 * inside rule 1's ceiling and flatter than yesterday's pair, which worked.
 *
 * FOUR STATES: nobody has answered, then each of the three answered in turn,
 * worst to best, so the swipe ends on the happy face. The unchosen faces keep
 * every black line and lose only their fills — a second drawn body from the
 * generator, not a CSS filter — so the difference between the slides is
 * exactly the thing the post is about: colour arriving on YOUR answer.
 *
 * The marks are SVG now (no GIF reveal to wait out), but the store still
 * hydrates, so the settle waits stay.
 * ====================================================================== */
if (wants("faces")) {
  const group = ".grasp-group";
  const answer = async (label) => {
    await raw(STEP, "h1");
    const btn = page.locator(`${group} button[aria-label="${label}"]`).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(900);
  };

  console.log("the three faces ->");
  const ctx = await ctxFor();
  page = await ctx.newPage();

  await raw(STEP, "h1");
  await isolate("faces-1-rest.png", group, { pad: 8, expect: /^Lost meSort ofGot it/ });

  await answer("Lost me");
  await isolate("faces-2-lost.png", group, { pad: 8, expect: /^not/ });

  await answer("Sort of");
  await isolate("faces-3-sort.png", group, { pad: 8, expect: /^almost/ });

  await answer("Got it");
  await isolate("faces-4-got.png", group, { pad: 8, expect: /^got/ });

  await ctx.close();
}

/* ====================================================================== *
 * 2 — THE FLAG BECOMES WHAT WAS FLAGGED.                         (midday)
 *
 * One control at three moments of one interaction: the line-drawn flag, the
 * menu it opens with a verdict chosen (colour on exactly one of five outline
 * rows), and the flag again — now wearing that verdict's own mark in colour.
 * A fourth frame gives the collapsed flag a SECOND verdict, so "becomes what
 * YOU flagged" reads as variable rather than as a fixed swap.
 *
 * The flag button and its collapsed states are 28px squares (bare glyphs, no
 * pod as of 705773e), shot tight and blown up at render; the menu is 230px
 * wide and gets its own w. Aspect changes between states, so nothing here is
 * grouped — these are genuinely different objects (a control, and the menu it
 * opens).
 * ====================================================================== */
if (wants("flag")) {
  const flagBtn = '.checkpoint-row button[aria-expanded]';
  const openMenu = async () => {
    const btn = page.locator(flagBtn).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(700);
  };
  const pick = async (label) => {
    await page.locator(`.note-menu button:has-text("${label}")`).first().click();
    await page.waitForTimeout(600);
  };

  console.log("the flag ->");
  const ctx = await ctxFor({ h: 1400 });
  page = await ctx.newPage();

  await raw(STEP, "h1");
  await isolate("flag-1-rest.png", flagBtn, { pad: 6 });

  /* Choose, then reopen: the menu now teaches which picture means which
     verdict — one row in colour among five outlines. */
  await raw(STEP, "h1");
  await openMenu();
  await pick("Needs an example");
  await openMenu();
  await isolate("flag-2-menu.png", ".note-menu", { expect: /Needs an example/ });

  /* Close it and the flag is gone — the clipboard sits where it was. */
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  await isolate("flag-3-became.png", flagBtn, { pad: 6 });

  /* A different verdict on a fresh page, so the collapsed mark visibly varies. */
  await raw(STEP, "h1");
  await openMenu();
  await pick("Needs an example"); // take the old answer back
  await openMenu();
  await pick("Something looks wrong");
  await isolate("flag-4-wrong.png", flagBtn, { pad: 6 });

  await ctx.close();
}

/* THE SINGLE-GLYPH STATES AGAIN, AT dsf 16.
 *
 * A 20px SVG mark shot at dsf 8 is a 160px raster, and a slide that blows it
 * up to fill the safe box is a 5x enlargement — the softness yesterday's
 * single-face shots were rejected for, arriving from the shot instead of from
 * the artwork. The three flag states are the only subjects today that render
 * bigger than they were shot, so only they pay for the bigger buffer: a short
 * viewport keeps dsf 16 affordable, and width stays 402 because width is what
 * decides the mobile layout. */
if (wants("flagx")) {
  const flagBtn = '.checkpoint-row button[aria-expanded]';
  const mk = async (name, doPick) => {
    const ctx = await browser.newContext({
      viewport: { width: 402, height: 640 },
      deviceScaleFactor: 16,
      isMobile: true,
      hasTouch: true,
    });
    await ctx.addInitScript(([id]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
      } catch {}
    }, [IDENTITY]);
    page = await ctx.newPage();
    await raw(STEP, "h1");
    if (doPick) {
      const btn = page.locator(flagBtn).first();
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await page.waitForTimeout(700);
      await page.locator(`.note-menu button:has-text("${doPick}")`).first().click();
      await page.waitForTimeout(600);
    }
    await isolate(name, flagBtn, { pad: 4 });
    await ctx.close();
  };

  console.log("the flag, hi-res singles ->");
  await mk("flagx-1-rest.png", null);
  await mk("flagx-3-became.png", "Needs an example");
  await mk("flagx-4-wrong.png", "Something looks wrong");
}

/* ====================================================================== *
 * 3 — THE CALLOUT SAYS WHICH KIND OF BOX IT IS.               (afternoon)
 *
 * D-12 closed overnight: every callout now names a kind, and the kind is a
 * 14px ink mark at the head of the sentence — key / danger-triangle / target.
 * Three real callouts, three kinds, bodies relabelled in neutralize.mjs the
 * way the cards and the popup were (each bold span is its own text node, so
 * each node is its own MAP row).
 *
 * NOT grouped at render: a callout's height IS its text, so this is the
 * comment-box case — the component grows, and all three run the full content
 * width, so one `w` scales them identically anyway.
 * ====================================================================== */
if (wants("callout")) {
  const co = (kind) => `div.squircle:has(> div[title="${kind}"])`;

  console.log("the callout kinds ->");
  const ctx = await ctxFor({ h: 1400 });
  page = await ctx.newPage();

  await raw("/treasury-management/getting-started-treasury/start-here-treasury", "h1");
  await isolate("co-1-key.png", co("Key point"), { expect: /remember/ });
  await isolate("co-3-exam.png", co("In the exam"), { expect: /marks on the table/ });

  await raw("/treasury-management/treasury-risk/currency/foreign-exchange-risk", "h1");
  await isolate("co-2-warning.png", co("Watch out"), { expect: /new price/ });

  await ctx.close();
}

/* ====================================================================== *
 * 4 — THE COURSE'S FIRST FOLD.                                  (evening)
 *
 * All three authored courses got a "Getting started" folder today (69cfd6c),
 * which is the shape the demo course has had since it was built — so at HEAD
 * it is simply true that every course opens by orienting you. Shot on the one
 * course whose whole tree MAP covers.
 *
 * Three states of the folder: as a course lands (open, nothing read), the
 * orientation read (rings full), and folded away — which is what a folder is
 * FOR once you're past it. The fold is a real tap against live React.
 *
 * The crop is the folder block plus the first unit's row below it, so the
 * frame says where the folder sits without becoming a screenshot of the
 * whole rail (rule 1).
 * ====================================================================== */
if (wants("fold")) {
  const NAVLIST = "nav > div.relative.flex.flex-col";

  /* Tag the rows of the Getting started block + the next folder row, and
     return them as [data-iso] targets. The tree renders each top-level unit
     as one <Row> subtree, so the first two direct children of the list that
     are NOT the absolute overlays are the two subjects. */
  /* Shot FROM a Getting started step, not from one deep in a unit: the drawer
     opens the current step's own ancestors, so standing inside "The individual"
     put its whole subtree in the crop and the folder became a screenshot of
     the rail. On the orientation step, every other unit sits collapsed and the
     second subject is one quiet row. */
  const foldShot = async (name, { seed = null, collapse = false, expect } = {}) => {
    const ctx = await ctxFor({ h: 1500, seed });
    page = await ctx.newPage();
    await raw("/getting-started/what-is-economics", ".checkpoint-row");
    await page.click('button[aria-label="Open navigation"]');
    await page.waitForTimeout(900);
    if (collapse) {
      /* Fold the Getting started group with its own caret/row — live React,
         before any relabel. The label maps to itself, so text targeting is
         relabel-safe either way. */
      await page.locator("nav >> text=Getting started").first().click();
      await page.waitForTimeout(600);
    }
    /* The two subjects: the folder subtree and the next unit's header row. */
    const sels = await page.evaluate((LIST) => {
      const list = document.querySelector(LIST);
      if (!list) throw new Error("no nav list");
      const kids = [...list.children].filter((el) => !el.classList.contains("step-selector") && !el.classList.contains("step-bar") && getComputedStyle(el).position !== "absolute");
      kids[0]?.setAttribute("data-fold", "a");
      kids[1]?.setAttribute("data-fold", "b");
      return ["[data-fold='a']", "[data-fold='b']"];
    }, NAVLIST);
    await isolate(name, sels, { expect });
    await ctx.close();
  };

  console.log("the first fold ->");
  await foldShot("fold-1-landed.png", { expect: /Getting started/ });
  await foldShot("fold-2-read.png", {
    seed: clearing({ "what-is-economics": "all", "how-to-use": "all" }),
    expect: /Getting started/,
  });
  await foldShot("fold-3-folded.png", {
    seed: clearing({ "what-is-economics": "all", "how-to-use": "all", glossary: "all" }),
    collapse: true,
    expect: /Getting started/,
  });
}

/* ====================================================================== *
 * 5 — CANDIDATES, NOT SLIDES. The whole bare row, measured so the decision
 * not to post it is on the record: four marks at opposite ends of a reading
 * column is well past rule 1's ratio ceiling, however good the design note.
 * ====================================================================== */
if (wants("try")) {
  const ctx = await ctxFor();
  page = await ctx.newPage();
  await raw(STEP, "h1");
  await prep();
  console.log("candidates ->");
  await isolate("try-row.png", ".checkpoint-row");
  await ctx.close();
}

await browser.close();
console.log("\ndone — read every PNG before rendering.");
