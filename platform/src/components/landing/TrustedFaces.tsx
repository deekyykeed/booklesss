"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ *
 * Students arriving.
 *
 * Owner, 2026-08-06, correcting the first attempt: "see the same way they were
 * partially overlapping, i need you to keep that. When one appears, a grow
 * animation on the left, the rest scoot over to make space for it as the one on
 * the far right shrinks — all in the same motion."
 *
 * WHAT THIS REPLACED AND WHY IT COULD NOT STAY. The first version was a track
 * of ten discs translating one slot at a time inside a clipped window: a
 * marquee. It moves the whole row, which is the opposite of what is being
 * described — nothing grows, nothing shrinks, and the row slides as one object
 * rather than making room for someone. Pure CSS could not express the real
 * thing either: a disc's visible life is exactly five steps, which is exactly
 * one loop of the track, so a single keyframe cannot both grow it at the start
 * and shrink it at the end without those being the same instant.
 *
 * So the list is state, and the layout does the scooting. Six items are
 * rendered: one growing in at the left, four settled, one shrinking away at the
 * right. Because the entering slot opens by exactly as much as the leaving slot
 * closes, the row's total width never changes and the centred group does not
 * drift on the page while it moves.
 *
 * KEYS ARE THE POSITION-INDEPENDENT IDENTITY. `head - i` decreases as the row
 * grows, so when `head` advances every surviving item keeps its key and simply
 * moves one place right. React reuses those DOM nodes, which is what stops the
 * settled discs replaying their entrance every tick — only the genuinely new
 * key mounts, and only the oldest unmounts.
 * ------------------------------------------------------------------ */

/** The five stock faces the design shipped with. */
const FACES = [1, 2, 3, 4, 5] as const;

/* The geometry — 40px discs stepping 32px, so each covers 8px of the one
   before, and a 3px cut-out ring between them — lives entirely in globals.css
   (`.face-slot` / `.face-disc`). It is not duplicated here: the slot width, the
   open/shut keyframes and the mask all have to agree to the pixel, and three of
   the four are only expressible in CSS. Change it there. */

/** How often a new student turns up. Long enough that the row is still between
 *  moves far more than it is moving, which is what the owner asked for the
 *  first time round: cycle, stay, cycle. */
const TICK = 2600;

export function TrustedFaces() {
  const [head, setHead] = useState(0);

  useEffect(() => {
    /* Respect the two ways someone can ask for a still page — the OS setting
       and the app's own toggle (see layout.tsx, which stamps data-motion before
       first paint). Without this the interval keeps firing and React keeps
       re-rendering a row whose CSS has been told not to move. */
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "reduced";
    if (still) return;
    const t = setInterval(() => setHead((h) => h + 1), TICK);
    return () => clearInterval(t);
  }, []);

  /* Newest first, left to right. Six of them: index 0 is arriving, 1–4 are
     settled, 5 is on its way out. */
  const items = Array.from({ length: 6 }, (_, i) => {
    const n = head - i;
    return { key: n, face: FACES[((n % FACES.length) + FACES.length) % FACES.length] };
  });

  return (
    /* pr-2 is the 8px the last disc overflows its slot by — without it the
       rightmost face is clipped by the group's own edge. */
    <div className="flex items-center pr-2">
      {items.map(({ key, face }, i) => (
        <span
          key={key}
          className="face-slot"
          /* "in" grows the slot open, "last" closes the cut-out on the disc
             that is about to stop being overlapped, "out" shrinks it away.
             Everything between is settled and carries no animation at all. */
          data-state={i === 0 ? "in" : i === 4 ? "last" : i === 5 ? "out" : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image
              wraps the element in a span with its own sizing, which fights the
              slot's width animation and the mask below. These are 160px files
              drawn at 40; there is nothing for the optimiser to save. */}
          <img src={`/landing/hero/face-${face}.jpg`} alt="" className="face-disc" />
        </span>
      ))}
    </div>
  );
}
