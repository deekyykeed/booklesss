/* Label/title scan — the machine-checkable half of rule S-10.
 *
 *   node .claude/skills/step-skill/tools/label-scan.mjs Schools
 *
 * Every step exports two names that sit next to each other in its `.mjs`:
 *
 *   label:  what the reader TAPS — sidebar row, command search, the native
 *           share sheet, the browser tab, and the WhatsApp preview card
 *   title:  what the reader LANDS ON — the <h1> at the top of the page
 *
 * When those are two different names, a reader taps "The yield curve" and
 * arrives at "The term structure of interest rates" with no way to tell they
 * got the right step. S-10: the label is the title, shortened — never a second
 * name for the same step.
 *
 * Verdicts, worst first:
 *
 *   RENAMED    the label and the title share no significant word. A second
 *              name. Always a defect.
 *   REWORDED   they share words but the label is not the title's words in the
 *              title's order — reordered, re-inflected, or a synonym swapped
 *              in. Always a defect.
 *   PUNCT      identical once punctuation is ignored.
 *   JOIN       the label is a clean trim of the title, but the title is short
 *              enough to sit in a sidebar row unaided — so there is no reason
 *              for two strings. Make them identical.
 *   TRIMMED    a clean trim of a title too long for a row. ALLOWED — reported
 *              so the trim can be eyeballed, not counted as a defect.
 *   ABBREV     the label is an abbreviation the title spells out (WACC, GDP).
 *              ALLOWED where the abbreviation is the one the exam uses (C-4).
 *
 * A label containing `&` is flagged `[& → and]` on top of whatever verdict it
 * gets, and counts as a defect even when the verdict itself is allowed. The
 * ampersand is only ever in the label — no title uses one — so it is a second
 * spelling of the step's name for no gain.
 *
 * Exit code is the defect count, so this can gate a script. TRIMMED and ABBREV
 * do not count unless they carry an ampersand.
 *
 * Scans authored `.mjs` steps only. Economics has no `.mjs` source — its 30
 * steps live only in `platform/src/lib/course-data.json`, seeded before the
 * course tree existed, and 2 of them differ. See DEBT.md D-9.
 *
 * Baseline 2026-08-03, first run: 26 defects of 53 authored steps —
 * 5 RENAMED, 12 REWORDED, 3 PUNCT, 5 JOIN, plus 1 ampersand inside an
 * otherwise allowed trim. By course: TM 15 defects of 21 steps, CF 11 of 25,
 * SM 0 of 7. 4 of the 5 RENAMED and 9 of the 12 REWORDED are TM, and all of
 * those were made by the S-8 splits. The fifth RENAMED (`yield-curve`) is CF
 * and predates them.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.argv[2] ?? "Schools";

/* A sidebar row truncates. Measured on a 390px phone with the step-level
 * indent, ~32 characters is what survives; past that the label is being read
 * with its tail cut off, which is when a shorter label earns its place. This
 * is a judgement, not a constant the app enforces — the char counts are
 * printed so a human can overrule it. */
const ROW_BUDGET = 32;

const STOP = new Set([
  "a", "an", "and", "as", "at", "by", "for", "from", "how", "in", "into", "is",
  "it", "its", "of", "on", "or", "the", "to", "what", "when", "where", "with",
  "you", "your",
]);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith(".mjs") && p.includes("reader") && entry !== "course.mjs") files.push(p);
  }
})(ROOT);

/* `&` and "and" are the same word to a reader; punctuation is not a name. */
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const words = (s) => norm(s).split(" ").filter(Boolean);
const significant = (s) => words(s).filter((w) => !STOP.has(w));

/* Is `a` a subsequence of `b`? A trim may drop words from anywhere in the
 * title, but it may not reorder them — "Theories of dividend policy" trimmed
 * to "Dividend theories" is a rewrite, not a trim. */
function subsequence(a, b) {
  let i = 0;
  for (const w of b) if (i < a.length && a[i] === w) i++;
  return i === a.length;
}

/* WACC ← "The weighted average cost of capital". Only counts when the label is
 * a single all-caps token and its letters are the initials, in order, of the
 * title's significant words. */
function isAbbrev(label, title) {
  const raw = label.trim();
  if (!/^[A-Z][A-Z0-9]{1,7}$/.test(raw)) return false;
  const initials = significant(title).map((w) => w[0]).join("");
  return initials.includes(raw.toLowerCase());
}

function verdict(label, title) {
  if (label === title) return null;
  if (norm(label) === norm(title)) return "PUNCT";
  if (isAbbrev(label, title)) return "ABBREV";

  const L = significant(label);
  const T = significant(title);
  const shared = L.filter((w) => T.includes(w)).length;

  if (!shared) return "RENAMED";
  if (!subsequence(L, T)) return "REWORDED";
  return title.length <= ROW_BUDGET ? "JOIN" : "TRIMMED";
}

const BAD = new Set(["RENAMED", "REWORDED", "PUNCT", "JOIN"]);
const ORDER = ["RENAMED", "REWORDED", "PUNCT", "JOIN", "TRIMMED", "ABBREV"];

const hits = [];
let total = 0;

for (const file of files.sort()) {
  const step = (await import(pathToFileURL(file).href)).default;
  if (!step?.title || !step?.label) continue;
  total++;
  const v = verdict(step.label, step.title);
  const amp = step.label.includes("&");
  if (v || amp) {
    hits.push({ v: v ?? "TRIMMED", amp, slug: step.slug, label: step.label, title: step.title });
  }
}

const isDefect = (h) => BAD.has(h.v) || h.amp;

for (const v of ORDER) {
  const group = hits.filter((h) => h.v === v);
  if (!group.length) continue;
  const allowed = group.filter((h) => !isDefect(h)).length;
  console.log(`\n== ${v}  (${group.length})${allowed === group.length ? "  — allowed" : ""}`);
  for (const h of group) {
    console.log(`   ${h.slug}${h.amp ? "   [& → and]" : ""}`);
    console.log(`      taps:  ${JSON.stringify(h.label)}  (${h.label.length})`);
    console.log(`      lands: ${JSON.stringify(h.title)}  (${h.title.length})`);
  }
}

const defects = hits.filter(isDefect).length;
console.log(
  `\n--- ${defects} defects (+${hits.length - defects} allowed) of ${total} authored steps` +
    `\n    baseline 2026-08-03: 26 of 53. Economics is not scanned (no .mjs source);` +
    `\n    2 of its 30 steps differ. See DEBT.md D-9.`,
);
process.exit(defects);
