"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { useSignedIn } from "@/lib/account";
import { clerkEnabled } from "@/lib/clerk";
import { accountIdentity } from "@/lib/identity";
import { useInstall } from "@/lib/install";
import { useProgress } from "@/lib/progress";
import { referrer } from "@/lib/referral";

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

/** The reference's "Get the app" card: the app icon, one line of what the
 *  app on your phone buys you, and a black Download button. Ours installs
 *  the PWA. Rendered only when this device can actually act on it — a
 *  button that does nothing is worse than no card, and the pitch below
 *  covers the reviewer who runs no JavaScript. */
export function GetAppCard() {
  const { canInstall, showIosHelp, install } = useInstall();
  if (!canInstall && !showIosHelp) return null;

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_40px_-15px_rgba(60,50,30,0.08)]">
      <div className="flex items-center gap-4">
        {/* The PWA's own tile — the wordmark on black, served from the app
            icon route, so the card shows exactly what lands on their home
            screen. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/apple-icon.png" alt="" className="h-12 w-12 rounded-xl" />
        <h2 className="font-display text-[24px] font-medium tracking-[-0.01em] text-ink">
          Get the app
        </h2>
      </div>
      <p className="mt-3 text-[16px] leading-6 text-ink-2">
        Your course on your phone — pick up a step whenever you have a minute.
      </p>
      {canInstall ? (
        <button
          type="button"
          onClick={install}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-ink text-[16px] font-medium text-white transition-opacity hover:opacity-85"
        >
          Download
        </button>
      ) : (
        <p className="mt-5 text-center text-[14px] leading-5 text-muted">
          To install: tap <span className="text-ink">Share</span>, then{" "}
          <span className="text-ink">Add to Home Screen</span>.
        </p>
      )}
    </section>
  );
}

/** Clerk's own sign-up card, inline where the reference puts its auth card
 *  (owner, 2026-08-03, off the live landing: "see this bit — just make it
 *  the clerk component"). The real form, not buttons that open a modal.
 *
 *  `routing="hash"` because the component is not on its dedicated route —
 *  Clerk's sub-steps (verification, the OAuth callback) run in the URL
 *  fragment right here on "/". unsafeMetadata carries the same pair
 *  ClerkGate sends: who sent this device, and who it has been reading as —
 *  read after mount, because both live in localStorage and the server
 *  renders this card as a held space. */
export function LandingAuth() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!clerkEnabled) return null;
  if (!ready) return <div className="min-h-[420px]" aria-hidden="true" />;

  const referredBy = referrer();
  const identity = accountIdentity();
  return (
    <div className="flex min-h-[420px] justify-center">
      <SignUp
        routing="hash"
        signInUrl="/sign-in"
        forceRedirectUrl="/home"
        signInForceRedirectUrl="/home"
        unsafeMetadata={{
          ...(referredBy ? { referredBy } : {}),
          ...(identity ? { identity } : {}),
        }}
      />
    </div>
  );
}
