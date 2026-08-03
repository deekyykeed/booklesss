"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setSignedIn } from "@/lib/account";

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

  useEffect(() => {
    setSignedIn(isLoaded ? !!isSignedIn : null);
  }, [isLoaded, isSignedIn]);

  return null;
}
