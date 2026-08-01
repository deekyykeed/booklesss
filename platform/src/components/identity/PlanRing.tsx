"use client";

/* The ring around the header avatar: how much of the plan's period is spent.
 *
 * It is the avatar's border, not an extra thing beside it — the button used to
 * carry a 1px #d4d4d4 hairline and this draws that same hairline as the ring's
 * track, so with no plan to report the header looks exactly as it did.
 *
 * The arc measures time GONE rather than time left, for two reasons: a fresh
 * plan draws a light ring instead of a heavy black one around every avatar,
 * and the ring is at its loudest in the week that matters — the one before it
 * lapses. Inside the last few days it turns red, which is the only moment this
 * needs to be noticed at all.
 *
 * Drawn edge to edge over the button, so the avatar keeps its own size and
 * nothing reflows when a plan appears. */

type Props = {
  /** 0..1 of the period spent. Null draws the track alone. */
  used: number | null;
  /** Days remaining — what decides whether the arc runs red. */
  daysLeft?: number;
  /** Button size in px; the ring fills it. */
  size?: number;
};

/** Inside this many days the arc goes red. A week is too early to nag and a
 *  day is too late to renew from a phone with airtime to buy. */
const URGENT_DAYS = 3;

export function PlanRing({ used, daysLeft, size = 32 }: Props) {
  const c = size / 2;
  const arc = 2;
  // One radius for both, so the thicker arc sits centred on the hairline.
  const r = c - arc / 2;
  const circumference = 2 * Math.PI * r;
  const v = used === null ? 0 : Math.max(0, Math.min(1, used));
  const urgent = daysLeft !== undefined && daysLeft <= URGENT_DAYS;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      focusable="false"
    >
      {/* No track any more: the button draws its own 1px border, the same one
          the circle buttons beside it wear. An SVG stroke doubling it read as
          a soft grey smudge rather than a hairline. */}
      {used !== null && (
        <circle
          cx={c}
          cy={c}
          r={r}
          stroke={urgent ? "var(--color-danger)" : "var(--color-btn)"}
          strokeWidth={arc}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - v)}
          /* From twelve o'clock, clockwise — the direction a clock face
             already taught everybody to read. */
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: "stroke-dashoffset 420ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      )}
    </svg>
  );
}
