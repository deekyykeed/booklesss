"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { authEnabled } from "@/lib/auth";
import { useIsClient } from "@/lib/is-client";
import { useProgress } from "@/lib/progress";
import { AuthPanel } from "@/components/auth/AuthPanel";

/* The landing page's client pieces. The page itself is a server component so
 * its whole pitch — name, purpose, privacy link — is in the static HTML,
 * which is what Google's review reads; these are the only parts that need
 * the browser. The look is the owner's reference (2026-08-03, Claude's own
 * mobile login page): a "Get the app" card and an auth card, both pill
 * controls in soft white cards. */

/** Sends people who already live here past the front door. A signed-in
 *  student, or a device with real studying on it, opening booklesss.app
 *  wants their dashboard, not the pitch — the pitch is for people who
 *  haven't answered "what is this" yet. `replace` so the landing doesn't
 *  sit in history making the back button bounce them through it again. */
export function ToApp() {
  const router = useRouter();
  const signedIn = useSignedIn();
  const { hydrated, daysStudied } = useProgress();

  useEffect(() => {
    if (signedIn === true || (hydrated && daysStudied > 0)) router.replace("/dashboard");
  }, [signedIn, hydrated, daysStudied, router]);

  return null;
}

/* The reference's "Get the app" card lived here and was removed by the owner
 * (2026-08-03). The install prompt survives on the dashboard, in
 * components/home/OfflineTools — a better moment for it in any case, since a
 * stranger at the front door has not read a word yet. */

/** The sign-up card, inline on the front door.
 *
 *  THE ACCOUNT COMES FIRST (owner, 2026-08-03: "after email address and sign
 *  up they go to this page and start filling in a bunch of details"). The
 *  questions live at /onboarding and this card sends them there — an email is
 *  the thing worth having early, and a student who has just made an account
 *  will answer ten questions where a stranger might not have started at all.
 *
 *  IT IS THE APP'S OWN FORM NOW (2026-08-05). This was Clerk's `<SignUp>` with
 *  `routing="hash"`, which existed because the card sits on "/" rather than on
 *  its own route and Clerk needed somewhere to run its sub-steps. There are no
 *  sub-steps: `signUp()` returns a session, and the referral rides
 *  `options.data` on that one call. See components/auth/AuthForm.
 *
 *  The signed-out landing is a static server render, so the card still waits
 *  for the client — AuthForm reads `referrer()` out of localStorage, which does
 *  not exist during that render. The held space is the same height so the page
 *  does not jump when it arrives. */
export function LandingAuth() {
  /* useSyncExternalStore rather than the useState + useEffect(setReady) this
     used to be: that pattern is a cascading render and the lint rule that
     catches it is right. A store that never changes, whose server snapshot is
     false and whose client snapshot is true, gives the same answer in one
     render instead of two. Same shape as `useIsClient` in the onboarding
     flow. */
  const ready = useIsClient();

  if (!authEnabled) return null;
  if (!ready) return <div className="min-h-[420px]" aria-hidden="true" />;

  return (
    <div className="flex min-h-[420px] justify-center">
      <AuthPanel initialMode="sign-up" />
    </div>
  );
}
