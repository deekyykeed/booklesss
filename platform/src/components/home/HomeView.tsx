"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { enrolledCourses } from "@/lib/courses";
import { useIdentity } from "@/lib/identity";
import { isStudyDay, studyHistory, useProgress } from "@/lib/progress";
import { overallPerformance, overallScoreHistory } from "@/lib/performance";
import { SolarIcon } from "@/components/icons/solar";
import { SETTINGS_EVENT } from "@/components/identity/pickers";
import { CourseCard } from "./CourseCard";
import { CourseSetup } from "./CourseSetup";
import { pickGreeting, rememberGreeting, renderGreeting, type Greeting } from "./greeting";
import { OfflineTools } from "./OfflineTools";
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

/* One hue per stat — the four validated together against the card surface
 * with the dataviz script (lightness band, chroma floor, all-pairs CVD
 * separation, contrast). Green sits on Coverage: completion is the one thing
 * green means across this app, and coverage is progress straight toward it. */
const TONE = {
  score: "#eb6834", // performance — warm orange
  streak: "#4a3aa7", // showing up — purple
  coverage: "#17754d", // progress to done — green
  time: "#2a78d6", // hours on task — blue
} as const;

/** Reading time as a short human string. */
function fmtTime(secs: number): string {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
}

/* Course hues live in tones.ts, shared by each course's card and its mark. */

type Foot = { lead: string; tail: string; good: boolean };

/**
 * How far a figure has moved since last week, as a share of last week — not as
 * a difference.
 *
 * Owner's call, 2026-08-03, and it was right: the footers used to read
 * "+59 pts" and "+16 this week", and neither says anything a reader can size.
 * A point is an invented unit, and sixteen cleared checkpoints means nothing
 * without knowing whether the total was twenty or two hundred. A percentage of
 * last week is self-scaling: "+19%" is the same size of statement whatever the
 * numbers behind it.
 *
 * The one case a percentage genuinely cannot express is growth from zero — it
 * is not "infinite improvement", it is a first week, so it says so.
 */
function growth(now: number, prev: number, unstarted: string): Foot {
  if (now <= 0 && prev <= 0) return { lead: "Not started", tail: unstarted, good: false };
  if (prev <= 0) return { lead: "First week", tail: "on the board", good: true };
  const pct = Math.round(((now - prev) / prev) * 100);
  if (pct > 0) return { lead: `+${pct}%`, tail: "on last week", good: true };
  if (pct < 0) return { lead: `${pct}%`, tail: "on last week", good: false };
  return { lead: "Level", tail: "with last week", good: true };
}

/**
 * Counts a figure up to its value on first paint.
 *
 * Owner's ask, 2026-08-03, alongside the sparkline drawing itself in: the
 * numbers should climb from zero "but quickly, so that it doesn't waste time".
 * 600ms with an ease-out, so nearly all of the distance is covered in the
 * first third and it never reads as a wait.
 *
 * Runs ONCE, when the store first hydrates — not whenever the value changes.
 * Re-running on change would replay the whole climb every time a checkpoint
 * ticked, which turns a flourish into a distraction while someone is working.
 *
 * Honours the app's Motion setting and the OS preference: with either set to
 * reduced it returns the final value immediately, so nothing is hidden or
 * delayed, only the travel is skipped.
 */
function useCountUp(target: number, run: boolean, ms = 600): number {
  /* Progress 0..1, NOT the number itself. Holding the value here would freeze
     it at whatever the target was when the climb finished: the effect runs
     once, so a checkpoint cleared a minute later would never reach the tile.
     Scaling the live target by the progress means that once progress is 1 the
     tile simply tracks the real figure again. */
  const [p, setP] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;

    /* Reduced motion is a duration of zero rather than an early `setP(1)`:
       setting state synchronously in an effect body is what the lint rule
       forbids, and going through the same frame means one code path instead
       of two. The cost is a single frame before the number lands, which is
       not travel — it is imperceptible. */
    const reduced =
      document.documentElement.dataset.motion === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduced ? 0 : ms;

    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const x = dur <= 0 ? 1 : Math.min(1, (t - t0) / dur);
      // easeOutCubic — fast off the mark, settles onto the number.
      setP(1 - Math.pow(1 - x, 3));
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, ms]);

  return target * p;
}

/** One greeting per visit, held for the life of the mount so it doesn't
 *  change under the reader when progress re-renders the page. Picked in the
 *  initialiser rather than an effect: it is only ever read after `hydrated`,
 *  so the server's value is never rendered and can't mismatch. */
function useGreeting(): Greeting {
  const [g] = useState(pickGreeting);
  useEffect(() => rememberGreeting(g), [g]);
  return g;
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
  const { hydrated, doneCount, isComplete, streak, bestStreak, daysStudied, studiedToday, days } = useProgress();
  const { identity } = useIdentity();
  const greeting = useGreeting();

  /* The courses this student said they're taking — everything below is about
   * these and nothing else. Coverage over a library half of which belongs to
   * another school would be a number nobody could act on. */
  const mine = useMemo(() => enrolledCourses(identity?.courses), [identity?.courses]);

  const totals = useMemo(() => {
    const lessons = mine.flatMap((c) => c.lessonIds);
    return {
      lessons,
      steps: lessons.length,
      checks: mine.reduce((n, c) => n + c.totalCheckpoints, 0),
    };
  }, [mine]);

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

  /* One 14-day series per tile — the mini chart each carries — plus the
   * this-week-vs-last figures its footer reads. Every point is measured: the
   * time is the clock's seconds, coverage is the cumulative checkpoint record,
   * and the streak line is a rolling count of the days that cleared the bar. */
  const charts = useMemo(() => {
    const win = studyHistory(days, 14); // oldest first
    const total = totals.checks;

    // Coverage as it stood each day: today's cleared total, less what was
    // cleared after that day. Ends exactly on today's coverage.
    const coverageSeries = win.map((_, i) => {
      let after = 0;
      for (let j = i + 1; j < win.length; j++) after += win[j].checks;
      return total ? Math.min(1, Math.max(0, done.checks - after) / total) * 100 : 0;
    });

    // Showing up: a rolling seven-day count of qualifying days, so the line
    // reads as consistency holding or slipping rather than a 0/1 sawtooth.
    const q: number[] = win.map((d) => (isStudyDay(d) ? 1 : 0));
    const streakSeries = q.map((_, i) => q.slice(Math.max(0, i - 6), i + 1).reduce((n, v) => n + v, 0));

    return {
      time: win.map((d) => d.secs / 60),
      coverage: coverageSeries,
      streak: streakSeries,
      secsWeek: win.slice(7).reduce((n, d) => n + d.secs, 0),
      secsPrev: win.slice(0, 7).reduce((n, d) => n + d.secs, 0),
      weekChecks: win.slice(7).reduce((n, d) => n + d.checks, 0),
    };
  }, [days, totals.checks, done.checks]);

  const perfSeries = useMemo(
    () => (hydrated ? overallScoreHistory(days, done.checks, totals.checks) : []),
    [hydrated, days, done.checks, totals.checks],
  );

  const coverage = totals.checks ? Math.round((done.checks / totals.checks) * 100) : 0;

  /* Each tile's figure climbing to its value on first paint. One hook per
     tile rather than one for all four: they hold different units, and a
     single shared progress would make them look mechanically locked together
     rather than four things settling. They all start on `hydrated`, so they
     still travel as a set. */
  const climb = {
    score: useCountUp(perf?.score ?? 0, hydrated),
    streak: useCountUp(streak, hydrated),
    coverage: useCountUp(coverage, hydrated),
    secs: useCountUp(charts.secsWeek, hydrated),
  };
  const minWeek = Math.round(charts.secsWeek / 60);
  const minPrev = Math.round(charts.secsPrev / 60);

  /* Facts, not encouragement dressed as insight. */
  const line = !hydrated
    ? "Loading your progress…"
    : done.checks === 0
      ? "You haven't started yet — the first step takes about ten minutes."
      : studiedToday
        ? `You've studied today${streak > 1 ? ` — ${streak} days in a row` : ""}. ${done.checks} sections done so far.`
        : streak > 0
          ? `${streak}-day streak going. Do a section today to keep it.`
          : `${done.checks} sections done across ${daysStudied} day${daysStudied === 1 ? "" : "s"}.`;

  return (
    /* Extra room above the greeting: it sat tight under the chrome, and the
       first thing on the page reads better with air over it than the rest of
       the page does between its sections. Bottom padding is unchanged.

       No landing intro here any more: this page briefly carried one for
       signed-out strangers (the Google OAuth branding fix), and it moved to
       the real landing at "/" the same day when the dashboard moved to
       /home. This page is only ever the student's own home now. */
    <div className="mx-auto w-full max-w-[900px] px-4 pb-10 pt-28 md:px-6 md:pt-36">
      <h1 className="font-display text-[30px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
        {/* The name is no longer appended here. Each greeting decides where it
            goes — front, back, or not at all — so the line reads as written
            instead of always ending ", Deeky". See greeting.ts.
            The name they typed into the form beats the one Clerk inferred from
            an email address; they chose one of them. */}
        {/* The placeholder is "Welcome", not "Welcome back" — before hydration
            nothing knows whether this device has ever been here, and the one
            greeting that must never flash at a stranger is a claim to know
            them (rule 3 in greeting.ts). */}
        {hydrated ? renderGreeting(greeting, identity?.name ?? name) : "Welcome"}
      </h1>
      <p className="mt-1.5 text-[14px] leading-6 text-muted">{line}</p>
      {afterGreeting}

      {/* ---- how the studying is going ---- */}
      <section className="mt-6">
        <h2 className="dash-heading">Your studying</h2>

        {/* Four tiles, effort first: three of the four count what you did —
            turned up, put in the hours, worked through the course — and only
            the score folds in how much is finished, at a quarter of its weight.
            Each carries its own 14-day mini chart. Tighter gutter on phones so
            each keeps its width at two-up. */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {/* 1. Performance — the headline blend, weighted toward effort:
              showing up and this week's work are three-quarters of it. Its
              chart is that same score recomputed for each of the last 14 days. */}
          <Stat
            hydrated={hydrated}
            label="Performance"
            /* A dash until something is cleared: a confident 0% reads as a mark
               awarded when nothing has been measured yet. */
            value={perf && done.checks > 0 ? `${Math.round(climb.score)}%` : "–"}
            tone={TONE.score}
            icon={<SolarIcon name="chart-2-bold-duotone" size={20} className="shrink-0" />}
            series={perfSeries}
            foot={
              perf && done.checks > 0
                ? growth(perf.score, perf.prev, "nothing yet")
                : { lead: "Not started", tail: "nothing yet", good: false }
            }
          />
          {/* 2. Streak — the purest reward for turning up: it moves on effort
              alone and never touches whether anything was understood. The chart
              is a rolling count of the days you showed up. */}
          <Stat
            hydrated={hydrated}
            label="Streak"
            value={`${Math.round(climb.streak)}`}
            unit={streak === 1 ? "day" : "days"}
            tone={TONE.streak}
            icon={<SolarIcon name="bolt-bold-duotone" size={20} className="shrink-0" />}
            series={charts.streak}
            foot={
              bestStreak > 0
                ? { lead: `${bestStreak} best`, tail: "days so far", good: streak > 0 }
                : { lead: "None", tail: "studied yet", good: false }
            }
          />
          {/* 3. Coverage — how much of the course you've worked through:
              sections answered over all sections. The chart is that share
              climbing day by day. */}
          <Stat
            hydrated={hydrated}
            label="Coverage"
            value={done.checks > 0 ? `${Math.round(climb.coverage)}%` : "–"}
            tone={TONE.coverage}
            icon={<SolarIcon name="notebook-minimalistic-bold-duotone" size={20} className="shrink-0" />}
            series={charts.coverage}
            /* Growth on the raw counts, which is identical to growth on the
               percentages — same denominator top and bottom, so it cancels. */
            foot={growth(done.checks, done.checks - charts.weekChecks, "added yet")}
          />
          {/* 4. Time this week — the clock's own measurement, surfaced at last.
              It undercounts on purpose (see StudyClock), so the number is only
              ever honest. The chart is the minutes read each day. */}
          <Stat
            hydrated={hydrated}
            label="Time this week"
            value={charts.secsWeek > 0 ? fmtTime(climb.secs) : "–"}
            tone={TONE.time}
            icon={<SolarIcon name="clock-circle-bold-duotone" size={20} className="shrink-0" />}
            series={charts.time}
            foot={
              minPrev > 0
                ? {
                    lead: `${minWeek >= minPrev ? "+" : ""}${minWeek - minPrev}m`,
                    tail: "vs last week",
                    good: minWeek >= minPrev && minWeek > 0,
                  }
                : minWeek > 0
                  ? { lead: `+${minWeek}m`, tail: "first week", good: true }
                  : { lead: "None", tail: "logged yet", good: false }
            }
          />
        </div>
      </section>

      {/* Asks a signed-in reader which courses they take, once, and renders
          nothing for everybody else. Mounted here because the dashboard is
          where the answer matters and where an unanswered account inevitably
          lands — see the note in CourseSetup for why it is not a redirect. */}
      <CourseSetup />

      {/* ---- the courses themselves ---- */}
      <section id="courses" className="mt-8 scroll-mt-20 pb-10">
        {/* A reader who has not answered sees the whole library — anonymous
            reading asks nothing — so this says which of the two it is,
            because "My courses" over every course we publish is a claim they
            never made. Narrowing sits on the list itself: Settings, opened
            with its course row already unfolded. */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="dash-heading">{identity?.courses.length ? "My courses" : "All courses"}</h2>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { step: "courses" } }))
            }
            className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            Change
          </button>
        </div>
        <div className="mt-2.5 grid gap-3 md:grid-cols-2">
          {mine.map((c) => {
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

        {/* Under the courses on purpose: it's about the courses, and it must
            not be the first thing between a reader and opening one. */}
        <div className="mt-3">
          <OfflineTools />
        </div>
      </section>

      {/* The quiet legal line. On the home page rather than only in Google's
          consent screen, because a page asking people to read and pay should
          say where its rules are without being asked. */}
      <footer className="mt-4 flex items-center gap-4 border-t border-line pt-5 text-[12.5px] text-muted">
        <span>Booklesss</span>
        <Link href="/privacy" className="transition-colors hover:text-ink">
          Privacy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-ink">
          Terms
        </Link>
      </footer>
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
