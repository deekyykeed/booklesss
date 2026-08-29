"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * THE REFERENCE UI, VERBATIM.
 *
 * This is `claudeuiclone.html` from the repo root, transcribed into JSX and
 * nothing else. Every class name, every element, every path in the sprite and
 * every value in the stylesheet is the file's. It is deliberately NOT wired to
 * Booklesss: the owner asked for a replacement rather than an adaptation —
 * "100% the ui, that's where I want to start from" — so the labels still read
 * Projects, Artifacts, Scheduled, Customize, the model button still says
 * Sonnet 5, and the greeting is still the reference's. Those are the starting
 * point, to be replaced deliberately rather than guessed at here.
 *
 * ⚠️ NOTHING IN THIS TREE READS THE APP'S DESIGN TOKENS, AND THAT IS THE POINT.
 * The stylesheet ships its own palette (`--page-bg`, `--clay`, `--text-100` …)
 * scoped under `.cui` in globals.css, so it cannot drift into the rest of the
 * app and the rest of the app cannot drift into it. When this stops being a
 * scratch surface and starts being the product, that scoping is the seam where
 * the app's own tokens get swapped in.
 *
 * The only things that are not a straight transcription:
 *   · the two segmented controls are React state rather than the file's
 *     `querySelectorAll` click handler;
 *   · the drawer's open state is React state rather than a class toggled on
 *     `.app` by hand;
 *   · `html, body` rules became `.cui`, and the drawer is positioned against
 *     `.app` instead of the viewport — `position: fixed` breaks under any
 *     ancestor that gains a transform or a backdrop-filter, which is a trap
 *     this codebase has already paid for twice.
 * ------------------------------------------------------------------ */

export function ClaudeUI() {
  const [headerSeg, setHeaderSeg] = useState(0);
  const [composerSeg, setComposerSeg] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const appRef = useRef<HTMLDivElement | null>(null);
  const sideRef = useRef<HTMLElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  /* The gesture listeners are attached once and read the drawer's state
     through a ref — re-subscribing four native listeners on every toggle
     would drop a touch that lands mid-swap. */
  const openRef = useRef(navOpen);

  useEffect(() => {
    openRef.current = navOpen;
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  /* ---- SWIPE THE DRAWER (phone widths only) -------------------------
   * The drawer FOLLOWS THE FINGER rather than toggling at the end of one.
   * A swipe that only fires on release is a button with extra steps: you
   * cannot tell how far you have to go, you cannot change your mind, and a
   * half-pull looks like the app ignoring you.
   *
   * ⚠️ THE POSITION IS WRITTEN STRAIGHT TO THE DOM DURING THE DRAG, never
   * through React state. A setState per touchmove is a re-render per frame,
   * which is how a drag starts stuttering on a mid-range Android — the same
   * reason the level meter in the archived dock polls into a CSS variable.
   *
   * ⚠️ AND THE LISTENERS ARE NATIVE, WITH `passive: false` ON THE MOVE.
   * React attaches touch handlers passively at the root, so `preventDefault`
   * inside an `onTouchMove` prop is ignored and the page scrolls underneath
   * the drag. There is no warning; it just does not work.
   */
  useEffect(() => {
    const app = appRef.current;
    const side = sideRef.current;
    const scrim = scrimRef.current;
    if (!app || !side || !scrim) return;

    const mq = window.matchMedia("(max-width: 768px)");
    /** How close to the left edge a pull must start while the drawer is shut. */
    const EDGE = 32;
    /** Travel before the gesture's axis is decided. */
    const LOCK = 8;
    /** Fraction of the drawer past which release opens it. */
    const SETTLE = 0.4;
    /** px/ms that decides the direction regardless of how far it got. */
    const FLICK = 0.4;

    let candidate = false;
    let axis: "" | "x" | "y" = "";
    let x0 = 0;
    let y0 = 0;
    let w = 288;
    let wasOpen = false;
    let lastX = 0;
    let lastT = 0;
    let vx = 0;

    const paint = (p: number) => {
      side.style.transition = "none";
      side.style.transform = `translateX(${-(1 - p) * w}px)`;
      scrim.style.transition = "none";
      scrim.style.opacity = String(p);
      scrim.style.visibility = "visible";
      scrim.style.pointerEvents = p > 0.1 ? "auto" : "none";
    };

    const release = (open: boolean) => {
      /* Hand the element back to CSS, but name the end position explicitly
         first. Clearing the inline transform in the same frame the class
         changes would snap to the OLD class value and animate from there —
         the drawer would jump shut and then slide open. */
      side.style.transition = "";
      side.style.transform = open ? "translateX(0)" : "translateX(-100%)";
      scrim.style.transition = "";
      scrim.style.opacity = "";
      scrim.style.visibility = "";
      scrim.style.pointerEvents = "";
      setNavOpen(open);
      window.setTimeout(() => {
        side.style.transform = "";
      }, 460);
    };

    const onStart = (e: TouchEvent) => {
      candidate = false;
      axis = "";
      if (!mq.matches || e.touches.length !== 1) return;
      const t = e.touches[0];
      wasOpen = openRef.current;
      /* Shut, the pull has to begin at the edge: a rightward swipe anywhere
         in the pane would fight the content under it. Open, anywhere is fair
         game, because the drawer is the thing under the finger. */
      if (!wasOpen && t.clientX > EDGE) return;
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
        /* Whichever axis moved further wins, decided once and not revisited.
           A drawer that grabs a gesture meant as a scroll is worse than one
           that misses the occasional swipe. */
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "y") {
          candidate = false;
          return;
        }
      }

      const dt = e.timeStamp - lastT;
      if (dt > 0) vx = (t.clientX - lastX) / dt;
      lastX = t.clientX;
      lastT = e.timeStamp;

      /* Only now the gesture is certainly horizontal. Preventing default any
         earlier would eat the page's vertical scrolling. */
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
  }, []);

  return (
    <div className="cui">
      {/* ================= ICON SPRITE ================= */}
      <svg className="sprite" aria-hidden="true">
        <defs>
          <symbol id="ic-plus" viewBox="0 0 20 20">
            <path d="M10 4.4v11.2M4.4 10h11.2" />
          </symbol>
          <symbol id="ic-projects" viewBox="0 0 20 20">
            <rect x="3.4" y="4.2" width="13.2" height="2.9" rx="1" />
            <path d="M4.8 7.1v6.6a2 2 0 0 0 2 2h6.4a2 2 0 0 0 2-2V7.1" />
            <path d="M8.4 10.2h3.2" />
          </symbol>
          <symbol id="ic-artifacts" viewBox="0 0 20 20">
            <circle cx="7.2" cy="7.2" r="3.1" />
            <rect x="9.4" y="10.1" width="6.4" height="6.4" rx="1.7" />
            <path d="M4.3 16.5h2.6" />
          </symbol>
          <symbol id="ic-clock" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="6.9" />
            <path d="M10 10V5.9M10 10h3" />
          </symbol>
          <symbol id="ic-briefcase" viewBox="0 0 20 20">
            <rect x="3" y="6.4" width="14" height="9.4" rx="2" />
            <path d="M7.6 6.4V5.2A1.3 1.3 0 0 1 8.9 3.9h2.2a1.3 1.3 0 0 1 1.3 1.3v1.2" />
            <path d="M3 10.4h14" />
          </symbol>
          <symbol id="ic-pin" viewBox="0 0 20 20">
            <path d="M11.9 2.9l5.2 5.2M13.5 4.5 9 6.7l-3.3 3.3 4.3 4.3L13.3 11l2.2-4.5M6.6 13.4 3.2 16.8" />
          </symbol>
          <symbol id="ic-chevron-right" viewBox="0 0 20 20">
            <path d="M7.5 4.5 13 10l-5.5 5.5" />
          </symbol>
          <symbol id="ic-chevron-down" viewBox="0 0 20 20">
            <path d="M4.5 7.5 10 13l5.5-5.5" />
          </symbol>
          <symbol id="ic-sliders" viewBox="0 0 20 20">
            <path d="M7 3.2v4.1M7 11.2v5.6M13 3.2v6.1M13 13.2v3.6" />
            <circle cx="7" cy="9.3" r="1.9" />
            <circle cx="13" cy="11.3" r="1.9" />
          </symbol>
          <symbol id="ic-palette" viewBox="0 0 20 20">
            <path d="M10 2.6a7.4 7.4 0 1 0 0 14.8c1 0 1.6-.7 1.6-1.5 0-.5-.2-.8-.5-1.1-.3-.3-.5-.6-.5-1.1 0-.8.7-1.5 1.5-1.5h1.3a4 4 0 0 0 4-4c0-3.1-3.3-5.6-7.4-5.6Z" />
            <circle cx="6.6" cy="9.6" r=".95" fill="currentColor" stroke="none" />
            <circle cx="8.9" cy="6.4" r=".95" fill="currentColor" stroke="none" />
            <circle cx="12.6" cy="6.9" r=".95" fill="currentColor" stroke="none" />
          </symbol>
          <symbol id="ic-download" viewBox="0 0 20 20">
            <path d="M10 3.4v8.4M6.4 8.6 10 12.2l3.6-3.6M3.8 15.6h12.4" />
          </symbol>
          <symbol id="ic-search" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="5.4" />
            <path d="M12.9 12.9l3.6 3.6" />
          </symbol>
          <symbol id="ic-panel" viewBox="0 0 20 20">
            <rect x="2.9" y="3.6" width="14.2" height="12.8" rx="2.2" />
            <path d="M8.3 3.6v12.8" />
          </symbol>
          <symbol id="ic-bubbles" viewBox="0 0 20 20">
            <path d="M13.9 11.4a5.6 5.6 0 0 0-5.7-8.1A5.6 5.6 0 0 0 3.6 9c0 1 .3 2 .8 2.8L3.6 15l3.3-.8a5.6 5.6 0 0 0 7-2.8Z" />
            <path d="M8.6 13.3a5 5 0 0 0 4.5 2.8c.8 0 1.6-.2 2.3-.5l2.9.7-.7-2.7c.4-.7.6-1.5.6-2.4a5 5 0 0 0-2.4-4.3" />
          </symbol>
          <symbol id="ic-code" viewBox="0 0 20 20">
            <path d="M7.2 6.6 3.8 10l3.4 3.4M12.8 6.6 16.2 10l-3.4 3.4M11.3 5.2 8.7 14.8" />
          </symbol>
          <symbol id="ic-mic" viewBox="0 0 20 20">
            <rect x="7.6" y="2.6" width="4.8" height="9" rx="2.4" />
            <path d="M4.9 9.6a5.1 5.1 0 0 0 10.2 0M10 14.7v2.7" />
          </symbol>
          <symbol id="ic-edit-square" viewBox="0 0 20 20">
            <path d="M8.8 3.9H5.4a2 2 0 0 0-2 2v8.7a2 2 0 0 0 2 2h8.7a2 2 0 0 0 2-2v-3.4" />
            <path d="M14.1 3.2 16.8 5.9 10.6 12l-3.2.5.5-3.2 6.2-6.1Z" />
          </symbol>
          <symbol id="ic-record" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="7.1" />
            <circle cx="10" cy="10" r="3.1" fill="currentColor" stroke="none" />
          </symbol>
          <symbol id="ic-ghost" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              stroke="none"
              d="M6.99951 8.66672C7.5518 8.66672 7.99951 9.11443 7.99951 9.66672C7.9993 10.2188 7.55166 10.6667 6.99951 10.6667C6.44736 10.6667 5.99973 10.2188 5.99951 9.66672C5.99951 9.11443 6.44723 8.66672 6.99951 8.66672Z"
            />
            <path
              fill="currentColor"
              stroke="none"
              d="M12.9995 8.66672C13.5518 8.66672 13.9995 9.11443 13.9995 9.66672C13.9993 10.2188 13.5517 10.6667 12.9995 10.6667C12.4474 10.6667 11.9997 10.2188 11.9995 9.66672C11.9995 9.11443 12.4472 8.66672 12.9995 8.66672Z"
            />
            <path
              fill="currentColor"
              stroke="none"
              d="M10 2C14.326 2.00018 17.9998 5.67403 18 10V17.3123C17.9997 17.5427 17.8411 17.8079 17.6172 17.8623C17.3932 17.9165 17.1614 17.7456 17.0557 17.5408C16.7805 17.007 16.3658 16.5937 16.062 16.2878C15.7793 16.0034 15.4503 15.8338 14.9771 15.8337C14.2092 15.8339 13.4371 16.3862 12.9487 17.53C12.8701 17.7138 12.6887 17.8621 12.4888 17.8623C12.2888 17.8623 12.1076 17.7138 12.0288 17.53C11.5404 16.386 10.7674 15.8339 9.99951 15.8337C9.23161 15.8339 8.45959 16.386 7.97119 17.53C7.89253 17.7138 7.71118 17.8621 7.51123 17.8623C7.31122 17.8623 7.13006 17.7138 7.05127 17.53C6.56296 16.3862 5.78982 15.834 5.02197 15.8337C4.54861 15.8338 4.21974 16.0032 3.93701 16.2878C3.63309 16.5937 3.21952 17.0715 2.94434 17.6055C2.83865 17.8103 2.60589 17.9165 2.38184 17.8623C2.15801 17.8079 2.00033 17.6073 2 17.377V10C2.00018 5.67403 5.67403 2.00018 10 2ZM10 3C6.22631 3.00018 3.00018 6.22631 3 10V15.8633C3.0205 15.8414 3.20696 15.6049 3.22803 15.5837C3.67524 15.1336 4.251 14.8338 5.02197 14.8337C6.03838 14.8341 6.90232 15.4025 7.51025 16.2937C8.11828 15.4018 8.9824 14.8338 9.99951 14.8337C11.0163 14.8338 11.8798 15.4022 12.4878 16.2937C13.0959 15.4018 13.9601 14.8339 14.9771 14.8337C15.7481 14.8338 16.3247 15.1336 16.772 15.5837C16.772 15.5837 16.9796 15.812 17 15.8337V10C16.9998 6.22631 13.7737 3.00018 10 3Z"
            />
          </symbol>
        </defs>
      </svg>

      <div className={"app" + (navOpen ? " nav-open" : "")} ref={appRef}>
        {/* ================= SIDEBAR ================= */}
        <aside className="sidebar" id="cui-sidebar" ref={sideRef}>
          <div className="sb-head">
            <a className="wordmark" href="#">
              Claude
            </a>
            <span className="grow" />
            <div className="seg seg-header">
              <button
                className={"seg-item" + (headerSeg === 0 ? " is-active" : "")}
                onClick={() => setHeaderSeg(0)}
              >
                <svg className="i i-16">
                  <use href="#ic-bubbles" />
                </svg>
              </button>
              <button
                className={"seg-item" + (headerSeg === 1 ? " is-active" : "")}
                onClick={() => setHeaderSeg(1)}
              >
                <svg className="i i-16">
                  <use href="#ic-code" />
                </svg>
                <span className="dot" />
              </button>
            </div>
          </div>

          <div className="sb-body">
            <div className="rows">
              <a className="row row-new" href="#">
                <span className="slot">
                  <svg className="i i-16">
                    <use href="#ic-plus" />
                  </svg>
                </span>
                <span className="label">New</span>
                <span className="kbd">Ctrl⇧O</span>
                <button className="icon-btn-sm">
                  <svg className="i i-16">
                    <use href="#ic-edit-square" />
                  </svg>
                </button>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <svg className="i">
                    <use href="#ic-projects" />
                  </svg>
                </span>
                <span className="label">Projects</span>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <svg className="i">
                    <use href="#ic-artifacts" />
                  </svg>
                </span>
                <span className="label">Artifacts</span>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <svg className="i">
                    <use href="#ic-clock" />
                  </svg>
                </span>
                <span className="label">Scheduled</span>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <svg className="i">
                    <use href="#ic-briefcase" />
                  </svg>
                </span>
                <span className="label">Customize</span>
              </a>
            </div>

            <div className="sec">
              <div className="sec-head">
                <span>Projects</span>
                <svg className="i i-12 caret">
                  <use href="#ic-chevron-right" />
                </svg>
                <span className="grow" />
                <button className="icon-btn-sm">
                  <svg className="i i-16">
                    <use href="#ic-plus" />
                  </svg>
                </button>
              </div>
              <div className="empty-row">
                <span className="slot">
                  <svg className="i">
                    <use href="#ic-pin" />
                  </svg>
                </span>
                <span>Pin projects to keep them here</span>
              </div>
            </div>

            <div className="hairline" style={{ marginTop: 10 }} />

            <div className="sec-head" style={{ marginTop: 10 }}>
              <span>Chats and tasks</span>
              <svg className="i i-12 caret always">
                <use href="#ic-chevron-right" />
              </svg>
              <span className="grow" />
              <button className="icon-btn-sm">
                <svg className="i i-16">
                  <use href="#ic-sliders" />
                </svg>
              </button>
            </div>
          </div>

          <div className="sb-foot">
            <div className="hairline" />
            <a className="row" href="#">
              <span className="slot">
                <svg className="i">
                  <use href="#ic-palette" />
                </svg>
              </span>
              <span className="label">Design</span>
            </a>
            <div className="user-row">
              <button className="user-btn">
                <span className="avatar" />
                <span className="user-name">Deeky</span>
                <span className="user-plan">&nbsp;· Pro</span>
                <svg className="i i-12">
                  <use href="#ic-chevron-down" />
                </svg>
              </button>
              <div className="foot-icons">
                <button className="icon-btn">
                  <svg className="i i-16">
                    <use href="#ic-download" />
                  </svg>
                </button>
                <button className="icon-btn">
                  <svg className="i i-16">
                    <use href="#ic-search" />
                  </svg>
                </button>
                <button className="icon-btn">
                  <svg className="i i-16">
                    <use href="#ic-panel" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= MAIN PANE ================= */}
        <div className="pane">
          <header className="pane-head">
            <button
              className="head-btn nav-toggle"
              aria-label={navOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={navOpen}
              aria-controls="cui-sidebar"
              onClick={() => setNavOpen((v) => !v)}
            >
              <svg className="i">
                <use href="#ic-panel" />
              </svg>
            </button>
            <span className="grow" />
            <button className="head-btn" aria-label="Use incognito">
              <svg className="i">
                <use href="#ic-ghost" />
              </svg>
            </button>
          </header>

          <div className="pane-scroll">
            <div className="pane-inner">
              <div className="center">
                <div className="greeting">
                  <svg className="spark" viewBox="0 0 100 100" aria-hidden="true">
                    <path
                      fill="#d97757"
                      d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
                    />
                  </svg>
                  <span className="txt">Good evening, Deeky</span>
                </div>

                <div className="composer">
                  <div
                    className="editor"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="How can I help you today?"
                  />

                  <div className="bar">
                    <div className="bar-left">
                      <button className="cbtn" aria-label="Add files, connectors">
                        <svg className="i">
                          <use href="#ic-plus" />
                        </svg>
                      </button>
                      <div className="seg seg-composer">
                        <button
                          className={"seg-item" + (composerSeg === 0 ? " is-active" : "")}
                          onClick={() => setComposerSeg(0)}
                        >
                          Chat
                        </button>
                        <button
                          className={"seg-item" + (composerSeg === 1 ? " is-active" : "")}
                          onClick={() => setComposerSeg(1)}
                        >
                          Cowork
                        </button>
                      </div>
                    </div>

                    <div className="bar-right">
                      <button className="model-btn">
                        <span>Sonnet 5</span>
                        <span className="muted">Medium</span>
                      </button>
                      <div className="voice">
                        <button className="cbtn" aria-label="Dictate">
                          <svg className="i">
                            <use href="#ic-mic" />
                          </svg>
                        </button>
                        <button className="caret" aria-label="Voice input">
                          <svg className="i i-12">
                            <use href="#ic-chevron-down" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stop-wrap">
                  <button className="stop">
                    <svg className="i i-16">
                      <use href="#ic-record" />
                    </svg>
                    Stop Claude
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="nav-scrim"
          aria-hidden="true"
          ref={scrimRef}
          onClick={() => setNavOpen(false)}
        />
      </div>
    </div>
  );
}
