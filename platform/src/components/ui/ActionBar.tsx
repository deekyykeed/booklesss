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
  /**
   * The fill's hue (owner, 2026-08-08: the course card's completion bar
   * should be "the same color as that mini chart in it"). The card's Spark
   * and its bar now speak the same colour — the curve says how the studying
   * moved, the fill says how far it got. Undefined keeps the neutral ink
   * wash, which is right anywhere the bar has no chart to agree with.
   */
  progressTone?: string;
  /** Spelled out where the visible label is not the whole story — the course
   *  card names the step it would resume. */
  label?: string;
  disabled?: boolean;
  className?: string;
  /**
   * Which of the two this bar is (owner, 2026-08-04: "that black is a variant
   * of the button").
   *
   * "default" is the white surface the course card wears — the bar as a place
   * to go. "primary" is the app's ink, for the one action on a screen that is
   * the point of it: "with the add to homescreen in black since it's what I
   * ultimately want."
   *
   * Two only, and deliberately. A third would need a reason to exist beyond
   * looking different, and a set of variants is how a shared control turns back
   * into the several hand-rolled buttons it was extracted to replace.
   */
  variant?: "default" | "primary";
  /**
   * Working on it — ink sweeps across the bar and the label inverts as the edge
   * passes under it, with a spinner where the arrow was.
   *
   * NOT A THIRD VARIANT. The bar it fills is still the default one, which is
   * the owner's point (2026-08-06): the control a student presses and the
   * control telling them it heard are the same object, so pressing it must not
   * swap it for a different-looking button. See `.action-bar[data-busy]` in
   * globals.css for how the sweep and the inversion stay on one clock.
   *
   * It reports nothing. A real percentage would need the request to have
   * progress to report, and an HTTP round trip does not — `progress` is the
   * prop for the case where there IS something to measure.
   */
  busy?: boolean;
};

/**
 * Three shapes, and the type says which: a link, a button that does something,
 * or a form's submit.
 *
 * The third is not the second with a different attribute. A `type="button"`
 * inside a form does nothing on Enter, and implicit submission — pressing
 * Enter in a field — needs a real submit button present for a form with more
 * than one input. The auth form has two, so spelling this wrong costs the
 * keyboard path silently: the bar still works when tapped, and Enter stops
 * doing anything at all.
 *
 * Which is also why a submit takes no `onClick`. Its handler is the form's
 * `onSubmit`, so both routes in run the same code; hanging a second one here
 * is how a control ends up submitting twice on a tap and once on Enter.
 */
type Props =
  | (Common & { href: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void })
  | (Common & { href?: undefined; onClick: () => void; type?: "button" })
  | (Common & { href?: undefined; onClick?: undefined; type: "submit" });

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

/** The spinner that replaces the arrow while the bar is working. Same 15px box
 *  as the arrow, so nothing on the row shifts when one becomes the other. */
function Spinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="bar-spinner relative shrink-0 text-muted"
    >
      {/* The track, then the arc. Drawing both means the spin reads as a ring
          turning rather than as a lone stroke flickering. */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* The padding and the row live on an inner element rather than on the shell,
   because the busy state stacks a SECOND copy of that row on top and the two
   have to be laid out identically to the pixel. The rendered box is unchanged
   — the padding simply moved one level in. */
const SHELL = "action-bar squircle relative z-10 block overflow-hidden";
const ROW = "flex items-center justify-between gap-3 px-2.5 py-1.5";

export function ActionBar(props: Props) {
  const { prefix, children, progress, progressTone, label, disabled, className, variant = "default", busy } = props;

  /* The row's contents, rendered once normally and — while busy — once more in
     white, clipped to the ink. Built here so the two copies cannot drift. */
  const row = (
    <>
      <span className="min-w-0 truncate text-[13px] leading-5">
        {prefix && <span className="opacity-55">{prefix}</span>}
        {children}
      </span>
      {busy ? <Spinner /> : <Arrow />}
    </>
  );

  const inner = (
    <>
      {/* The measured fill, behind everything and inert. Its width is the only
          thing that animates — a transition on the bar itself would drag the
          label with it. Suppressed while busy: two fills on one bar would be
          two different claims about the same edge. */}
      {progress !== undefined && !busy && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{
            width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`,
            /* 15% of the tone against the 7% the neutral ink gets: a hue is
               far lighter than black, so it needs the extra share to sit at
               the same visual weight. oklab, like every other mix in the
               app. */
            backgroundColor: progressTone
              ? `color-mix(in oklab, ${progressTone} 15%, transparent)`
              : "rgba(23, 23, 23, 0.07)",
            transition: "width 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      )}

      {/* The ink sweeping across. Width comes off --bar-fill, which the bar
          animates; see globals.css. */}
      {busy && (
        <span
          aria-hidden="true"
          className="bar-fill pointer-events-none absolute inset-y-0 left-0 bg-ink"
        />
      )}

      <span className={"relative " + ROW}>{row}</span>

      {/* The same row again, white, showing only where the ink has reached.
          `aria-hidden` because it is the identical text — a screen reader
          announcing the label twice is the cost of doing this visually. */}
      {busy && (
        <span
          aria-hidden="true"
          className={"bar-invert pointer-events-none absolute inset-0 text-white " + ROW}
        >
          {row}
        </span>
      )}
    </>
  );

  const cls =
    SHELL +
    (disabled && !busy ? " pointer-events-none opacity-60" : "") +
    (className ? ` ${className}` : "");

  /* `data-busy` is what actually starts the sweep — the animation and the
     --bar-fill it drives live on `.action-bar[data-busy="true"]` in globals.css.
     Rendering the fill and the inverted layer without it gets you both elements
     sitting at 0%: a spinner, and ink that never moves. */
  const busyAttr = busy ? "true" : undefined;

  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        onClick={props.onClick}
        className={cls}
        data-variant={variant}
        data-busy={busyAttr}
        aria-busy={busy || undefined}
        aria-label={label}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={disabled}
      className={cls}
      data-variant={variant}
      data-busy={busyAttr}
      aria-busy={busy || undefined}
      aria-label={label}
    >
      {inner}
    </button>
  );
}
