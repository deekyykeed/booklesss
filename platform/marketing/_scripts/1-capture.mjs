/* Step 1 — grab the raw crops the posters are built from.
 * Writes marketing/_source/{sidebar,window,detail}.png */
import fs from "fs";
import path from "path";
import { chromium, BASE, LESSON, SOURCE } from "./paths.mjs";

fs.mkdirSync(SOURCE, { recursive: true });
const out = (n) => path.join(SOURCE, n);

const browser = await chromium.launch();

/* ---------- 1. Sidebar panel (tall) ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 3 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  // Open a couple more folders so the tree reads as a real curriculum.
  for (const label of ["Elasticity", "Consumer choice"]) {
    const btn = page.locator("aside button", { hasText: label }).first();
    if (await btn.count()) { await btn.click(); await page.waitForTimeout(420); }
  }
  await page.mouse.move(1200, 900); // park the pointer off the nav — no stray hover
  await page.waitForTimeout(600);

  const box = await page.evaluate(() => {
    const r = document.querySelector("aside nav > div").getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  });
  // 264 wide: the sidebar, stopping just short of the content card's edge.
  await page.screenshot({
    path: out("sidebar.png"),
    clip: { x: 0, y: box.top - 14, width: 264, height: box.bottom - box.top + 28 },
  });
  await page.close();
}

/* ---------- 2. Full app window ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: out("window.png") });
  await page.close();
}

/* ---------- 3. Macro detail: the active row, its rail and its bar ---------- */
{
  // Small viewport, very high DPR: this crop gets blown up to the full poster
  // width, so it needs the extra source pixels to stay sharp.
  const page = await browser.newPage({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 6 });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const a = [...document.querySelectorAll("aside a")].find((n) => n.textContent.includes("The law of demand"));
    const b = a.getBoundingClientRect();
    return { y: b.y };
  });
  // Height lands the bottom edge on a row boundary so nothing is sliced in half.
  await page.screenshot({
    path: out("detail.png"),
    clip: { x: 4, y: r.y - 102, width: 258, height: 238 },
  });
  await page.close();
}

await browser.close();
console.log("captured ->", SOURCE);
