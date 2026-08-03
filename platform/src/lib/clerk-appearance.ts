import type { ComponentProps } from "react";
import type { ClerkProvider } from "@clerk/nextjs";

type Appearance = NonNullable<ComponentProps<typeof ClerkProvider>["appearance"]>;

/* ------------------------------------------------------------------ *
 * One appearance for every Clerk surface — the sign-in modal, the
 * /sign-in and /sign-up pages, and the account menu. Set once on
 * ClerkProvider so it cascades; individual components don't re-style.
 *
 * Written as style objects rather than Tailwind class names on purpose:
 * these live outside JSX, and this project has already been bitten by the
 * class scanner silently dropping arbitrary values (see the note in
 * Sidebar.tsx). The `var(--color-*)` tokens come from @theme in
 * globals.css, so they resolve on :root — including inside Clerk's modal
 * portal.
 *
 * KEEP THIS CLERK'S OWN CARD (owner, 2026-08-03: "revert back to the
 * previous clerk card … i just want color changes"). A warm/pill restyle
 * was applied and reverted the same evening — shapes, radii and the footer
 * band are Clerk's defaults, and only colours are ours to change:
 *   - form inputs get a border you can actually see unfocused ("the text
 *     boxes are barely visible")
 *   - the Google button gets a grey tint so it isn't white-on-white
 *     ("the sign in with google button is also too white")
 * ------------------------------------------------------------------ */

/** Matches the header's circle buttons, so the avatar sits in the same family. */
const CIRCLE_SHADOW =
  "0 0.6px 0.6px -1.25px rgba(0,0,0,0.18), 0 2.3px 2.3px -2.5px rgba(0,0,0,0.16), 0 10px 10px -3.75px rgba(0,0,0,0.06)";

const CARD_SHADOW = "0 1px 1px -0.5px rgba(0,0,0,0.06), 0 12px 32px -8px rgba(0,0,0,0.16)";

export const clerkAppearance: Appearance = {
  /* Sanctioned "items inside the card": the legal pair in the card's own
     footer — and the Google-review-friendly privacy link back beside the
     form itself. */
  options: {
    privacyPageUrl: "/privacy",
    termsPageUrl: "/terms",
  },
  variables: {
    colorPrimary: "#0b0b0b", // --color-btn: actions are black in this app
    colorForeground: "#171717", // --color-ink
    colorMutedForeground: "#707070", // --color-muted
    colorBorder: "#dfdfdf", // --color-line
    colorBackground: "#ffffff",
    colorDanger: "#8d2525", // --color-danger
    colorSuccess: "#17754d", // brand green, darkened to stay readable
    borderRadius: "10px",
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    /* No logo on any Clerk card (owner, 2026-08-03: "use clerk stuff just
       remove the logo"). The slot would show the DASHBOARD's logo — still the
       retired diamond — and hiding the slot beats depending on what the
       dashboard happens to hold. */
    logoBox: { display: "none" },

    /* ---- shared card surfaces (sign-in / sign-up, modal and page) ---- */
    cardBox: {
      // The dashboard's cards sit at 28px now; Clerk's card joins the family.
      borderRadius: "24px",
      border: "1px solid var(--color-line)",
      boxShadow: CARD_SHADOW,
      overflow: "hidden",
    },
    card: {
      backgroundColor: "#ffffff",
      boxShadow: "none",
    },
    // Titles use the display face, like every heading in the reader.
    headerTitle: {
      fontFamily: "var(--font-familjen), var(--font-inter), sans-serif",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      color: "var(--color-ink)",
    },
    headerSubtitle: {
      color: "var(--color-muted)",
    },
    formButtonPrimary: {
      backgroundColor: "var(--color-btn)",
      color: "#ffffff",
      borderRadius: "10px",
      fontSize: "13.5px",
      fontWeight: 500,
      textTransform: "none",
      boxShadow: "none",
      "&:hover": { backgroundColor: "#000000" },
    },
    /* The Google button's tint and the input's unfocused edge are NOT here:
       both are rings Clerk's own rule wins, so they live as two plain class
       selectors at the bottom of globals.css. See the note there. */
    socialButtonsBlockButton: {
      borderRadius: "10px",
      color: "var(--color-ink)",
    },
    formFieldInput: {
      borderRadius: "10px",
    },
    footerActionLink: {
      color: "var(--color-ink)",
      fontWeight: 500,
    },

    /* ---- the sign-in popup ---- */
    // Same frosted treatment the reader uses for its own overlays, rather
    // than Clerk's flat scrim.
    modalBackdrop: {
      backgroundColor: "rgba(17,17,17,0.28)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    },

    /* ---- the profile picture + its menu ---- */
    // 32px to line up with the circle buttons beside it, wearing the same
    // #d4d4d4 hairline and the same shadow — one family, not a special case.
    userButtonAvatarBox: {
      width: "32px",
      height: "32px",
      border: "1px solid var(--color-line-2)",
      boxShadow: CIRCLE_SHADOW,
    },
    // Clerk falls back to initials when a user has no photo. That fallback used
    // to be a green gradient, which put the header's loudest colour on the one
    // control that has nothing to do with progress — green is for completion
    // here. Plain white with ink initials instead; a real photo covers it.
    avatarBox: {
      background: "#ffffff",
      color: "var(--color-ink-2)",
    },
    userButtonPopoverCard: {
      borderRadius: "18px",
      border: "1px solid var(--color-line)",
      boxShadow: CARD_SHADOW,
    },
    userButtonPopoverActionButton: {
      color: "var(--color-ink-2)",
      "&:hover": { backgroundColor: "var(--color-active)", color: "var(--color-ink)" },
    },
  },
};
