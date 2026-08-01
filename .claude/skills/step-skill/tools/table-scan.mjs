/* Definitional-table scan — the evidence behind rule E-9.
 *
 *   node .claude/skills/step-skill/tools/table-scan.mjs Schools
 *
 * A `table` earns its place when figures have to line up. A table of *kinds* —
 * levels, types, structures, roles — has nothing to line up, and on a phone its
 * last column wraps one word per line and clips. Those are the ones E-9 says
 * should be `cards`.
 *
 * The test is mechanical: a table is DEFINITIONAL when no cell in it contains a
 * number. It is a WORKING when cells carry figures. Between them sits a third
 * kind the script reports separately — mostly-prose tables that happen to hold
 * a year or a percentage — because those need a human to call.
 *
 * Reports the longest cell in each definitional table, since that is what
 * actually breaks the layout: a 60-character cell in a three-column table on a
 * 390px screen is roughly one word per line.
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
    else if (entry.endsWith(".mjs") && p.includes("reader") && entry !== "course.mjs") files.push(p);
  }
})(ROOT);

const HAS_DIGIT = /\d/;
const rows = [];

for (const file of files.sort()) {
  const step = (await import(pathToFileURL(file).href)).default;
  for (const section of step.sections ?? []) {
    for (const b of section.blocks ?? []) {
      if (b.type !== "table") continue;
      const cells = (b.rows ?? []).flat().filter((c) => typeof c === "string");
      if (!cells.length) continue;
      const numeric = cells.filter((c) => HAS_DIGIT.test(c)).length;
      const longest = cells.reduce((a, c) => Math.max(a, c.length), 0);
      const kind = numeric === 0 ? "DEFINITIONAL" : numeric / cells.length < 0.2 ? "mostly-prose" : "working";
      const n = (b.rows ?? []).length;
      rows.push({ kind, slug: step.slug, section: section.id, cols: b.columns?.length ?? 0, n, longest });
    }
  }
}

const order = { DEFINITIONAL: 0, "mostly-prose": 1, working: 2 };
rows.sort((a, b) => order[a.kind] - order[b.kind] || b.longest - a.longest);

/* E-9 caps a `cards` block at four items, so a definitional table only becomes
 * cards if it is short. A ten-row list of types is still a list; it wants a
 * `ul` or to stay a table. Flagging the short ones is the whole point. */
const candidate = (r) => r.kind === "DEFINITIONAL" && r.n >= 2 && r.n <= 4;

for (const r of rows) {
  if (r.kind === "working") continue;
  console.log(
    `${candidate(r) ? "CARDS?" : "      "} ${r.kind.padEnd(13)} ${r.n}row ${r.cols}col ` +
      `longest-cell:${String(r.longest).padStart(3)}  ${r.slug} §${r.section}`,
  );
}

const n = (k) => rows.filter((r) => r.kind === k).length;
console.log(
  `\n--- ${rows.length} tables in ${files.length} steps: ` +
    `${n("DEFINITIONAL")} definitional, ${n("mostly-prose")} mostly-prose (judge each), ` +
    `${n("working")} workings (leave alone)` +
    `\n    ${rows.filter(candidate).length} are CARDS? candidates: definitional AND 2-4 rows.` +
    `\n    The rest are definitional but too long for cards — leave as tables or make them a ul.`,
);
