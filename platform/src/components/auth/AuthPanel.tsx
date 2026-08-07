"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import type { OnboardingMode } from "@/lib/onboarding";

/* ------------------------------------------------------------------ *
 * The standalone /sign-in and /sign-up pages — the same form the sheet holds,
 * on a page of its own.
 *
 * IT IS THE ONBOARDING PAGE NOW (owner, 2026-08-06: "make the sign up and sign
 * in page look exactly like the onboarding page … still ask the question in the
 * same way and fonts"). It used to be a floating white card with its own
 * radius, its own three-layer shadow, its own 22px/580 heading and its own
 * hardcoded greys — a second visual language for the screen immediately before
 * the questions, so a student went from a card on grey to a bare column on the
 * app's own backdrop between one tap and the next.
 *
 * So the card is gone and this wears the question's shape: the same 440px
 * column, the same 30px display heading, the same two-line muted line under it,
 * the same Back in the same place. Anything measured here is measured in
 * components/onboarding/OnboardingFlow → Card, and the two must be changed
 * together — see the note on that component.
 *
 * NOT A COPY OF Card. Card portals its action to a fixed bar at the bottom of
 * the screen, which is right for a thirty-row course list and wrong for two
 * fields: the button belongs under the password, where the eye already is, and
 * a fixed bar over a two-field form is chrome for a problem this page does not
 * have. Same shape, same type, different footing — and stating that here is
 * cheaper than a `variant` on Card that only this caller passes.
 *
 * These are NOT the main way in. Every gate in the app calls `requireAccount()`
 * and gets the sheet over whatever the reader was doing, because nobody should
 * lose their place as a reward for signing up (see AuthGate). These pages exist
 * for the ways in that aren't a tap inside the app: a bookmark, a link in a
 * message, somebody typing the URL.
 *
 * NO TOGGLE ANY MORE (2026-08-07). The form itself now tries a sign-in first and
 * only falls back to making an account if there isn't one — see the note atop
 * AuthForm — so a student who lands on /sign-up with an account already just
 * gets signed into it, with no error telling them to go find the other card.
 * `initialMode` survives as what it always half-was: which of two URLs got them
 * here, and so which greeting and which destination-if-new to show. It picks
 * words, not behaviour.
 *
 * `after` is a real destination rather than null: arriving here means there was
 * no page behind to return to. Reached via /sign-in it is `/dashboard` — somebody
 * who already has answers goes straight to the app. Reached via /sign-up it is
 * ALSO `/dashboard`, because most people who tap "Sign up" already have an
 * account and are about to be signed into it; `afterNew` is where a genuinely
 * new record goes instead — `/onboarding`, because it has no answers yet and a
 * dashboard drawn from none is a screen of dashes (see RequireOnboarding).
 * ------------------------------------------------------------------ */

export function AuthPanel({ initialMode }: { initialMode: OnboardingMode }) {
  const router = useRouter();
  /* Read straight off the route now, with no state behind it. The toggle that
     used to flip this is gone — see the note above — and a `useState` nothing
     sets is a variable pretending to be a control. */
  const signUp = initialMode === "sign-up";

  return (
    /* The question's own column, to the pixel — max-w-[440px] and 16px of page
       padding. No bottom padding reserving room for a fixed bar, because this
       page's action is in the flow. */
    <div className="mx-auto w-full max-w-[440px] px-4 pb-16">
      {/* Back sits where the flow's does: same height, same pt-6, same left,
          same 13px muted. `router.back()` rather than a route, because there
          is no one place this page is reached from — a bookmark, the landing
          CTA, a link in a message. */}
      <div className="flex h-9 items-center pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          Back
        </button>
      </div>

      {/* The flow's own question transition, played once on arrival. It used to
          be keyed by mode so the card slid when the toggle flipped it; there is
          no toggle now, so this is simply how every question on this route
          enters. */}
      <div data-dir="next" className="onboard-step pt-6">
        <section>
          {/* The question, in the flow's exact type — 30px display bold, and
              the two-line muted line under it. */}
          <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
            {signUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 max-w-[38ch] text-[14px] leading-[1.45] text-muted">
            {signUp
              ? "Your courses, your progress and your notes, on any phone you sign in on."
              : "Sign in and everything picks up where you left it, on whatever phone you're on."}
          </p>

          <div className="mt-8">
            <AuthForm after="/dashboard" afterNew="/onboarding" />
          </div>
        </section>
      </div>
    </div>
  );
}
