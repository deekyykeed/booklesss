/* One-off capture for the "just shipped" progress post: the AI tutor composer +
 * voice mode, shot from the real app's MOBILE layout (per house rule).
 *   node _scripts/cap-feature.mjs           # needs the dev server on :3100
 * Writes _source/feature-capture/*.png. Mic is intentionally NOT granted, so the
 * component's loudness loop never runs and we can inject --voice for a lit glow. */
import { chromium, BASE, LESSON, SOURCE } from "./paths.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 402, height: 874 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  // no 'microphone' permission on purpose — getUserMedia rejects, loudness loop
  // never starts, so an injected --voice sticks for the screenshot.
});
const page = await ctx.newPage();
await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
await page.waitForTimeout(900);

// strip the Next.js dev-tools badge (a dev-only artifact) before every full shot
const killBadge = async () => {
  const found = await page.evaluate(() => {
    const hit = [];
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      const a = el.attributes;
      const isBadge =
        t.includes("next") ||
        (el.id || "").toLowerCase().includes("next") ||
        (a && (a["data-next-badge-root"] || a["data-next-badge"] || a["data-nextjs-dev-tools-button"] || a["data-nextjs-toast"]));
      if (isBadge) { hit.push(t + (el.id ? "#" + el.id : "")); el.remove(); }
    });
    return hit;
  });
  if (found.length) console.log("  removed badge:", found.join(", "));
};
await killBadge();

// A: the reader as it opens on a phone (context)
await page.screenshot({ path: out("01-reader.png") });

// open the right (step context) drawer — the composer lives at its bottom
await page.click('button[aria-label="Open step context"]');
await page.waitForTimeout(650);
await killBadge();
await page.screenshot({ path: out("02-drawer.png") });
// bottom band — composer + glow in context, framed to bleed off a 9:16 frame
await page.screenshot({ path: out("06-band-rest.png"), clip: { x: 0, y: 380, width: 402, height: 494 } });

const composer = page.locator("form.voice-host");
await composer.screenshot({ path: out("03-composer.png") });

// typed state — send lights up
await page.fill("form.voice-host textarea", "Explain the law of demand with a local example");
await page.waitForTimeout(450);
await composer.screenshot({ path: out("04-typed.png") });
await killBadge();
await page.screenshot({ path: out("04b-typed-full.png") });

// clear, then voice mode on + inject a "speaking" loudness so the glow shows
await page.fill("form.voice-host textarea", "");
await page.click('button[aria-label="Turn on voice mode"]');
await page.waitForTimeout(400);
await page.$eval("form.voice-host", (el) => {
  el.style.setProperty("--von", "1");
  el.style.setProperty("--voice", "0.9");
});
await page.waitForTimeout(500);
await composer.screenshot({ path: out("05-voice-composer.png") });
await killBadge();
await page.screenshot({ path: out("05b-voice-full.png") });
await page.screenshot({ path: out("07-band-voice.png"), clip: { x: 0, y: 380, width: 402, height: 494 } });

await browser.close();
console.log("captured ->", DIR);
