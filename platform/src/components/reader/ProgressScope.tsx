"use client";

import { useEffect } from "react";
import { useAccountUser, useSignedIn } from "@/lib/account";
import { setProgressScope } from "@/lib/progress";
import { startStateSync, stopStateSync } from "@/lib/state-sync";

/* Namespaces stored progress to the signed-in student, so two people sharing a
 * laptop don't inherit each other's ticks — and so signing in on a new device
 * starts clean rather than inheriting whatever that browser had.
 *
 * Reads lib/account rather than an auth SDK, so it needs no provider above it
 * and is safe on a build with no keys. Renders nothing.
 *
 * WAITS FOR THE SESSION TO RESOLVE. `signedIn === null` is "we haven't heard
 * yet", not "nobody" — scoping on it would namespace a signed-in student's
 * ticks to the unscoped key for the first second of every visit and then move
 * them, which reads as progress disappearing and coming back.
 *
 * Signed OUT it does fall back to the unscoped key, deliberately: progress made
 * before signing in stays where it was rather than vanishing.
 *
 * ── AND, SINCE 2026-08-10, IT STARTS THE SERVER SYNC ──
 *
 * The two belong in one component because they are one decision: which bucket
 * this device is reading, and which account that bucket belongs to. Splitting
 * them would let the sync adopt a student's server record into the anonymous
 * bucket if the two effects ever ran out of order — so the scope is set FIRST,
 * on the line above, and `startStateSync` re-checks it after its network round
 * trip before adopting anything.
 *
 * It is mounted in the dashboard and reader layouts, which is everywhere the
 * four synced stores are written. */
export function ProgressScope() {
  const signedIn = useSignedIn();
  const user = useAccountUser();
  const uid = user?.id ?? null;

  useEffect(() => {
    if (signedIn === null) return;
    setProgressScope(uid);
    /* Signed out this stops the sync and forgets the session, which is what
       keeps the next person on a shared laptop from pushing into the last
       one's record. */
    startStateSync(uid);
  }, [signedIn, uid]);

  /* Torn down on unmount rather than on every dependency change: `startStateSync`
     is idempotent for the same id and tears down its own subscriptions when the
     id changes, so a cleanup here keyed to [signedIn, uid] would stop a sync
     that had just been correctly started. */
  useEffect(() => stopStateSync, []);

  return null;
}
