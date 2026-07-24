import { chromium } from "./pw.mjs";
import fs from "fs";

const BASE = "http://localhost:3100";
const SRC = "cc-src";
fs.mkdirSync(SRC, { recursive: true });

const LESSON = "/microeconomics/supply-demand/law-of-demand";
const INTRO = "/getting-started/what-is-economics";

const browser = await chromium.launch();

/* Helper: fresh page at a given DPR/size. */
async function newPage(w, h, dpr) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  return p;
}

/* ---------- A. Sidebar navigator — tall, DPR 3 (full panel) ---------- */
{
  const page = await newPage(1440, 1150, 3);
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  for (const label of ["Elasticity", "Consumer choice"]) {
    const btn = page.locator("aside button.step", { hasText: label }).first();
    if (await btn.count()) { await btn.click(); await page.waitForTimeout(400); }
  }
  await page.mouse.move(1200, 900);
  await page.waitForTimeout(500);
  const box = await page.evaluate(() => {
    const r = document.querySelector("aside nav > div").getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  });
  await page.screenshot({ path: `${SRC}/nav-tall.png`, clip: { x: 0, y: box.top - 14, width: 264, height: box.bottom - box.top + 28 } });
  await page.close();
}

/* ---------- B. Active row — macro, DPR 6 (the bleed hero) ---------- */
{
  const page = await newPage(900, 800, 6);
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const r = await page.evaluate(() => {
    const a = [...document.querySelectorAll("aside a.step")].find((n) => !n.className.includes("step-dim"));
    const b = a.getBoundingClientRect();
    return { y: b.y, h: b.height };
  });
  await page.screenshot({ path: `${SRC}/active-row.png`, clip: { x: 4, y: r.y - 102, width: 258, height: 238 } });
  await page.close();
}

/* ---------- C. Reader content column — DPR 3 ---------- */
{
  const page = await newPage(1440, 1000, 3);
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const r = await page.evaluate(() => {
    const col = document.querySelector(".font-content");
    const b = col.getBoundingClientRect();
    return { x: b.x, y: b.y };
  });
  await page.screenshot({ path: `${SRC}/reader.png`, clip: { x: r.x - 44, y: r.y - 52, width: 1000, height: 900 } });
  await page.close();
}

/* ---------- D. On this page — macro, DPR 6 ---------- */
{
  const page = await newPage(1440, 1000, 6);
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const nav = page.locator('nav:has-text("On this page")').first();
  const bb = await nav.boundingBox();
  await page.screenshot({ path: `${SRC}/toc.png`, clip: { x: bb.x - 20, y: bb.y - 18, width: 300, height: 300 } });
  await page.close();
}

/* ---------- E. Command palette — DPR 4 (modal card) ---------- */
{
  const page = await newPage(1440, 1000, 4);
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  const input = page.locator('input[placeholder^="Search courses"]');
  await input.fill("elast");
  await page.waitForTimeout(300);
  await input.fill(""); // show the full grouped list — reads better than one result
  await page.waitForTimeout(300);
  const modal = input.locator('xpath=ancestor::div[contains(@class,"rounded-xl")][1]');
  await modal.screenshot({ path: `${SRC}/command.png` });
  await page.close();
}

/* ---------- F. Code playground — DPR 4 (run it first) ---------- */
{
  const page = await newPage(1200, 1200, 4);
  await page.goto(BASE + INTRO, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  // Jump to the playground section and run the JS so output shows.
  await page.evaluate(() => document.getElementById("try-it")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(500);
  const runBtn = page.locator("button", { hasText: /^Run$/ }).first();
  if (await runBtn.count()) { await runBtn.click(); await page.waitForTimeout(900); }
  const panel = page.locator('textarea[aria-label="Code editor"]').locator('xpath=ancestor::div[contains(@class,"rounded-2xl")][1]');
  await panel.screenshot({ path: `${SRC}/playground.png` });
  await page.close();
}

/* ---------- G. Breadcrumb / top bar — macro, DPR 6 ---------- */
{
  const page = await newPage(1440, 400, 6);
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${SRC}/breadcrumb.png`, clip: { x: 8, y: 8, width: 900, height: 64 } });
  await page.close();
}

/* ---------- H. Full window — DPR 3 (cover / context) ---------- */
{
  const page = await newPage(1440, 900, 3);
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${SRC}/window.png` });
  await page.close();
}

await browser.close();
console.log("captured:", fs.readdirSync(SRC).join(", "));
