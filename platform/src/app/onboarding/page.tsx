import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authEnabled } from "@/lib/auth";
import { currentUserId } from "@/lib/supabase/server";
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
 * NOBODY WITHOUT AN ACCOUNT GETS HERE (owner, 2026-08-04: "someone who has not
 * signed in cannot be on the onboarding ever").
 *
 * OnboardingFlow already redirected a signed-out visitor from the client, and
 * that is not the same thing: it fires after Clerk has reported, so the first
 * question is on screen for a beat before they are thrown off it. A bounce, not
 * a gate. Checked on the server, the page is never drawn at all.
 *
 * ON THE PAGE RATHER THAN IN THE MIDDLEWARE, which was the first attempt and
 * the wrong one. The rule it settled on outlived the auth provider that taught
 * it: protect access as close to the resource as possible. `proxy.ts` refreshes
 * the session and decides nothing — putting a gate on the path every request
 * takes, to guard one page, is work done everywhere for a rule that applies in
 * one place.
 *
 * THE CLIENT REDIRECT STAYS. It covers what this cannot — a session that ends
 * while the tab is open, long after this ran. Two mechanisms for two moments.
 *
 * This makes the route dynamic, which is the correct cost and only for this
 * page: a session cannot be checked at build time. Every lesson stays static,
 * which is the thing that actually matters on a Zambian connection, and this is
 * a page each student sees once, behind a sign-up.
 */
export default async function OnboardingPage() {
  if (authEnabled) {
    const userId = await currentUserId();
    /* To the landing page, where the sign-up card is — the same place the
       client redirect and RequireAccount both send people. A gate that lands
       somebody somewhere the rest of the app never sends them reads as an
       error rather than as a door. */
    if (!userId) redirect("/");
  }

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
