import { chromium } from "./pw.mjs";
import fs from "fs";
const SRC = "cc-src";
const BASE = "http://localhost:3100";
const LESSON = "/microeconomics/supply-demand/law-of-demand";
const browser = await chromium.launch();

/* corner-shape support probe */
{
  const page = await browser.newPage();
  const ok = await page.evaluate(() => CSS.supports("corner-shape", "superellipse(2.4)"));
  console.log("corner-shape supported:", ok);
  await page.close();
}

/* selector pill only — DPR 6 */
{
  const page = await browser.newPage({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 6 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const b = await page.evaluate(() => {
    const el = document.querySelector(".step-selector");
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  // tight crop around the pill with breathing room
  await page.screenshot({ path: `${SRC}/selector.png`, clip: { x: b.x - 20, y: b.y - 22, width: b.w + 44, height: b.h + 44 } });
  await page.close();
}

/* avatar only — DPR 8 (tiny element) */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 400 }, deviceScaleFactor: 8 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const b = await page.evaluate(() => {
    const el = document.querySelector('[aria-label="Account"]');
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const pad = 10;
  await page.screenshot({ path: `${SRC}/avatar.png`, clip: { x: b.x - pad, y: b.y - pad, width: b.w + pad * 2, height: b.h + pad * 2 } });
  await page.close();
}

await browser.close();
const png = (p) => { const b = fs.readFileSync(p); return b.readUInt32BE(16) + "x" + b.readUInt32BE(20); };
console.log("selector", png(`${SRC}/selector.png`), "| avatar", png(`${SRC}/avatar.png`));
