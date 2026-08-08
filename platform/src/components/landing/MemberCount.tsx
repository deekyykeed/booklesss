import { memberCount } from "@/lib/members";

/* ------------------------------------------------------------------ *
 * "Join N members", where N is the row count of `students`.
 *
 * Owner, 2026-08-06: "under the get started button say join 67+ members, but
 * that grows at random short intervals by 1 — not too short so there is room to
 * see it grow."
 *
 * WHAT THIS REPLACED, AND WHY. That brief shipped literally: a client component
 * starting at a constant 67 and incrementing on a random 1.5–4.5s timer. It was
 * flagged in its own header, in PROJECT_MEMORY twice and to the owner — the
 * number was not measured, did not go down, and a visitor watching it climb read
 * it as people signing up while they stood there. It is the only invented claim
 * this page has ever carried, and the honest version turned out to be smaller
 * than the machinery it replaces: one count, no timer, no client bundle.
 *
 * NO "use client" ANY MORE. The tick was the only reason this needed the
 * browser. A true count changes when the cache revalidates, not on a timer, so
 * the entrance is the same CSS keyframe (`.count-tick`, both-filled, one shot)
 * and the whole component renders on the server. `/` sets `revalidate` — that
 * is what makes this a periodic read rather than a per-visitor one.
 *
 * ⚠️ THE FLOOR IS THE PART TO UNDERSTAND BEFORE CHANGING IT. Below FLOOR this
 * component renders NOTHING, and that is deliberate: social proof that is
 * honest and tiny costs more than no social proof at all, so the choice on the
 * front door is between a true number and an empty slot — never between a true
 * number and a flattering one. On 2026-08-08 the real count is 2, so the line is
 * currently absent from the page. It appears on its own, with no code change,
 * the day the twelfth student signs up.
 *
 * If the owner wants something in that slot before then, the answer is to write
 * a line that is TRUE of the product (what it holds, what it costs) rather than
 * to lower the floor to 1 — a claim of "Join 2 members" is accurate and still
 * reads as an empty room.
 * ------------------------------------------------------------------ */

/**
 * The count at which the line starts drawing.
 *
 * Twelve is a judgement, not a measurement: it is roughly the point at which a
 * headcount reads as "other people are here" rather than as a number small
 * enough to count on the page. Raise it freely — the only wrong value is one
 * that lets the page imply a crowd that does not exist.
 */
const FLOOR = 12;

export async function MemberCount() {
  const n = await memberCount();

  /* No Supabase configured (fresh clone, preview, CI) → null → nothing drawn.
     A missing environment must never be reported to a visitor as a headcount. */
  if (n === null || n < FLOOR) return null;

  return (
    <p className="hero-shade mt-3 text-center font-hero-meta text-[13px] leading-[1.4] text-white/70">
      Join{" "}
      {/* `tabular-nums` so 99 to 100 does not shunt the word after it. The
          `count-tick` rise still plays, once, on the paint that shows the
          number — it is an entrance now rather than a per-arrival flash.

          One expression, not `{n}+` — React separates an expression from an
          adjacent literal with an HTML comment, so that spelling puts
          `67<!-- -->+` in the markup. It renders identically and reads as
          "67 + members" to anything parsing the raw text. */}
      <span className="count-tick inline-block tabular-nums">{`${n}`}</span>{" "}
      members
    </p>
  );
}
