import Link from "next/link";

/* ------------------------------------------------------------------ *
 * The app's button.
 *
 * Generalised out of the course card's resume button, which is the look the
 * owner picked for the app to wear (2026-08-03) — "especially for the
 * onboarding stuff, because it looks good" — with the explicit ask that it be
 * a component that can be restyled per scenario.
 *
 * All of the styling is in `.btn` in globals.css, driven by four custom
 * properties. This file only decides which element to render and which data
 * attributes to set, so a new variant is a CSS rule and never a change here.
 *
 * Renders as an <a> when given `href`, a <button> otherwise, because a thing
 * that navigates must be a link — middle-click, long-press and "open in new
 * tab" all come from the element, not from the handler.
 * ------------------------------------------------------------------ */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Fill the width of the container — the onboarding sheet's default. */
  block?: boolean;
  /**
   * Wear the course card's resume button: label pushed left, arrow on the
   * right, the two ends of a full-width bar rather than a centred word.
   *
   * Owner, 2026-08-04 — "the button that is inside the course card is what I
   * mean… that's the design of button I want to adopt throughout". The paper
   * LOOK was already shared (.btn and .course-resume carry the same border,
   * radius, fill and shadow, generalised from each other in August), but the
   * composition never was: the card's button is a bar you move along, and the
   * onboarding one was a centred label in a lozenge. This is the half that was
   * missing.
   *
   * The arrow is drawn here rather than passed in, so every caller gets the
   * same mark at the same size and nobody re-draws it slightly differently.
   */
  arrow?: boolean;
  /**
   * Working on it — the arrow becomes a spinner and the label says what is
   * happening (owner, 2026-08-07: "show a loading icon when needed, a loading
   * spinner with text next to it giving the user context as to whats happening
   * behind the load").
   *
   * The label is the caller's to change, not this component's: only the caller
   * knows whether it is checking an account or making one. All this does is put
   * a moving thing beside the words, because a button whose label changed and
   * whose right end did not looks like a button that has not been pressed.
   *
   * NOT `disabled`. A disabled button drops to 50% opacity, which reads as "you
   * can't press this" rather than "this is running" — and greying out the one
   * thing on screen the moment it starts working is how a slow connection looks
   * like a broken form. Guard the second press in the handler instead.
   */
  busy?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** The card's arrow, at the card's size and weight. */
function Arrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="btn-arrow shrink-0"
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

type AsButton = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: never };
type AsLink = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & { href: string };

/** The spinner that stands in for the arrow while the button is working. Same
 *  15px box, so nothing on the row moves as one becomes the other, and it
 *  inherits `currentColor` — on the ink variant that is white, on paper it is
 *  the ink. ActionBar draws the identical mark; the ANIMATION is shared
 *  (`.bar-spinner` → `barSpin` in globals.css) so the two spin at one rate. */
function Spinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="bar-spinner shrink-0"
    >
      {/* Track first, then the arc over it — one lone stroke reads as a flicker
          rather than as a ring turning. */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" opacity="0.3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Button(props: AsButton | AsLink) {
  const { variant = "secondary", size = "md", block, arrow, busy, className = "", children, ...rest } = props;

  /* `squircle` pairs the iOS-style continuous corner with whatever radius the
     size set — the same pairing every other rounded surface in the app uses. */
  const cls = `btn squircle ${className}`.trim();
  const attrs = {
    "data-variant": variant,
    "data-size": size,
    ...(block ? { "data-block": "" } : {}),
    ...(arrow ? { "data-arrow": "" } : {}),
    ...(busy ? { "aria-busy": true } : {}),
  };

  /* The label is wrapped so it can truncate against the arrow rather than
     pushing it off the end — the card's button carries a step title that is
     routinely longer than the bar.

     A BUSY BUTTON WITHOUT `arrow` STILL GETS THE SPINNER, on the right of its
     label rather than at the far end of the bar. Otherwise the only button in
     the app that cannot say it is working is the plain centred one, which is
     most of them. */
  const body =
    arrow || busy ? (
      <>
        <span className="min-w-0 truncate">{children}</span>
        {busy ? <Spinner /> : <Arrow />}
      </>
    ) : (
      children
    );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchor } = rest as AsLink;
    return (
      <Link href={href} className={cls} {...attrs} {...anchor}>
        {body}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as AsButton;
  return (
    <button type={type} className={cls} {...attrs} {...button}>
      {body}
    </button>
  );
}
