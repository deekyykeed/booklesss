"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { useProgress } from "@/lib/progress";

/* The landing page's client pieces. The page itself is a server component so
 * its whole pitch — name, purpose, privacy link — is in the static HTML,
 * which is what Google's review reads; these are the only parts that need
 * the browser. The look is the owner's reference (2026-08-03, Claude's own
 * mobile login page): a "Get the app" card and an auth card, both pill
 * controls in soft white cards. */

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

/* The reference's "Get the app" card lived here and was removed by the owner
 * (2026-08-03). The install prompt survives on the dashboard, in
 * components/home/OfflineTools — a better moment for it in any case, since a
 * stranger at the front door has not read a word yet. */

/** The front door's action: start the questions.
 *
 *  Clerk's sign-up card sat here inline until the owner moved the whole ask
 *  to /onboarding (2026-08-03) — questions first, account last, so no account
 *  is ever created knowing nothing about who it belongs to. The card the
 *  reader eventually meets is still Clerk's; it is now the last of four
 *  steps rather than the first thing on the page.
 *
 *  A plain <Link>, so it works before hydration and a reviewer running no
 *  JavaScript still sees a real destination. */
export function LandingStart({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Link href="/onboarding" className={className}>
      {children}
    </Link>
  );
}
