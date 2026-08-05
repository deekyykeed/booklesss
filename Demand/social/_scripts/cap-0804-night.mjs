/* Capture for the 2026-08-04 NIGHT slot — the offline card, at four states.
 *
 *   BASE_URL=http://localhost:3101 node _scripts/cap-0804-night.mjs
 *
 * REPLACES a set of logo plates. Three of the day's five slots were plates and
 * the owner's verdict on the last one was to do something else — so the night
 * post is a product component again, and the one the app owns that matters
 * most to the student it is for: **"Study without data."** Save every lesson
 * to the phone and read them with no connection, for well under a megabyte.
 *
 *   of-offer   the card as it arrives — the offer and its two buttons
 *   of-saving  mid-save, counting the pages it is putting on the device
 *   of-saved   afterwards: saved on this date, they open with no connection
 *   of-ios     on an iPhone, where installing has to be explained not offered
 *
 * FOUR STATES OF ONE COMPONENT, and every one of them is the component's own
 * — `savedAt` from localStorage, the progress count from the service worker's
 * own messages, the iPhone wording from the same `isIos()` branch a student on
 * Safari gets. Nothing is typed into the DOM.
 *
 * THIS ONE NEEDS A PRODUCTION BUILD, and that is not a preference:
 * `RegisterSW` unregisters the worker on anything but production (dev rewrites
 * the chunks behind the cached URLs), and with no active worker `supported` is
 * false and the card returns null. So:
 *
 *   cd C:/bkls-shot/platform && npm run build && npx next start -p 3101
 *
 * The saving shot runs over a throttled connection — 400kb/s, 400ms latency —
 * which is both how the count is caught mid-flight and the connection the
 * feature exists for. The numbers on screen are the real save.
 */
import { chromium, BASE, SOURCE, PLATFORM } from "./paths.mjs";
import { MAP, BANNED, transform, scan } from "./neutralize.mjs";
import fs from "fs";
import path from "path";

const DIR = path.join(SOURCE, "feature-capture");
fs.mkdirSync(DIR, { recursive: true });
const out = (n) => path.join(DIR, n);

const identity = JSON.stringify({
  name: "Chanda",
  avatar: "astronaut",
  school: "other",
  schoolName: "A university",
  courses: ["economics"],
  coursesChosen: true,
  id: "capture-device",
  since: "2026-07-04T09:00:00.000Z",
});

const browser = await chromium.launch();

/* `saved` writes the stamp the card reads back — the same key the component
 * writes when a save finishes, so the "saved" state is the app's own, not a
 * sentence pasted over it. */
const ctxFor = async ({ saved = null, ios = false } = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: 900 },
    deviceScaleFactor: 8,
    isMobile: true,
    hasTouch: true,
    ...(ios
      ? {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
        }
      : {}),
  });
  await ctx.addInitScript(
    ([id, st]) => {
      try {
        localStorage.setItem("booklesss:identity:v1", id);
        localStorage.removeItem("booklesss-offline-card-dismissed");
        if (st) localStorage.setItem("booklesss-lessons-saved", st);
        else localStorage.removeItem("booklesss-lessons-saved");
      } catch {}
    },
    [identity, saved],
  );
  return ctx;
};

let page;

const prep = async () => {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const t = el.tagName.toLowerCase();
      if (t.includes("next") || (el.id || "").toLowerCase().includes("next")) el.remove();
    });
  });
  await page.evaluate(transform, { map: MAP, reader: null, deep: true });
};

/* The card only exists once the worker is active — see the header. Waiting for
 * the selector alone would time out on a dev server with a useful message
 * hiding behind an unhelpful one. */
const openDashboard = async () => {
  await page.goto(BASE + "/dashboard", { waitUntil: "load", timeout: 120000 });
  await page.waitForSelector("main", { timeout: 120000 });
  const ok = await page
    .waitForSelector(".dash-offline", { timeout: 30000 })
    .then(() => true)
    .catch(() => false);
  if (!ok)
    throw new Error(
      "no .dash-offline — the service worker is not active. This capture needs a PRODUCTION server (npm run build && next start), not next dev.",
    );
  await page.waitForTimeout(600);
  await prep();
};

/* `expect` is a regex the component's own text must still match at the moment
 * the shutter opens. A state that ends by itself — the save counting up — can
 * finish between the wait and the screenshot, and the file lands under a name
 * describing a state that is no longer on screen. Same failure as picking an
 * answered checkpoint by index: it looks deliberate and it is wrong. */
const isolate = async (name, sel, { pad = 16, expect = null } = {}) => {
  await prep();
  await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await prep();

  const box = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) throw new Error("no element for " + s);
    el.setAttribute("data-iso", "");
    const style = document.createElement("style");
    style.id = "iso-style";
    style.textContent =
      "html,body{background:transparent !important}" +
      "body *{visibility:hidden !important}" +
      "[data-iso],[data-iso] *{visibility:visible !important}";
    document.head.appendChild(style);
    window.__undoIsolate = () => {
      document.getElementById("iso-style")?.remove();
      document.querySelectorAll("[data-iso]").forEach((n) => n.removeAttribute("data-iso"));
    };
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, sel);

  const leaked = await page.evaluate(scan, { banned: BANNED, clip: box, pageSpace: false });
  if (leaked.length) {
    await page.evaluate(() => window.__undoIsolate?.());
    throw new Error(`${name}: banned words inside the component — ${leaked.join(", ")}.`);
  }

  if (expect) {
    const text = await page.evaluate(
      (s) => (document.querySelector(s)?.textContent || "").replace(/\s+/g, " ").trim(),
      sel,
    );
    if (!expect.test(text)) {
      await page.evaluate(() => window.__undoIsolate?.());
      throw new Error(`${name}: the state is gone — expected ${expect} but the card reads "${text}".`);
    }
  }

  await page.screenshot({
    path: out(name),
    omitBackground: true,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: box.width + pad * 2,
      height: box.height + pad * 2,
    },
  });
  await page.evaluate(() => window.__undoIsolate?.());
  console.log(`  ${name}  (${Math.round(box.width)}x${Math.round(box.height)} css)`);
};

console.log("capturing ->", DIR);

/* 1 — the offer, untouched. */
{
  const ctx = await ctxFor();
  page = await ctx.newPage();
  await openDashboard();
  await isolate("of-offer.png", ".dash-offline", { expect: /Save all lessons/ });
  await ctx.close();
}

/* 2 — mid-save, over a slow connection.
 *
 * The count comes from the worker as it puts each page on the device, so it
 * only exists while a real save is running. Throttling is what makes it
 * legible — and it is the connection this feature was built for. */
{
  const ctx = await ctxFor();
  page = await ctx.newPage();
  await openDashboard();
  /* SLOWED AT THE CONTEXT, NOT WITH `Network.emulateNetworkConditions`.
   * CDP throttling applies to the PAGE's network target; the save runs in the
   * service worker, which has its own — so the whole save finished before the
   * shutter and the file landed showing the SAVED state under the name
   * `of-saving`. A context route does catch the worker's fetches. 600ms each
   * is a slow connection, which is the one this feature exists for. */
  await ctx.route("**/*", async (route) => {
    await new Promise((r) => setTimeout(r, 600));
    await route.continue();
  });
  /* Everything slow — the scroll, the relabel — done BEFORE the click, so the
   * only thing between the state appearing and the screenshot is the clip. */
  await page.locator(".dash-offline").first().scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Save all lessons" }).click();
  /* Every button in the card, not the first one: the first is the × that
   * hides it, so a `querySelector` here waits forever on the wrong element. */
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".dash-offline button")].some((b) =>
        /Saving \d+ of \d+/.test(b.textContent || ""),
      ),
    null,
    { timeout: 60000 },
  );
  /* Let the count get off zero — "Saving 0 of 31" reads as stuck. */
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".dash-offline button")].some((b) =>
        /Saving [1-9]\d* of \d+/.test(b.textContent || ""),
      ),
    null,
    { timeout: 60000 },
  );
  await isolate("of-saving.png", ".dash-offline", { expect: /Saving \d+ of \d+/ });
  await ctx.close();
}

/* 3 — afterwards. The stamp is the one the component itself writes. */
{
  const ctx = await ctxFor({ saved: new Date().toLocaleDateString("en-GB") });
  page = await ctx.newPage();
  await openDashboard();
  await isolate("of-saved.png", ".dash-offline", { expect: /were saved to this device/ });
  await ctx.close();
}

/* 4 — the same card on an iPhone, where Safari has no install API and the only
 * honest thing the app can do is give directions. Opened, so the slide carries
 * the directions rather than a button that looks like the Android one. */
{
  const ctx = await ctxFor({ ios: true });
  page = await ctx.newPage();
  await openDashboard();
  await page.getByRole("button", { name: "Add to home screen" }).click();
  await page.waitForTimeout(400);
  await isolate("of-ios.png", ".dash-offline", { expect: /Add to Home Screen/ });
  await ctx.close();
}

await browser.close();
console.log("done");
