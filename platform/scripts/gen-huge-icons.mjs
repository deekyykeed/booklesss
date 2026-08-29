// Regenerates src/components/icons/huge.tsx from @hugeicons/core-free-icons.
//   npm run gen:icons
//
// THE SOURCE IS HUGEICONS' OWN FREE PACKAGE (@hugeicons/core-free-icons, MIT),
// not a third-party mirror — 14,716 exports against the ~5,065 Iconify carries.
//
// Why generate instead of using @hugeicons/react: that component is the
// official path and would work, but every call site would import an icon
// SYMBOL (`import { Search01Icon } from …`) instead of naming one
// (`name="search"`). This app has kept a semantic vocabulary through three
// icon sets now, and it is what made the last swap a column of edits here
// rather than a rename across two dozen components. Generating also keeps the
// runtime at zero: bodies are strings in the module below, no library ships.
//
// Why generate instead of importing the set:
// and most of this app's icons sit in client components ("use client"), where
// importing it would ship the whole set to the browser. The names in ICONS are
// resolved here, at author time, and only their path bodies land in the
// generated module — which then works in server and client components alike.
//
// ⚠️ THE KEYS ARE THE APP'S OWN VOCABULARY, NOT THE SET'S. Call sites say
// `name="chevron-down"`, not `name="arrow-down-01"`. That indirection is the
// point: this file is the ONLY place that knows which icon library is
// underneath, so the next swap is a column of edits here rather than a rename
// across two dozen components. This set replaced MynaUI on 2026-08-29 and the
// call sites did not have to learn a new naming scheme to do it.
import * as free from "@hugeicons/core-free-icons";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** app name -> Hugeicons name. Grouped by where each is drawn. */
const ICONS = {
  // chrome: header, search, drawers, rails
  search: "search-01",
  "question-circle": "help-circle",
  zap: "flash",
  menu: "menu-01",
  sidebar: "sidebar-left",
  "message-dots": "message-01",
  "chevron-down": "arrow-down-01",
  "chevron-right": "arrow-right-01",
  "chevron-left": "arrow-left-01",
  sort: "sorting-05",
  x: "cancel-01",
  plus: "plus-sign",
  download: "download-01",
  user: "user",

  // the reader
  key: "key-01", // callout: key point
  "danger-triangle": "alert-02", // callout: watch out
  clipboard: "clipboard", // callout: example
  target: "target-01", // callout: in the exam
  check: "tick-02",
  square: "square",
  pencil: "pencil-edit-01",

  // settings, and the parked home rail
  "book-open": "book-open-01",
  calendar: "calendar-03",
  cog: "settings-01",
  monitor: "computer",
  sun: "sun-03",
  moon: "moon-02",
  "arrow-up": "arrow-up-01",

  // auth
  eye: "view",
  "eye-off": "view-off",

  // voice
  microphone: "mic-01",
  "microphone-off": "mic-off-01",
  "telephone-off": "call-end-01",

  /* The course card's completion mark. ⚠️ IT IS A STROKE NOW, NOT A FILL.
     MynaUI shipped `check-circle-solid`; Hugeicons Free is stroke-only, so the
     filled emphasis is gone and this reads lighter than it did. It is the only
     place in the app that used a solid twin, which is why the swap was
     affordable — a surface that needs line-at-rest/solid-when-active needs a
     second signal from somewhere else now. */
  "check-circle-solid": "checkmark-circle-02",

  // the dashboard shell (/dashboard)
  folder: "folder-01", // Projects
  component: "component", // Artifacts
  briefcase: "briefcase-01", // Customize
  bookmark: "bookmark-01", // "Pin projects to keep them here"
  config: "preference-horizontal", // the filter beside "Chats and tasks"
  paint: "paint-brush-01", // Design
  "chat-messages": "bubble-chat", // the sidebar header's chat mode
  code: "source-code", // its code mode
  edit: "pencil-edit-02", // compose, on the New row
  "clock-1": "clock-01", // Scheduled
  "layout-dashboard": "dashboard-square-01", // Home
  /* The pane header's privacy button. The reference drew a ghost and MynaUI
     had one; this set does not, and `incognito` names what the control
     actually does rather than what it used to look like. The KEY was renamed
     with it — a vocabulary entry called "ghost" pointing at a hat and glasses
     is the kind of drift that makes the next person distrust the map. */
  incognito: "incognito",
};

/* ⚠️ GLYPHS THE SET DOES NOT HAVE, drawn on Hugeicons' own 24 grid at its own
 * 1.5 stroke so they sit in a row with it without adjustment. Keep this map as
 * close to empty as possible — every entry is a drawing nobody else maintains,
 * which is exactly the debt the sprite this set replaced had accumulated.
 * Before adding one, check the set again: 5,065 icons is a lot of set. */
const CUSTOM = {
  /* The drawer's hamburger, owner's sketch 2026-08-29: wider spacing than
     `menu-01` and a short third bar. Hugeicons has eleven menu variants and
     none of them is this — `menu-02` is nearest and shortens the TOP bar too,
     which reads as a different mark. Bars at y 4/12/20 (8 apart, against
     menu-01's 7) and the last one half width. */
  menu: "M3 4h18M3 12h18M3 20h9",
};

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "components", "icons", "huge.tsx");
const NAMES = [...new Set([...Object.keys(ICONS), ...Object.keys(CUSTOM)])];

/* kebab -> the package's export name: "arrow-down-01" -> "ArrowDown01Icon". */
const exportName = (kebab) =>
  kebab.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("") + "Icon";

/* React prop -> SVG attribute. The package ships tuple descriptors meant for
   React (`strokeWidth`), and this module emits raw markup. */
const ATTR = { strokeWidth: "stroke-width", strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin", strokeMiterlimit: "stroke-miterlimit",
  strokeDasharray: "stroke-dasharray", fillRule: "fill-rule", clipRule: "clip-rule" };

const bodies = {};
for (const [name, d] of Object.entries(CUSTOM)) {
  bodies[name] = `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${d}"/>`;
}
for (const name of NAMES) {
  if (CUSTOM[name]) continue;
  const key = exportName(ICONS[name]);
  const nodes = free[key];
  if (!nodes) throw new Error(`Unknown Hugeicons icon: "${ICONS[name]}" -> ${key} (for "${name}")`);
  let body = nodes
    .map(([tag, props]) =>
      `<${tag} ` +
      Object.entries(props)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${ATTR[k] ?? k}="${v}"`)
        .join(" ") +
      "/>",
    )
    .join("");
  /* ⚠️ NORMALISED TO 1.5. Most of the set is drawn at 1.5, but a handful of
     icons carry 1.45, 2, 2.5 or 3 — mixing those in one row reads as a wobble
     in weight rather than as a choice, and it would also make the `strokeWidth`
     prop and the .cui `.i > *` rule behave differently icon to icon. */
  body = body.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.5"');
  bodies[name] = body;
}

const union = NAMES.map((n) => `  | "${n}"`).join("\n");
const entries = NAMES.map((n) => `  "${n}":\n    '${bodies[n].replace(/'/g, "\\'")}',`).join("\n");

writeFileSync(
  OUT,
  `/* AUTO-GENERATED by scripts/gen-huge-icons.mjs — do not edit by hand.
 *
 * Hugeicons Free (MIT), resolved from Hugeicons' own @hugeicons/core-free-icons
 * package at generation time. Add a name to ICONS in the script and rerun
 * \`npm run gen:icons\`.
 *
 * The names below are the APP'S vocabulary, not the set's — the mapping to
 * Hugeicons lives in the generator, so swapping sets again never touches a
 * call site.
 */

import type { CSSProperties } from "react";

export type HugeIconName =
${union};

/* Path bodies only — a 24-grid viewBox is added by the component. Each keeps
 * stroke="currentColor", so an icon takes the colour of the text around it,
 * and every stroke-width has been normalised to 1.5. */
const BODIES: Record<HugeIconName, string> = {
${entries}
};

/**
 * One icon, inlined as SVG. Safe in server and client components alike: no set
 * is imported at runtime, only the bodies above.
 *
 * \`strokeWidth\` overrides the set's 1.5 — worth nudging down when an icon is
 * drawn large, or up at 14px and below where 1.5 goes faint.
 */
export function HugeIcon({
  name,
  size = 20,
  className,
  style,
  strokeWidth,
}: {
  name: HugeIconName;
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
);

console.log(`Wrote ${NAMES.length} icons to ${OUT}`);
