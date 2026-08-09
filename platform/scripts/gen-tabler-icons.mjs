// Regenerates src/components/icons/tabler.tsx from the free Tabler set.
//   npm run gen:tabler
//
// Same trick as gen-icons.mjs, gen-mingcute-icons.mjs and gen-solar-icons.mjs
// (and gen-freehand-icons.mjs, which this replaced and which is now only in git
// history): the set is 6,426 icons, so importing it into a client component
// would ship the lot to the browser. The names below are resolved here, at
// author time, and only their path bodies land in the generated module.
//
// TABLER, FREE (owner, 2026-08-09: "switch to the icons from tabler free").
// One package, @iconify-json/tabler, MIT — no attribution owed, which makes it
// the only family in this app that costs nothing but a credit we already give
// by choice. 24px grid, 2px stroke.
//
// ONE NAME, TWO STATES, RESOLVED BY THE GENERATOR. Every entry in ICONS is a
// base name; the chosen state is that name plus `-filled`, looked up here. That
// is deliberately NOT a template literal in the component — a string built at
// runtime is opaque to the compiler and would let a missing twin render nothing
// at all. Resolved at generation, a missing `-filled` is a throw before anything
// ships. (lib/step-notes.ts carries the history of that mistake being made.)
//
// WHY THIS IS A SIMPLER MECHANISM THAN THE TWO IT REPLACED, and the difference
// is the whole reason to prefer it:
//   ultimate.tsx  one multicolour body, rest state DERIVED by regex, because
//                 that family ships no line-only twin.
//   freehand.tsx  two packages that happen to share 982 of 1,000 names, so a
//                 name present in one and not the other had to throw.
//   here          one package, one naming convention, both states drawn in
//                 `currentColor`.
//
// BOTH STATES INHERIT `currentColor`, which is the real gain. Freehand Duotone
// brought its own #020202 and #0c6fff, so the chosen colour was a property of
// the artwork and could only be changed by rewriting the generated file. Here
// rest AND chosen are both CSS decisions, sitting in globals.css beside the rest
// of the row's colours: grey outline at rest, ink fill when chosen, one value
// each. Giving the chosen state a hue again is one line there, not a regex here.
import { getIconData, iconToSVG } from "@iconify/utils";
import tabler from "@iconify-json/tabler/icons.json" with { type: "json" };
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

     WHY A BOOKMARK AND NOT A CLOCK: `clock` is already the "Too long" mark in
     the note menu below, and the two marks appear in the same row. A clock
     meaning "later" on the right and "too long" on the left is one picture with
     two jobs. */
  "mood-sad", // hate it
  "bookmark", // save for later
  "mood-happy", // love it

  /* THE FLAG, and the five verdicts it collapses into (reader/SectionNote.tsx +
     lib/step-notes.ts). The whole row moves families together — a Tabler mark
     beside a hand-drawn one would read as two systems.

     ⚠️ IT IS A FLAG AGAIN, and that is the one thing this swap gives back.
     The owner asked for a flag on 2026-08-07 ("i want students to flag the
     content"). Streamline Freehand Free has no plain flag — its only match,
     `learning-programming-flag`, is a pennant with `</>` on it that reads as a
     code icon at 20px — so the button settled for `notes-paper` and the
     component's comments have been apologising for the substitute ever since.
     Tabler draws `flag` and `flag-filled`, so the metaphor and the picture agree
     for the first time. `notes-paper`'s consolation argument (that the component
     is SectionNote and the store is lib/step-notes, so "leave a note" was always
     the job) was a good rationalisation of a constraint, not a preference — the
     constraint is gone, so it goes with it. */
  "flag", // unasked — the button before any verdict is given
  "bulb", // clear
  "help-circle", // hard to follow
  "clock", // too long
  "clipboard-text", // needs an example
  "alert-triangle", // something looks wrong
];

const bodies = {};
for (const name of ICONS) {
  const outline = getIconData(tabler, name);
  const filled = getIconData(tabler, `${name}-filled`);
  /* Named separately so the error says WHICH half is missing. Not every Tabler
     outline has a filled twin, and a mark without one would ship with no chosen
     state — invisible until someone taps it. */
  if (!outline) throw new Error(`unknown icon "${name}" in @iconify-json/tabler`);
  if (!filled) throw new Error(`"${name}" has no "-filled" twin in @iconify-json/tabler`);

  const { body: rest } = iconToSVG(outline, { height: "none" });
  const { body: full } = iconToSVG(filled, { height: "none" });

  /* Each state must actually be the kind it claims to be, and the two must
     differ. Tabler draws its outlines with `stroke="currentColor"` and its
     filled icons with `fill="currentColor"`; if that ever stops being true —
     a set reshuffle, a name that turns out to be an alias of its own twin —
     this fails at generation rather than shipping a row where tapping a mark
     changes nothing visible. */
  if (!/stroke="currentColor"/.test(rest)) {
    throw new Error(`rest state for "${name}" is not stroked in currentColor`);
  }
  if (!/fill="currentColor"/.test(full)) {
    throw new Error(`full state for "${name}-filled" is not filled in currentColor`);
  }
  if (rest === full) throw new Error(`"${name}" draws the same body in both states`);

  bodies[name] = { full, rest };
}

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "components", "icons", "tabler.tsx");
const union = ICONS.map((n) => `  | "${n}"`).join("\n");
const q = (s) => `'${s.replace(/'/g, "\\'")}'`;
const entries = ICONS.map(
  (n) => `  "${n}": {\n    full:\n      ${q(bodies[n].full)},\n    rest:\n      ${q(bodies[n].rest)},\n  },`,
).join("\n");

writeFileSync(
  OUT,
  `/* AUTO-GENERATED by scripts/gen-tabler-icons.mjs — do not edit by hand.
 *
 * Tabler Icons (free), resolved from the local @iconify-json/tabler package at
 * generation time. Add a name to ICONS in the script and rerun
 * \`npm run gen:tabler\`.
 *
 * MIT — no attribution is required, unlike the MynaUI, Streamline Plump,
 * Kameleon and Freehand credits this app does owe.
 *
 * TWO BODIES PER ICON, FROM ONE SET: \`rest\` is the outline and \`full\` is its
 * \`-filled\` twin, paired by the generator so a missing twin is a build error
 * rather than a blank space. BOTH draw in \`currentColor\`, so both the grey at
 * rest and the ink when chosen are set in CSS — see \`.grasp-btn\` in globals.css.
 */

import type { CSSProperties } from "react";

export type TablerIconName =
${union};

const BODIES: Record<TablerIconName, { full: string; rest: string }> = {
${entries}
};

/**
 * One Tabler icon, inlined as SVG. Safe in server and client components alike:
 * no set is imported at runtime, only the bodies above.
 *
 * \`muted\` draws the outline; unmuted draws the filled twin. Neither carries a
 * colour of its own — the caller's \`color\` is the whole state model.
 */
export function TablerIcon({
  name,
  size = 20,
  muted = false,
  className,
  style,
}: {
  name: TablerIconName;
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
