import type { Metadata } from "next";
import { ClaudeUI } from "@/components/home/claude-ui/ClaudeUI";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
  alternates: { canonical: "/dashboard" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/dashboard" }),
};

/* /dashboard IS THE REFERENCE UI, as of 2026-08-28. Not adapted, not remapped —
 * the owner asked for a replacement to work forward from: "100% the ui, that's
 * where I want to start from."
 *
 * ⚠️ THE GATES ARE GONE FROM THIS PAGE, DELIBERATELY. <RequireAccount> and
 * <RequireOnboarding> render nothing and redirect, so with either in place the
 * page could not be looked at without a finished account — which defeats a
 * surface whose only current purpose is to be looked at and built on. Nothing
 * here reads a student's data, so there is nothing to protect yet. THEY GO BACK
 * THE MOMENT THIS RENDERS ANYTHING REAL: the screen it replaced was gated, and
 * the reasoning (owner, 2026-08-03: reading a shared step stays open to
 * everyone, but the dashboard is the student's own record) has not changed.
 *
 * What it replaced — one session list and a voice button, and the shell that
 * briefly wrapped it — is in `components/home/archive/`.
 */
export default function DashboardPage() {
  return <ClaudeUI />;
}
