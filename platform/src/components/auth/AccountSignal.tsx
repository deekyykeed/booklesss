"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { setSignedIn } from "@/lib/account";
import {
  accountIdentity,
  adoptIdentity,
  parseAccountIdentity,
  useIdentity,
} from "@/lib/identity";
import { referralCode, setMyReferralCode } from "@/lib/referral";

/* The one component in the reader that asks Clerk whether anybody is signed
 * in, and it renders nothing. It copies the answer into lib/account, which is
 * what the checkpoint row and the next-step link read.
 *
 * It exists because those two are ordinary pieces of a static page: a build
 * with no Clerk keys mounts no provider, `useAuth()` throws without one, and a
 * hook cannot be called only when a flag is set. One component that is mounted
 * only when the provider is (see layout.tsx) turns a hook everything would
 * have to guard into a value anything can read.
 *
 * `isLoaded` is passed through as null rather than collapsed to false. "Not
 * signed in" and "we haven't heard yet" look identical for the first second of
 * a visit, and gating on the second one tells a signed-in student to make an
 * account they already have. */
export function AccountSignal() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { identity, hydrated } = useIdentity();

  useEffect(() => {
    setSignedIn(isLoaded ? !!isSignedIn : null);
  }, [isLoaded, isSignedIn]);

  /* The signed-in student's own share code, published the same way, so
     shareUrl() — a plain function with no React above it — can append
     `?r=<code>` to every link this person shares. See lib/referral. */
  useEffect(() => {
    setMyReferralCode(
      user ? referralCode(user.firstName ?? user.primaryEmailAddress?.emailAddress?.split("@")[0], user.id) : null,
    );
  }, [user]);

  /* The identity, reconciled with the account — the "signing up CONNECTS"
     promise in lib/identity, kept here because this is the one component
     that can read the user.
       - The account has an identity: it lands on this device. Signing in on
         a new phone is the same person arriving, so the account's name and
         face replace the placeholder this device rolled for itself.
       - The account has none (created before this existed, or the metadata
         was lost): the device's identity is written up, once, so the account
         stops being bare. `updateMetadata` deep-merges, which is what keeps
         `referredBy` intact beside it.
     Both sides settle: adopt makes the two equal, and the healing write
     re-runs this effect with the metadata now present, which compares equal
     and stops. The failure mode of a lost write is a retry on the next
     sign-in, not a broken reader, so errors are deliberately swallowed. */
  useEffect(() => {
    if (!user || !hydrated) return;
    const acct = parseAccountIdentity(user.unsafeMetadata?.identity);
    if (acct) {
      if (
        !identity ||
        identity.name !== acct.name ||
        identity.avatar !== acct.avatar ||
        identity.since !== acct.since
      ) {
        adoptIdentity(acct);
      }
    } else {
      const mine = accountIdentity();
      if (mine) user.updateMetadata({ unsafeMetadata: { identity: mine } }).catch(() => {});
    }
  }, [user, identity, hydrated]);

  return null;
}
