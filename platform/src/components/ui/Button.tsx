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

export function Button(props: AsButton | AsLink) {
  const { variant = "secondary", size = "md", block, arrow, className = "", children, ...rest } = props;

  /* `squircle` pairs the iOS-style continuous corner with whatever radius the
     size set — the same pairing every other rounded surface in the app uses. */
  const cls = `btn squircle ${className}`.trim();
  const attrs = {
    "data-variant": variant,
    "data-size": size,
    ...(block ? { "data-block": "" } : {}),
    ...(arrow ? { "data-arrow": "" } : {}),
  };

  /* The label is wrapped so it can truncate against the arrow rather than
     pushing it off the end — the card's button carries a step title that is
     routinely longer than the bar. */
  const body = arrow ? (
    <>
      <span className="min-w-0 truncate">{children}</span>
      <Arrow />
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
