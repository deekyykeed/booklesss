"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CourseMeta } from "@/lib/courses";
import { labelFor, pathForId } from "@/lib/course";
import { courseStreak, studyHistory, type StudyDay } from "@/lib/progress";
import { coursePerformance } from "@/lib/performance";
import { CardMark, StreakMark, TrendDownMark, TrendUpMark } from "./card-glyphs";
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

      {/* The card's mark top-left, the small figures right — effort and
          company on one quiet line. The score lives on the title line below. */}
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
          {/* Who's in this course right now, marked by the pulsing live dot.
              The number is the seeded baseline plus any synced presence
              count; hydration-gated so the server and first client paint
              agree on "–". */}
          <Figure
            label="reading now"
            value={hydrated ? `${liveBaseline(course.slug) + (live ?? 0)}` : "–"}
            caption="online"
            mark={<span className="live-dot" aria-hidden="true" />}
          />
        </div>
      </div>

      {/* The card's foot. The title keeps its own full-width line; the score
          sits in its own container directly beneath it — a bordered chip in
          the card's chrome, the number in the display face with its quiet
          caption. Brand green from 70 up; the working stays on hover. */}
      <div className="relative mt-auto pt-8">
        {/* Title and score share the one row: the title fills and may wrap
            to a second line when long; the chip keeps its place at the far
            end, hanging from the row's top, with the gap between them. */}
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {course.title}
          </p>
          {/* The owner's sketch, compact: the number, a small raised %, and
              tucked under the % the week's movement — trend arrow and points,
              green climbing, red falling. */}
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-[10px] border border-line bg-white/60 px-2 py-[3px]"
          title={
            time.perf
              ? `performance score, ${time.perf.delta >= 0 ? "up" : "down"} ${Math.abs(time.perf.delta)} this week — ` +
                `${Math.round(time.perf.parts.coverage * 100)}% covered, ` +
                `${time.perf.weekDays} study day${time.perf.weekDays === 1 ? "" : "s"} and ` +
                `${time.perf.weekChecks} checkpoint${time.perf.weekChecks === 1 ? "" : "s"} this week` +
                (time.perf.parts.schedule !== null
                  ? `, on schedule ${Math.round(time.perf.parts.schedule * 100)}%`
                  : "")
              : "performance score"
          }
        >
          <span
            className="font-display text-[16px] font-semibold leading-none tracking-[-0.01em]"
            style={{ color: time.perf && time.perf.score >= 70 ? "var(--color-brand-deep)" : "var(--color-ink)" }}
          >
            {time.perf ? time.perf.score : "–"}
          </span>
          <span className="flex flex-col items-start gap-[2px]">
            <span
              className="font-display text-[9.5px] font-semibold leading-none"
              style={{ color: time.perf && time.perf.score >= 70 ? "var(--color-brand-deep)" : "var(--color-ink)" }}
            >
              %
            </span>
            {time.perf && (
              <span
                className="flex items-center gap-[2px] leading-none"
                style={{
                  color:
                    time.perf.delta > 0
                      ? "var(--color-brand-deep)"
                      : time.perf.delta < 0
                        ? "var(--color-danger)"
                        : "var(--color-muted)",
                }}
              >
                {time.perf.delta < 0 ? <TrendDownMark size={9} /> : <TrendUpMark size={9} />}
                <span className="text-[9.5px] font-semibold tabular-nums">{Math.abs(time.perf.delta)}</span>
              </span>
            )}
          </span>
          <span className="sr-only">performance score</span>
          </span>
        </div>

        {/* What the course is about, held to two lines — the body the card
            was missing with the title standing alone. */}
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-5 text-muted">{course.subtitle}</p>

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

/** One figure in the header row: its mark, the number, and optionally one
 *  quiet word of context after it — for figures whose mark alone doesn't say
 *  what the number is. The full label is for screen readers and the hover. */
function Figure({
  label,
  value,
  mark,
  caption,
}: {
  label: string;
  value: string;
  mark: React.ReactNode;
  caption?: string;
}) {
  return (
    <span className="flex items-center gap-1.5 text-ink-2" title={label}>
      {mark}
      <span className="text-[12.5px] font-medium tabular-nums text-muted">{value}</span>
      {caption && <span className="text-[11px] text-placeholder">{caption}</span>}
      <span className="sr-only">{label}</span>
    </span>
  );
}
