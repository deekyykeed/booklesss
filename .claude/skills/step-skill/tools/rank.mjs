/* RANK — score a course, and every step in it, against the rules a script can
 * actually judge.
 *
 *   node .claude/skills/step-skill/tools/rank.mjs "Schools/ZCAS/Treasury Management"
 *   node .claude/skills/step-skill/tools/rank.mjs Schools --steps
 *
 * Six rules vary per step and are the per-step score out of 6:
 *
 *   S-1   exactly ONE section, so exactly one checkpoint (revised 2026-08-09;
 *         owner: "only one checkpoint per step … a step is a small containable
 *         concept". A multi-section step is a conversion job — see D-18)
 *   W-8   bold marks 1-3 things a section, and not terms being defined
 *   E-8   1 to 3 tap-to-define terms in the step (rescaled 2026-08-09 with
 *         S-1 — it was 3 to 8 when a step held two to four sections)
 *   C-1   at least one ZMW / Zambian anchor in the step
 *   C-5   every section carries a figure, a date or a named entity
 *   C-7   every section carries at least one outbound source
 *
 * **A step below 6/6 is rewritten, not noted** (SKILL.md). Exit code is the
 * number of steps under 6, so this gates a script. On a course not yet
 * converted to one-checkpoint steps, every step fails S-1 by design — that is
 * the course's D-18 debt showing, not noise to silence.
 *
 * The course totals underneath add the rules that are uniform across a course
 * (banned words, em dashes, sentence length, checks, section counts). They are
 * reported, not scored, because a single number per course hides which step is
 * the problem — and the point of ranking is to find that step.
 *
 * WHAT THIS CANNOT SEE, and it is most of what matters: W-3, W-6, W-9, W-14,
 * W-15, W-16, C-2, C-3, C-6, C-8, S-2, S-5, S-7, E-7. On 2026-08-03 this whole
 * course scored clean while `debtors-and-factoring` opened on `2/10 net 30`,
 * notation the reader had not been given, facing the opposite direction to the
 * step's own title. It passed C-5 because "2/10" contains a digit.
 * **A measurement is not a reading.**
 */
import { readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const ROOT = args.find((a) => !a.startsWith("--")) ?? "Schools";
const SHOW_STEPS = args.includes("--steps");

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith(".mjs") && p.includes("reader") && e !== "course.mjs") files.push(p);
  }
})(ROOT);

const BANNED = ["tapestry", "nuance", "multifaceted", "robust", "delve", "foster", "furthermore",
  "it's worth noting", "landscape", "journey", "empower", "leverage", "game-changer", "seamless",
  "holistic", "synergy"];
const MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const NAMED = /Zanaco|Zambeef|ZESCO|First Quantum|Airtel|LuSE|Lusaka|Zambia|Kwacha|ZMW|Bank of Zambia|Barings|Leeson|Ndola|Kitwe/i;
const ZM = /Zanaco|Zambeef|ZESCO|First Quantum|Airtel|LuSE|Lusaka|Zambia|Kwacha|ZMW|Bank of Zambia|Ndola|Kitwe/i;

const plain = (s) => s
  .replace(/\[\[([^\]|]+)\|[^\]]*\]\]/g, "$1")
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  .replace(/\*\*/g, "");

function marked(b) {
  const t = [];
  if (typeof b?.text === "string") t.push(b.text);
  if (typeof b?.where === "string") t.push(b.where);
  for (const i of b?.items ?? []) if (typeof i === "string") t.push(i);
  for (const c of b?.cards ?? []) for (const v of [c?.title, c?.lead, c?.text]) if (typeof v === "string") t.push(v);
  return t;
}
const cells = (b) => [
  ...(b?.rows ?? []).flat().filter((x) => typeof x === "string"),
  ...(b?.columns ?? []).map((c) => c?.label).filter((x) => typeof x === "string"),
];

const steps = [];
let banned = [], longSentences = 0, sentences = 0, sentWords = 0, emDash = 0;
let noCheck = 0, noExplain = 0, multiSection = 0, sectionTotal = 0;

for (const file of files.sort()) {
  const step = (await import(pathToFileURL(file).href)).default;
  if (!step?.sections) continue;
  const secs = step.sections;
  sectionTotal += secs.length;
  if (secs.length !== 1) multiSection++;

  let terms = 0, zm = false;
  const boldOver = [], bare = [], unsourced = [];

  for (const s of secs) {
    let bolds = 0, links = 0;
    const body = [];
    for (const b of s.blocks ?? []) {
      for (const t of marked(b)) {
        bolds += (t.match(/\*\*(.+?)\*\*/g) ?? []).length;
        links += (t.match(/\]\(https?:/g) ?? []).length;
        terms += (t.match(/\[\[[^\]|]+\|/g) ?? []).length;
      }
      body.push(...marked(b).map(plain), ...cells(b));
    }
    const joined = body.join(" ");
    if (ZM.test(joined)) zm = true;
    if (bolds > 3 || bolds < 1) boldOver.push(`${s.id}(${bolds})`);
    if (!(/\d/.test(joined) || MONTH.test(joined) || NAMED.test(joined))) bare.push(s.id);
    if (links === 0) unsourced.push(s.id);

    for (const t of body) {
      emDash += t.split("—").length - 1;
      for (const sent of t.split(/(?<=[.!?])\s+/)) {
        const n = sent.split(/\s+/).filter(Boolean).length;
        if (!n) continue;
        sentences++; sentWords += n;
        if (n > 35) longSentences++;
      }
      const low = t.toLowerCase();
      for (const w of BANNED) if (low.includes(w)) banned.push(`${step.slug}:${w}`);
    }
    if (!s.check) noCheck++;
    else if (!s.check.explain) noExplain++;
  }

  const fails = [];
  if (secs.length !== 1) fails.push(`S-1 ${secs.length} sections`);
  if (boldOver.length) fails.push(`W-8 ${boldOver.join(",")}`);
  if (terms < 1 || terms > 3) fails.push(`E-8 ${terms}`);
  if (!zm) fails.push("C-1");
  if (bare.length) fails.push(`C-5 ${bare.join(",")}`);
  if (unsourced.length) fails.push(`C-7 ${unsourced.join(",")}`);
  steps.push({ slug: step.slug, score: 6 - fails.length, fails });
}

steps.sort((a, b) => a.score - b.score || a.slug.localeCompare(b.slug));
const under = steps.filter((s) => s.score < 6);

if (SHOW_STEPS || under.length) {
  console.log("\nPER-STEP  (out of 6: S-1 · W-8 · E-8 · C-1 · C-5 · C-7)\n");
  for (const s of SHOW_STEPS ? steps : under) {
    console.log(`  ${s.score}/6  ${s.slug}${s.fails.length ? "   " + s.fails.join(" · ") : ""}`);
  }
}

console.log("\nCOURSE TOTALS  (reported, not scored)\n");
console.log(`  steps ${steps.length} · sections ${sectionTotal}`);
console.log(`  W-1  banned words        ${banned.length}${banned.length ? "  " + [...new Set(banned)].join(" ") : ""}`);
console.log(`  W-11 em dashes           ${emDash}`);
console.log(`  W-12 sentences >35 words ${longSentences} · average ${(sentWords / Math.max(sentences, 1)).toFixed(1)}`);
console.log(`  S-4  sections w/o check  ${noCheck} · checks w/o explain ${noExplain}`);
console.log(`  S-1  steps not 1 section ${multiSection}`);

console.log(`\n--- ${steps.length - under.length} of ${steps.length} steps at 6/6`);
if (under.length) console.log(`    ${under.length} below. A step below 6/6 is REWRITTEN, not noted.`);
console.log("    This scores what a script can judge. It cannot see a hook, a");
console.log("    confusing sentence, or an opening that faces the wrong way.");
process.exit(Math.min(under.length, 255));
