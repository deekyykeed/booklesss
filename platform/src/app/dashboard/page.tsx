import type { Metadata } from "next";
import { SessionsHome } from "@/components/home/SessionsHome";
import { RequireAccount } from "@/components/auth/RequireAccount";
import { RequireOnboarding } from "@/components/auth/RequireOnboarding";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your sessions, and one button to talk them through.",
  alternates: { canonical: "/dashboard" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/dashboard" }),
};

/* /dashboard is the student's home. It lived at "/" until 2026-08-03, when "/"
 * became the landing page — Google's OAuth review requires the home URL to be a
 * static page that explains the app without sign-in, and the owner wanted a
 * real front door anyway. A course's own overview lives at /[slug] (e.g.
 * /economics), and the steps under their own paths.
 *
 * IT IS ONE LIST AND A BUTTON, since 2026-08-27 (owner's sketch). The greeting,
 * the four stat tiles, the courses grid and the offline tools that used to be
 * here are in `components/home/archive/` — parked, not deleted, with a README
 * saying what replaced each of them. The courses grid is live at
 * /dashboard/courses.
 *
 * There is no signed-out variant any more. `HomeViewWithUser` existed to feed a
 * name into a greeting; there is no greeting, so the page renders the same
 * thing for everyone who gets past the two gates below — and both gates
 * guarantee an account, so the `authEnabled` fork it used to carry could only
 * ever have chosen between two identical screens.
 */
export default function DashboardPage() {
  return (
    <>
      {/* No account, no dashboard (owner, 2026-08-03). Reading a shared step
          stays open to everyone — that is the growth loop — but this page is
          the student's own record, so it belongs to people who have one. */}
      <RequireAccount />
      {/* And no finished onboarding, no dashboard either (owner, 2026-08-04) —
          this page is the answers, drawn. Until they exist it renders nothing
          and sends the student to /onboarding to give them.
          The dock is in the LAYOUT, outside `#content-surface`, and gates
          itself on the same answers — see the notes in both files. */}
      <RequireOnboarding>
        <SessionsHome />
      </RequireOnboarding>
    </>
  );
}
