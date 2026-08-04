"use client";

import Link from "next/link";

/* ------------------------------------------------------------------ *
 * The wide bar with a label on the left and an arrow on the right.
 *
 * Owner, 2026-08-04: "the exact button in the course card should be its own
 * component and ill use it throughout all the buttons within the app like the
 * add to homescreen and the save all lessons."
 *
 * It was drawn inline in CourseCard, which was fine while it was one button in
 * one place. It is not one place any more, and the alternative to extracting it
 * is what OfflineTools already had: two more buttons with their own radius,
 * their own padding and their own hover, hand-written beside each other and
 * free to drift apart. Three spellings of one control is how a house style
 * stops being one.
 *
 * NOT `Button`, and not folded into it. `.btn` is the app's pill — sized to its
 * label, centred, used for the primary action of a form. This is the opposite
 * shape on purpose: full width, label left, arrow right, and it can carry a
 * PROGRESS FILL behind the text, which is the thing that made the course card's
 * version worth keeping. A pill that also has to be a progress bar is a pill
 * with an argument in it.
 *
 * RENDERS AS A LINK OR A BUTTON depending on what it is given. A control that
 * navigates must be an <a> — middle-click, long-press, open-in-new-tab are the
 * browser's to answer, not ours — and one that acts must be a <button>. Passing
 * `href` picks the first, `onClick` the second.
 * ------------------------------------------------------------------ */

type Common = {
  /** The quiet half, before the label — "Resume · ", "Start · ". */
  prefix?: string;
  /** The label itself. */
  children: React.ReactNode;
  /**
   * How far through, 0..1. Draws the fill this bar is really for.
   *
   * Undefined means no fill at all, which is not the same as 0 — a bar at 0%
   * is a course not started, and one with no progress to report is a button.
   */
  progress?: number;
  /** Spelled out where the visible label is not the whole story — the course
   *  card names the step it would resume. */
  label?: string;
  disabled?: boolean;
  className?: string;
};

type Props =
  | (Common & { href: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void })
  | (Common & { href?: undefined; onClick: () => void });

/** The arrow. Its lean-on-hover lives in globals.css beside the bar's own
 *  rules, so a caller cannot forget to bring it. */
function Arrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="card-arrow relative shrink-0 text-muted"
    >
      <path
        d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SHELL =
  "course-resume squircle relative z-10 flex items-center justify-between gap-3 overflow-hidden px-2.5 py-1.5";

export function ActionBar(props: Props) {
  const { prefix, children, progress, label, disabled, className } = props;

  const inner = (
    <>
      {/* The fill, behind everything and inert. Its width is the only thing
          that animates — a transition on the bar itself would drag the label
          with it. */}
      {progress !== undefined && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{
            width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`,
            backgroundColor: "rgba(23, 23, 23, 0.07)",
            transition: "width 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      )}
      <span className="relative min-w-0 truncate text-[13px] leading-5 text-ink">
        {prefix && <span className="text-placeholder">{prefix}</span>}
        {children}
      </span>
      <Arrow />
    </>
  );

  const cls = SHELL + (disabled ? " pointer-events-none opacity-60" : "") + (className ? ` ${className}` : "");

  if (props.href !== undefined) {
    return (
      <Link href={props.href} onClick={props.onClick} className={cls} aria-label={label}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={props.onClick} disabled={disabled} className={cls} aria-label={label}>
      {inner}
    </button>
  );
}
