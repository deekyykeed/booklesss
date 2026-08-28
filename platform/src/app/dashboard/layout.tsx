import { ProgressScope } from "@/components/reader/ProgressScope";

/**
 * Bare, since 2026-08-28: /dashboard is now the reference UI and that UI is the
 * whole screen — its own sidebar, its own header, its own everything. A TopBar
 * above it or a dock below it would mean the page was 95% the reference, which
 * is the one thing the owner asked it not to be.
 *
 * ⚠️ CONSEQUENCE, AND IT IS REAL: /dashboard/courses and /dashboard/saved sit
 * under this layout too, so they have lost their navigation along with it. They
 * still render and are still reachable by URL; they just have no chrome around
 * them until the reference's sidebar rows are pointed at them. If they need it
 * back sooner, the answer is a route group — `(tabs)/` with its own layout —
 * not putting a top bar back over the dashboard.
 *
 * `ProgressScope` stays because those two tabs read the progress store and it
 * is what decides which bucket they read.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressScope />
      {children}
    </>
  );
}
