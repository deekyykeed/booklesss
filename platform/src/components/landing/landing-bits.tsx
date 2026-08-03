"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { useInstall } from "@/lib/install";
import { requireAccount } from "@/lib/onboarding";
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

const PILL =
  "flex h-14 w-full items-center justify-center rounded-full border border-[rgba(30,30,29,0.15)] bg-white text-[16px] font-medium text-ink transition-colors hover:bg-[#fafafa]";

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

/** The auth card, exactly as the reference orders it: Google, OR, an email
 *  field, continue. Both ways in open CLERK'S modal (owner, 2026-08-03:
 *  "use clerk stuff") — the email typed here rides along as the form's
 *  initial value so nobody types it twice. Landing on /home once through,
 *  as the old sign-up button did. */
export function AuthCard() {
  const [email, setEmail] = useState("");

  return (
    <section className="rounded-[32px] border border-[rgba(30,30,29,0.10)] bg-white/60 p-6 py-8">
      <button
        type="button"
        onClick={() => requireAccount("manual", "/home", "sign-up")}
        className={PILL + " gap-2.5"}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-4 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-[rgba(30,30,29,0.12)]" />
        <span className="text-[12px] font-medium tracking-[0.08em] text-placeholder">OR</span>
        <span className="h-px flex-1 bg-[rgba(30,30,29,0.12)]" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          requireAccount("manual", "/home", "sign-up", email.trim() || null);
        }}
        className="flex flex-col gap-3"
      >
        <label>
          <span className="sr-only">Email</span>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 w-full rounded-full border border-[rgba(30,30,29,0.15)] bg-white px-6 text-[16px] text-ink outline-none placeholder:text-placeholder focus:border-[rgba(30,30,29,0.35)]"
          />
        </label>
        <button type="submit" className={PILL}>
          Continue with email
        </button>
      </form>

      {/* Load-bearing for Google's OAuth review: the home page must link the
          privacy policy. The footer links it again; this one is where the
          reference puts it. */}
      <p className="mt-5 text-center text-[13.5px] leading-5 text-muted">
        By continuing, you acknowledge Booklesss&apos;s{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
          Privacy Policy
        </a>
        .
      </p>
    </section>
  );
}
