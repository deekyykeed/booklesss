"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";

/* Deliberately a CLIENT component.
 *
 * <Show> works in server components too, but there it resolves auth during the
 * server render — which opts the whole route out of static generation. This
 * site prerenders every lesson as static HTML, so the header must not be what
 * forces a server round-trip. As a client island, auth resolves in the browser
 * after hydration and the pages stay static.
 *
 * <Show> replaced <SignedIn>/<SignedOut> in Clerk v7. */
export function Account() {
  return (
    <>
      <Show when="signed-in">
        {/* elements takes class names — sized to match the 32px circle buttons
            beside it so the header cluster stays on one baseline. */}
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
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
    </>
  );
}
