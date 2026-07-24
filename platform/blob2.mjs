import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
await page.goto("http://localhost:3000/getting-started/what-is-economics", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
console.log("blob count:", await page.evaluate(() => document.querySelectorAll(".bg-waves span").length));

// real-time sampling: how much changes per second at natural speed?
const shot = async (n) => { await page.screenshot({ path: `s${n}.png` }); };
await shot(0);
await page.waitForTimeout(1000); await shot(1);
await page.waitForTimeout(2000); await shot(3);
await page.waitForTimeout(3000); await shot(6);
await browser.close();
