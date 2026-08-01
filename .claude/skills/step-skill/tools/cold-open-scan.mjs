/* Cold-open scan — the machine-checkable half of rule W-13.
 *
 *   node .claude/skills/step-skill/tools/cold-open-scan.mjs Schools
 *
 * Reads every published reader step, takes the FIRST SENTENCE of each section's
 * first `p`, and flags the two W-13 bans a regex can actually judge:
 *
 *   DEVICE       narrating the demonstration instead of starting it
 *                ("Take one X and watch it…", "Let's walk through…")
 *   FORWARD-REF  a count or pointer the reader cannot resolve yet
 *                ("all three levels" before a level is named)
 *
 * W-13's third ban — no word the reader has not met — is NOT checked here. It
 * needs a judgement about what a first-year already owns, so it stays a
 * read-it-yourself item (see DEBT.md D-4).
 *
 * Expect false positives and read every hit before acting on it. The baseline
 * on 2026-08-01 was 2 of 218, both cleared by reading:
 *   · internal-environment §4 "all four tests" points BACK at the VRIO section
 *     immediately above it, which W-13 permits.
 *   · yield-curve §2 trips on the idiom "over and above".
 * That baseline is the point: at 2, a third hit is worth opening. Exit code is
 * the number of flags, so this can gate a script if that is ever wanted.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.argv[2] ?? "Schools";

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    // course.mjs is the manifest, not a step.
    else if (entry.endsWith(".mjs") && p.includes("reader") && entry !== "course.mjs") files.push(p);
  }
})(ROOT);

const DEVICE =
  /^(take|consider|imagine|picture|let'?s|suppose|think of|watch|follow along|we will|we'll|in this section)\b/i;
const FORWARD =
  /\b(all (two|three|four|five)|both of (these|them)|the (two|three|four|five) (levels|types|kinds|stages|categories)|as (we|you) (saw|noted)|above|earlier)\b/i;

/* Strip the inline marks first: a term or link wrapping the opening words would
 * otherwise hide the very phrase being tested. */
const plain = (t) =>
  t.replace(/\[\[([^|]+)\|[^\]]*\]\]/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
const firstSentence = (t) => (t.split(/(?<=[.?!])\s/)[0] || t).trim();

let flagged = 0;
let total = 0;

for (const file of files.sort()) {
  const step = (await import(pathToFileURL(file).href)).default;
  for (const [i, section] of (step.sections ?? []).entries()) {
    const p = (section.blocks ?? []).find((b) => b.type === "p");
    if (!p) continue;
    total++;
    const sentence = firstSentence(plain(p.text));
    const tags = [];
    if (DEVICE.test(sentence)) tags.push("DEVICE");
    if (FORWARD.test(sentence)) tags.push("FORWARD-REF");
    if (!tags.length) continue;
    flagged++;
    console.log(`\n!! ${tags.join(" + ")}  ${step.slug} §${i} (${section.id})`);
    console.log(`   ${sentence}`);
  }
}

console.log(
  `\n--- ${flagged} flagged of ${total} section openings across ${files.length} steps` +
    `\n    baseline 2026-08-01: 2 of 218, both false positives (see header).`,
);
process.exit(flagged);
