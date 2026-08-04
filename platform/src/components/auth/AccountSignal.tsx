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
import { handleFromEmail, nextHandle } from "@/lib/handle";
import { avatarPngFile } from "@/components/identity/avatar-image";

/** How many suffixed handles to try before leaving the student without one.
 *  Three, because a fourth collision on the same email stem is rarer than the
 *  round trips are cheap — and this runs again on their next visit anyway. */
const HANDLE_TRIES = 3;

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

  /* ------------------------------------------------------------------ *
   * The handle, claimed once there is a session to claim it with.
   *
   * IT WAS PASSED TO signUp.password() AND THAT WAS THE WRONG PLACE. `SignUp`
   * is a stateful resource: the first call creates the attempt and every later
   * one operates on the attempt already in flight, so a retry — to suffix a
   * taken handle, or to fall back when usernames are off — is not a second
   * chance, it is a different and invalid request. The owner met it on the
   * first live sign-up as "email_address is not a valid parameter for this
   * request", an error naming the wrong field and pointing at the wrong
   * dashboard page, with his account not created.
   *
   * A SESSION IS THE RIGHT SIDE OF THAT LINE. `user.update({ username })` is a
   * plain update on a user that already exists: it either takes or it doesn't,
   * a rejection changes nothing, and retrying is free. So the account is made
   * with nothing but an email and a password — one call, no way for a nicety to
   * break it — and the handle is claimed a moment later, here.
   *
   * IT ALSO BACKFILLS. This runs for every signed-in user, not only new ones,
   * so accounts made before handles existed — or while the instance had
   * usernames switched off — pick one up on their next visit. Nobody has to
   * migrate anything.
   *
   * Silent throughout, and deliberately so. The student never asked for this
   * name; it is derived from their own email as a starting point they can
   * change on the "you" step. A failure — taken every time, usernames disabled,
   * a dropped connection — leaves them with no handle and a working account,
   * which is the correct trade in every case.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!user || user.username) return;
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    let live = true;
    void (async () => {
      const base = handleFromEmail(email);
      for (let n = 0; n <= HANDLE_TRIES && live; n++) {
        /* Counted, not random, so the second Deeky is `deeky2` rather than
           `deeky_8f3a` — a handle gets read out loud. */
        const username = n === 0 ? base : nextHandle(base, n + 1);
        try {
          await user.update({ username });
          return;
        } catch {
          /* Taken, malformed, or not supported by this instance. The next loop
             tries a suffix; if the reason was the instance rather than the
             name, all of them fail and the student simply has no handle yet. */
        }
      }
    })();

    return () => {
      live = false;
    };
  }, [user]);

  /* ------------------------------------------------------------------ *
   * And the face, onto the Clerk user as its actual profile image.
   *
   * Owner, 2026-08-04: "during the onboarding can the icon i picked not be put
   * in clerk as the profile pic?"
   *
   * identity/ClerkAvatarSkin already paints it behind Clerk's user button, and
   * that is a costume that only fits inside this app — it cannot reach Clerk's
   * own account modal or the Users table, where every student is still a pair of
   * grey initials. This makes it the account's real image, and the two hand over
   * cleanly: `user.hasImage` turns true, which is the exact flag the skin reads
   * to stand down.
   *
   * ONLY A FACE THEY CHOSE, on the same rule as the name above it. Every device
   * is assigned one on its first visit, and uploading those would be 200 PNGs a
   * day of artwork nobody picked — and would put a placeholder in front of the
   * student's own choice a minute later, since the upload settles before
   * onboarding does.
   *
   * The uploaded id is remembered in metadata rather than inferred from
   * `hasImage`, so that CHANGING the avatar re-uploads while an unchanged one
   * costs a string comparison. `updateMetadata` deep-merges, so this sits
   * alongside `identity` and `referredBy` without touching either.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!user || !hydrated || !identity?.nameChosen) return;
    const wanted = identity.avatar;
    if (user.unsafeMetadata?.avatarImage === wanted) return;

    /* The account can outlive this effect — a student who taps through the last
       question is on the dashboard before a 256px PNG has finished uploading —
       so a late result must not be written under a face they have since
       changed. */
    let live = true;
    void (async () => {
      const file = await avatarPngFile(wanted);
      if (!file || !live) return;
      await user.setProfileImage({ file });
      if (!live) return;
      await user.updateMetadata({ unsafeMetadata: { avatarImage: wanted } });
    })().catch(() => {
      /* Swallowed like every other write here. A profile picture is the least
         important thing happening during a sign-up, the face still draws in the
         app, and the next sign-in retries. */
    });

    return () => {
      live = false;
    };
  }, [user, identity, hydrated]);

  return null;
}
