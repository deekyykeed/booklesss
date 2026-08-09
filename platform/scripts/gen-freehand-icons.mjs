// Regenerates src/components/icons/freehand.tsx from the two free Freehand sets.
//   npm run gen:freehand
//
// Same trick as gen-icons.mjs and gen-solar-icons.mjs (and gen-ultimate-icons.mjs,
// which this replaced and which is now only in git history):
// each set is 1,000 icons, so importing one into a client component would ship
// the lot to the browser. The names below are resolved here, at author time, and
// only their path bodies land in the generated module.
//
// TWO SETS, ONE MARK. Owner, 2026-08-09: "use a grayed out Freehand line Free
// and then when active use freehand Duotone free." So every icon here is drawn
// TWICE, from two different packages that happen to share a name:
//   rest → @iconify-json/streamline-freehand        (Freehand Line - Free)
//   full → @iconify-json/streamline-freehand-color  (Freehand Duotone - Free)
// Both are CC BY 4.0, both on a 24px grid with the family's modulated
// hand-drawn stroke, and 982 of their 1,000 names overlap — which is what makes
// a two-state mark possible without drawing anything by hand. A name missing
// from EITHER set throws below rather than silently rendering one state.
//
// WHY THIS IS A DIFFERENT MECHANISM FROM ultimate.tsx, which also has
// rest/full. There the two states are DERIVED — one body, with its coloured
// fills swapped for a neutral by regex, because that family is multicolour and
// has no line-only twin. Here the two states are two genuinely different
// drawings that the foundry made, so nothing is rewritten: rest is the line
// icon exactly as shipped, full is the duotone icon exactly as shipped.
//
// THE REST STATE KEEPS `currentColor`, deliberately. The line set draws in
// currentColor, so "grayed out" stays a CSS decision (`.grasp-btn` sets the
// colour) rather than a hex baked into this file — one value to tune when the
// grey is wrong, in the place where the rest of the row's colours live. The
// duotone bodies carry their own #020202 line and #0c6fff accent and ignore
// currentColor entirely, which is the point of them.
import { getIconData, iconToSVG } from "@iconify/utils";
import lineSet from "@iconify-json/streamline-freehand/icons.json" with { type: "json" };
import duoSet from "@iconify-json/streamline-freehand-color/icons.json" with { type: "json" };
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ICONS = [
  /* THE THREE ANSWERS (reader/Checkpoint.tsx). Owner, 2026-08-09: "the icons
     will now be love it, hate it or Save for later."

     Two of these are feelings and one is a decision, which is why the third is
     not a face. A scale of three faces was the right drawing when the question
     was "how much of this landed"; the question is now what the reader wants to
     DO about the section, and the honest picture of "save for later" is an
     object you come back to, not an expression.

     WHY A BOOKMARKED BOOK and not a clock: `time-clock-circle` is already the
     "Too long" mark in the note menu below, and the two marks appear in the same
     row. A clock meaning "later" on the right and "too long" on the left is one
     picture with two jobs. */
  "smiley-grumpy", // hate it
  "book-bookmark", // save for later
  "smiley-thrilled", // love it

  /* THE FLAG, and the five verdicts it collapses into (reader/SectionNote.tsx +
     lib/step-notes.ts). The whole row moves to this family together — a line
     mark beside a drawn one would read as two systems.

     TWO SUBSTITUTIONS THE ULTIMATE SET FORCED ARE UNDONE HERE, which is worth
     recording because it is the reason the swap improves the menu rather than
     just restyling it. That set has no plain lightbulb and no plain warning
     triangle, so "Clear" settled for a green tick and "Something looks wrong"
     for a red cross (both argued in gen-ultimate-icons.mjs). Freehand has both
     drawings, so each row now carries the picture the reason actually wanted. */
  /* ⚠️ THE FLAG IS NOT A FLAG ANY MORE, and this is the one place the family
     swap cost something. THE FREE SET HAS NO PLAIN FLAG — checked by name and
     by semantic search, twice. Its only match, `learning-programming-flag`, is
     a pennant with `</>` written on it, which at 20px reads as a code icon
     sitting under every section of a finance step. It was generated, rendered
     and rejected on sight rather than reasoned about, which is the only way to
     catch this class of mistake.
     `notes-paper` instead: a page with a turned corner, the simplest silhouette
     of the nine candidates rendered side by side at shipping size. It also
     happens to name the control correctly — the component is SectionNote and
     the store is lib/step-notes, so "leave a note" was always what the button
     did, and "flag" was the metaphor laid over it.
     If a real flag matters more than the family does, it is in Ultimate Colors
     (git history, gen-ultimate-icons.mjs) or in the PAID Freehand set. */
  "notes-paper", // unasked — the button before any verdict is given
  "creativity-idea-bulb", // clear — the bulb the Ultimate set could not supply
  "help-question-circle", // hard to follow
  "time-clock-circle", // too long
  "form-edition-clipboard", // needs an example
  "alerts-warning-triangle", // something looks wrong — a real triangle at last
];

const bodies = {};
for (const name of ICONS) {
  const line = getIconData(lineSet, name);
  const duo = getIconData(duoSet, name);
  /* Named separately so the error says WHICH set is missing it. 18 of the 1,000
     names differ between the two, and a mark that exists only in line would
     otherwise ship with no chosen state — invisible until someone taps it. */
  if (!line) throw new Error(`unknown icon "${name}" in streamline-freehand (line)`);
  if (!duo) throw new Error(`unknown icon "${name}" in streamline-freehand-color (duotone)`);

  const { body: rest } = iconToSVG(line, { height: "none" });
  const { body: full } = iconToSVG(duo, { height: "none" });

  /* The two states must actually differ, and each must be the set it claims to
     be. A duotone body carries its own hex fills; a line body draws in
     currentColor. If either assumption ever breaks — a package reshuffle, a set
     renamed upstream — this fails at generation rather than shipping a row where
     tapping a mark changes nothing visible. */
  if (!rest.includes("currentColor")) {
    throw new Error(`rest state for "${name}" has no currentColor — is the line set still the line set?`);
  }
  if (!/fill="#[0-9a-fA-F]{3,8}"/.test(full)) {
    throw new Error(`full state for "${name}" has no hex fill — is the color set still duotone?`);
  }
  bodies[name] = { full, rest };
}

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "components", "icons", "freehand.tsx");
const union = ICONS.map((n) => `  | "${n}"`).join("\n");
const q = (s) => `'${s.replace(/'/g, "\\'")}'`;
const entries = ICONS.map(
  (n) => `  "${n}": {\n    full:\n      ${q(bodies[n].full)},\n    rest:\n      ${q(bodies[n].rest)},\n  },`,
).join("\n");

writeFileSync(
  OUT,
  `/* AUTO-GENERATED by scripts/gen-freehand-icons.mjs — do not edit by hand.
 *
 * Streamline · Freehand Line (Free) + Freehand Duotone (Free), resolved from the
 * local @iconify-json/streamline-freehand and -freehand-color packages at
 * generation time. Add a name to ICONS in the script and rerun
 * \`npm run gen:freehand\`.
 *
 * CC BY 4.0 — attribution is owed, alongside the MynaUI, Streamline Plump,
 * Ultimate and Kameleon credits.
 *
 * TWO BODIES PER ICON, FROM TWO SETS. \`rest\` is the Line drawing and inherits
 * \`currentColor\`, so the grey is set in CSS. \`full\` is the Duotone drawing and
 * carries its own #020202 line with a #0c6fff accent, so it ignores
 * currentColor — the colour arriving IS the selected state.
 *
 * That is the owner's rule for this row (2026-08-09): grey line at rest, duotone
 * when active. It differs from ultimate.tsx, where both states are derived from
 * one multicolour body; here they are two drawings the foundry shipped.
 */

import type { CSSProperties } from "react";

export type FreehandIconName =
${union};

const BODIES: Record<FreehandIconName, { full: string; rest: string }> = {
${entries}
};

/**
 * One Freehand icon, inlined as SVG. Safe in server and client components
 * alike: no set is imported at runtime, only the bodies above.
 *
 * \`muted\` draws the Line state, which takes its colour from CSS. Unmuted draws
 * the Duotone state, which brings its own.
 */
export function FreehandIcon({
  name,
  size = 20,
  muted = false,
  className,
  style,
}: {
  name: FreehandIconName;
  size?: number;
  muted?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: muted ? BODIES[name].rest : BODIES[name].full }}
    />
  );
}
`,
  "utf8",
);

console.log(`Wrote ${ICONS.length} icons to ${OUT}`);
