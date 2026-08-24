/* ------------------------------------------------------------------ *
 * The card-to-page morph, as a module store.
 *
 * Owner, 2026-08-23: "when I tap the course card, I prefer that the whole
 * thing grows into a full-screen page, but it will still be a different page."
 *
 * Both halves of that sentence are load-bearing and they pull against each
 * other. It has to LOOK like one continuous object — the card you pressed is
 * the screen you end up on — and it has to BE a real route, with a URL a
 * student can reload, share, and press Back out of.
 *
 * ⚠️ WHY A MODULE STORE AND NOT COMPONENT STATE. This is the entire reason the
 * file exists. The obvious build is a portal rendered by the card, and it
 * cannot work: the moment the router navigates, the dashboard tree unmounts,
 * the card goes with it, and the overlay that is meant to be covering the
 * screen for the handover vanishes mid-flight. The overlay therefore has to be
 * rendered by something MOUNTED IN THE ROOT LAYOUT, which survives the
 * navigation — and the card, which is three levels down a different subtree,
 * has to be able to talk to it. A module store is how this codebase already
 * solves exactly that shape (see lib/account's requireAccount, published to a
 * root-mounted AuthRedirect).
 *
 * The sequence, and who owns each step:
 *
 *   1. CourseCard measures its own rect and calls `startMorph`.
 *   2. MorphSurface (root layout) draws a fixed clone at that rect wearing the
 *      card's own computed background, then on the next frame animates its
 *      insets and radius to the viewport.
 *   3. At HANDOVER_MS — deliberately before the animation ends — it pushes the
 *      route. The new page paints underneath a clone that has already reached
 *      the page's own background colour, so there is no seam to see.
 *   4. The destination calls `endMorph` on mount, which fades the clone out.
 *
 * FAIL-OPEN, ALWAYS. Every path that cannot animate — reduced motion, a
 * missing element, a stale morph nothing cleared — still navigates. A student
 * who cannot see an animation must never be a student who cannot open a
 * course.
 * ------------------------------------------------------------------ */

export type MorphState = {
  /** Viewport-relative insets of the source card, in px. */
  top: number;
  left: number;
  right: number;
  bottom: number;
  /** The card's own corner radius, so the clone starts genuinely identical. */
  radius: string;
  /** Its computed background — colour and the gradient layers on top. */
  background: string;
  backgroundColor: string;
  /** Drawn inside the clone while it grows, then faded. */
  title: string;
  /** Where this is going. Held so a late `endMorph` can tell whether the page
   *  that mounted is the one the morph was aimed at. */
  href: string;
};

/** When the route is pushed, relative to the start of the growth.
 *
 *  Shorter than the 620ms CSS transition on purpose: the clone has reached the
 *  destination's background colour well before it finishes moving, so pushing
 *  early means the new page is already painted and settled behind a surface
 *  that is the same flat colour. Push on completion instead and the student
 *  sees a beat of nothing between the two. */
export const HANDOVER_MS = 520;

/** How long the filled clone lingers after the destination says it is ready. */
export const FADE_MS = 260;

type Listener = () => void;

let state: MorphState | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeMorph(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function morphState(): MorphState | null {
  return state;
}

/** Server snapshot — there is never a morph in flight during SSR. */
export function morphServerState(): MorphState | null {
  return null;
}

export function startMorph(next: MorphState) {
  state = next;
  emit();
}

/** Called by the destination page once it has mounted. */
export function endMorph() {
  if (!state) return;
  state = null;
  emit();
}

/**
 * Measure an element and begin a morph toward `href`.
 *
 * Returns false when it declined — a caller that gets false must navigate
 * normally rather than assume the morph will do it. The decline cases are a
 * reader who asked for a still page (both the OS setting and this app's own
 * `data-motion` flag, which the root layout stamps before first paint) and any
 * environment without a live layout to measure.
 */
export function beginMorphFrom(el: HTMLElement, href: string, title: string): boolean {
  if (typeof window === "undefined") return false;

  const still =
    document.documentElement.dataset.motion === "reduced" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (still) return false;

  const r = el.getBoundingClientRect();
  /* A card scrolled fully out of view has nothing to grow from, and a clone
     drawn off-screen would fly in from an edge the student never pressed. */
  if (r.width < 1 || r.height < 1) return false;

  const cs = window.getComputedStyle(el);

  startMorph({
    top: Math.round(r.top),
    left: Math.round(r.left),
    right: Math.round(window.innerWidth - r.right),
    bottom: Math.round(window.innerHeight - r.bottom),
    radius: cs.borderRadius,
    background: cs.backgroundImage,
    backgroundColor: cs.backgroundColor,
    title,
    href,
  });
  return true;
}
