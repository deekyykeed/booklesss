/* ------------------------------------------------------------------ *
 * Course-card marks — MynaUI Line (by Praveen Juge), at the owner's call:
 * the cards wear this set even though the rest of the app's chrome is Solar.
 *
 * GENERATED geometry: bodies are byte-for-byte from @iconify-json/mynaui,
 * hand-inlined rather than resolved through <Icon> — that helper imports a
 * whole set, which is fine on the server but would drag every icon into
 * this client bundle. Regenerate from the package rather than editing paths.
 *
 * "Clock Circle" and "Trending Up" caption the card's figures — this week's
 * reading and the performance score. The live figure carries the animated
 * .live-dot instead of a glyph. Both take currentColor.
 * ------------------------------------------------------------------ */

type Props = { size?: number; className?: string };

const box = (size: number, className?: string) =>
  ({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className: "shrink-0" + (className ? " " + className : ""),
  }) as const;

/* MynaUI Line · "Trending Up" */
export function TrendMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m20 7l-5.846 5.938c-1.964 1.983-4.106-2.148-6.153-.001L4 17m9-10h7v7"
      />
    </svg>
  );
}

/* MynaUI Line · "Clock Circle" */
export function StopwatchMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0" />
        <path d="M12 6v6l4 2" />
      </g>
    </svg>
  );
}
