"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { clerkEnabled } from "@/lib/clerk";
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
    if (signedIn === true || (hydrated && daysStudied > 0)) router.replace("/dashboard");
  }, [signedIn, hydrated, daysStudied, router]);

  return null;
}

/* The reference's "Get the app" card lived here and was removed by the owner
 * (2026-08-03). The install prompt survives on the dashboard, in
 * components/home/OfflineTools — a better moment for it in any case, since a
 * stranger at the front door has not read a word yet. */

/**
 * The front door's one action: a button to the door.
 *
 * IT WAS CLERK'S SIGN-UP CARD, INLINE HERE, and that produced second-class
 * accounts. Once the account became question zero of /onboarding — in our own
 * markup, deriving a handle from the email (lib/handle) — this card was a
 * SECOND way in that skipped all of it: a student arriving through the page
 * the marketing points at got a Clerk-shaped form and no handle, while a
 * student stopped by a checkpoint got ours and did. Two doors into one product,
 * and the busier one was the worse one.
 *
 * So the four surfaces collapsed onto /onboarding — this card, /sign-up and
 * /sign-in — and what is left here is a button. Nothing is lost: the referral
 * code and the device identity that used to ride this card's unsafeMetadata are
 * attached by the account step instead, which is where the account is now made.
 *
 * IT MAKES THIS PAGE MORE LIKELY TO PASS GOOGLE'S BRANDING REVIEW, not less,
 * which is the happy accident. The homepage rules want something static that
 * explains the app and does not require signing in; an embedded auth widget is
 * the opposite of that. Google sign-in is off for a while yet (owner,
 * 2026-08-04) — when it comes back, this page is in better shape for it than it
 * was.
 *
 * Still a client component for one reason: `clerkEnabled`. A build with no keys
 * has nothing to send anybody to, and the button should not be drawn at all.
 */
export function LandingAuth() {
  if (!clerkEnabled) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <Link
        href="/onboarding"
        className="squircle inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-7 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Get started
      </Link>
      <Link
        href="/onboarding?mode=sign-in"
        className="text-[14px] text-muted transition-colors hover:text-ink"
      >
        Already have an account? <span className="font-medium text-ink">Sign in</span>
      </Link>
    </div>
  );
}
