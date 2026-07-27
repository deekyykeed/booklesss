"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { COURSES } from "@/lib/courses";
import { checkpointsFor, labelFor, pathForId } from "@/lib/course";
import { isStudyDay, streakSeries, studyHistory, useProgress } from "@/lib/progress";
import { CompletionRing } from "@/components/reader/CompletionRing";
import { smoothPath, StudyChart } from "./StudyChart";
import { CalendarGlyph, CheckGlyph, FireGlyph, MedalGlyph } from "./plump-glyphs";

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
        <div className="mt-2.5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="Current streak"
            value={String(streak)}
            unit={streak === 1 ? "day" : "days"}
            tone={TONE.streak}
            icon={<FireGlyph />}
            series={spark.streaks}
            delta={spark.dStreak}
          />
          <Stat
            label="Days studied"
            value={String(daysStudied)}
            unit={daysStudied === 1 ? "day" : "days"}
            tone={TONE.days}
            icon={<CalendarGlyph />}
            series={spark.cumDays}
            delta={spark.dDays}
          />
          <Stat
            label="Checkpoints"
            value={`${done.checks}`}
            unit={`/ ${totals.checks}`}
            tone={TONE.checks}
            icon={<CheckGlyph />}
            series={spark.checksDaily}
            delta={spark.dChecks}
          />
          <Stat
            label="Steps complete"
            value={`${done.steps}`}
            unit={`/ ${totals.steps}`}
            tone={TONE.steps}
            icon={<MedalGlyph />}
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

/* The tile's own graph — the card's backdrop, not a figure beside the
 * number. Anchored to the bottom edge and spanning the full card width,
 * behind the text, at a fraction of the ink it had as a foreground element:
 * the line carries the shape, the wash gives it a floor, and nothing is
 * labelled — it's atmosphere with the true curve, and the numbers in front
 * are the data. Same monotone-cubic as the big chart, so even the backdrop
 * can't overshoot what happened.
 *
 * Width is measured (ResizeObserver) rather than stretched through a
 * viewBox — preserveAspectRatio="none" would distort the stroke. */
function Spark({ series, tone }: { series: number[]; tone: string }) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setW(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 62;
  const TOP = 6;
  /* The curve keeps to the card's right half, clear of the number and the
   * delta, and opens with a zero anchor so it lifts out of the floor instead
   * of materialising mid-air. The anchor is a drawing convention, not a
   * datum — the 14 real days follow it. */
  const LEFT = Math.round(w / 2);
  const max = Math.max(...series);
  const n = series.length;

  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: H }}>
      {w > LEFT && n > 1 && max > 0 && (() => {
        const drawn = [0, ...series];
        /* 5px shy of the right edge, so the head dot isn't halved by the
           card's overflow clip. */
        const pts = drawn.map((v, i) => ({
          x: LEFT + (i * (w - LEFT - 5)) / (drawn.length - 1),
          y: TOP + (1 - v / max) * (H - TOP),
        }));
        const line = smoothPath(pts);
        const area = `${line} L${w - 5} ${H} L${LEFT} ${H} Z`;
        return (
          <svg width={w} height={H} className="block">
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={tone} stopOpacity="0.10" />
                <stop offset="1" stopColor={tone} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${id})`} />
            <path d={line} fill="none" stroke={tone} strokeOpacity="0.38" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {/* Today, at the head of the line — the one full-ink element of
                the backdrop, because "where you are now" is its point. The
                white ring keeps it legible over the wash. */}
            <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={tone} stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      })()}
    </div>
  );
}

/** Week-over-week/** Week-over-week movement, phrased like the reference: a percentage when
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
  icon,
  series,
  delta,
}: {
  label: string;
  value: string;
  unit?: string;
  /** The stat's hue — carries the sparkline. */
  tone: string;
  /** The stat's mark, 24px in plain ink, between the title and the number. */
  icon: React.ReactNode;
  /** Last 14 days of this stat, oldest first. */
  series: number[];
  delta: { text: string; dir: 1 | 0 | -1 };
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
          <span className="shrink-0 text-ink">{icon}</span>
        </div>
        <p className="mt-4 flex items-baseline gap-1.5">
          <span className="dash-stat-value">{value}</span>
          {unit && <span className="dash-stat-unit">{unit}</span>}
        </p>
        {/* No icon here — the percentage's colour is the direction. */}
        <p className="dash-stat-foot">
          <span
            className="dash-stat-lead"
            style={{ color: delta.dir > 0 ? "#17754d" : delta.dir < 0 ? "var(--color-danger)" : "var(--color-muted)" }}
          >
            {delta.text}
          </span>
          <span className="truncate">last week</span>
        </p>
      </div>
    </div>
  );
}
