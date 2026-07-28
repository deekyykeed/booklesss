/* ------------------------------------------------------------------ *
 * Course-card marks — Solar Line (by 480 Design), the same set the sidebars
 * and top bar use, so a card's marks read as part of the app's furniture
 * rather than a second icon language.
 *
 * GENERATED geometry: bodies are byte-for-byte from @iconify-json/solar,
 * hand-inlined rather than resolved through <Icon> — that helper imports the
 * whole set, which is fine on the server but would drag every Solar icon into
 * this client bundle. Regenerate from the package rather than editing paths.
 *
 * "Checklist" and "Stopwatch" caption the card's figures — the live figure
 * carries the animated .live-dot instead of a glyph. Both take currentColor.
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

/* Solar Line · "Checklist Minimalistic" */
export function ChecklistMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 15.8L7.143 17L10 14M6 8.8L7.143 10L10 7" />
        <path strokeLinecap="round" d="M13 9h5m-5 7h5" />
      </g>
    </svg>
  );
}

/* Solar Line · "Stopwatch" */
export function StopwatchMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 13a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13V9" />
        <path strokeLinecap="round" d="M10 2h4" />
      </g>
    </svg>
  );
}

