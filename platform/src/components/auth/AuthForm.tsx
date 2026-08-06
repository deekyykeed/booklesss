"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ActionBar } from "@/components/ui/ActionBar";
import { Field } from "@/components/ui/Field";
import { MynaIcon } from "@/components/icons/myna";
import { browserClient } from "@/lib/supabase/browser";
import { referrer } from "@/lib/referral";
import type { OnboardingMode } from "@/lib/onboarding";

/* ------------------------------------------------------------------ *
 * Email and a password, in the app's own components.
 *
 * THIS IS THE THIRD ATTEMPT AT A CUSTOM AUTH FORM AND THE FIRST ONE THAT SHOULD
 * SURVIVE, because what killed the other two was Clerk, not the idea. Both
 * previous forms (2026-08-03, and 21bed00 on 2026-08-05) drowned in Clerk 7's
 * Signals API: `SignUp` is a STATEFUL resource living on the Clerk client, so a
 * half-built attempt survived a failed submit, a reload and a new tab — after
 * which `password()` was updating that attempt rather than creating a sign-up,
 * `email_address` stopped being an accepted parameter, and a DIFFERENT email
 * produced the identical error naming the wrong field.
 *
 * None of that exists here. Supabase auth is two plain async functions that
 * RETURN `{ data, error }`; there is no attempt object, nothing to reset, and
 * no state on the client to get out of step with the server. A failed submit
 * leaves nothing behind. That is the whole reason the form is buildable now and
 * was not before.
 *
 * ERRORS ARE RETURNED, NOT THROWN — the one habit worth carrying over from the
 * Clerk attempts, where a try/catch caught nothing and every failure looked
 * like success. Every call here reads `error` off the result. The try/catch
 * around them is for the network dying, which is a different thing and says so.
 * ------------------------------------------------------------------ */

/** Supabase's own floor is 6. Eight, because the difference costs a student two
 *  characters once and this is the only thing standing in front of their
 *  account — and because saying so up front beats bouncing them off a server
 *  rule they could not see. */
const MIN_PASSWORD = 8;

/* The hardcoded palette that used to sit here — INK rgb(11,11,11), MUTED
   rgb(137,135,129), and two inset-ring shadows standing in for a border — is
   gone. It was measured off the settings sheet's spec and written as literals,
   which is the exact thing the onboarding flow already refuses to do: "I
   already have colors that look good on my app, why aren't I using these even
   for the website" (owner, 2026-08-03). rgb(11,11,11) is not var(--color-ink)
   and rgb(137,135,129) is a warm grey next to a neutral one, so this form read
   as a slightly different product to the questions it hands the student to.
   Everything below uses the tokens. */

/**
 * What went wrong, in words a student can act on.
 *
 * Supabase's messages are written for developers ("Invalid login credentials",
 * "User already registered") and two of them are the common case rather than
 * the exception, so they get answers rather than translations. Anything
 * unrecognised falls through as-is: a message we did not anticipate is more
 * useful to a student reporting it than a generic apology would be.
 */
function readable(message: string, mode: OnboardingMode): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "That email already has an account. Switch to sign in.";
  if (m.includes("invalid login credentials"))
    return "That email and password don't match. Check both, or make an account.";
  if (m.includes("email address") && m.includes("invalid")) return "That doesn't look like an email address.";
  if (m.includes("password") && m.includes("should be at least"))
    return `Passwords need at least ${MIN_PASSWORD} characters.`;
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many tries. Wait a minute and try again.";
  if (m.includes("email not confirmed"))
    return "Check your email for the confirmation link, then sign in.";
  return message || (mode === "sign-up" ? "Couldn't make the account." : "Couldn't sign in.");
}

export function AuthForm({
  mode,
  onMode,
  initialEmail,
  after,
  onDone,
  autoFocus = true,
}: {
  mode: OnboardingMode;
  /** Flipping between the two cards. Held by the parent so the sheet's heading
   *  and the form agree about which one is showing. */
  onMode: (m: OnboardingMode) => void;
  initialEmail?: string | null;
  /** Where to land once the session is live. Null means stay put — which is the
   *  whole point of asking in a sheet rather than on a page. */
  after?: string | null;
  onDone?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  /* THE ERROR REMEMBERS WHICH CARD PRODUCED IT. Flipping to sign-in with "that
     email already has an account" still on screen would be the app answering a
     question the student has just stopped asking — so the message is stored
     with its mode and only drawn when the two agree.
     Derived rather than cleared in an effect: `useEffect(() => setError(null),
     [mode])` is a cascading render, and the lint rule that catches it is right.
     There is nothing to synchronise here, only something to render
     conditionally. */
  const [error, setError] = useState<{ mode: OnboardingMode; message: string } | null>(null);
  const shownError = error && error.mode === mode ? error.message : null;
  /* Only reachable if "Confirm email" is turned back ON in the Supabase
     dashboard. It is OFF by the owner's decision (2026-08-05) so a student goes
     straight from this form into onboarding — but a sign-up that silently does
     nothing because a setting changed is the worst failure this form has, so it
     is handled rather than assumed away. */
  const [checkEmail, setCheckEmail] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) emailRef.current?.focus();
  }, [autoFocus]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const fail = (message: string) => setError({ mode, message });
    setError(null);

    const mail = email.trim();
    if (!mail || !password) {
      fail("Both fields, please.");
      return;
    }
    if (mode === "sign-up" && password.length < MIN_PASSWORD) {
      fail(`Passwords need at least ${MIN_PASSWORD} characters.`);
      return;
    }

    const supabase = browserClient();
    if (!supabase) {
      fail("Accounts aren't set up on this build.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email: mail,
          password,
          options: {
            /* The ONE thing that is only knowable at the moment an account is
               created. Everything else about this student — name, face,
               programme, timetable — is answered afterwards in onboarding and
               lands on their `students` row; who sent them is a fact about the
               sign-up itself and has nowhere else to live. See lib/referral. */
            data: { ...(referrer() ? { referred_by: referrer() } : {}) },
          },
        });
        if (error) {
          fail(readable(error.message, mode));
          return;
        }
        /* No session means email confirmation is on — see the note on
           `checkEmail`. Say so rather than pretending the sign-up worked. */
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: mail, password });
        if (error) {
          fail(readable(error.message, mode));
          return;
        }
      }

      /* The session is live and in a cookie. `refresh()` is what makes the
         SERVER see it — the onboarding gate and every route handler read the
         cookie, and without this they would still be answering as though
         nobody had signed in. AccountSignal picks the client side up on its
         own through onAuthStateChange. */
      onDone?.();
      if (after) router.push(after);
      router.refresh();
    } catch {
      /* The network, not the auth server. Every real auth failure came back as
         `error` above and has already been handled. */
      fail("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[14px] leading-5 text-ink">
          Check <strong>{email.trim()}</strong> for a confirmation link, then come back and sign in.
        </p>
        <Button
          variant="secondary"
          block
          onClick={() => {
            setCheckEmail(false);
            onMode("sign-in");
          }}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  const signUp = mode === "sign-up";

  return (
    /* gap-6 between the blanks, where the boxed version used gap-3. A box holds
       its own edges apart from the next one; two rules 12px apart read as a
       pair of lines rather than as two separate questions. */
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <Field
        ref={emailRef}
        id="auth-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        disabled={busy}
      />

      <Field
        id="auth-password"
        label="Password"
        type={show ? "text" : "password"}
        value={password}
        onChange={setPassword}
        /* The correct token for each card. `current-password` on a sign-up
           makes a password manager offer the one they already have instead of
           generating a new one, which is how people end up with an account
           they cannot get back into. */
        autoComplete={signUp ? "new-password" : "current-password"}
        placeholder={signUp ? `At least ${MIN_PASSWORD} characters` : ""}
        disabled={busy}
        trailing={
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] bg-transparent text-muted transition-colors hover:bg-active"
            tabIndex={-1}
          >
            <MynaIcon name={show ? "eye-off" : "eye"} size={16} strokeWidth={1.6} />
          </button>
        }
      />

      {/* `role="alert"` so a screen reader hears it — the error appears without
          focus moving, which is otherwise silent. */}
      {shownError && (
        <p role="alert" className="text-[13px] leading-[18px] text-[#b42318]">
          {shownError}
        </p>
      )}

      {/* THE COURSE CARD'S BUTTON, EXACTLY (owner, 2026-08-06: "pull in the
          exact button i use on the course cards here no difference", and then
          "when the form is unfilled the button is exactly what you'd see in the
          course card").
          So it is the DEFAULT variant, not the ink one — the paper surface, the
          muted arrow and the card's own shadow. It briefly shipped as
          variant="primary", which made it a black pill on a page whose whole
          point was that it looks like the app.
          Pressing it draws the ink instead: `busy` sweeps the fill across and
          inverts the label under it. Nothing swaps, so the thing a student
          pressed is the thing that answers. */}
      <ActionBar type="submit" busy={busy} className="mt-1">
        {busy ? (signUp ? "Making your account…" : "Signing in…") : signUp ? "Create account" : "Sign in"}
      </ActionBar>

      <p className="text-[13px] leading-[18px] text-muted">
        {signUp ? "Already have an account? " : "New here? "}
        <button
          type="button"
          onClick={() => onMode(signUp ? "sign-in" : "sign-up")}
          className="bg-transparent font-medium text-ink underline underline-offset-2"
        >
          {signUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </form>
  );
}

/* The local `Field` that lived here is now components/ui/Field — the blank the
 * onboarding questions fill in too, so the account and the questions it hands
 * the student to are one form in two parts rather than two forms.
 *
 * Its note claimed 14px "does not zoom the viewport on focus, because the field
 * is inside a dialog with a max-width". That was simply wrong: iOS Safari zooms
 * on ANY focused input under 16px regardless of what contains it, and this form
 * is also rendered full-page at /sign-up. The shared field is 16px, which is the
 * fix that does not cost everybody pinch-zoom. */
