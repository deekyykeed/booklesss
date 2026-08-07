"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ *
 * "Join 67+ members", ticking up.
 *
 * Owner, 2026-08-06: "under the get started button say join 67+ members, but
 * that grows at random short intervals by 1 — not too short so there is room to
 * see it grow."
 *
 * ⚠️ THIS NUMBER IS NOT MEASURED. It starts at a constant and increments on a
 * timer; it is not the row count of `students` and does not go down. A visitor
 * watching it climb will read it as people signing up while they stand there,
 * which is the effect it is built for and is not what is happening. Said plainly
 * here because the next person to read this file should not have to work it out,
 * and because the honest version is close: `students` is a real table, and a
 * server component reading `count` off it on an ISR revalidate would put a true
 * number in the same slot with the same animation. Raised with the owner; his
 * call to ship this one.
 *
 * RANDOM, AND NOT TOO OFTEN. A fixed cadence reads as a clock, which is the one
 * thing that gives away a fake counter — real sign-ups do not arrive every nine
 * seconds exactly. The window is wide (7–18s) and the low end is deliberately
 * slow: the owner's note is "room to see it grow", so the point is that a
 * visitor is still on the page when it moves, having already looked at it once.
 *
 * The starting value is rendered on the SERVER and matches the client's first
 * state exactly, so there is no hydration mismatch. `Math.random` is only ever
 * called inside the effect — calling it during render would give the server and
 * the browser two different numbers for the same paint.
 * ------------------------------------------------------------------ */

/** Where the count starts. The owner's figure. */
const START = 67;

/**
 * The gap between arrivals, milliseconds.
 *
 * Was 7–18s. The owner called it "way too slow", then diagnosed it properly a
 * moment later: "or is it that some are too far apart" — which is the right
 * reading. The AVERAGE was fine at 12s; it was the TAIL that killed it. Draws
 * near the top of that range put a 17-second dead stretch in the middle of a
 * page a visitor reads in well under twenty, so the number simply never moved
 * while anyone was looking at it — and one dead stretch is enough, because the
 * visitor has already concluded it is a static number and stopped watching.
 *
 * So the fix is a narrower spread, not just a faster one. Capping the long end
 * is what does the work here; lowering the short end only keeps it irregular.
 * The original brief still holds at that short end ("not too short so there is
 * room to see it grow") — 1.5s is comfortably longer than the 420ms rise, so no
 * tick ever interrupts the one before it.
 *
 * TIGHTENED AGAIN (owner, 2026-08-07: "that number counting up please make it
 * faster") — both ends pulled down by a third, keeping the same shape rather
 * than just capping the tail a second time.
 */
const MIN_GAP = 1_500;
const MAX_GAP = 4_500;

export function MemberCount() {
  const [n, setN] = useState(START);

  useEffect(() => {
    /* setTimeout re-armed rather than setInterval, because the whole point is
       that each gap is a different length. An interval can only be regular. */
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      timer = setTimeout(
        () => {
          setN((v) => v + 1);
          arm();
        },
        MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP),
      );
    };
    arm();
    return () => clearTimeout(timer);
  }, []);

  return (
    <p className="hero-shade mt-3 text-center font-hero-meta text-[13px] leading-[1.4] text-white/70">
      Join{" "}
      {/* Keyed by the value so React swaps the node when it changes, which is
          what replays the animation — without the key it edits the text in
          place and the number simply becomes a different number with nothing to
          notice. `tabular-nums` so 99 to 100 does not shunt the word after it. */}
      {/* One expression, not `{n}+` — React separates an expression from an
          adjacent literal with an HTML comment, so that spelling puts
          `67<!-- -->+` in the markup. It renders identically and reads as
          "67 + members" to anything parsing the raw text. */}
      <span key={n} className="count-tick inline-block tabular-nums">
        {`${n}+`}
      </span>{" "}
      members
    </p>
  );
}
