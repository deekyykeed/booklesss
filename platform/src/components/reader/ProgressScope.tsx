"use client";

import { useEffect } from "react";
import { useAccountUser, useSignedIn } from "@/lib/account";
import { setProgressScope } from "@/lib/progress";

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
 * before signing in stays where it was rather than vanishing. */
export function ProgressScope() {
  const signedIn = useSignedIn();
  const user = useAccountUser();

  useEffect(() => {
    if (signedIn === null) return;
    setProgressScope(user?.id ?? null);
  }, [signedIn, user?.id]);

  return null;
}
