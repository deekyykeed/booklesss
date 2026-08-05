"use client";

import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import type { OnboardingMode } from "@/lib/onboarding";

/* The standalone /sign-in and /sign-up pages — the same form the sheet holds,
 * on a page of its own.
 *
 * These are NOT the main way in. Every gate in the app calls `requireAccount()`
 * and gets the sheet over whatever the reader was doing, because nobody should
 * lose their place as a reward for signing up (see AuthGate). These pages exist
 * for the ways in that aren't a tap inside the app: a bookmark, a link in a
 * message, somebody typing the URL.
 *
 * Which is why the toggle is held HERE rather than by the route. A student who
 * lands on /sign-up and turns out to have an account already should not have to
 * navigate — the card flips, the way it does in the sheet, and the URL is left
 * behind as the historical detail it is.
 *
 * `after` is a real destination rather than null: arriving here means there was
 * no page behind to return to. A NEW account goes to /onboarding, because it
 * has no answers yet and a dashboard drawn from none is a screen of dashes
 * (see RequireOnboarding). Somebody SIGNING IN already answered, so they go
 * straight to the app — and if they somehow didn't, RequireOnboarding sends
 * them back. Same pair the Clerk card carried as forceRedirectUrl /
 * signInForceRedirectUrl. */
export function AuthPanel({ initialMode }: { initialMode: OnboardingMode }) {
  const [mode, setMode] = useState<OnboardingMode>(initialMode);
  const signUp = mode === "sign-up";

  return (
    <div
      className="w-full rounded-[12px] bg-white p-6"
      style={{
        maxWidth: 420,
        fontFamily: "var(--font-sans)",
        color: "rgb(11,11,11)",
        boxShadow:
          "0 0 0 1px rgba(11,11,11,0.06), 0 8px 24px -8px rgba(0,0,0,0.10), 0 24px 48px -12px rgba(0,0,0,0.16)",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 580, lineHeight: "28px" }}>
        {signUp ? "Create your account" : "Welcome back"}
      </h1>
      {signUp && (
        <p className="pt-1" style={{ fontSize: 14, lineHeight: "20px", color: "rgb(137,135,129)" }}>
          Your courses, your progress and your notes, on any phone you sign in on.
        </p>
      )}
      <div className="pt-4">
        <AuthForm mode={mode} onMode={setMode} after={signUp ? "/onboarding" : "/dashboard"} />
      </div>
    </div>
  );
}
