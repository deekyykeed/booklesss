"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { studyHistory, type StudyDay } from "@/lib/progress";
import { COURSES } from "@/lib/courses";
import type { Performance } from "@/lib/performance";
import { courseTone } from "./tones";

/* ------------------------------------------------------------------ *
 * The study chart — seven days, one bar each, split by course.
 *
 * Bars rather than lines, deliberately. Reading time arrives in daily
 * buckets: there is no value at half past Tuesday, so a curve drawn between
 * two days invents a shape that never happened, and three curves for three
 * courses cross into a tangle nobody can read. A stacked bar says the two
 * things a reader actually wants at a glance — how long that day was, and
 * which course it went to — and the day's total is simply the bar's height,
 * so no separate "overall" series is needed to carry it.
 *
 * The window rolls: it always ends today, nothing resets on a Monday, and
 * yesterday's bar is yesterday's wherever the week happens to be. The last
 * slot is labelled "Today" for that reason — naming it by weekday would read
 * as a calendar the plot isn't.
 *
 * Structure over decoration: the header states where the reader stands (score
 * right, the week's total left), the bars own the middle with their own room,
 * the days are named under them, and the legend closes. Nothing overlaps
 * anything. One faint gridline carries the scale; the rest is the data.
 *
 * Minutes come from StudyClock, which only counts a visible tab with recent
 * interaction. Days recorded before per-course attribution shipped hold a
 * total but no split — that time stacks as one unattributed grey segment
 * rather than being silently assigned to a course.
 * ------------------------------------------------------------------ */

const SPAN = 7;
/** The bars' own band, clear of the header above and the day names below. */
const BARS_H = 92;
/** Room above the band for the scale line and its value. */
const TOP_PAD = 14;
const GAP = 7;
const RADIUS = 5;

/** Reading time from before per-course attribution: real minutes that can't
 *  honestly be given to a course, so they stack in the app's grey. */
const UNATTRIBUTED = "#c9ccd2";

/** Clean tick values, so the scale never reads 7.3 minutes. */
function niceMax(minutes: number): number {
  if (minutes <= 10) return 10;
  for (const step of [15, 20, 30, 45, 60, 90, 120, 180]) if (minutes <= step) return step;
  return Math.ceil(minutes / 60) * 60;
}

const fmtMins = (secs: number) => {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};

const fmtShort = (secs: number) => {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};

/** The foot label for a slot — the last is always today. */
const fmtSlot = (iso: string, last: boolean) => {
  if (last) return "Today";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short" });
};

const fmtFull = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });
};

export function StudyChart({
  days,
  hydrated,
  perf,
}: {
  days: Record<string, StudyDay>;
  hydrated: boolean;
  /** The library's overall score — the card's headline figure. */
  perf: Performance | null;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const [cursor, setCursor] = useState<number | null>(null);

  /* Measured rather than a scaling viewBox: preserveAspectRatio="none" would
   * stretch the bars' rounded corners into ovals. Keyed on hydrated as well
   * as mount — the measured box only enters the tree once there's a chart. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setW(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [hydrated]);

  /* The window: the last seven days ending today, gaps filled with zeroes. */
  const series = useMemo(() => studyHistory(days, SPAN), [days]);

  /* Each day as its stack: one segment per course that recorded time, plus
   * whatever the day's total holds beyond them. */
  const stacks = useMemo(
    () =>
      series.map((d) => {
        const parts = COURSES.map((c) => ({ slug: c.slug, title: c.title, tone: courseTone(c.slug), secs: d.courses?.[c.slug] ?? 0 })).filter(
          (p) => p.secs > 0,
        );
        const attributed = parts.reduce((n, p) => n + p.secs, 0);
        const rest = Math.max(0, d.secs - attributed);
        return { date: d.date, total: d.secs, checks: d.checks, parts, rest };
      }),
    [series],
  );

  const totalSecs = series.reduce((n, d) => n + d.secs, 0);
  const hasData = totalSecs > 0;
  /* Which courses appear anywhere in the window — the legend's entries. */
  const shown = useMemo(() => {
    const seen = new Map<string, { title: string; tone: string }>();
    for (const s of stacks) for (const p of s.parts) seen.set(p.slug, { title: p.title, tone: p.tone });
    return [...seen.entries()].map(([slug, v]) => ({ slug, ...v }));
  }, [stacks]);
  const anyUnattributed = stacks.some((s) => s.rest > 0);

  const max = niceMax(Math.max(...series.map((d) => d.secs / 60), 0));
  const barW = Math.max(6, (w - GAP * (SPAN - 1)) / SPAN);
  const bx = (i: number) => i * (barW + GAP);
  /** Seconds → bar height. */
  const bh = (secs: number) => (secs / 60 / max) * BARS_H;
  /** The band's floor, in svg space. */
  const floor = TOP_PAD + BARS_H;

  const active = cursor !== null ? stacks[cursor] : undefined;

  if (!hydrated) return <div className="dash-card squircle" style={{ height: 226 }} />;

  return (
    <div className="dash-card squircle p-3.5 lg:p-[18px]">
      {/* Where the reader stands: the week's reading on the left, the score
          on the right, both clear of the plot. */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="dash-stat-label">Study time</p>
          <p className="mt-1 font-display text-[22px] font-semibold leading-none tracking-[-0.01em] text-ink">
            {hasData ? fmtMins(totalSecs) : "—"}
            <span className="ml-1.5 text-[12px] font-medium text-placeholder">last 7 days</span>
          </p>
        </div>
        <span
          className="shrink-0 text-right font-display text-[30px] font-semibold leading-none tracking-[-0.02em]"
          style={{ color: perf && perf.score >= 70 ? "var(--color-brand-deep)" : "var(--color-ink)" }}
          title={
            perf
              ? `overall score — ${Math.round(perf.parts.coverage * 100)}% covered, ` +
                `${perf.weekDays} study day${perf.weekDays === 1 ? "" : "s"} and ` +
                `${perf.weekChecks} checkpoint${perf.weekChecks === 1 ? "" : "s"} this week`
              : "overall score"
          }
        >
          {perf ? `${perf.score}%` : "–"}
          <span className="sr-only"> overall performance score</span>
        </span>
      </div>

      {/* The plot. data-no-swipe: a finger moving across the bars must never
          read as a drawer swipe. */}
      <div ref={box} className="relative mt-4" data-no-swipe>
        <svg
          width={w}
          height={floor + 20}
          role="img"
          aria-label={
            hasData
              ? `Reading time per day over the last seven days, ${fmtMins(totalSecs)} in total.`
              : "Reading time per day over the last seven days. Nothing recorded."
          }
          onPointerLeave={() => setCursor(null)}
          className="block touch-pan-y"
        >
          <defs>
            {stacks.map((_, i) => (
              <clipPath key={i} id={`${id}b${i}`}>
                {/* One rounded box per bar; the segments are plain rects
                    clipped by it, so a stack of three still reads as one
                    rounded bar rather than three stacked pills. */}
                <rect x={bx(i)} y={floor - bh(stacks[i].total)} width={barW} height={bh(stacks[i].total)} rx={RADIUS} />
              </clipPath>
            ))}
          </defs>

          {/* The scale: one hairline at the top of it, its value alongside.
              A baseline needs no line — the bars sit on it. */}
          {hasData && (
            <>
              <line
                x1={0}
                x2={w}
                y1={TOP_PAD + 0.5}
                y2={TOP_PAD + 0.5}
                stroke="var(--color-line)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <text x={0} y={TOP_PAD - 5} className="fill-[var(--color-placeholder)] text-[9.5px] tabular-nums">
                {max}m
              </text>
            </>
          )}

          {stacks.map((s, i) => {
            const dim = cursor !== null && cursor !== i;
            return (
              <g key={s.date} opacity={dim ? 0.45 : 1} style={{ transition: "opacity 120ms ease" }}>
                {/* The empty track keeps the week's rhythm visible on a day
                    with nothing on it — an absence you can see. */}
                <rect
                  x={bx(i)}
                  y={floor - 3}
                  width={barW}
                  height={3}
                  rx={1.5}
                  fill="var(--color-line)"
                  opacity={s.total > 0 ? 0 : 1}
                />
                <g clipPath={`url(#${id}b${i})`}>
                  {(() => {
                    let y = floor;
                    const segs = [
                      ...s.parts.map((p) => ({ key: p.slug, secs: p.secs, fill: p.tone })),
                      ...(s.rest > 0 ? [{ key: "rest", secs: s.rest, fill: UNATTRIBUTED }] : []),
                    ];
                    return segs.map((seg) => {
                      const h = bh(seg.secs);
                      y -= h;
                      return <rect key={seg.key} x={bx(i)} y={y} width={barW} height={h} fill={seg.fill} />;
                    });
                  })()}
                </g>
                {/* The whole column is the hover target, so a thin bar is as
                    easy to reach as a tall one. */}
                <rect
                  x={bx(i)}
                  y={TOP_PAD}
                  width={barW}
                  height={BARS_H}
                  fill="transparent"
                  onPointerEnter={() => setCursor(i)}
                />
                <text
                  x={bx(i) + barW / 2}
                  y={floor + 14}
                  textAnchor="middle"
                  className={
                    i === SPAN - 1
                      ? "fill-[var(--color-muted)] text-[10px] font-semibold"
                      : "fill-[var(--color-placeholder)] text-[10px]"
                  }
                >
                  {fmtSlot(s.date, i === SPAN - 1)}
                </text>
              </g>
            );
          })}
        </svg>

        {active && active.total > 0 && (
          <div
            className="chart-tip"
            style={{
              left: Math.min(Math.max(bx(cursor!) + barW / 2, 60), Math.max(w - 60, 60)),
              top: Math.max(floor - bh(active.total) - 14, -6),
            }}
          >
            <p className="font-semibold text-ink">{fmtMins(active.total)}</p>
            <p className="text-[11px] text-muted">{fmtFull(active.date)}</p>
            {active.parts.map((p) => (
              <p key={p.slug} className="flex items-center gap-1.5 text-[11px] text-muted">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: p.tone }} />
                {p.title} · {fmtShort(p.secs)}
              </p>
            ))}
            {active.checks > 0 && (
              <p className="text-[11px] text-muted">
                {active.checks} checkpoint{active.checks === 1 ? "" : "s"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Which colour is which. Only courses with time in the window earn an
          entry; the grey only appears if there is unattributed time to explain. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {hasData ? (
          <>
            {shown.map((c) => (
              <span key={c.slug} className="flex items-center gap-1.5 text-[11px] leading-4 text-muted">
                <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: c.tone }} />
                {c.title}
              </span>
            ))}
            {anyUnattributed && (
              <span
                className="flex items-center gap-1.5 text-[11px] leading-4 text-muted"
                title="Recorded before reading time was attributed to a course"
              >
                <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: UNATTRIBUTED }} />
                Unattributed
              </span>
            )}
          </>
        ) : (
          <span className="text-[11px] leading-4 text-placeholder">
            Open a step and your reading time fills this in.
          </span>
        )}
      </div>
    </div>
  );
}
