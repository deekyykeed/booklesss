"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { setProgressScope } from "@/lib/progress";

/* Namespaces stored progress to the signed-in Clerk user, so two people
 * sharing a laptop don't inherit each other's ticks — and so signing in on a
 * new device starts clean rather than inheriting whatever that browser had.
 *
 * Only ever rendered when Clerk is configured (the reader layout checks), so
 * useUser always has a provider above it. Renders nothing.
 *
 * Signed out it falls back to the unscoped key — progress made before signing
 * in stays where it was rather than vanishing. */
export function ProgressScope() {
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    setProgressScope(user?.id ?? null);
  }, [isLoaded, user?.id]);

  return null;
}
