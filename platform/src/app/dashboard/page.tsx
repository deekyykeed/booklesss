import type { Metadata } from "next";
import { ShellComposer } from "@/components/home/shell/ShellComposer";
import { RequireAccount } from "@/components/auth/RequireAccount";
import { RequireOnboarding } from "@/components/auth/RequireOnboarding";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ask anything about your courses, or talk it through.",
  alternates: { canonical: "/dashboard" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/dashboard" }),
};

/* /dashboard is the student's home. It lived at "/" until 2026-08-03, when "/"
 * became the landing page — Google's OAuth review requires the home URL to be a
 * static page that explains the app without sign-in, and the owner wanted a
 * real front door anyway. A course's own overview lives at /[slug] (e.g.
 * /economics), and the steps under their own paths.
 *
 * SINCE 2026-08-28 THE PANE IS A GREETING AND A BOX, and the sessions moved to
 * the sidebar. That is the reference UI's own arrangement and the reason the
 * port holds together: a shell whose left column is the list and whose centre
 * is one thing you can start. The screen this replaces — "Your sessions" as the
 * entire page — is `components/home/archive/SessionsHome.tsx`, parked with the
 * dock that sat under it.
 *
 * It also closes BOO-44 by deletion rather than by fix. That ticket was open
 * because `SessionsHome`'s cards resolved through `sessionsForCourse()` to
 * `/study/<slug>`, the dark call screen the owner had asked removed from the
 * course card the same day. Those cards are gone; the sidebar's rows use the
 * same `path` from the same nav, so the underlying route question is unchanged
 * and still worth settling — see the note left on the ticket.
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
          and sends the student to /onboarding to give them. The shell in the
          layout repeats this decision independently; see the note there for
          why half a gate is a trap. */}
      <RequireOnboarding>
        <ShellComposer />
      </RequireOnboarding>
    </>
  );
}
