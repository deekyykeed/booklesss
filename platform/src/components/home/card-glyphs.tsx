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
 * "Checklist", "Stopwatch" and "Users Group Rounded" caption the card's
 * figures. All take currentColor.
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

/* Solar Bold · "Users Group Rounded" */
export function ReadersMark({ size = 16, className }: Props) {
  return (
    <svg {...box(size, className)}>
      <circle cx="9.001" cy="6" r="4" fill="currentColor" />
      <ellipse cx="9.001" cy="17.001" fill="currentColor" rx="7" ry="4" />
      <path fill="currentColor" d="M21 17c0 1.657-2.036 3-4.521 3c.732-.8 1.236-1.805 1.236-2.998c0-1.195-.505-2.2-1.239-3.001C18.962 14 21 15.344 21 17M18 6a3 3 0 0 1-4.029 2.82A5.7 5.7 0 0 0 14.714 6c0-1.025-.27-1.987-.742-2.819A3 3 0 0 1 18 6.001" />
    </svg>
  );
}
