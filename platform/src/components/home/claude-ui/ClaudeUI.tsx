"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { ResourcePacks } from "./ResourcePacks";
import { packsSnapshot } from "@/lib/resource-packs";
import { quickActionsSnapshot } from "@/lib/quick-actions";

/* ------------------------------------------------------------------ *
 * THE REFERENCE UI, VERBATIM.
 *
 * This is `claudeuiclone.html` from `_dev/reference-ui/`, transcribed into JSX. Class
 * names, structure and every value in the stylesheet are the file's. It is
 * deliberately NOT wired to Booklesss: the owner asked for a replacement rather
 * than an adaptation — "100% the ui, that's where I want to start from" — so
 * the labels still read Projects, Artifacts, Scheduled, Customize, the model
 * button still says Sonnet 5, and the greeting is still the reference's. Those
 * are the starting point, to be replaced deliberately rather than guessed at.
 *
 * WHAT HAS MOVED OFF IT SINCE (2026-08-29, owner):
 *   · the icons are Hugeicons Free, not the file's hand-drawn 19-symbol
 *     sprite. They were MynaUI for part of the same day; the reasoning for
 *     the first swap holds for this one — the grids agree, so the `.i` /
 *     `.i-16` / `.i-12` classes still own the weight, and it is set on the
 *     paths rather than on the svg (the sets put stroke-width on each path as
 *     a presentation attribute, which beats an inherited declaration).
 *   · the "Stop Claude" pill is gone. Nothing replaced it.
 *   · the composer takes focus on arrival, and the drawer can be pulled from
 *     anywhere rather than the left edge — both owner requests, both below.
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
  const [navOpen, setNavOpen] = useState(false);

  /* Which resource packs this session explains against. A Set because the
     picker is multi-select and order carries no meaning — the modal renders
     in the packs' own order, not in the order they were ticked, so a student
     re-opening it finds the list where they left it. */
  const [packsOpen, setPacksOpen] = useState(false);
  const [packs, setPacks] = useState<ReadonlySet<string>>(() => new Set());
  const togglePack = useCallback((id: string) => {
    setPacks((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  /* ---- THE BUTTON WEARS WHAT IS SELECTED ----------------------------
   * Owner, 2026-08-29: "the selected pack will actually become the new word
   * there when selected." So the label is not a fixed noun with a number
   * beside it — it is the pack. Nothing selected and it says Resources, which
   * is the invitation; one selected and it says which one, which is the
   * answer.
   *
   * ⚠️ THE NAME COMES FROM THE PACKS' OWN ORDER, NOT THE ORDER THEY WERE
   * TICKED. Ticking a second pack must not relabel the button to the new one
   * — the word would jump to whatever was touched last, which makes a control
   * that is meant to report state look like it is reacting to the click. The
   * modal renders in the same order, so the word always names the row nearest
   * the top of the list.
   *
   * `more` is how many OTHERS, not the total. Beside a name, "+2" reads as
   * "and two more"; a bare "3" beside one name reads as a contradiction. */
  const resLabel = useMemo(() => {
    if (packs.size === 0) {
      return { word: "Resources", more: 0, full: "Resources", aria: "Resources — nothing selected" };
    }
    const chosen = packsSnapshot().filter((p) => packs.has(p.id));
    const names = chosen.map((p) => p.name);
    const full = names.join(", ");
    return {
      word: names[0],
      more: names.length - 1,
      full,
      aria: `Resources — ${full}`,
    };
  }, [packs]);

  const appRef = useRef<HTMLDivElement | null>(null);
  const sideRef = useRef<HTMLElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
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

  /* ---- THE COMPOSER TAKES FOCUS ON ARRIVAL --------------------------
   * Owner, 2026-08-29: "I should just start typing." Landing here with the
   * caret already in the box and nothing to click first is the whole point
   * of the screen — the composer is the only thing on it you can act on.
   *
   * THE DELAY IS DELIBERATE AND IS NOT A GUESS AT PAINT TIME. Focusing on
   * the same frame the page mounts reads as a glitch: the caret is blinking
   * before the greeting has settled, and on a slow phone it lands mid-layout
   * and the box jumps. 450ms is after the surface is visibly still and well
   * before anyone has decided what to type.
   *
   * ⚠️ IT MUST NOT STEAL A FOCUS THE STUDENT ALREADY CHOSE. 450ms is long
   * enough to click the sidebar, open the drawer, or start scrolling, and a
   * caret that yanks itself back mid-action is worse than no autofocus at
   * all. Any pointer, key or touch before the timer fires cancels it.
   *
   * ⚠️ ON iOS THIS PLACES THE CARET BUT DOES NOT RAISE THE KEYBOARD, and no
   * amount of code changes that. Safari opens the keyboard only for a focus
   * that happens inside a real user gesture — the same rule the archived ask
   * box was built around (it kept ONE element across its open so the tap and
   * the focus were the same gesture). A timer is by definition not a gesture.
   * Desktop gets a live caret and typing works; a phone gets the caret and
   * the student still taps once. Do not "fix" this with a fake click.
   */
  useEffect(() => {
    /** After the surface has visibly settled, before anyone starts typing. */
    const SETTLE_MS = 450;

    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };

    /* Capture phase, so a click on the sidebar cancels before its own
       handler runs and regardless of where in the tree it lands. */
    const opts = { capture: true, once: true } as const;
    window.addEventListener("pointerdown", cancel, opts);
    window.addEventListener("keydown", cancel, opts);
    window.addEventListener("touchstart", cancel, opts);
    window.addEventListener("wheel", cancel, opts);

    const t = window.setTimeout(() => {
      /* Re-check rather than trusting the timer: the drawer may have opened,
         and focusing a box behind a scrim is focus nobody can see. */
      if (cancelled || openRef.current) return;
      const el = editorRef.current;
      if (!el || el.contains(document.activeElement)) return;
      el.focus({ preventScroll: true });
    }, SETTLE_MS);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", cancel, opts);
      window.removeEventListener("keydown", cancel, opts);
      window.removeEventListener("touchstart", cancel, opts);
      window.removeEventListener("wheel", cancel, opts);
    };
  }, []);

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

    /* ⚠️ THE PULL STARTS ANYWHERE ON THE PAGE, NOT AT THE EDGE (owner,
     * 2026-08-29: "I should be able to swipe anywhere on the page").
     *
     * It used to require the first touch within 32px of the left edge, on the
     * reasoning that a rightward swipe mid-pane would fight the content under
     * it. In practice there IS no content under it that wants a horizontal
     * drag — the pane is one vertical column — so the gate was rejecting the
     * gesture almost everywhere a thumb naturally lands, and the drawer read
     * as broken rather than as edge-only.
     *
     * What actually needs protecting is narrower than "the whole pane", and
     * it is these two, checked at the point the finger goes down:
     *   · a horizontally scrollable ancestor, which owns its own x-axis;
     *   · the composer, where a touch-drag is how you select text.
     * The axis lock below still guards vertical scrolling everywhere else. */
    const ownsHorizontal = (from: EventTarget | null) => {
      let n = from instanceof Node ? from : null;
      while (n && n !== app) {
        if (n instanceof HTMLElement) {
          if (n === editorRef.current) return true;
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
        /* Whichever axis moved further wins, decided once and not revisited.
           A drawer that grabs a gesture meant as a scroll is worse than one
           that misses the occasional swipe. */
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "y") {
          candidate = false;
          return;
        }
        /* Horizontal, but the wrong way: shut and pulling left, there is
           nothing to reveal. Let it go rather than swallow it — now that a
           pull can start anywhere, claiming every leftward drag on the page
           would eat gestures the pane may want later, and `preventDefault`
           on a drag that paints nothing is a dead spot under the finger. */
        if (!wasOpen && dx < 0) {
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
            {/* ⚠️ THE WORDMARK IS THE ONE PLACE `.cui` REACHES OUT OF ITSELF,
                and it is a deliberate crossing rather than a leak (owner,
                2026-08-29: "where we have the Bklsss logo change that to
                familigen font"). The note here used to argue the opposite —
                that the reference's serif was untouchable because it is the
                only serif on the surface and swapping it changes the
                sidebar's voice. That was right about the voice and wrong
                about whose voice it is: everything else on this page is a
                transcription of somebody else's app, but the NAME is ours,
                and Familjen Grotesk is what our name is set in everywhere
                else it appears — the reader's headings, the OG card, the
                social posters. A brand that wears a borrowed face in the one
                spot the brand is written is the drift, not the fix.

                The face comes in through `--font-brand`, declared in the
                `.cui` token block beside the palette. Nothing else in this
                tree may reach for an app token; this is the exception and it
                has a name so it stays countable.

                The reference's own metrics are kept — 20px/500 with the same
                negative tracking — because it is the word that changed, not
                the slot it sits in. */}
            <a className="wordmark" href="#">
              Bklsss
            </a>
            <span className="grow" />
            {/* The chat/code segmented pair that sat here is GONE (owner,
                2026-08-29: "remove that set of icons on the right side of the
                logo"). It was the reference's own control and it switched
                between two modes this product does not have — a toggle whose
                two positions are identical is a control that can only ever
                mislead. Nothing replaced it: the header is a name and the
                space beside it, which is what the sidebar needed. */}
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
                  <HugeIcon name="pin" className="i" />
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
            {/* ---- FEEDBACK, WHERE THE INCOGNITO HAT WAS ------------
                Owner, 2026-08-29: "switch it for a feedback icon — that will
                later lead to a feedback board with upvotes and all."

                THE BOARD IS NOT BUILT AND THIS BUTTON DOES NOTHING YET, like
                every other control in this transcription. The icon changes
                now because the CORNER changes meaning now: the reference's
                privacy control is one of the labels this surface was always
                going to replace deliberately rather than guess at, and this
                is the owner naming what replaces it.

                ⚠️ WHEN THE BOARD IS BUILT IT READS STUDENTS' POSTS AND THEIR
                VOTES, which is the first real data anything on `/dashboard`
                would touch — so it is the change that puts `RequireAccount`
                and `RequireOnboarding` back on this route. An upvote needs to
                know who is voting or it counts the same person forever. */}
            <button className="head-btn" aria-label="Feedback">
              <HugeIcon name="feedback" className="i" />
            </button>
          </header>

          <div className="pane-scroll">
            <div className="pane-inner">
              <div className="center">
                {/* ---- THE GREETING SITS AT THE TOP NOW ----------------
                    Owner, 2026-08-29: "that greeting will move up into the
                    top, right below the sidebar icon on mobile."

                    It was centred in the pane, vertically and horizontally,
                    which is right for a screen whose only content is a
                    composer — the eye lands in the middle and the box is
                    under it. This screen now has a middle: the quick actions
                    below. A greeting floating between the hamburger and a
                    list of rows belongs to neither, so it goes to the top and
                    left, where it reads as the page's own title and the rows
                    hang off it.

                    ⚠️ THE LEFT EDGE IS SHARED WITH EVERYTHING BELOW IT. The
                    greeting, the quick-action rows and the composer are all
                    in `.center`, so they line up down one column at every
                    width. Centring the greeting alone would put the one
                    element with no box around it out of alignment with the
                    two that have one. */}
                <div className="greeting">
                  <svg className="spark" viewBox="0 0 100 100" aria-hidden="true">
                    <path
                      fill="#d97757"
                      d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
                    />
                  </svg>
                  <span className="txt">Good evening, Deeky</span>
                </div>

                {/* ---- QUICK ACTIONS ----------------------------------
                    Owner, same message: "a few quick actions like getting
                    into a project or into a recent session if it was
                    incomplete."

                    THE COMPOSER IS STILL THE CALL TO ACTION, and these are
                    built not to compete with it. They are ROWS, not cards —
                    pattern 2 from the `.cui` system grown to two lines, the
                    same shape the resource-pack modal took — because a grid
                    of tiles under a greeting reads as the primary thing on
                    the screen, and the primary thing is the box at the
                    bottom. A row is a list item: available, not insistent.

                    ⚠️ THE ROWS ARE PLACEHOLDER DATA THAT DESCRIBES WORK
                    NOBODY DID — see the warning at the top of
                    `lib/quick-actions.ts`. "3 of 4 steps · yesterday" is an
                    assertion about the person reading it, which is a step
                    beyond the packs' invented names. Safe only while this
                    surface is ungated and unrouted; the person putting the
                    auth gates back is the person who has to fix it.

                    They resolve to `#`, like every other link in this
                    transcription. The routing question that BOO-46 holds is
                    unchanged and these do not answer it. */}
                <div className="qa">
                  <div className="qa-head">Pick up where you left off</div>
                  <div className="qa-list">
                    {quickActionsSnapshot().map((a) => (
                      <a className="qa-row" href={a.href} key={a.id}>
                        <span className="qa-slot">
                          <HugeIcon
                            name={a.kind === "session" ? "headphones" : "folder"}
                            className="i"
                          />
                        </span>
                        <span className="qa-text">
                          <span className="qa-title">{a.title}</span>
                          <span className="qa-meta">{a.meta}</span>
                        </span>
                        <HugeIcon name="chevron-right" className="i i-16 qa-go" />
                      </a>
                    ))}
                  </div>
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
            {/* ---- THE SOURCE ROW, ABOVE THE BOX ---------------------
                Owner, 2026-08-29, sending a shot of the Claude Code phone
                app: "add the other plus icon as it is in here and the
                buttons next to it — instead of the github repo I want that
                to be the data pack. add a pdf icon instead and the name of
                the data pack."

                In that app the row says what the conversation is ABOUT
                before you have typed a word: a repository chip sits above
                the box, and the `+` beside it adds another source. This is
                the same row with our own noun in it — a resource pack — and
                the noun is the one this codebase already uses ("was calling
                them resource packs before").

                ⚠️ RESOURCES MOVED OUT OF THE COMPOSER BAR, IT WAS NOT
                DUPLICATED. It was a filled pill inside the white box beside
                the model button; there is exactly one of it and it is here
                now. Two controls picking the same packs is how a student
                learns that one of them is lying.

                Which changes its dress, because the surface under it
                changed. In the box it took `--track`, the groove that means
                "a control sits here" on white. Out here it sits on
                `--page-bg` with nothing behind it, and a groove-coloured
                pill on an off-white page has no edge at all — so it takes
                `--surface-3` and a hairline, which is the same lifted-panel
                grammar the composer under it uses. Nothing new enters the
                palette.

                The `+` opens the same picker the chip does. That is the
                reference's own arrangement and it is honest here: the chip
                reports what is chosen, the `+` is the invitation to choose
                more, and a student who taps either gets the list. */}
            <div className="src-row">
              <button
                className="src-add"
                onClick={() => setPacksOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={packsOpen}
                aria-label="Add a resource pack"
              >
                <HugeIcon name="plus" className="i i-16" />
              </button>
              <button
                className={"res-btn" + (packs.size ? " is-on" : "")}
                onClick={() => setPacksOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={packsOpen}
                aria-label={resLabel.aria}
                title={packs.size > 1 ? resLabel.full : undefined}
              >
                <HugeIcon name="pdf" className="i i-16" />
                <span className="res-label">{resLabel.word}</span>
                {resLabel.more > 0 && (
                  <span className="res-count">+{resLabel.more}</span>
                )}
              </button>
            </div>
            <div className="composer">
              <div
                ref={editorRef}
                className="editor"
                contentEditable
                suppressContentEditableWarning
                data-placeholder="How can I help you today?"
              />

              <div className="bar">
                <div className="bar-left">
                  {/* The in-box `+` stays — it is attachments and connectors,
                      which is a different job from the source row's `+` above
                      (that one names what the whole conversation reads from;
                      this one adds a file to the message being typed). Both
                      are in the owner's reference shot for the same reason. */}
                  <button className="cbtn" aria-label="Add files, connectors">
                    <HugeIcon name="plus" className="i" />
                  </button>
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

        {/* ⚠️ INSIDE `.app`, NOT INSIDE THE PANE. `.rp-scrim` is
            `position: absolute` against `.app` for the same reason the drawer
            is: `.pane-scroll` is a scroller, and a modal parented to a
            scroller rides the page. Same trap the ask box paid for. */}
        <ResourcePacks
          open={packsOpen}
          selected={packs}
          onToggle={togglePack}
          onClose={() => setPacksOpen(false)}
        />
      </div>
    </div>
  );
}
