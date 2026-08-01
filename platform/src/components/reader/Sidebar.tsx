"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileNav } from "./MobileNav";
import {
  COURSE,
  DEFAULT_LESSON,
  ancestorsOf,
  courseIndex,
  depthOf,
  nodeById,
  pathForId,
  lessonIdForSlug,
  type NavNode,
} from "@/lib/course";
import { useFollow } from "./useFollow";
import { courseForNode } from "@/lib/courses";
import { useProgress } from "@/lib/progress";
import { CompletionRing } from "./CompletionRing";
import { MynaIcon } from "@/components/icons/myna";
import { MingcuteIcon } from "@/components/icons/mingcute";

const STEP = 18;
const RAIL = 2;
const BAR = 3;
const BAR_H = 16;
const ROW_H = 32; // 4px padding x2 + 2px border x2 + 20px line-height
/* Inset the rail by exactly the bar's offset inside a row, so the bar sits
 * flush with the rail's end when the first or last item is active. */
const RAIL_INSET = (ROW_H - BAR_H) / 2;

/* Clear space on BOTH sides of the bar: sidebar edge → bar, and bar → text.
 * The rail is centred on the bar, so moving one moves the other. */
const GUTTER = 15.5;
const ROOT_PAD = 8; // top-level rows sit outside any rail
const ROW_BORDER = 2; // .step is border-box, so its border adds to the indent

/** x of the bar's left edge for rows nested under a folder at `depth`. */
const barLeftFor = (depth: number) => GUTTER + depth * STEP;
/** Text indent for a row at `depth`, net of the border. */
const padFor = (depth: number) =>
  depth === 0 ? ROOT_PAD : GUTTER + BAR + GUTTER + (depth - 1) * STEP - ROW_BORDER;

const SIDEBAR_MIN = 200;
const SIDEBAR_CEILING = 560; // hard safety cap; the real max is measured
const SIDEBAR_DEFAULT = 265;
const SIDEBAR_KEY = "booklesss:sidebar-w";

const clampW = (w: number, max: number) => Math.min(max, Math.max(SIDEBAR_MIN, w));

/* Widest a row would need to show its label untruncated: its indent, the
 * label's full (unclipped) text width, any chevron, plus the nav's padding.
 * Dragging past this only adds dead space. */
function measureNaturalWidth(list: HTMLElement | null): number | null {
  if (!list) return null;
  const rows = list.querySelectorAll<HTMLElement>("a.step, button.step");
  if (!rows.length) return null;
  let widest = 0;
  const range = document.createRange();
  rows.forEach((row) => {
    const label = row.querySelector<HTMLElement>("span");
    if (!label) return;
    const cs = getComputedStyle(row);
    const chevron = row.querySelector("svg");
    const extra = chevron ? chevron.getBoundingClientRect().width + (parseFloat(cs.gap) || 0) : 0;
    // Measure the text itself, not the element. The label is a flex child, so
    // once the sidebar is wider than the text its scrollWidth reports the
    // stretched box — which would ratchet the cap up and never let it shrink.
    range.selectNodeContents(label);
    const textW = range.getBoundingClientRect().width || label.scrollWidth;
    widest = Math.max(
      widest,
      parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(cs.borderLeftWidth) +
        parseFloat(cs.borderRightWidth) +
        textW +
        extra,
    );
  });
  const nav = list.parentElement;
  const navPad = nav
    ? parseFloat(getComputedStyle(nav).paddingLeft) + parseFloat(getComputedStyle(nav).paddingRight)
    : 16;
  return Math.min(SIDEBAR_CEILING, Math.ceil(widest + navPad));
}

/* The sidebar and the content's left padding both read --sidebar-docs, so
 * writing that one variable resizes both in lockstep. Written straight to
 * the DOM during a drag — re-rendering the tree on every pointermove would
 * drop frames. */
const applyWidth = (w: number) =>
  document.documentElement.style.setProperty("--sidebar-docs", `${w}px`);

/* Flags the drag affordance on :root. The content surface reads it and darkens
 * its own left border, so hovering the handle highlights the edge that is
 * actually being moved instead of drawing a separate line beside it. */
const setResizeHint = (on: boolean) =>
  document.documentElement.toggleAttribute("data-resize-hint", on);

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIso = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/* One glyph, rotated rather than swapped for a second one, so the arrow turns
 * as the group opens instead of cutting to a different mark.
 *
 * Mingcute rather than MynaUI — the owner's pick for this one caret (the set's
 * "Down Small Line", which rotated is its "Right Small Line"). It is a much
 * smaller mark inside the same 24-grid than MynaUI's chevron: 5.7 units across
 * where MynaUI's is 12. Hence the larger box and the lighter stroke — 22px at
 * 1.5 keeps the drawn glyph legible and its weight in step with the MynaUI
 * icons it sits beside, which would otherwise read as two different sets. */
function Chevron({ open, active }: { open: boolean; active?: boolean }) {
  return (
    <MingcuteIcon
      name="down-small-line"
      size={22}
      strokeWidth={1.5}
      className={
        "shrink-0 transition-transform duration-200 " +
        (active ? "text-ink " : "step-dim ") +
        (open ? "" : "-rotate-90")
      }
    />
  );
}
function PanelIcon() {
  return <MynaIcon name="sidebar" size={18} />;
}

/* Measured-height expand/collapse — animates from 0 to the content's real
 * height and back, so nested lists slide down smoothly instead of popping. */
function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(open ? "auto" : 0);
  const mounted = useRef(false);

  useIso(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const el = inner.current;
    if (!el) return;
    let raf1 = 0;
    let raf2 = 0;
    let timer = 0;
    if (open) {
      // paint the 0 state first, then grow next frame so the transition fires
      setHeight(0);
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          if (inner.current) setHeight(inner.current.scrollHeight);
        });
      });
      // Must outlast the 260ms transition, or it snaps to auto mid-animation.
      timer = window.setTimeout(() => setHeight("auto"), 300);
    } else {
      // pin the current pixel height, then collapse to 0 next frame
      setHeight(el.scrollHeight);
      raf1 = window.requestAnimationFrame(() => setHeight(0));
    }
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(timer);
    };
  }, [open]);

  return (
    <div
      data-open={open ? "true" : "false"}
      inert={open ? undefined : true}
      style={{
        height: height === "auto" ? "auto" : `${height}px`,
        overflow: "hidden",
        transition: "height 260ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}

type Ctx = {
  openIds: Set<string>;
  activeId: string;
  /** Every folder on the path to the active lesson. */
  activeAncestors: Set<string>;
  activeRef: RefObject<HTMLAnchorElement | null>;
  toggle: (id: string) => void;
  /** Fired when a leaf step is picked — moves the selector and closes the drawer. */
  onSelect: (id: string) => void;
};

/* Solar · Line · "Widget" — the four-panel grid, i.e. the dashboard glyph.
 * Inlined rather than resolved through <Icon>, which would pull the whole
 * the same glyph the home rail marks Dashboard with, so the way out of a course
 * looks the same from either side. */
function DashboardGlyph() {
  return <MynaIcon name="layout-dashboard" size={17} className="shrink-0" />;
}

/* Per-step completion, at the end of its row. Always rendered so the row width
 * never shifts mid-read, but dimmed right down until the step is actually
 * under way — 28 bright empty rings would be pure noise. */
function StepRing({ lessonId }: { lessonId: string }) {
  const { hydrated, ratio } = useProgress();
  const v = hydrated ? ratio(lessonId) : 0;
  return (
    <CompletionRing
      value={v}
      size={14}
      stroke={1.75}
      className="transition-opacity duration-200"
      style={{ opacity: v > 0 ? 1 : 0.4 }}
    />
  );
}

// Module-level (stable identity) so toggling never remounts the tree.
function Row({ node, depth, ctx }: { node: NavNode; depth: number; ctx: Ctx }) {
  const pad = padFor(depth);

  if (node.children?.length) {
    const open = ctx.openIds.has(node.id);
    // Collapsed away, the card and bar are hidden — so the folder itself
    // carries the active state instead.
    const holdsActive = !open && ctx.activeAncestors.has(node.id);
    return (
      <div>
        <button
          type="button"
          onClick={() => ctx.toggle(node.id)}
          style={{ paddingLeft: pad }}
          className={
            "step relative z-[2] text-left text-sm transition-colors " +
            (holdsActive ? "font-semibold text-ink" : "font-semibold step-dim hover:text-ink")
          }
          aria-expanded={open}
        >
          <span className="min-w-0 flex-1 truncate">{node.label}</span>
          <Chevron open={open} active={holdsActive} />
        </button>

        <Collapse open={open}>
          <div className="relative">
            {/* z-0: the bottom of the stack — the selected card paints over
                it, so the rail appears to pass behind the button. */}
            <span
              className="rail pointer-events-none absolute z-0 rounded-full"
              style={{
                left: barLeftFor(depth) + (BAR - RAIL) / 2,
                width: RAIL,
                top: RAIL_INSET,
                bottom: RAIL_INSET,
              }}
            />
            {node.children.map((c) => (
              <Row key={c.id} node={c} depth={depth + 1} ctx={ctx} />
            ))}
          </div>
        </Collapse>
      </div>
    );
  }

  const active = ctx.activeId === node.id;
  return (
    <Link
      href={pathForId(node.id)}
      ref={active ? ctx.activeRef : undefined}
      onClick={() => ctx.onSelect(node.id)}
      style={{ paddingLeft: pad }}
      className={
        "step relative z-[2] text-left text-sm font-semibold transition-colors " +
        (active ? "text-ink" : "step-dim hover:text-ink")
      }
    >
      <span className="min-w-0 flex-1 truncate">{node.label}</span>
      <StepRing lessonId={node.id} />
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const routeActive = useMemo(() => {
    if (!pathname || pathname === "/") return DEFAULT_LESSON;
    const seg = pathname.replace(/^\/+/, "").split("/");
    return lessonIdForSlug(seg) ?? DEFAULT_LESSON;
  }, [pathname]);

  /* Optimistic selection. The selector is normally driven by the route, so it
   * can't move until navigation commits — a visible lag on tap. Instead, a tap
   * sets pendingActive immediately and the indicator animates on its own clock
   * while the page switches behind it. Cleared once the route catches up, so
   * back/forward (which change the path with no tap) still drive the selector. */
  const [pendingActive, setPendingActive] = useState<string | null>(null);
  const activeId = pendingActive ?? routeActive;
  useEffect(() => {
    if (pendingActive && routeActive === pendingActive) setPendingActive(null);
  }, [routeActive, pendingActive]);

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>(courseIndex().defaultOpen);
    for (const a of ancestorsOf(activeId)) s.add(a);
    return s;
  });

  useEffect(() => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      for (const a of ancestorsOf(activeId)) next.add(a);
      return next;
    });
  }, [activeId]);

  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const m = useFollow([activeId, openIds], () => ({ container: listRef.current, active: activeRef.current }));
  const barH = BAR_H;

  // Slide the bar within a folder; fade it in when the folder (parent) changes.
  // Decide this ONCE per lesson change and hold it stable — useFollow re-renders
  // several times while it settles the position over its ~360ms measure window,
  // and if sameGroup were recomputed each render it would flip back on and let
  // the bar slide across into the new section.
  const parentId = ancestorsOf(activeId)[0] ?? "root";
  const nav = useRef({ activeId, parentId, sameGroup: true });
  if (nav.current.activeId !== activeId) {
    nav.current = { activeId, parentId, sameGroup: nav.current.parentId === parentId };
  }
  const sameGroup = nav.current.sameGroup;

  /* While a folder expands/collapses the active row is physically moving, and
   * useFollow re-measures it every frame. A `top` transition would re-target on
   * each of those frames and sit ~220ms behind — which reads as the card and
   * bar waiting for the folder to finish, then catching up. Dropping the
   * transition for the duration lets them ride the row frame-by-frame instead.
   * Step selection still slides, because only toggle() sets this. */
  const [snapping, setSnapping] = useState(false);
  const snapTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(snapTimer.current), []);

  const draggingRef = useRef(false);
  const cardRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  /* Zero-latency tracking while a folder animates. Routing the position through
   * React state (rAF -> setState -> render -> DOM) is inherently at least one
   * frame behind the row, which is the residual lag you can still see. Here the
   * rAF loop writes `top` straight to the DOM instead, so the selector is
   * painted on the very same frame as the row it is following.
   *
   * `important` is what lets this win: React keeps writing its own (one frame
   * stale) `top` on every re-render, and a plain inline write could lose that
   * race depending on commit order. */
  useEffect(() => {
    if (!snapping) return;
    let raf = 0;
    const write = () => {
      const container = listRef.current;
      const active = activeRef.current;
      if (container && active) {
        const er = active.getBoundingClientRect();
        const br = container.getBoundingClientRect();
        const top = er.top - br.top;
        cardRef.current?.style.setProperty("top", `${top}px`, "important");
        barRef.current?.style.setProperty("top", `${top + (er.height - BAR_H) / 2}px`, "important");
      }
      raf = requestAnimationFrame(write);
    };
    raf = requestAnimationFrame(write);
    return () => {
      cancelAnimationFrame(raf);
      // Hand back to React, but leave the settled value in place: React only
      // touches style.top when its own value changed, so simply dropping the
      // override could leave the element with no top at all.
      const container = listRef.current;
      const active = activeRef.current;
      cardRef.current?.style.removeProperty("top");
      barRef.current?.style.removeProperty("top");
      if (container && active) {
        const er = active.getBoundingClientRect();
        const br = container.getBoundingClientRect();
        const top = er.top - br.top;
        if (cardRef.current) cardRef.current.style.top = `${top}px`;
        if (barRef.current) barRef.current.style.top = `${top + (er.height - BAR_H) / 2}px`;
      }
    };
  }, [snapping]);

  const toggle = (id: string) => {
    setSnapping(true);
    window.clearTimeout(snapTimer.current);
    // Outlast the 260ms collapse.
    snapTimer.current = window.setTimeout(() => setSnapping(false), 320);
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* Picking a step closes the mobile drawer — but only after a beat, so the
   * selector finishes sliding to the new step before the view slides back to
   * the content. No-op on desktop, where the drawer isn't a thing. */
  const { close: closeMobileNav, leftCollapsed, toggleLeftCollapsed } = useMobileNav();
  const onSelect = useCallback(
    (id: string) => {
      setPendingActive(id); // move the selector now, not when the route commits
      if (window.matchMedia("(max-width: 767px)").matches) {
        // Let the selector finish sliding before the drawer slides back.
        window.setTimeout(closeMobileNav, 280);
      }
    },
    [closeMobileNav],
  );

  /* One course at a time. course-data.json is a single flat tree spanning every
   * course, so without this the rail lists Corporate Finance's units beneath
   * Economics' — a student reading one course has no use for another's steps.
   * Falls back to the whole tree if no course claims the node, which is better
   * than an empty rail.
   *
   * `displayUnitIds`, not `unitIds`: a course authored under a folder named
   * after itself is listed by that folder's children instead, so the top of the
   * rail is the first real unit rather than the course name a student has
   * already chosen. See lib/courses.ts. */
  const course = useMemo(() => courseForNode(activeId), [activeId]);
  const units = useMemo(() => {
    if (!course) return COURSE;
    const byId = course.displayUnitIds
      .map((id) => nodeById(id))
      .filter((n): n is NavNode => n !== null);
    return byId.length ? byId : COURSE;
  }, [course]);

  /* The active bar sits in the rail of the folder holding the active row, so
   * its x comes from the row's depth AS DRAWN — tree depth less whatever the
   * unwrapping hid. Miss the offset and every step in a wrapped course draws
   * its bar one indent right of the rail it belongs to. */
  const barX = barLeftFor(depthOf(activeId) - 1 - (course?.unitDepthOffset ?? 0));

  const activeAncestors = useMemo(() => new Set(ancestorsOf(activeId)), [activeId]);
  const ctx: Ctx = { openIds, activeId, activeAncestors, activeRef, toggle, onSelect };

  /* ---------------- resize ---------------- */
  const widthRef = useRef(SIDEBAR_DEFAULT);
  const [width, setWidth] = useState(SIDEBAR_DEFAULT); // mirrors the ref for aria only
  const [maxW, setMaxW] = useState(SIDEBAR_CEILING);
  const maxRef = useRef(SIDEBAR_CEILING);

  // Restore before paint so a customised width doesn't flash at the default.
  useIso(() => {
    let saved = NaN;
    try { saved = Number(localStorage.getItem(SIDEBAR_KEY)); } catch { /* private mode */ }
    if (!Number.isFinite(saved) || saved <= 0) return;
    const w = clampW(saved, maxRef.current);
    widthRef.current = w;
    applyWidth(w);
    setWidth(w);
  }, []);

  /* Cap the drag at the longest label. The nav is data-driven, so this is
   * re-measured whenever rows or their text change rather than once on mount.
   * Also waits for fonts, since text width depends on the real face rather
   * than the fallback. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let cancelled = false;
    let raf = 0;

    const apply = () => {
      const natural = measureNaturalWidth(listRef.current);
      if (cancelled || !natural) return;
      const cap = Math.max(SIDEBAR_MIN, natural);
      if (cap === maxRef.current) return; // no churn when nothing changed
      maxRef.current = cap;
      setMaxW(cap);
      if (widthRef.current > cap) {
        widthRef.current = cap;
        applyWidth(cap);
        setWidth(cap);
        try { localStorage.setItem(SIDEBAR_KEY, String(cap)); } catch { /* ignore */ }
      }
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    if (document.fonts?.ready) document.fonts.ready.then(schedule).catch(schedule);
    else schedule();

    // Rows added/removed or a label's text edited -> re-measure. Attributes are
    // deliberately not watched, so expand/collapse doesn't retrigger this.
    const mo = new MutationObserver(schedule);
    mo.observe(list, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  const commit = (w: number) => {
    widthRef.current = w;
    applyWidth(w);
    setWidth(w);
    try { localStorage.setItem(SIDEBAR_KEY, String(w)); } catch { /* ignore */ }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = widthRef.current;

    // Hold the resize cursor for the whole gesture, even when the pointer
    // outruns the 8px handle, and stop the drag selecting nav text.
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    draggingRef.current = true;
    setResizeHint(true);

    const move = (ev: PointerEvent) => {
      const w = clampW(startW + ev.clientX - startX, maxRef.current);
      widthRef.current = w;
      applyWidth(w);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
      draggingRef.current = false;
      // Keep it lit if the pointer is still resting on the handle.
      setResizeHint(!!e.currentTarget && (e.currentTarget as HTMLElement).matches(":hover"));
      commit(widthRef.current);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 24 : 8;
    if (e.key === "ArrowLeft") commit(clampW(widthRef.current - step, maxRef.current));
    else if (e.key === "ArrowRight") commit(clampW(widthRef.current + step, maxRef.current));
    else if (e.key === "Home") commit(clampW(SIDEBAR_DEFAULT, maxRef.current));
    else return;
    e.preventDefault();
  };

  return (
    <>
      {/* Reopen affordance — only when collapsed, desktop only (mobile uses the
          drawer). Pinned to the left edge just below the header. */}
      {leftCollapsed && (
        <button
          type="button"
          onClick={toggleLeftCollapsed}
          aria-label="Open navigation"
          title="Open navigation"
          className="squircle fixed top-16 z-40 hidden h-8 w-8 place-items-center rounded-lg border border-line bg-white/80 text-muted shadow-sm backdrop-blur-md transition-colors hover:text-ink md:grid"
          style={{ left: 12 }}
        >
          <PanelIcon />
        </button>
      )}
    <aside
      className="sidebar-panel fixed left-0 top-12 z-40 flex h-[calc(100dvh-48px)] flex-col border-r border-line"
      style={{ width: "var(--sidebar-docs)" }}
    >
      {/* Drag to resize. Sits over the right border, 8px wide for an easy
          grab; double-click restores the default width. */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        aria-valuenow={width}
        aria-valuemin={SIDEBAR_MIN}
        aria-valuemax={maxW}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onKeyDown={onHandleKeyDown}
        onDoubleClick={() => commit(clampW(SIDEBAR_DEFAULT, maxRef.current))}
        title="Drag to resize. Double-click to reset"
        onPointerEnter={() => setResizeHint(true)}
        onPointerLeave={() => { if (!draggingRef.current) setResizeHint(false); }}
        onFocus={() => setResizeHint(true)}
        onBlur={() => setResizeHint(false)}
        className="absolute inset-y-0 -right-1 z-30 hidden w-2 cursor-col-resize focus:outline-none md:block"
      />

      {/* Way out of the course, above the step tree — the dashboard is a level
          up from whatever step they're reading. */}
      <div className="p-2 pb-0">
        <Link href="/" onClick={() => closeMobileNav()} className="home-nav squircle">
          <DashboardGlyph />
          <span className="min-w-0 flex-1 truncate">Dashboard</span>
        </Link>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto p-2">
        <div ref={listRef} className="relative flex flex-col gap-0.5">
          {/* Selected-step card. Rides the same measurement and the same
              slide-within-folder / fade-across-folder rule as the bar, so the
              two move together. Layering, bottom to top: rail (z-0), this
              card (z-1), row text (z-2), active bar (z-10) — so the card
              hides the rail while the bar still reads as inside it. */}
          {m.visible && (
            <span
              key={"card-" + parentId}
              ref={cardRef}
              className="step step-selector pointer-events-none absolute"
              style={{
                left: 0,
                top: m.top,
                height: m.height,
                zIndex: 1,
                transition: snapping || !sameGroup ? "none" : "top 220ms cubic-bezier(0.4, 0, 0.2, 1), height 160ms ease",
                animation: "indFade 220ms ease",
              }}
            />
          )}
          {m.visible && (
            <span
              key={parentId}
              ref={barRef}
              className="step-bar pointer-events-none absolute z-10"
              style={{
                left: barX,
                width: BAR,
                top: m.top + (m.height - barH) / 2,
                height: barH,
                transition: snapping || !sameGroup ? "none" : "top 220ms cubic-bezier(0.4, 0, 0.2, 1), height 160ms ease",
                animation: "indFade 220ms ease",
              }}
            />
          )}
          {units.map((n) => (
            <Row key={n.id} node={n} depth={0} ctx={ctx} />
          ))}
        </div>
      </nav>
      <div className="p-2">
        <button
          type="button"
          onClick={toggleLeftCollapsed}
          aria-label="Collapse sidebar"
          title="Collapse"
          className="squircle hidden h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-active hover:text-ink md:grid"
        >
          <PanelIcon />
        </button>
      </div>
    </aside>
    </>
  );
}
