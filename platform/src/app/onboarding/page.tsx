import type { Metadata } from "next";
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
