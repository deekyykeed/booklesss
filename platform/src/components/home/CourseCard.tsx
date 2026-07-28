"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CourseMeta } from "@/lib/courses";
import { labelFor, pathForId } from "@/lib/course";
import { studyHistory, type StudyDay } from "@/lib/progress";
import { coursePerformance } from "@/lib/performance";
import { StopwatchMark, TrendMark } from "./card-glyphs";
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

/** The live figure's floor, at the owner's call: a seeded baseline so the
 *  room never reads empty while the platform is small. Seeded from the course
 *  and the hour, so it differs per course and drifts through the day the way
 *  a real room would; any actual presence count is added on top. */
function liveBaseline(slug: string): number {
  const s = `${slug}:${Math.floor(Date.now() / 3_600_000)}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return 2 + (Math.abs(h) % 7);
}

/** Minutes read, in the card's terms: under an hour stays in minutes. */
function fmtTime(secs: number): string {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
}


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
  /** Readers in this course right now, or null when presence hasn't synced
   *  (or isn't configured) — null shows the figure's "–" placeholder. */
  live,
}: {
  course: CourseMeta;
  tone: string;
  hydrated: boolean;
  days: Record<string, StudyDay>;
  done: number;
  steps: number;
  next: string;
  live: number | null;
}) {
  const pct = course.totalCheckpoints ? done / course.totalCheckpoints : 0;

  /* This course's own reading time: the fortnight for the curve, the whole
   * history for the figure. Days recorded before per-course seconds shipped
   * carry a total but no breakdown, so they contribute nothing here — the
   * alternative would be attributing another course's minutes to this one. */
  const time = useMemo(() => {
    if (!hydrated) return { series: [] as number[], perf: null };
    const series = studyHistory(days, 14).map((d) => (d.courses?.[course.slug] ?? 0) / 60);
    return { series, perf: coursePerformance(days, course.slug, done, course.totalCheckpoints) };
  }, [hydrated, days, course.slug, done, course.totalCheckpoints]);

  const started = done > 0;

  return (
    <div className="course-card squircle flex flex-col p-4 lg:p-5">
      {/* This course's reading over the last fortnight, drawn exactly as the
          stat tiles draw theirs: a backdrop in the course's own hue, anchored
          to the card's bottom edge behind the text, curve kept to the right
          half. Same component, same defaults, so the two read as one set. */}
      <Spark series={time.series} tone={tone} />

      {/* The figures, kept to the right — what the reader put in and what it
          adds up to, on one line. This week's reading totals the fortnight
          curve's newest half; the score praises effort as much as coverage,
          and its hover title shows the working. */}
      <div className="relative flex items-center justify-end gap-3">
        <div className="flex items-center gap-4">
          <Figure
            label="read this week"
            value={time.perf && time.perf.weekSecs > 0 ? fmtTime(time.perf.weekSecs) : "–"}
            mark={<StopwatchMark size={13} />}
          />
          <Figure
            label={
              time.perf
                ? `performance score — ${Math.round(time.perf.parts.coverage * 100)}% covered, ` +
                  `${time.perf.weekDays} study day${time.perf.weekDays === 1 ? "" : "s"} this week, ` +
                  `momentum ${Math.round(time.perf.parts.momentum * 100)}%` +
                  (time.perf.parts.schedule !== null
                    ? `, on schedule ${Math.round(time.perf.parts.schedule * 100)}%`
                    : "")
                : "performance score"
            }
            value={time.perf ? `${time.perf.score}` : "–"}
            mark={<TrendMark size={13} />}
          />
          {/* Who's in this course right now, marked by the pulsing live dot.
              The number is the seeded baseline plus any synced presence
              count; hydration-gated so the server and first client paint
              agree on "–". */}
          <Figure
            label="reading now"
            value={hydrated ? `${liveBaseline(course.slug) + (live ?? 0)}` : "–"}
            mark={<span className="live-dot" aria-hidden="true" />}
          />
        </div>
      </div>

      {/* The card's foot: the title on its own undisturbed row, then the
          button beneath it in the bottom-right corner, both over the
          sparkline backdrop the way the tiles set their number over theirs. */}
      <div className="relative mt-auto pt-8">
        <p className="truncate font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-ink">
          {course.title}
        </p>

        {/* What the course is about, held to two lines — the body the card
            was missing with the title standing alone. */}
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-muted">{course.subtitle}</p>

        {/* The button IS the progress bar: full width, one word, its fill
            showing how far through the course they are. Pressing it opens
            the step they'd resume; the aria-label still names that step.
            The card's other surfaces go to the course home. */}
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

      {/* The card's quiet surfaces open the course itself. Stretched over the
          card, under the button — so the button wins its own clicks and the
          rest of the card is still one big target. */}
      <Link href={`/${course.slug}`} className="absolute inset-0 z-0" aria-label={course.title}>
        <span className="sr-only">{course.title}</span>
      </Link>
    </div>
  );
}

/** One figure in the header row: its mark, then the number. The label is for
 *  screen readers — sighted readers get it from the mark. */
function Figure({ label, value, mark }: { label: string; value: string; mark: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-ink-2" title={label}>
      {mark}
      <span className="text-[12.5px] font-medium tabular-nums text-muted">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
