"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { useSignedIn } from "@/lib/account";
import { clerkEnabled } from "@/lib/clerk";
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
    if (signedIn === true || (hydrated && daysStudied > 0)) router.replace("/home");
  }, [signedIn, hydrated, daysStudied, router]);

  return null;
}

/* The reference's "Get the app" card lived here and was removed by the owner
 * (2026-08-03). The install prompt survives on the dashboard, in
 * components/home/OfflineTools — a better moment for it in any case, since a
 * stranger at the front door has not read a word yet. */

/** Clerk's own sign-up card, inline where the reference puts its auth card
 *  (owner, 2026-08-03, off the live landing: "see this bit — just make it
 *  the clerk component"). The real form, not buttons that open a modal.
 *
 *  `routing="hash"` because the component is not on its dedicated route —
 *  Clerk's sub-steps (verification, the OAuth callback) run in the URL
 *  fragment right here on "/". unsafeMetadata carries the same pair
 *  ClerkGate sends: who sent this device, and who it has been reading as —
 *  read after mount, because both live in localStorage and the server
 *  renders this card as a held space. */
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
        forceRedirectUrl="/home"
        signInForceRedirectUrl="/home"
        /* No "Create your account" header HERE (owner, 2026-08-03: "remove
           that create your account text and stuff") — the page's headline
           right above the card already does that job. Landing-only: the
           modal and the /sign-in and /sign-up routes keep their titles,
           because there the card is alone on the surface. */
        appearance={{ elements: { header: { display: "none" } } }}
        unsafeMetadata={{
          ...(referredBy ? { referredBy } : {}),
          ...(identity ? { identity } : {}),
        }}
      />
    </div>
  );
}
