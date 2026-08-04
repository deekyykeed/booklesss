"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { useAccountRead, useSignedIn } from "@/lib/account";
import { clerkEnabled } from "@/lib/clerk";
import { accountIdentity, onboardingComplete, useIdentity } from "@/lib/identity";
import { useProgress } from "@/lib/progress";
import { referrer } from "@/lib/referral";

/* The landing page's client pieces. The page itself is a server component so
 * its whole pitch — name, purpose, privacy link — is in the static HTML,
 * which is what Google's review reads; these are the only parts that need
 * the browser. The look is the owner's reference (2026-08-03, Claude's own
 * mobile login page): a "Get the app" card and an auth card, both pill
 * controls in soft white cards. */

/**
 * Sends people who already live here past the front door. A signed-in student
 * opening booklesss.app wants their own pages, not the pitch — the pitch is
 * for people who haven't answered "what is this" yet. `replace` so the landing
 * doesn't sit in history making the back button bounce them through it again.
 *
 * WHERE PAST THE DOOR DEPENDS ON THE RECORD, and that is not a nicety. This
 * sent everyone to /dashboard, which fought the sign-up card six inches below
 * it: Clerk's own `forceRedirectUrl="/onboarding"` and this effect both fire
 * the moment the session goes live, and whichever landed second won. A new
 * student could be dragged to a dashboard that immediately bounced them back
 * to /onboarding — the right destination, reached by a visible detour through
 * a page they are not allowed to see yet. Reading `onboardingComplete` here
 * makes both paths agree on the answer instead of racing to give it.
 *
 * IT WAITS FOR THE ACCOUNT'S OWN ANSWERS (useAccountRead), for the reason
 * lib/account documents: a student signing in on a second phone is signed in a
 * beat before their record arrives, and routing on that beat would send
 * somebody who answered everything months ago back through onboarding.
 *
 * A SIGNED-OUT DEVICE STAYS ON THE LANDING, whatever it has read. It used to be
 * sent to /dashboard on `daysStudied > 0` alone, which was a redirect LOOP the
 * day the dashboard began requiring an account: here to /dashboard, RequireAccount
 * back to here, and round again. There is nothing at the other end for somebody
 * with no account — the sign-up card on this page is exactly what they need,
 * and it is already on screen. The old rule survives only where there are no
 * accounts to have (no Clerk keys), which is the build it was written for.
 */
export function ToApp() {
  const router = useRouter();
  const signedIn = useSignedIn();
  const accountRead = useAccountRead();
  const { identity, hydrated } = useIdentity();
  const { hydrated: progressRead, daysStudied } = useProgress();

  useEffect(() => {
    if (signedIn === true) {
      if (!accountRead || !hydrated) return;
      router.replace(onboardingComplete(identity) ? "/dashboard" : "/onboarding");
      return;
    }
    if (!clerkEnabled && progressRead && daysStudied > 0) router.replace("/dashboard");
  }, [signedIn, accountRead, identity, hydrated, progressRead, daysStudied, router]);

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
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

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
