"use client";

import { useEffect, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { ShareControl } from "@/components/ShareControl";
import { authEnabled } from "@/lib/auth";
import { onboardingComplete, useIdentity } from "@/lib/identity";
import { ShellSidebar } from "./ShellSidebar";

/* ------------------------------------------------------------------ *
 * The dashboard shell: a fixed column on the left, everything else on the
 * right. It wraps /dashboard, /dashboard/courses and /dashboard/saved, so the
 * sidebar is constant and only the pane changes — which is the arrangement the
 * reference UI is built around and the reason it survives being refilled.
 *
 * ⚠️ IT REPLACES BOTH TopBar AND HomeDock ON THIS ROUTE. The reference has one
 * navigation, in the sidebar, and keeping a top bar above it would have put the
 * wordmark on screen twice and the destinations in two places. Both components
 * are untouched on disk and still used elsewhere (TopBar by the reader and the
 * course pages); HomeDock is now referenced by nothing and is parked in
 * `home/archive/` with the rest.
 *
 * ⚠️ BELOW 768px THE SIDEBAR IS A DRAWER, and that is not a detail — a 288px
 * column against a 390px phone leaves 102px of pane. The panel button in the
 * pane header opens it; the scrim, Escape and any navigation close it.
 *
 * ⚠️ IT GATES ON EXACTLY WHAT THE PAGES GATE ON, INCLUDING `authEnabled`. This
 * lives in the layout, so it cannot lean on a page's own <RequireOnboarding> to
 * decide whether it belongs — it has to make the same decision independently,
 * and that decision has two halves. `RequireOnboarding` answers
 * `if (!authEnabled) return children`, so a shell that checked only
 * `onboardingComplete` would draw a keyless build — every local run, every
 * preview with no env — with no navigation at all. HomeDock shipped that bug in
 * August; the note in its header is the record.
 * ------------------------------------------------------------------ */

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { identity, hydrated } = useIdentity();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  /* Nothing until the device has been read, so the shell cannot flash up and
     disappear underneath somebody. */
  if (!hydrated) return null;
  if (authEnabled && !onboardingComplete(identity)) return <>{children}</>;

  return (
    <div className="shell" data-nav-open={navOpen || undefined}>
      {/* Any navigation closes the drawer. On a phone every row in it leads
          somewhere, so leaving it open over the page it just opened means the
          student has to dismiss it before reading anything.

          Handled on the way OUT — a click on a row — rather than by watching
          the path and calling setState in an effect, which is a cascading
          render and which lint rejects outright. Delegated to the container so
          a row added later is covered without being wired up. */}
      <ShellSidebar onNavigate={() => setNavOpen(false)} />

      <div className="shell-pane">
        <header className="shell-pane-head">
          <button
            type="button"
            className="shell-icon-btn shell-nav-toggle"
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={navOpen}
            aria-controls="shell-sidebar"
          >
            <MynaIcon name="sidebar" size={20} />
          </button>
          <span className="shell-grow" />
          {/* The app's one share control. It moved here rather than being
              dropped with the top bar: the owner's rule (2026-08-02) is that
              there is exactly one place in the app where sharing can be got
              wrong, and deleting it from this route would have made the
              dashboard the exception. */}
          <ShareControl />
        </header>

        {/* Its own id, deliberately not `content-surface`. That id belongs to
            the frosted, blurred scroller the reader and the course pages use,
            and three modules look it up by name to scroll or lock it. This
            surface is flat and opaque and wants none of that behaviour. */}
        <div className="shell-pane-scroll no-scrollbar" id="shell-scroll">
          {children}
        </div>
      </div>

      {/* A real button, not a bare div: it is the touch target that closes the
          drawer, and it must be reachable and announced as such. Hidden from
          the tab order while the drawer is shut. */}
      <button
        type="button"
        className="shell-scrim"
        onClick={() => setNavOpen(false)}
        tabIndex={navOpen ? 0 : -1}
        aria-hidden={!navOpen}
        aria-label="Close sidebar"
      />
    </div>
  );
}
