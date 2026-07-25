"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Section } from "@/lib/course";

/* Reader shell state, shared by both sidebars, the header's hamburger, and the
 * tap-to-close scrim. It owns three things:
 *
 *  1. `side` — which mobile drawer is open (left = course nav, right = step
 *     context), or null. Only one at a time. On mobile the whole below-header
 *     view slides sideways to reveal a drawer (a push, not an overlay); the
 *     header itself never moves. Desktop (md+) ignores `side` entirely — both
 *     sidebars are static rails there.
 *  2. `leftCollapsed` / `rightCollapsed` — desktop-only collapse. Persisted.
 *  3. `sections` — the current lesson's sections, published by the route so the
 *     persistent right panel can render the "on this page" TOC without the
 *     layout needing to know the lesson.
 */
type Side = "left" | "right" | null;

type ReaderShell = {
  side: Side;
  toggleLeft: () => void;
  toggleRight: () => void;
  close: () => void;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  toggleLeftCollapsed: () => void;
  toggleRightCollapsed: () => void;
  sections: Section[] | null;
  setSections: (s: Section[] | null) => void;
};

const Ctx = createContext<ReaderShell | null>(null);

/* No-op fallback for surfaces that render chrome without the provider (the
 * parked /old-home and /page scratch pages). There the controls are simply
 * inert rather than a crash. */
const NOOP: ReaderShell = {
  side: null,
  toggleLeft: () => {},
  toggleRight: () => {},
  close: () => {},
  leftCollapsed: false,
  rightCollapsed: false,
  toggleLeftCollapsed: () => {},
  toggleRightCollapsed: () => {},
  sections: null,
  setSections: () => {},
};

export function useReaderShell(): ReaderShell {
  return useContext(Ctx) ?? NOOP;
}
// Back-compat alias — plenty of call sites still say useMobileNav().
export const useMobileNav = useReaderShell;

const LEFT_COLLAPSED_KEY = "booklesss:left-collapsed";
const RIGHT_COLLAPSED_KEY = "booklesss:right-collapsed";

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIso = typeof document !== "undefined" ? useLayoutEffect : useEffect;

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [side, setSide] = useState<Side>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [sections, setSections] = useState<Section[] | null>(null);

  const toggleLeft = useCallback(() => setSide((s) => (s === "left" ? null : "left")), []);
  const toggleRight = useCallback(() => setSide((s) => (s === "right" ? null : "right")), []);
  const close = useCallback(() => setSide(null), []);

  const toggleLeftCollapsed = useCallback(
    () =>
      setLeftCollapsed((c) => {
        const next = !c;
        try { localStorage.setItem(LEFT_COLLAPSED_KEY, next ? "1" : "0"); } catch { /* ignore */ }
        return next;
      }),
    [],
  );
  const toggleRightCollapsed = useCallback(
    () =>
      setRightCollapsed((c) => {
        const next = !c;
        try { localStorage.setItem(RIGHT_COLLAPSED_KEY, next ? "1" : "0"); } catch { /* ignore */ }
        return next;
      }),
    [],
  );

  // Restore collapse state before paint (client only). A brief flash is possible
  // but the panels animate anyway, so it reads as intentional.
  useIso(() => {
    try {
      if (localStorage.getItem(LEFT_COLLAPSED_KEY) === "1") setLeftCollapsed(true);
      if (localStorage.getItem(RIGHT_COLLAPSED_KEY) === "1") setRightCollapsed(true);
    } catch { /* private mode */ }
  }, []);

  // Esc closes whichever drawer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSide(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Growing past a breakpoint must not leave a stuck-open drawer behind. The
  // left becomes a rail at md, the right at xl — so above xl close everything,
  // and between md and xl only the left needs closing.
  useEffect(() => {
    const mqBoth = window.matchMedia("(min-width: 1280px)");
    const mqLeft = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (mqBoth.matches) setSide(null);
      else if (mqLeft.matches) setSide((s) => (s === "left" ? null : s));
    };
    mqBoth.addEventListener("change", sync);
    mqLeft.addEventListener("change", sync);
    return () => {
      mqBoth.removeEventListener("change", sync);
      mqLeft.removeEventListener("change", sync);
    };
  }, []);

  /* Touch gestures (mobile only). From closed: swipe right opens the left
   * (course) drawer, swipe left opens the right (context) drawer. While open,
   * the opposite swipe closes it. Bound once; reads live state through a ref.
   * A direction lock keeps a vertical drag a scroll, and horizontally-scrolling
   * or editable descendants (code playgrounds, inputs) opt out via the guard so
   * a sideways scroll there never yanks a drawer open. */
  const sideRef = useRef<Side>(side);
  sideRef.current = side;
  useEffect(() => {
    const THRESHOLD = 55; // px of horizontal travel to trigger
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let decided = false;

    const onStart = (e: TouchEvent) => {
      // Above xl both panels are rails — no drawer to swipe.
      if (window.innerWidth >= 1280 || e.touches.length !== 1) return;
      const t = e.target as Element | null;
      if (t?.closest?.("[data-no-swipe], pre, textarea, input, select, [contenteditable], .cm-editor")) {
        tracking = false;
        return;
      }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      decided = false;
      tracking = true;
    };
    const onMove = (e: TouchEvent) => {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!decided) {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return; // wait for intent
        decided = true;
        if (Math.abs(dy) >= Math.abs(dx)) {
          tracking = false; // vertical — leave it to the scroller
          return;
        }
      }
      const cur = sideRef.current;
      const w = window.innerWidth;
      if (cur === null) {
        // Open a side only where that side is a drawer: left below md, right
        // below xl. Swipe right opens the course nav; swipe left opens context.
        if (dx > THRESHOLD && w < 768) { setSide("left"); tracking = false; }
        else if (dx < -THRESHOLD && w < 1280) { setSide("right"); tracking = false; }
      } else if (cur === "left" && dx < -THRESHOLD) {
        setSide(null); tracking = false;
      } else if (cur === "right" && dx > THRESHOLD) {
        setSide(null); tracking = false;
      }
    };
    const onEnd = () => { tracking = false; };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  const value: ReaderShell = {
    side,
    toggleLeft,
    toggleRight,
    close,
    leftCollapsed,
    rightCollapsed,
    toggleLeftCollapsed,
    toggleRightCollapsed,
    sections,
    setSections,
  };

  return (
    <Ctx.Provider value={value}>
      {/* The data attributes drive the CSS transforms/paddings on the sidebars
          and the content frame; this div is the ancestor every selector hangs
          off. .app-shell is a fixed-height frame on desktop and a normal
          scrolling document on mobile — see globals.css. */}
      <div
        data-mobile-nav={side ?? "closed"}
        data-left-collapsed={leftCollapsed ? "" : undefined}
        data-right-collapsed={rightCollapsed ? "" : undefined}
        className="app-shell bg-canvas"
      >
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

/* Sits where the logo lockup does on desktop; opens the left (course) drawer.
 * Mobile only. */
export function MobileMenuButton() {
  const { toggleLeft, side } = useReaderShell();
  const open = side === "left";
  return (
    <button
      type="button"
      onClick={toggleLeft}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      className="-ml-1 -mr-1.5 grid h-8 w-8 place-items-center rounded-lg text-ink transition-colors hover:bg-active md:hidden"
    >
      <HamburgerBroken />
    </button>
  );
}

/* Solar · Broken · "Notebook" style — opens the right (step context) drawer.
 * Mobile only; sits in the header's right cluster. */
export function MobileContextButton() {
  const { toggleRight, side } = useReaderShell();
  const open = side === "right";
  return (
    <button
      type="button"
      onClick={toggleRight}
      aria-label={open ? "Close step context" : "Open step context"}
      aria-expanded={open}
      className="grid h-8 w-8 place-items-center rounded-lg text-ink transition-colors hover:bg-active xl:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6h11m-11 6h11m-11 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="19" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19 12.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/* Transparent full-area tap target over the content sliver while a drawer is
 * open — closes on tap. No dim, matching the plain-slide look. Mobile only. */
export function MobileScrim() {
  const { side, close } = useReaderShell();
  return (
    <div
      aria-hidden="true"
      onClick={close}
      className={
        "fixed inset-x-0 bottom-0 top-12 z-30 " + (side ? "" : "pointer-events-none")
      }
    />
  );
}
