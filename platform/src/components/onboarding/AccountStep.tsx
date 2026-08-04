"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { referrer } from "@/lib/referral";
import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------ *
 * The account, in our own markup, as the FIRST QUESTION of onboarding.
 *
 * Owner, 2026-08-04: "I want to change and use my own ui to sign a user into
 * clerk — or move the modal into the onboarding", and on the modal's current
 * home: "which makes it strange to put the sign in modal where it is."
 *
 * WHY THE MODAL STOPPED MAKING SENSE. It opened over whatever the reader was
 * doing so that nobody lost their place — that was its whole argument. But a
 * gate now sends people to /onboarding rather than back to the page, and the
 * `after` param is what returns them to their step at the end. So the modal was
 * no longer protecting anything; it was only making the account feel like a
 * different product from the questions immediately behind it.
 *
 * THIS IS A REVERSAL, and the reason it is allowed to be one. The custom sheet
 * and AuthForm that used to do this were deleted on 2026-08-03 ("use clerk
 * stuff just remove the logo"), and that was the right call for the thing being
 * decided then: a modal wearing our markup versus a modal wearing Clerk's, in
 * which case Clerk's is free and better tested. What changed is not the taste,
 * it is the container — a modal is not in the running any more, and Clerk's
 * card cannot be a step inside our page. Most of this file is that deleted one,
 * recovered from a636c3c^.
 *
 * CLERK STILL OWNS EVERYTHING THAT MATTERS: sessions, password hashing, rate
 * limiting, bot protection. It owns none of the pixels.
 *
 * THIS IS CLERK 7's SIGNALS API, WHICH IS NOT THE ONE MOST EXAMPLES SHOW.
 * `useSignUp()` returns `{ signUp, errors, fetchStatus }` — NOT the
 * `{ isLoaded, signUp, setActive }` of every older tutorial. Three differences,
 * all verified against node_modules rather than guessed:
 *   - the call is `signUp.password({ emailAddress, password })`, not
 *     `signUp.create(...)`, and `signIn.password({ identifier, password })`.
 *   - errors are RETURNED as `{ error }`, not thrown. A try/catch around these
 *     catches nothing and every failure looks like a success.
 *   - the session is activated by `finalize()`, not `setActive()`.
 * If this stops compiling after a Clerk upgrade, read
 * `node_modules/@clerk/shared/dist/types/signUpFuture.d.mts` first.
 *
 * THE autoComplete VALUES ARE LOAD-BEARING. They are what makes a phone offer
 * to save the password, which is the difference between signing in once and
 * signing in every time: the identifier must be `username` (the token password
 * managers pair with a password field), `new-password` prompts to save on
 * sign-up, `current-password` prompts to fill on sign-in. They only work inside
 * a real <form> with a real submit button, which is why this is a form and not
 * a div with an onClick — and why the button is IN it rather than portalled to
 * the bottom of the screen like every other step's. Two fields fit on a phone
 * without scrolling, so there is nothing for a floating button to solve here.
 *
 * EMAIL AND PASSWORD IS THE WHOLE WAY IN, and that is a complete auth surface
 * rather than a reduced one. A student types two fields and has an account;
 * nothing here waits on anything, and nothing elsewhere in the app expects a
 * strategy that is not on — there is no SSO callback route, no OAuth branch, no
 * code path that is dark. Owner, 2026-08-04: "everything should still work
 * normally now even without Google auth, it should not be a constraint."
 *
 * A social button is therefore an ADDITION, not a restoration of something
 * missing. The deleted file had a working one and the seam is marked below, so
 * whenever a strategy is enabled in Clerk it is a block of markup and a
 * `signUp.sso()` call on this same Signals API. Until then this is not a form
 * with a hole in it.
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
 * (Cloudflare Turnstile, inside signUp.password) resolves silently on a normal
 * phone, but when it can't — a blocked network, a browser it distrusts — the
 * promise neither resolves nor rejects, and the button reads "One moment…"
 * until the end of time. Measured, not supposed: 30+ seconds with no settle, no
 * error, no request. A student on a Zambian connection gets the same wall, so
 * every await here races a clock and stuck gets a message instead of silence. */
const STUCK = Symbol("stuck");
const STUCK_AFTER_MS = 20000;

function withTimeout<T>(p: Promise<T>): Promise<T | typeof STUCK> {
  return Promise.race([
    p,
    new Promise<typeof STUCK>((r) => setTimeout(() => r(STUCK), STUCK_AFTER_MS)),
  ]);
}

const FIELD =
  "squircle h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink " +
  "outline-none transition-colors placeholder:text-placeholder focus:border-ink";

/**
 * `onDone` fires once the session is live. The flow advances itself from there
 * — this component navigates nowhere, because it is a question on a page rather
 * than a page of its own, and the question after it is already rendered behind.
 */
export function AccountStep({
  onDone,
  /* Both come off the query string the gate built — see components/auth/
     ClerkGate. They are only the OPENING state: the toggle below flips the mode
     either way, and the email is a value the student can edit. */
  initialMode = "sign-up",
  initialEmail = "",
}: {
  onDone: () => void;
  initialMode?: "sign-up" | "sign-in";
  initialEmail?: string;
}) {
  const { signUp, fetchStatus: upFetch } = useSignUp();
  const { signIn, fetchStatus: inFetch } = useSignIn();

  /* Sign-UP is the default, because this screen is reached by somebody a gate
     has just stopped, and the overwhelming majority of those are new. An
     existing student flips it in one tap and their password manager fills the
     rest — or arrives with `mode=sign-in` already set, from a button that said
     "Sign in" on the way here. */
  const [mode, setMode] = useState<"sign-up" | "sign-in">(initialMode);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  /* WHETHER CLERK WANTS A CODE. An instance with "Verify at sign-up" on for
     email leaves the attempt at `missing_requirements` with `email_address` in
     `unverifiedFields` — the type's own words: "Keep in mind that the email
     address requires an extra verification process." Going straight to
     finalize() there fails, so the form grows a second phase instead of
     assuming a setting it cannot see. */
  const [phase, setPhase] = useState<"credentials" | "code">("credentials");
  const [code, setCode] = useState("");

  const isUp = mode === "sign-up";
  /* `!error` matters: a call that hit the STUCK clock never settles, so the
     resource's fetchStatus can read "fetching" forever afterwards — and a
     button still saying "One moment…" under "try again" is a locked door behind
     an apology. Once an error is showing the form is usable again; a resubmit
     starts a fresh attempt. */
  const busy = sending || (!error && (isUp ? upFetch : inFetch) === "fetching");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setSending(true);
    setError(null);

    try {
      /* Who sent them rides on the account itself: the `?r=` code this device
         arrived under (lib/referral) is copied into unsafeMetadata at the one
         moment a person is created from a visit. Absent for sign-IN on purpose
         — an account that already exists was already attributed. */
      const referredBy = isUp ? referrer() : null;

      /* START FROM A CLEAN ATTEMPT. `SignUp` is a stateful resource that lives
         on the Clerk CLIENT, so a half-built attempt survives a failed submit,
         a reload, and a new tab — and once one exists, `password()` is no
         longer creating a sign-up, it is updating the one in flight, where
         `email_address` is not an accepted parameter.

         That is the whole of the bug the owner hit twice tonight: "email_address
         is not a valid parameter for this request", naming a field he had
         plainly supplied and pointing at a dashboard page where nothing was
         wrong. The first failure was mine; every failure after it, including on
         a completely different email address, was this stale attempt answering
         instead of a new one.

         `reset()` is free — the docs are explicit that it "does not make any
         API calls, it only clears local state" — so it costs nothing to make
         every sign-up start from nothing. */
      if (isUp) await signUp.reset();

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

      /* Step two, and only when Clerk asks for it. Read off the attempt rather
         than assumed from a dashboard setting nobody here can see: if the email
         is sitting in `unverifiedFields`, the instance verifies at sign-up and
         finalize() would fail. */
      if (isUp && signUp.unverifiedFields?.includes("email_address")) {
        const sent = await withTimeout(signUp.verifications.sendEmailCode());
        if (sent === STUCK) {
          setError("This is taking too long. Check your connection and try again.");
          return;
        }
        if (sent.error) {
          setError(say(sent.error));
          return;
        }
        setPhase("code");
        return;
      }

      await activate();
    } finally {
      setSending(false);
    }
  }

  /** Turn a completed attempt into a live session. Shared, because both the
   *  straight-through path and the one that went via a code end here. */
  async function activate(): Promise<void> {
    const done = await withTimeout(isUp ? signUp.finalize() : signIn.finalize());
    if (done === STUCK) {
      setError("This is taking too long. Check your connection and try again.");
      return;
    }
    if (done.error) {
      setError(say(done.error));
      return;
    }
    onDone();
  }

  /** The six digits from their inbox. */
  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setSending(true);
    setError(null);
    try {
      const checked = await withTimeout(signUp.verifications.verifyEmailCode({ code: code.trim() }));
      if (checked === STUCK) {
        setError("This is taking too long. Check your connection and try again.");
        return;
      }
      if (checked.error) {
        setError(say(checked.error));
        return;
      }
      await activate();
    } finally {
      setSending(false);
    }
  }

  /* THE CODE SCREEN. Only ever reached because Clerk asked — see submit(). It
     replaces the fields rather than appearing under them: the email and
     password are answered, and leaving them on screen invites somebody to
     correct an address the code has already been sent to. */
  if (phase === "code") {
    return (
      <form onSubmit={submitCode} className="flex w-full flex-col gap-2.5">
        <p className="text-[14px] leading-6 text-muted">
          We sent a code to <span className="font-medium text-ink">{email}</span>. Enter it here to
          finish.
        </p>

        <label>
          <span className="sr-only">Verification code</span>
          <input
            autoFocus
            type="text"
            /* `one-time-code` is what makes a phone offer the code from the
               notification instead of making somebody switch apps to read it,
               and numeric brings up the keypad. */
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="123456"
            maxLength={8}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            className={FIELD + " text-center tracking-[0.3em]"}
          />
        </label>

        {error && (
          <p role="alert" className="text-[13.5px] leading-5 text-[#b42318]">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          arrow
          disabled={busy || code.trim().length < 4}
          className="mt-1.5"
        >
          {busy ? "One moment…" : "Verify"}
        </Button>

        {/* Back to the fields, and back to a clean attempt — a student who
            mistyped their address must be able to fix it, and `reset()` is what
            makes the next submit a new sign-up rather than an edit of this one. */}
        <button
          type="button"
          onClick={() => {
            void signUp.reset();
            setPhase("credentials");
            setCode("");
            setError(null);
          }}
          className="mt-1 self-center text-[13.5px] text-muted transition-colors hover:text-ink"
        >
          Use a different email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2.5">
      {/* SEAM: a social button and its OR divider go here if a strategy is ever
          enabled in Clerk. Recover both from a636c3c^:AuthForm.tsx — the
          handler uses signUp.sso()/signIn.sso() from this same Signals API and
          needs no rewrite. Above the fields when it lands: the tap that needs
          no keyboard goes over the ones that do. */}

      <label>
        <span className="sr-only">Email</span>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="username"
          required
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={FIELD}
        />
      </label>

      <label>
        <span className="sr-only">Password</span>
        <input
          type="password"
          name="password"
          placeholder={isUp ? "Create a password" : "Your password"}
          autoComplete={isUp ? "new-password" : "current-password"}
          required
          /* Clerk's own minimum. Stating it here means the phone rejects a short
             one before a round trip does. */
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={FIELD}
        />
      </label>

      {error && (
        <p role="alert" className="text-[13.5px] leading-5 text-[#b42318]">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" block arrow disabled={busy} className="mt-1.5">
        {busy ? "One moment…" : isUp ? "Create account" : "Sign in"}
      </Button>

      {/* The other door. A link rather than a second button — there is one
          action on this screen and this is not it. */}
      <button
        type="button"
        onClick={() => {
          setMode(isUp ? "sign-in" : "sign-up");
          setError(null);
        }}
        className="mt-1 self-center text-[13.5px] text-muted transition-colors hover:text-ink"
      >
        {isUp ? (
          <>
            Already have an account? <span className="font-medium text-ink">Sign in</span>
          </>
        ) : (
          <>
            New here? <span className="font-medium text-ink">Create an account</span>
          </>
        )}
      </button>

      {/* Clerk's bot protection needs somewhere to mount. Without this node it
          silently blocks sign-ups it considers suspect and the form just fails
          with nothing to show the student. */}
      <div id="clerk-captcha" />
    </form>
  );
}
