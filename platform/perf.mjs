import { chromium } from "playwright";
const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1600, height: 950 } });
p.setDefaultTimeout(25000);
await p.goto("http://localhost:3000/macroeconomics/measuring/gdp", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(2500);

// logo + background check
const look = await p.evaluate(() => {
  const svg = document.querySelector("header svg");
  const waves = getComputedStyle(document.querySelector(".bg-waves")).backgroundColor;
  const canvas = getComputedStyle(document.documentElement).getPropertyValue("--color-canvas").trim();
  return { logoIsSvg: !!svg, logoStroke: svg?.querySelector("path")?.getAttribute("stroke"),
           wavesBg: waves, canvasToken: canvas,
           burbankLoaded: [...document.fonts].some(f=>/burbank/i.test(f.family)) };
});
console.log("LOOK:", JSON.stringify(look));

// --- frame-rate of the background animation (the smoothness question) ---
const fps = await p.evaluate(() => new Promise(res => {
  let frames = 0; const t0 = performance.now();
  const tick = () => { frames++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick);
    else res(Math.round(frames / ((performance.now() - t0) / 1000))); };
  requestAnimationFrame(tick);
}));
console.log("FPS with blobs + backdrop-filter rails:", fps);

// --- how many compositor-heavy elements ---
const cost = await p.evaluate(() => ({
  blobs: document.querySelectorAll(".bg-waves span").length,
  backdropFilterEls: [...document.querySelectorAll("*")].filter(e => {
    const v = getComputedStyle(e).backdropFilter; return v && v !== "none"; }).length,
  willChangeEls: [...document.querySelectorAll("*")].filter(e => getComputedStyle(e).willChange === "transform").length,
}));
console.log("COST:", JSON.stringify(cost));
await b.close(); process.exit(0);
