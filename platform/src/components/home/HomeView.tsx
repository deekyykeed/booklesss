"use client";

import { useMemo } from "react";
import { COURSES } from "@/lib/courses";
import {
  daysStudiedIn,
  firstTryStats,
  isStudyDay,
  staleLessons,
  studyHistory,
  useProgress,
  weakestLesson,
} from "@/lib/progress";
import { useLiveReaders } from "@/lib/presence";
import { overallPerformance } from "@/lib/performance";
import { labelFor } from "@/lib/course";
import { CourseCard } from "./CourseCard";
import { Spark } from "./Spark";
import { StudyChart } from "./StudyChart";
import { courseTone } from "./tones";


/* ------------------------------------------------------------------ *
 * Home — above the courses, not inside one.
 *
 * Everything shown is derived from the checkpoint store: progress, and the
 * study days it now records. Nothing here is estimated or filled in.
 *
 * What's deliberately absent, because the data for it doesn't exist yet:
 *   - a coaching/AI summary of how the week went. There is no tutor backend,
 *     and no study goal is captured anywhere at sign-up, so any "you're
 *     behind target" line would be invented. The band below states facts
 *     instead — streak, whether you've studied today — until there is a
 *     target to measure against.
 * ------------------------------------------------------------------ */

/* One hue per stat, carried by its sparkline — the reference dashboard does
 * the same across its top row (blue, yellow, cyan). Validated together
 * against the card surface with the dataviz script: lightness band, chroma
 * floor, all-pairs CVD separation and contrast all pass. Green sits on
 * Checkpoints deliberately — completion is the one thing green means across
 * this app, and a cleared checkpoint is exactly that. */
const TONE = {
  days: "#eb6834",
  accuracy: "#17754d",
  debt: "#2a78d6",
  weak: "#4a3aa7",
} as const;

/* Hues live in tones.ts, shared with the study chart so a course's card and
 * its line on the plot always agree. */

/** The reference's anchored delta — "+20% · 25 last week": the movement AND
 *  the number it moved from, so the percentage explains itself. Falls back to
 *  a raw "+n" when last week was zero and no percentage exists. */
function weekFoot(cur: number, prev: number, unit?: string): { lead: string; tail: string; good: boolean } {
  // Pluralised by last week's count, since that's the number printed.
  const u = unit ? ` ${prev === 1 ? unit : `${unit}s`}` : "";
  if (prev > 0) {
    const pct = Math.round(((cur - prev) / prev) * 100);
    return { lead: `${pct > 0 ? "+" : ""}${pct}%`, tail: `${prev}${u} last week`, good: cur > 0 && cur >= prev };
  }
  if (cur > 0) return { lead: `+${cur}`, tail: `0${unit ? ` ${unit}s` : ""} last week`, good: true };
  return { lead: "0", tail: unit ? `${unit}s this week` : "this week", good: false };
}

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeView({
  name,
  afterGreeting,
}: {
  name?: string;
  /** Slot under the greeting — the sign-in prompt when Clerk is on and nobody
   *  is signed in. Kept as a slot so this component stays Clerk-free. */
  afterGreeting?: React.ReactNode;
}) {
  const { hydrated, doneCount, isComplete, streak, daysStudied, studiedToday, days, quiz, touched, done: cleared } =
    useProgress();

  /* Who's reading right now, per course — watching only, this page isn't a
   * reader. Null until presence syncs (or forever if it isn't configured),
   * and the cards show nothing rather than a number nobody measured. */
  const live = useLiveReaders(null);

  /* Each tile's series and its week-over-week movement, from the same day
   * records the streak reads. 14 days: last week vs the week before. */
  const spark = useMemo(() => {
    const h = studyHistory(days, 14);
    // Typed, not inferred: (0 | 1)[] would narrow the rolling sum's
    // accumulator to 0 | 1 and refuse to add past one.
    const qualifying: number[] = h.map((d) => (isStudyDay(d) ? 1 : 0));

    /* A rolling seven-day count of study days, one point per day: it moves
     * every day rather than sawtoothing at a week boundary, so the line reads
     * as effort holding up or slipping. */
    const daysRolling = qualifying.map((_, i) =>
      qualifying.slice(Math.max(0, i - 6), i + 1).reduce((n, v) => n + v, 0),
    );

    const sum = (a: number[]) => a.reduce((n, v) => n + v, 0);
    return {
      daysRolling,
      wDays: { cur: sum(qualifying.slice(7)), prev: sum(qualifying.slice(0, 7)) },
    };
  }, [days]);

  const totals = useMemo(() => {
    const lessons = COURSES.flatMap((c) => c.lessonIds);
    return {
      lessons,
      steps: lessons.length,
      checks: COURSES.reduce((n, c) => n + c.totalCheckpoints, 0),
    };
  }, []);

  const done = useMemo(() => {
    if (!hydrated) return { checks: 0, steps: 0 };
    let checks = 0;
    let steps = 0;
    for (const id of totals.lessons) {
      checks += doneCount(id);
      if (isComplete(id)) steps++;
    }
    return { checks, steps };
  }, [hydrated, doneCount, isComplete, totals]);

  /* Where the reader stands across every course — the chart's headline. Null
   * until hydration, so the server and first client paint agree on "–". */
  const overall = useMemo(
    () => (hydrated ? overallPerformance(days, done.checks, totals.checks) : null),
    [hydrated, days, done.checks, totals.checks],
  );

  /* The four tiles' figures. Each only appears once it has been measured:
   * quiz records and touch dates accrue from the day they shipped, so a fresh
   * reader sees a placeholder rather than a flattering zero. */
  const tiles = useMemo(() => {
    if (!hydrated) return null;
    const answered = firstTryStats(quiz);
    const stale = staleLessons(cleared, touched);
    return {
      weekDays: daysStudiedIn(days, 7),
      answered,
      accuracy: answered.total ? Math.round((answered.first / answered.total) * 100) : null,
      stale,
      weakest: weakestLesson(quiz),
    };
  }, [hydrated, days, quiz, touched, cleared]);

  /* Facts, not encouragement dressed as insight. */
  const line = !hydrated
    ? "Loading your progress…"
    : done.checks === 0
      ? "You haven't started yet — the first step takes about ten minutes."
      : studiedToday
        ? `You've studied today${streak > 1 ? ` — ${streak} days in a row` : ""}. ${done.checks} checkpoints cleared so far.`
        : streak > 0
          ? `${streak}-day streak going. Clear a checkpoint today to keep it.`
          : `${done.checks} checkpoints cleared across ${daysStudied} day${daysStudied === 1 ? "" : "s"}.`;

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 md:px-6">
      <h1 className="font-display text-[30px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
        {hydrated ? timeGreeting() : "Welcome back"}
        {name ? `, ${name}` : ""}
      </h1>
      <p className="mt-1.5 text-[14px] leading-6 text-muted">{line}</p>
      {afterGreeting}

      {/* ---- how the studying is going ---- */}
      <section className="mt-6">
        <h2 className="dash-heading">Your studying</h2>

        {/* Full width above the tiles: the shape of the studying over time
            leads, the tiles below are today's state. Only reading inside a
            lesson is timed, so a flat stretch means nothing was read, not
            that the chart is broken. On phones the card wears the tiles'
            14px padding so the band reads as one set; desktop keeps the
            card's 18px. */}
        <div className="dash-card squircle mt-4 p-3.5 lg:p-[18px]">
          <StudyChart days={days} hydrated={hydrated} perf={overall} />
        </div>

        {/* Tighter gutter on phones so each tile keeps its width at two-up.
            The chart-to-tiles gap matches that gutter on phones — one grid
            rhythm for the whole band — and opens back up on desktop. */}
        <div className="mt-2 grid grid-cols-2 gap-2 lg:mt-5 lg:grid-cols-4 lg:gap-3">
          {/* Showing up — the forgiving twin of the streak, which lives on the
              course cards. Six days out of seven reads as six, not as broken. */}
          <Stat
            hydrated={hydrated}
            label="Days this week"
            value={`${tiles?.weekDays ?? 0}`}
            unit="/ 7"
            tone={TONE.days}
            icon={<CalendarGlyph />}
            series={spark.daysRolling}
            foot={weekFoot(spark.wDays.cur, spark.wDays.prev, "day")}
          />
          {/* Whether it stuck. Every checkpoint is a passed comprehension
              check, so this is the share answered right at the first attempt —
              the one figure here an exam would recognise. */}
          <Stat
            hydrated={hydrated}
            label="First try"
            value={tiles && tiles.accuracy !== null ? `${tiles.accuracy}%` : "–"}
            unit={tiles?.answered.total ? `of ${tiles.answered.total}` : undefined}
            tone={TONE.accuracy}
            icon={<CheckGlyph />}
            series={[]}
            foot={
              tiles?.answered.total
                ? {
                    lead: `${tiles.answered.first} right`,
                    tail: "first time",
                    good: (tiles.accuracy ?? 0) >= 70,
                  }
                : { lead: "None", tail: "answered yet", good: false }
            }
          />
          {/* What is slipping away. Finished steps left alone three weeks or
              more — the only tile that can worsen while you idle, which is
              exactly the warning the others can't give. */}
          <Stat
            hydrated={hydrated}
            label="Going stale"
            value={`${tiles?.stale.length ?? 0}`}
            unit={tiles?.stale.length === 1 ? "step" : "steps"}
            tone={TONE.debt}
            icon={<StopwatchGlyph />}
            series={[]}
            foot={
              tiles?.stale.length
                ? { lead: labelFor(tiles.stale[0].lessonId), tail: `${tiles.stale[0].days} days ago`, good: false }
                : { lead: "Nothing", tail: "needs revisiting", good: true }
            }
          />
          {/* What to fix next: the step answered worst first time. Named only
              once a few questions have been answered there — one miss is a bad
              day, not a weakness. */}
          <Stat
            hydrated={hydrated}
            label="Weakest step"
            value={tiles?.weakest ? `${Math.round((tiles.weakest.first / tiles.weakest.total) * 100)}%` : "–"}
            unit={tiles?.weakest ? "first try" : undefined}
            tone={TONE.weak}
            icon={<TargetGlyph />}
            series={[]}
            foot={
              tiles?.weakest
                ? { lead: labelFor(tiles.weakest.lessonId), tail: "worth another pass", good: false }
                : { lead: "Nothing", tail: "flagged yet", good: true }
            }
          />
        </div>
      </section>

      {/* ---- the courses themselves ---- */}
      <section id="courses" className="mt-8 scroll-mt-20 pb-10">
        <h2 className="dash-heading">My courses</h2>
        <div className="mt-2.5 grid gap-3 md:grid-cols-2">
          {COURSES.map((c) => {
            const cDone = hydrated ? c.lessonIds.reduce((n, id) => n + doneCount(id), 0) : 0;
            const cSteps = hydrated ? c.lessonIds.filter((id) => isComplete(id)).length : 0;
            /* Where the button lands: the step they've started but not
               finished, else the first one they haven't finished. */
            const unfinished = c.lessonIds.filter((id) => !hydrated || !isComplete(id));
            const next = unfinished.find((id) => hydrated && doneCount(id) > 0) ?? unfinished[0] ?? c.lessonIds[0];

            return (
              <CourseCard
                key={c.slug}
                course={c}
                tone={courseTone(c.slug)}
                hydrated={hydrated}
                days={days}
                done={cDone}
                steps={cSteps}
                next={next}
                live={live ? (live[c.slug] ?? 0) : null}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ---------------- stat marks ----------------
 *
 * Solar · Bold Duotone, hand-inlined (via <Icon> the whole ~7,400-icon set
 * would land in this client bundle), 20px, each in its stat's hue. The
 * duotone's own opacity-.5 back layer does the two-tone work: colour the
 * glyph once and it renders as two versions of that colour, the body a
 * lighter step and the detail the rich one — the same pale-to-main pairing
 * the sparkline's gradient uses.
 */

const G = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, className: "shrink-0" } as const;

function CalendarGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724" />
      <path fill="currentColor" opacity=".5" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" />
      <path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
    </svg>
  );
}

function StopwatchGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" d="M12 23a9 9 0 1 0 0-18a9 9 0 0 0 0 18" opacity=".5" />
      <path fill="currentColor" d="M12 9.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75" />
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M9.25 2.75A.75.75 0 0 1 10 2h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" opacity=".5" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
      <path fill="currentColor" d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0" />
    </svg>
  );
}

function TargetGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity=".5" />
      <path fill="currentColor" d="M9.25 12a.75.75 0 0 1 .75-.75h1.25V10a.75.75 0 0 1 1.5 0v1.25H14a.75.75 0 0 1 0 1.5h-1.25V14a.75.75 0 0 1-1.5 0v-1.25H10a.75.75 0 0 1-.75-.75m-7.222.75a10 10 0 0 1 0-1.5H5a.75.75 0 0 1 0 1.5zm10.722 9.222a10 10 0 0 1-1.5 0V19a.75.75 0 0 1 1.5 0zm9.222-10.722a10 10 0 0 1 0 1.5H19a.75.75 0 0 1 0-1.5zM12.75 2.028V5a.75.75 0 0 1-1.5 0V2.028a10 10 0 0 1 1.5 0" />
    </svg>
  );
}

function Stat({
  hydrated,
  label,
  value,
  unit,
  tone,
  icon,
  series,
  foot,
}: {
  /** Until the store has read localStorage the numbers don't exist yet —
   *  the tile shows a quiet dash rather than a zero pretending to be one. */
  hydrated: boolean;
  label: string;
  value: string;
  unit?: string;
  /** The stat's hue — carries the mark and the sparkline. */
  tone: string;
  icon: React.ReactNode;
  /** Last 14 days of this stat, oldest first. */
  series: number[];
  /** One line in the stat's own terms — a percentage means nothing for a
   *  streak, so each tile says what movement actually means for it. `good`
   *  lights the figure in the tile's hue; otherwise it recedes to grey. */
  foot: { lead: string; tail: string; good: boolean };
}) {
  return (
    <div className="dash-stat squircle">
      <Spark series={series} tone={tone} />
      {/* Everything readable sits above the backdrop. */}
      <div className="relative">
        {/* Title and mark share the top row, both hanging from the card's top
            edge — the mark captions the title. */}
        <div className="flex items-start justify-between gap-2">
          <p className="dash-stat-label">{label}</p>
          <span className="shrink-0" style={{ color: tone }}>{icon}</span>
        </div>
        {/* mt-7/mt-2: the number sits low, nearer its footer than the title —
            the air lives between title and figure, not inside the figures. */}
        <p className="mt-7 flex items-baseline gap-1.5">
          {hydrated ? (
            <>
              <span className="dash-stat-value">{value}</span>
              {unit && <span className="dash-stat-unit">{unit}</span>}
            </>
          ) : (
            <span className="dash-stat-value" style={{ color: "var(--color-placeholder)" }}>–</span>
          )}
        </p>
        {/* The footer keeps its line even while loading, so the tile doesn't
            change height when the numbers arrive. */}
        <p className="dash-stat-foot">
          {hydrated ? (
            <>
              <span
                className="dash-stat-lead"
                style={{
                  color: foot.good ? `color-mix(in oklab, ${tone} 82%, #000)` : "var(--color-placeholder)",
                }}
              >
                {foot.lead}
              </span>
              <span className="truncate">{foot.tail}</span>
            </>
          ) : (
            " "
          )}
        </p>
      </div>
    </div>
  );
}
