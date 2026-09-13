/* ------------------------------------------------------------------ *
 * QUICK ACTIONS — the two ways back into work that is already started.
 *
 * The home screen's one call to action is the composer: type a question and a
 * session begins. Everything else on the page exists so that a student who is
 * NOT starting from nothing does not have to type their way back in — owner,
 * 2026-08-29: "a few quick actions like getting into a project or into a
 * recent session if it was incomplete".
 *
 * Two kinds, and the distinction is the whole list:
 *   · `project` — a place, always there, entered deliberately.
 *   · `session` — a thing left half-done, which is only worth a row BECAUSE
 *     it is unfinished. A finished session has no business here; it would be
 *     history, and history belongs in the sidebar's own list.
 *
 * ⚠️ THE ROWS BELOW ARE PLACEHOLDER DATA AND THEY DESCRIBE WORK NOBODY DID.
 * This is the same hazard `lib/resource-packs.ts` carries, and it is worse
 * here by one degree: a picker that offers a pack that does not exist is a
 * dead end, whereas "3 of 4 steps · yesterday" is an ASSERTION ABOUT THE
 * PERSON READING IT. It is safe only while `/dashboard` is a reference
 * surface nobody is routed to and no gate stands in front of. **It stops
 * being safe on the same day the auth gates go back on**, and the person
 * putting them back is the one who has to remember this file.
 *
 * This module is the SEAM: the UI reads `quickActions()` and nothing else, so
 * wiring it to the real thing is a change here rather than to the component.
 * When that happens, the two halves come from two places that already exist:
 *   · projects  — `lib/session-nav.ts`, which is client-safe and reads
 *                 `course-nav.json` (course content, no student record).
 *   · sessions  — the progress store (`lib/progress`, synced through
 *                 `/api/state`), which is student data and is exactly why the
 *                 gates matter.
 *
 * ⚠️ NO COURSE CODES AND NO SCHOOL NAMES IN A TITLE OR A META LINE. Standing
 * rule, and every string in here is drawn on screen.
 * ------------------------------------------------------------------ */

export type QuickAction = {
  /** Stable — this is what a click would resolve to once these are real. */
  id: string;
  kind: "project" | "session";
  title: string;
  /** One line under the title: where it stopped, and when. Never a sentence. */
  meta: string;
  /** Where it goes. `#` while the surface is unwired — see the note above. */
  href: string;
};

/* Placeholder set. Deliberately mixed: one session mid-run, one session barely
   begun, one project — because a list that only ever shows one shape hides the
   cases that will actually break the row (a long title, a meta line with three
   parts, a project with no progress to report at all). */
const PLACEHOLDER: QuickAction[] = [
  {
    id: "cash-conversion-cycle",
    kind: "session",
    title: "The cash conversion cycle",
    meta: "3 of 4 steps · yesterday",
    href: "#",
  },
  {
    id: "cost-of-capital",
    kind: "session",
    title: "What capital actually costs",
    meta: "1 of 3 steps · Tuesday",
    href: "#",
  },
  {
    id: "treasury",
    kind: "project",
    title: "Treasury Management",
    meta: "60 steps",
    href: "#",
  },
];

/** The rows the home screen offers. Async on purpose: the real one reads the
 *  progress store, and a caller written against a synchronous list would have
 *  to be rewritten rather than repointed. */
export async function quickActions(): Promise<QuickAction[]> {
  return PLACEHOLDER;
}

/** Synchronous view, for first paint. Drop this when the rows become real —
 *  it exists so the home screen has something to draw before a fetch lands. */
export function quickActionsSnapshot(): QuickAction[] {
  return PLACEHOLDER;
}
