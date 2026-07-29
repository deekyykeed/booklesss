"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { studyHistory, type StudyDay } from "@/lib/progress";
import { COURSES } from "@/lib/courses";
import type { Performance } from "@/lib/performance";
import { CHART_TONE, courseTone } from "./tones";

/* ------------------------------------------------------------------ *
 * The study chart — reading time per day, one area per course.
 *
 * Built to the reference dashboard the owner picked: a titled header with the
 * range on the right, a left scale, dashed verticals marking each day, one
 * translucent area per series over a straight line, and a crosshair that
 * drops through every series at once with a card naming each value.
 *
 * The window rolls — it always ends today, nothing resets on a Monday — and
 * the range chip widens it to a fortnight or a month. The last slot is
 * labelled "Today" for that reason; naming it by weekday would read as a
 * calendar the plot isn't.
 *
 * Minutes come from StudyClock, which only counts a visible tab with recent
 * interaction. Days recorded before per-course attribution shipped hold a
 * total but no split, so a course's area simply starts where its data does
 * while the total keeps the whole shape.
 * ------------------------------------------------------------------ */

const PLOT_H = 156;
const PAD = { t: 10, r: 4, b: 26, l: 38 };

/** The windows the range chip offers. */
const RANGES = [
  { span: 7, label: "Last 7 days" },
  { span: 14, label: "Last 14 days" },
  { span: 30, label: "Last 30 days" },
] as const;

const fmtMins = (secs: number) => {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};

/** Axis ticks, tersely — "45m", "2h". */
const fmtTick = (mins: number) => {
  if (mins === 0) return "0";
  if (mins < 60) return `${Math.round(mins)}m`;
  const h = mins / 60;
  return Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;
};

/** Clean tick values, so the scale never reads 7.3 minutes. */
function niceMax(minutes: number): number {
  if (minutes <= 10) return 10;
  for (const step of [15, 20, 30, 45, 60, 90, 120, 180, 240]) if (minutes <= step) return step;
  return Math.ceil(minutes / 120) * 120;
}

const fmtSlot = (iso: string, last: boolean) => {
  if (last) return "Today";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short" });
};

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const fmtFull = (iso: string, last: boolean) => {
  if (last) return "Today";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });
};

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4m8-4v4" />
      </g>
    </svg>
  );
}

export function StudyChart({
  days,
  hydrated,
  perf,
}: {
  days: Record<string, StudyDay>;
  hydrated: boolean;
  /** The library's overall score — the badge beside the range. */
  perf: Performance | null;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const [cursor, setCursor] = useState<number | null>(null);
  const [range, setRange] = useState(0);
  const [rangeOpen, setRangeOpen] = useState(false);
  const span = RANGES[range].span;

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

  /* Close the range menu on an outside press, the way every other menu in the
   * app behaves. */
  useEffect(() => {
    if (!rangeOpen) return;
    const close = () => setRangeOpen(false);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [rangeOpen]);

  const series = useMemo(() => studyHistory(days, span), [days, span]);

  /* The total, then one series per course that recorded time in the window.
   * The total is drawn first and widest — every course sits inside it. */
  const lines = useMemo(() => {
    const total = { key: "__total", title: "All courses", tone: CHART_TONE, mins: series.map((d) => d.secs / 60) };
    const courses = COURSES.map((c) => ({
      key: c.slug,
      title: c.title,
      tone: courseTone(c.slug),
      mins: series.map((d) => (d.courses?.[c.slug] ?? 0) / 60),
    })).filter((c) => c.mins.some((m) => m > 0));
    return [total, ...courses];
  }, [series]);

  const totalSecs = series.reduce((n, d) => n + d.secs, 0);
  const hasData = totalSecs > 0;

  const max = niceMax(Math.max(...series.map((d) => d.secs / 60), 0));
  const plotW = Math.max(1, w - PAD.l - PAD.r);
  const step = series.length > 1 ? plotW / (series.length - 1) : 0;
  const x = (i: number) => PAD.l + i * step;
  const y = (mins: number) => PAD.t + PLOT_H - (mins / max) * PLOT_H;
  const floor = PAD.t + PLOT_H;

  const path = (mins: number[]) => mins.map((m, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(m).toFixed(1)}`).join(" ");
  const areaPath = (mins: number[]) => `${path(mins)} L${x(mins.length - 1).toFixed(1)} ${floor} L${PAD.l} ${floor} Z`;

  /* Which slots get a name. Seven fit comfortably; a fortnight or a month
   * would collide, so they thin out to roughly six labels either way. */
  const labelEvery = Math.max(1, Math.ceil(series.length / 6));
  const active = cursor !== null ? series[cursor] : undefined;
  /* The day before the hovered one, for the tooltip's movement badge. */
  const prevSecs = cursor !== null && cursor > 0 ? series[cursor - 1].secs : 0;
  const delta = active && prevSecs > 0 ? Math.round(((active.secs - prevSecs) / prevSecs) * 100) : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!step || !hasData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left - PAD.l) / step);
    setCursor(Math.min(series.length - 1, Math.max(0, i)));
  };

  if (!hydrated) return <div className="dash-card squircle" style={{ height: 300 }} />;

  return (
    <div className="dash-card squircle p-3.5 lg:p-[18px]">
      {/* Title left, the score and the range right. */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[16px] font-semibold leading-tight text-ink">Study overview</h3>
          <p className="mt-0.5 truncate text-[12.5px] leading-5 text-muted">
            {hasData ? `${fmtMins(totalSecs)} of reading, split by course` : "Reading time, split by course"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {perf && (
            <span
              className="chart-badge"
              title={
                `overall score — ${Math.round(perf.parts.coverage * 100)}% covered, ` +
                `${perf.weekDays} study day${perf.weekDays === 1 ? "" : "s"} and ` +
                `${perf.weekChecks} checkpoint${perf.weekChecks === 1 ? "" : "s"} this week`
              }
              data-good={perf.score >= 70 ? "" : undefined}
            >
              {perf.score}% score
            </span>
          )}
          <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setRangeOpen((o) => !o)}
              className="chart-range"
              aria-haspopup="listbox"
              aria-expanded={rangeOpen}
            >
              <CalendarMark />
              {RANGES[range].label}
              <Chevron />
            </button>
            {rangeOpen && (
              <div className="chart-menu squircle" role="listbox">
                {RANGES.map((r, i) => (
                  <button
                    key={r.span}
                    type="button"
                    role="option"
                    aria-selected={i === range}
                    data-on={i === range ? "" : undefined}
                    onClick={() => {
                      setRange(i);
                      setRangeOpen(false);
                      setCursor(null);
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* data-no-swipe: a finger tracking the crosshair must never read as a
          drawer swipe. */}
      <div ref={box} className="relative mt-3" data-no-swipe>
        <svg
          width={w}
          height={PLOT_H + PAD.t + PAD.b}
          role="img"
          aria-label={
            hasData
              ? `Reading time per day, ${RANGES[range].label.toLowerCase()}. ${fmtMins(totalSecs)} in total.`
              : `Reading time per day, ${RANGES[range].label.toLowerCase()}. Nothing recorded.`
          }
          onPointerMove={onMove}
          onPointerLeave={() => setCursor(null)}
          className="block touch-pan-y"
        >
          <defs>
            {lines.map((l) => (
              <linearGradient key={l.key} id={`${id}${l.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={l.tone} stopOpacity="0.22" />
                <stop offset="1" stopColor={l.tone} stopOpacity="0.02" />
              </linearGradient>
            ))}
          </defs>

          {/* The scale, on the left; no horizontal rules — the verticals carry
              the grid, as the reference does. */}
          {[1, 0.75, 0.5, 0.25, 0].map((f) => (
            <text
              key={f}
              x={PAD.l - 8}
              y={y(max * f) + 3.5}
              textAnchor="end"
              className="fill-[var(--color-placeholder)] text-[10px] tabular-nums"
            >
              {fmtTick(max * f)}
            </text>
          ))}

          {/* One dashed vertical per day. */}
          {series.map((d, i) => (
            <line
              key={d.date}
              x1={x(i)}
              x2={x(i)}
              y1={PAD.t}
              y2={floor}
              stroke="var(--color-line)"
              strokeWidth="1"
              strokeDasharray="3 4"
              shapeRendering="crispEdges"
            />
          ))}
          <line x1={PAD.l} x2={PAD.l + plotW} y1={floor} y2={floor} stroke="var(--color-line)" strokeWidth="1" shapeRendering="crispEdges" />

          {hasData &&
            lines.map((l) => (
              <g key={l.key}>
                <path d={areaPath(l.mins)} fill={`url(#${id}${l.key})`} />
                <path
                  d={path(l.mins)}
                  fill="none"
                  stroke={l.tone}
                  strokeWidth={l.key === "__total" ? 2 : 1.6}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            ))}

          {/* The days along the foot, thinned when the window is long. */}
          {series.map((d, i) =>
            i % labelEvery === 0 || i === series.length - 1 ? (
              <text
                key={d.date}
                x={x(i)}
                y={floor + 17}
                textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"}
                className={
                  i === series.length - 1
                    ? "fill-[var(--color-muted)] text-[10px] font-semibold"
                    : "fill-[var(--color-placeholder)] text-[10px]"
                }
              >
                {span <= 7 ? fmtSlot(d.date, i === series.length - 1) : i === series.length - 1 ? "Today" : fmtDate(d.date)}
              </text>
            ) : null,
          )}

          {/* The crosshair drops through every series at once, each marked
              with an open head — the reference's read. */}
          {active && hasData && (
            <>
              <line x1={x(cursor!)} x2={x(cursor!)} y1={PAD.t} y2={floor} stroke={CHART_TONE} strokeWidth="1.5" />
              {lines.map((l) => (
                <circle
                  key={l.key}
                  cx={x(cursor!)}
                  cy={y(l.mins[cursor!])}
                  r="4"
                  fill="#ffffff"
                  stroke={l.tone}
                  strokeWidth="1.8"
                />
              ))}
            </>
          )}
        </svg>

        {active && hasData && (
          <div
            className="chart-card squircle"
            style={{
              left: Math.min(Math.max(x(cursor!) + 14, PAD.l), Math.max(w - 190, PAD.l)),
              top: Math.max(y(active.secs / 60) + 6, PAD.t),
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-ink">{fmtFull(active.date, cursor === series.length - 1)}</p>
              {delta !== null && (
                <span className="chart-badge" data-good={delta >= 0 ? "" : undefined} data-bad={delta < 0 ? "" : undefined}>
                  {delta >= 0 ? "↗" : "↘"} {Math.abs(delta)}%
                </span>
              )}
            </div>
            {lines.map((l) => (
              <p key={l.key} className="mt-1.5 flex items-center justify-between gap-6 text-[12px]">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: l.tone }} />
                  {l.title}
                </span>
                <span className="font-medium tabular-nums text-ink">{fmtMins(l.mins[cursor!] * 60)}</span>
              </p>
            ))}
            {active.checks > 0 && (
              <p className="mt-1.5 text-[11px] text-placeholder">
                {active.checks} checkpoint{active.checks === 1 ? "" : "s"} cleared
              </p>
            )}
          </div>
        )}
      </div>

      {/* Centred under the plot, as the reference has it. */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
        {hasData ? (
          lines.map((l) => (
            <span key={l.key} className="flex items-center gap-1.5 text-[11.5px] leading-4 text-muted">
              <span className="h-[8px] w-[8px] shrink-0 rounded-full" style={{ backgroundColor: l.tone }} />
              {l.title}
            </span>
          ))
        ) : (
          <span className="text-[11.5px] leading-4 text-placeholder">Open a step and your reading time fills this in.</span>
        )}
      </div>
    </div>
  );
}
