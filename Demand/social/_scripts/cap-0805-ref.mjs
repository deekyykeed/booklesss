/* Reference frames for 2026-08-05 — whole screens, shot to be LOOKED AT.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0805-ref.mjs
 *
 * Nothing here is posted. Choosing a subject off the source tree kept picking
 * components that photograph badly (a 34px bar is a sliver in an 1100 stage) or
 * cannot be photographed at all (a source chip whose site is called Corporate
 * Finance Institute). Shooting the screens first and choosing off the pictures
 * is cheaper than rendering a carousel to find out.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, transform } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
const out = (n) => path.join(DIR, n);

const identity = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  school: "other",
  schoolName: "A university",
  courses: ["economics", "treasury-management"],
  coursesChosen: true,
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
});

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 402, height: 900 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await ctx.addInitScript((id) => {
  try {
    localStorage.setItem("booklesss:identity:v1", id);
  } catch {}
}, identity);

const page = await ctx.newPage();

const prep = async () => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
  await page.evaluate(transform, { map: MAP, reader: null, deep: true });
};

const go = async (url, ready) => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.waitForTimeout(1200);
  await prep();
};

const shot = async (name) => {
  await prep();
  await page.screenshot({ path: out(name), fullPage: true });
  console.log("  " + name);
};

/* The right drawer is a swipe on a phone — no button since 1 Aug. */
const openContext = async () => {
  const cdp = await page.context().newCDPSession(page);
  const y = 300;
  const send = (type, x) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
  await send("touchStart", 360);
  await send("touchMove", 320);
  await send("touchMove", 180);
  await send("touchEnd", 180);
  await page.waitForTimeout(800);
};

console.log("references ->", DIR);

/* The course home — the page between the dashboard and a step. */
await go("/economics", "main");
await shot("ref-course.png");

/* A step whose sections are the generic set, in the one course whose whole
 * tree is mapped. */
await go("/microeconomics/supply-demand/law-of-demand", ".checkpoint-row");
await shot("ref-step1.png");

/* Everything the right drawer holds, in one frame. */
await openContext();
await page.screenshot({ path: out("ref-drawer.png") });
console.log("  ref-drawer.png");

/* And the left one — the course tree. */
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
{
  const cdp = await page.context().newCDPSession(page);
  const y = 300;
  const send = (type, x) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
  await send("touchStart", 40);
  await send("touchMove", 90);
  await send("touchMove", 260);
  await send("touchEnd", 260);
  await page.waitForTimeout(800);
}
await page.screenshot({ path: out("ref-nav.png") });
console.log("  ref-nav.png");

await browser.close();
console.log("done");
