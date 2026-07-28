"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  checkpointsFor,
  labelFor,
  lessonsUnder,
  pathForId,
  breadcrumbFor,
} from "@/lib/course";
import type { CourseMeta } from "@/lib/courses";
import { useProgress } from "@/lib/progress";
import { CompletionRing } from "@/components/reader/CompletionRing";

/* ------------------------------------------------------------------ *
 * The course home, shaped like a docs index page: a welcome banner, a
 * Quick start block with the one obvious next action, the course laid
 * out section by section as link lists, and an "on this page" rail at
 * wide widths.
 *
 * Everything here is derived from the same checkpoint store the reader
 * writes to — no new state, no second source of truth. That also means it
 * is client-only, so before hydration it renders the honest zero state and
 * fills in once localStorage has been read.
 *
 * Note there is no "recently studied" section: the store holds which
 * checkpoints are done, not when, so any recency claim would be invented.
 * Adding timestamps is a store change, not a dashboard one.
 * ------------------------------------------------------------------ */

function pct(n: number, d: number) {
  return d > 0 ? Math.round((n / d) * 100) : 0;
}

export function StudentDashboard({ course }: { course: CourseMeta }) {
  const { hydrated, doneCount, isComplete, ratio } = useProgress();

  // Course shape is static; only the progress numbers move. Scoped to this
  // course's own units, so a second course never counts towards the first.
  const shape = useMemo(
    () => ({
      lessons: course.lessonIds,
      totalSteps: course.lessonIds.length,
      totalChecks: course.totalCheckpoints,
      units: course.unitIds
        .map((id) => ({ id, label: labelFor(id), lessons: lessonsUnder(id) }))
        .filter((u) => u.lessons.length > 0),
    }),
    [course],
  );

  const stats = useMemo(() => {
    if (!hydrated) {
      return { checksDone: 0, stepsDone: 0, unitsStarted: 0, next: shape.lessons[0] ?? null };
    }
    let checksDone = 0;
    let stepsDone = 0;
    for (const id of shape.lessons) {
      checksDone += doneCount(id);
      if (isComplete(id)) stepsDone++;
    }
    const incomplete = shape.lessons.filter((id) => !isComplete(id));
    // "Next" is the first step still unfinished — started ones first, so you
    // finish what you opened before opening something new.
    const started = incomplete.filter((id) => doneCount(id) > 0);
    const next = started[0] ?? incomplete[0] ?? null;
    const unitsStarted = shape.units.filter((u) => u.lessons.some((id) => doneCount(id) > 0)).length;
    return { checksDone, stepsDone, unitsStarted, next };
  }, [hydrated, doneCount, isComplete, shape]);

  const courseRatio = shape.totalChecks ? stats.checksDone / shape.totalChecks : 0;
  const finished = hydrated && stats.stepsDone === shape.totalSteps && shape.totalSteps > 0;
  const begun = hydrated && stats.checksDone > 0;

  return (
    // Wider than the old 900 to make room for the docs-style rail; the main
    // column itself stays a comfortable measure. maxWidth inline — see the
    // LessonReader note on arbitrary width classes and the scanner.
    <div className="mx-auto w-full px-4 py-10 md:px-6" style={{ maxWidth: 1140 }}>
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_190px]">
        <div className="min-w-0">
          {/* ---- welcome banner ---- *
           * The one dark surface in the app, deliberately: it does the job the
           * hero image does on a docs index — says "you've arrived somewhere"
           * before the reading starts. Hues echo the waves backdrop so it
           * belongs to the same room. */}
          <section className="squircle relative overflow-hidden rounded-[32px] bg-[#131315] px-6 py-9 text-white md:px-10 md:py-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(110% 170% at 88% -30%, rgba(179,196,230,0.32), transparent 55%)," +
                  "radial-gradient(80% 130% at 4% 130%, rgba(203,213,245,0.20), transparent 60%)",
              }}
            />
            <p className="relative font-sans text-[11px] font-semibold uppercase tracking-[0.09em] text-white/55">
              Course
            </p>
            <h1 className="relative mt-2 font-display text-[32px] font-semibold leading-[1.15] tracking-[-0.02em]">
              Welcome to {course.title}
            </h1>
            <p className="relative mt-3 max-w-[540px] text-[15px] leading-6 text-white/70">{course.subtitle}</p>
            <div className="relative mt-6 flex items-center gap-2.5 text-white/80">
              <CompletionRing
                value={courseRatio}
                size={18}
                stroke={2.5}
                className="text-white"
                label={`${pct(stats.checksDone, shape.totalChecks)} percent of the course complete`}
              />
              <span className="text-[13px] tabular-nums">
                {finished
                  ? "Every step in the course complete"
                  : `${pct(stats.checksDone, shape.totalChecks)}% complete · ${stats.checksDone} of ${shape.totalChecks} checkpoints`}
              </span>
            </div>
          </section>

          {/* ---- quick start ---- */}
          {stats.next && (
            <section id="quick-start" className="mt-10 scroll-mt-24">
              <h2 className="font-display text-[20px] font-semibold tracking-[-0.01em] text-ink">Quick start</h2>
              <p className="mt-2 max-w-[560px] text-[14.5px] leading-6 text-muted">
                {begun
                  ? "Pick up where you left off — the step below is the first one still open."
                  : "Start with the first step. Each step ends in checkpoints; clearing them is what marks it done."}
              </p>
              {/* Stacks below sm, one row from sm up — see the note on the course
                  cards in HomeView: flex-wrap can't save a flex-basis-0 column. */}
              <div className="dash-card squircle mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <CompletionRing
                    value={hydrated ? ratio(stats.next) : 0}
                    size={34}
                    stroke={3}
                    className="text-ink"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-placeholder">
                      {breadcrumbFor(stats.next).slice(0, -1).join(" / ")}
                    </p>
                    <p className="mt-0.5 truncate font-display text-[17px] font-semibold text-ink">
                      {labelFor(stats.next)}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {hydrated ? doneCount(stats.next) : 0} of {checkpointsFor(stats.next).length} checkpoints
                    </p>
                  </div>
                </div>
                <Link href={pathForId(stats.next)} className="dash-cta squircle">
                  {begun && hydrated && doneCount(stats.next) > 0 ? "Continue" : "Start"}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </section>
          )}

          {/* ---- three numbers, no more ---- */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat value={`${stats.stepsDone}/${shape.totalSteps}`} label="Steps complete" />
            <Stat value={`${stats.checksDone}/${shape.totalChecks}`} label="Checkpoints cleared" />
            <Stat value={`${stats.unitsStarted}/${shape.units.length}`} label="Units started" />
          </div>

          {/* ---- the course, section by section ---- *
           * The docs-index body: every unit is a heading and every step under
           * it is a link, so the whole course is scannable and reachable from
           * this one page. Replaces the old unit cards and "up next" queue —
           * a full listing makes a preview of it redundant. */}
          <section className="mt-12 pb-10">
            <h2 className="font-display text-[20px] font-semibold tracking-[-0.01em] text-ink">The course</h2>
            <div className="mt-5 flex flex-col gap-9">
              {shape.units.map((u) => {
                const done = hydrated ? u.lessons.filter((id) => isComplete(id)).length : 0;
                return (
                  <section key={u.id} id={u.id} className="scroll-mt-24">
                    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                      <h3 className="dash-heading">{u.label}</h3>
                      <span className="shrink-0 text-xs tabular-nums text-muted">
                        {done}/{u.lessons.length}
                      </span>
                    </div>
                    <ul className="mt-2 flex flex-col gap-1">
                      {u.lessons.map((id) => (
                        <li key={id}>
                          <Link href={pathForId(id)} className="dash-row squircle">
                            <CompletionRing
                              value={hydrated ? ratio(id) : 0}
                              size={15}
                              stroke={2}
                              style={{ opacity: 0.75 }}
                            />
                            <span className="min-w-0 flex-1 truncate text-sm text-ink">{labelFor(id)}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-placeholder">
                              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </section>
        </div>

        {/* ---- on this page ---- *
         * The docs rail. Plain anchors into the unit sections — the content
         * surface is the scroll container, so scroll-mt on the targets is all
         * the wiring this needs. */}
        <aside className="hidden xl:block">
          <nav aria-label="On this page" className="sticky top-6">
            <p className="dash-heading">On this page</p>
            <ul className="mt-3 flex flex-col gap-2 border-l border-line pl-3.5">
              <li>
                <a href="#quick-start" className="block text-[13px] leading-5 text-muted transition-colors hover:text-ink">
                  Quick start
                </a>
              </li>
              {shape.units.map((u) => (
                <li key={u.id}>
                  <a href={`#${u.id}`} className="block truncate text-[13px] leading-5 text-muted transition-colors hover:text-ink">
                    {u.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="dash-stat squircle">
      <p className="font-display text-[19px] font-semibold tabular-nums leading-none text-ink">{value}</p>
      <p className="mt-1.5 text-[11.5px] leading-4 text-muted">{label}</p>
    </div>
  );
}
