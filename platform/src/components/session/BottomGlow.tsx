"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 * The light rising off the bottom of the voice screen.
 *
 * Owner, 2026-08-23: the screen is "mostly blank, especially when starting. A
 * glowing sort of effect will happen from the bottom, showing that the
 * microphone is being heard."
 *
 * THREE STATES, AND THEY ARE HONEST ABOUT WHICH ONE THEY ARE IN:
 *
 *   dormant   — nothing is listening. A very low, slow breath, so the screen
 *               is not dead, but visibly not tracking anything.
 *   listening — driven by the real input level (lib/mic-level). This is the
 *               only state that claims to be hearing you, and it is the only
 *               one wired to a microphone.
 *   speaking  — the agent has the floor. Same light, different rhythm, so a
 *               student can tell whose turn it is without a label.
 *
 * ⚠️ THE LEVEL IS WRITTEN AS A CSS VARIABLE, NOT AS REACT STATE. This runs at
 * 60fps for as long as the screen is open. Routing it through setState would
 * re-render this component sixty times a second and, worse, would put React's
 * reconciler on the critical path of an animation — which is how a glow ends up
 * stuttering on exactly the mid-range Android the app is read on. Writing
 * `--glow` straight onto the node keeps the whole loop off the React tree; the
 * only thing that re-renders here is a change of state word.
 *
 * ⚠️ NO `filter: blur()` ON THE BIG LAYER. The obvious build is a blurred
 * shape, and a full-width blur radius of this size is a per-frame GPU
 * readback — it measured as the single most expensive thing on the screen. A
 * radial-gradient is free by comparison and, at this softness, indistinguishable.
 * ------------------------------------------------------------------ */

export type GlowState = "dormant" | "listening" | "speaking";

export function BottomGlow({
  /** Returns the current level, 0..1. Called once per frame — keep it cheap. */
  read,
  state,
  /** The course's own hue, so the light belongs to the course you tapped. */
  tone,
}: {
  read: () => number;
  state: GlowState;
  tone: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  /* `read` and `state` change identity as the parent re-renders; the loop must
     not restart when they do, or it would tear down and rebuild a rAF chain on
     every keystroke elsewhere on the page. Latched in refs, read inside. */
  const readRef = useRef(read);
  const stateRef = useRef(state);
  readRef.current = read;
  stateRef.current = state;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const still =
      document.documentElement.dataset.motion === "reduced" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    /* A still page gets a fixed, visible glow rather than none at all: it is
       the only thing on the screen indicating the mic is open, so removing it
       would take away information, not just movement. */
    if (still) {
      el.style.setProperty("--glow", "0.34");
      return;
    }

    let raf = 0;
    let t = 0;
    /* Smoothed once more here, on top of the smoothing lib/mic-level already
       does. That one is tuned for the number; this one is tuned for the light,
       which has a much larger area and so shows judder the number does not. */
    let shown = 0;

    const frame = () => {
      t += 1;
      const s = stateRef.current;

      let target: number;
      if (s === "listening") {
        target = readRef.current();
      } else if (s === "speaking") {
        /* Not a fixed value: the agent talking should look like talking. A
           slow carrier with a faster tremor on it reads as speech cadence
           without pretending to be the actual waveform, which we do not have
           on the playback side. */
        target = 0.42 + 0.2 * Math.sin(t / 13) + 0.08 * Math.sin(t / 4.3);
      } else {
        /* The breath. ~5.5s a cycle at 60fps — near a resting breathing rate,
           which is slow enough to read as idle rather than as a pulse waiting
           for something. */
        target = 0.1 + 0.05 * Math.sin(t / 52);
      }

      shown += (Math.max(0, Math.min(1, target)) - shown) * 0.18;
      el.style.setProperty("--glow", shown.toFixed(3));
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={host}
      className="vox-glow"
      aria-hidden="true"
      data-state={state}
      style={{ ["--glow-tone" as string]: tone }}
    />
  );
}
