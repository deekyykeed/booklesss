"use client";

import { ClerkFailed, ClerkLoaded, ClerkLoading, Show, SignInButton, UserButton } from "@clerk/nextjs";
import { CoursesGlyph, DashboardGlyph } from "./home/plump-glyphs";

/* Deliberately a CLIENT component.
 *
 * <Show> works in server components too, but there it resolves auth during the
 * server render — which opts the whole route out of static generation. This
 * site prerenders every lesson as static HTML, so the header must not be what
 * forces a server round-trip. As a client island, auth resolves in the browser
 * after hydration and the pages stay static.
 *
 * <Show> replaced <SignedIn>/<SignedOut> in Clerk v7.
 *
 * The three states are all handled explicitly, because the header sits at a
 * fixed 32px and anything that renders nothing leaves a visible hole:
 *   loading -> a 32px skeleton disc, so the slot is already the right size
 *              when the real control lands (no shift, no pop-in)
 *   loaded  -> the account menu, or a sign-in pill
 *   failed  -> nothing, and the lesson carries on regardless
 *
 * Styling lives in lib/clerk-appearance.ts, set once on ClerkProvider. */
export function Account() {
  return (
    <>
      <ClerkLoading>
        <span className="account-skeleton" aria-hidden="true" />
      </ClerkLoading>

      <ClerkLoaded>
        <Show when="signed-in">
          {/* The menu carries the same Plump gradient marks as the dashboard
              tiles, so Clerk's surface reads as this app rather than a stock
              widget. Custom links first — they're why the menu is opened —
              then Clerk's own account and sign-out rows. */}
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link href="/" label="Dashboard" labelIcon={<DashboardGlyph size={16} />} />
              <UserButton.Link href="/#courses" label="My courses" labelIcon={<CoursesGlyph size={16} />} />
              <UserButton.Action label="manageAccount" />
              <UserButton.Action label="signOut" />
            </UserButton.MenuItems>
          </UserButton>
        </Show>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              type="button"
              className="squircle h-8 rounded-full border border-[#d4d4d4] bg-white px-3 text-xs font-medium text-ink-2 shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16)] transition-colors hover:text-ink"
            >
              Sign in
            </button>
          </SignInButton>
        </Show>
      </ClerkLoaded>

      {/* Auth is down. There's nothing useful to offer — signing in wouldn't
          work — so the header simply drops the control and the reader is
          untouched. */}
      <ClerkFailed>{null}</ClerkFailed>
    </>
  );
}
