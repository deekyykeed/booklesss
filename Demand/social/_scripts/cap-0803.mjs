/* Capture for the 2026-08-03 posts.
 *
 *   node _scripts/cap-0803.mjs              # dev server on :3100
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0803.mjs
 *
 * Five slots, five parts of the day's shipping:
 *
 *   n-*   the nav tree, which grew folders (isolated component, three states)
 *   s-*   a step's name — the drawer row you tap and the page you land on
 *   b-*   the `cards` block on its new axis: one battery at three fill levels
 *   g-*   the wordmark on its three surfaces — the app's header lockup, the
 *         tab icon, and the card a shared link unfurls into
 *
 * WHY THE NAV IS RELABELLED BY POSITION, NOT BY THE SHARED MAP.
 * `neutralize.mjs`'s MAP swaps text nodes by string, and today that stops
 * working for the nav: the S-9 folders introduced a FOLDER and a STEP inside it
 * both labelled "Working capital", and one string cannot map to two different
 * neutral names. A parent and its child reading the same word is exactly what a
 * post about folders must not show. So the nav rows are relabelled by their
 * position in the tree instead — the row order is stable (every row stays
 * mounted, `Collapse` only sets height to 0), and the arrays below are the
 * neutral curriculum in that order.
 *
 * MAP still runs first and still covers everything else on the page, and the
 * banned-word scan still runs against every crop before it is written. Nothing
 * is drawn, moved or restyled — only the words.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, BANNED, transform, scan } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

/* ---- the neutral trees, in nav order ----------------------------------- *
 * One entry per `a.step` / `button.step` row, depth-first, exactly as the
 * sidebar renders them. A folder and a step get different names on purpose:
 * the whole subject of the morning post is that the tree now has levels, and
 * two rows reading alike would flatten it back out in the photograph. */

/* Mathematics — 34 rows. Five lessons; four of them grouped, one flat. */
const NAV_MATHS = [
  "Foundations",                    // (folder)
  "What algebra is for",
  "Terms and expressions",
  "Order of operations",
  "Functions",                      // (folder)
  "What a function is",
  "Linear functions",
  "Curves",                         // (folder)
  "Quadratic functions",
  "Completing the square",
  "Growth",                         // (folder)
  "Exponentials",
  "Logarithms",
  "Graphs",                         // (folder)
  "Reading a graph",                // (folder)
  "Axes and scale",
  "Gradients",
  "Areas",                          // (folder)
  "Area under a curve",
  "Rates of change",
  "Sequences",                      // (folder)
  "Arithmetic",                     // (folder)
  "Arithmetic sequences",
  "Sums of a series",
  "Geometric",                      // (folder)
  "Geometric sequences",
  "Infinite series",
  "Probability",                    // (folder)
  "Counting",                       // (folder)
  "Counting outcomes",
  "Permutations",
  "Distributions",                  // (folder)
  "The normal curve",
  "Sampling",
];

/* Computer Science — 37 rows. */
const NAV_CS = [
  "Foundations",                    // (folder)
  "Your first program",
  "The basics",                     // (folder)
  "Variables and data",
  "Loops and conditions",
  "Writing a function",
  "Harder cases",                   // (folder)
  "Recursion",
  "Sorting and searching",
  "Working with files",
  "Data structures",                // (folder)
  "Lists and maps",                 // (folder)
  "Arrays",
  "Dictionaries",
  "Sets and tuples",
  "Big-O notation",
  "Trees and graphs",               // (folder)
  "Binary trees",
  "Graph traversal",
  "How software runs",              // (folder)
  "Memory",                         // (folder)
  "The stack and the heap",
  "Garbage collection",
  "Compilers and interpreters",
  "Operating systems",
  "Databases",                      // (folder)
  "Tables and queries",             // (folder)
  "Rows, columns and keys",
  "Writing a query",
  "Joins",
  "Indexes",
  "Transactions",                   // (folder)
  "Atomic writes",
  "Rollback and recovery",
  "The web",                        // (folder)
  "How a request travels",
  "Building a page",
];

/* The step the midday shots land on: row 19 of NAV_CS, "Graph traversal".
 * Its nav label and its <h1> have to read the SAME words — that is the whole
 * claim of the post — so the page head is relabelled to the same string the
 * drawer row carries. */
const STEP_HEAD = {
  kicker: "Data structures",
  title: "Graph traversal",
  /* Six, not three. Only about three are inside the crop, but the scan tests
   * every element whose box touches it — a fourth paragraph clipped by one line
   * at the bottom edge is still in the photograph, and the one below that was
   * carrying two banned words. Write past the fold. */
  paras: [
    "There are two ways to walk a graph and they answer different questions. Depth-first follows one path as far as it goes before backing up; breadth-first fans out a ring at a time.",
    "Which one you want is decided by what you are looking for, not by which is faster. They visit the same nodes and they visit them in a different order, and the order is the whole point.",
    "Both need to remember where they have been, or a cycle sends them round for ever. That memory is the only real cost either of them carries.",
    "Depth-first is the one you get for free, because the call stack already keeps the trail for you. Breadth-first has to hold its own queue, and that queue is as wide as the graph.",
    "So the shortest route between two nodes is a breadth-first question. The first time it reaches the node it wanted, it got there in the fewest hops that exist.",
    "Everything after this is the same two walks with something extra bolted on — a weight, a cost, a heuristic. Learn the pair properly and the rest is a variation.",
  ],
  /* Callouts are not paragraphs and the paragraph pass does not reach them —
   * a lifted box one line into the bottom of the crop was carrying two banned
   * words while every `p` above it was clean. */
  callouts: [
    "Rule of thumb: if you want the shortest path, go wide. If you want to know whether a path exists at all, go deep.",
    "Both walks visit every node once. What differs is the order, and the order is what you are choosing between.",
  ],
  /* And list items, which are neither paragraphs nor callouts. This step opens
   * on a list, and its third bullet was the one carrying the banned words. */
  bullets: [
    "Depth-first: follow one path to its end, then back up to the last fork you did not take.",
    "Breadth-first: visit everything one hop away, then everything two hops away, and so on.",
    "Either way, keep a record of what you have already seen, or a cycle sends you round for ever.",
    "The record is a set, not a list — you ask it one question, and it has to answer instantly.",
    "Both are linear in the size of the graph: every node once, every edge once.",
    "Neither is clever. Everything clever in this area is one of these two with a rule bolted on.",
  ],
};

/* Relabels the nav rows by position, and (optionally) the head of the step
 * page. Serialised into the browser, so it may only use its own argument. */
function relabel({ nav, head }) {
  if (nav) {
    const rows = document.querySelectorAll("a.step, button.step");
    rows.forEach((row, i) => {
      const span = row.querySelector("span");
      if (span && nav[i]) span.textContent = nav[i];
    });
  }
  if (head) {
    const fc = document.querySelector(".font-content");
    if (fc) {
      const kicker = fc.querySelector("p");
      if (kicker) kicker.textContent = head.kicker;
      const h1 = fc.querySelector("h1");
      if (h1) h1.textContent = head.title;
      const ps = fc.querySelectorAll("section p");
      ps.forEach((p, i) => {
        if (head.paras[i]) p.textContent = head.paras[i];
      });
      /* A callout holds its sentence in whichever leaf carries the most text —
       * the rest of the box is a mark and a label. Rewrite that leaf only, so
       * the container, its mark and its hue stay exactly as the app draws them. */
      fc.querySelectorAll("div.squircle").forEach((box, i) => {
        const line = head.callouts?.[i];
        if (!line) return;
        let best = null;
        box.querySelectorAll("span,p,div").forEach((el) => {
          if (el.children.length) return;
          const len = (el.textContent || "").trim().length;
          if (!best || len > (best.textContent || "").trim().length) best = el;
        });
        if (best) best.textContent = line;
      });
      /* A bullet's text sits in the LAST span of its row — the first is the
       * marker. Same shape the shared READER transform uses for #key-ideas. */
      fc.querySelectorAll("li").forEach((li, i) => {
        const line = head.bullets?.[i];
        const span = li.querySelector("span:last-child");
        if (line && span) span.textContent = line;
      });
    }
  }
}

/* ---- the seed, built from the real course tree ------------------------- *
 * Same shape as 2 Aug: a reader about a month in. Rebuilt against today's ids,
 * because the S-8 splits and the S-9 folders moved most of them. */
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

/* Four weeks. Rest days sit in pairs — two together draw one trough, which is
 * what a weekend looks like; alternating them draws a comb. */
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
const WHO = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  school: "zcas",
  schoolName: null,
  courses: ["treasury-management", "corporate-finance"],
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
});

/* ---- browser ----------------------------------------------------------- */
const browser = await chromium.launch();

const phone = async (scale = 8) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
    /* Headless Chromium has no `navigator.share`, so the share control takes
     * its copy-to-clipboard path — which is silently refused without this, and
     * the button then never reaches its "Link copied" state. */
    permissions: ["clipboard-write", "clipboard-read"],
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
 * screenshot — and the positional nav pass runs AFTER the string map, so a
 * folder and its child cannot collapse onto the same word. */
const prep = async ({ nav = null, head = null } = {}) => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
  await page.evaluate(transform, { map: MAP, reader: null, deep: true });
  await page.evaluate(relabel, { nav, head });
};

const go = async (url, ready = "main", opts = {}) => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.waitForTimeout(1400);
  try {
    await prep(opts);
  } catch {
    await page.waitForSelector(ready, { timeout: 120000 });
    await page.waitForTimeout(1500);
    await prep(opts);
  }
};

/* ONE COMPONENT, ON NOTHING — see cap-0802.mjs for the full reasoning. Hide
 * everything, unhide the component's own subtree, clear the canvas, take a
 * PADDED page clip so the component's own overhang comes with it. */
const isolate = async (name, sel, { nth = 0, pad = 16, ...opts } = {}) => {
  await prep(opts);
  await page.locator(sel).nth(nth).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await prep(opts);

  const box = await page.evaluate(
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

/* A whole-screen 9:16 crop, for the `feature()` slides. */
const SCREEN = (y = 156) => ({ x: 0, y, width: 402, height: 715 });

const shot = async (name, clip, opts = {}) => {
  await prep(opts);
  const leaked = await page.evaluate(scan, { banned: BANNED, clip, pageSpace: false });
  if (leaked.length) {
    /* Name the sentence, not just the word. A banned substring is usually
     * inside a longer word ("irrelevance" carries "irr"), and hunting for it
     * by eye across a page costs more than printing it here. */
    const where = await page.evaluate(
      ([words, c]) => {
        const hits = [];
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const n = w.currentNode;
          const el = n.parentElement;
          if (!el || el.closest(".sr-only,[aria-hidden='true']")) continue;
          const s = getComputedStyle(el);
          if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) continue;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          if (r.right <= c.x || r.left >= c.x + c.width || r.bottom <= c.y || r.top >= c.y + c.height)
            continue;
          const v = n.nodeValue.toLowerCase();
          const chain = [];
          for (let a = el; a && a !== document.body; a = a.parentElement)
            chain.unshift(a.tagName.toLowerCase() + (a.id ? "#" + a.id : "") + (a.className && typeof a.className === "string" ? "." + a.className.trim().split(/\s+/).slice(0, 3).join(".") : ""));
          for (const b of words)
            if (v.includes(b)) hits.push(`${b} <- ${chain.slice(-4).join(" > ")}\n      "${n.nodeValue.trim().slice(0, 90)}"`);
        }
        return hits;
      },
      [leaked, clip],
    );
    throw new Error(`${name}: banned words inside the crop —\n  ` + where.join("\n  "));
  }
  await page.screenshot({ path: out(name), clip });
  console.log("  " + name);
};

console.log("capturing ->", DIR);

/* ================================================================== *
 * 1 — THE TREE THAT GREW FOLDERS.  (morning)
 *
 * One component, three states: the course closed, a lesson opened onto the
 * folders inside it, and one of those folders opened onto its steps. The
 * sidebar is the component; the drawer is only how a phone shows it.
 * ================================================================== */
const ctx1 = await phone();
page = await ctx1.newPage();

const M = { nav: NAV_MATHS };
const NAVLIST = "nav > div.relative.flex.flex-col";

await go("/treasury-management/working-capital/working-capital-and-liquidity", ".checkpoint-row", M);
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(900);

const folderRow = (label) => `button.step:has(span:text-is("${label}"))`;

/* Closed: five lessons and nothing else. The active step's own ancestors are
 * opened by the app on load, so they are shut by hand first — a reader who has
 * just arrived at the course sees exactly this. */
await page.click(folderRow("Functions"));
await page.waitForTimeout(700);
await isolate("n-closed.png", NAVLIST, M);

/* Opened: the lesson is not six equal rows any more. Two steps, then two
 * folders — which is the change. */
await page.click(folderRow("Functions"));
await page.waitForTimeout(700);
await isolate("n-open.png", NAVLIST, M);

/* And one level further in, where the rail draws the nesting. */
await page.click(folderRow("Growth"));
await page.waitForTimeout(800);
await isolate("n-deep.png", NAVLIST, M);

await ctx1.close();

/* ================================================================== *
 * 2 — A STEP HAS ONE NAME.  (midday)
 *
 * Shot on the other course, deliberately: the rule was applied across the
 * whole reader, and shooting the same drawer twice in a day would read as one
 * post cut in half. These are whole-screen crops for `feature()` slides, so
 * the drawer and the page can be seen to say the same thing.
 * ================================================================== */
const ctx2 = await phone(3);
page = await ctx2.newPage();

const C = { nav: NAV_CS, head: STEP_HEAD };
await go(
  "/corporate-finance/cost-of-capital/capital-structure/capital-structure-theories",
  ".font-content h1",
  C,
);

/* The page you land on. */
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await shot("s-page.png", SCREEN(96), C);

/* The row you tapped to get here. The drawer is frosted, so park the page on
 * body text first — a panel edge showing through reads as a fault. */
await page.evaluate(() => window.scrollTo(0, 260));
await page.waitForTimeout(400);
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(900);
await shot("s-drawer.png", { x: 0, y: 40, width: 300, height: 533 }, C);

await ctx2.close();

/* ================================================================== *
 * 3 — ONE CARD, THREE FILL LEVELS.  (afternoon)
 *
 * The `cards` block on its new axis. Until today `card-glyphs.tsx` drew one
 * question — how far ahead is this? — so any set that was not about time
 * stayed a table. This set is about HOW MUCH BUFFER YOU HOLD, and the mark is
 * one object at three charges: the accent layer is the charge itself, so the
 * card's own hue fills it in proportion and the empty one draws no tone at all.
 *
 * A card IS its text, so the words are placeholders (MAP, below) while the
 * mark, the tone, the rule and the fill are the real component.
 * ================================================================== */
const ctx3 = await phone();
page = await ctx3.newPage();
await go("/treasury-management/working-capital/working-capital-and-liquidity", ".checkpoint-row");

const CARDS = "#working-capital-policy div.rounded-3xl.shadow-lift:has(svg)";
const LEVELS = ["lean", "middle", "full"];
for (let i = 0; i < 3; i++) {
  await isolate(`b-card-${LEVELS[i]}.png`, CARDS, { nth: i });
}

/* The mark alone, at the two ends of the axis. A card is mostly type; the
 * glyph is the thing that changed, and at card size it is 34px of it. */
await isolate("b-mark-empty.png", `${CARDS} svg`, { nth: 0, pad: 10 });
await isolate("b-mark-full.png", `${CARDS} svg`, { nth: 2, pad: 10 });

await ctx3.close();

/* ================================================================== *
 * 4 — THE LOGO IS THE WORD.  (evening)
 *
 * The header lockup lost its glyph this morning, the favicon became the same
 * word, and the card a shared link unfurls into took the display face. Three
 * surfaces, one decision.
 * ================================================================== */
const ctx4 = await phone();
page = await ctx4.newPage();

await go("/treasury-management/working-capital/working-capital-and-liquidity", "header");
await isolate("g-header.png", "header a[href='/']", { pad: 12 });

/* The control that produces the card. One button in the header and only one —
 * the owner's rule is that there is exactly one place in the app where sharing
 * can be got wrong — and on a phone it hands the page to the native share
 * sheet, which is how a link reaches a group chat in the first place. */
const SHARE = "header button.text-xs.text-ink-2";
await isolate("g-share.png", SHARE, { pad: 12 });

/* Pressed. On a phone this hands the page to the native share sheet; where
 * there is no sheet it copies, and the button says so in place rather than
 * throwing a toast at you. Two real states of one control. */
await page.click(SHARE);
await page.waitForTimeout(600);
await isolate("g-share-done.png", SHARE, { pad: 12 });

/* The favicon: the same word again, drawn as the tab mark — and unlike the
 * header lockup this one carries its own tile, so it stays legible on a dark
 * browser chrome and in a search result. The SVG element itself, not the
 * viewport around it: a standalone image document is mostly empty page. */
const fav = await ctx4.newPage();
/* Shown in an <img>, not visited as a document. Chromium lays a standalone SVG
 * out against the whole page box, so an element screenshot of it comes back as
 * the icon marooned in two screens of white. An <img> takes the file's own
 * aspect, so the shot is the tile and nothing else. It is still the app's own
 * asset, served by the app, at its own proportions. */
await fav.setContent(
  `<body style="margin:0"><img id="f" src="${BASE}/icon.svg" style="display:block;width:960px"></body>`,
  { waitUntil: "load" },
);
await fav.waitForTimeout(900);
await fav.locator("#f").screenshot({ path: out("g-favicon.png"), omitBackground: true });
console.log("  g-favicon.png");

/* The card a link unfurls into. `/og/home.png` is the one card in the set
 * that names no course — every other one is a course's or a step's own title,
 * which is the thing a post may never carry. */
const og = await ctx4.newPage();
await og.goto(BASE + "/og/home.png", { waitUntil: "load", timeout: 120000 });
await og.waitForTimeout(1500);
const ogEl = og.locator("img").first();
await ogEl.screenshot({ path: out("g-og.png") });
console.log("  g-og.png");
await ctx4.close();

await browser.close();
console.log("done ->", DIR);
