"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { referrer } from "@/lib/referral";
import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------ *
 * Sign in and sign up, in our own markup.
 *
 * Clerk's <SignIn /> and <SignUp /> components are deliberately NOT used
 * (owner, 2026-08-03: "I don't want the Clerk login component, I'm doing my
 * own UI"). This talks to the same backend through the headless hooks, so
 * Clerk still owns sessions, hashing and rate limiting — it owns none of the
 * pixels.
 *
 * ONE SCREEN, TWO FIELDS. The dashboard is configured so nothing else is
 * asked for: no username, no first/last name, no social buttons, and
 * "Verify at sign-up" is off so a new account is live immediately with no
 * code to go and fetch. That is the whole point — a student arriving from a
 * WhatsApp link finishes this without leaving the app.
 *
 * THIS IS CLERK 7's SIGNALS API, WHICH IS NOT THE ONE MOST EXAMPLES SHOW.
 * `useSignUp()` here returns `{ signUp, errors, fetchStatus }` — NOT the
 * `{ isLoaded, signUp, setActive }` of every older tutorial. Three differences
 * that matter, all of them found by reading node_modules rather than guessing:
 *   - the call is `signUp.password({ emailAddress, password })`, not
 *     `signUp.create(...)`, and `signIn.password({ identifier, password })`.
 *   - errors are RETURNED as `{ error }`, not thrown. A try/catch around these
 *     catches nothing and every failure looks like a success.
 *   - the session is activated by `finalize()`, not `setActive()`.
 * If this file ever stops compiling after a Clerk upgrade, read
 * `node_modules/@clerk/shared/dist/types/signUpFuture.d.mts` first.
 *
 * THE autoComplete VALUES ARE LOAD-BEARING. They are what makes a phone offer
 * to save the password, which is the difference between signing in once and
 * signing in every time:
 *   - the identifier must be `username`, the token password managers pair
 *     with a password field. `email` alone is weaker.
 *   - `new-password` on sign-up prompts to save and to generate.
 *   - `current-password` on sign-in prompts to fill.
 * They only work inside a real <form> with a real submit button, which is why
 * this is a form and not a div with an onClick.
 * ------------------------------------------------------------------ */

/** `longMessage` is Clerk's user-facing wording; `message` is for developers. */
function say(error: { longMessage?: string; message?: string } | null | undefined): string {
  return (
    error?.longMessage ??
    error?.message ??
    "That didn't work. Check the email and password and try again."
  );
}

/* Clerk's calls can simply never come back. The bot-protection challenge
 * (Cloudflare Turnstile, inside signUp.password) resolves silently on a
 * normal phone, but when it can't — a blocked network, a browser it distrusts
 * — the promise neither resolves nor rejects, and the button reads
 * "One moment…" until the end of time. Measured, not supposed: 30+ seconds
 * with no settle, no error, no request. A student on a patchy connection gets
 * the same wall, so every await here races a clock and stuck gets a message
 * instead of silence. */
const STUCK = Symbol("stuck");
const STUCK_AFTER_MS = 20000;

function withTimeout<T>(p: Promise<T>): Promise<T | typeof STUCK> {
  return Promise.race([p, new Promise<typeof STUCK>((r) => setTimeout(() => r(STUCK), STUCK_AFTER_MS))]);
}

/**
 * `redirectTo` is where to land once the session is live. The /sign-in and
 * /sign-up ROUTES have nowhere to return to, so they take the default and go
 * to the dashboard.
 *
 * null means STAY PUT, and it is what the onboarding sheet passes when the ask
 * came from a checkpoint: the reader is halfway down a step, the sheet closes
 * itself the moment they are signed in, and navigating anywhere at that point
 * would take away the page they were reading as a reward for signing up.
 */
export function AuthForm({
  mode,
  redirectTo = "/",
}: {
  mode: "sign-in" | "sign-up";
  redirectTo?: string | null;
}) {
  const router = useRouter();
  const { signUp, fetchStatus: upFetch } = useSignUp();
  const { signIn, fetchStatus: inFetch } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const isUp = mode === "sign-up";
  /* `!error` matters: a call that hit the STUCK clock never settles, so the
     resource's fetchStatus can read "fetching" forever afterwards — and a
     button still saying "One moment…" under "try again" is a locked door
     behind an apology. Once an error is showing, the form is usable; a
     resubmit simply starts a fresh attempt. */
  const busy = sending || (!error && (isUp ? upFetch : inFetch) === "fetching");

  /* Google, in one tap. The same signals API as the fields below —
     `sso()` navigates away to Google and back through /sso-callback, so
     unlike password() nothing here runs after success; only an error
     returns. On sign-UP the referral rides along, same as password
     sign-up: the account this creates should record who sent them.

     `redirectUrl` is where the callback page finally lands the reader:
     the sheet's `after` if a gate set one, else the page they are on now
     — the navigation away and back is why "stay put" has to be spelled
     out as a URL rather than simply not navigating. */
  async function google() {
    if (busy) return;
    setSending(true);
    setError(null);
    try {
      const redirectUrl = redirectTo ?? window.location.pathname;
      const referredBy = isUp ? referrer() : null;
      const params = {
        strategy: "oauth_google" as const,
        redirectUrl,
        redirectCallbackUrl: "/sso-callback",
      };
      const attempt = await withTimeout(
        isUp
          ? signUp.sso({ ...params, ...(referredBy ? { unsafeMetadata: { referredBy } } : {}) })
          : signIn.sso(params),
      );
      if (attempt === STUCK) {
        setError("This is taking too long. Check your connection and try again.");
        return;
      }
      if (attempt.error) setError(say(attempt.error));
      // No success branch: the browser is already on its way to Google.
    } finally {
      setSending(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setSending(true);
    setError(null);

    try {
      /* Who sent them rides on the account itself: the `?r=` code this device
         arrived under (lib/referral) is copied into unsafeMetadata at the one
         moment a person is created from a visit. The owner reads it off the
         user in the Clerk dashboard and rewards the sharer — no server table,
         no extra round trip. Absent for sign-IN on purpose: an account that
         already exists was already attributed. */
      const referredBy = isUp ? referrer() : null;

      // Step one: hand over the credentials.
      const attempt = await withTimeout(
        isUp
          ? signUp.password({
              emailAddress: email,
              password,
              ...(referredBy ? { unsafeMetadata: { referredBy } } : {}),
            })
          : signIn.password({ identifier: email, password }),
      );

      if (attempt === STUCK) {
        setError("This is taking too long. Check your connection and try again.");
        return;
      }
      if (attempt.error) {
        setError(say(attempt.error));
        return;
      }

      // Step two: turn the completed attempt into a live session.
      const done = await withTimeout(isUp ? signUp.finalize() : signIn.finalize());
      if (done === STUCK) {
        setError("This is taking too long. Check your connection and try again.");
        return;
      }
      if (done.error) {
        setError(say(done.error));
        return;
      }

      // See the note on the prop: null is "leave them where they are".
      if (redirectTo) router.push(redirectTo);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-3">
      {/* Google first, exactly as the reference card orders it: the tap that
          needs no typing goes above the fields that need a keyboard. The G
          keeps its own four colours — a monochrome G is somebody else's
          logo. */}
      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="squircle flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[rgba(30,30,29,0.15)] bg-white px-3.5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-[#fafafa] disabled:opacity-50"
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

      {/* The reference's divider, so the two ways in read as alternatives
          rather than steps. */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-[rgba(30,30,29,0.12)]" />
        <span className="text-[11px] font-medium tracking-[0.08em] text-placeholder">OR</span>
        <span className="h-px flex-1 bg-[rgba(30,30,29,0.12)]" />
      </div>

      {/* Labels are for screen readers only and the placeholder carries the
          prompt — the reference card (Claude's own sign-in, measured
          2026-08-03) hides its labels, and at two fields there is nothing a
          visible label says that the placeholder doesn't. */}
      <label>
        <span className="sr-only">Email</span>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="username"
          required
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="squircle w-full rounded-2xl border border-[rgba(30,30,29,0.15)] bg-white px-3.5 py-3 text-[15px] text-ink outline-none placeholder:text-placeholder focus:border-[rgba(30,30,29,0.35)]"
        />
      </label>

      <label>
        <span className="sr-only">Password</span>
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete={isUp ? "new-password" : "current-password"}
          required
          /* Clerk's own minimum. Stating it here means the phone rejects a
             short one before a round trip does. */
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="squircle w-full rounded-2xl border border-[rgba(30,30,29,0.15)] bg-white px-3.5 py-3 text-[15px] text-ink outline-none placeholder:text-placeholder focus:border-[rgba(30,30,29,0.35)]"
        />
      </label>

      {error && (
        <p role="alert" className="text-[13.5px] leading-5 text-[#b42318]">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" block disabled={busy} className="mt-1">
        {busy ? "One moment…" : isUp ? "Create account" : "Sign in"}
      </Button>

      {/* Clerk's bot protection needs somewhere to mount when it is enabled.
          Without this node it silently blocks sign-ups it considers suspect
          and the form just fails with nothing to show the student. */}
      <div id="clerk-captcha" />
    </form>
  );
}
