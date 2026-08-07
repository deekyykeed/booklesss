/* Recon for 2026-08-07 — full-page frames of the surfaces that moved today,
 * so the subjects get PICKED off pictures rather than off commit messages.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0807-ref.mjs
 *
 * Not a post. Writes into _source/ref-0807/ and nothing here is rendered.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, transform } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "ref-0807");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

const tree = JSON.parse(fs.readFileSync(path.join(PLATFORM, "src/lib/course-data.json"), "utf8"));
const lessons = [];
(function walk(nodes) {
  for (const n of nodes) {
    if (n.lesson) lessons.push({ id: n.id, sections: n.lesson.sections.map((s) => s.id) });
    if (n.children) walk(n.children);
  }
})(tree);
const byId = (id) => lessons.find((l) => l.id === id);

const iso = (d) => d.toLocaleDateString("en-CA");
const ago = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};
const full = (ids) => {
  const done = {};
  for (const id of ids) {
    const l = byId(id);
    if (l) done[l.id] = l.sections;
  }
  return done;
};
const part = (ids) => {
  const done = {};
  for (const id of ids) {
    const l = byId(id);
    if (l) done[l.id] = l.sections.slice(0, Math.max(1, l.sections.length - 1));
  }
  return done;
};
const day = (mins, course = "economics") => ({
  checks: mins > 30 ? 2 : mins > 12 ? 1 : 0,
  steps: mins > 40 ? 1 : 0,
  secs: mins * 60,
  courses: { [course]: mins * 60 },
  courseChecks: { [course]: mins > 30 ? 2 : mins > 12 ? 1 : 0 },
});

/* A student on a real programme, so the Pipeline tab has something in it: the
 * live course plus five the programme teaches and nobody has written. */
const IDENTITY = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  school: "zcas",
  schoolName: "A university",
  programme: "bachelor-of-accounting",
  year: 2,
  courses: [
    "economics",
    "corporate-finance",
    "business-information-systems",
    "human-resource-management-and-development",
    "decision-making-techniques",
    "taxation",
  ],
  coursesChosen: true,
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
});

const done = { ...part(["econ-scarcity"]), ...full(["econ-opportunity-cost", "econ-demand"]) };
const SEED = JSON.stringify({
  done,
  ratings: {},
  days: {
    [ago(0)]: day(28),
    [ago(1)]: day(45),
    [ago(2)]: day(0),
    [ago(3)]: day(0),
    [ago(4)]: day(36),
    [ago(5)]: day(22),
    [ago(6)]: day(15),
  },
});

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 402, height: 1400 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await ctx.addInitScript(
  ([id, sd]) => {
    try {
      localStorage.setItem("booklesss:identity:v1", id);
      localStorage.setItem("booklesss:progress:v6", sd);
      localStorage.removeItem("booklesss-offline-card-dismissed");
    } catch {}
    Math.random = () => 0.42;
  },
  [IDENTITY, SEED],
);
const page = await ctx.newPage();

const strip = async () => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
  await page.evaluate(transform, { map: MAP, reader: null, deep: true });
};

const shot = async (url, ready, name) => {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector(ready, { timeout: 120000 });
  await page.waitForTimeout(1800);
  try {
    await strip();
  } catch {
    await page.waitForTimeout(1500);
    await strip();
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await strip();
  await page.screenshot({ path: out(name), fullPage: true });
  console.log("  " + name);
};

await shot("/dashboard", "main", "dash-active.png");

/* The two tabs that only exist as of today. */
for (const [label, name] of [
  ["Pipeline", "dash-pipeline.png"],
  ["Completed", "dash-completed.png"],
]) {
  const tab = page.locator(`button:has-text("${label}")`).first();
  if (await tab.count()) {
    await tab.click();
    await page.waitForTimeout(900);
    await strip();
    await page.screenshot({ path: out(name), fullPage: true });
    console.log("  " + name);
  } else {
    console.log("  !! no tab labelled " + label);
  }
}

await shot("/microeconomics/supply-demand/law-of-demand", "h1", "step.png");

/* What the checkpoint row and its menu actually look like now. */
const noteBtn = page.locator(".checkpoint-row button").first();
if (await noteBtn.count()) {
  await noteBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await strip();
  await noteBtn.click();
  await page.waitForTimeout(500);
  await strip();
  await page.screenshot({ path: out("note-menu.png") });
  console.log("  note-menu.png");
}

console.log("\ncss sizes ->");
for (const sel of [".grasp-group", ".checkpoint-row", ".course-card", "[role=tablist]"]) {
  const box = await page
    .locator(sel)
    .first()
    .boundingBox()
    .catch(() => null);
  console.log("  " + sel.padEnd(18), box ? `${Math.round(box.width)}x${Math.round(box.height)}` : "— not found");
}

await browser.close();
