// Regenerates src/components/icons/myna.tsx from @iconify-json/mynaui.
//   npm run gen:icons
//
// Why generate instead of importing the set: the whole MynaUI JSON is ~2,650
// icons, and half the app's icons sit in client components ("use client"), where
// importing it would ship the entire set to the browser. The names ICONS lists
// below are resolved here, at author time, and only their path bodies land in
// the generated module — which then works in server and client components
// alike. Adding an icon is one line here plus a rerun.
import { getIconData, iconToSVG } from "@iconify/utils";
import mynaui from "@iconify-json/mynaui/icons.json" with { type: "json" };
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/* Every icon the UI draws, grouped by where it's used so an unused one is
 * obvious. `-solid` is MynaUI's filled variant, which the sidebars use to mark
 * the current row — line at rest, solid when active. */
const ICONS = [
  // chrome: header, search, drawers, rails
  "search",
  "question-circle",
  "info-circle",
  "zap",
  "menu",
  "sidebar",
  /* The section-note button, owner's pick 2026-08-02. Third mark on it that
     day: "chat" → "chat-dots" → a Solar Duotone bubble → this. A bubble of any
     kind promises a conversation, and there isn't one; the button opens a
     short list of ways the section read. An "i" promises nothing and reads at
     20px, which the bubble's dots barely did.
     It also puts the row back on one set: two faces and this, all MynaUI
     hairlines, after the Duotone bubble sat filled beside two outlines. */
  "info-circle",
  "info-circle-solid",
  /* Marks a commented section in the right panel's comment list. It briefly sat
     in the checkpoint row as a third button and the owner moved commenting into
     the panel instead (2026-08-02), so there is no line/solid pair here any
     more — nothing toggles, it just labels a row. */
  "message-dots",
  "external-link",
  "chevron-down",
  /* The Appearance segmented on /settings — system, light, dark. */
  "monitor",
  "sun",
  "moon",
  "chevron-right",
  // home rail destinations
  "layout-dashboard",
  "layout-dashboard-solid",
  "book-open",
  "book-open-solid",
  "clipboard",
  "clipboard-solid",
  "calendar",
  "calendar-solid",
  "cog",
  "cog-solid",
  /* The end-of-section answer. Fourth mark pair on this control in one day
     (2026-08-02): labels off → bookmark + ticked circle → Solar Duotone thumbs
     → these, the owner's pick from MynaUI's own smile search. A face answers
     "how did that land" without a word, which is what a label-less row needs,
     and the round pair reads at 20px where the square and ghost variants do
     not. The bookmark, tick and thumbs pairs below are kept: /old-home and the
     dashboard still draw some of them. */
  "smile",
  "smile-solid",
  "sad",
  "sad-solid",
  "bookmark",
  "bookmark-solid",
  "check-circle",
  "like",
  "like-solid",
  "circle-half",
  "circle-half-solid",
  "dislike",
  "dislike-solid",
  // progress + the dashboard's stat tiles (check-circle above serves both)
  "check",
  /* Callout kinds — the mark at the top-left of an in-text container, saying
     what kind of container it is (see CALLOUTS in reader/LessonView.tsx).
     `clipboard` and `target` are already listed above for the home rail and the
     stat tiles; the dedupe below means naming them twice is safe and keeps each
     use findable from where it is used. */
  "key",
  "danger-triangle",
  "clipboard",
  "target",
  /* The section-note menu's five rows (lib/step-notes.ts → reader/SectionNote).
     A row now carries its own mark on the right instead of a tick appearing
     there when chosen: the mark says WHICH answer the row is, and the line →
     solid swap says whether it is the one given, which is the same pair the
     sidebar rows and the two faces beside this menu already use. A tick could
     only ever say the second thing, and it said it in the slot where the first
     thing should have been.
     Two of them are deliberately the marks the callouts use for the same
     meaning — `clipboard` is "Example" in both places, `danger-triangle` is the
     thing that looks wrong in both. A reader meets one mark per idea. */
  /* The control that OPENS that menu (owner, 2026-08-07: "the one on the far
     left will be a flag, i want students to flag the content"). It is a flag
     until something is flagged, and then it becomes the mark of whatever was
     flagged — one of the five below — so the row says what you said without a
     word. It replaced an "i" in a circle, which asked a question ("how did that
     read?") where a flag makes a claim ("something is wrong here"), and the
     second is what a student actually wants to do mid-read. */
  "flag",
  "flag-solid",
  "lamp", // Clear: it lit up
  "lamp-solid",
  "question-circle-solid", // Hard to follow (line twin is in the chrome above)
  "clock-1-solid", // Too long (line twin is on the dashboard)
  "clipboard-solid", // Needs an example
  "danger-triangle-solid", // Something looks wrong
  /* The school and course rows: an empty box, filled once picked — a checkbox
     in the app's own hand. SQUARE, owner's call 2026-08-04 ("the check can be
     square as well"), after the round pair had been there since the rows were
     built. A square is what a checkbox is everywhere else a student has ever
     used one, and these rows are checkboxes: the course list takes as many as
     you like. One pair for one control: Settings draws these same rows, so the
     round pair came out rather than leaving a student two checkbox shapes for
     the same question depending on where they met it. */
  "square",
  "check-square-solid",
  // The "Other" row's mark, where every university above it draws a crest.
  // An icon rather than a "+" set in a tinted disc: the disc was pretending to
  // be a logo for a university we don't have one for, and at 14px a letterform
  // on a circle is a smudge. This is the one row whose mark is a control.
  "plus",
  "x", // clears its search field
  "chart-bar-increasing",
  "clock-1",
  "target",
  // the header's signed-out account button — a person, where the pill that
  // said "Sign in" used to be (owner, 2026-08-03)
  "user",
  // the parked /old-home scratch rail
  "users",
  "puzzle",
  "chart-bar",
  "credit-card",
  "download", // the "add to home screen" prompt on the dashboard
  /* Sharing a course or a step. `link` is what the button falls back to when
     the device has no native share sheet — the action is then "copy the link",
     and a share glyph would promise a sheet that isn't going to open. */
  "share",
  "link",
  /* The password field's reveal toggle (components/auth/AuthForm). A password
     you cannot read is a password you cannot check before submitting, and this
     app is used one-thumbed on a phone where a typo is likelier than not.
     `eye-off` and NOT `eye-slash` — MynaUI names it the first way, and the
     generator throws on a name the set doesn't carry rather than rendering an
     empty box. */
  "eye",
  "eye-off",
];

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "components", "icons", "myna.tsx");

// A name listed twice (an icon shared by two surfaces) would emit a duplicate
// key and fail the TS build — dedupe so the same icon can be listed under
// each place it's used without a landmine.
const NAMES = [...new Set(ICONS)];

const bodies = {};
for (const name of NAMES) {
  const data = getIconData(mynaui, name);
  if (!data) throw new Error(`Unknown MynaUI icon: "${name}"`);
  // 24-grid, stroke-based: the body keeps stroke="currentColor", so colour and
  // stroke width are still the caller's to set.
  bodies[name] = iconToSVG(data, { height: 24, width: 24 }).body;
}

const union = NAMES.map((n) => `  | "${n}"`).join("\n");
const entries = NAMES.map((n) => `  "${n}":\n    '${bodies[n].replace(/'/g, "\\'")}',`).join("\n");

writeFileSync(
  OUT,
  `/* AUTO-GENERATED by scripts/gen-icons.mjs — do not edit by hand.
 *
 * MynaUI Icons (by Praveen Juge), resolved from the local @iconify-json/mynaui
 * package at generation time. Add a name to ICONS in the script and rerun
 * \`npm run gen:icons\`.
 */

import type { CSSProperties } from "react";

export type MynaIconName =
${union};

/* Path bodies only — a 24-grid viewBox is added by the component. Each keeps
 * stroke="currentColor", so an icon takes the colour of the text around it. */
const BODIES: Record<MynaIconName, string> = {
${entries}
};

/**
 * One icon, inlined as SVG. Safe in server and client components alike: no set
 * is imported at runtime, only the bodies above.
 *
 * \`strokeWidth\` overrides MynaUI's 1.5 — worth nudging down when an icon is
 * drawn large, or up at 14px and below where 1.5 goes faint.
 */
export function MynaIcon({
  name,
  size = 20,
  className,
  style,
  strokeWidth,
}: {
  name: MynaIconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
}) {
  const body = strokeWidth
    ? BODIES[name].replace(/stroke-width="[^"]*"/g, \`stroke-width="\${strokeWidth}"\`)
    : BODIES[name];

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
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
`,
  "utf8",
);

console.log(`Wrote ${NAMES.length} icons to ${OUT}`);
