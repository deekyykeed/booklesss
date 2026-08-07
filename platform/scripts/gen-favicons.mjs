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
  /* The bank's live domain is boz.zm; bankofzambia.zm no longer resolves. */
  "boz.zm": "Bank of Zambia",
  "www.boz.zm": "Bank of Zambia",
  "bis.org": "Bank for International Settlements",
  "www.bis.org": "Bank for International Settlements",
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

/** Every distinct source URL linked from any step, for the page titles below.
 *  Same scan as hosts(), keeping the whole URL rather than its hostname. */
function sourceUrls() {
  const raw = readFileSync(DATA, "utf8");
  const seen = new Set();
  for (const m of raw.matchAll(/\]\((https?:\/\/[^)\s"\\]+)\)/g)) {
    try {
      new URL(m[1]);
      seen.add(m[1]);
    } catch {
      /* a malformed URL is the step's problem, not this script's */
    }
  }
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

/* An .ico is a container: a 6-byte header, then one 16-byte directory entry per
 * frame, then the frames. A site that ships 16/32/48 in one file is three
 * images' worth of bytes for one mark, which is how the Bank of Zambia's 15.4KB
 * icon failed a 12KB cap meant to keep logos out — the cap was right and the
 * measurement was wrong, because no single frame in it is over 1.2KB.
 *
 * This pulls out one frame and rewraps it as a valid single-frame .ico. The
 * frames are usually BMP-encoded rather than PNG, so re-wrapping is the cheap
 * move: decoding to PNG would need an encoder, and a one-frame ico renders in
 * an <img> exactly the same way.
 *
 * Returns null for anything that is not a parseable icon, so a real oversized
 * logo still fails the cap as before. DO NOT raise MAX_BYTES instead. */
function shrinkIco(buf) {
  if (buf.length < 22) return null;
  if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) return null; // reserved, type=icon
  const count = buf.readUInt16LE(4);
  if (count < 1 || buf.length < 6 + count * 16) return null;

  const entries = [];
  for (let i = 0; i < count; i++) {
    const o = 6 + i * 16;
    const w = buf[o] || 256;
    const size = buf.readUInt32LE(o + 8);
    const offset = buf.readUInt32LE(o + 12);
    if (offset + size > buf.length) return null;
    entries.push({ w, size, offset, dir: buf.subarray(o, o + 16) });
  }
  /* 32px is the chip's drawing size. Prefer it, then the nearest thing that is
   * not larger, so the mark is never upscaled into mush. */
  entries.sort((a, b) => Math.abs(a.w - 32) - Math.abs(b.w - 32) || a.size - b.size);
  const pick = entries[0];
  if (!pick) return null;

  const dir = Buffer.from(pick.dir);
  dir.writeUInt32LE(pick.size, 8);
  dir.writeUInt32LE(22, 12); // the single frame now starts right after one entry
  return Buffer.concat([
    Buffer.from([0, 0, 1, 0, 1, 0]),
    dir,
    buf.subarray(pick.offset, pick.offset + pick.size),
  ]);
}

async function iconFor(host) {
  for (const url of await candidates(host)) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA } });
      if (!res.ok) continue;
      let buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length) continue;
      if (buf.length > MAX_BYTES && buf.readUInt16LE?.(0) === 0) {
        const one = shrinkIco(buf);
        if (one && one.length <= MAX_BYTES) {
          console.log(`  ${host}: ico ${(buf.length / 1024).toFixed(1)}KB → one frame ${(one.length / 1024).toFixed(1)}KB`);
          buf = one;
        }
      }
      if (buf.length > MAX_BYTES) continue;
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

/* THE CHIP'S LABEL IS THE PAGE'S OWN TITLE (owner, 2026-08-07: "the text should
 * be the title of the page on the source, not the name of the company or
 * website"). It was the site name until now, and the reasoning against titles
 * is still in NAMES above and still half right: a raw <title> is written for
 * search engines, so it arrives as "Net Present Value (NPV) | Formula,
 * Definition | CFI" with the site bolted on the end and the useful part first.
 *
 * So the title is cleaned rather than trusted:
 *   · split on the separators publishers actually use (| – — ·, and " - "),
 *   · drop any trailing piece that IS the site (CFI, Investopedia, ACCA…),
 *   · take what is left, and if that leaves several pieces keep the first,
 *     which is the specific one on every site checked,
 *   · trim to 48 characters on a word boundary, because this sits in a chip.
 *
 * A page that cannot be fetched or has no usable title falls back to the site
 * name, which is exactly what shipped before, so this can only improve a chip
 * and never empty one. */
const TITLE_MAX = 48;

function cleanTitle(raw, host) {
  if (!raw) return null;
  let t = raw.replace(/\s+/g, " ").trim();
  const site = (nameFor(host) || "").toLowerCase();
  let parts = t.split(/\s*[|–—·]\s*|\s+-\s+/).map((x) => x.trim()).filter(Boolean);
  parts = parts.filter((x) => {
    const l = x.toLowerCase();
    return l !== site && !l.includes("corporate finance institute") && l !== "cfi";
  });
  t = parts[0] ?? "";
  if (!t || t.length < 3) return null;
  if (t.length > TITLE_MAX) {
    const cut = t.slice(0, TITLE_MAX);
    t = cut.slice(0, cut.lastIndexOf(" ") > 20 ? cut.lastIndexOf(" ") : TITLE_MAX).trim();
  }
  /* Trailing punctuation left by the cut. "Working Capital Cycle Explained:
     Formula," reads as a sentence that was interrupted, which is worse than a
     shorter label — the reader cannot tell whether the chip is broken or the
     title really is that. Also drops a dangling "and"/"&", same reason. */
  t = t.replace(/\s*(?:and|&|or|with|for|in|of|to|the|a)$/i, "").replace(/[\s,;:.\-–—]+$/, "");
  return t.length >= 3 ? t : null;
}

async function titleFor(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 200_000);
    const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
    if (!m) return null;
    const decoded = m[1]
      .replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ").replace(/&[a-z]+;/gi, " ");
    return cleanTitle(decoded, new URL(url).host);
  } catch {
    return null;
  }
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

/* One request per distinct source URL. 83 of them at the time of writing, which
 * is a few seconds at build time and zero at read time. */
const pageTitles = new Map();
console.log("\n  page titles:");
for (const url of sourceUrls()) {
  const t = await titleFor(url);
  if (t) pageTitles.set(url, t);
  console.log(`    ${t ? "ok  " : "--  "}${t ?? "(falls back to the site name)"}  ${url}`);
}

const pageEntries = [...pageTitles]
  .map(([url, t]) => `  ${JSON.stringify(url)}: ${JSON.stringify(t)},`)
  .join("\n");

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

/** A source URL to the title of the page it opens (rule C-7). Missing here
 *  means the page could not be read at build time; the chip falls back to the
 *  site's name, which is what every chip showed before 2026-08-07. */
export const PAGES: Record<string, string> = {
${pageEntries}
};

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
