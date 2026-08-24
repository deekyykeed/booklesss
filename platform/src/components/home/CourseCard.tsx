"use client";

import { ActionBar } from "@/components/ui/ActionBar";
import { useMemo, useRef } from "react";
import { gateStepLink } from "@/lib/account";
import type { CourseMeta } from "@/lib/courses";
import { labelFor } from "@/lib/course";
import { beginMorphFrom } from "@/lib/morph";
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

  /* Where the card goes, and what it calls the destination.
   *
   * THE COURSE'S VOICE SCREEN (owner, 2026-08-23: "when I tap the course card,
   * I prefer that the whole thing grows into a full-screen page … that's where
   * the voice chat experience is going to live").
   *
   * This is the third destination this button has had in two days and the
   * history is the argument. It pointed at the READING; on 2026-08-21 it moved
   * to the guided session at /study; earlier today it was moved back to the
   * reading, because /study is dark with a green orb and the home screen's
   * front door should not hand a student a page that looks like a different
   * product. That reasoning was right and is preserved — what was wrong with
   * /study was its SURFACE, not the idea of a voice door on the card.
   * /session/<course> is that door in the app's own palette, and it opens with
   * an offer rather than by starting to talk at anybody.
   *
   * Named once because the href, the click gate, the morph and the aria-label
   * must all agree on one destination; four call sites computing it separately
   * is how a gate ends up guarding a different page than the link opens. */
  const openHref = `/session/${course.slug}`;
  const openLabel = labelFor(next);
  /* THE MORPH. The card measures itself and hands its own geometry and its own
   * computed background to the overlay mounted in the root layout, which grows
   * that clone to fill the viewport and pushes the route underneath it. See
   * lib/morph for why the overlay cannot live in this component.
   *
   * `beginMorphFrom` returns false when it declines — a reader who asked for a
   * still page, or a card with nothing measurable to grow from. FALLING
   * THROUGH TO THE ORDINARY NAVIGATION IS THE POINT: a student who cannot see
   * an animation must never be a student who cannot open a course. */
  const shell = useRef<HTMLDivElement>(null);
  const open = (e: React.MouseEvent) => {
    /* The browser's own gestures stay the browser's. A middle-click, a
       cmd/ctrl-click or a shift-click asks for a new tab or window, and a tab
       that opens onto a morph already half-played is worse than one that
       simply opens. */
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    if (!shell.current) return;
    if (!beginMorphFrom(shell.current, openHref, course.title)) return;
    /* The morph owns the navigation from here — MorphSurface pushes the route
       partway through the growth. Letting the <Link> follow as well would put
       two entries in the history for one tap, so Back would land the student
       on the page they just left. */
    e.preventDefault();
  };

  return (
    <div
      ref={shell}
      className="course-card squircle flex flex-col p-4 lg:p-5"
      /* The course's own hue, read by the card's gradient — and by the light at
         the bottom of the screen it grows into, so the two match because they
         are the same value rather than because anyone remembered. */
      style={{ ["--card-tone" as string]: tone }}
      data-pressable="true"
      onClick={(e) => {
        /* The bar inside the card is a real link and answers for itself.
           Without this check a tap on it would start a morph AND follow the
           link, which is the two-destinations-in-one-shape problem the card
           already had once. */
        if ((e.target as HTMLElement).closest("a,button")) return;
        open(e);
      }}>
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
          onClick={(e) => {
            /* The gate first — a signed-out device's second course still has
               to ask before it goes anywhere, and a morph that plays and then
               lands on a sign-in page is a promise broken mid-animation. */
            gateStepLink(e, openHref);
            open(e);
          }}
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
