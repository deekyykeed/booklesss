"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ------------------------------------------------------------------ *
 * The pulled drawer, as a hook — the same mechanics as the /dashboard
 * sidebar (components/home/claude-ui/ClaudeUI.tsx, "SWIPE THE DRAWER"),
 * lifted out for the marketplace (owner, 2026-10-18: "the same sidebar
 * mechanics should work here"). ClaudeUI still carries its own inline copy;
 * the reasoning for every number lives there and is not repeated here.
 *
 * In short: the pull starts anywhere on the page, the axis is decided once
 * after 8px, the drawer follows the finger by writing straight to the DOM
 * (never a setState per touchmove), and release settles on distance (40%)
 * or a flick (0.4 px/ms). The listeners are native with `passive: false`
 * on the move, because React's are passive and `preventDefault` in an
 * onTouchMove prop silently does nothing.
 * ------------------------------------------------------------------ */

type Opts = {
  /** The element the gesture listens on — the page root. */
  root: RefObject<HTMLElement | null>;
  side: RefObject<HTMLElement | null>;
  scrim: RefObject<HTMLElement | null>;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Widths at which the drawer exists. */
  query: string;
};

const LOCK = 8;
const SETTLE = 0.4;
const FLICK = 0.4;
const RELEASE_MS = 220;
const RELEASE_FLOOR_MS = 90;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function useSwipeDrawer({ root, side: sideRef, scrim: scrimRef, open, setOpen, query }: Opts) {
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    const app = root.current;
    const side = sideRef.current;
    const scrim = scrimRef.current;
    if (!app || !side || !scrim) return;
    const mq = window.matchMedia(query);

    let candidate = false;
    let axis: "" | "x" | "y" = "";
    let x0 = 0, y0 = 0, w = 288, lastX = 0, lastT = 0, vx = 0;
    let wasOpen = false;

    const paint = (p: number) => {
      side.style.transition = "none";
      side.style.transform = `translateX(${-(1 - p) * w}px)`;
      scrim.style.transition = "none";
      scrim.style.opacity = String(p);
      scrim.style.visibility = "visible";
      scrim.style.pointerEvents = p > 0.1 ? "auto" : "none";
    };

    const release = (to: boolean) => {
      const dur = Math.max(RELEASE_FLOOR_MS, RELEASE_MS - Math.abs(vx) * 260);
      side.style.transition = `transform ${dur}ms ${EASE}`;
      side.style.transform = to ? "translateX(0)" : "translateX(-100%)";
      scrim.style.transition = `opacity ${dur}ms ${EASE}`;
      scrim.style.opacity = to ? "1" : "0";
      scrim.style.visibility = "visible";
      scrim.style.pointerEvents = to ? "auto" : "none";
      setOpen(to);
      window.setTimeout(() => {
        for (const el of [side, scrim]) {
          el.style.transition = "";
          el.style.transform = "";
          el.style.opacity = "";
          el.style.visibility = "";
          el.style.pointerEvents = "";
        }
      }, dur + 20);
    };

    const ownsHorizontal = (from: EventTarget | null) => {
      let n = from instanceof Node ? from : null;
      while (n && n !== app) {
        if (n instanceof HTMLElement) {
          if (n.tagName === "INPUT" || n.tagName === "TEXTAREA") return true;
          if (n.scrollWidth > n.clientWidth + 1) {
            const ox = getComputedStyle(n).overflowX;
            if (ox === "auto" || ox === "scroll") return true;
          }
        }
        n = n.parentNode;
      }
      return false;
    };

    const onStart = (e: TouchEvent) => {
      candidate = false;
      axis = "";
      if (!mq.matches || e.touches.length !== 1) return;
      const t = e.touches[0];
      wasOpen = openRef.current;
      if (!wasOpen && ownsHorizontal(e.target)) return;
      w = side.getBoundingClientRect().width || 288;
      x0 = lastX = t.clientX;
      y0 = t.clientY;
      lastT = e.timeStamp;
      vx = 0;
      candidate = true;
    };

    const onMove = (e: TouchEvent) => {
      if (!candidate || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - x0;
      const dy = t.clientY - y0;
      if (!axis) {
        if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "y" || (!wasOpen && dx < 0)) {
          candidate = false;
          return;
        }
      }
      const dt = e.timeStamp - lastT;
      if (dt > 0) vx = (t.clientX - lastX) / dt;
      lastX = t.clientX;
      lastT = e.timeStamp;
      e.preventDefault();
      paint(Math.max(0, Math.min(1, ((wasOpen ? w : 0) + dx) / w)));
    };

    const onEnd = () => {
      const wasDrag = candidate && axis === "x";
      candidate = false;
      axis = "";
      if (!wasDrag) return;
      const p = Math.max(0, Math.min(1, ((wasOpen ? w : 0) + (lastX - x0)) / w));
      release(Math.abs(vx) > FLICK ? vx > 0 : p > SETTLE);
    };

    app.addEventListener("touchstart", onStart, { passive: true });
    app.addEventListener("touchmove", onMove, { passive: false });
    app.addEventListener("touchend", onEnd, { passive: true });
    app.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      app.removeEventListener("touchstart", onStart);
      app.removeEventListener("touchmove", onMove);
      app.removeEventListener("touchend", onEnd);
      app.removeEventListener("touchcancel", onEnd);
    };
  }, [root, sideRef, scrimRef, setOpen, query]);
}
