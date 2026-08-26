import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

/* The questions — and, since 2026-08-26, the account at the end of them. This
 * is the front door now: "Get started" on "/" comes straight here, a stranger
 * answers eleven questions, and the last screen is the email and password that
 * save them. See components/onboarding/OnboardingFlow for the design and for
 * why the account step is data-dependent rather than a branch.
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
 * ANYBODY GETS HERE NOW, AND THAT IS THE CHANGE (owner, 2026-08-26).
 *
 * This page used to open with a server-side gate — `currentUserId()`, and
 * `redirect("/")` for anyone without one — under the rule "someone who has not
 * signed in cannot be on the onboarding ever" (owner, 2026-08-04). That rule
 * was right for as long as the account was made FIRST and these questions came
 * after it. The order is reversed now: the account is the LAST screen of this
 * flow, so a signed-out visitor is not someone who slipped past a door, they
 * are the person this page was built for.
 *
 * The gate could not simply be relaxed, either — it had to go. Left in place it
 * would have redirected every new student away from the front door before the
 * first question was drawn, which is the whole funnel.
 *
 * NOTHING GUARDS THIS PAGE, AND NOTHING NEEDS TO. There is no privileged data
 * here: every question is answered into localStorage (see OnboardingFlow's
 * `save`), and the answers only reach an account once one exists, through
 * AccountSignal, under RLS on the student's own row. A stranger filling this in
 * and closing the tab has written to their own browser and nowhere else.
 *
 * IT IS STATIC AGAIN. The old gate read a session, which cannot be done at
 * build time and made this the one dynamic route in the app. Removing it hands
 * the page back to the prerender — which matters more here than it did
 * anywhere: this is now the first thing a new student loads, often on a Zambian
 * mobile connection, and it no longer waits on a session lookup to draw.
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
        <OnboardingFlow />
      </main>
    </>
  );
}
