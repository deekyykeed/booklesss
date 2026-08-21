"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  checkpointsFor,
  labelFor,
  lessonsUnder,
  pathForId,
} from "@/lib/course";
import { gateStepLink } from "@/lib/account";
import type { CourseMeta } from "@/lib/courses";
import { useProgress } from "@/lib/progress";
import { sessionsUnder } from "@/lib/session-nav";
import { CompletionRing } from "@/components/reader/CompletionRing";
import { MynaIcon } from "@/components/icons/myna";

/* ------------------------------------------------------------------ *
 * The course home, read like the index page of a documentation site:
 * the course title, a banner image, a paragraph of orientation, and
 * then the whole course as text — every unit a heading, every step a
 * link. Not a dashboard: the numbers live on the home page's course
 * cards; here the course itself is the content.
 *
 * What little progress appears is in service of reading — the ring on
 * each step row, and which step the "start here" line points at. All of
 * it derives from the same checkpoint store the reader writes to, so it
 * is client-only: before hydration it renders the honest zero state and
 * fills in once localStorage has been read.
 * ------------------------------------------------------------------ */

export function StudentDashboard({ course }: { course: CourseMeta }) {
  const { hydrated, doneCount, isComplete, ratio } = useProgress();

  // Course shape is static; only the progress numbers move. Scoped to this
  // course's own units, so a second course never counts towards the first.
  // `displayUnitIds` so a course authored under a folder named after itself
  // lists its real units here, not one heading repeating the title above it.
  const units = useMemo(
    () =>
      course.displayUnitIds
        .map((id) => ({
          id,
          label: labelFor(id),
          lessons: lessonsUnder(id),
          /* The level between a unit and a step, which is where a session
             lives — see sessionsUnder(). Verified to cover every step under
             every unit exactly once, so listing by session drops nothing and
             repeats nothing. */
          sessions: sessionsUnder(id),
        }))
        .filter((u) => u.lessons.length > 0),
    [course],
  );

  // "Next" is the first step still unfinished — started ones first, so you
  // finish what you opened before opening something new.
  const next = useMemo(() => {
    if (!hydrated) return course.lessonIds[0] ?? null;
    const incomplete = course.lessonIds.filter((id) => !isComplete(id));
    return incomplete.find((id) => doneCount(id) > 0) ?? incomplete[0] ?? null;
  }, [hydrated, doneCount, isComplete, course]);

  const begun = hydrated && course.lessonIds.some((id) => doneCount(id) > 0);

  return (
    <div className="mx-auto w-full px-4 py-10 md:px-6" style={{ maxWidth: 760 }}>
      <p className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-muted">Course</p>
      <h1 className="mt-1 font-display text-[30px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
        {course.title}
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-[15.5px] leading-7 text-[#4a4a52]">
        <p>{course.subtitle}</p>
        <p>
          The course runs {units.length === 1 ? "one unit" : `${units.length} units`} and{" "}
          {course.lessonIds.length} steps, listed below in reading order. Every step ends in
          checkpoints — short comprehension checks that mark it done — and the ring beside each
          step shows how far through it you are.
        </p>
        {next && (
          <p>
            {begun ? "Pick up where you left off with " : "Start with "}
            <Link
              href={pathForId(next)}
              onClick={(e) => gateStepLink(e, pathForId(next))}
              className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
            >
              {labelFor(next)}
            </Link>
            {hydrated && doneCount(next) > 0
              ? ` — ${doneCount(next)} of ${checkpointsFor(next).length} checkpoints cleared so far.`
              : "."}
          </p>
        )}
      </div>

      {/* The course itself: every unit a ruled heading, every step a link. */}
      <div className="mt-10 flex flex-col gap-9 pb-10">
        {units.map((u) => {
          const done = hydrated ? u.lessons.filter((id) => isComplete(id)).length : 0;
          return (
            <section key={u.id} id={u.id} className="scroll-mt-24">
              <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                <h2 className="dash-heading">{u.label}</h2>
                <span className="shrink-0 text-xs tabular-nums text-muted">
                  {done}/{u.lessons.length}
                </span>
              </div>
              {/* Each run of steps offers both doors — owner's call,
                  2026-08-21: Listen and Read side by side, the student picks.
                  The session name is suppressed when the session IS the unit,
                  because the heading directly above already says it and a row
                  that repeats the thing you just chose is noise (see the
                  standing no-redundant-context rule). */}
              {u.sessions.map((s) => (
                <div key={s.id} className="mt-3 first:mt-2">
                  <div className="flex items-center justify-between gap-3 py-1">
                    {s.id === u.id ? (
                      <span className="text-xs text-muted">
                        {s.stepIds.length} {s.stepIds.length === 1 ? "step" : "steps"}
                      </span>
                    ) : (
                      <span className="min-w-0 truncate text-[13px] font-medium text-ink-2">
                        {s.title}
                      </span>
                    )}
                    <Link
                      href={s.path}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-2 px-3 py-1 text-xs font-medium text-ink transition hover:bg-active"
                    >
                      <MynaIcon name="microphone" size={13} strokeWidth={1.7} />
                      Listen · {s.minutes} min
                    </Link>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {s.stepIds.map((id) => (
                  <li key={id}>
                    {/* Same gate as the sidebar and the step footer — this
                        list is the widest door to every step, and the free-
                        step rule (lib/account) has to hold at all of them. */}
                    <Link
                      href={pathForId(id)}
                      onClick={(e) => gateStepLink(e, pathForId(id))}
                      className="dash-row squircle"
                    >
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
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
