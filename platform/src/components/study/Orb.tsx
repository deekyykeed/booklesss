"use client";

/* The agent's presence.
 *
 * Every voice app the owner sent as reference (2026-08-21) is built around one
 * big iridescent sphere, and they are right to be: a call has no face, and a
 * screen with nothing to look at makes a person check whether it is still
 * connected. The orb is the answer to "is anything happening" — it breathes at
 * rest, swells when the agent talks, and tightens when it is listening to you.
 *
 * IT IS LIT FOR THE APP'S LIGHT SURFACE (relit 2026-08-22). The first version
 * was built for a black call screen: a saturated green ball with black inset
 * shadows, which on the app's own frosted surface read as a hole punched in it.
 * It is a pearl bead now — white specular, neutral grey body, shading tinted
 * brand-deep rather than black — lit from the same place as everything else.
 *
 * THE GREEN IS A SIGNAL, NOT A COLOUR SCHEME, and that is the part worth
 * keeping. Look at the dashboard: white cards, hairlines, black type, and the
 * brand green on one 32px avatar disc. A 200px saturated sphere is an order of
 * magnitude outside that budget however well it is lit. So the tint is bound to
 * --orb-glow and --orb-level: barely there at rest, halfway up while it listens
 * to you, full only while it is actually speaking. The screen goes green when
 * something is happening, which is the one thing the orb exists to say.
 *
 * The owner's reaction that caused it (2026-08-22): the session screen "has
 * completely disregarded the look and feel of the app by building its own
 * black and green screen". The lesson generalises past this component — a
 * surface that needs to feel different should differ in LAYOUT and in what it
 * puts at the centre, not by inventing a palette the app does not own.
 *
 * IT IS CSS, NOT AN ASSET AND NOT A 3D LIBRARY. Three stacked radial gradients
 * for the body, one slowly-turning conic for the iridescence, a blurred copy
 * behind it for the glow. Reasons, in order of how much they matter here:
 *   - this is read on Zambian mobile data, and three.js is ~150 KB gzipped
 *     before a single sphere is drawn;
 *   - an image would need a variant per surface, and would band badly on the
 *     cheap LCDs a lot of students are on;
 *   - the reference orbs are lit from one side and rotate slowly, which is two
 *     gradients and a keyframe.
 *
 * The palette is the brand green (#3ecf8e) and brand-deep (#17754d) already in
 * globals.css. Nothing new enters the palette to get this.
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
          <div className="orb-tint" />
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
        /* The bloom the bead sits in. Low alpha on purpose: on a light surface
           the glow is the only thing that can turn into a green wash, which is
           precisely what this screen was pulled back from. */
        .orb-glow {
          position: absolute;
          inset: -20%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(62, 207, 142, calc(0.24 * var(--orb-glow))) 0%,
            rgba(62, 207, 142, calc(0.09 * var(--orb-glow))) 44%,
            transparent 70%
          );
          filter: blur(20px);
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
        /* A neutral pearl. Greys sampled off the app's own --color-canvas and
           --color-line so the bead sits in the same family as every card on
           the dashboard; the shading is brand-deep at low alpha rather than
           black, because black on a light surface is what made the old bead
           look cut out of the page. All the colour arrives on .orb-tint. */
        .orb-body {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background:
            radial-gradient(circle at 30% 26%, #ffffff 0%, rgba(255, 255, 255, 0) 50%),
            radial-gradient(circle at 72% 82%, rgba(23, 117, 77, 0.22) 0%, rgba(23, 117, 77, 0) 62%),
            radial-gradient(circle at 50% 46%, #ffffff 0%, #f6f8f7 34%, #e7ecea 68%, #d5dedb 92%, #c6d2ce 100%);
          box-shadow:
            inset 0 0 26px rgba(23, 117, 77, 0.1),
            inset -6px -10px 32px rgba(23, 117, 77, 0.14),
            0 16px 40px -26px rgba(23, 117, 77, calc(0.5 * var(--orb-glow)));
          animation: orb-breathe var(--orb-breathe) ease-in-out infinite;
        }
        /* The brand green, and the only place it enters the bead. Multiplied
           over the pearl so the shading underneath survives — an opaque green
           layer would flatten the sphere back into a disc. The floor is
           deliberately low: at rest this should read as a bead with a green
           cast, not as a green bead. */
        .orb-tint {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at 42% 34%,
            rgba(140, 232, 194, 0.75) 0%,
            rgba(62, 207, 142, 0.95) 46%,
            rgba(23, 117, 77, 1) 100%
          );
          mix-blend-mode: multiply;
          opacity: calc(0.09 + 0.4 * var(--orb-glow) + 0.16 * var(--orb-level));
          /* Long enough that a change of state is a bloom rather than a flick,
             short enough to land inside the agent's first syllable. */
          transition: opacity 420ms ease;
        }
        /* The iridescence. A conic sweep, heavily blurred over the body,
           turning slowly — which is what reads as "liquid" rather than
           "gradient". MULTIPLY, not screen: the body is pale now, and screen
           over a pale body only bleaches it towards white. */
        .orb-sheen {
          position: absolute;
          inset: -25%;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(214, 246, 232, 1),
            rgba(255, 255, 255, 1),
            rgba(196, 224, 246, 1),
            rgba(222, 248, 235, 1),
            rgba(255, 255, 255, 1),
            rgba(214, 246, 232, 1)
          );
          mix-blend-mode: multiply;
          filter: blur(22px);
          opacity: 0.6;
          animation: orb-spin var(--orb-spin) linear infinite;
        }
        /* The specular. Sells the sphere more than anything else here. */
        .orb-highlight {
          position: absolute;
          left: 17%;
          top: 11%;
          width: 44%;
          height: 33%;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at 40% 40%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.5) 45%,
            transparent 74%
          );
          filter: blur(7px);
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
