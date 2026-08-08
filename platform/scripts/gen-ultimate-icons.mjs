// Regenerates src/components/icons/ultimate.tsx from
// @iconify-json/streamline-ultimate-color.
//   npm run gen:ultimate
//
// Same trick as gen-icons.mjs and gen-solar-icons.mjs: the set is 998 icons, so
// importing it into a client component would ship the lot to the browser. The
// names below are resolved here, at author time, and only their path bodies land
// in the generated module.
//
// Streamline · Ultimate Colors (Free), CC BY 4.0. The reader already draws this
// family in reader/file-icons.tsx, where it was HAND-INLINED. This script is the
// reproducible route to the same set, so anything added from here on can be
// regenerated rather than retraced.
//
// THESE ARE MULTICOLOUR AND IGNORE currentColor. Each icon carries its own
// fills (a yellow face, a pink flag) plus #191919 line work. That is the whole
// point of the family — the colour is what makes a reaction readable at a
// glance — so none of it is rewritten to take the text colour.
import { getIconData, iconToSVG } from "@iconify/utils";
import ultimate from "@iconify-json/streamline-ultimate-color/icons.json" with { type: "json" };
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ICONS = [
  /* The step's feedback row (reader/Checkpoint.tsx + reader/SectionNote.tsx).
     Owner, 2026-08-08: "use the ultimate colours free icons to find reaction
     icons … 3 icons indicating the 3 main reactions someone would have about
     what they've just read."

     The flag is the left-hand container on its own: a verdict on the WRITING,
     which opens the five-reason menu.

     The three faces are the right-hand container, and they map onto the three
     values `Grasp` has always had (lib/progress: got | almost | not), so the
     dashboard's weighting is untouched and no stored answer changes meaning.

     WHY THESE THREE, since the choice is not obvious from the names. The free
     set has ten faces and NO neutral or confused one, checked exhaustively
     (`smiley` matches 10 faces; `confus` matches nothing). A three-step scale
     therefore has to be built from what is there, and these are the three that
     read as one scale rather than three moods: an open grin, a flat mouth with
     half-lidded eyes, and a plain frown. Rejected: `smiley-mad` is red and
     furious, which is not what "not yet" means; `smiley-unhappy-1` is a weaker
     version of `smiley-sad-1`, so using both would make the bottom two steps
     the same picture; `smiley-cheerful` and `smiley-smile-1` are both a smile,
     so neither works as the middle beside `smiley-happy`. */
  "flag",
  "smiley-happy", // got — "yes, that landed"
  "smiley-disapointed", // almost — flat mouth, the closest thing to a neutral
  "smiley-sad-1", // not — "lost me"

  /* THE FLAG BECOMES WHAT WAS FLAGGED (owner, 2026-08-08: "find icons to
     replace the flag when I tap something, from the same set"). One per row of
     the five-reason menu in lib/step-notes, so a reader scrolling back through a
     step sees WHICH verdict they left without opening anything. The owner asked
     for this on 2026-08-07 and it was lost when the flag moved to this family;
     these five are what brings it back.

     Chosen to read as one row: every one is a single object, no scene, and no
     two share a silhouette. The set forced two substitutions worth recording,
     because the obvious pick does not exist in it:
       · "Clear" wanted a lightbulb. There is no plain bulb — `idea-strategy` is
         a bulb over three shapes on a stand, which is a diagram at 20px, and
         `office-desk-lamp` reads as furniture. A green tick says "this worked"
         at least as well and survives being small.
       · "Something looks wrong" wanted a warning triangle. There is no plain
         one either: `monitor-warning` and `car-dashboard-warning` are both
         scenes with a triangle in them. A red X in a circle is unambiguous and
         is the only red mark in the row.
     Two blues sit beside each other (the question bubble and the clock) and that
     is fine — a speech bubble and a clock face are nothing like each other in
     outline, which is what separates marks at this size, not hue. */
  "check", // clear — green tick
  "question-help-message", // hard to follow — a question in a bubble
  "time-clock-circle", // too long — a clock
  "task-list-text-1", // needs an example — a clipboard, as the MynaUI one was
  "delete-2", // something looks wrong — a red cross
];

/* The colour a rest-state fill is swapped to.
 *
 * ⚠️ DO NOT REPLACE THIS WITH A CSS FILTER. That was tried on the drawn faces
 * this row used to carry, and the owner rejected it on a phone (see a793eae,
 * "The unpicked face loses its colour instead of fading out"): `grayscale(1)`
 * plus `opacity: .5` hits the #191919 line work exactly as hard as the coloured
 * fill, so the whole mark goes faint instead of going quiet. That commit solved
 * it with a separately drawn PNG. Doing it in the generator is the same idea
 * without the third file: only the FILLS move, the line work stays at full
 * strength, so an unchosen face is a complete black-line drawing that simply
 * has no colour in it.
 *
 * #ededea rather than a pure grey: it is the warm neutral the row's own border
 * (#e7e7e6) sits in, so a rest face reads as part of the container. */
const REST_FILL = "#ededea";
/** The family's line colour. Never recoloured — it is what survives at rest. */
const LINE = "#191919";

const bodies = {};
for (const name of ICONS) {
  const data = getIconData(ultimate, name);
  if (!data) throw new Error(`unknown icon "${name}" in streamline-ultimate-color`);
  const { body } = iconToSVG(data, { height: "none" });
  /* Every fill that is a colour becomes the neutral. `fill="none"` (the group
     wrapper) and the line colour are left exactly as they are. */
  const rest = body.replace(/fill="(#[0-9a-fA-F]{3,8})"/g, (m, hex) =>
    hex.toLowerCase() === LINE ? m : `fill="${REST_FILL}"`,
  );
  if (rest === body && body.includes('fill="#')) {
    throw new Error(`rest state for "${name}" changed nothing — check the fill pattern`);
  }
  bodies[name] = { full: body, rest };
}

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "components", "icons", "ultimate.tsx");
const union = ICONS.map((n) => `  | "${n}"`).join("\n");
const q = (s) => `'${s.replace(/'/g, "\\'")}'`;
const entries = ICONS.map(
  (n) => `  "${n}": {\n    full:\n      ${q(bodies[n].full)},\n    rest:\n      ${q(bodies[n].rest)},\n  },`,
).join("\n");

writeFileSync(
  OUT,
  `/* AUTO-GENERATED by scripts/gen-ultimate-icons.mjs — do not edit by hand.
 *
 * Streamline · Ultimate Colors (Free), resolved from the local
 * @iconify-json/streamline-ultimate-color package at generation time. Add a name
 * to ICONS in the script and rerun \`npm run gen:ultimate\`.
 *
 * CC BY 4.0 — attribution is owed, alongside the MynaUI, Streamline Plump and
 * Kameleon credits. The same family is hand-inlined in reader/file-icons.tsx;
 * this module is the reproducible route to it.
 *
 * MULTICOLOUR ON PURPOSE. These ignore \`currentColor\`: each carries its own
 * fills plus #191919 line work, because on the feedback row the colour is what
 * separates a reaction from its neighbours at 20px.
 *
 * TWO BODIES PER ICON. \`full\` is the icon as drawn; \`rest\` is the same icon
 * with every coloured fill swapped for a warm neutral and the line work left
 * alone. That is how an unchosen mark goes QUIET without going FAINT — see the
 * long note in the generator, and a793eae for the CSS filter that failed.
 */

import type { CSSProperties } from "react";

export type UltimateIconName =
${union};

const BODIES: Record<UltimateIconName, { full: string; rest: string }> = {
${entries}
};

/**
 * One Ultimate Colors icon, inlined as SVG. Safe in server and client
 * components alike: no set is imported at runtime, only the bodies above.
 *
 * \`muted\` draws the rest state — full line work, no colour.
 */
export function UltimateIcon({
  name,
  size = 20,
  muted = false,
  className,
  style,
}: {
  name: UltimateIconName;
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
