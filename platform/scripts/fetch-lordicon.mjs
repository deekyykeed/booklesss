/* Pull a Lordicon icon's Lottie straight into public/reader/icons.
 *
 *   node scripts/fetch-lordicon.mjs emoji-smile doodle color grasp-got
 *   node scripts/fetch-lordicon.mjs --find smile          # search the library
 *
 * HOW THIS WORKS, because it is not documented anywhere and took some finding.
 *
 * Lordicon's site is client-rendered, so the icon page HTML carries no icon
 * data and no CDN URL — the artwork looks account-gated and the obvious
 * conclusion is that you must click Export by hand. You do not. There are two
 * public endpoints and the join between them is one field:
 *
 *   1. https://lordicon.com/api/library/icons
 *      The whole catalogue, ~2.6MB, no auth. Every row is
 *        { id, index, name, title, family, style, premium, key }
 *      `name` is the icon ("emoji-smile"), and the SAME name exists once per
 *      family × style — wired/outline, doodle/color, and so on — each with its
 *      own `key`. That is why family and style are arguments here rather than
 *      guesses.
 *
 *   2. https://cdn.lordicon.com/<key>.json
 *      The Lottie itself, no auth. `key` is that opaque eight-letter string,
 *      which is why the CDN cannot be addressed by name: `emoji-smile.json`
 *      is a 404 and always will be.
 *
 * The catalogue is fetched fresh rather than cached, because a `key` is
 * Lordicon's to change and a stale one fails as a 404 rather than as anything
 * informative.
 *
 * ⚠️ `premium: true` icons are NOT free, and this script refuses them rather
 * than fetching something the licence does not cover. The two checkpoint faces
 * are both `premium: false`. Attribution may still be owed on the free tier —
 * see the licence note in src/components/icons/lordicon.tsx, still unsettled.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICONS = join(dirname(fileURLToPath(import.meta.url)), "../public/reader/icons");
const LIBRARY = "https://lordicon.com/api/library/icons";
const CDN = (key) => `https://cdn.lordicon.com/${key}.json`;

async function library() {
  const r = await fetch(LIBRARY, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`library → ${r.status}`);
  const { icons } = await r.json();
  if (!icons?.length) throw new Error("library returned no icons");
  return icons;
}

const args = process.argv.slice(2);

if (args[0] === "--find") {
  const q = (args[1] ?? "").toLowerCase();
  if (!q) {
    console.error("usage: fetch-lordicon.mjs --find <text>");
    process.exit(1);
  }
  const hits = (await library()).filter(
    (i) => i.name.includes(q) || (i.title ?? "").toLowerCase().includes(q),
  );
  if (!hits.length) {
    console.log(`nothing matching "${q}"`);
    process.exit(0);
  }
  console.log(`${hits.length} match(es) for "${q}" — name / family / style / free?\n`);
  for (const i of hits.slice(0, 60))
    console.log(
      `  ${i.name.padEnd(22)} ${i.family.padEnd(10)} ${(i.style ?? "").padEnd(9)} ` +
        `${i.premium ? "PRO" : "free"}   "${i.title}"`,
    );
  if (hits.length > 60) console.log(`  …and ${hits.length - 60} more`);
  process.exit(0);
}

const [name, family, style, out] = args;
if (!name || !family || !style) {
  console.error("usage: fetch-lordicon.mjs <name> <family> <style> [output-stem]");
  console.error("       fetch-lordicon.mjs --find <text>");
  console.error("\ne.g.   fetch-lordicon.mjs emoji-smile doodle color grasp-got");
  process.exit(1);
}

const icons = await library();
const hit = icons.find((i) => i.name === name && i.family === family && i.style === style);

if (!hit) {
  const near = icons.filter((i) => i.name === name);
  console.error(`no icon "${name}" in ${family}/${style}.`);
  if (near.length) {
    console.error("that name exists in:");
    for (const i of near) console.error(`  ${i.family}/${i.style}${i.premium ? "  (PRO)" : ""}`);
  } else {
    console.error(`try: node scripts/fetch-lordicon.mjs --find ${name.split("-")[0]}`);
  }
  process.exit(1);
}

if (hit.premium) {
  console.error(`"${name}" (${family}/${style}) is a PRO icon — not fetching it.`);
  console.error("Pick a free one, or download it through your account if the plan covers it.");
  process.exit(1);
}

const r = await fetch(CDN(hit.key));
if (!r.ok) {
  console.error(`cdn ${hit.key} → ${r.status}. The key may have changed; re-run to refetch.`);
  process.exit(1);
}
const body = await r.text();
/* Parsed, not just written: a 200 carrying an HTML error page would otherwise
   land on disk as a .json and fail much later, inside the reader. */
let lottie;
try {
  lottie = JSON.parse(body);
} catch {
  console.error(`cdn ${hit.key} returned ${body.length} bytes that are not JSON`);
  process.exit(1);
}

const stem = out ?? `${family}-${style}-${name}`;
mkdirSync(ICONS, { recursive: true });
writeFileSync(join(ICONS, `${stem}.json`), body);

console.log(`${stem}.json  ←  ${name} (${family}/${style}, key ${hit.key})`);
console.log(`  ${lottie.nm ?? "?"} · ${lottie.w}×${lottie.h} · ${Math.round(body.length / 1024)}KB`);
console.log(`\nnow: node scripts/lord-states.mjs   — to see which states it carries`);
