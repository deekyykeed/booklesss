/* The grasp vocabulary, and nothing else.
 *
 * WHY IT IS ITS OWN FILE. `lib/progress` is `"use client"` — it is a store built
 * on `useSyncExternalStore` and localStorage — and /api/reaction is a route
 * handler. A server module cannot import a client one without dragging React and
 * a browser-only store into a request, so the three values both sides have to
 * agree on live here, where either can import them.
 *
 * THE ALTERNATIVE WAS RETYPING THE LIST IN THE ROUTE, and this codebase has
 * already paid for that once: `seed-course.mjs` kept a hand-copied list of glyph
 * names with a "keep in step with CARD_GLYPHS" comment, three glyphs were added
 * to one and not the other, and the guard started rejecting marks the reader drew
 * perfectly well. A validator that disagrees with the thing it validates is worse
 * than no validator. One list, two importers.
 *
 * `progress.tsx` re-exports all three so no call site had to change.
 */

/** How well a section landed, in the reader's own words — three steps: got it,
 *  sort of, not yet. Three because the middle has to mean something, and finer
 *  gradations were more scale than a self-rating can honestly carry. */
export type Grasp = "got" | "almost" | "not";

export const GRASPS: Grasp[] = ["got", "almost", "not"];

/** What each answer is worth when a step's answers are averaged. */
export const GRASP_WEIGHT: Record<Grasp, number> = {
  got: 1,
  almost: 0.5,
  not: 0,
};

export const isGrasp = (v: unknown): v is Grasp => (GRASPS as string[]).includes(v as string);
