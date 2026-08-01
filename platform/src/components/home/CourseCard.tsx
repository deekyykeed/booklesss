"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CourseMeta } from "@/lib/courses";
import { labelFor, pathForId } from "@/lib/course";
import { courseStreak, studyHistory, type StudyDay } from "@/lib/progress";
import { coursePerformance } from "@/lib/performance";
import { CardMark, StreakMark } from "./card-glyphs";
import { Spark } from "./Spark";

/* ------------------------------------------------------------------ *
 * A course card.
 *
 * Reads top to bottom the way the course does: what kind of thing this is
 * (the folder mark) and how it's going (three figures), then which course,
 * then the one action — resume.
 *
 * Every number is measured. Checkpoints and steps come from the checkpoint
 * store; the minutes and the curve come from the per-course seconds
 * StudyClock records, which only exist from the day that field shipped, so
 * a course studied before then shows no curve rather than a flat invented
 * one.
 * ------------------------------------------------------------------ */

export function CourseCard({
  course,
  tone,
  hydrated,
  days,
  /** Checkpoints cleared in this course, and steps finished. */
  done,
  steps,
  /** The step the button resumes — where they left off, or the first one. */
  next,
}: {
  course: CourseMeta;
  tone: string;
  hydrated: boolean;
  days: Record<string, StudyDay>;
  done: number;
  steps: number;
  next: string;
}) {
  const pct = course.totalCheckpoints ? done / course.totalCheckpoints : 0;

  /* This course's own reading time: the fortnight for the curve, the whole
   * history for the figure. Days recorded before per-course seconds shipped
   * carry a total but no breakdown, so they contribute nothing here — the
   * alternative would be attributing another course's minutes to this one. */
  const time = useMemo(() => {
    if (!hydrated) return { series: [] as number[], perf: null, streak: 0 };
    const series = studyHistory(days, 14).map((d) => (d.courses?.[course.slug] ?? 0) / 60);
    return {
      series,
      perf: coursePerformance(days, course.slug, done, course.totalCheckpoints),
      streak: courseStreak(days, course.slug),
    };
  }, [hydrated, days, course.slug, done, course.totalCheckpoints]);

  const started = done > 0;

  return (
    <div className="course-card squircle flex flex-col p-4 lg:p-5">
      {/* This course's reading over the last fortnight, drawn exactly as the
          stat tiles draw theirs: a backdrop in the course's own hue, anchored
          to the card's bottom edge behind the text, curve kept to the right
          half. Same component, same defaults, so the two read as one set. */}
      <Spark series={time.series} tone={tone} />

      {/* The card's mark top-left, the streak right — what kind of thing this
          is, and how it's going, on one quiet line. The score lives on the
          title line below. */}
      <div className="relative flex items-start justify-between gap-3">
        <span className="text-ink">
          <CardMark size={24} />
        </span>
        <div className="flex items-center gap-4">
          <Figure
            label="day streak on this course"
            value={hydrated ? `${time.streak}d` : "–"}
            mark={<StreakMark size={13} />}
          />
        </div>
      </div>

      {/* The card's foot. Brand green on the score from 70 up; the working
          stays on hover. */}
      <div className="relative mt-auto pt-8">
        {/* Title and score share the one row: the title fills and may wrap to
            a second line when long; the score keeps its place at the far end,
            hanging from the row's top, with the gap between them. */}
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {course.title}
          </p>
          {/* Just the percentage, in the title's own voice — no container,
              no marks. The working stays on hover. */}
          <span
            className="shrink-0 font-display text-[21px] font-semibold leading-tight tracking-[-0.01em]"
            style={{ color: time.perf && time.perf.score >= 70 ? "var(--color-brand-deep)" : "var(--color-ink)" }}
            title={
              time.perf
                ? `performance score, ${time.perf.delta >= 0 ? "up" : "down"} ${Math.abs(time.perf.delta)} this week — ` +
                  `mostly effort (${time.perf.weekDays} study day${time.perf.weekDays === 1 ? "" : "s"} and ` +
                  `${time.perf.weekMins}m this week), plus ${Math.round(time.perf.parts.coverage * 100)}% covered`
                : "performance score"
            }
          >
            {time.perf ? `${time.perf.score}%` : "–"}
            <span className="sr-only"> performance score</span>
          </span>
        </div>

        {/* What the course is about, held to two lines — the body the card
            was missing with the title standing alone. */}
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-5 text-muted">{course.subtitle}</p>

        {/* The button IS the progress bar: full width, one word, its fill
            showing how far through the course they are. Pressing it opens
            the step they'd resume; the aria-label still names that step.
            It is also the card's only link — the rest of the card is a
            display, not a target. */}
        <Link
          href={pathForId(next)}
          className="course-resume squircle relative z-10 mt-3 flex items-center justify-between gap-3 overflow-hidden px-2.5 py-1.5"
          aria-label={`${started ? "Resume" : "Start"} ${course.title} — ${hydrated ? labelFor(next) : ""}`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0"
            style={{
              width: `${Math.round(pct * 100)}%`,
              backgroundColor: "rgba(23, 23, 23, 0.07)",
              transition: "width 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <span className="relative min-w-0 truncate text-[13px] leading-5 text-ink">
            <span className="text-placeholder">{started ? "Resume · " : "Start · "}</span>
            {hydrated ? labelFor(next) : " "}
          </span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="card-arrow relative shrink-0 text-muted"
          >
            <path
              d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* No stretched link over the card. It used to open the course home, so
          the whole card was one big target and the Resume button was a smaller
          target sitting inside it doing something different: two destinations
          in one shape, where a tap that missed the button by a few pixels went
          somewhere the reader did not choose.
          The button is the card's only action now. It goes to the step they
          are actually on, which is what the card is for; the course home is
          still a tap away in the sidebar. */}
    </div>
  );
}

/** One figure in the header row: its mark, then the number. The label is for
 *  screen readers and the hover — sighted readers get it from the mark. */
function Figure({ label, value, mark }: { label: string; value: string; mark: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-ink-2" title={label}>
      {mark}
      <span className="text-[12.5px] font-medium tabular-nums text-muted">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
