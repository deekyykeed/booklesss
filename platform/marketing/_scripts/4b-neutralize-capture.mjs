import fs from "fs";
import path from "path";
import { chromium, BASE, LESSON, SOURCE } from "./paths.mjs";
import { MAP, READER, transform } from "./neutralize.mjs";

const SRC = path.join(SOURCE, "carousel-crops");
fs.mkdirSync(SRC, { recursive: true });
// CHROMIUM=/path/to/chrome for machines with a pre-baked browser.
const launch = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {};

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
