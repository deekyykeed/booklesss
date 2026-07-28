"use client";

import Link from "next/link";
import { useMemo } from "react";
import { COURSES, type CourseMeta } from "@/lib/courses";
import { checkpointsFor, labelFor, lessonsUnder } from "@/lib/course";
import { useProgress, type StudyDay } from "@/lib/progress";
import { CourseMark } from "./course-glyphs";
import { CompletionRing } from "@/components/reader/CompletionRing";
import { smoothPath } from "./StudyChart";
import { courseTone } from "./tones";

/* ------------------------------------------------------------------ *
 * TEMPORARY — the course-card design lab.
 *
 * Seven candidate designs for the home page's course card, every one fed the
 * same live course data so they compare fairly. The owner picks one; the
 * winner replaces the current card and this file is deleted.
 *
 * Everything drawn is real: progress, unit shares, next step, and the
 * per-course study minutes the store now records. No mock numbers.
 * ------------------------------------------------------------------ */

type CardData = {
  course: CourseMeta;
  tone: string;
  hydrated: boolean;
  pct: number;
  checksDone: number;
  stepsDone: number;
  nextLabel: string;
  started: boolean;
  units: { label: string; done: number; total: number }[];
  /** Last 14 days of this course's study minutes (zeros where unattributed). */
  spark: number[];
  weekSecs: number;
};

function isoDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function fmtMins(secs: number): string {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
}

function useCardData(course: CourseMeta): CardData {
  const { hydrated, doneCount, isComplete, days } = useProgress();
  return useMemo(() => {
    const checksDone = hydrated ? course.lessonIds.reduce((n, id) => n + doneCount(id), 0) : 0;
    const stepsDone = hydrated ? course.lessonIds.filter((id) => isComplete(id)).length : 0;
    const open = course.lessonIds.filter((id) => !hydrated || !isComplete(id));
    const next = open.find((id) => hydrated && doneCount(id) > 0) ?? open[0] ?? course.lessonIds[0];
    const units = course.unitIds
      .map((uid) => {
        const ls = lessonsUnder(uid);
        return {
          label: labelFor(uid),
          total: ls.reduce((n, id) => n + checkpointsFor(id).length, 0),
          done: hydrated ? ls.reduce((n, id) => n + doneCount(id), 0) : 0,
        };
      })
      .filter((u) => u.total > 0);
    const spark: number[] = [];
    let weekSecs = 0;
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - 13);
    for (let i = 0; i < 14; i++) {
      const d: StudyDay | undefined = days[isoDay(cursor)];
      const secs = d?.courses?.[course.slug] ?? 0;
      spark.push(secs / 60);
      if (i >= 7) weekSecs += secs;
      cursor.setDate(cursor.getDate() + 1);
    }
    return {
      course,
      tone: courseTone(course.slug),
      hydrated,
      pct: course.totalCheckpoints ? Math.round((checksDone / course.totalCheckpoints) * 100) : 0,
      checksDone,
      stepsDone,
      nextLabel: hydrated && next ? labelFor(next) : " ",
      started: checksDone > 0,
      units,
      spark,
      weekSecs,
    };
  }, [course, hydrated, doneCount, isComplete, days]);
}

/* Shared bits ------------------------------------------------------- */

function Arrow({ tone }: { tone: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0" style={{ color: tone }}>
      <path d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NextRow({ d, className = "" }: { d: CardData; className?: string }) {
  return (
    <div className={"flex items-center justify-between gap-3 " + className}>
      <p className="min-w-0 truncate text-[13px] leading-5 text-ink">
        <span className="text-placeholder">{d.started ? "Next · " : "Start · "}</span>
        {d.nextLabel}
      </p>
      <Arrow tone={d.tone} />
    </div>
  );
}

const CARD = "course-card squircle block p-3.5 lg:p-[18px]";

/* A · Editorial — type only: eyebrow, title, one thin rule of progress. */
function CardEditorial({ d }: { d: CardData }) {
  return (
    <Link href={`/${d.course.slug}`} className={CARD}>
      <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: d.tone }}>
        Course
      </p>
      <p className="mt-2 truncate font-display text-[22px] font-semibold leading-tight tracking-[-0.01em] text-ink">
        {d.course.title}
      </p>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-muted">{d.course.subtitle}</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ backgroundColor: `${d.tone}1f` }}>
          <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.tone }} />
        </div>
        <span className="shrink-0 text-[12px] font-semibold tabular-nums text-ink">{d.pct}%</span>
      </div>
      <NextRow d={d} className="mt-4 border-t border-line pt-3" />
    </Link>
  );
}

/* B · Ring — the completion ring leads, everything else follows it. */
function CardRing({ d }: { d: CardData }) {
  return (
    <Link href={`/${d.course.slug}`} className={CARD}>
      <div className="flex items-center gap-4">
        <span style={{ color: d.tone }}>
          <CompletionRing value={d.pct / 100} size={48} stroke={4.5} label={`${d.pct} percent complete`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[19px] font-semibold leading-tight text-ink">{d.course.title}</p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted">{d.course.subtitle}</p>
        </div>
      </div>
      <p className="mt-4 truncate text-[12px] text-placeholder">
        {d.checksDone} of {d.course.totalCheckpoints} checkpoints · {d.stepsDone} of {d.course.lessonIds.length} steps
      </p>
      <NextRow d={d} className="mt-3 border-t border-line pt-3" />
    </Link>
  );
}

/* C · Spine — a book spine on the left edge, filling as the course does. */
function CardSpine({ d }: { d: CardData }) {
  return (
    <Link href={`/${d.course.slug}`} className={CARD}>
      <div className="flex gap-4">
        <div className="relative w-[7px] shrink-0 self-stretch overflow-hidden rounded-full" style={{ backgroundColor: `${d.tone}1f` }}>
          <div className="absolute inset-x-0 bottom-0 rounded-full" style={{ height: `${d.pct}%`, backgroundColor: d.tone }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate font-display text-[19px] font-semibold leading-tight text-ink">{d.course.title}</p>
            <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink">{d.pct}%</span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-5 text-muted">{d.course.subtitle}</p>
          <p className="mt-3 truncate text-[12px] text-placeholder">
            {d.checksDone} of {d.course.totalCheckpoints} checkpoints · {d.stepsDone} of {d.course.lessonIds.length} steps
          </p>
          <NextRow d={d} className="mt-3 border-t border-line pt-3" />
        </div>
      </div>
    </Link>
  );
}

/* D · Contents — the card as a table of contents: a row per unit. */
function CardContents({ d }: { d: CardData }) {
  return (
    <Link href={`/${d.course.slug}`} className={CARD}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="min-w-0 truncate font-display text-[19px] font-semibold leading-tight text-ink">{d.course.title}</p>
        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink">{d.pct}%</span>
      </div>
      <div className="mt-3.5 flex flex-col gap-2">
        {d.units.slice(0, 4).map((u) => (
          <div key={u.label} className="flex items-center gap-3">
            <span className="w-[38%] truncate text-[12px] text-muted">{u.label}</span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ backgroundColor: `${d.tone}1f` }}>
              <div className="h-full rounded-full" style={{ width: `${u.total ? (u.done / u.total) * 100 : 0}%`, backgroundColor: d.tone }} />
            </div>
            <span className="shrink-0 text-[11px] tabular-nums text-placeholder">
              {u.done}/{u.total}
            </span>
          </div>
        ))}
        {d.units.length > 4 && (
          <p className="text-[11px] text-placeholder">+ {d.units.length - 4} more units</p>
        )}
      </div>
      <NextRow d={d} className="mt-4 border-t border-line pt-3" />
    </Link>
  );
}

/* E · Study time — the course's own reading minutes as a backdrop sparkline. */
function CardStudyTime({ d }: { d: CardData }) {
  const W = 300;
  const H = 46;
  const max = Math.max(...d.spark, 1);
  const pts = d.spark.map((v, i) => ({ x: (i / (d.spark.length - 1)) * W, y: H - 6 - (v / max) * (H - 12) }));
  const line = smoothPath(pts);
  return (
    <Link href={`/${d.course.slug}`} className={CARD}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46px] opacity-70" aria-hidden="true">
        <svg width="100%" height="46" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block">
          <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={d.tone} fillOpacity="0.10" />
          <path d={line} fill="none" stroke={d.tone} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <CourseMark slug={d.course.slug} tone={d.tone} size={28} />
          <div className="text-right">
            <p className="font-display text-[22px] font-semibold leading-none tracking-[-0.02em] text-ink">
              {fmtMins(d.weekSecs)}
            </p>
            <p className="mt-1 text-[11px] font-medium text-muted">this week</p>
          </div>
        </div>
        <p className="mt-3 truncate font-display text-[19px] font-semibold leading-tight text-ink">{d.course.title}</p>
        <p className="mt-0.5 truncate text-[12.5px] text-muted">
          {d.pct}% complete · {d.stepsDone} of {d.course.lessonIds.length} steps
        </p>
        <NextRow d={d} className="mt-4 pb-8" />
      </div>
    </Link>
  );
}

/* F · Ink — the dark cut: course hue kept for the bar and the arrow only. */
function CardInk({ d }: { d: CardData }) {
  return (
    <Link href={`/${d.course.slug}`} className="squircle block rounded-[32px] bg-[#131315] p-3.5 text-white lg:p-[18px]">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate font-display text-[19px] font-semibold leading-tight">{d.course.title}</p>
        <p className="shrink-0 font-display text-[22px] font-semibold leading-none tracking-[-0.02em]">{d.pct}%</p>
      </div>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-white/60">{d.course.subtitle}</p>
      <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.tone }} />
      </div>
      <p className="mt-2 truncate text-[12px] text-white/45">
        {d.checksDone} of {d.course.totalCheckpoints} checkpoints · {d.stepsDone} of {d.course.lessonIds.length} steps
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <p className="min-w-0 truncate text-[13px] leading-5 text-white/90">
          <span className="text-white/45">{d.started ? "Next · " : "Start · "}</span>
          {d.nextLabel}
        </p>
        <Arrow tone={d.tone} />
      </div>
    </Link>
  );
}

/* G · Poster — a tone field up top carrying the mark and the number. */
function CardPoster({ d }: { d: CardData }) {
  return (
    <Link href={`/${d.course.slug}`} className={CARD}>
      <div
        className="squircle flex items-center justify-between rounded-2xl px-4 py-4"
        style={{ backgroundColor: `${d.tone}17` }}
      >
        <CourseMark slug={d.course.slug} tone={d.tone} size={38} />
        <div className="text-right">
          <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em]" style={{ color: d.tone }}>
            {d.pct}%
          </p>
          <p className="mt-1 text-[11px] font-medium text-muted">complete</p>
        </div>
      </div>
      <p className="mt-3.5 truncate font-display text-[19px] font-semibold leading-tight text-ink">{d.course.title}</p>
      <p className="mt-0.5 truncate text-[12.5px] text-muted">{d.course.subtitle}</p>
      <NextRow d={d} className="mt-4 border-t border-line pt-3" />
    </Link>
  );
}

/* The lab itself ----------------------------------------------------- */

const VARIANTS: { key: string; name: string; note: string; render: (d: CardData) => React.ReactNode }[] = [
  { key: "A", name: "Editorial", note: "type only — eyebrow, title, one rule of progress", render: (d) => <CardEditorial d={d} /> },
  { key: "B", name: "Ring", note: "the completion ring leads", render: (d) => <CardRing d={d} /> },
  { key: "C", name: "Spine", note: "a book spine on the left, filling upward", render: (d) => <CardSpine d={d} /> },
  { key: "D", name: "Contents", note: "a row per unit, like a contents page", render: (d) => <CardContents d={d} /> },
  { key: "E", name: "Study time", note: "the course's own minutes as a sparkline", render: (d) => <CardStudyTime d={d} /> },
  { key: "F", name: "Ink", note: "the dark cut", render: (d) => <CardInk d={d} /> },
  { key: "G", name: "Poster", note: "a tone field carries mark + number", render: (d) => <CardPoster d={d} /> },
];

export function CardLab() {
  const d = useCardData(COURSES[0]);
  return (
    <section className="mt-10 border-t border-line pt-8 pb-10">
      <h2 className="dash-heading">Course card lab — temporary, pick one</h2>
      <p className="mt-1.5 text-[12.5px] text-muted">
        Same live data in every card ({d.course.title}). The current design sits above under My courses.
      </p>
      <div className="mt-4 grid gap-x-3 gap-y-6 md:grid-cols-2">
        {VARIANTS.map((v) => (
          <div key={v.key}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-placeholder">
              {v.key} · {v.name} <span className="font-normal normal-case tracking-normal">— {v.note}</span>
            </p>
            {v.render(d)}
          </div>
        ))}
      </div>
    </section>
  );
}
