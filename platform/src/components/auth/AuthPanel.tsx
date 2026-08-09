"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { labelFor, lessonIdForSlug } from "@/lib/course";
import { DEFAULT_NEXT, onboardingHref, safeNext } from "@/lib/next-path";
import type { OnboardingMode, OnboardingReason } from "@/lib/onboarding";

/* ------------------------------------------------------------------ *
 * The /sign-in and /sign-up pages — THE way in, since 2026-08-09.
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
 * NO LONGER A SIDE DOOR. Until 2026-08-09 every in-app gate opened a sheet
 * over the page (AuthGate) and these routes existed for bookmarks and typed
 * URLs. The sheet is gone — a gated tap now NAVIGATES here (see AuthRedirect),
 * carrying `?next=<where they were>` and `?why=<which gate fired>`. Both are
 * stranger input and go through `safeNext` / a whitelist before use.
 *
 * NO TOGGLE ANY MORE (2026-08-07). The form itself tries a sign-in first and
 * only falls back to making an account if there isn't one — see the note atop
 * AuthForm — so a student who lands on /sign-up with an account already just
 * gets signed into it, with no error telling them to go find the other card.
 * `initialMode` survives as what it always half-was: which of two URLs got them
 * here, and so which greeting to show. It picks words, not behaviour.
 *
 * WHERE THE TWO KINDS OF STUDENT LAND. A RETURNING one goes to `next` — the
 * step or page the gate interrupted, or the dashboard when there is no honest
 * origin (a bookmark, a typed URL). A NEW one goes into the real onboarding,
 * always: /onboarding with the same `next` threaded through, so the flow's
 * finish() returns them to the step they were reading with nothing skipped.
 * This is the owner's 2026-08-09 call — a new account answers the questions
 * NOW, not whenever it next reaches for the dashboard.
 * ------------------------------------------------------------------ */

/** THE HEADING ANSWERS THE TAP (owner, 2026-08-09: the page "shouldnt jyst be
 *  generic like create account — say something like sign in to contiue with
 *  {step} or to save this for later or to like this"). A reader from a shared
 *  link who reached for something specific gets a door named after that thing,
 *  not a sign-up wall. "Sign in", even though the form also creates accounts —
 *  the line under the button explains the both-jobs behaviour, and "Sign in to
 *  save this" is a sentence where "Create an account to save this" is a form.
 *
 *  `next-step` is special-cased below: where the destination resolves to a
 *  real step, the heading names it — "Sign in to continue with {step}". */
const HEADLINE: Record<Exclude<OnboardingReason, "manual">, string> = {
  save: "Sign in to save this for later",
  like: "Sign in to like this",
  note: "Sign in to leave your note",
  comment: "Sign in to post your comment",
  checkpoint: "Sign in to keep your answers",
  "next-step": "Sign in to keep reading",
};

const isReason = (v: string | null): v is Exclude<OnboardingReason, "manual"> =>
  v !== null && v in HEADLINE;

/* Layout effect in the browser, plain effect on the server. A gated arrival is
 * a soft client-side push — the component's very first mount — so the query
 * read runs BEFORE paint and the reader never sees the generic heading flash
 * into the specific one. A bare useLayoutEffect would warn during dev SSR; on
 * the server this is the no-op useEffect and the prerendered HTML keeps the
 * manual defaults, which is right for the bookmark arrival it serves. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** The step a `next` path points at, by its sidebar label — or null when the
 *  path isn't a step (the dashboard, a course page), in which case the plain
 *  headline reads right anyway. Hash and query are the reader's place within
 *  the step, not part of its identity. */
function stepLabel(next: string): string | null {
  const segs = next.split(/[?#]/)[0].replace(/^\/+/, "").split("/").filter(Boolean);
  const id = lessonIdForSlug(segs);
  return id ? labelFor(id) : null;
}

export function AuthPanel({ initialMode }: { initialMode: OnboardingMode }) {
  const router = useRouter();
  const signUp = initialMode === "sign-up";

  /* `?next=` and `?why=`, read off `window.location` in an effect rather than
     `useSearchParams` — that hook forces a Suspense boundary onto the page and
     dynamic rendering onto a route that is otherwise static (the house pattern;
     see lib/next-path). Until the effect runs the defaults hold: dashboard for
     a returning student, plain /onboarding for a new one — which is exactly
     right for the bookmark/typed-URL arrival that has no query string. */
  const [next, setNext] = useState(DEFAULT_NEXT);
  const [why, setWhy] = useState<OnboardingReason>("manual");
  useIsoLayoutEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setNext(safeNext(p.get("next")));
    const w = p.get("why");
    if (isReason(w)) setWhy(w);
  }, []);

  /* The gate's own sentence where a gate sent them; the plain greeting for a
     bookmark or typed URL. `why === "manual"` is compared directly (not through
     a `gated` boolean) so TypeScript narrows it out of HEADLINE's key type. */
  const step = why === "next-step" ? stepLabel(next) : null;
  const heading =
    why === "manual"
      ? signUp
        ? "Create your account"
        : "Welcome back"
      : step
        ? `Sign in to continue with ${step}`
        : HEADLINE[why];

  return (
    /* The question's own column, to the pixel — max-w-[440px] and 16px of page
       padding. No bottom padding reserving room for a fixed bar, because this
       page's action is in the flow. */
    <div className="mx-auto w-full max-w-[440px] px-4 pb-16">
      {/* Back sits where the flow's does: same height, same pt-6, same left,
          same 13px muted. `router.back()` rather than a route, because there
          is no one place this page is reached from — a gated tap, a bookmark,
          the landing CTA, a link in a message. */}
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
            {heading}
          </h1>
          <p className="mt-2 max-w-[38ch] text-[14px] leading-[1.45] text-muted">
            {why !== "manual" || signUp
              ? "Your courses, your progress and your notes, on any phone you sign in on."
              : "Sign in and everything picks up where you left it, on whatever phone you're on."}
          </p>

          <div className="mt-8">
            <AuthForm after={next} afterNew={onboardingHref(next)} />
          </div>
        </section>
      </div>
    </div>
  );
}
