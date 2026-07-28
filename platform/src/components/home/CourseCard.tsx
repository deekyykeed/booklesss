"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CourseMeta } from "@/lib/courses";
import { labelFor, pathForId } from "@/lib/course";
import { studyHistory, type StudyDay } from "@/lib/progress";
import { ChecklistMark, StopwatchMark } from "./card-glyphs";
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

/** Minutes read, in the card's terms: under an hour stays in minutes. */
function fmtTime(secs: number): string {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
}

/** When this course was last read, in the reader's own terms: named days
 *  while it's fresh, a date once it isn't. */
function fmtLast(date: string | null): string {
  if (!date) return "No reading yet";
  const [y, m, d] = date.split("-").map(Number);
  const then = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - then.getTime()) / 86400000);
  if (diff <= 0) return "Studied today";
  if (diff === 1) return "Studied yesterday";
  if (diff < 14) return `Last studied ${diff} days ago`;
  return `Last studied ${then.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`;
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
    if (!hydrated) return { series: [] as number[], total: 0, last: null as string | null };
    const series = studyHistory(days, 14).map((d) => (d.courses?.[course.slug] ?? 0) / 60);
    const total = Object.values(days).reduce((n, d) => n + (d.courses?.[course.slug] ?? 0), 0);
    /* The most recent day with reading logged against this course — the same
     * per-course rule as the figures, so pre-breakdown days don't count. */
    const last = Object.entries(days).reduce<string | null>(
      (best, [date, d]) => ((d.courses?.[course.slug] ?? 0) > 0 && (!best || date > best) ? date : best),
      null,
    );
    return { series, total, last };
  }, [hydrated, days, course.slug]);

  const started = done > 0;

  return (
    <div className="course-card squircle flex flex-col p-4 lg:p-5">
      {/* This course's reading over the last fortnight, drawn exactly as the
          stat tiles draw theirs: a backdrop in the course's own hue, anchored
          to the card's bottom edge behind the text, curve kept to the right
          half. Same component, same defaults, so the two read as one set. */}
      <Spark series={time.series} tone={tone} />

      {/* The two figures, kept to the right — how the course is going, on one
          line. Two, not three: the checkpoint count and the percentage were
          the same fact twice, and the percentage is also the button's fill,
          so the count is the one that stays. */}
      <div className="relative flex items-center justify-end gap-3">
        <div className="flex items-center gap-4">
          <Figure
            label="checkpoints cleared"
            value={hydrated ? `${done}/${course.totalCheckpoints}` : "–"}
            mark={<ChecklistMark size={15} />}
          />
          <Figure
            label="read"
            value={hydrated && time.total > 0 ? fmtTime(time.total) : "–"}
            mark={<StopwatchMark size={15} />}
          />
        </div>
      </div>

      {/* The card's foot: the title on its own undisturbed row, then the
          button beneath it in the bottom-right corner, both over the
          sparkline backdrop the way the tiles set their number over theirs. */}
      <div className="relative mt-auto pt-3">
        <p className="truncate font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-ink">
          {course.title}
        </p>

        {/* One line of the reader's own history with this course — when they
            last sat with it, from the same per-course seconds as the curve. */}
        <p className="mt-1 truncate text-[12px] leading-4 text-muted">{hydrated ? fmtLast(time.last) : "–"}</p>

        {/* The one action, kept small: a completion ring — how far through
            the course they are — and the one word. Pressing it opens the
            step they'd resume; the aria-label still names that step. The
            card's other surfaces go to the course home. */}
        <div className="mt-2 flex justify-end">
          <Link
            href={pathForId(next)}
            className="course-resume squircle relative z-10 flex shrink-0 items-center gap-1.5 px-2 py-1"
            aria-label={`${started ? "Resume" : "Start"} ${course.title} — ${hydrated ? labelFor(next) : ""}`}
          >
            <ProgressRing pct={hydrated ? pct : 0} />
            <span className="relative text-[12px] leading-4 text-ink">{started ? "Resume" : "Start"}</span>
          </Link>
        </div>
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

/** The button's completion ring: a grey track, the cleared fraction drawn
 *  over it in ink. Sized to sit in the chip where a glyph would. */
function ProgressRing({ pct, size = 13 }: { pct: number; size?: number }) {
  const r = 5;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" className="relative shrink-0 -rotate-90">
      <circle cx="7" cy="7" r={r} fill="none" stroke="var(--color-line-2)" strokeWidth="2.2" />
      <circle
        cx="7"
        cy="7"
        r={r}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </svg>
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
