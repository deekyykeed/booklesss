"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
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
import { SETTINGS_EVENT } from "@/components/identity/pickers";
import type { CourseMeta } from "@/lib/courses";
import type { StudyDay } from "@/lib/progress";
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
 * ACTIVE + PIPELINE SIT TOGETHER; COMPLETED STANDS APART. Both readings of
 * "spaced between for the first two" say the same thing once you notice
 * Active and Pipeline are the two a student is actually deciding between —
 * what to read next, and what's still coming — where Completed is a look
 * back rather than a choice. One `justify-between` row does it: the first two
 * tabs share a tight group on the left, Completed sits alone on the right.
 *
 * ONE ORDER, applying to both Active and Completed — see lib/course-order for
 * why it isn't threaded through the account. Only Active exposes the drag
 * itself: it's the tab a student is actually choosing from, and Completed
 * courses have nothing left to decide between.
 * ------------------------------------------------------------------ */

type Tab = "active" | "pipeline" | "completed";

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

  const sensors = useSensors(
    // A real press-and-move, not a tap: 8px is enough to tell a drag from a
    // finger landing on the card to press Resume, which sits inside it.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="dash-heading">{identity?.courses.length ? "My courses" : "All courses"}</h2>
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { step: "courses" } }))
          }
          className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          Change
        </button>
      </div>

      {/* Active + Pipeline grouped left, Completed alone on the right — see
          the file note on why the split falls there rather than evenly. */}
      <div role="tablist" className="mt-4 flex items-center justify-between gap-3 border-b border-line">
        <div className="flex items-center gap-5">
          <CourseTab label="Active" count={orderedActive.length} active={tab === "active"} onClick={() => setTab("active")} />
          <CourseTab label="Pipeline" count={pipelineTotal} active={tab === "pipeline"} onClick={() => setTab("pipeline")} />
        </div>
        <CourseTab label="Completed" count={orderedCompleted.length} active={tab === "completed"} onClick={() => setTab("completed")} />
      </div>

      <div className="mt-3">
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
              onDragEnd={onDragEnd}
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
            <EmptyRow>Nothing queued — every course on your timetable is either built or not yet told to us.</EmptyRow>
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

function CourseTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="shrink-0 whitespace-nowrap border-0 bg-transparent pb-2.5 font-display text-[14px] font-medium leading-5 transition-colors"
      style={{ color: active ? "var(--color-ink)" : "var(--color-muted)" }}
    >
      {label}
      {count > 0 && <span className="ml-1 tabular-nums text-placeholder">{count}</span>}
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
