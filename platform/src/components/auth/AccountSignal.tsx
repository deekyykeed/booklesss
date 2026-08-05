"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { setAccountRead, setAccountUser, setSignedIn, useAccountRead } from "@/lib/account";
import { adoptIdentity, matchesAccount, parseAccountIdentity, useIdentity } from "@/lib/identity";
import { referralCode, setMyReferralCode } from "@/lib/referral";
import { syncProfile } from "@/lib/profile-sync";
import { browserClient } from "@/lib/supabase/browser";

/* ------------------------------------------------------------------ *
 * The one component that asks who is signed in, and it renders nothing.
 *
 * It copies the answer into lib/account, which is what the checkpoint row and
 * the next-step link read. That indirection was built because Clerk's hooks
 * threw without a provider; it survives the migration for a reason that is
 * ours — a build with no Supabase keys must still render every step, and
 * `browserClient()` returning null has to be handled in ONE place rather than
 * at every gate.
 *
 * WHAT CHANGED ON 2026-08-05, and what deliberately did not.
 *
 * The account's copy of the student's answers used to live in Clerk's
 * `unsafeMetadata.identity`. It now lives in `students.identity`, a jsonb
 * column on the student's own row, read here under RLS with the anon key —
 * `auth.uid() = id`, so a student can read theirs and nobody else's.
 *
 * THE MERGE ITSELF IS UNTOUCHED. `parseAccountIdentity`, `mergeAccount`,
 * `sameAnswers`, `matchesAccount` and the `updatedAt` clock are the same code
 * they were, because the bug they were written to fix does not care what the
 * transport is: two copies of one student's answers can disagree, and the later
 * one wins. Porting the transport and rewriting the merge in the same session
 * would have made the next wrong dashboard impossible to attribute.
 *
 * `parseAccountIdentity` still treats what comes back as stranger input, and
 * still should. The column is written only by /api/profile behind the service
 * role — which is already stricter than unsafeMetadata, where any signed-in
 * browser could write its own — but a validator that stops being run because
 * the source got safer is a validator that was load-bearing for the wrong
 * reason.
 * ------------------------------------------------------------------ */

export function AccountSignal() {
  const { identity, hydrated } = useIdentity();
  const [user, setUser] = useState<User | null>(null);
  /* Read back out of the store this component writes, so the push below can
     wait for the read above to finish. It is the same value RequireOnboarding
     gates on, which is the point: "the account's record has landed" is one
     fact, and two components deciding it separately is how they drift. */
  const accountRead = useAccountRead();

  /* ------------------------------------------------------------------ *
   * The session.
   *
   * `onAuthStateChange` covers the first read too — it fires INITIAL_SESSION
   * once the client has restored the session from the cookie — so there is no
   * separate getSession() call to race with it.
   *
   * NOTHING ELSE IS CALLED INSIDE THE CALLBACK. supabase-js holds an internal
   * lock while it runs, and awaiting another supabase call from in there
   * deadlocks the client: the session never resolves, and every gate in the app
   * sits on "we haven't heard yet" forever. So this sets state and returns, and
   * the row is fetched from the effect below.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const supabase = browserClient();
    if (!supabase) return;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;
      setUser(next);
      setSignedIn(!!next);
      /* Published for the three surfaces that need the person rather than the
         boolean — the greeting, the progress namespace and the share code. See
         lib/account; none of them imports anything auth-shaped. */
      setAccountUser(next ? { id: next.id, email: next.email ?? null } : null);
      /* Signed out, there is no account record to wait for — say so, or the
         onboarding gate would hold a page for a document never coming. */
      if (!next) setAccountRead(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  /* The signed-in student's own share code, published so shareUrl() — a plain
     function with no React above it — can append `?r=<code>` to every link they
     share. The email's local part where there is no chosen name yet; the name
     takes over once onboarding has one, which is the same order the greeting
     falls back through. See lib/referral. */
  useEffect(() => {
    setMyReferralCode(
      user
        ? referralCode(
            identity?.nameChosen ? identity.name : user.email?.split("@")[0],
            user.id,
          )
        : null,
    );
  }, [user, identity]);

  /* The latest identity, readable from an effect that must not RE-RUN when it
     changes. The reconcile below needs the current record to compare against,
     but depending on it would re-fetch the row on every answer — ten selects
     during onboarding, for a row that cannot have changed underneath us,
     because this device is the only thing writing it.

     Written in an EFFECT, not during render — refs are not render state, and
     the lint rule that says so is right. Nothing is lost by the delay: the
     reconcile only reads this after awaiting a network round trip, by which
     point every effect from every render since has long run. */
  const latest = useRef(identity);
  useEffect(() => {
    latest.current = identity;
  }, [identity]);

  /* ------------------------------------------------------------------ *
   * The account's record, reconciled onto this device — ONCE PER SIGN-IN.
   *
   * The "signing up CONNECTS" promise in lib/identity: a student who answered
   * on their phone must not be asked again on a borrowed laptop, and a device
   * that answered while offline must not have those answers overwritten by an
   * older row.
   *
   * `matchesAccount` compares the stored record against THE MERGE rather than
   * against the row field by field, which is what makes this settle: adopting
   * makes the two equal, and a second pass would compare equal and stop.
   *
   * KEYED ON user.id, NOT ON THE USER OBJECT. supabase-js hands back a new
   * object on every token refresh — hourly, and on every tab focus — and each
   * one would otherwise re-read the row and re-adopt a student's own answers
   * back over themselves mid-sentence.
   * ------------------------------------------------------------------ */
  const uid = user?.id ?? null;
  useEffect(() => {
    if (!uid || !hydrated) return;
    const supabase = browserClient();
    if (!supabase) return;

    let live = true;
    void (async () => {
      /* `maybeSingle` and not `single`: a student who has just created an
         account has no row yet, and `single` calls that an error. No row is the
         normal first state, not a failure. */
      const { data, error } = await supabase
        .from("students")
        .select("identity")
        .eq("id", uid)
        .maybeSingle();

      if (!live) return;

      /* FAILS SOFT, like every other read on this path. An unreachable row is
         a student who reads their device's own copy — which is the copy the app
         renders from anyway. What must NOT happen is the gate being left
         waiting, so `setAccountRead` runs whichever branch was taken. */
      if (!error && data?.identity) {
        const acct = parseAccountIdentity(data.identity);
        if (acct && !matchesAccount(latest.current, acct)) adoptIdentity(acct);
      }

      setAccountRead(true);
    })();

    return () => {
      live = false;
    };
  }, [uid, hydrated]);

  /* ------------------------------------------------------------------ *
   * And up to the server, on every change.
   *
   * Separate from the reconcile above so that the two run at their own rates:
   * the row is read once when a session appears, and the answers are pushed
   * whenever they change. Both orders matter and they are opposite — the read
   * must happen before anything is written (posting mid-reconcile would write
   * the placeholder identity a fresh phone rolls for itself over the real one,
   * which is what cost six sign-ups their names on 2026-08-05), and the write
   * must keep happening long afterwards, all the way through onboarding.
   *
   * `accountRead` is what sequences them. De-duped inside syncProfile, so a
   * re-run that changes nothing costs a string comparison and no request.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!user || !hydrated || !accountRead) return;
    syncProfile(identity);
  }, [user, identity, hydrated, accountRead]);

  return null;
}
