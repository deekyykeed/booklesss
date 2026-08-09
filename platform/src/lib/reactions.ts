"use client";

import type { Grasp } from "./progress-shared";

/* ------------------------------------------------------------------ *
 * The server copy of how a section landed. WRITE ONLY.
 *
 * This module read as well as wrote for exactly one day. The tally beside each
 * face (owner, 2026-08-08: "can I have numbers after each of the 3 icons") was
 * removed on 2026-08-09 — the reasoning is at the top of `Checkpoint.tsx`, and
 * the short version is that a private question does not want an audience.
 *
 * WHAT WENT WITH IT: a module-level cache keyed by lesson, a `useSectionCounts`
 * hook every checkpoint subscribed to, one fetch per step, and an optimistic
 * local bump so the reader's own tap moved the number under their thumb. All of
 * it is in git alongside the GET it called. Nothing here needs to know what
 * anyone else answered any more, so none of it is kept "just in case" — a cache
 * with no reader is a thing that goes stale silently.
 *
 * WHAT STAYS, AND WHY IT IS THE HALF WORTH HAVING: every answer still reaches
 * `section_reactions`. The question a per-device store can never answer is
 * WHICH SECTIONS LOSE PEOPLE, and that one is for whoever rewrites the step
 * rather than for the person reading it. Losing the tally costs nothing there.
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Called from `rate()` and from the un-answer path, AFTER localStorage has been
 * written. That order is the contract: the device's copy is the one the reader
 * sees, and this is the copy that can be counted. If this fails, the reader's own
 * answer is unaffected and they are told nothing, because there is nothing they
 * could do about it.
 *
 * `grasp: null` deletes the row. Without it, taking an answer back would leave a
 * vote counted forever and the table would only ever climb.
 * ------------------------------------------------------------------ */
export function recordReaction(lessonId: string, sectionId: string, grasp: Grasp | null): void {
  void fetch("/api/reaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson: lessonId, section: sectionId, grasp }),
    /* Survives the page being navigated away from mid-request, which is exactly
       what a tap on the last checkpoint of a step tends to be followed by. */
    keepalive: true,
  }).catch(() => {
    /* Fail soft, and silently. See the note above. */
  });
}
