"use client";

import { useMemo } from "react";
import { COURSES } from "@/lib/courses";
import { graspStats, staleLessons, useProgress, weakestLesson } from "@/lib/progress";
import { overallPerformance, type Performance } from "@/lib/performance";
import { MynaIcon } from "@/components/icons/myna";
import { labelFor } from "@/lib/course";
import { CourseCard } from "./CourseCard";
import { Spark } from "./Spark";
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

/* One hue per stat. Validated together against the card surface with the
 * dataviz script: lightness band, chroma floor, all-pairs CVD separation and
 * contrast all pass — so the four hues stay as a set even as the stats they
 * carry change. Green sits on "Got it" deliberately: completion is the one
 * thing green means across this app, and a section the reader says landed is
 * exactly that. The score wears the warm orange the days tile used to. */
const TONE = {
  score: "#eb6834",
  accuracy: "#17754d",
  debt: "#2a78d6",
  weak: "#4a3aa7",
} as const;

/* Course hues live in tones.ts, shared by each course's card and its mark. */

/** The score tile's footer: where the number has moved to, in points. A score
 *  nobody has earned yet says so rather than reporting a flat week — with
 *  nothing cleared there is no previous score to have moved from. */
function scoreFoot(perf: Performance | null, cleared: number): { lead: string; tail: string; good: boolean } {
  if (!perf || cleared === 0) return { lead: "Not started", tail: "nothing yet", good: false };
  if (perf.delta > 0) return { lead: `+${perf.delta} pts`, tail: "on last week", good: true };
  if (perf.delta < 0) return { lead: `${perf.delta} pts`, tail: "on last week", good: false };
  return { lead: "Level", tail: "with last week", good: true };
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
  const { hydrated, doneCount, isComplete, streak, daysStudied, studiedToday, days, grasp, touched, done: cleared } =
    useProgress();

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

  /* The overall score — one figure for "how am I doing" across every course.
   * Each term in it is measured and recomputable by hand (see lib/performance):
   * how much of the library is covered, how many days were studied this week,
   * how many checkpoints were cleared this week. Its delta is the same score
   * recomputed as it stood seven days ago, so the movement is a comparison
   * rather than a guess. */
  const perf = useMemo(
    () => (hydrated ? overallPerformance(days, done.checks, totals.checks) : null),
    [hydrated, days, done.checks, totals.checks],
  );

  /* The four tiles' figures. Each only appears once it has been measured:
   * answers and touch dates accrue from the day they shipped, so a fresh
   * reader sees a placeholder rather than a flattering zero. */
  const tiles = useMemo(() => {
    if (!hydrated) return null;
    const answered = graspStats(grasp);
    const stale = staleLessons(cleared, touched);
    return {
      answered,
      landed: answered.total ? Math.round((answered.got / answered.total) * 100) : null,
      stale,
      weakest: weakestLesson(grasp),
    };
  }, [hydrated, grasp, touched, cleared]);

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

        {/* The tiles are the band now — today's state, four figures, no plot
            above them. Tighter gutter on phones so each tile keeps its width
            at two-up; the heading-to-tiles gap matches "My courses" below, so
            both sections hang off their heading the same way. */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {/* The headline figure, and the only tile that reads the others'
              ingredients at once: coverage, showing up, and checkpoints cleared
              this week. It leads the row because it's the answer a student
              actually wants. */}
          <Stat
            hydrated={hydrated}
            label="Overall score"
            /* A dash until something has been cleared, like the tiles beside
               it: a confident 0 out of 100 reads as a mark awarded, when in
               fact nothing has been measured yet. */
            value={perf && done.checks > 0 ? `${perf.score}` : "–"}
            unit={perf && done.checks > 0 ? "/ 100" : undefined}
            tone={TONE.score}
            icon={<MynaIcon name="chart-bar-increasing" size={20} className="shrink-0" />}
            series={[]}
            foot={scoreFoot(perf, done.checks)}
          />
          {/* Whether it stuck — the share of finished sections the reader
              said they got, from the answer at the end of each one. Their own
              verdict, not a test result, which is the only claim the app can
              honestly make about understanding today. */}
          <Stat
            hydrated={hydrated}
            label="Got it"
            value={tiles && tiles.landed !== null ? `${tiles.landed}%` : "–"}
            unit={tiles?.answered.total ? `of ${tiles.answered.total}` : undefined}
            tone={TONE.accuracy}
            icon={<MynaIcon name="check-circle" size={20} className="shrink-0" />}
            series={[]}
            foot={
              tiles?.answered.total
                ? {
                    lead: `${tiles.answered.got} landed`,
                    tail: `of ${tiles.answered.total} answered`,
                    good: (tiles.landed ?? 0) >= 70,
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
            icon={<MynaIcon name="clock-1" size={20} className="shrink-0" />}
            series={[]}
            foot={
              tiles?.stale.length
                ? { lead: labelFor(tiles.stale[0].lessonId), tail: `${tiles.stale[0].days} days ago`, good: false }
                : { lead: "Nothing", tail: "needs revisiting", good: true }
            }
          />
          {/* What to fix next: the step whose sections landed worst. Named
              only once a few of them have been answered there — one "not yet"
              is a hard section, not a weak step. */}
          <Stat
            hydrated={hydrated}
            label="Weakest step"
            value={tiles?.weakest ? `${Math.round((tiles.weakest.got / tiles.weakest.total) * 100)}%` : "–"}
            unit={tiles?.weakest ? "got it" : undefined}
            tone={TONE.weak}
            icon={<MynaIcon name="target" size={20} className="shrink-0" />}
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
              />
            );
          })}
        </div>
      </section>
    </div>
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
