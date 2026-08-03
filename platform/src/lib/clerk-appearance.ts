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
 * Colour logic follows the app, not Clerk's defaults: solid black for
 * actions (same as the Run and "Next ·" buttons) and green reserved for
 * progress and success, so a sign-in button never competes with a
 * completion ring.
 * ------------------------------------------------------------------ */

/** Matches the header's circle buttons, so the avatar sits in the same family. */
const CIRCLE_SHADOW =
  "0 0.6px 0.6px -1.25px rgba(0,0,0,0.18), 0 2.3px 2.3px -2.5px rgba(0,0,0,0.16), 0 10px 10px -3.75px rgba(0,0,0,0.06)";

const CARD_SHADOW = "0 1px 1px -0.5px rgba(0,0,0,0.06), 0 12px 32px -8px rgba(0,0,0,0.16)";

export const clerkAppearance: Appearance = {
  /* Sanctioned "items inside the card": the legal pair in the card's own
     footer. This restores the privacy link the landing card carried before
     it became Clerk's component — and Google's OAuth review wants it near
     the form, not only in the page footer. */
  options: {
    privacyPageUrl: "/privacy",
    termsPageUrl: "/terms",
  },
  variables: {
    colorPrimary: "#0b0b0b", // --color-btn: actions are black in this app
    colorForeground: "#171717", // --color-ink
    /* WARM, not zinc (owner, 2026-08-03: "the colors on this look off").
       The landing is a cream page (#FAF9F5) and Clerk's cool greys sat in
       it like a different app — every grey below leans toward the page's
       own warmth instead. */
    colorMutedForeground: "#6E6B63",
    colorBorder: "#E4E1D8",
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
      // 28px like the landing's own cards, warm hairline, warm-tinted shadow
      // (the design system's rule: tint shadows to the ground's hue).
      borderRadius: "28px",
      border: "1px solid rgba(30,30,29,0.10)",
      boxShadow: "0 1px 1px -0.5px rgba(60,50,30,0.05), 0 20px 40px -15px rgba(60,50,30,0.10)",
      overflow: "hidden",
    },
    card: {
      backgroundColor: "#ffffff",
      boxShadow: "none",
    },
    /* Clerk paints this band grey by default, which is the single loudest
       "different app" tell inside a warm page — one card, one colour. */
    footer: {
      background: "#ffffff",
    },
    dividerLine: { backgroundColor: "rgba(30,30,29,0.10)" },
    dividerText: { color: "#6E6B63" },
    // The reference's black button carries no glyph.
    buttonArrowIcon: { display: "none" },
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
    /* Pills, like every control on the landing (and the reference): the
       Download button, the Google button and the fields are one family. */
    formButtonPrimary: {
      backgroundColor: "var(--color-btn)",
      color: "#ffffff",
      borderRadius: "999px",
      fontSize: "15px",
      fontWeight: 500,
      textTransform: "none",
      boxShadow: "none",
      "&:hover": { backgroundColor: "#000000" },
    },
    socialButtonsBlockButton: {
      border: "1px solid #E4E1D8",
      borderRadius: "999px",
      backgroundColor: "#ffffff",
      color: "var(--color-ink)",
      "&:hover": { borderColor: "rgba(30,30,29,0.28)" },
    },
    formFieldInput: {
      borderRadius: "999px",
      border: "1px solid #E4E1D8",
      padding: "0.625rem 1.25rem",
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
