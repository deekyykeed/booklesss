"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { OTHER_PROGRAMME, normTitle } from "@/lib/curriculum-text";
import { useIdentity } from "@/lib/identity";
import { applyOrder, saveCourseOrder, useCourseOrder } from "@/lib/course-order";
import { pendingCourses, programmeBySlug } from "@/lib/programmes";
import type { CourseMeta } from "@/lib/courses";
import type { StudyDay } from "@/lib/progress";
import { MynaIcon } from "@/components/icons/myna";
import { CourseCard } from "./CourseCard";
import { PipelineCard } from "./PipelineCard";
import { courseTone } from "./tones";

/* ------------------------------------------------------------------ *
 * "My courses" — three states of the same list, not three different lists.
 *
 * Owner, 2026-08-07: "for the part with the list of courses id like a tab
 * system for the courses active, pipeline and completed at the end spaced
 * between for the first two" — then, reordering: "id like the ability to
 * organise my courses manually so i cn drag them above and below each other."
 *
 * ALL THREE TABS SIT TOGETHER NOW (owner, 2026-08-08: "even the completed
 * courses will move to fit with the rest of the tabs and on that end is where
 * ill have sort icons"). The original call had Completed standing apart on the
 * right as a look-back rather than a choice; the far end is now spoken for by
 * sorting, so the row is one group of three plus a trailing sort control.
 *
 * THE UNDERLINE WON (owner, 2026-08-08, off the deploy). Two markers ran live
 * the same day — a white chip borrowed whole from the step selector, and this
 * underline — and the owner picked the underline within the hour. The chip
 * variant lives in git ("The course tabs try on both answers at once") if the
 * question ever reopens; do not park a second copy here.
 *
 * ONE ORDER, applying to both Active and Completed — see lib/course-order for
 * why it isn't threaded through the account. Only Active exposes the drag
 * itself: it's the tab a student is actually choosing from, and Completed
 * courses have nothing left to decide between.
 * ------------------------------------------------------------------ */

type Tab = "active" | "pipeline" | "completed";

/** Left to right, which is both the tab order and the swipe order — swiping
 *  the panel leftwards moves to the next one along, the way a carousel does.
 *  One array so the row, the animation's direction and the gesture can never
 *  disagree about which tab is "next". */
const TABS: Tab[] = ["active", "pipeline", "completed"];

/** How far a finger must travel before it counts as a swipe rather than a
 *  tap that wandered. 56px is about a thumb's width — comfortably past the
 *  8px that starts a card drag, so the two gestures never mean the same
 *  movement. */
const SWIPE_PX = 56;

type WithProgress = {
  course: CourseMeta;
  cDone: number;
  cSteps: number;
  next: string;
  completed: boolean;
};

export function CoursesSection({
  mine,
  hydrated,
  doneCount,
  isComplete,
  days,
}: {
  mine: CourseMeta[];
  hydrated: boolean;
  doneCount: (id: string) => number;
  isComplete: (id: string) => boolean;
  days: Record<string, StudyDay>;
}) {
  const { identity } = useIdentity();
  const order = useCourseOrder();
  const [tab, setTab] = useState<Tab>("active");
  /* Which way the incoming panel should come from. Held rather than derived,
     because by the time the new panel renders the old tab is gone — the
     direction is a fact about the TRANSITION, and nothing in the new state
     remembers it. */
  const [dir, setDir] = useState<"left" | "right">("left");

  /** Move to `next`, working out which way that is so the panel slides the
   *  way the reader's eye is already travelling. Later in the row → the panel
   *  comes in from the right; earlier → from the left. */
  function goTab(next: Tab) {
    if (next === tab) return;
    setDir(TABS.indexOf(next) > TABS.indexOf(tab) ? "left" : "right");
    setTab(next);
  }

  /** One step along the row, or nothing at the ends. No wrapping: a carousel
   *  that loops from Completed back to Active makes the row's left-to-right
   *  order a lie, and there is no third state for a reader to be surprised
   *  into — they either move or they are already at the end. */
  function stepTab(by: 1 | -1) {
    const next = TABS[TABS.indexOf(tab) + by];
    if (next) goTab(next);
  }

  /* THE SWIPE. Tracked on refs rather than state — a touchmove fires dozens
     of times per gesture and re-rendering a grid of course cards on each one
     is how a swipe turns into a stutter. Nothing here needs to be rendered
     until the gesture is over. */
  const touch = useRef<{ x: number; y: number; live: boolean } | null>(null);
  /* A card being dragged is also a finger moving sideways. Without this the
     same movement would reorder a card AND change tab, and the reader would
     land on a different panel than the one they just rearranged. */
  const dragging = useRef(false);

  const withProgress = useMemo<WithProgress[]>(
    () =>
      mine.map((c) => {
        const cDone = hydrated ? c.lessonIds.reduce((n, id) => n + doneCount(id), 0) : 0;
        const cSteps = hydrated ? c.lessonIds.filter((id) => isComplete(id)).length : 0;
        const unfinished = c.lessonIds.filter((id) => !hydrated || !isComplete(id));
        const next = unfinished.find((id) => hydrated && doneCount(id) > 0) ?? unfinished[0] ?? c.lessonIds[0];
        return {
          course: c,
          cDone,
          cSteps,
          next,
          // Only once the store has hydrated — before that, "0 of N done" is
          // not yet known to be true, and a fresh visit must not flash every
          // card into Completed for one frame.
          completed: hydrated && c.totalCheckpoints > 0 && cDone >= c.totalCheckpoints,
        };
      }),
    [mine, hydrated, doneCount, isComplete],
  );

  const activeList = useMemo(() => withProgress.filter((w) => !w.completed), [withProgress]);
  const completedList = useMemo(() => withProgress.filter((w) => w.completed), [withProgress]);

  const orderedActive = useMemo(
    () => applyOrder(activeList, order, (w) => w.course.slug),
    [activeList, order],
  );
  const orderedCompleted = useMemo(
    () => applyOrder(completedList, order, (w) => w.course.slug),
    [completedList, order],
  );

  /* ---- the pipeline: what's on their timetable that nobody's written ---- */
  const prog = programmeBySlug(identity?.school, identity?.programme);
  const scraped = useMemo(
    () => (identity ? pendingCourses(prog, identity.curriculum) : []),
    [prog, identity],
  );
  /* A student whose programme is off our map typed their courses instead —
   * every one of those is pending, since nothing built exists behind a title
   * nobody has scraped. */
  const typed = prog ? [] : (identity?.typedCourses ?? []);

  /* The real demand signal — see PipelineCard for why this replaced a date.
   * One fetch for the whole programme+year, same route onboarding already
   * calls to suggest courses, matched here instead of offered as a typeahead.
   * Progressive enhancement: every failure leaves the card on its honest
   * fallback line, never a blocked render. */
  const [suggested, setSuggested] = useState<{ title: string; students: number }[]>([]);
  const programmeKey = (
    identity?.programme === OTHER_PROGRAMME ? identity?.programmeName : identity?.programme
  )?.trim();
  useEffect(() => {
    if (!programmeKey) return;
    const p = new URLSearchParams({ university: identity?.school ?? "", programme: programmeKey });
    if (identity?.year) p.set("year", String(identity.year));
    let live = true;
    fetch("/api/curriculum?" + p)
      .then((r) => (r.ok ? r.json() : { suggested: [] }))
      .then((j) => live && setSuggested(Array.isArray(j.suggested) ? j.suggested : []))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [programmeKey, identity?.school, identity?.year]);

  /* Typed courses are counted by `student_courses`, and this student's own
   * entry is IN that count — subtract the one vote we already know is theirs
   * so the card reads "others", which is what it says. Scraped picks are
   * never written to `student_courses` (that table is typed titles only), so
   * nothing to subtract there: any count on a scraped course is entirely
   * other students'. */
  function demandFor(title: string, ownVote: boolean): number | null {
    const hit = suggested.find((s) => normTitle(s.title) === normTitle(title));
    if (!hit) return programmeKey ? 0 : null;
    return Math.max(0, hit.students - (ownVote ? 1 : 0));
  }

  const pipelineTotal = scraped.length + typed.length;

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = orderedActive.findIndex((w) => w.course.slug === active.id);
    const to = orderedActive.findIndex((w) => w.course.slug === over.id);
    if (from === -1 || to === -1) return;
    const reordered = arrayMove(orderedActive, from, to);
    /* The full order this drag implies: the new Active sequence, then
     * whatever's already Completed, in ITS current order — a drag inside
     * Active must never silently reshuffle courses that aren't even on
     * screen right now. */
    saveCourseOrder([...reordered, ...orderedCompleted].map((w) => w.course.slug));
  }

  /* Passive listeners, so the browser never waits on this to decide whether
     the page scrolls. That is also why a vertical-looking gesture is
     abandoned rather than prevented: `preventDefault` is unavailable here by
     design, so the only correct move is to get out of the way. */
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      if (dragging.current || e.touches.length !== 1) {
        touch.current = null;
        return;
      }
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, live: true };
    },
    onTouchMove: (e: React.TouchEvent) => {
      const t = touch.current;
      if (!t?.live || dragging.current) return;
      const dx = e.touches[0].clientX - t.x;
      const dy = e.touches[0].clientY - t.y;
      /* Vertical wins ties, and deliberately: this panel is most of a
         scrolling page, so a gesture that is even slightly more up-and-down
         than sideways is somebody scrolling past the courses, not switching
         tabs. Stealing those would make the section feel like it grabs. */
      if (Math.abs(dy) > Math.abs(dx)) t.live = false;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const t = touch.current;
      touch.current = null;
      if (!t?.live || dragging.current) return;
      const dx = e.changedTouches[0].clientX - t.x;
      if (Math.abs(dx) < SWIPE_PX) return;
      // Dragging the content leftwards reveals what is to its right.
      stepTab(dx < 0 ? 1 : -1);
    },
    onTouchCancel: () => {
      touch.current = null;
    },
  };

  /* MOUSE AND TOUCH SEPARATELY, NOT PointerSensor (owner, 2026-08-07: "when i
     try to swipe it triggers the drag, i need to hold to drag").
     PointerSensor handles both input types through one constraint, and a
     browser fires pointer events for touch as well — so `distance: 8` meant a
     finger that moved 8px started a drag INSTANTLY, before TouchSensor's hold
     had any say. Every swipe was a drag; the TouchSensor beside it never got
     a look in. They cannot be reconciled in one sensor because the two inputs
     want opposite things: a mouse should drag the moment it moves (there is
     no other gesture it could be), and a finger must not (it could be a
     swipe or a scroll). So each gets its own.

     250ms rather than 150: this is now the ONLY thing standing between a
     swipe and a drag, so it has to be long enough to read as a deliberate
     press. `tolerance: 8` is the other half — moving more than 8px before
     the delay elapses cancels the pending drag outright, which is what lets
     a fast swipe through untouched. */
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <>
      {/* NO HEADING AND NO "CHANGE" (owner, 2026-08-07: "remove that mycourses
          and the change form the app"). The heading said "My courses" over a
          row of course cards, which is the one thing a row of course cards
          cannot be mistaken for; the tabs under it already name what is being
          shown, more precisely than the heading did. "Change" opened the
          settings sheet on its courses row — still reachable there, and the
          sheet is where every other answer is edited, so this was a second
          door onto one screen rather than the only door.

          All three tabs grouped left now, sort at the far end — see the file
          note on the 2026-08-08 regrouping and the marker the owner picked.

          NO RULE UNDER THE ROW (same call: "dont need the divider below the
          tabs"). It was drawing a line between the tabs and the cards they
          filter, which is the one place a border says these are two separate
          things. */}
      <TabRow
        tab={tab}
        goTab={goTab}
        counts={{ active: orderedActive.length, pipeline: pipelineTotal, completed: orderedCompleted.length }}
      />

      {/* `key={tab}` is what REPLAYS the slide. A CSS animation runs when the
          element mounts, so without a key React reuses this div, swaps the
          children, and nothing moves. Keying it on the tab makes each panel a
          new element and every switch a fresh entrance.

          `data-no-swipe` for the reader's drawer, which listens on `window`
          and skips anything under that attribute. The drawer is not on this
          page today; putting it here costs nothing and means a shared shell
          later cannot open a drawer out from under a tab change.

          `touch-pan-y` tells the browser this area scrolls vertically and
          never horizontally, so it commits to a vertical gesture immediately
          instead of waiting to see whether we cancel a horizontal one. */}
      <div
        key={tab}
        data-dir={dir}
        data-no-swipe
        /* Close to the tabs (owner, 2026-08-07: "the tabs are too far from the
           actual list of courses"). The gap was never one value — `pb-2.5`
           under the tab labels plus `mt-3` here stacked to 22px, which at the
           tabs' old 14px was fine and at 17px bold read as a hole. 8px here,
           well under the 22 that was too much. */
        className="tab-panel mt-2 touch-pan-y"
        {...swipe}
      >
        {tab === "active" &&
          (orderedActive.length ? (
            /* `id` IS REQUIRED HERE, NOT OPTIONAL POLISH. Without it dnd-kit
               names its screen-reader description element from an incrementing
               module counter — `DndDescribedBy-0` on the server, a different
               number on the client — and React reports a hydration mismatch on
               every card's `aria-describedby`. Caught in the browser, not by
               the build. A fixed id makes the name deterministic. */
            <DndContext
              id="course-order"
              sensors={sensors}
              collisionDetection={closestCenter}
              /* The drag flag the swipe reads. Set here rather than inferred
                 from the touch deltas, because dnd-kit is the only thing that
                 knows whether its 150ms hold actually elapsed — guessing from
                 movement alone would either miss slow drags or eat fast
                 swipes. */
              onDragStart={() => {
                dragging.current = true;
                /* A gesture that turns out to be a drag is no longer a
                   candidate swipe, even though touchstart already recorded
                   it. */
                touch.current = null;
              }}
              onDragCancel={() => {
                dragging.current = false;
              }}
              onDragEnd={(e) => {
                dragging.current = false;
                onDragEnd(e);
              }}
            >
              <SortableContext items={orderedActive.map((w) => w.course.slug)} strategy={rectSortingStrategy}>
                <div className="grid gap-3 md:grid-cols-2">
                  {orderedActive.map((w) => (
                    <SortableCard key={w.course.slug} id={w.course.slug}>
                      <CourseCard
                        course={w.course}
                        tone={courseTone(w.course.slug)}
                        hydrated={hydrated}
                        days={days}
                        done={w.cDone}
                        steps={w.cSteps}
                        next={w.next}
                      />
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <EmptyRow>
              {orderedCompleted.length
                ? "Everything you're taking is finished — check Completed."
                : "Nothing active yet."}
            </EmptyRow>
          ))}

        {tab === "pipeline" &&
          (pipelineTotal ? (
            <div className="grid gap-3 md:grid-cols-2">
              {scraped.map((c) => (
                <PipelineCard
                  key={c.slug}
                  title={c.title}
                  year={c.year}
                  students={demandFor(c.title, false)}
                />
              ))}
              {typed.map((title) => (
                <PipelineCard key={`typed:${normTitle(title)}`} title={title} students={demandFor(title, true)} />
              ))}
            </div>
          ) : (
            /* One clause (owner, 2026-08-08) — it was the longest sentence on
               the page, spent on the emptiest state. */
            <EmptyRow>Nothing waiting to be built.</EmptyRow>
          ))}

        {tab === "completed" &&
          (orderedCompleted.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {orderedCompleted.map((w) => (
                <CourseCard
                  key={w.course.slug}
                  course={w.course}
                  tone={courseTone(w.course.slug)}
                  hydrated={hydrated}
                  days={days}
                  done={w.cDone}
                  steps={w.cSteps}
                  next={w.next}
                  completed
                />
              ))}
            </div>
          ) : (
            <EmptyRow>
              Nothing finished yet — it&apos;ll land here the day you clear a course&apos;s last
              checkpoint.
            </EmptyRow>
          ))}
      </div>
    </>
  );
}

const TAB_LABEL: Record<Tab, string> = {
  active: "Active",
  pipeline: "Pipeline",
  completed: "Completed",
};

/* Quick with a little bounce (owner, 2026-08-08). The overshoot past 1 is the
 * bounce; 240ms is the quick. One string so the chip and the underline can
 * never drift apart in feel. */
const IND_MOVE = "left 240ms cubic-bezier(0.3, 1.4, 0.55, 1), width 240ms cubic-bezier(0.3, 1.4, 0.55, 1)";

/**
 * One row of the three course tabs plus the trailing sort control, with a
 * single underline that SLIDES to the selected tab rather than each tab
 * drawing its own mark: the 2px rule the row already had, but dimmer than the
 * placeholder grey it was (the line says WHICH, it is not to be read) and
 * pulled up until it hugs the baseline — close enough that descenders hang
 * THROUGH it. That is why the buttons carry `z-10` and the indicator `z-0`:
 * the letters must paint in front of the line, not under it.
 *
 * MEASURED, NOT DERIVED. The indicator's left/width come from the active
 * button's real layout box, re-read whenever the tab, a count, or the row's
 * size changes (the ResizeObserver watches the buttons too, which is what
 * catches a count mounting or the display font swapping in late). The first
 * measurement mounts the indicator already in place — it appears, it doesn't
 * travel in from nowhere.
 */
function TabRow({
  tab,
  goTab,
  counts,
}: {
  tab: Tab;
  goTab: (t: Tab) => void;
  counts: Record<Tab, number>;
}) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const btns = useRef(new Map<Tab, HTMLButtonElement>());
  const [ind, setInd] = useState<{ left: number; width: number } | null>(null);
  /* Read once, at mount, like useCountUp does — the setting is an app-level
     toggle and a page reload is an acceptable price for changing it. */
  const reduced = useRef(false);

  useLayoutEffect(() => {
    reduced.current =
      document.documentElement.dataset.motion === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const measure = () => {
      const btn = btns.current.get(tab);
      /* offsetLeft is relative to the offsetParent — the group div below is
         `relative` precisely so the buttons resolve against it. */
      if (btn) setInd({ left: btn.offsetLeft, width: btn.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(group);
    for (const b of btns.current.values()) ro.observe(b);
    return () => ro.disconnect();
  }, [tab, counts.active, counts.pipeline, counts.completed]);

  const move = ind && !reduced.current ? IND_MOVE : undefined;

  return (
    <div className="flex items-center justify-between gap-3">
      <div ref={groupRef} role="tablist" className="relative flex items-center gap-5">
        {ind && (
          /* bottom 2px against a 24px line box puts the rule's top edge ~2px
             below the baseline: Pipeline's and Completed's descenders reach
             ~1.5px off the bottom, so they cross it — which is the ask,
             verbatim ("such that protruding letters even come infront of it").
             0.2 black where the old rule was the placeholder grey (~0.3):
             dimmer, still present. */
          <span
            aria-hidden
            className="pointer-events-none absolute z-0 rounded-full"
            style={{
              left: ind.left,
              width: ind.width,
              bottom: 2,
              height: 2,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              transition: move,
            }}
          />
        )}
        {TABS.map((t) => (
          <CourseTab
            key={t}
            label={TAB_LABEL[t]}
            count={counts[t]}
            active={tab === t}
            onClick={() => goTab(t)}
            btnRef={(el) => {
              if (el) btns.current.set(t, el);
              else btns.current.delete(t);
            }}
          />
        ))}
      </div>
      {/* Where sorting will live (owner, 2026-08-08: "on that end is where ill
          have sort icons"). Disabled until it does something — it is here so
          the row's composition can be judged whole, not as a promise the
          button keeps yet. */}
      <button
        type="button"
        disabled
        aria-label="Sort courses"
        className="shrink-0 text-placeholder"
      >
        <MynaIcon name="sort" size={18} />
      </button>
    </div>
  );
}

function CourseTab({
  label,
  count,
  active,
  onClick,
  btnRef,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  btnRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={btnRef}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      /* BOLD AND BIGGER, BOTH STATES (owner, 2026-08-07: "make the waits of
         the tab text thicker" → semibold at 14px, then "increase the weight
         and size of the tabs, use bold" → 17px bold). At this size they are
         the largest thing in the section's chrome, which is right: with the
         "My courses" heading gone these ARE the heading, so they carry the
         weight it used to.

         Weight stays equal across states on purpose — it is colour and the
         sliding indicator that mark the selection, so bolding only the active
         tab would re-flow the row (and the indicator's target) every switch.

         `relative z-10` puts the label in front of the indicator — the rule
         hugs the baseline, so descenders have to hang through it, not under.

         The per-button border-b is gone: the selection mark is the row's one
         sliding indicator now, so a static rule under the active tab would be
         the same thing said twice, once without the motion. */
      className="relative z-10 shrink-0 whitespace-nowrap bg-transparent font-display text-[17px] font-bold leading-6 tracking-[-0.01em] transition-colors"
      style={{ color: active ? "var(--color-ink)" : "var(--color-placeholder)" }}
    >
      {label}
      {/* The count stays a step down in weight and size — it annotates the
          label rather than being part of it, and at bold 17 it would read as
          a second word in the tab's name. */}
      {count > 0 && (
        <span className="ml-1.5 text-[14px] font-medium tabular-nums text-placeholder">{count}</span>
      )}
    </button>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-[13.5px] leading-5 text-muted">{children}</p>;
}

/** One draggable slot in the Active grid. Wraps the whole card rather than
 *  adding a separate grab handle — see the activation constraints above for
 *  why that doesn't fight with the Resume button sitting inside it. */
function SortableCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 1 : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
