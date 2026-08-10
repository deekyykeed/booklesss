/* RANK — score ONE STEP against the rules a script can actually judge, and use
 * a folder only to find the next step to open.
 *
 *   node .claude/skills/step-skill/tools/rank.mjs "…/reader/baumol-model.mjs"   ← the real use
 *   node .claude/skills/step-skill/tools/rank.mjs "Schools/ZCAS/Treasury Management"
 *   node .claude/skills/step-skill/tools/rank.mjs Schools --steps
 *
 * Eight rules vary per step and are the per-step score out of 8:
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
 *   C-12  no exam framing anywhere a reader sees, checks included (2026-08-09)
 *   S-13  no Booklesss mechanics: steps, checkpoints, notes, counts (2026-08-09)
 *
 * **A step below 8/8 is rewritten, not noted** (SKILL.md). Exit code is the
 * number of steps under 8, so this gates a script. On a course not yet
 * converted to one-checkpoint steps, every step fails S-1 by design — that is
 * the course's D-18 debt showing, not noise to silence.
 *
 * C-12 and S-13 match PHRASES, not words, and that is deliberate. A bare
 * /marks?/ fires on deutsche marks, mark-to-market and "only a mark tells you
 * which way" — measured 2026-08-09, that regex found 58 "defects" across three
 * courses of which roughly a third were real. A scanner that cries wolf is a
 * scanner nobody reads.
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

/* ONE STEP AT A TIME (owner, 2026-08-09: "scoring should be aggressively one
 * step by step and not all at once"). Point this at a single .mjs and it opens
 * that one step, prints a verdict per rule with the offending text quoted, and
 * exits on the failure count. Point it at a folder and it does NOT hand back a
 * course grade — it hands back a QUEUE, worst first, and names the one step to
 * open next. A course number invites the batch pass this rule exists to stop:
 * 60 steps graded at once get fixed by whoever is currently annoyed, and the
 * number goes green without anyone having read a page. */
const files = [];
const ONE = ROOT.endsWith(".mjs");
if (ONE) files.push(ROOT);
else
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

/* C-12 — the exam is not the reason. Phrase-based on purpose: a bare /marks?/
 * matches deutsche marks, mark-to-market and "a mark tells you which way", and
 * a scanner that cries wolf 40 times gets ignored on the one that counts. */
const EXAM = /\b(exams?|examinable|examiner|examined)\b|\bpast papers?\b|\bthe paper (asks|wants|awards|demands|expects|is written|will)\b|\bquestion paper\b|\bmark scheme\b|\bmarking key\b|\bfull marks\b|\bmarks on the table\b|\bmarks? (are|is) award/i;
/* `\bthe marks\b` was in there for one afternoon and came straight back out:
 * it fires on "having taken in the marks and never delivered the dollars",
 * which is Herstatt in 1974 taking deutsche marks. Every real use of it is
 * already caught by `past papers` or `marks on the table`. */

/* S-13 — the step never describes Booklesss. Also phrase-based: "step" alone
 * is a real English word ("the first step is to net the exposures"), and it is
 * the NARRATION of the container that is banned, not the noun.
 *
 * "COURSE" IS DELIBERATELY NOT IN HERE. A course is the thing the student
 * enrolled in and their own word for it; steps, checkpoints, notes, the
 * sidebar and progress are Booklesss features. "This course is about the
 * Tuesday" is a good sentence about the subject and an early draft of this
 * regex flagged it, which is the false positive that teaches an author to stop
 * reading the scanner. */
const MECH = /\bthis step\b|\bthese steps\b|\bthe (next|previous|last|first) steps?\b|\bsteps? (after|before) this\b|\d+ steps\b|\bcheckpoints?\b|\bnote button\b|\bsidebar\b|\b(each|every) (step|section) ends\b|\byour place is kept\b|\bflag at the end\b|\bthe (previous|next|last) section\b/i;

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

const RULES = 8; // S-1 · W-8 · E-8 · C-1 · C-5 · C-7 · C-12 · S-13
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
  const boldOver = [], bare = [], unsourced = [], examHits = [], mechHits = [];

  for (const s of secs) {
    let bolds = 0, links = 0;
    const body = [];
    for (const b of s.blocks ?? []) {
      for (const t of marked(b)) {
        bolds += (t.match(/\*\*(.+?)\*\*/g) ?? []).length;
        links += (t.match(/\]\(https?:/g) ?? []).length;
        terms += (t.match(/\[\[[^\]|]+\|/g) ?? []).length;
      }
      /* C-12: the withdrawn callout kind is itself the defect. */
      if (b?.type === "callout" && b?.kind === "exam") examHits.push('callout kind:"exam"');
      body.push(...marked(b).map(plain), ...cells(b));
    }
    /* A check's question, options and explain are read by the student too, and
     * are where exam framing hides — the prose gets cleaned and the explain
     * keeps saying "this is examinable". */
    if (s.check)
      body.push(
        ...[s.check.question, s.check.explain, ...(s.check.options ?? [])]
          .filter((x) => typeof x === "string")
          .map(plain),
      );
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
      for (const sent of t.split(/(?<=[.!?])\s+/)) {
        if (EXAM.test(sent)) examHits.push(sent.trim());
        if (MECH.test(sent)) mechHits.push(sent.trim());
      }
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
  if (examHits.length) fails.push(`C-12 ${examHits.length}`);
  if (mechHits.length) fails.push(`S-13 ${mechHits.length}`);
  steps.push({ slug: step.slug, file, score: RULES - fails.length, fails, examHits, mechHits });
}

steps.sort((a, b) => a.score - b.score || a.slug.localeCompare(b.slug));
const under = steps.filter((s) => s.score < RULES);

/* ── ONE STEP: the full verdict, with the offending text quoted ───────────── */
if (ONE) {
  const s = steps[0];
  if (!s) {
    console.log(`rank: ${ROOT} exports no sections — is it a step?`);
    process.exit(1);
  }
  console.log(`\n  ${s.slug}   ${s.score}/${RULES}\n`);
  const verdict = (id) => {
    const f = s.fails.find((x) => x.startsWith(id + " ") || x === id);
    console.log(`  ${f ? "FAIL" : "pass"}  ${id.padEnd(5)}${f ? "  " + f.slice(id.length).trim() : ""}`);
  };
  ["S-1", "W-8", "E-8", "C-1", "C-5", "C-7", "C-12", "S-13"].forEach(verdict);
  for (const [label, hits] of [["C-12 exam framing", s.examHits], ["S-13 product mechanics", s.mechHits]])
    if (hits.length) {
      console.log(`\n  ${label}:`);
      for (const h of hits) console.log(`    · ${h.replace(/\s+/g, " ").slice(0, 160)}`);
    }
  console.log(
    s.score === RULES
      ? "\n  Clean on what a script can judge. Now READ it — the hook, the first\n  screen cold, whether the opening faces the same way as the title.\n"
      : "\n  Below the bar. Rewrite it now, in this edit (SKILL.md).\n",
  );
  process.exit(s.fails.length);
}

/* ── A FOLDER: a queue, not a grade. See the ONE STEP note at the top. ────── */
if (SHOW_STEPS || under.length) {
  console.log(`\nQUEUE  (out of ${RULES}: S-1 · W-8 · E-8 · C-1 · C-5 · C-7 · C-12 · S-13)\n`);
  for (const s of SHOW_STEPS ? steps : under) {
    console.log(`  ${s.score}/${RULES}  ${s.slug}${s.fails.length ? "   " + s.fails.join(" · ") : ""}`);
  }
  if (under.length) {
    console.log(`\n  NEXT — open this one, alone, and finish it before the others:\n`);
    console.log(`    node .claude/skills/step-skill/tools/rank.mjs "${under[0].file}"\n`);
  }
}

console.log("\nCOURSE TOTALS  (reported, not scored)\n");
console.log(`  steps ${steps.length} · sections ${sectionTotal}`);
console.log(`  W-1  banned words        ${banned.length}${banned.length ? "  " + [...new Set(banned)].join(" ") : ""}`);
console.log(`  W-11 em dashes           ${emDash}`);
console.log(`  W-12 sentences >35 words ${longSentences} · average ${(sentWords / Math.max(sentences, 1)).toFixed(1)}`);
console.log(`  S-4  sections w/o check  ${noCheck} · checks w/o explain ${noExplain}`);
console.log(`  S-1  steps not 1 section ${multiSection}`);

console.log(`\n--- ${steps.length - under.length} of ${steps.length} steps at ${RULES}/${RULES}`);
if (under.length)
  console.log(
    `    ${under.length} below. A step below ${RULES}/${RULES} is REWRITTEN, not noted —\n` +
      `    and it is opened ALONE. This list is a worklist, not a grade.`,
  );
console.log("    This scores what a script can judge. It cannot see a hook, a");
console.log("    confusing sentence, or an opening that faces the wrong way.");
process.exit(Math.min(under.length, 255));
