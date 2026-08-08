"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gateStepLink } from "@/lib/account";
import { enrolledCourses } from "@/lib/courses";
import { labelFor, pathForId } from "@/lib/course";
import { useIdentity } from "@/lib/identity";
import { isStudyDay, studyHistory, useProgress } from "@/lib/progress";
import { overallPerformance, overallScoreHistory } from "@/lib/performance";
import { ActionBar } from "@/components/ui/ActionBar";
import { SolarIcon } from "@/components/icons/solar";
import { CoursesSection } from "./CoursesSection";
import { pickGreeting, rememberGreeting, renderGreeting, type Greeting } from "./greeting";
import { OfflineTools } from "./OfflineTools";
import { Spark } from "./Spark";


/* ------------------------------------------------------------------ *
 * Home — above the courses, not inside one.
 *
 * Everything shown is derived from the checkpoint store: progress, and the
 * study days it now records. Nothing here is estimated or filled in.
 *
 * What's deliberately absent, because the data for it doesn't exist yet:
 *   - a coaching/AI summary of how the week went. There is no tutor backend,
 *     so any "here's what to focus on" prose would be invented.
 *
 * (This note used to also claim no study goal was captured anywhere. That
 * stopped being true when onboarding's weekly-goal question shipped:
 * `identity.target` holds the days and minutes the student promised,
 * lib/performance scores against it, and the time tile below reads "of" it.
 * The claim outlived the code by days and nearly steered an edit wrong —
 * hence this correction rather than a silent deletion.)
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

/** Reading time as a short human string. Floors at one minute: this is only
 *  ever called with a positive figure, and "0 min" printed over a number the
 *  reader knows is real reads as the app losing their time. */
function fmtTime(secs: number): string {
  const m = Math.max(1, Math.round(secs / 60));
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
  const { hydrated, doneCount, isComplete, streak, bestStreak, daysStudied, studiedToday, days, totalSecs, last, grasp } =
    useProgress();
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
    () => (hydrated ? overallPerformance(days, done.checks, totals.checks, identity?.target) : null),
    [hydrated, days, done.checks, totals.checks, identity?.target],
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
    () => (hydrated ? overallScoreHistory(days, done.checks, totals.checks, 14, identity?.target) : []),
    [hydrated, days, done.checks, totals.checks, identity?.target],
  );

  const coverage = totals.checks ? Math.round((done.checks / totals.checks) * 100) : 0;

  /* "STARTED" MEANS ANY RECORDED SIGNAL — a cleared checkpoint, a study day,
   * or time on the clock. It used to mean checkpoints alone, and the page
   * contradicted itself in one screenful (owner's own dashboard, 2026-08-08):
   * "You haven't started yet" over a 2-day streak and 2h 26m, because the
   * subline, Performance and Coverage all keyed on `done.checks` while the
   * tiles beside them keyed on reading. A student who reads without ticking
   * was told they hadn't started by a page showing them studying. */
  const started = done.checks > 0 || daysStudied > 0 || totalSecs > 0;

  /* The week the student promised, as minutes — `target.minutes` is per study
   * day, so the week is the two multiplied (same arithmetic as lib/performance's
   * weeklyTarget, NOT its fallbacks: a goal nobody set is not shown as if they
   * set it). Zero when onboarding's goal question was never answered. */
  const goalMins = identity?.target ? identity.target.days * identity.target.minutes : 0;

  /* THE SHAKY QUEUE. Every "how did this land" answer is stored per section
   * (grasp), and until 2026-08-08 nothing ever offered it back — which made
   * answering honestly decorative. "Almost" and "not yet" both count: both are
   * the reader saying it hasn't stuck. Scoped to enrolled courses, like every
   * other figure on this page. */
  const shaky = useMemo(() => {
    if (!hydrated) return { total: 0, rows: [] as { id: string; n: number }[] };
    const mineIds = new Set(totals.lessons);
    const rows: { id: string; n: number }[] = [];
    for (const [lessonId, row] of Object.entries(grasp)) {
      if (!mineIds.has(lessonId)) continue;
      const n = Object.values(row).filter((g) => g !== "got").length;
      if (n > 0) rows.push({ id: lessonId, n });
    }
    // Worst first — the step with the most shaky sections is the one to reopen.
    rows.sort((a, b) => b.n - a.n);
    return { total: rows.reduce((s, r) => s + r.n, 0), rows };
  }, [hydrated, grasp, totals.lessons]);

  /* The jump-back target: the exact step last open with reading or work
   * recorded against it (lib/progress `last`). Label resolved defensively —
   * a step can be unpublished between visits, and a bar pointing at a page
   * that no longer exists is worse than no bar. */
  const lastLabel = hydrated && last ? labelFor(last.id) : null;

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

  /* Facts, not encouragement dressed as insight. Where no checkpoint is
     ticked yet the fact is the reading time — never "you haven't started"
     over a page whose tiles show studying (see `started` above). */
  const line = !hydrated
    ? "Loading your progress…"
    : !started
      ? "You haven't started yet — the first step takes about ten minutes."
      : studiedToday
        ? `You've studied today${streak > 1 ? ` — ${streak} days in a row` : ""}. ${
            done.checks > 0 ? `${done.checks} sections done so far.` : `${fmtTime(totalSecs)} read so far.`
          }`
        : streak > 0
          ? `${streak}-day streak going. Do a section today to keep it.`
          : done.checks > 0
            ? `${done.checks} sections done across ${daysStudied} day${daysStudied === 1 ? "" : "s"}.`
            : daysStudied > 0
              ? `${fmtTime(totalSecs)} read across ${daysStudied} day${daysStudied === 1 ? "" : "s"}.`
              : `${fmtTime(totalSecs)} read so far.`;

  return (
    /* Extra room above the greeting: it sat tight under the chrome, and the
       first thing on the page reads better with air over it than the rest of
       the page does between its sections. Bottom padding is unchanged.

       No landing intro here any more: this page briefly carried one for
       signed-out strangers (the Google OAuth branding fix), and it moved to
       the real landing at "/" the same day when the dashboard moved to
       /dashboard. This page is only ever the student's own home now. */
    <div className="mx-auto w-full max-w-[900px] px-4 pb-10 pt-28 md:px-6 md:pt-36">
      <h1 className="font-display text-[30px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
        {/* The name is no longer appended here. Each greeting decides where it
            goes — front, back, or not at all — so the line reads as written
            instead of always ending ", Deeky". See greeting.ts.

            THE ACCOUNT'S NAME COMES FIRST (owner, 2026-08-04, on reaching the
            dashboard after the first completed sign-up: "I don't see my
            username that I would have used for Clerk"). This read
            `identity?.name ?? name`, and identity.name is the name of the
            AVATAR this device was assigned — "Astronaut", "Rainbow" — which is
            never empty. So it always won, and the one thing it beat was the
            student's real name. Somebody who has just handed over an email
            address and typed who they are was greeted as a cartoon.

            The assigned name is still the fallback, and still right for the
            reader who never made an account: it is a name we gave them so the
            app would not have to ask, not a name they chose. `name` is the
            first rung of HomeViewWithUser's ladder — Clerk's firstName, then
            fullName, then username, then the local part of the address — so
            "no name at all" already means Clerk knows nothing about them. */}
        {/* The placeholder is "Welcome", not "Welcome back" — before hydration
            nothing knows whether this device has ever been here, and the one
            greeting that must never flash at a stranger is a claim to know
            them (rule 3 in greeting.ts). */}
        {hydrated ? renderGreeting(greeting, name ?? identity?.name) : "Welcome"}
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
            /* A dash until anything is RECORDED — not until something is
               ticked. Three-quarters of this score is effort, which a reader
               racks up without touching a checkpoint, so gating it on
               `done.checks` showed "Not started" to somebody two study days
               in. */
            value={perf && started ? `${Math.round(climb.score)}%` : "–"}
            tone={TONE.score}
            icon={<SolarIcon name="chart-2-bold-duotone" size={20} className="shrink-0" />}
            series={perfSeries}
            foot={
              perf && started
                ? growth(perf.score, perf.prev, "nothing yet")
                : { lead: "Not started", tail: "nothing yet", good: false }
            }
          />
          {/* 2. Streak — the purest reward for turning up: it moves on effort
              alone and never touches whether anything was understood. The chart
              is a rolling count of the days you showed up.

              A week-of-squares grid replaced the number here for a few hours
              on 2026-08-08 and the owner reverted it same day ("the streak
              card can go back to what it originally was") — it also stretched
              every tile in the row, which is why Stat's height is now pinned.
              Don't re-attempt it inside this tile. */}
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
            /* 0% once anything is recorded — for a reader mid-study with
               nothing ticked, "0% covered · none ticked yet" is the true
               state, where a dash was the tile refusing to believe the
               studying happening one tile over. The dash still holds before
               any signal at all. */
            value={started ? `${Math.round(climb.coverage)}%` : "–"}
            tone={TONE.coverage}
            icon={<SolarIcon name="notebook-minimalistic-bold-duotone" size={20} className="shrink-0" />}
            series={charts.coverage}
            /* Growth on the raw counts, which is identical to growth on the
               percentages — same denominator top and bottom, so it cancels. */
            foot={
              done.checks > 0
                ? growth(done.checks, done.checks - charts.weekChecks, "added yet")
                : started
                  ? { lead: "None", tail: "ticked yet", good: false }
                  : { lead: "Not started", tail: "added yet", good: false }
            }
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
            /* THE FOOTER IS THE GOAL (owner, 2026-08-08: it read "+56m first
               week" — "just say of 7h 30m or whatever the target was"). The
               goal they set at onboarding, on the bottom line, lit in the
               tile's hue the week it is actually met. It first rode beside
               the number as a unit; the owner moved it down here the same
               day. Only when they set one — lib/performance's fallback
               target stays internal, because printing it would put a promise
               in their mouth. The vs-last-week delta survives just for the
               goalless. */
            foot={
              goalMins > 0
                ? { lead: `of ${fmtTime(goalMins * 60)}`, tail: "", good: minWeek >= goalMins }
                : minPrev > 0
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

        {/* THE SHAKY QUEUE, OFFERED BACK (owner, 2026-08-08: "that's great,
            add this"). Sections answered "almost" or "not yet", as a
            disclosure under the tiles they qualify — closed it is one honest
            line, open it is the revision list, each row the step to reopen.
            Absent entirely at zero: an empty revision queue is not a state,
            it is the goal. */}
        {shaky.total > 0 && (
          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-[13.5px] leading-6 text-muted [&::-webkit-details-marker]:hidden">
              <span className="font-medium text-ink">
                {shaky.total} section{shaky.total === 1 ? "" : "s"}
              </span>{" "}
              marked shaky —{" "}
              <span className="underline underline-offset-2 group-open:no-underline">review them</span>
            </summary>
            <ul className="mt-1.5">
              {shaky.rows.map((r) => (
                <li key={r.id}>
                  <Link
                    href={pathForId(r.id)}
                    onClick={(e) => gateStepLink(e, pathForId(r.id))}
                    className="flex items-center justify-between gap-3 py-1 text-[13px] leading-5 text-muted transition-colors hover:text-ink"
                  >
                    <span className="min-w-0 truncate">{labelFor(r.id)}</span>
                    <span className="shrink-0 tabular-nums text-placeholder">{r.n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {/* The courses question used to be asked here, by a modal over this
          page (CourseSetup, deleted 2026-08-04). It asked one of onboarding's
          three questions with the unfinished dashboard visible behind it, and
          the two questions it didn't ask — the school and the study plan —
          had no gate at all. /onboarding asks all three now, and
          RequireOnboarding means this component never renders without them. */}
      {/* ---- the courses themselves ----
          Three tabs, one list: Active, Pipeline, Completed. The heading, the
          Change link, the grid and the pipeline all moved into CoursesSection
          on 2026-08-07 — they are one control now, and splitting the tabs
          from the list they filter across two files would mean this component
          holding tab state it has no other use for.

          WHAT WENT WITH THEM: the `<details>` disclosure that sat under the
          grid (PendingCourses, deleted). Its whole job — showing the timetable
          we haven't written — is the Pipeline tab now, as real cards rather
          than a collapsed list. Its standing rule about never inventing a
          build date carried over; see PipelineCard.

          mt-14, UP FROM mt-8 (owner, 2026-08-07: "add more space between the
          stats and where the courses start"). The stats section above ends in
          a row of four tiles and this one opens on a row of tabs — two bands
          of small type with nothing between them, so at 32px they read as one
          continuous block of chrome. The gap is now clearly larger than the
          gap BETWEEN the tiles, which is what makes it a section break rather
          than another row. */}
      <section id="courses" className="mt-14 scroll-mt-20 pb-10">
        {/* JUMP BACK IN (owner, 2026-08-08: "sounds good add it") — one tap to
            the exact step last open, above the tabs, because the dashboard's
            first job is resuming and the old shortest path was greeting →
            scroll → find the card → Resume. Reads the store's `last` record,
            which follows the reading clock — so it points at where the reader
            actually was, ticked or not. Absent until a step has been read
            (nothing to jump back INTO), and absent for records from before
            `last` shipped, which self-heal on the next study. */}
        {lastLabel && last && (
          <ActionBar
            href={pathForId(last.id)}
            onClick={(e) => gateStepLink(e, pathForId(last.id))}
            prefix="Jump back in · "
            label={`Jump back in — ${lastLabel}`}
            className="mb-4"
          >
            {lastLabel}
          </ActionBar>
        )}
        <CoursesSection
          mine={mine}
          hydrated={hydrated}
          doneCount={doneCount}
          isComplete={isComplete}
          days={days}
        />

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
    /* FIXED HEIGHT (owner, 2026-08-08: "take them back to what they were and
       make them fixed"). 130px is the tile's natural height — 20 label row +
       28 + 30 value + 8 + 15 foot + 26 padding + 2 border — pinned so no
       tile's content can ever stretch the whole row again, which is what the
       short-lived week-squares experiment did. Anything new a tile wants to
       draw has to fit THIS box, not grow it. */
    <div className="dash-stat squircle h-[130px]">
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
