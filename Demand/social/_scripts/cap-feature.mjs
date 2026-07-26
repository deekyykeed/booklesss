/* Capture for the build-in-public progress posts, from the real app's MOBILE
 * layout. Full-bleed crops (no boxes): drawer-only clips so the composer + glow
 * fill the frame with no white content sliver.
 *   node _scripts/cap-feature.mjs           # needs the dev server on :3100
 * Writes _source/feature-capture/*.png. Mic is NOT granted, so the loudness loop
 * never runs and we inject --voice for a lit glow. */
import { chromium, BASE, LESSON, SOURCE } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

// the right (step context) drawer occupies x:62..402 at this width — clipping to
// it drops the reader sliver so the composer + glow fill the crop edge to edge.
// 340x604 is exactly 9:16, zoomed onto the composer + the glow just above it.
const DRAWER = { x: 62, y: 270, width: 340, height: 604 };

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 402, height: 874 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

const killBadge = async () => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
};
await killBadge();

/* ---------- evening: reading + navigation ---------- */
// the reading view (scroll into the body so it's real content, not just the title)
await page.evaluate(() => window.scrollTo(0, 260));
await page.waitForTimeout(400);
await killBadge();
await page.screenshot({ path: out("ev-reader.png") });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

// left drawer — the course navigation tree
await page.click('button[aria-label="Open navigation"]');
await page.waitForTimeout(650);
await killBadge();
await page.screenshot({ path: out("ev-nav.png") });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

/* ---------- afternoon: the AI composer ---------- */
await page.click('button[aria-label="Open step context"]');
await page.waitForTimeout(650);
await killBadge();
// 9:16 crop of the phone bottom: composer in context (reader sliver + drawer)
await page.screenshot({ path: out("af-page.png"), clip: { x: 0, y: 159, width: 402, height: 715 } });

// typing demo — a real question in the field
await page.fill("form.voice-host textarea", "Explain the law of demand with a Zambian example");
await page.waitForTimeout(450);
await killBadge();
await page.screenshot({ path: out("af-typed.png"), clip: DRAWER });

// voice mode on, with an injected "speaking" loudness so the glow lights up
await page.fill("form.voice-host textarea", "");
await page.click('button[aria-label="Turn on voice mode"]');
await page.waitForTimeout(400);
// push --voice past 1 so the ambient glow reads vividly in a still (the live app
// glow is intentionally gentle; a marketing still needs it stronger to fill).
await page.$eval("form.voice-host", (el) => {
  el.style.setProperty("--von", "1");
  el.style.setProperty("--voice", "1.9");
});
await page.waitForTimeout(500);
await killBadge();
await page.screenshot({ path: out("af-voice.png"), clip: DRAWER });

await browser.close();
console.log("captured ->", DIR);
