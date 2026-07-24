"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/* Mobile navigation drawer state, shared between the header's hamburger, the
 * sliding sidebar, and the tap-to-close scrim. The whole below-header view
 * shifts right to reveal the sidebar (a push, not an overlay) — the header
 * itself never moves. Desktop (md+) ignores all of this: the sidebar is the
 * static docs rail and `open` stays irrelevant. */
type MobileNav = { open: boolean; toggle: () => void; close: () => void };

const Ctx = createContext<MobileNav | null>(null);

/* No-op fallback for surfaces that render TopBar without the drawer (the parked
 * /old-home and /page scratch pages). There the hamburger is simply inert
 * rather than a crash. */
const NOOP: MobileNav = { open: false, toggle: () => {}, close: () => {} };

export function useMobileNav(): MobileNav {
  return useContext(Ctx) ?? NOOP;
}

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  // Esc closes the drawer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Growing to desktop must not leave a stuck-open drawer behind.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => mq.matches && setOpen(false);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <Ctx.Provider value={{ open, toggle, close }}>
      {/* The data attribute drives the CSS transforms on the sidebar and the
          content frame; it is the ancestor both selectors hang off. */}
      <div data-mobile-nav={open ? "open" : "closed"} className="h-screen overflow-hidden bg-canvas">
        {children}
      </div>
    </Ctx.Provider>
  );
}

/* Solar · Broken · "Hamburger Menu" — inlined (not via <Icon>) so the whole
 * Solar JSON stays out of the client bundle. */
function HamburgerBroken({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h3m13 0h-9m9 10h-3M4 17h9m-9-5h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Sits where the logo lockup does on desktop; mobile only. */
export function MobileMenuButton() {
  const { toggle, open } = useMobileNav();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      className="-ml-1 grid h-8 w-8 place-items-center rounded-lg text-ink transition-colors hover:bg-active md:hidden"
    >
      <HamburgerBroken />
    </button>
  );
}

/* Transparent full-area tap target over the content sliver while the drawer is
 * open — closes on tap. No dim, matching the plain-slide look. Mobile only. */
export function MobileScrim() {
  const { open, close } = useMobileNav();
  return (
    <div
      aria-hidden="true"
      onClick={close}
      className={
        "fixed inset-x-0 bottom-0 top-12 z-30 md:hidden " + (open ? "" : "pointer-events-none")
      }
    />
  );
}
