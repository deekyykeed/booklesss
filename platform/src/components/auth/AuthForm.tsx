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
