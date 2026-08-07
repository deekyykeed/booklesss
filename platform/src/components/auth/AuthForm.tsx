"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { MynaIcon } from "@/components/icons/myna";
import { browserClient } from "@/lib/supabase/browser";
import { referrer } from "@/lib/referral";

/* ------------------------------------------------------------------ *
 * Email and a password. ONE form, and it does not ask which one you are.
 *
 * Owner, 2026-08-07: "i dont want to have the user select sign in if they
 * already have an account. they can just enter their details whether new or not
 * and if they are new they go through onboarding and if not they jyst get in and
 * not error them saying the accont exists."
 *
 * WHAT THIS REPLACED, so nobody rebuilds it: two cards and a toggle under them —
 * "Already have an account? Sign in" / "New here? Create an account" — with the
 * mode deciding which Supabase call ran. The failure it produced is the reason
 * this changed. A student who had signed up two weeks ago, landing on the
 * sign-up card, typed the right email and the right password and was told "That
 * email already has an account. Switch to sign in." That is the app holding the
 * door shut while telling them they have a key. Every fact needed to let them
 * straight in was already on screen.
 *
 * HOW ONE BOX ANSWERS BOTH: sign in first, and only make an account if that
 * comes back saying there isn't one. Supabase has no "does this email exist"
 * call — deliberately, because one is an enumeration oracle — so the sequence IS
 * the check, and each step's error is what routes the next.
 *
 *   signInWithPassword →  no error            → they had an account. In.
 *                     →  invalid credentials  → no account, OR wrong password.
 *                                               Can't tell yet, so try to make
 *                                               one and let that answer it:
 *       signUp        →  no error            → they were new. Onboarding.
 *                     →  already registered  → the account existed, so the
 *                                               password was wrong. Say THAT,
 *                                               which is the one thing the
 *                                               student can act on.
 *                     →  anything else       → their real error (weak password,
 *                                               malformed email).
 *
 * SIGN-IN FIRST, NOT SIGN-UP FIRST, and the order is load-bearing. Sign-up first
 * is one call shorter for the common new student, but it puts every RETURNING
 * student through a sign-up attempt on their own email — and the moment "Confirm
 * email" is switched back on in the Supabase dashboard, that attempt mails them
 * a confirmation link every time they log in. Probing with a sign-in sends
 * nothing and creates nothing, whatever that setting says.
 *
 * THE CLERK HISTORY, kept because it is why a custom form is allowed here at
 * all. Two earlier attempts (2026-08-03, and 21bed00 on 2026-08-05) drowned in
 * Clerk 7's Signals API: `SignUp` is a STATEFUL resource on the Clerk client, so
 * a half-built attempt survived a failed submit, a reload and a new tab, after
 * which `password()` updated that attempt instead of creating a sign-up and a
 * DIFFERENT email produced the identical error naming the wrong field. A
 * two-call sequence like the one above was not buildable on it. Supabase auth is
 * two plain async functions returning `{ data, error }` — no attempt object,
 * nothing to reset, nothing on the client to fall out of step with the server —
 * which is exactly what makes the fallback safe to run.
 *
 * ERRORS ARE RETURNED, NOT THROWN — the one habit worth keeping from the Clerk
 * attempts, where a try/catch caught nothing and every failure looked like
 * success. Every call here reads `error` off the result. The try/catch around
 * them is for the network dying, which is a different thing and says so.
 * ------------------------------------------------------------------ */

/** Supabase's own floor is 6. Eight, because the difference costs a student two
 *  characters once and this is the only thing standing in front of their
 *  account. Shown as the placeholder rather than enforced before the first
 *  call: a returning student whose password predates this number must still be
 *  able to sign in with it. */
const MIN_PASSWORD = 8;

/**
 * The two Supabase messages the sequence above BRANCHES on, matched loosely
 * because they are prose from a server we don't own.
 *
 * `wrongOrMissing` is the fork in the road: it is the only sign-in failure that
 * might mean "no account yet", so it is the only one that falls through to
 * making one. Every other failure — unconfirmed email, rate limit, malformed
 * address — is about an account we now know something about, and creating a
 * second one on top of it would be worse than the error.
 */
const wrongOrMissing = (m: string) => m.toLowerCase().includes("invalid login credentials");
const alreadyExists = (m: string) => /already (been )?registered|already exists/i.test(m);

/**
 * What went wrong, in words a student can act on.
 *
 * Supabase writes for developers ("Invalid login credentials", "User already
 * registered"), and anything unrecognised falls through as-is: a message we did
 * not anticipate is more useful to a student reporting it than a generic apology
 * would be.
 *
 * NOTE WHAT IS NO LONGER HERE. "That email already has an account. Switch to
 * sign in." is gone, and it cannot come back — there is nothing to switch to.
 * That string is only reachable now as the wrong-password case, which is handled
 * where it happens, with the sentence that actually helps.
 */
function readable(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("email address") && m.includes("invalid")) return "That doesn't look like an email address.";
  if (m.includes("password") && m.includes("should be at least"))
    return `Passwords need at least ${MIN_PASSWORD} characters.`;
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many tries. Wait a minute and try again.";
  if (m.includes("email not confirmed"))
    return "Check your email for the confirmation link, then come back.";
  return message || "Couldn't get you in.";
}

/**
 * What the button says while it is working, and it is not decoration (owner,
 * 2026-08-07: "a loading spinner with text next to it giving the user context as
 * to whats happening behind the load").
 *
 * The sequence really does have two different waits in it, and on a Zambian
 * connection they are two visible seconds each. A single "Please wait" would be
 * hiding the one interesting thing this form does; naming the step is free, and
 * it means a student watching "Creating your account" knows the answer to "am I
 * new here" before the next screen tells them.
 */
type Phase = "checking" | "creating" | "entering";
const SAYING: Record<Phase, string> = {
  checking: "Checking your account",
  creating: "Creating your account",
  entering: "Signing you in",
};

export function AuthForm({
  initialEmail,
  after,
  afterNew,
  onDone,
  autoFocus = true,
}: {
  initialEmail?: string | null;
  /** Where a RETURNING student lands. Null means stay put — which is the whole
   *  point of asking in a sheet rather than on a page. */
  after?: string | null;
  /** Where a student whose account was just CREATED lands. Defaults to `after`.
   *  The full-page form sends them to /onboarding, because a new record has no
   *  answers in it and a dashboard drawn from none is a screen of dashes. The
   *  sheet leaves it unset on purpose: somebody halfway down a step keeps their
   *  place, and RequireOnboarding will ask them the moment they reach for the
   *  dashboard. */
  afterNew?: string | null;
  onDone?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  /* Null is idle. One piece of state rather than a `busy` boolean beside a
     `status` string, because those two can disagree and this cannot. */
  const [phase, setPhase] = useState<Phase | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    if (phase) return;
    setError(null);

    const mail = email.trim();
    if (!mail || !password) {
      setError("Both fields, please.");
      return;
    }

    const supabase = browserClient();
    if (!supabase) {
      setError("Accounts aren't set up on this build.");
      return;
    }

    /* The session is live and in a cookie. `refresh()` is what makes the SERVER
       see it — the onboarding gate and every route handler read the cookie, and
       without this they would still be answering as though nobody had signed
       in. AccountSignal picks the client side up through onAuthStateChange.

       The phase is deliberately NOT cleared here: the spinner keeps turning
       through the navigation, so the last thing on screen is the app working
       rather than a button that finished and went quiet. */
    const enter = (to: string | null) => {
      setPhase("entering");
      onDone?.();
      if (to) router.push(to);
      router.refresh();
    };

    setPhase("checking");
    try {
      const signIn = await supabase.auth.signInWithPassword({ email: mail, password });

      if (!signIn.error) {
        enter(after ?? null);
        return;
      }
      if (!wrongOrMissing(signIn.error.message)) {
        setError(readable(signIn.error.message));
        setPhase(null);
        return;
      }

      /* No account with that email, OR the password is wrong. The sign-up is
         the question that tells the two apart. */
      setPhase("creating");
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
        /* The account existed all along, so the password was the problem — the
           one sentence this whole sequence exists to be able to say. It names
           the field that is wrong and does not send them anywhere to fix it. */
        setError(
          alreadyExists(error.message)
            ? "That password doesn't match this email. Try again, or reset it."
            : readable(error.message),
        );
        setPhase(null);
        return;
      }

      /* No session means email confirmation is on — see the note on
         `checkEmail`. Say so rather than pretending the sign-up worked. */
      if (!data.session) {
        setCheckEmail(true);
        setPhase(null);
        return;
      }

      enter(afterNew ?? after ?? null);
    } catch {
      /* The network, not the auth server. Every real auth failure came back as
         `error` above and has already been handled. */
      setError("Couldn't reach the server. Check your connection and try again.");
      setPhase(null);
    }
  }

  if (checkEmail) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[14px] leading-5 text-ink">
          Check <strong>{email.trim()}</strong> for a confirmation link, then come back and enter the
          same details.
        </p>
        <Button variant="secondary" block onClick={() => setCheckEmail(false)}>
          Back
        </Button>
      </div>
    );
  }

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
        disabled={!!phase}
      />

      <Field
        id="auth-password"
        label="Password"
        type={show ? "text" : "password"}
        value={password}
        onChange={setPassword}
        /* `current-password`, and it is not a coin toss now that one form does
           both. On a combined box a password manager must offer the one they
           already have; `new-password` would make it propose a generated one to
           a student who has an account, which is how people end up locked out
           of the thing they were trying to sign into. Saving a fresh password
           still works from this token — generating one over an existing account
           does not. */
        autoComplete="current-password"
        placeholder={`At least ${MIN_PASSWORD} characters`}
        disabled={!!phase}
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
      {error && (
        <p role="alert" className="text-[13px] leading-[18px] text-[#b42318]">
          {error}
        </p>
      )}

      {/* THE BIG BLACK ONE, BACK (owner, 2026-08-07: "revert the button to what
          i had preveously, theb bigger black one"). This is the button that
          stood here until 2026-08-06, when it was swapped for the course card's
          ActionBar in its paper variant — the right call for a bar you travel
          along inside a card, and the wrong one for the single action on a
          screen that exists to be pressed. On a page of two hairlines and a
          heading, a paper button is the quietest thing present.

          "CONTINUE", because the label can no longer promise which of the two
          things is about to happen — that is the point of the form. It says
          what the tap does and the spinner underneath says what came of it. */}
      <Button type="submit" variant="primary" size="lg" block arrow busy={!!phase} className="mt-1">
        {phase ? SAYING[phase] : "Continue"}
      </Button>

      {/* What replaced the toggle. One line, because a box that behaves
          differently depending on who you are should say so before it does it —
          otherwise a returning student hesitates over a form headed "Create
          your account", which is the hesitation this whole change removes. */}
      <p className="text-[13px] leading-[18px] text-muted">
        New here and we&apos;ll make your account. Already have one and you&apos;re just signed in.
      </p>
    </form>
  );
}
