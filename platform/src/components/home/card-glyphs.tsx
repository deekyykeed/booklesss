/* ------------------------------------------------------------------ *
 * Course-card marks — MynaUI Line (by Praveen Juge), at the owner's call:
 * the cards wear this set even though the rest of the app's chrome is Solar.
 *
 * GENERATED geometry: bodies are byte-for-byte from @iconify-json/mynaui,
 * hand-inlined rather than resolved through <Icon> — that helper imports a
 * whole set, which is fine on the server but would drag every icon into
 * this client bundle. Regenerate from the package rather than editing paths.
 *
 * "Fire" and "Trending Up" caption the card's figures — the course streak
 * and the performance score. The live figure carries the animated .live-dot
 * instead of a glyph. The card's own mark, top-left, is Solar Bold Duotone's
 * "Stop" (its second tone is currentColor at half alpha). All take
 * currentColor.
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

/* Solar Bold Duotone · "Stop" */
export function CardMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535l17.072-17.07C19.07 2 16.714 2 12 2S4.929 2 3.464 3.464"
      />
      <path
        fill="currentColor"
        opacity=".5"
        d="M3.465 20.536C4.929 22 7.286 22 12 22s7.071 0 8.536-1.464C22 19.07 22 16.714 22 12s0-7.07-1.464-8.535z"
      />
    </svg>
  );
}

/* MynaUI Line · "Fire" */
export function StreakMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M19.27 16.202A7.81 7.81 0 0 1 12.06 21c-4.313 0-7.81-3.492-7.81-7.8S5.89 7.13 8.455 3c4.806 2.1 4.806 8.4 4.806 8.4s1.579-3.038 4.807-4.5c1.034 3.042 2.43 6.365 1.202 9.302" />
        <path d="M12 18a5 5 0 0 1-5-5" />
      </g>
    </svg>
  );
}
