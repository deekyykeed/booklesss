/* Inlines a favicon for every site the course links out to.
 *
 *   node scripts/gen-favicons.mjs        (npm run gen:favicons)
 *
 * Source links are marked `[phrase](https://host/…)` in a step's prose (rule
 * C-7) and rendered with the site's mark beside them, so a reader can see at a
 * glance how much of a step is backed by somewhere that teaches this for a
 * living. The mark has to be a real logo — a generic globe says nothing.
 *
 * Why generated rather than fetched in the browser: the app ships
 * `default-src 'self'`, so a remote favicon URL is blocked outright, and a
 * third-party favicon service would leak every reader's page views to it. This
 * downloads each host's icon once, at author time, and writes it into the
 * bundle as a data URI. Same generate-don't-import pattern as the icon sets.
 *
 * Hosts come from the course data itself, so adding a link to a new site and
 * re-running this is all it takes. A host that fails to resolve is reported and
 * skipped: the link still renders, just without a mark.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(HERE, "../src/lib/course-data.json");
const OUT = resolve(HERE, "../src/components/reader/favicons.tsx");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const MAX_BYTES = 12 * 1024; // a mark bigger than this is a logo, not a favicon

/* The name shown on the chip. A host's own <title> is written for search
 * engines ("Investopedia | Sharper insight, better investing") so it is no use
 * as a label; these are the names a reader would say out loud. Anything not
 * listed falls back to its domain with the TLD dropped. */
const NAMES = {
  "investopedia.com": "Investopedia",
  "www.investopedia.com": "Investopedia",
  "corporatefinanceinstitute.com": "Corporate Finance Institute",
  "accountingcoach.com": "AccountingCoach",
  "accaglobal.com": "ACCA",
  "www.accaglobal.com": "ACCA",
  "bankofzambia.zm": "Bank of Zambia",
  "www.bankofzambia.zm": "Bank of Zambia",
  "ft.com": "Financial Times",
  "reuters.com": "Reuters",
  "careernavigator.accaglobal.com": "ACCA",
  "treasury-management.com": "Treasury Management International",
  "treasurytoday.com": "Treasury Today",
  "fia.org": "FIA",
  "jpmorgan.com": "J.P. Morgan",
};

/* Hosts to fetch even when nothing links to them yet, so a step can be written
 * against them without a regeneration round trip. */
const EXTRA = ["www.investopedia.com", "www.accountingcoach.com"];

/** Every host linked to from any step, plus EXTRA, in first-seen order. */
function hosts() {
  const raw = readFileSync(DATA, "utf8");
  const seen = new Set();
  for (const m of raw.matchAll(/\]\((https?:\/\/[^)\s"\\]+)\)/g)) {
    try {
      seen.add(new URL(m[1]).hostname);
    } catch {
      /* a malformed URL is the step's problem, not this script's */
    }
  }
  for (const h of EXTRA) seen.add(h);
  return [...seen];
}

/** The label for a host: the table above, else the domain without its TLD. */
function nameFor(host) {
  const bare = host.replace(/^www\./, "");
  if (NAMES[host]) return NAMES[host];
  if (NAMES[bare]) return NAMES[bare];
  const word = bare.split(".")[0];
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Candidate icon URLs for a host: whatever its HTML declares, then the
 *  conventional paths. Ordered best-first. */
async function candidates(host) {
  const out = [];
  try {
    const res = await fetch(`https://${host}/`, { headers: { "user-agent": UA } });
    const html = await res.text();
    for (const m of html.matchAll(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/gi)) {
      const href = /href=["']([^"']+)["']/i.exec(m[0])?.[1];
      if (href) out.push(new URL(href, `https://${host}/`).href);
    }
  } catch {
    /* fall through to the conventional paths */
  }
  /* apple-touch-icon first: it is a plain square PNG, where /favicon.ico is
   * often a multi-size bundle several times the weight. Investopedia's ico is
   * 14.7 KB and over the cap; its touch icon is 4.5 KB and identical to look
   * at. Sites that block automated HTML requests still serve both. */
  out.push(
    `https://${host}/apple-touch-icon.png`,
    `https://${host}/favicon.ico`,
    `https://${host}/favicon.png`,
  );
  // Prefer png/svg over ico: ico is often a multi-size bundle several times
  // the weight, and Safari renders some of them at the wrong resolution.
  const rank = (u) => (/\.svg(\?|$)/i.test(u) ? 0 : /\.png(\?|$)/i.test(u) ? 1 : 2);
  return [...new Set(out)].sort((a, b) => rank(a) - rank(b));
}

const MIME = { svg: "image/svg+xml", png: "image/png", ico: "image/x-icon", jpg: "image/jpeg" };

async function iconFor(host) {
  for (const url of await candidates(host)) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA } });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length || buf.length > MAX_BYTES) continue;
      const ext = (/\.(svg|png|ico|jpg|jpeg)(\?|$)/i.exec(url)?.[1] ?? "ico").toLowerCase();
      const mime = res.headers.get("content-type")?.split(";")[0] || MIME[ext] || MIME.ico;
      if (!mime.startsWith("image/")) continue;
      return { url, dataUri: `data:${mime};base64,${buf.toString("base64")}`, bytes: buf.length };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

const found = [];
const missing = [];
for (const host of hosts()) {
  const icon = await iconFor(host);
  if (icon) {
    found.push([host, icon]);
    console.log(`  ${String(Math.round(icon.bytes / 102.4) / 10).padStart(5)} KB  ${host}`);
  } else {
    missing.push(host);
  }
}

const entries = found
  .map(([host, i]) => `  "${host}": {\n    name: "${nameFor(host)}",\n    icon:\n      "${i.dataUri}",\n  },`)
  .join("\n");

writeFileSync(
  OUT,
  `/* GENERATED by scripts/gen-favicons.mjs — do not edit.
 *
 * The mark and name for every site a step sources from (rule C-7), shown in the
 * strip at the foot of each section. Inlined as data URIs because the app ships
 * \`default-src 'self'\`, so a remote favicon URL is blocked outright, and a
 * favicon service would hand every reader's page views to a third party.
 *
 * Add a link to a new site in a step, then run \`npm run gen:favicons\`.
 */
export type Site = { name: string; icon: string };

const SITES: Record<string, Site> = {
${entries}
};

/** The site behind a URL, or null if its mark was never fetched. */
export function siteFor(url: string): Site | null {
  try {
    const h = new URL(url).hostname;
    return SITES[h] ?? SITES[h.replace(/^www\\./, "")] ?? SITES["www." + h] ?? null;
  } catch {
    return null;
  }
}
`,
  "utf8",
);

console.log(`\nWrote ${found.length} favicon(s) to ${OUT}`);
if (missing.length) console.log(`No icon found for: ${missing.join(", ")}`);
