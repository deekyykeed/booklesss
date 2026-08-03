import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

/* The questions, then the account. Reached from the landing page's Get
 * started; see components/onboarding/OnboardingFlow for the design and why
 * the order is this way round.
 *
 * `noindex`: this is a funnel, not a page anyone should arrive at from a
 * search. The landing at "/" is what Google reads. */
export const metadata: Metadata = {
  title: "Get started",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh bg-canvas">
      <OnboardingFlow />
    </main>
  );
}
