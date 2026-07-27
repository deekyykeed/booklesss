"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { studyHistory, type StudyDay } from "@/lib/progress";

/* ------------------------------------------------------------------ *
 * Time studied, day by day.
 *
 * One series — minutes read per day — so there is no legend: the heading names
 * what's plotted. The line carries the readable step of the brand green
 * (#17754d, 4.6:1 on the card); the wash beneath is the light step at 10%,
 * which is too pale to read as a line on its own and is only there to give the
 * curve a body. Grid and every label wear text tokens, never the series colour.
 *
 * Minutes come from StudyClock, which only counts a visible tab with recent
 * interaction — see its accrual rules. Days before that shipped hold checkpoint
 * counts but no time, so the line legitimately sits at zero across them while
 * the tooltip still reports the checkpoints. Nothing here is estimated.
 * ------------------------------------------------------------------ */

const SPAN = 30; // days
const H = 152;
const PAD = { t: 16, r: 12, b: 24, l: 34 };

const LINE = "#17754d"; // --color-brand-deep
const WASH = "#3ecf8e"; // --color-brand, at 10%
const SURFACE = "#fcfcfb"; // --color-card, for the marker's ring

/** Clean tick values, so the axis never reads 7.3 minutes. */
function niceMax(minutes: number): number {
  if (minutes <= 10) return 10;
  for (const step of [15, 20, 30, 45, 60, 90, 120]) if (minutes <= step) return step;
  return Math.ceil(minutes / 60) * 60;
}

const fmtDay = (iso: string, long = false) => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, long
    ? { weekday: "short", day: "numeric", month: "short" }
    : { day: "numeric", month: "short" });
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

export function StudyChart({ days, hydrated }: { days: Record<string, StudyDay>; hydrated: boolean }) {
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

  const series = useMemo(() => (hydrated ? studyHistory(days, SPAN) : []), [days, hydrated]);

  const plotW = Math.max(1, w - PAD.l - PAD.r);
  const plotH = H - PAD.t - PAD.b;
  const max = niceMax(Math.max(...series.map((d) => d.secs / 60), 0));
  const step = series.length > 1 ? plotW / (series.length - 1) : 0;

  const x = useCallback((i: number) => PAD.l + i * step, [step]);
  const y = useCallback((mins: number) => PAD.t + plotH - (mins / max) * plotH, [plotH, max]);

  const line = useMemo(
    () => smoothPath(series.map((d, i) => ({ x: x(i), y: y(d.secs / 60) }))),
    [series, x, y],
  );
  const area = series.length
    ? `${line} L${x(series.length - 1).toFixed(1)} ${PAD.t + plotH} L${PAD.l} ${PAD.t + plotH} Z`
    : "";

  const totalSecs = series.reduce((n, d) => n + d.secs, 0);
  /* With nothing recorded, a line pinned to the baseline is worse than no line:
   * it draws a confident zero across a month nobody has studied yet, which
   * looks like a measurement rather than an absence. The axes stay so the shape
   * is legible; the plot says what's missing. */
  const hasData = totalSecs > 0;
  const active = hasData && cursor !== null ? series[cursor] : undefined;
  /* The peak is the one point worth a direct label — a number on every day
   * would be unreadable at 30 points and nobody would read it anyway. */
  const peak = series.reduce((best, d, i) => (d.secs > (series[best]?.secs ?? 0) ? i : best), 0);
  const showPeak = hasData && cursor === null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!step || !hasData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left - PAD.l) / step);
    setCursor(Math.min(series.length - 1, Math.max(0, i)));
  };

  const onKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!hasData) return;
    const last = series.length - 1;
    const at = cursor ?? last;
    if (e.key === "ArrowLeft") setCursor(Math.max(0, at - 1));
    else if (e.key === "ArrowRight") setCursor(Math.min(last, at + 1));
    else if (e.key === "Home") setCursor(0);
    else if (e.key === "End") setCursor(last);
    else if (e.key === "Escape") setCursor(null);
    else return;
    e.preventDefault();
  };

  if (!hydrated) return <div className="chart-frame" style={{ height: H }} />;

  return (
    <div>
      <div ref={box} className="relative">
        <svg
          width={w}
          height={H}
          role="img"
          tabIndex={0}
          aria-label={
            hasData
              ? `Minutes studied per day over the last ${SPAN} days. ${fmtMins(totalSecs)} in total.`
              : `Minutes studied per day over the last ${SPAN} days. Nothing recorded yet.`
          }
          onPointerMove={onMove}
          onPointerLeave={() => setCursor(null)}
          onBlur={() => setCursor(null)}
          onKeyDown={onKey}
          className="block touch-pan-y focus:outline-none"
        >
          {/* gridlines: hairline, solid, one step off the surface */}
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line
                x1={PAD.l}
                x2={PAD.l + plotW}
                y1={y(max * f)}
                y2={y(max * f)}
                stroke="var(--color-line)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <text
                x={PAD.l - 8}
                y={y(max * f) + 3.5}
                textAnchor="end"
                className="fill-[var(--color-placeholder)] text-[10px] tabular-nums"
              >
                {Math.round(max * f)}
              </text>
            </g>
          ))}

          {hasData ? (
            <>
              <path d={area} fill={WASH} fillOpacity="0.1" />
              <path d={line} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
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

          {/* x labels: the ends and the middle, never all thirty */}
          {series.length > 1 &&
            [0, Math.floor((series.length - 1) / 2), series.length - 1].map((i) => (
              <text
                key={i}
                x={Math.min(Math.max(x(i), PAD.l + 12), PAD.l + plotW - 12)}
                y={H - 7}
                textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"}
                className="fill-[var(--color-placeholder)] text-[10px]"
              >
                {i === series.length - 1 ? "Today" : fmtDay(series[i].date)}
              </text>
            ))}

          {showPeak && (
            <text
              x={Math.min(Math.max(x(peak), PAD.l + 16), PAD.l + plotW - 16)}
              y={Math.max(y(series[peak].secs / 60) - 9, 11)}
              textAnchor="middle"
              className="fill-[var(--color-ink)] text-[10.5px] font-semibold"
            >
              {fmtMins(series[peak].secs)}
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
                r="4"
                fill={LINE}
                stroke={SURFACE}
                strokeWidth="2"
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
            <p className="text-[11px] text-muted">{fmtDay(active.date, true)}</p>
            {active.checks > 0 && (
              <p className="text-[11px] text-muted">
                {active.checks} checkpoint{active.checks === 1 ? "" : "s"}
              </p>
            )}
          </div>
        )}
      </div>

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
                <td>{fmtDay(d.date, true)}</td>
                <td className="tabular-nums">{fmtMins(d.secs)}</td>
                <td className="tabular-nums">{d.checks}</td>
              </tr>
            ))}
            {!series.some((d) => d.secs || d.checks) && (
              <tr>
                <td colSpan={3}>Nothing recorded in the last {SPAN} days.</td>
              </tr>
            )}
          </tbody>
        </table>
      </details>
    </div>
  );
}
