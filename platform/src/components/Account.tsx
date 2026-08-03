"use client";

import { ClerkFailed, ClerkLoaded, ClerkLoading, Show, UserButton } from "@clerk/nextjs";
import { requireAccount } from "@/lib/onboarding";
import { MynaIcon } from "@/components/icons/myna";
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
              <UserButton.Link href="/home" label="Dashboard" labelIcon={<DashboardGlyph size={16} />} />
              <UserButton.Link href="/home#courses" label="My courses" labelIcon={<CoursesGlyph size={16} />} />
              <UserButton.Action label="manageAccount" />
              <UserButton.Action label="signOut" />
            </UserButton.MenuItems>
          </UserButton>
        </Show>
        <Show when="signed-out">
          {/* OUR sheet, not Clerk's modal. <SignInButton mode="modal"> opened
              Clerk's own dialog, which wears whatever logo the Clerk dashboard
              holds — the retired diamond, when the owner met it live
              (2026-08-03) — plus "Secured by Clerk". The sheet is the same two
              fields in the app's own dress, opened onto sign-in because that
              is what this button means.

              A person in a circle, not the word (owner, same day): the
              signed-out slot matches the 32px circle buttons beside it, and
              signing in swaps the placeholder person for your own face —
              the shape stays, the person becomes real. */}
          <button
            type="button"
            onClick={() => requireAccount("manual", null, "sign-in")}
            aria-label="Sign in"
            title="Sign in"
            className="grid h-8 w-8 place-items-center rounded-full border border-[#d4d4d4] bg-white text-muted shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)] transition-colors hover:text-ink"
          >
            <MynaIcon name="user" size={17} strokeWidth={1.5} />
          </button>
        </Show>
      </ClerkLoaded>

      {/* Auth is down. There's nothing useful to offer — signing in wouldn't
          work — so the header simply drops the control and the reader is
          untouched. */}
      <ClerkFailed>{null}</ClerkFailed>
    </>
  );
}
