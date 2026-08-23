"use client";

import { ActionBar } from "@/components/ui/ActionBar";
import { useMemo } from "react";
import { gateStepLink } from "@/lib/account";
import type { CourseMeta } from "@/lib/courses";
import { labelFor, pathForId } from "@/lib/course";
import { courseStreak, studyHistory, type StudyDay } from "@/lib/progress";
import { coursePerformance } from "@/lib/performance";
import { MynaIcon } from "@/components/icons/myna";
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
 *
 * A FINISHED COURSE IS A DIFFERENT CLAIM, and until 2026-08-08 the card
 * refused to make it: the Completed tab existed to show finished courses and
 * the card in it said "Resume", pointed at step one, and read 0d streak —
 * indistinguishable from a course never opened. `completed` swaps the three
 * spots where "in motion" was assumed: the streak figure goes (there is
 * nothing left to keep a streak on), the performance score gives way to a
 * green check (a recency-weighted score DECAYS after the last session, so a
 * course finished a month ago would read ~25% next to the word Done), and the
 * bar owns the claim — "Done ✓ · Read it again", pointing at step one, which
 * is exactly where reading it again starts. Same target the old card had; the
 * lie was the word Resume, not the destination.
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
  /** Every checkpoint answered — the Completed tab's list. */
  completed = false,
}: {
  course: CourseMeta;
  tone: string;
  hydrated: boolean;
  days: Record<string, StudyDay>;
  done: number;
  steps: number;
  next: string;
  completed?: boolean;
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

  /* Where the card's one button goes, and what it calls the destination.
   *
   * The step they are on — the reading. Named here rather than inline because
   * the href, the click gate and the aria-label must all agree on one
   * destination; three call sites computing it separately is how a gate ends
   * up guarding a different page than the link opens. */
  const openHref = pathForId(next);
  const openLabel = labelFor(next);

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
        {/* No streak on a finished course — the figure would read 0d forever,
            which is the untouched-course look this variant exists to shed. */}
        {!completed && (
          <div className="flex items-center gap-4">
            <Figure
              label="day streak on this course"
              value={hydrated ? `${time.streak}d` : "–"}
              mark={<StreakMark size={13} />}
            />
          </div>
        )}
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
          {completed ? (
            /* The check, not the score. Green because green means completion
               across this app, solid because there is nothing partial left to
               hedge about. */
            <span
              className="shrink-0"
              style={{ color: "var(--color-brand-deep)" }}
              title="Course complete — every checkpoint answered"
            >
              <MynaIcon name="check-circle-solid" size={22} />
              <span className="sr-only">course complete</span>
            </span>
          ) : (
            /* Just the percentage, in the title's own voice — no container,
               no marks. The working stays on hover. */
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
          )}
        </div>

        {/* What the course is about, held to two lines — the body the card
            was missing with the title standing alone. */}
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-5 text-muted">{course.subtitle}</p>

        {/* The button IS the progress bar: full width, one word, its fill
            showing how far through the course they are. It is also the card's
            only link — the rest of the card is a display, not a target.

            IT OPENS THE STEP, NOT THE SESSION (owner, 2026-08-23). It briefly
            opened the guided call instead (2026-08-21) and that is withdrawn:
            the call surface is dark with a green orb where the whole app is
            cream, so the home screen's front door handed the student a page
            that does not look like the product they are in. Same reaction the
            ask box got — "that green, or whatever colour you keep adding, does
            not match the actual UI that I already have" — reached a second
            time and from the other direction. The voice door is the ask box on
            the home screen now; it wears the app's own palette. */}
        <ActionBar
          href={openHref}
          /* The free-step gate (lib/account): a fresh device's first Start is
             free, a second course's Start on a signed-out device asks. The
             gate follows the destination rather than the step, or the
             immersive door would be the one way past it. */
          onClick={(e) => gateStepLink(e, openHref)}
          progress={pct}
          /* The bar's fill in the card's own hue — the same colour its Spark
             draws, so curve and fill read as one course (owner, 2026-08-08). */
          progressTone={tone}
          prefix={completed ? "Done ✓ · " : started ? "Resume · " : "Start · "}
          label={
            completed
              ? `${course.title} is complete — go through it again`
              : `${started ? "Resume" : "Start"} ${course.title} at ${hydrated ? openLabel : ""}`
          }
          className="mt-3"
        >
          {completed ? "Go again" : hydrated ? openLabel : " "}
        </ActionBar>
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
