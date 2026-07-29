"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { studyHistory, type StudyDay } from "@/lib/progress";
import { COURSES } from "@/lib/courses";
import type { Performance } from "@/lib/performance";
import { CHART_TONE, courseTone } from "./tones";

/* ------------------------------------------------------------------ *
 * The study chart — a rolling window, not a calendar.
 *
 * It always shows the last seven days ending today and keeps rolling: nothing
 * resets on a Monday, the lines never restart at a week boundary, and their
 * heads stay at the right edge where today is. That is why there are no
 * weekday markers — the slots aren't named days, they're "six days ago"
 * through "now", and naming them would invite reading the plot as a calendar
 * it isn't.
 *
 * Deliberately bare: no gridlines, no axis, no ticks. The score states where
 * the reader stands and the legend says which line is which; the lines
 * themselves carry shape, not exact values (the crosshair and the table below
 * have the numbers when they're wanted).
 *
 * Minutes come from StudyClock, which only counts a visible tab with recent
 * interaction. Days recorded before per-course attribution shipped hold a
 * total but no split, so a course line simply starts where its data does.
 * Nothing here is estimated.
 * ------------------------------------------------------------------ */

const H = 132;
const PAD = { t: 14, r: 10, b: 10, l: 10 };
const SPAN = 7;

const LINE = CHART_TONE; // --color-brand-deep
const WASH = "#3ecf8e"; // --color-brand, at 10%

const fmtDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
};

/**
 * A smooth path through the points — monotone cubic, not a plain spline.
 *
 * The distinction matters here rather than being a preference. A cardinal or
 * Catmull-Rom curve overshoots around a peak: after a 47-minute day between two
 * quiet ones, it dips below the baseline on the way out and draws negative
 * minutes, and it rounds the top up past 47 to a number nobody recorded. The
 * Fritsch–Carlson filter below clamps the tangents so the curve can never
 * overshoot a local extreme — every point on the line stays within the values
 * either side of it. The curve is a reading aid; it must not invent data.
 */
export function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return pts.length ? `M${pts[0].x} ${pts[0].y}` : "";

  const n = pts.length;
  const h: number[] = []; // x spacing
  const d: number[] = []; // secant slopes
  for (let i = 0; i < n - 1; i++) {
    h[i] = pts[i + 1].x - pts[i].x;
    d[i] = h[i] === 0 ? 0 : (pts[i + 1].y - pts[i].y) / h[i];
  }

  /* Averaged secants — except at a turning point, where the tangent must be
   * flat. When the secants either side disagree in sign the day is a local peak
   * or trough, and any non-zero tangent there sends the curve past it: a zero
   * day between a busy one and a quiet one would be drawn as negative minutes.
   * This is the step that keeps the line inside the data. */
  const m: number[] = [d[0]];
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  }
  m[n - 1] = d[n - 2];

  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      // A flat run stays flat — no bulge between two equal days.
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }

  let out = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const t = h[i] / 3;
    const c1x = pts[i].x + t;
    const c1y = pts[i].y + m[i] * t;
    const c2x = pts[i + 1].x - t;
    const c2y = pts[i + 1].y - m[i + 1] * t;
    out += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${pts[i + 1].x.toFixed(1)} ${pts[i + 1].y.toFixed(1)}`;
  }
  return out;
}

const fmtMins = (secs: number) => {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};

/** A legend entry: the series' dot, then its name. */
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] leading-4 text-muted">
      <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

export function StudyChart({
  days,
  hydrated,
  perf,
}: {
  days: Record<string, StudyDay>;
  hydrated: boolean;
  /** The library's overall score — the chart's headline figure. */
  perf: Performance | null;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(680);
  const [cursor, setCursor] = useState<number | null>(null);

  /* Measured rather than a scaling viewBox: preserveAspectRatio="none" would
   * stretch the 2px stroke and turn the end marker into an ellipse.
   *
   * Keyed on hydrated as well as mount. The measured box is only in the tree
   * once there's a chart to measure, so on a first paint that renders the
   * placeholder the ref is still null — an effect that ran only on mount would
   * bail there and leave the chart stuck at its default width forever. */
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

  /* The window: the last seven days ending today, gaps filled with zeroes.
   * It rolls — today is always the last slot. */
  const series = useMemo(() => studyHistory(days, SPAN), [days]);

  /* Where per-course attribution begins. Days before it hold a total but no
   * split, so a course line drawn across them would plot zeroes nobody
   * measured; each line starts where its data does. */
  const attributedSince = useMemo(() => {
    let min: string | undefined;
    for (const [date, d] of Object.entries(days)) {
      if (d.courses && (!min || date < min)) min = date;
    }
    return min;
  }, [days]);

  /* One line per course that recorded time in the window. `i` is the slot, so
   * a line whose data starts mid-window starts mid-plot. */
  const courseSeries = useMemo(() => {
    if (!attributedSince) return [];
    return COURSES.map((c) => ({
      slug: c.slug,
      title: c.title,
      tone: courseTone(c.slug),
      pts: series
        .map((d, i) => ({ i, date: d.date, mins: (d.courses?.[c.slug] ?? 0) / 60 }))
        .filter((p) => p.date >= attributedSince),
    })).filter((c) => c.pts.some((p) => p.mins > 0));
  }, [series, attributedSince]);

  const plotW = Math.max(1, w - PAD.l - PAD.r);
  const plotH = H - PAD.t - PAD.b;
  const max = Math.max(...series.map((d) => d.secs / 60), 10);
  const step = plotW / (SPAN - 1);

  const x = (i: number) => PAD.l + i * step;
  const y = (mins: number) => PAD.t + plotH - (mins / max) * plotH;

  const line = smoothPath(series.map((d, i) => ({ x: x(i), y: y(d.secs / 60) })));
  const area = `${line} L${x(SPAN - 1).toFixed(1)} ${PAD.t + plotH} L${PAD.l} ${PAD.t + plotH} Z`;

  const totalSecs = series.reduce((n, d) => n + d.secs, 0);
  /* With nothing recorded, a line pinned to the baseline is worse than no
   * line: it draws a confident zero across days nobody studied, which reads
   * as a measurement rather than an absence. */
  const hasData = totalSecs > 0;
  const active = hasData && cursor !== null ? series[cursor] : undefined;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!step || !hasData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left - PAD.l) / step);
    setCursor(Math.min(SPAN - 1, Math.max(0, i)));
  };

  const onKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!hasData) return;
    const at = cursor ?? SPAN - 1;
    if (e.key === "ArrowLeft") setCursor(Math.max(0, at - 1));
    else if (e.key === "ArrowRight") setCursor(Math.min(SPAN - 1, at + 1));
    else if (e.key === "Home") setCursor(0);
    else if (e.key === "End") setCursor(SPAN - 1);
    else if (e.key === "Escape") setCursor(null);
    else return;
    e.preventDefault();
  };

  if (!hydrated) return <div className="chart-frame" style={{ height: H }} />;

  return (
    <div>
      {/* The headline: where the reader stands across everything, set like the
          course cards' score — same face, brand green once it's good. */}
      <div className="mb-1 flex items-start justify-between gap-3">
        <span
          className="font-display text-[30px] font-semibold leading-none tracking-[-0.02em]"
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
        <p className="shrink-0 pt-1 text-[12px] text-placeholder">
          {hasData ? `${fmtMins(totalSecs)} · last 7 days` : "Last 7 days"}
        </p>
      </div>

      {/* data-no-swipe: the plot is an interactive horizontal surface — a
          finger sweeping the crosshair must never read as a drawer swipe. */}
      <div ref={box} className="relative" data-no-swipe>
        <svg
          width={w}
          height={H}
          role="img"
          tabIndex={0}
          aria-label={
            hasData
              ? `Minutes studied per day over the last seven days. ${fmtMins(totalSecs)} in total.`
              : "Minutes studied per day over the last seven days. Nothing recorded."
          }
          onPointerMove={onMove}
          onPointerLeave={() => setCursor(null)}
          onBlur={() => setCursor(null)}
          onKeyDown={onKey}
          className="block touch-pan-y focus:outline-none"
        >
          <defs>
            {/* The head's lift — same recipe as the stat-tile sparklines, so
                every line on the dashboard ends the same way. */}
            <filter id={`${id}f`} x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.3" floodColor={LINE} floodOpacity="0.45" />
            </filter>
          </defs>

          {hasData ? (
            <>
              <path d={area} fill={WASH} fillOpacity="0.1" />
              {/* Per-course lines under the total: thinner, so the sum stays
                  the headline and the split reads as its parts. A one-day-old
                  line is a dot — a path with one point draws nothing. */}
              {courseSeries.map((c) =>
                c.pts.length > 1 ? (
                  <path
                    key={c.slug}
                    d={smoothPath(c.pts.map((p) => ({ x: x(p.i), y: y(p.mins) })))}
                    fill="none"
                    stroke={c.tone}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                ) : (
                  <circle key={c.slug} cx={x(c.pts[0].i)} cy={y(c.pts[0].mins)} r="2.5" fill={c.tone} opacity="0.9" />
                ),
              )}
              <path d={line} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {/* Today, at the right edge where the window always ends. */}
              <circle
                cx={x(SPAN - 1)}
                cy={y(series[SPAN - 1].secs / 60)}
                r="3.5"
                fill="#ffffff"
                stroke={LINE}
                strokeWidth="1.2"
                filter={`url(#${id}f)`}
              />
            </>
          ) : (
            <text
              x={PAD.l + plotW / 2}
              y={PAD.t + plotH / 2 + 4}
              textAnchor="middle"
              className="fill-[var(--color-muted)] text-[12.5px]"
            >
              No reading time yet — open a step and this fills in.
            </text>
          )}

          {/* the crosshair finds the X — readers aim at a day, not a 2px line */}
          {active && (
            <>
              <line
                x1={x(cursor!)}
                x2={x(cursor!)}
                y1={PAD.t - 4}
                y2={PAD.t + plotH}
                stroke="var(--color-line-2)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <circle
                cx={x(cursor!)}
                cy={y(active.secs / 60)}
                r="3.5"
                fill="#ffffff"
                stroke={LINE}
                strokeWidth="1.2"
                filter={`url(#${id}f)`}
              />
            </>
          )}
        </svg>

        {active && (
          <div
            className="chart-tip"
            style={{
              left: Math.min(Math.max(x(cursor!), 54), Math.max(w - 54, 54)),
              top: Math.max(y(active.secs / 60) - 12, 0),
            }}
          >
            <p className="font-semibold text-ink">{fmtMins(active.secs)}</p>
            <p className="text-[11px] text-muted">{fmtDay(active.date)}</p>
            {active.courses &&
              Object.entries(active.courses).map(([slug, secs]) => (
                <p key={slug} className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: courseTone(slug) }}
                  />
                  {COURSES.find((c) => c.slug === slug)?.title ?? slug} · {fmtMins(secs)}
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

      {/* Which line is which — the chart's one label, since the plot carries
          no axis. Course entries appear once a course has time in view. */}
      {hasData && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 px-1">
          <LegendDot color={LINE} label="Overall" />
          {courseSeries.map((c) => (
            <LegendDot key={c.slug} color={c.tone} label={c.title} />
          ))}
        </div>
      )}

      {/* Everything the hover shows, reachable without hovering. */}
      <details className="chart-table">
        <summary>View as table</summary>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Checkpoints</th>
            </tr>
          </thead>
          <tbody>
            {series.filter((d) => d.secs || d.checks).map((d) => (
              <tr key={d.date}>
                <td>{fmtDay(d.date)}</td>
                <td className="tabular-nums">{fmtMins(d.secs)}</td>
                <td className="tabular-nums">{d.checks}</td>
              </tr>
            ))}
            {!series.some((d) => d.secs || d.checks) && (
              <tr>
                <td colSpan={3}>Nothing recorded in the last seven days.</td>
              </tr>
            )}
          </tbody>
        </table>
      </details>
    </div>
  );
}
