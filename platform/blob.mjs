import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
await page.goto("http://localhost:3000/getting-started/what-is-economics", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const n = await page.evaluate(() => document.querySelectorAll(".bg-waves span").length);
console.log("blob count:", n);
// sample 5 points across one 34s cycle by shifting animation-delay
for (const d of [0, 8, 17, 25, 33]) {
  await page.addStyleTag({ content: `.bg-waves span{animation-play-state:paused !important;animation-delay:-${d}s !important}` });
  await page.waitForTimeout(350);
  await page.screenshot({ path: `b${d}.png` });
}
await browser.close();
