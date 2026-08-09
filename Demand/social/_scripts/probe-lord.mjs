import { chromium } from "./paths.mjs";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 402, height: 1100 }, isMobile: true, hasTouch: true });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto("https://booklesss.vercel.app/microeconomics/supply-demand/law-of-demand", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".grasp-group");
await page.waitForTimeout(3500);
const info = await page.evaluate(() => {
  const marks = [...document.querySelectorAll(".grasp-mark")];
  return marks.map((m) => {
    const r = m.getBoundingClientRect();
    const inner = m.innerHTML.slice(0, 220);
    const svg = m.querySelector("svg");
    const sr = svg?.getBoundingClientRect();
    return { w: r.width, h: r.height, svg: !!svg, svgW: sr?.width, svgH: sr?.height, inner };
  });
});
console.log(JSON.stringify(info, null, 1));
console.log("errors:", errors.slice(0, 6));
await browser.close();
