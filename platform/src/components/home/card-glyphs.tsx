/* ------------------------------------------------------------------ *
 * Course-card marks — Solar Bold (by 480 Design), the same set the sidebars
 * and top bar use, so a card's marks read as part of the app's furniture
 * rather than a second icon language.
 *
 * GENERATED geometry: bodies are byte-for-byte from @iconify-json/solar,
 * hand-inlined rather than resolved through <Icon> — that helper imports the
 * whole set, which is fine on the server but would drag every Solar icon into
 * this client bundle. Regenerate from the package rather than editing paths.
 *
 * "Checklist" and "Stopwatch" caption the card's two figures. Both take
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

/* Solar Bold · "Checklist Minimalistic" */
export function ChecklistMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464m7.08 4.053a.75.75 0 1 0-1.087-1.034l-2.314 2.43l-.6-.63a.75.75 0 1 0-1.086 1.034l1.143 1.2a.75.75 0 0 0 1.086 0zM13 8.25a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5zm-2.457 6.267a.75.75 0 1 0-1.086-1.034l-2.314 2.43l-.6-.63a.75.75 0 1 0-1.086 1.034l1.143 1.2a.75.75 0 0 0 1.086 0zM13 15.25a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5z" />
    </svg>
  );
}

/* Solar Bold · "Stopwatch" */
export function StopwatchMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12 22a9 9 0 1 0 0-18a9 9 0 0 0 0 18m0-13.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75M9.25 2a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 9.25 2" />
    </svg>
  );
}
