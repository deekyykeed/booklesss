/* What states a Lordicon Lottie actually carries.
 *
 *   node scripts/lord-states.mjs public/reader/icons/grasp-got.json
 *   node scripts/lord-states.mjs            # every icon in public/reader/icons
 *
 * WHY THIS EXISTS. A Lordicon icon is not one animation, it is several, held in
 * one file as named markers — `in-reveal`, `hover-smile`, `hover-pinch` and so
 * on — and `<lord-icon state="…">` picks between them at render. The player
 * falls back to the default state when a name does not match, SILENTLY, so a
 * typo or a guess does not fail, it just plays the wrong thing.
 *
 * That is worth a script because the same distinction has already cost a
 * download. The first pass at the checkpoint faces used GIFs exported from the
 * `in-reveal` state, which plays when an icon APPEARS — the owner, 2026-08-07:
 * "the mistake i made was having the icons in-reveal instead of on hover or on
 * taps". A GIF bakes that choice into pixels and the only fix is to export
 * again. The Lottie does not: the same file holds the hover state too, so the
 * fix is an attribute. Print the names, pick one that is really in there.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICONS = join(dirname(fileURLToPath(import.meta.url)), "../public/reader/icons");

function statesOf(file) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  /* Lottie markers carry their name in `cm`. Lordicon prefixes each with the
     frame band it belongs to, so "1:hover-smile" and "hover-smile" both turn
     up depending on how the icon was exported — the element wants the part
     after the colon. */
  const markers = (data.markers ?? []).map((m) => String(m.cm ?? "").split(":").pop().trim());
  return { states: [...new Set(markers.filter(Boolean))], frames: data.op, size: [data.w, data.h] };
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : existsSync(ICONS)
    ? readdirSync(ICONS).filter((f) => f.endsWith(".json")).map((f) => join(ICONS, f))
    : [];

if (!targets.length) {
  console.error(`lord-states: nothing to read. Put a Lordicon .json in ${ICONS}`);
  console.error("             (Lordicon → the icon → Download → Lottie)");
  process.exit(1);
}

for (const file of targets) {
  try {
    const { states, frames, size } = statesOf(file);
    console.log(`\n${basename(file)}  ${size[0]}×${size[1]}, ${frames} frames`);
    if (!states.length) {
      console.log("  (no named states — the whole file is one animation, so omit `state`)");
      continue;
    }
    for (const s of states) console.log(`  state="${s}"`);
  } catch (err) {
    console.error(`\n${basename(file)}  NOT a readable Lottie: ${err.message}`);
    process.exitCode = 1;
  }
}
