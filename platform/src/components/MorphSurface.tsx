"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  FADE_MS,
  HANDOVER_MS,
  morphServerState,
  morphState,
  subscribeMorph,
} from "@/lib/morph";

/* ------------------------------------------------------------------ *
 * The growing clone. Mounted ONCE, in the root layout.
 *
 * See lib/morph.ts for the sequence and for why this cannot live beside the
 * card that starts it: the router unmounts the dashboard tree, and an overlay
 * rendered from inside that tree disappears at exactly the moment it is meant
 * to be covering the handover.
 *
 * ⚠️ PORTALLED TO <body>, NOT RENDERED IN PLACE. `#content-surface` carries
 * `backdrop-filter: blur(16px)`, which makes it a containing block for
 * `position: fixed` descendants exactly as a `transform` would — the trap
 * AskDock paid for on 2026-08-22. This component is high enough in the tree
 * that it would be fine either way today, and it is portalled anyway so that
 * moving it, or wrapping the app in any filtered/transformed layer later,
 * cannot silently pin the clone to a scrolling box.
 * ------------------------------------------------------------------ */

export function MorphSurface() {
  const router = useRouter();
  const state = useSyncExternalStore(subscribeMorph, morphState, morphServerState);

  /* Two flags, because they are two different questions. `full` is "has the
     box been told to grow" — flipping it is what starts the CSS transition.
     `leaving` is "the destination has arrived and this can go". */
  const [full, setFull] = useState(false);
  const [leaving, setLeaving] = useState(false);
  /* The clone outlives `state`: endMorph() clears the store the instant the
     destination mounts, and the clone still has a fade to play. Holding the
     last state here is what lets it finish drawing something. */
  const [held, setHeld] = useState(typeof state === "object" ? state : null);
  const pushed = useRef(false);

  /* Arriving. Two nested frames, not one: a single rAF can still be batched
     into the same style recalculation that created the element, and a
     transition whose start and end values land in one recalc does not run. */
  useEffect(() => {
    if (!state) return;
    setHeld(state);
    setLeaving(false);
    setFull(false);
    pushed.current = false;

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setFull(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [state]);

  /* The handover. Fires while the box is still moving — see HANDOVER_MS.
   *
   * `pushed` guards it because this effect re-runs on every `full` change and
   * a double push would put two entries in the history for one tap, so Back
   * would land the student on the page they just left. */
  useEffect(() => {
    if (!state || !full || pushed.current) return;
    const t = window.setTimeout(() => {
      pushed.current = true;
      router.push(state.href);
    }, HANDOVER_MS - 16);
    return () => window.clearTimeout(t);
  }, [state, full, router]);

  /* Leaving. The store cleared (the destination mounted and called endMorph),
     so fade what is still on screen and then drop it.

     ⚠️ THE SAFETY NET IS THE POINT OF THE SECOND TIMER. If a push fails, or a
     destination forgets to call endMorph, or a route 404s, `state` never
     clears and a black-hole overlay sits over the whole app with nothing
     underneath able to dismiss it. So the clone also gives up on its own after
     a generous ceiling. A morph that ends early is a missed animation; one
     that never ends is a bricked app. */
  useEffect(() => {
    if (state || !held) return;
    setLeaving(true);
    const t = window.setTimeout(() => setHeld(null), FADE_MS);
    return () => window.clearTimeout(t);
  }, [state, held]);

  useEffect(() => {
    if (!state) return;
    const bail = window.setTimeout(() => setHeld(null), 6000);
    return () => window.clearTimeout(bail);
  }, [state]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !held) return null;

  return createPortal(
    <div
      className="card-morph"
      aria-hidden="true"
      data-full={full ? "true" : undefined}
      style={{
        top: held.top,
        left: held.left,
        right: held.right,
        bottom: held.bottom,
        borderRadius: held.radius,
        backgroundColor: held.backgroundColor,
        backgroundImage: held.background,
        opacity: leaving ? 0 : 1,
        transitionProperty: leaving
          ? "opacity"
          : "inset, border-radius, background-color, border-color, box-shadow",
        transitionDuration: leaving ? `${FADE_MS}ms` : undefined,
        /* Nothing on this surface is reachable — it is a picture of a card
           mid-flight, and a stray tap on it during the handover would land on
           whichever page happened to be underneath. */
        pointerEvents: "none",
      }}
    >
      {/* The card's title, held still in the corner it started in while the box
          grows around it. It is here so the clone is recognisably the card that
          was pressed rather than an anonymous rectangle — and it fades rather
          than scaling, because text tweened across 620ms is text that is blurry
          for 620ms. */}
      <span
        className="card-morph-label absolute font-display font-semibold tracking-[-0.01em] text-ink"
        style={{
          left: 20,
          bottom: 96,
          fontSize: 21,
          lineHeight: 1.15,
        }}
      >
        {held.title}
      </span>
    </div>,
    document.body,
  );
}
