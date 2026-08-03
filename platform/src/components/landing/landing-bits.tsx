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

/** The landing's Sign in — the same sheet as everywhere else, landing the
 *  reader on their dashboard once they're in. */
export function LandingSignIn({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => requireAccount("manual", "/home", "sign-in")} className={className}>
      {children}
    </button>
  );
}
