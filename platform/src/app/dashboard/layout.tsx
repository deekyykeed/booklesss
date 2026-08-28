import { DashboardShell } from "@/components/home/shell/DashboardShell";
import { ProgressScope } from "@/components/reader/ProgressScope";

/**
 * The dashboard is a shell, as of 2026-08-28 — a fixed column on the left and a
 * pane on the right, ported from the reference UI the owner put in the repo
 * root (`claudeuiclone.html`).
 *
 * ⚠️ NO TopBar AND NO HomeDock ON THIS ROUTE. The shell carries one navigation
 * in the sidebar; a top bar above it would have drawn the wordmark twice and
 * put the destinations in two places, and the dock's four marks are the same
 * three rows the sidebar now lists. `HomeDock` and `SessionsHome` are parked in
 * `components/home/archive/` with a README saying what replaced each — the
 * voice call they carried is not lost, it is the microphone in the composer.
 *
 * ⚠️ NO `#content-surface` HERE ANY MORE, AND THAT RETIRES A WHOLE CLASS OF
 * BUG. The old surface was the scroller AND a `backdrop-filter` element, which
 * made it a containing block for `position: fixed` descendants exactly as a
 * transform would — so every piece of fixed chrome on this page had to live
 * outside `<main>` or it would ride the scroll. The shell has no fixed chrome
 * at all: the sidebar is a flex column on desktop and a drawer on a phone, and
 * the composer sits in the flow of its own pane. The scroller is
 * `#shell-scroll`, which nothing blurs.
 *
 * The home palette from 2026-08-27 is unchanged and still the owner's four
 * values — the shell reads --color-home-bg / -raise / -sunk and --color-accent
 * rather than bringing the reference's own greys in beside them. Two warm
 * near-identical palettes on one surface is the temperature drift the design
 * system warns about, where every individual near-miss is defensible.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* See the reader layout — a module store, so no provider and no guard. */}
      <ProgressScope />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
