"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { authEnabled } from "@/lib/auth";

/**
 * Keeps a page for people who have an account (owner, 2026-08-03: "if the
 * account is not found a user shouldn't be able to see the dashboard").
 *
 * Renders nothing and blocks nothing on its own — it sends a signed-out
 * visitor to the front door, where the sign-up card is. The page still paints
 * for the instant before that, which is the right trade here: the dashboard
 * shows nobody else's data, only this device's own progress, so a flash of it
 * leaks nothing. Blocking the render instead would mean every student watches
 * a spinner while Clerk resolves, on every visit.
 *
 * `=== false` and never falsy, for the reason lib/account documents at
 * length: null means Clerk has not reported yet, and treating "we don't know"
 * as "signed out" throws a signed-in student off their own dashboard on a slow
 * connection. Also a no-op with no Clerk keys, where there are no accounts to
 * have and a redirect would strand the reader on a door that opens nowhere.
 */
export function RequireAccount({ to = "/" }: { to?: string }) {
  const router = useRouter();
  const signedIn = useSignedIn();

  useEffect(() => {
    if (authEnabled && signedIn === false) router.replace(to);
  }, [signedIn, router, to]);

  return null;
}
