"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { useSignedIn } from "@/lib/account";
import { clerkEnabled } from "@/lib/clerk";
import { useIsClient } from "@/lib/is-client";
import { accountIdentity } from "@/lib/identity";
import { useProgress } from "@/lib/progress";
import { referrer } from "@/lib/referral";

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

/** Clerk's own sign-up card, inline on the front door.
 *
 *  THE ACCOUNT COMES FIRST (owner, 2026-08-03: "after email address and sign
 *  up they go to this page and start filling in a bunch of details … add back
 *  the clerk thing on the home page"). The questions moved to /onboarding and
 *  this card sends them there — an email is the thing worth having early, and
 *  a student who has just made an account will answer three questions where a
 *  stranger might not have started at all.
 *
 *  `routing="hash"` because the card is not on its dedicated route: Clerk's
 *  sub-steps run in the URL fragment right here on "/". unsafeMetadata carries
 *  who referred this device and who it has been reading as — read after mount,
 *  since both live in localStorage and the server renders a held space. */
export function LandingAuth() {
  /* Past the server render, which is what `referrer()` and `accountIdentity()`
     below both need — they read localStorage, which does not exist during it.
     useSyncExternalStore rather than the useState + useEffect(setReady) this
     used to be: that pattern is a cascading render and the lint rule that
     catches it is right. A store that never changes, whose server snapshot is
     false and whose client snapshot is true, gives the same answer in one
     render instead of two. Same shape as `useIsClient` in the onboarding
     flow. */
  const ready = useIsClient();

  if (!clerkEnabled) return null;
  if (!ready) return <div className="min-h-[420px]" aria-hidden="true" />;

  const referredBy = referrer();
  const identity = accountIdentity();
  return (
    <div className="flex min-h-[420px] justify-center">
      <SignUp
        routing="hash"
        signInUrl="/sign-in"
        /* New accounts go and answer the three questions. Someone who flips to
           "Sign in" already has answers, so they go straight to the app. */
        forceRedirectUrl="/onboarding"
        signInForceRedirectUrl="/dashboard"
        /* No header: the page's headline right above already says what this
           is, and Clerk's own title would be the second one on screen. */
        appearance={{ elements: { header: { display: "none" } } }}
        unsafeMetadata={{
          ...(referredBy ? { referredBy } : {}),
          ...(identity ? { identity } : {}),
        }}
      />
    </div>
  );
}
