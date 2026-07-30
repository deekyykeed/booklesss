/* ------------------------------------------------------------------ *
 * Course-card marks — MynaUI Line (by Praveen Juge). The cards wore this set
 * first, at the owner's call; the rest of the chrome has since followed them
 * onto it (see components/icons/myna).
 *
 * GENERATED geometry: bodies are byte-for-byte from @iconify-json/mynaui,
 * hand-inlined rather than resolved through <Icon> — that helper imports a
 * whole set, which is fine on the server but would drag every icon into
 * this client bundle. Regenerate from the package rather than editing paths.
 *
 * "Fire" captions the streak figure; the score is set as a bare display
 * number and the live figure carries the animated .live-dot, so neither
 * needs a glyph. The card's own mark, top-left, is the "Folder". All take
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
export function TrendUpMark({ size = 16, className }: Props) {
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

/* MynaUI Line · "Trending Down" */
export function TrendDownMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m20 17l-5.846-5.938c-1.964-1.983-4.106 2.148-6.153.001L4 7m9 10h7v-7"
      />
    </svg>
  );
}

/* "User Hand Up" — the raised hand of someone present, at the
 * owner's pick; it captions the live count beside the pulsing dot. */
export function OnlineMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M8 13h8m-8 0v5c0 1.886 0 2.828.586 3.414S10.114 22 12 22s2.828 0 3.414-.586S16 19.886 16 18v-5m-8 0a7.46 7.46 0 0 1-5.618-5.472L2 6m14 7c1.71 0 3.15 1.28 3.35 2.98L20 21.5"
        />
        <circle cx="12" cy="6" r="4" />
      </g>
    </svg>
  );
}

/* MynaUI Line · "Folder" */
export function CardMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3 6a2 2 0 0 1 2-2h1.745a2 2 0 0 1 1.322.5l2.272 2a2 2 0 0 0 1.322.5H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
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
