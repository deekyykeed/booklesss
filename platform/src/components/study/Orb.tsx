"use client";

/* The agent's presence.
 *
 * Every voice app the owner sent as reference (2026-08-21) is built around one
 * big iridescent sphere, and they are right to be: a call has no face, and a
 * screen with nothing to look at makes a person check whether it is still
 * connected. The orb is the answer to "is anything happening" — it breathes at
 * rest, swells when the agent talks, and tightens when it is listening to you.
 *
 * IT IS CSS, NOT AN ASSET AND NOT A 3D LIBRARY. Three stacked radial gradients
 * for the body, one slowly-turning conic for the iridescence, a blurred copy
 * behind it for the glow. Reasons, in order of how much they matter here:
 *   - this is read on Zambian mobile data, and three.js is ~150 KB gzipped
 *     before a single sphere is drawn;
 *   - an image would need a dark and a light variant, and would band badly on
 *     the cheap LCDs a lot of students are on;
 *   - the reference orbs are lit from one side and rotate slowly, which is two
 *     gradients and a keyframe.
 *
 * The palette is the brand green (#3ecf8e) that is already in globals.css,
 * pushed to teal and to near-white at the highlight. Nothing new enters the
 * palette to get this — the owner's own dark reference was green, which is
 * what made the dark call surface an easy call.
 *
 * `getLevel` is optional and returns 0..1 of current loudness — the SDK's
 * getOutputByteFrequencyData when the agent is talking, getInputVolume when it
 * is listening. It is a GETTER, polled here on an animation frame, rather than
 * a prop: loudness changes sixty times a second, and re-rendering a React
 * component that often to move a shadow is how a call starts dropping frames
 * on a mid-range Android. The value is written straight onto a CSS variable,
 * so it never touches React at all.
 */

import { useEffect, useRef } from "react";

export type OrbState = "idle" | "connecting" | "listening" | "speaking";

export function Orb({
  state,
  size = 240,
  getLevel,
}: {
  state: OrbState;
  size?: number;
  getLevel?: () => number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !getLevel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let smoothed = 0;
    const tick = () => {
      /* Eased towards the reading rather than set to it. Raw frequency data is
       * spiky enough that a sphere bound directly to it jitters instead of
       * breathing; a low-pass at ~0.18 keeps the swell on syllables and drops
       * the noise between them. */
      const next = Math.max(0, Math.min(1, getLevel() || 0));
      smoothed += (next - smoothed) * 0.18;
      el.style.setProperty("--orb-level", smoothed.toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [getLevel]);
  /* Rest, and both live states, differ in SPEED and GLOW rather than in colour.
   * A colour change would read as a mode change — a different thing on screen —
   * where these are the same thing doing something. */
  const spin = state === "speaking" ? "9s" : state === "listening" ? "26s" : "44s";
  const breathe = state === "connecting" ? "1.6s" : state === "speaking" ? "2.4s" : "5.5s";

  return (
    <div
      ref={ref}
      className="orb-wrap"
      style={
        {
          width: size,
          height: size,
          "--orb-level": 0,
          "--orb-spin": spin,
          "--orb-breathe": breathe,
          /* Idle sits dim so that the first word the agent says visibly lifts
           * it. A rest state as bright as the active one wastes the signal. */
          "--orb-glow": state === "idle" ? 0.25 : state === "speaking" ? 1 : 0.55,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div className="orb-glow" />
      {/* Its own element purely so loudness can scale the sphere without
          fighting the breathing keyframe for the transform property — two
          animations on one transform means the last one declared silently
          wins, and the sphere stops responding to the voice. */}
      <div className="orb-scale">
        <div className="orb-body">
          <div className="orb-sheen" />
          <div className="orb-highlight" />
        </div>
      </div>

      {/* Colocated with the only thing that uses them. globals.css is a shared
          file two sessions have collided on before; an animation that belongs
          to one component does not need to live there. */}
      <style>{`
        .orb-wrap {
          position: relative;
          display: grid;
          place-items: center;
          isolation: isolate;
        }
        .orb-glow {
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(62, 207, 142, calc(0.42 * var(--orb-glow))) 0%,
            rgba(62, 207, 142, calc(0.16 * var(--orb-glow))) 42%,
            transparent 68%
          );
          filter: blur(18px);
          /* Opacity is set here rather than in the keyframe so loudness owns
             it; the keyframe moves scale only. */
          opacity: calc(0.5 + 0.5 * var(--orb-level));
          animation: orb-pulse var(--orb-breathe) ease-in-out infinite;
        }
        .orb-scale {
          width: 100%;
          height: 100%;
          transform: scale(calc(1 + 0.085 * var(--orb-level)));
        }
        .orb-body {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background:
            radial-gradient(circle at 32% 28%, #d8fff0 0%, rgba(216, 255, 240, 0) 38%),
            radial-gradient(circle at 68% 76%, #0f7f57 0%, rgba(15, 127, 87, 0) 55%),
            radial-gradient(circle at 50% 50%, #3ecf8e 0%, #1f9d6b 40%, #157a54 78%, #0a4b34 100%);
          box-shadow:
            inset 0 0 40px rgba(0, 0, 0, 0.35),
            inset -8px -12px 40px rgba(0, 0, 0, 0.4),
            0 20px 60px -20px rgba(62, 207, 142, calc(0.5 * var(--orb-glow)));
          animation: orb-breathe var(--orb-breathe) ease-in-out infinite;
        }
        /* The iridescence. A conic sweep, heavily blurred and screened over the
           body, turning slowly — which is what reads as "liquid" rather than
           "gradient". */
        .orb-sheen {
          position: absolute;
          inset: -25%;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(62, 207, 142, 0.9),
            rgba(140, 255, 214, 0.75),
            rgba(24, 122, 200, 0.45),
            rgba(62, 207, 142, 0.85),
            rgba(210, 255, 236, 0.7),
            rgba(62, 207, 142, 0.9)
          );
          mix-blend-mode: screen;
          filter: blur(22px);
          opacity: 0.75;
          animation: orb-spin var(--orb-spin) linear infinite;
        }
        /* The specular. Sells the sphere more than anything else here. */
        .orb-highlight {
          position: absolute;
          left: 18%;
          top: 12%;
          width: 42%;
          height: 32%;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at 40% 40%,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.25) 45%,
            transparent 72%
          );
          filter: blur(6px);
        }
        @keyframes orb-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.035); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        /* Somebody who has asked for less motion gets a still sphere, not a
           slower one — the orb is decoration, and its job (is this alive) is
           carried by the state word above it, which does not move. */
        @media (prefers-reduced-motion: reduce) {
          .orb-glow, .orb-body, .orb-sheen { animation: none; }
        }
      `}</style>
    </div>
  );
}
