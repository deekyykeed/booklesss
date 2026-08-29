"use client";

import { useEffect, useRef, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";

/* ------------------------------------------------------------------ *
 * THE REFERENCE UI, VERBATIM.
 *
 * This is `claudeuiclone.html` from the repo root, transcribed into JSX. Class
 * names, structure and every value in the stylesheet are the file's. It is
 * deliberately NOT wired to Booklesss: the owner asked for a replacement rather
 * than an adaptation — "100% the ui, that's where I want to start from" — so
 * the labels still read Projects, Artifacts, Scheduled, Customize, the model
 * button still says Sonnet 5, and the greeting is still the reference's. Those
 * are the starting point, to be replaced deliberately rather than guessed at.
 *
 * TWO THINGS HAVE MOVED OFF IT SINCE (2026-08-29, owner):
 *   · the icons are MynaUI, not the file's hand-drawn 19-symbol sprite. The
 *     swap was free because the grids agree — MynaUI's native 1.5 stroke on a
 *     24 viewBox renders the same 1.25px at 20px that the sprite's 1.25 on a
 *     20 viewBox did. The `.i` / `.i-16` / `.i-12` classes still own the
 *     weight; see the icon block in globals.css for why it is set on the
 *     children rather than on the svg.
 *   · the "Stop Claude" pill is gone. Nothing replaced it.
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
      <div className={"app" + (navOpen ? " nav-open" : "")} ref={appRef}>
        {/* ================= SIDEBAR ================= */}
        <aside className="sidebar" id="cui-sidebar" ref={sideRef}>
          <div className="sb-head">
            {/* The reference's own wordmark style — --font-serif at 20px/500
                with the same negative tracking — carrying our name instead of
                its. The face is deliberately untouched: it is the one place on
                this surface where the serif appears at all, and swapping it
                would change the sidebar's whole voice rather than its word. */}
            <a className="wordmark" href="#">
              Bklsss
            </a>
            <span className="grow" />
            <div className="seg seg-header">
              <button
                className={"seg-item" + (headerSeg === 0 ? " is-active" : "")}
                onClick={() => setHeaderSeg(0)}
              >
                <HugeIcon name="chat-messages" className="i i-16" />
              </button>
              <button
                className={"seg-item" + (headerSeg === 1 ? " is-active" : "")}
                onClick={() => setHeaderSeg(1)}
              >
                <HugeIcon name="code" className="i i-16" />
                <span className="dot" />
              </button>
            </div>
          </div>

          <div className="sb-body">
            <div className="rows">
              <a className="row row-new" href="#">
                <span className="slot">
                  <HugeIcon name="plus" className="i i-16" />
                </span>
                <span className="label">New</span>
                <span className="kbd">Ctrl⇧O</span>
                <button className="icon-btn-sm">
                  <HugeIcon name="edit" className="i i-16" />
                </button>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <HugeIcon name="folder" className="i" />
                </span>
                <span className="label">Projects</span>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <HugeIcon name="component" className="i" />
                </span>
                <span className="label">Artifacts</span>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <HugeIcon name="clock-1" className="i" />
                </span>
                <span className="label">Scheduled</span>
              </a>
              <a className="row" href="#">
                <span className="slot">
                  <HugeIcon name="briefcase" className="i" />
                </span>
                <span className="label">Customize</span>
              </a>
            </div>

            <div className="sec">
              <div className="sec-head">
                <span>Projects</span>
                <HugeIcon name="chevron-right" className="i i-12 caret" />
                <span className="grow" />
                <button className="icon-btn-sm">
                  <HugeIcon name="plus" className="i i-16" />
                </button>
              </div>
              <div className="empty-row">
                <span className="slot">
                  <HugeIcon name="bookmark" className="i" />
                </span>
                <span>Pin projects to keep them here</span>
              </div>
            </div>

            <div className="hairline" style={{ marginTop: 10 }} />

            <div className="sec-head" style={{ marginTop: 10 }}>
              <span>Chats and tasks</span>
              <HugeIcon name="chevron-right" className="i i-12 caret always" />
              <span className="grow" />
              <button className="icon-btn-sm">
                <HugeIcon name="config" className="i i-16" />
              </button>
            </div>
          </div>

          <div className="sb-foot">
            <div className="hairline" />
            <a className="row" href="#">
              <span className="slot">
                <HugeIcon name="paint" className="i" />
              </span>
              <span className="label">Design</span>
            </a>
            <div className="user-row">
              <button className="user-btn">
                <span className="avatar" />
                <span className="user-name">Deeky</span>
                <span className="user-plan">&nbsp;· Pro</span>
                <HugeIcon name="chevron-down" className="i i-12" />
              </button>
              <div className="foot-icons">
                <button className="icon-btn">
                  <HugeIcon name="download" className="i i-16" />
                </button>
                <button className="icon-btn">
                  <HugeIcon name="search" className="i i-16" />
                </button>
                <button className="icon-btn">
                  <HugeIcon name="sidebar" className="i i-16" />
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
              {/* A hamburger, not the panel glyph the reference used here
                  (owner, 2026-08-29). The panel mark is still in the sidebar
                  footer, where it means "this rail" — one mark standing for two
                  different things in two places was the ambiguity worth losing. */}
              <HugeIcon name="menu" className="i" />
            </button>
            <span className="grow" />
            <button className="head-btn" aria-label="Use incognito">
              <HugeIcon name="incognito" className="i" />
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

              </div>
            </div>
          </div>

          {/* ---- THE COMPOSER, PINNED TO THE FOOT OF THE PANE ----
              ⚠️ NOT `position: fixed`, and it did not need to be. `.pane` is
              already a flex column whose middle child is the scroller, so a
              sibling after it sits at the bottom by construction — always
              visible, never overlapping the reading, and correctly inset by the
              sidebar on desktop because it lives inside the pane rather than
              the viewport.

              Fixed would have worked today and been a liability tomorrow: any
              ancestor that later gains a transform, a filter or a
              backdrop-filter silently becomes its containing block and the
              thing rides the scroll. This surface has stayed free of fixed
              positioning on purpose — see the note in globals.css — and a
              bottom-docked composer is exactly the case that usually breaks
              that rule. */}
          <div className="composer-dock">
            <div className="center">
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
                    <HugeIcon name="plus" className="i" />
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
                      <HugeIcon name="microphone" className="i" />
                    </button>
                    <button className="caret" aria-label="Voice input">
                      <HugeIcon name="chevron-down" className="i i-12" />
                    </button>
                  </div>
                </div>
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
