"use client";

import { useEffect, useId, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

/* ------------------------------------------------------------------ *
 * A GOOEY TOGGLE, for the Settings modal's `.toggle` rows.
 *
 * The owner sent an API sketch for a "LiquidToggle" pointing at
 * github.com/lorenzo04us/Bencho — that repository does not exist (404),
 * and the sketch itself has no real numbers in it (`stiffness: NaN`,
 * `width: undefinedpx`), so it was never runnable as pasted. What survived
 * is the MECHANISM it described, which is worth having regardless of where
 * it came from: two springs, not one.
 *
 * THE THUMB'S POSITION IS A MOTION VALUE, AND THE DROP IS A SECOND SPRING
 * CHASING IT — not the same target with a delay on it. A delay describes a
 * single click and nothing else: the drop sets off late and arrives where
 * the thumb already was. A spring that chases the thumb's LIVE value is
 * always racing to catch up to wherever the thumb is right now, so the pair
 * stretches by exactly how fast the thumb is moving — flick it and the drop
 * necks out behind; nudge it and the two stay one shape. `stretch` is the
 * knob for how much softer the chase spring is than the thumb's own, which
 * is what lets it fall behind at all.
 *
 * ⚠️ OPAQUE ON PURPOSE. A goo filter (blur + a sharpened alpha threshold via
 * `feColorMatrix`) merges two shapes by thresholding the blurred alpha back
 * to solid — feed it a translucent fill and the threshold has nothing to
 * grab, so the shape just fades out instead of merging. Both blobs are flat
 * `--text-on` white, no shadow, no opacity.
 * ------------------------------------------------------------------ */

/* Track/thumb sizing matches the plain checkbox toggle this replaces
   (`.toggle` in globals.css) so no call site or row layout had to change. */
const TRACK_W = 36;
const THUMB = 16;
const INSET = 2;
const X_OFF = INSET;
const X_ON = TRACK_W - THUMB - INSET;

export function LiquidToggle({
  defaultChecked = false,
  onChange,
  speed = 50,
  stretch = 36,
  "aria-label": ariaLabel,
}: {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** 0–100. Higher = the thumb itself snaps faster. */
  speed?: number;
  /** 0–100. Higher = the trailing drop lags (and stretches) more. */
  stretch?: number;
  "aria-label"?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const rawId = useId();
  const filterId = `liq-goo-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const x = useMotionValue(defaultChecked ? X_ON : X_OFF);
  /* 0–100 -> 140–420: the range a spring reads as "quick" without
     overshooting a 16px thumb travel. */
  const stiffness = 140 + (Math.max(0, Math.min(100, speed)) / 100) * 280;

  useEffect(() => {
    const controls = animate(x, checked ? X_ON : X_OFF, {
      type: "spring",
      stiffness,
      damping: 22,
      mass: 0.9,
    });
    return controls.stop;
  }, [checked, stiffness, x]);

  /* Softer than the thumb's own spring by a factor `stretch` controls — at
     0 the two springs are equal and the drop never separates from the
     thumb at all; at 100 it can fall most of the track behind on a fast
     move. */
  const chaseStiffness = stiffness / (1 + Math.max(0, Math.min(100, stretch)) / 40);
  const chase = useSpring(x, { stiffness: chaseStiffness, damping: 22, mass: 1 });

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className="liq-toggle"
      onClick={toggle}
    >
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="smear" />
            <feColorMatrix
              in="smear"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            />
          </filter>
        </defs>
      </svg>
      <span className="liq-track" data-on={checked}>
        <span className="liq-goo" style={{ filter: `url(#${filterId})` }}>
          <motion.span className="liq-drop" style={{ x: chase }} />
          <motion.span className="liq-thumb" style={{ x }} />
        </span>
      </span>
    </button>
  );
}
