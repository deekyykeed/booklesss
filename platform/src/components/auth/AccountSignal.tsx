"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { setAccountRead, setSignedIn } from "@/lib/account";
import {
  accountBehind,
  accountIdentity,
  adoptIdentity,
  matchesAccount,
  parseAccountIdentity,
  useIdentity,
} from "@/lib/identity";
import { referralCode, setMyReferralCode } from "@/lib/referral";
import { syncProfile } from "@/lib/profile-sync";

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
    // Signed out, there is no account record to wait for — say so, or the
    // onboarding gate would hold a page for a document that is never coming.
    if (isLoaded && !isSignedIn) setAccountRead(true);
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
      /* The comparison is against the MERGE rather than against the account
         field by field (lib/identity), so every answer travels — the school,
         the courses and the plan — and so this effect settles: adopting makes
         the stored record equal the merge, the healing write below re-runs it
         with the metadata now present, and that pass matches and stops. */
      if (!matchesAccount(identity, acct)) {
        adoptIdentity(acct);
      } else if (accountBehind(identity, acct)) {
        // Answered on this device against an account that hasn't got it yet.
        user.updateMetadata({ unsafeMetadata: { identity: accountIdentity() } }).catch(() => {});
      }
    } else {
      const mine = accountIdentity();
      if (mine) user.updateMetadata({ unsafeMetadata: { identity: mine } }).catch(() => {});
    }

    /* The account's answers are now on this device — adoptIdentity persists
       synchronously, so by this line the record the onboarding gate reads is
       the reconciled one. Last, and unconditional: whichever branch ran, the
       metadata has been read, and a gate waiting on that must not be left
       holding a page because the two happened to already agree. */
    setAccountRead(true);

    /* And the third copy. AFTER the reconcile, deliberately: this is the one
       place that knows the settled answer rather than whichever half a single
       device happened to hold, and posting mid-reconcile would write the
       placeholder identity a fresh phone rolls for itself over the real one.
       De-duped inside syncProfile, so re-running on every identity change
       costs a string comparison. */
    syncProfile(identity);
  }, [user, identity, hydrated]);

  /* ------------------------------------------------------------------ *
   * The name, onto the Clerk USER — not just its metadata.
   *
   * Owner, 2026-08-04: "i wont require them so that the modal is not too long
   * for the first name and last, but i will require them during onboarding and
   * thats how ill get them into Clerk." So the sign-up card stays two fields,
   * and the name is collected on a screen where the student is already
   * committed — then written up here, which is what puts it in Clerk's own
   * Users table rather than buried in a metadata blob.
   *
   * ONLY A NAME THEY CHOSE. Every record has a name; most are the avatar's.
   * Writing those up would fill the Users table with two hundred Astronauts and
   * make `firstName` — the first rung of the dashboard greeting — actively
   * worse than the email it falls back to. `nameChosen` is the only thing that
   * tells a typed name from a given one.
   *
   * First word to firstName, the rest to lastName, which is the same split the
   * greeting already undoes in the other direction. A single-word name leaves
   * lastName empty rather than repeating itself.
   *
   * Its own effect, and errors swallowed like the metadata write above: a name
   * that fails to reach Clerk is retried on the next sign-in, and is not a
   * reason to break a student's dashboard.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!user || !hydrated || !identity?.nameChosen) return;
    const parts = identity.name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0] ?? "";
    const last = parts.slice(1).join(" ");
    if (!first) return;
    // Settles: once written, this compares equal and stops.
    if (user.firstName === first && (user.lastName ?? "") === last) return;
    user.update({ firstName: first, lastName: last }).catch(() => {});
  }, [user, identity, hydrated]);

  return null;
}
