/* Crops of the surfaces the older scripts never had: the right STEP panel and
 * the AI composer that lives at the bottom of it — including voice mode lit up.
 *
 *   cd platform && npm run build && npx next start -p 3100
 *   node _scripts/7-ai-crops.mjs
 *
 * Writes to _source/carousel-crops/. Everything is relabelled through
 * neutralize.mjs first, same as 4b — the posts are about Booklesss holding
 * every subject, not about the one course that's seeded today.
 *
 * Voice mode: the glow is driven by live mic loudness (--voice on the composer
 * form). Headless has no mic, so after switching voice mode ON for real — the
 * button, the bold icon, the "Voice mode on" hint are all genuine app state —
 * we write a loudness value by hand so the still shows what a speaking frame
 * actually looks like. Colours are the app's own palette, not invented.
 */
import fs from "fs";
import path from "path";
import { chromium, BASE, CROPS, LESSON } from "./paths.mjs";
import { MAP, READER, transform } from "./neutralize.mjs";

const SRC = CROPS;
fs.mkdirSync(SRC, { recursive: true });
const launch = process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {};

const browser = await chromium.launch(launch);

/* Fresh page at the lesson, already neutralised. */
async function reader(w, h, dpr) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await page.goto(BASE + LESSON, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.evaluate(transform, { map: MAP, reader: READER });
  await page.waitForTimeout(200);
  return page;
}

const COMPOSER = "form.voice-host";
const PANEL = "aside.rightbar-panel";

/* A. the whole STEP panel — contents on top, a question you asked, composer
 *    pinned at the bottom. Short viewport so the panel isn't mostly dead space
 *    between the thread and the composer. DPR 4. */
{
  const page = await reader(1440, 660, 4);
  await page.locator(`${COMPOSER} textarea`).fill("Can you explain this in simpler words?");
  await page.locator(`${COMPOSER} button[type="submit"]`).click();
  await page.waitForTimeout(400);
  await page.locator(PANEL).screenshot({ path: `${SRC}/step-panel.png` });
  await page.close();
}

/* B. the composer at rest — placeholder, mic + send, "AI tutor — coming soon".
 *    Very high DPR: the card is ~305 CSS px wide but a slide blows it up to
 *    ~1500, so the capture has to carry the pixels. */
{
  const page = await reader(1440, 900, 10);
  const box = await page.locator(COMPOSER).boundingBox();
  await page.screenshot({
    path: `${SRC}/composer-rest.png`,
    clip: { x: box.x - 6, y: box.y - 6, width: box.width + 12, height: box.height + 12 },
  });
  await page.close();
}

/* C. voice mode, lit. Toggle it for real, then write a speaking-loudness value
 *    (the mic is what normally writes it) so the glow is in frame. */
{
  const page = await reader(1440, 900, 14);
  await page.locator(`${COMPOSER} button[aria-label="Turn on voice mode"]`).click();
  await page.waitForTimeout(500);
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    el.style.setProperty("--von", "1");
    el.style.setProperty("--voice", "0.78"); // mid-sentence
  }, COMPOSER);
  await page.waitForTimeout(300);
  const box = await page.locator(COMPOSER).boundingBox();
  await page.screenshot({
    path: `${SRC}/composer-voice.png`,
    // from the card's own left edge — a couple of px further left picks up the
    // panel border and reads as a stray line in the crop
    clip: { x: box.x + 2, y: box.y - 14, width: box.width - 2, height: box.height + 28 },
  });
  await page.close();
}

/* D. the top bar — breadcrumb, search pill, the row of controls. DPR 6. */
{
  const page = await reader(1440, 900, 6);
  await page.screenshot({ path: `${SRC}/topbar.png`, clip: { x: 0, y: 0, width: 1440, height: 48 } });
  await page.close();
}

await browser.close();
const png = (p) => { const b = fs.readFileSync(p); return b.readUInt32BE(16) + "x" + b.readUInt32BE(20); };
console.log(
  "step-panel", png(`${SRC}/step-panel.png`),
  "| composer-rest", png(`${SRC}/composer-rest.png`),
  "| composer-voice", png(`${SRC}/composer-voice.png`),
  "| topbar", png(`${SRC}/topbar.png`),
);
