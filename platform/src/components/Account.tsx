"use client";

import { useSignedIn } from "@/lib/account";
import { authEnabled } from "@/lib/auth";
import { requireAccount } from "@/lib/onboarding";
import { HugeIcon } from "@/components/icons/huge";
import { HeaderAvatar } from "./identity/HeaderAvatar";

/* ------------------------------------------------------------------ *
 * The header's account control.
 *
 * Deliberately a CLIENT component. Resolving the session during a server render
 * would opt the whole route out of static generation, and this site prerenders
 * every lesson as static HTML — the header must not be the thing that forces a
 * round trip. As a client island the session resolves after hydration and the
 * pages stay static.
 *
 * THREE STATES, ALL DRAWN, because the header sits at a fixed 32px and anything
 * that renders nothing leaves a visible hole:
 *   not yet   a 32px skeleton disc, so the slot is the right size before the
 *             real control lands (no shift, no pop-in)
 *   signed in the student's own face, which opens Settings
 *   signed out a person in the same 32px circle, which opens the sign-in sheet
 *
 * WHAT THIS USED TO BE. Clerk's `<UserButton>` with a composed menu — Dashboard,
 * My courses, Settings, Sign out — wrapped in an error boundary and a CSS skin
 * that painted the student's assigned face over Clerk's grey initials. All of
 * it is gone (2026-08-05, owner: "I'll use my own ui components from here on
 * out"). There is no third-party widget left to fail, to skin, or to dress, so
 * `ClerkIsland` and `ClerkAvatarSkin` went with it.
 *
 * The menu did not need replacing: it held two links to the dashboard, which
 * the wordmark beside it already goes to, plus Settings and Sign out — and
 * Settings is what the face opens, with Sign out inside it. A menu whose rows
 * are all reachable one tap away is a menu that is one tap in the way.
 * ------------------------------------------------------------------ */

export function Account() {
  const signedIn = useSignedIn();

  /* No keys means no accounts to have — the app renders exactly as it did
     before auth existed, and the face is just the device's own. */
  if (!authEnabled) return <HeaderAvatar />;

  /* null is "we haven't heard yet", NOT "signed out" — see lib/account. Drawing
     the sign-in button here would flash "make an account" at somebody who has
     one, which on a slow Zambian connection is the likelier case and the worse
     mistake. */
  if (signedIn === null) return <span className="account-skeleton" aria-hidden="true" />;

  if (signedIn) return <HeaderAvatar />;

  return (
    /* A person in a circle, not the word (owner, 2026-08-03): the signed-out
       slot matches the 32px circle buttons beside it, and signing in swaps the
       placeholder person for your own face — the shape stays, the person
       becomes real. */
    <button
      type="button"
      onClick={() => requireAccount("manual", null, "sign-in")}
      aria-label="Sign in"
      title="Sign in"
      className="grid h-8 w-8 place-items-center rounded-full border border-[#d4d4d4] bg-white text-muted shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)] transition-colors hover:text-ink"
    >
      <HugeIcon name="user" size={17} strokeWidth={1.5} />
    </button>
  );
}
