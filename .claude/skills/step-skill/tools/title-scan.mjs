/* Title scan — the machine-checkable half of rule S-12.
 *
 *   node .claude/skills/step-skill/tools/title-scan.mjs Schools
 *
 * A title is the only part of a step every reader sees, and it is seen in four
 * places at once: the sidebar row, the <h1>, the browser tab and the WhatsApp
 * card. S-12 says it is a NAME, written in Title Case, and that it makes a
 * claim rather than describing the step to itself.
 *
 * Every name in the nav column is checked, not just the step's two:
 *
 *   title    the <h1> the reader lands on
 *   label    the sidebar row they tapped        (S-10 governs the pair)
 *   kicker   the eyebrow above the <h1>
 *   tree     the course, lesson and group rows in reader/course.mjs
 *
 * Four verdicts. All four are defects; none is allowed:
 *
 *   CASE     not Title Case. A word that is not an article, a coordinating
 *            conjunction or a short preposition begins lowercase — or the
 *            first or last word does, where even those must capitalise.
 *   TAIL     the hedged tail: ", and how much of it to run", ", and what it
 *            demands". THIS IS THE ONE THAT MATTERS — 13 of Treasury
 *            Management's 22 titles carried it on the day the rule was
 *            written, which is a voice rather than a title.
 *   OPENER   opens on "What" or "How". A question in disguise: the title is
 *            describing the step to itself instead of naming it.
 *   DANGLE   ends on a bare preposition or pronoun — "Getting the cash in",
 *            "living with it". The casual verb phrase S-12 bans.
 *
 * WHAT THIS CANNOT SEE, and it is the more important half. S-12 asks whether a
 * title is ASSERTIVE — whether it makes a claim a student would recognise and
 * search for. No regex has an opinion about that. "Treasury Things and Other
 * Matters" passes every check here. A clean run means the four mechanical
 * faults are gone, not that the titles are good; read the column top to bottom
 * as a stranger, the way W-16 asks for first screens.
 *
 * Exit code is the defect count, so this can gate a script.
 *
 * Economics is not scanned — its 30 steps have no .mjs source and live only in
 * platform/src/lib/course-data.json. Same blind spot as label-scan (D-9).
 *
 * Baseline 2026-08-08, first run: **194 defects across 166 names, in 56 of 56
 * authored steps and 37 course/group rows** — nothing in the product passed.
 * By verdict: CASE 166, TAIL 14, OPENER 10, DANGLE 4. By course: TM 97, CF 80,
 * SM 17. Treasury Management is 0 as of the same day (D-17); Corporate Finance
 * and Strategic Management are untouched.
 *
 * Note the step count: DEBT.md's older items say 53, which was true until the
 * three `start-here` steps landed on 2026-08-07. It is 56.
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.argv[2] ?? "Schools";

/* Lowercase is ALLOWED for these, never required — arguing about "Of" versus
 * "of" mid-title is not what this rule is for. Articles, the coordinating
 * conjunctions, and prepositions of four letters or fewer. */
const LOWER = new Set([
  "a", "an", "the",
  "and", "but", "or", "nor", "for", "so", "yet",
  "as", "at", "by", "in", "into", "of", "off", "on", "onto", "out", "over",
  "per", "to", "up", "upon", "via", "with",
]);

/* A title that stops here has stopped mid-phrase. */
const DANGLING = new Set([
  "in", "out", "up", "on", "off", "over", "with", "to", "of", "at", "by",
  "it", "them", "this", "that", "one",
]);

const OPENERS = new Set(["what", "how"]);

const files = [];
const manifests = [];
(function walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (!p.includes("reader") || !entry.endsWith(".mjs")) continue;
    else if (entry === "course.mjs") manifests.push(p);
    else files.push(p);
  }
})(ROOT);

const clean = (w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

/* All caps is an abbreviation (NPV, EOQ, TMS) and keeps its own case; so does
 * anything starting with a digit. "CCPs" is all-caps with a plural s. */
const isAbbrev = (w) => /^[A-Z0-9][A-Z0-9]*s?$/.test(w) || /^\d/.test(w);

function caseDefect(s) {
  /* Split on spaces; a hyphenated compound is checked segment by segment, and
   * the word after a colon counts as a first word. */
  const raw = s.split(/\s+/).filter(Boolean);
  const bad = [];
  let forceCap = true; // first word, and anything after a colon or dash
  raw.forEach((token, i) => {
    const last = i === raw.length - 1;
    for (const seg of token.split("-")) {
      const w = clean(seg);
      if (!w) continue;
      if (isAbbrev(w)) { forceCap = false; continue; }
      const lower = w[0] === w[0].toLowerCase() && w[0] !== w[0].toUpperCase();
      if (lower && (forceCap || last || !LOWER.has(w.toLowerCase()))) bad.push(w);
      forceCap = false;
    }
    if (/[:—–]$/.test(token)) forceCap = true;
  });
  return bad;
}

function verdicts(s) {
  const out = [];
  const bad = caseDefect(s);
  if (bad.length) out.push(["CASE", bad.join(", ")]);

  /* The hedged tail. Either a literal ", and …" or a comma followed by the
   * clause words that always introduce one. */
  const tail = s.match(/,\s+(and\b.*|(?:how|what|where|when|why|which)\b.*)$/i);
  if (tail) out.push(["TAIL", tail[0].trim()]);

  const first = clean(s.split(/\s+/)[0] ?? "").toLowerCase();
  if (OPENERS.has(first)) out.push(["OPENER", first]);

  const words = s.split(/\s+/).map(clean).filter(Boolean);
  const lastWord = (words.at(-1) ?? "").toLowerCase();
  if (words.length > 1 && DANGLING.has(lastWord)) out.push(["DANGLE", lastWord]);

  return out;
}

const rows = [];
const record = (where, field, value) => {
  if (typeof value !== "string" || !value.trim()) return;
  for (const [v, detail] of verdicts(value)) rows.push({ v, where, field, value, detail });
};

let stepCount = 0;
for (const file of files.sort()) {
  const step = (await import(pathToFileURL(file).href)).default;
  if (!step?.title) continue;
  stepCount++;
  record(step.slug, "title", step.title);
  record(step.slug, "label", step.label);
  record(step.slug, "kicker", step.kicker);
}

let treeCount = 0;
for (const file of manifests.sort()) {
  const course = (await import(pathToFileURL(file).href)).default;
  record(course.slug, "course title", course.title);
  treeCount++;
  (function nodes(list) {
    for (const n of list ?? []) {
      if (!n?.children) continue; // a leaf is a step, already scanned above
      treeCount++;
      record(`${course.slug} › ${n.slug}`, "group label", n.label);
      nodes(n.children);
    }
  })(course.tree);
}

const ORDER = ["TAIL", "OPENER", "DANGLE", "CASE"];
for (const v of ORDER) {
  const group = rows.filter((r) => r.v === v);
  if (!group.length) continue;
  console.log(`\n== ${v}  (${group.length})`);
  for (const r of group) {
    console.log(`   ${r.where}  [${r.field}]`);
    console.log(`      ${JSON.stringify(r.value)}   → ${r.detail}`);
  }
}

const names = new Set(rows.map((r) => `${r.where}|${r.field}`));
console.log(
  `\n--- ${rows.length} defects across ${names.size} names` +
    `\n    scanned: ${stepCount} authored steps, ${treeCount} course/group rows` +
    `\n    baseline 2026-08-08: 194 across 56 of 56 steps. TM is paid (D-17); CF and SM are not.` +
    `\n    The register half of S-12 — is this title assertive? — is NOT scannable.`,
);
process.exit(rows.length);
