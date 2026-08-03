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
  className?: string;
  children: React.ReactNode;
};

type AsButton = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: never };
type AsLink = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = "secondary", size = "md", block, className = "", children, ...rest } = props;

  /* `squircle` pairs the iOS-style continuous corner with whatever radius the
     size set — the same pairing every other rounded surface in the app uses. */
  const cls = `btn squircle ${className}`.trim();
  const attrs = {
    "data-variant": variant,
    "data-size": size,
    ...(block ? { "data-block": "" } : {}),
  };

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchor } = rest as AsLink;
    return (
      <Link href={href} className={cls} {...attrs} {...anchor}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as AsButton;
  return (
    <button type={type} className={cls} {...attrs} {...button}>
      {children}
    </button>
  );
}
