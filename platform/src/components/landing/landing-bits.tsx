"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { requireAccount } from "@/lib/onboarding";
import { useProgress } from "@/lib/progress";

/* The landing page's two client pieces. The page itself is a server
 * component so its whole pitch — name, purpose, privacy link — is in the
 * static HTML, which is what Google's review reads; these are the only parts
 * that need the browser. */

/** Sends people who already live here past the front door. A signed-in
 *  student, or a device with real studying on it, opening booklesss.app
 *  wants their dashboard, not the pitch — the pitch is for people who
 *  haven't answered "what is this" yet. `replace` so the landing doesn't
 *  sit in history making the back button bounce them through it again. */
export function ToApp() {
  const router = useRouter();
  const signedIn = useSignedIn();
  const { hydrated, daysStudied } = useProgress();

  useEffect(() => {
    if (signedIn === true || (hydrated && daysStudied > 0)) router.replace("/home");
  }, [signedIn, hydrated, daysStudied, router]);

  return null;
}

/** The landing page's only action (owner, 2026-08-03: "the only link i expect
 *  there is signing up — nothing to the course or whatever").
 *
 *  Sign-up rather than sign-in, and no second button beside it, because the
 *  sheet carries its own "Already have an account?" toggle — a returning
 *  reader is one tap from where they need to be without the front door having
 *  to offer two doors. Lands them on the dashboard once they're through. */
export function LandingSignUp({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => requireAccount("manual", "/home", "sign-up")} className={className}>
      {children}
    </button>
  );
}
