/* Capture for the 2026-08-07 posts.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0807.mjs
 *   ONLY=grasp BASE_URL=http://localhost:3101 node _scripts/cap-0807.mjs
 *
 * A FAT SHIP DAY — fourteen commits, and three of them are things a student
 * can see. So three product carousels off today's work:
 *
 *   grasp-*  the two answers at the end of a section, which are DRAWN faces as
 *            of today, grey at rest and in their own colour once answered
 *   card-*   the course card in the three lives the new tabs give it —
 *            reading it, waiting to be written, finished
 *   note-*   the menu at the other end of that row, now that each of its five
 *            options carries its own mark
 *
 * `next dev` is enough — nothing here needs a service worker. Auth stays off in
 * C:/bkls-shot (`authEnabled` = NEXT_PUBLIC_SUPABASE_URL && ANON_KEY, both
 * commented out in its .env.local), which is what lets a headless browser reach
 * a seeded /dashboard AND what lets the checkpoint taps land: signed out,
 * `needsAccount()` sends every tap to the sign-up sheet instead of recording it.
 *
 * THE SUBJECTS MOVED TWICE TODAY WHILE THIS WAS BEING WRITTEN — d4906f6 drew
 * the faces, a793eae changed how the unpicked one is greyed, 1db3df1 rebuilt
 * the tab row. `ONLY=` is here so any one of them can be re-shot on its own
 * when it moves again. Pinned to 5ac4d46.
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

/* ====================================================================== *
 * THE SEEDED READER.
 *
 * Built off the real tree, so every number is the app's own arithmetic on
 * real section ids (rule 9). A month in: one course two-thirds read, one
 * SHORT course finished, three more ticked off a timetable that nobody has
 * written yet.
 *
 * FINISHING A COURSE IS THE ONE THING RULE 9 WARNS ABOUT, and it is load
 * bearing here — the Completed tab shipped today and cannot be photographed
 * without one. The course chosen is the 7-step one, so a month of reading
 * finishes it honestly; the 25-step course would not.
 * ====================================================================== */
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
/** Every section of every lesson listed — the course finished. */
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
const day = (mins, course = "economics") => ({
  checks: mins > 30 ? 2 : mins > 12 ? 1 : 0,
  steps: mins > 40 ? 1 : 0,
  secs: mins * 60,
  courses: { [course]: mins * 60 },
  courseChecks: { [course]: mins > 30 ? 2 : mins > 12 ? 1 : 0 },
});

/* THE PIPELINE TAB READS `identity.curriculum`, NOT `identity.courses` —
 * everything the student ticked off their timetable, against the courses that
 * exist. `pendingCourses()` returns the ones with no `live` flag, which is what
 * a pipeline card is. All three titles are mapped in neutralize.mjs; adding a
 * fourth here without adding it there ships a real course name. */
const PENDING = ["financial-accounting", "management-accounting", "taxation"];

const IDENTITY = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  school: "zcas",
  schoolName: "A university",
  programme: "bachelor-of-accounting",
  programmeName: "Accounting",
  year: 2,
  courses: ["economics", "strategic-management"],
  curriculum: ["introduction-to-economics", ...PENDING],
  coursesChosen: true,
  nameChosen: true,
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
  updatedAt: "2026-07-04T09:00:00.000Z",
});

const SEED = JSON.stringify({
  done: {
    /* Two-thirds of the long course, and all of the short one. */
    ...full(byCourse.microeconomics.slice(0, 9)),
    ...part([byCourse.microeconomics[9]]),
    ...full(byCourse["strategic-management"]),
  },
  ratings: {},
  /* Rest days in a PAIR, not alternating — alternating days off draw a comb. */
  days: {
    [ago(0)]: day(31),
    [ago(1)]: day(46),
    [ago(2)]: day(0),
    [ago(3)]: day(0),
    [ago(4)]: day(38),
    [ago(5)]: day(24),
    [ago(6)]: day(17),
  },
});

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

/* CLICK BEFORE THE FIRST RELABEL, NEVER AFTER IT.
 *
 * `transform` rewrites the DOM's text nodes in place, and React does not know
 * it happened: the next state change reconciles against a tree it no longer
 * owns, so the store updates, `data-answered` never changes, and the tap looks
 * like it was swallowed. It fails SILENTLY — no error, no timeout, and a
 * screenshot that is a perfectly good picture of the wrong state. It cost two
 * runs today before the assert caught it, which is what the assert is for.
 *
 * So every state that has to be produced by clicking gets its own fresh page:
 * `raw()` navigates and does NOT relabel, the interaction happens against live
 * React, and `isolate()` does the relabelling immediately before the shutter.
 * The store is localStorage, so a fresh load carries the last answer with it. */
const raw = async (url, ready) => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.waitForTimeout(1600);
};

const go = async (url, ready) => {
  await raw(url, ready);
  try {
    await prep();
  } catch {
    await page.waitForTimeout(1400);
    await prep();
  }
};

/* ONE COMPONENT, ON NOTHING — see cap-0802.mjs for the reasoning. */
const isolate = async (name, sels, { pad = 16, expect = null, settle = 0 } = {}) => {
  const list = Array.isArray(sels) ? sels : [sels];
  await prep();
  await page.locator(list[0]).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await prep();
  /* A one-shot GIF is still playing when the shutter would otherwise fire, and
     a frame from the middle of a reveal is a picture of a face mid-blink. */
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

  /* The state's own words, checked at the shutter — an answered checkpoint and
     an unanswered one differ by one attribute, and a tap that silently did
     nothing looks exactly like a tap that worked. */
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

const ctxFor = async ({ h = 1100, scale = 8 } = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: h },
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
  });
  /* NO `Math.random` PIN HERE, AND THAT IS THE POINT.
   *
   * cap-0806 pins it so the greeting's line is the same on every re-render, and
   * copying that line into a script whose subjects have to be CLICKED cost most
   * of an afternoon: with `Math.random = () => 0.42` in place, every tap on a
   * checkpoint silently does nothing. No error, no timeout, no console warning
   * — the handler simply never runs, the store never changes, and the shutter
   * fires on a perfectly good picture of the unanswered state. Proved by
   * bisection: same seed, same identity, same page, pin on `null` / pin off
   * `got`.
   *
   * Pin it only in a context that photographs a random pick and clicks nothing.
   */
  await ctx.addInitScript(
    ([id, sd]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
        localStorage.setItem("booklesss:progress:v6", sd);
        localStorage.removeItem("booklesss-offline-card-dismissed");
      } catch {}
    },
    [IDENTITY, SEED],
  );
  return ctx;
};

/* ====================================================================== *
 * 1 — THE TWO ANSWERS, DRAWN.                                 (morning)
 *
 * `.grasp-group` is 78x34 css: two 34px buttons and the gap between them, so
 * 2.3:1 — flatter than nothing the frame has carried, and the same shape as a
 * course card, which is the flattest thing that has worked.
 *
 * THREE STATES THAT DIFFER IN KIND, and the difference is COLOUR rather than
 * shape. At rest both faces are the drawing with its fill removed — a third
 * PNG, not a CSS filter, because grayscale+opacity dims the line work as hard
 * as the fill and the owner's word for that this afternoon was that the face
 * "fades out" rather than losing its colour. Answer, and that one face plays
 * its reveal once and holds it, in its own colour. So: nobody has answered,
 * "Got it" answered, "Later" answered.
 *
 * `group:` in the render config, not here — all three are the same two buttons
 * at the same size, so nothing needs unioning; that rule is for a component
 * whose INK changes between states, and here the alpha box never moves.
 * ====================================================================== */
if (wants("grasp")) {
  const ctx = await ctxFor();
  page = await ctx.newPage();

  const STEP = "/microeconomics/supply-demand/law-of-demand";
  const group = ".grasp-group";
  const answer = async (label) => {
    await raw(STEP, "h1");
    await page.locator(`${group} button[aria-label="${label}"]`).first().click();
    /* The reveal is a one-shot GIF: it plays and holds its last frame. Waiting
       is not politeness, it is the difference between a face and a blink. */
    await page.waitForTimeout(1600);
  };

  console.log("the two answers ->");
  await raw(STEP, "h1");
  /* `data-answered` is absent until something is answered, so the checked
     string starts with the labels rather than with a state. That absence IS
     the state, and asserting on it is what stops a run where a tap landed
     early shipping under the name "rest". */
  await isolate("grasp-1-rest.png", group, { expect: /^LaterGot it/ });

  await answer("Got it");
  await isolate("grasp-2-got.png", group, { expect: /^got/ });

  await answer("Later");
  await isolate("grasp-3-later.png", group, { expect: /^not/ });

  /* AND THE SAME THREE STATES ONE BUTTON AT A TIME.
   *
   * The pair is the control, but it is 78x34 css and the GAP is half of it, so
   * at the full width of the safe box the drawing lands about a quarter of the
   * frame across and the slide reads as two small circles on a lot of gradient
   * — the owner's standing note about not zooming in enough, arriving through
   * the subject's aspect rather than through the `w`.
   *
   * One button is 34x34. Square, so it fills the stage in both directions, and
   * the thing the post is about — the colour arriving — is what gets bigger.
   * Both sets are shot; the render config picks. */
  const one = (label) => `${group} button[aria-label="${label}"]`;
  await raw(STEP, "h1");
  await isolate("face-1-rest.png", one("Got it"), { pad: 6 });
  await answer("Got it");
  await isolate("face-2-got.png", one("Got it"), { pad: 6 });
  await answer("Later");
  await isolate("face-3-later.png", one("Later"), { pad: 6 });

  await ctx.close();
}

/* ====================================================================== *
 * 2 — ONE COURSE CARD, THREE LIVES.                            (midday)
 *
 * The tabs shipped today, and what they actually did was give the same card
 * shell three jobs. A pipeline card is NOT a different component wearing a
 * disguise — PipelineCard renders the same `.course-card`, the same radius,
 * border and shadow, with every colour that would carry meaning dropped to a
 * muted token and the resume button's shape carrying a fact instead of an
 * action. That is the post: a course on your timetable, at the three things it
 * can be.
 *
 * NOT GREYED WITH `opacity`, which is the detail worth having in frame — a
 * blanket fade takes the border and the shadow with it and the card reads as
 * broken rather than as not-yet.
 * ====================================================================== */
if (wants("card")) {
  const ctx = await ctxFor({ h: 1500 });
  page = await ctx.newPage();

  /* Same rule as the checkpoint above: the tab is switched against live React,
     then relabelled. A tab clicked after `prep()` changes `tab` in state and
     leaves the detached DOM showing the panel it was already showing. */
  const tab = async (label) => {
    await raw("/dashboard", "main");
    if (label) {
      await page.locator(`[role="tab"]:has-text("${label}")`).first().click();
      await page.waitForTimeout(1000);
    }
  };

  console.log("one card, three lives ->");
  await tab(null);
  await isolate("card-1-reading.png", ".course-card", { expect: /Organisational Behaviour/ });

  await tab("Pipeline");
  await isolate("card-2-queued.png", ".course-card", { expect: /not written yet/i });

  await tab("Completed");
  await isolate("card-3-done.png", ".course-card", { expect: /Operations Management/ });

  await ctx.close();
}

/* ====================================================================== *
 * 3 — THE MENU AT THE OTHER END OF THE ROW.                 (afternoon)
 *
 * Posted once before, on 2 Aug, and this is a DIFFERENT question about it. That
 * post was what the menu IS — a second question at the end of a section, about
 * the writing rather than about the reader. Today every row grew its own mark,
 * line at rest and solid when it is the answer given, replacing a tick that
 * could only ever say the second of those in the slot where the first belonged.
 * So the axis is the marks, and the three states are the five options at rest,
 * one of them chosen, and the row collapsed back to what was said.
 *
 * The menu is measured and flipped in a layout effect, so it opens upward here
 * and the isolate has to take the MENU, not the button that owns it.
 * ====================================================================== */
if (wants("note")) {
  const ctx = await ctxFor({ h: 1400 });
  page = await ctx.newPage();

  const STEP = "/microeconomics/supply-demand/law-of-demand";
  /* Fresh page, open the menu, optionally answer and reopen it — all before
     the first relabel, for the reason written above `raw()`. */
  const menu = async (label) => {
    await raw(STEP, "h1");
    const btn = page.locator(".checkpoint-row button").first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(600);
    if (label) {
      await page.locator(`.note-menu button:has-text("${label}")`).first().click();
      await page.waitForTimeout(500);
      await page.locator(".checkpoint-row button").first().click();
      await page.waitForTimeout(600);
    }
  };

  console.log("the other question ->");
  await menu(null);
  await isolate("note-1-options.png", ".note-menu", { expect: /Clear.*Hard to follow.*Too long/s });

  await menu("Needs an example");
  await isolate("note-2-example.png", ".note-menu", { expect: /Needs an example/ });

  await menu("Something looks wrong");
  await isolate("note-3-wrong.png", ".note-menu", { expect: /Something looks wrong/ });

  await ctx.close();
}

/* ====================================================================== *
 * 4 — ONE COURSE CARD, THREE FILLS.                             (night)
 *
 * A REPEAT AXIS, AND SAID SO OUT LOUD. The card went out on 3 Aug at three
 * fill levels and that is exactly this set. It is back because the card itself
 * moved twice today — 5240af9 stepped it back a point and made the resume
 * button fully solid, a739ae6 stopped its shadow reading as a second border —
 * and a redesign is a reason to re-shoot a known-good axis where "we need a
 * fifth post" would not be. The caption carries that, not the slides.
 *
 * ONE COURSE, THREE AMOUNTS OF IT READ — not three courses, which is 2 Aug's
 * set and would be two axes crossed. Each state gets its own context because
 * the fill comes from the seed, and the seed is read once at boot.
 * ====================================================================== */
if (wants("fill")) {
  console.log("one card, three fills ->");
  const CARD = ".course-card";
  /* Section counts, so the fills are the app's arithmetic and not a number
     picked to look good: the economics course's lessons in tree order. */
  const ECON = [...byCourse["getting-started"], ...byCourse.microeconomics];
  const cuts = [
    ["fill-1-fresh.png", []],
    ["fill-2-part.png", ECON.slice(0, 4)],
    ["fill-3-most.png", ECON.slice(0, 11)],
  ];
  for (const [name, ids] of cuts) {
    const ctx = await browser.newContext({
      viewport: { width: 402, height: 1500 },
      deviceScaleFactor: 8,
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
      [
        JSON.stringify({
          name: "Chanda",
          avatar: "astronaut",
          courses: ["economics"],
          coursesChosen: true,
          nameChosen: true,
          id: "capture-device",
          since: "2026-07-04T09:00:00.000Z",
        }),
        JSON.stringify({
          done: full(ids),
          days: {
            [ago(0)]: day(31),
            [ago(1)]: day(46),
            [ago(2)]: day(0),
            [ago(3)]: day(0),
            [ago(4)]: day(38),
            [ago(5)]: day(24),
            [ago(6)]: day(17),
          },
        }),
      ],
    );
    page = await ctx.newPage();
    await go("/dashboard", "main");
    await isolate(name, CARD, { expect: /Organisational Behaviour/ });
    await ctx.close();
  }
}

/* ====================================================================== *
 * 5 — CANDIDATES, NOT SLIDES.
 *
 * Shot so slots 4 and 5 get PICKED off pictures rather than off a commit
 * message. The tab row is the day's other visible change and rule 1 says a
 * control past about 5:1 cannot carry a slide; this is here to be measured and
 * looked at, not because it is going out.
 * ====================================================================== */
if (wants("try")) {
  const ctx = await ctxFor({ h: 1500 });
  page = await ctx.newPage();
  await go("/dashboard", "main");

  console.log("candidates ->");
  await isolate("try-tabs.png", '[role="tablist"]');
  await isolate("try-courses.png", "#courses");

  await ctx.close();
}

await browser.close();
console.log("\ndone — read every PNG before rendering.");
