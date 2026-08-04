import type { Metadata } from "next";
import { Suspense } from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

/* The questions, asked straight after the account is made. Reached from the
 * sign-up card on "/"; see components/onboarding/OnboardingFlow for the design.
 *
 * IT WEARS THE APP'S BACKGROUND, not a page colour of its own (owner,
 * 2026-08-03: "use the same background mechanics I use on the dashboard — the
 * blobs in the back and the frost glass thing"). Same two layers the dashboard
 * and the reader are built on:
 *
 *   .bg-waves     six radial-gradient blobs drifting on their own clocks over
 *                 #f8f9fc, fixed behind everything. Six spans because the CSS
 *                 styles them by :nth-child(1..6).
 *   the surface   translucent white over a blurred backdrop, so the blobs move
 *                 softly behind the questions rather than being covered.
 *
 * The frost is applied here rather than by reusing `.content-surface`, which
 * is sized to the app shell it lives in (height:100%, its own scroll
 * container, flush against a header and a sidebar that this page has neither
 * of). Same two values, standalone geometry.
 *
 * `noindex`: this is a funnel, not a page anyone should arrive at from a
 * search. The landing at "/" is what Google reads. */
export const metadata: Metadata = {
  title: "Get started",
  robots: { index: false, follow: false },
};

/**
 * THE SIGNED-OUT ARE THE POINT OF THIS PAGE NOW.
 *
 * It used to be the opposite, and the reversal is deliberate. This page guarded
 * itself on the server — "someone who has not signed in cannot be on the
 * onboarding ever" (owner, 2026-08-03) — because the account was made on the
 * landing page and these were strictly the questions that came after it.
 *
 * The account is now the FIRST question here (owner, 2026-08-04: "move the
 * modal into the onboarding"), so arriving without one is the ordinary way in
 * and the guard would bounce every single new student off the page built for
 * them. Both halves came out: this `auth()` check and the client-side
 * `router.replace("/")` in OnboardingFlow.
 *
 * IT IS A STATIC PAGE AGAIN, which is the happy side effect. The server session
 * check was the only reason the route was dynamic; nothing here depends on who
 * is asking any more, so it prerenders like every lesson does. On a Zambian
 * connection that is the difference between a funnel that starts instantly and
 * one that waits on a round trip to find out you are nobody.
 */
export default function OnboardingPage() {
  return (
    <>
      <div className="bg-waves" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <main className="relative z-10 min-h-dvh bg-white/[0.62] backdrop-blur-[16px]">
        {/* The flow reads `after`, `mode` and `email` off the query string via
            useSearchParams, which on a PRERENDERED page has to sit behind a
            boundary — there is no query string at build time, so Next needs
            somewhere to bail out to until the client takes over. Without this
            the build fails outright rather than degrading, which is the right
            trade and how this was caught.

            The fallback is empty on purpose. Anything drawn here would be a
            skeleton of a form that is about to appear a few milliseconds later,
            and a flash of one question replaced by another is worse than a beat
            of nothing — the page already has the blobs and the frost behind
            it, so it does not read as broken. */}
        <Suspense fallback={null}>
          <OnboardingFlow />
        </Suspense>
      </main>
    </>
  );
}
