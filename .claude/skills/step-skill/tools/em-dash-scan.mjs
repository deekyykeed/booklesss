/* Em-dash scan — the machine-checkable whole of rule W-11.
 *
 *   node .claude/skills/step-skill/tools/em-dash-scan.mjs Schools
 *
 * W-11: no em dashes in a reader step. Not in prose, not in a definition, not
 * in a table cell, not in a check option. `.claude/CLAUDE.md` allows one per
 * document; reader steps allow none, because an em dash is usually a sentence
 * that has not decided what it is and it is the loudest tell that a machine
 * wrote the line.
 *
 * This is the only one of the four scans with no judgement in it at all: the
 * character is either there or it is not. What it cannot tell you is what to
 * replace it with — W-11 lists the three cases (colon, comma pair, full stop)
 * and says rewrite the sentence rather than swapping the character, so a
 * find-and-replace over this output would be the wrong fix.
 *
 * Why it exists: `seed-course.mjs` has always WARNED on em dashes and never
 * blocked, on the grounds that every older step had them. Nobody counted, so
 * the warning scrolled past on every publish for months.
 *
 * Baseline 2026-08-03, first run: 790 in 32 of 53 authored steps —
 * Corporate Finance 449, Strategic Management 341, Treasury Management 0.
 * TM's zero is not luck: its 21 steps were rewritten after W-11 was written,
 * and the other two courses were not. See DEBT.md D-10.
 *
 * Exit code is the count, so this can gate a script.
 */
import { readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.argv[2] ?? "Schools";
const DASH = "—";

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith(".mjs") && p.includes("reader") && entry !== "course.mjs") files.push(p);
  }
})(ROOT);

/* Every place prose hides in a block. Kept in step with `blockTexts()` in
 * seed-course.mjs — a new block type that stores its text somewhere new is
 * invisible to this scan until it is named here. */
function texts(b) {
  const t = [];
  if (typeof b?.text === "string") t.push(b.text);
  if (typeof b?.where === "string") t.push(b.where);
  if (Array.isArray(b?.items)) t.push(...b.items.filter((i) => typeof i === "string"));
  for (const c of b?.cards ?? []) {
    for (const v of [c?.title, c?.lead, c?.text]) if (typeof v === "string") t.push(v);
  }
  for (const r of b?.rows ?? []) for (const v of r) if (typeof v === "string") t.push(v);
  for (const c of b?.columns ?? []) if (typeof c?.label === "string") t.push(c.label);
  return t;
}

const byCourse = new Map();
const hits = [];
let total = 0;

for (const file of files.sort()) {
  const step = (await import(pathToFileURL(file).href)).default;
  if (!step?.sections) continue;
  const lines = [];
  for (const sec of step.sections) {
    for (const b of sec.blocks ?? []) {
      for (const t of texts(b)) {
        for (let i = t.indexOf(DASH); i !== -1; i = t.indexOf(DASH, i + 1)) {
          lines.push([sec.id ?? "?", t.slice(Math.max(0, i - 42), i + 18).replace(/\s+/g, " ")]);
        }
      }
    }
    const c = sec.check;
    if (c) {
      for (const v of [c.question, c.explain, ...(c.options ?? [])]) {
        if (typeof v !== "string") continue;
        for (let i = v.indexOf(DASH); i !== -1; i = v.indexOf(DASH, i + 1)) {
          lines.push([`${sec.id ?? "?"} (check)`, v.slice(Math.max(0, i - 42), i + 18).replace(/\s+/g, " ")]);
        }
      }
    }
  }
  const course = file.split(sep)[2] ?? file.split("/")[2];
  byCourse.set(course, (byCourse.get(course) ?? 0) + lines.length);
  total += lines.length;
  if (lines.length) hits.push({ slug: step.slug, course, lines });
}

for (const h of hits.sort((a, b) => b.lines.length - a.lines.length)) {
  console.log(`\n== ${h.slug}  (${h.lines.length})`);
  for (const [where, sample] of h.lines.slice(0, 4)) console.log(`   ${where}: …${sample}…`);
  if (h.lines.length > 4) console.log(`   …and ${h.lines.length - 4} more`);
}

console.log("\n--- by course");
for (const [c, n] of [...byCourse].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(4)}  ${c}`);
}
console.log(
  `\n--- ${total} em dashes in ${hits.length} of ${files.length} authored steps` +
    `\n    baseline 2026-08-03: 790 in 32 of 53 (CF 449, SM 341, TM 0). See DEBT.md D-10.`,
);
process.exit(Math.min(total, 255));
