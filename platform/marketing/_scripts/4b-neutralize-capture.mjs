import fs from "fs";
import path from "path";
import { chromium, BASE, LESSON, SOURCE } from "./paths.mjs";

const SRC = path.join(SOURCE, "carousel-crops");
fs.mkdirSync(SRC, { recursive: true });
// CHROMIUM=/path/to/chrome for machines with a pre-baked browser.
const launch = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {};

/* The live app only has an economics course loaded, so real screenshots would
 * expose it. Booklesss is meant to hold EVERY course — so before capturing we
 * relabel the nav + breadcrumb to a neutral multi-subject curriculum and swap
 * the reader for generic, subject-free copy. Placeholder labels, real UI. */
const MAP = {
  "What is Economics": "Welcome to Booklesss",
  "How to use this course": "How Booklesss works",
  "Key terms & glossary": "Key terms",
  "Microeconomics": "Computer Science",
  "Macroeconomics": "Mathematics",
  "Behavioral economics": "History",
  "Resources": "Design",
  "Supply & demand": "Foundations",
  "Consumer choice": "Core skills",
  "Firms & production": "Projects",
  "Market structures": "Going further",
  "The law of demand": "Your first lesson",
  "The law of supply": "Variables",
  "Market equilibrium": "Functions",
  "Elasticity": "Loops",
  "Price elasticity of demand": "For loops",
  "Income elasticity of demand": "While loops",
  "Cross-price elasticity of demand": "Nested loops",
  "Income elasticity": "While loops",
  "Cross-price elasticity": "Nested loops",
  "Utility & marginal utility": "Objects",
  "Indifference curves": "Arrays",
  "Budget constraints": "Recursion",
};

const READER = {
  kicker: "Foundations",
  title: "Your first lesson",
  lead: "Booklesss turns any subject into something you can actually read — short, plain-language lessons that get to the point and build on each other.",
  callout: "Rule of thumb: if an idea can be explained simply, Booklesss explains it simply.",
  ideas: [
    "Every lesson opens with the big idea, then fills in the details.",
    "You move at your own pace — nothing is locked, nothing is timed.",
    "Examples come from real life, not abstract theory.",
  ],
  practice:
    "Say you're picking up something new this week. Instead of a 900-page textbook, you get a clear path: start here, learn the core idea, try it, and move on when it clicks.",
  summary:
    "Booklesss is built to make the next thing you learn feel easy to start — and hard to put down.",
};

// runs in the page (Playwright passes a single arg). `deep` also rewrites keys
// that sit INSIDE a longer string — the search palette's hints read
// "Microeconomics / Supply & demand", so exact-match relabelling misses them.
function transform({ map, reader, deep }) {
  // 1. reader content -> neutral
  const fc = document.querySelector(".font-content");
  if (fc) {
    const kicker = fc.querySelector("p");
    if (kicker) kicker.textContent = reader.kicker;
    const h1 = fc.querySelector("h1");
    if (h1) h1.textContent = reader.title;
    const lead = fc.querySelector("#overview p");
    if (lead) lead.textContent = reader.lead;
    const callout = fc.querySelector("#overview .squircle");
    if (callout) callout.textContent = reader.callout;
    const lis = fc.querySelectorAll("#key-ideas li");
    lis.forEach((li, i) => {
      const span = li.querySelector("span:last-child");
      if (span && reader.ideas[i]) span.textContent = reader.ideas[i];
    });
    const pr = fc.querySelector("#in-practice p");
    if (pr) pr.textContent = reader.practice;
    const su = fc.querySelector("#summary p");
    if (su) su.textContent = reader.summary;
  }
  // 2. relabel every remaining text node that exactly matches a map key (nav, breadcrumb, …)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  if (deep) {
    // longest key first, so "Price elasticity of demand" wins over "Elasticity"
    const keys = Object.keys(map).sort((a, b) => b.length - a.length);
    nodes.forEach((n) => {
      let v = n.nodeValue;
      keys.forEach((k) => { if (v.includes(k)) v = v.split(k).join(map[k]); });
      if (v !== n.nodeValue) n.nodeValue = v;
    });
    return;
  }
  nodes
    .filter((n) => map[n.nodeValue.trim()])
    .forEach((n) => {
      const key = n.nodeValue.trim();
      n.nodeValue = n.nodeValue.replace(key, map[key]);
    });
}

const browser = await chromium.launch(launch);

/* A. active-row macro (neutral) — DPR 6 */
{
  const page = await browser.newPage({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 6 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.evaluate(transform, { map: MAP, reader: READER });
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => {
    const a = [...document.querySelectorAll("aside a.step")].find((n) => !n.className.includes("step-dim"));
    const b = a.getBoundingClientRect();
    return { y: b.y, h: b.height };
  });
  await page.screenshot({ path: `${SRC}/active-neu.png`, clip: { x: 4, y: r.y - 102, width: 258, height: 238 } });
  await page.close();
}

/* B. subjects shelf (neutral) — collapse all folders, DPR 5 */
{
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 5 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.evaluate(transform, { map: MAP, reader: READER });
  let guard = 0;
  while (guard++ < 8) {
    const open = await page.$$('aside button.step[aria-expanded="true"]');
    if (!open.length) break;
    await open[open.length - 1].click();
    await page.waitForTimeout(320);
  }
  await page.waitForTimeout(300);
  const box = await page.evaluate(() => {
    const tops = [...document.querySelectorAll("aside .step")].filter(
      (el) => parseFloat(getComputedStyle(el).paddingLeft) <= 10,
    );
    const rects = tops.map((el) => el.getBoundingClientRect());
    return { top: Math.min(...rects.map((r) => r.top)), bottom: Math.max(...rects.map((r) => r.bottom)) };
  });
  await page.screenshot({
    path: `${SRC}/subjects.png`,
    clip: { x: 0, y: box.top - 20, width: 264, height: box.bottom - box.top + 40 },
  });
  await page.close();
}

/* C. full app (neutral) — DPR 3, the whole thing, shown clearly */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.evaluate(transform, { map: MAP, reader: READER });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SRC}/window-neu.png` });
  await page.close();
}

/* D. lessons list (neutral) — a subject's contents, DPR 6 superzoom */
{
  const page = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 6 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.evaluate(transform, { map: MAP, reader: READER });
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => {
    const a = [...document.querySelectorAll("aside a.step")].find((n) => !n.className.includes("step-dim"));
    const b = a.getBoundingClientRect();
    return { y: b.y };
  });
  // pill + the next few lessons (Your first lesson · Variables · Functions · Loops)
  await page.screenshot({ path: `${SRC}/lessons-neu.png`, clip: { x: 4, y: r.y - 52, width: 258, height: 320 } });
  await page.close();
}

/* E. lesson content (neutral) — heading + lead, DPR 4 superzoom */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.evaluate(transform, { map: MAP, reader: READER });
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => {
    const b = document.querySelector(".font-content").getBoundingClientRect();
    return { x: b.x, y: b.y };
  });
  await page.screenshot({ path: `${SRC}/reader-neu.png`, clip: { x: r.x - 40, y: r.y - 34, width: 1000, height: 470 } });
  await page.close();
}

/* F. Search palette (neutral) — the real Cmd-K palette over a neutral tree, DPR 4 */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(500);
  const input = page.locator('input[placeholder^="Search courses"]');
  // deep: the result hints are composite ("Microeconomics / Supply & demand")
  await page.evaluate(transform, { map: MAP, reader: READER, deep: true });
  await page.waitForTimeout(200);
  const modal = input.locator('xpath=ancestor::div[contains(@class,"rounded-xl")][1]');
  await modal.screenshot({ path: `${SRC}/command-neu.png` });
  await page.close();
}

await browser.close();
const png = (p) => { const b = fs.readFileSync(p); return b.readUInt32BE(16) + "x" + b.readUInt32BE(20); };
console.log("command-neu", png(`${SRC}/command-neu.png`), "|", "active-neu", png(`${SRC}/active-neu.png`), "| subjects", png(`${SRC}/subjects.png`), "| lessons", png(`${SRC}/lessons-neu.png`), "| reader", png(`${SRC}/reader-neu.png`));
