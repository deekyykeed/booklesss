"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CourseMeta } from "@/lib/courses";
import { labelFor, pathForId } from "@/lib/course";
import { studyHistory, type StudyDay } from "@/lib/progress";
import { ChecklistMark, FolderMark, StopwatchMark } from "./card-glyphs";
import { Spark } from "./Spark";

/** The trend line is furniture, not a course marker — it wears the app's grey
 *  wherever it appears, the way the momentum series does on the study chart. */
const SPARK_TONE = "#8b8b93";

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
    if (!hydrated) return { series: [] as number[], total: 0 };
    const series = studyHistory(days, 14).map((d) => (d.courses?.[course.slug] ?? 0) / 60);
    const total = Object.values(days).reduce((n, d) => n + (d.courses?.[course.slug] ?? 0), 0);
    return { series, total };
  }, [hydrated, days, course.slug]);

  const started = done > 0;

  return (
    <div className="course-card squircle flex flex-col p-4 lg:p-5">
      {/* The one place the course's own colour appears: a wash off the top
          edge, faint enough that two cards side by side are told apart rather
          than colour-coded. Everything else on the card is the app's greys. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${tone}14, ${tone}05 45%, ${tone}05)` }}
      />

      {/* Type mark left, the two figures right — what this is, and how it's
          going, on one line. Two, not three: the checkpoint count and the
          percentage were the same fact twice, and the percentage is also the
          button's fill, so the count is the one that stays. */}
      <div className="relative flex items-center justify-between gap-3">
        <span className="text-muted">
          <FolderMark size={20} />
        </span>
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

      {/* Air between the figures and the name, the way the stat tiles hold
          their number away from their label. */}
      <div className="relative mt-12">
        <p className="truncate font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-ink">
          {course.title}
        </p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-muted">{course.subtitle}</p>
      </div>

      {/* The action sits at the card's foot whatever the description's
          length, so a row of cards keeps one baseline. */}
      <div className="relative mt-auto pt-6">
        {/* This course's reading over the last fortnight, drawn as the stat
            tiles draw theirs: edge to edge, full width, nothing sharing its
            line. It takes its own 46px of the column rather than floating
            over the text — so its floor is exactly the button's top edge and
            the curve rests on the button. */}
        <div className="pointer-events-none relative -mx-4 h-[46px] lg:-mx-5">
          <Spark series={time.series} tone={SPARK_TONE} height={46} from={0.06} padRight={16} />
        </div>

        {/* The button IS the progress bar: the fill is how far through the
            course they are, and pressing it opens the step they'd resume.
            The card's other surfaces go to the course home. */}
        <Link
          href={pathForId(next)}
          className="course-resume squircle relative z-10 flex items-center justify-between gap-3 overflow-hidden px-4 py-3"
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
    <span className="flex items-center gap-1.5 text-placeholder" title={label}>
      {mark}
      <span className="text-[12.5px] font-medium tabular-nums text-muted">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
