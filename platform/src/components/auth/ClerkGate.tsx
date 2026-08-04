"use client";

import { useEffect, useRef } from "react";
import { useClerk } from "@clerk/nextjs";
import { useAccountAsk } from "@/lib/onboarding";
import { accountIdentity } from "@/lib/identity";
import { referrer } from "@/lib/referral";

/* The one component that opens Clerk's modal, and it renders nothing.
 *
 * Same shape as AccountSignal, for the same reason: the gates that call
 * requireAccount() are ordinary pieces of a static page — a checkpoint
 * button, a next-step link — and none of them can touch Clerk, whose hooks
 * throw without a provider above them. This sits inside the provider (see
 * layout.tsx), watches the ask store, and turns each ask into Clerk's own
 * sign-up or sign-in modal (owner, 2026-08-03: "use clerk stuff").
 *
 * What rides on the modal:
 *   - unsafeMetadata, written at the one moment an account is created from a
 *     visit: `referredBy` (who sent this device — lib/referral) and
 *     `identity` (who this device has been reading as — lib/identity), so
 *     sign-up CONNECTS the account to the name and face already on screen.
 *   - the redirect. Clerk treats a missing redirect as "go to the fallback",
 *     which defaults to "/", so STAY PUT has to be spelled out as the
 *     current URL. Both directions are set because the card carries its own
 *     sign-in/sign-up toggle, and a reader who flips it must land in the
 *     same place.
 *   - the email the landing card already asked for, if any, so the form
 *     opens filled in rather than asking twice.
 */
export function ClerkGate() {
  const clerk = useClerk();
  const ask = useAccountAsk();
  const seen = useRef(0);

  useEffect(() => {
    if (ask.seq === 0 || ask.seq === seen.current) return;
    seen.current = ask.seq;

    const redirectUrl = ask.after ?? window.location.pathname + window.location.search;
    const referredBy = referrer();
    const identity = accountIdentity();
    const shared = {
      forceRedirectUrl: redirectUrl,
      unsafeMetadata: {
        ...(referredBy ? { referredBy } : {}),
        ...(identity ? { identity } : {}),
      },
      ...(ask.email ? { initialValues: { emailAddress: ask.email } } : {}),
    };

    if (ask.mode === "sign-in") {
      clerk.openSignIn({ ...shared, signUpForceRedirectUrl: redirectUrl });
    } else {
      clerk.openSignUp({ ...shared, signInForceRedirectUrl: redirectUrl });
    }
  }, [ask, clerk]);

  return null;
}
