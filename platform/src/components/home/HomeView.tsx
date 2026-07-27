"use client";

import Link from "next/link";
import { useId, useMemo } from "react";
import { COURSES } from "@/lib/courses";
import { checkpointsFor, labelFor, pathForId } from "@/lib/course";
import { isStudyDay, streakSeries, studyHistory, useProgress } from "@/lib/progress";
import { CompletionRing } from "@/components/reader/CompletionRing";
import { smoothPath, StudyChart } from "./StudyChart";

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
  streak: "#eb6834",
  days: "#2a78d6",
  checks: "#17754d",
  steps: "#4a3aa7",
} as const;

/** Total reading time, for the chart's caption. */
function fmtTotal(secs: number): string {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
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
  const { hydrated, doneCount, isComplete, streak, bestStreak, daysStudied, studiedToday, totalSecs, days } =
    useProgress();

  /* Each tile's series and its week-over-week movement, all measured with
   * the same isStudyDay test the streak uses, so no two tiles can disagree
   * about what counted as a day. 14 days: last week vs the week before. */
  const spark = useMemo(() => {
    const h = studyHistory(days, 14);
    const checksDaily = h.map((d) => d.checks);
    const stepsDaily = h.map((d) => d.steps);
    const streaks = streakSeries(days, 14);
    const qualifying = h.map((d) => (isStudyDay(d) ? 1 : 0));

    // Days studied is cumulative — the count as it stood at each day's end,
    // including every qualifying day before the window.
    const inWindow = new Set(h.map((d) => d.date));
    let acc = Object.entries(days).filter(([date, d]) => isStudyDay(d) && !inWindow.has(date)).length;
    const cumDays = h.map((d) => (acc += isStudyDay(d) ? 1 : 0));

    const sum = (a: number[]) => a.reduce((n, v) => n + v, 0);
    return {
      checksDaily,
      stepsDaily,
      streaks,
      cumDays,
      dChecks: weekDelta(sum(checksDaily.slice(7)), sum(checksDaily.slice(0, 7))),
      dSteps: weekDelta(sum(stepsDaily.slice(7)), sum(stepsDaily.slice(0, 7))),
      dDays: weekDelta(sum(qualifying.slice(7)), sum(qualifying.slice(0, 7))),
      dStreak: weekDelta(streaks[13] ?? 0, streaks[6] ?? 0),
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
        <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Current streak"
            value={String(streak)}
            unit={streak === 1 ? "day" : "days"}
            tone={TONE.streak}
            series={spark.streaks}
            delta={spark.dStreak}
          />
          <Stat
            label="Days studied"
            value={String(daysStudied)}
            unit={daysStudied === 1 ? "day" : "days"}
            tone={TONE.days}
            series={spark.cumDays}
            delta={spark.dDays}
          />
          <Stat
            label="Checkpoints"
            value={`${done.checks}`}
            unit={`/ ${totals.checks}`}
            tone={TONE.checks}
            series={spark.checksDaily}
            delta={spark.dChecks}
          />
          <Stat
            label="Steps complete"
            value={`${done.steps}`}
            unit={`/ ${totals.steps}`}
            tone={TONE.steps}
            series={spark.stepsDaily}
            delta={spark.dSteps}
          />
        </div>

        {/* Full width under the tiles: the tiles are today's state, this is the
            shape of it over time. Only reading inside a lesson is timed, so a
            flat stretch means nothing was read, not that the chart is broken. */}
        <div className="dash-card squircle mt-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[15px] font-semibold leading-tight text-ink">Time studied</h3>
            <p className="shrink-0 text-[12px] text-placeholder">
              {totalSecs > 0 ? `${fmtTotal(totalSecs)} over 30 days` : "Last 30 days"}
            </p>
          </div>
          <div className="mt-1">
            <StudyChart days={days} hydrated={hydrated} />
          </div>
        </div>
      </section>

      {/* ---- the courses themselves ---- */}
      <section id="courses" className="mt-8 scroll-mt-20 pb-10">
        <h2 className="dash-heading">My courses</h2>
        <div className="mt-2.5 flex flex-col gap-3">
          {COURSES.map((c) => {
            const cDone = hydrated ? c.lessonIds.reduce((n, id) => n + doneCount(id), 0) : 0;
            const cSteps = hydrated ? c.lessonIds.filter((id) => isComplete(id)).length : 0;
            const ratio = c.totalCheckpoints ? cDone / c.totalCheckpoints : 0;
            const started = c.lessonIds.filter((id) => !hydrated || !isComplete(id));
            const next = started.find((id) => hydrated && doneCount(id) > 0) ?? started[0] ?? c.lessonIds[0];

            return (
              <div key={c.slug} className="dash-card squircle">
                {/* Stacks below sm, one row from sm up. NOT flex-wrap: the text
                    column is flex-basis 0, so it never overflows the line and
                    never triggers a wrap — it just gets squeezed to whatever
                    the fixed-width buttons leave, one word per line. Whether a
                    card survived depended on how wide its button labels were. */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <CompletionRing value={ratio} size={48} stroke={4} className="text-ink" />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[18px] font-semibold leading-tight text-ink">{c.title}</p>
                      <p className="mt-0.5 text-[13px] leading-5 text-muted">{c.subtitle}</p>
                      <p className="mt-1 text-[12.5px] text-placeholder">
                        {cSteps} of {c.lessonIds.length} steps · {cDone} of {c.totalCheckpoints} checkpoints
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link href={`/${c.slug}`} className="step-complete-btn squircle">
                      Course home
                    </Link>
                    <Link href={pathForId(next)} className="dash-cta squircle">
                      {cDone > 0 ? "Continue" : "Start"}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {cDone > 0 && (
                  <p className="mt-3.5 truncate text-xs text-placeholder">
                    Next · {labelFor(next)} ({doneCount(next)}/{checkpointsFor(next).length})
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ---------------- the reference tile, piece by piece ----------------
 *
 * Copied from the reference card: label top-left with clear air under it, the
 * value large on the left, a small area sparkline on the right with its peak
 * marked and labelled, and a footer of trend icon + delta + "last week".
 *
 * The footer icon is Solar Line "Graph Up"/"Graph Down" — the rounded square
 * is part of the glyph itself, not a container drawn around it. Green when
 * the week improved, the house red when it fell, grey when flat. Inlined
 * because <Icon> would pull the whole Solar set into this client bundle.
 */

function TrendGlyph({ dir }: { dir: 1 | 0 | -1 }) {
  const color = dir > 0 ? "#17754d" : dir < 0 ? "var(--color-danger)" : "var(--color-placeholder)";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0" style={{ color }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
        {dir < 0 ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="m7 10l2.293 2.293a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 1 1.414 0L17 14m0 0v-2.5m0 2.5h-2.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="m7 14l2.293-2.293a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 0 1.414 0L17 10m0 0v2.5m0-2.5h-2.5" />
        )}
      </g>
    </svg>
  );
}

/* The tile's own graph: last 14 days of the stat, gradient wash under a
 * smooth line (same monotone-cubic as the big chart, so a sparkline can't
 * overshoot its data either), peak day marked with a dot on a hairline and
 * labelled with its value. Decorative supplement — the numbers it summarises
 * are the text beside it. */
function Spark({ series, tone }: { series: number[]; tone: string }) {
  const id = useId();
  const W = 104;
  const H = 58;
  const TOP = 16; // room for the peak label
  const max = Math.max(...series);
  if (series.length < 2 || max <= 0) return <span aria-hidden="true" style={{ width: W }} className="shrink-0" />;

  const n = series.length;
  const pts = series.map((v, i) => ({
    x: 2 + (i * (W - 4)) / (n - 1),
    y: TOP + (1 - v / max) * (H - TOP - 2),
  }));
  const line = smoothPath(pts);
  const area = `${line} L${pts[n - 1].x.toFixed(1)} ${H} L${pts[0].x.toFixed(1)} ${H} Z`;
  const peak = series.indexOf(max);
  const labelX = Math.min(Math.max(pts[peak].x, 12), W - 12);

  return (
    <svg width={W} height={H} aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone} stopOpacity="0.22" />
          <stop offset="1" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <line x1={pts[peak].x} x2={pts[peak].x} y1={pts[peak].y} y2={H - 1} stroke="var(--color-line-2)" strokeWidth="1" />
      <path d={line} fill="none" stroke={tone} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[peak].x} cy={pts[peak].y} r="3.5" fill={tone} stroke="#ffffff" strokeWidth="2" />
      <text x={labelX} y={10.5} textAnchor="middle" className="fill-[var(--color-ink)] text-[10px] font-semibold">
        {max}
      </text>
    </svg>
  );
}

/** Week-over-week movement, phrased like the reference: a percentage when
 *  last week gives a denominator, the raw count when it doesn't. Measured
 *  both sides — never a projection. */
function weekDelta(cur: number, prev: number): { text: string; dir: 1 | 0 | -1 } {
  if (prev > 0) {
    const pct = Math.round(((cur - prev) / prev) * 100);
    return { text: `${pct > 0 ? "+" : ""}${pct}%`, dir: pct > 0 ? 1 : pct < 0 ? -1 : 0 };
  }
  if (cur > 0) return { text: `+${cur}`, dir: 1 };
  return { text: "0", dir: 0 };
}

function Stat({
  label,
  value,
  unit,
  tone,
  series,
  delta,
}: {
  label: string;
  value: string;
  unit?: string;
  /** The stat's hue — carries the sparkline. */
  tone: string;
  /** Last 14 days of this stat, oldest first. */
  series: number[];
  delta: { text: string; dir: 1 | 0 | -1 };
}) {
  return (
    <div className="dash-stat squircle">
      <p className="dash-stat-label">{label}</p>
      {/* The air between the title and the number is part of the reference,
          not slack to trim — the value needs the row to itself. */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="flex min-w-0 items-baseline gap-1.5 pb-1">
          <span className="dash-stat-value">{value}</span>
          {unit && <span className="dash-stat-unit">{unit}</span>}
        </p>
        <Spark series={series} tone={tone} />
      </div>
      <p className="dash-stat-foot">
        <TrendGlyph dir={delta.dir} />
        <span
          className="dash-stat-lead"
          style={{ color: delta.dir > 0 ? "#17754d" : delta.dir < 0 ? "var(--color-danger)" : "var(--color-muted)" }}
        >
          {delta.text}
        </span>
        <span className="truncate">last week</span>
      </p>
    </div>
  );
}
