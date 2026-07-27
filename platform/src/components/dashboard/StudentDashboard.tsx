"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  COURSE,
  checkpointsFor,
  labelFor,
  lessonsUnder,
  orderedLessonIds,
  pathForId,
  totalCheckpoints,
  breadcrumbFor,
} from "@/lib/course";
import { useProgress } from "@/lib/progress";
import { CompletionRing } from "@/components/reader/CompletionRing";

/* ------------------------------------------------------------------ *
 * The student's index page: where they are in the course, and the one
 * obvious thing to do next.
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

export function StudentDashboard() {
  const { hydrated, doneCount, isComplete, ratio } = useProgress();

  // Course shape is static; only the progress numbers move.
  const shape = useMemo(() => {
    const lessons = orderedLessonIds();
    return {
      lessons,
      totalSteps: lessons.length,
      totalChecks: totalCheckpoints(),
      units: COURSE.map((u) => ({ id: u.id, label: u.label, lessons: lessonsUnder(u.id) })).filter(
        (u) => u.lessons.length > 0,
      ),
    };
  }, []);

  const stats = useMemo(() => {
    if (!hydrated) {
      return { checksDone: 0, stepsDone: 0, unitsStarted: 0, next: shape.lessons[0] ?? null, upNext: [] as string[] };
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
    return {
      checksDone,
      stepsDone,
      unitsStarted,
      next,
      upNext: incomplete.filter((id) => id !== next).slice(0, 4),
    };
  }, [hydrated, doneCount, isComplete, shape]);

  const courseRatio = shape.totalChecks ? stats.checksDone / shape.totalChecks : 0;
  const finished = hydrated && stats.stepsDone === shape.totalSteps && shape.totalSteps > 0;

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 md:px-6">
      <p className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-muted">Your course</p>
      <h1 className="mt-1 font-display text-[30px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
        Economics
      </h1>

      {/* ---- overall progress ---- */}
      <div className="dash-card squircle mt-6 flex items-center gap-5">
        <CompletionRing
          value={courseRatio}
          size={64}
          stroke={5}
          className="text-ink"
          label={`${pct(stats.checksDone, shape.totalChecks)} percent of the course complete`}
        />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[22px] font-semibold leading-none text-ink">
            {pct(stats.checksDone, shape.totalChecks)}%
          </p>
          <p className="mt-1.5 text-[13.5px] leading-5 text-muted">
            {finished
              ? "You've finished every step in the course."
              : `${stats.checksDone} of ${shape.totalChecks} checkpoints cleared · ${stats.stepsDone} of ${shape.totalSteps} steps complete`}
          </p>
        </div>
      </div>

      {/* ---- the one obvious next action ---- */}
      {stats.next && (
        <section className="mt-4">
          <h2 className="dash-heading">
            {hydrated && stats.checksDone > 0 ? "Pick up where you left off" : "Start here"}
          </h2>
          <div className="dash-card squircle mt-2.5 flex flex-wrap items-center gap-4">
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
            <Link href={pathForId(stats.next)} className="dash-cta squircle">
              {hydrated && doneCount(stats.next) > 0 ? "Continue" : "Start"}
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

      {/* ---- the course, unit by unit ---- */}
      <section className="mt-8">
        <h2 className="dash-heading">Units</h2>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
          {shape.units.map((u) => {
            const done = hydrated ? u.lessons.filter((id) => isComplete(id)).length : 0;
            const firstOpen = u.lessons.find((id) => !hydrated || !isComplete(id)) ?? u.lessons[0];
            return (
              <Link key={u.id} href={pathForId(firstOpen)} className="dash-unit squircle">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-display text-[15px] font-semibold text-ink">{u.label}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {done}/{u.lessons.length}
                  </span>
                </div>
                <div className="dash-bar mt-3" role="presentation">
                  <span className="dash-bar-fill" style={{ width: `${pct(done, u.lessons.length)}%` }} />
                </div>
                <p className="mt-2.5 truncate text-xs text-placeholder">
                  {done === u.lessons.length ? "Complete" : `Next · ${labelFor(firstOpen)}`}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---- queue ---- */}
      {stats.upNext.length > 0 && (
        <section className="mt-8 pb-10">
          <h2 className="dash-heading">Up next</h2>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {stats.upNext.map((id) => (
              <li key={id}>
                <Link href={pathForId(id)} className="dash-row squircle">
                  <CompletionRing value={hydrated ? ratio(id) : 0} size={15} stroke={2} style={{ opacity: 0.75 }} />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">{labelFor(id)}</span>
                  <span className="hidden shrink-0 truncate text-xs text-placeholder sm:block">
                    {breadcrumbFor(id).slice(0, -1).join(" / ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
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
