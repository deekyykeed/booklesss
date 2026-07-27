"use client";

import Link from "next/link";
import { useMemo } from "react";
import { COURSES } from "@/lib/courses";
import { checkpointsFor, labelFor, pathForId } from "@/lib/course";
import { useProgress } from "@/lib/progress";
import { CompletionRing } from "@/components/reader/CompletionRing";
import { StudyChart } from "./StudyChart";

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
  const { hydrated, doneCount, isComplete, streak, daysStudied, studiedToday, totalSecs, days } =
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
        <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            value={String(streak)}
            unit={streak === 1 ? "day" : "days"}
            label="Current streak"
            lit={streak > 0}
            icon={<FireGlyph />}
          />
          <Stat
            value={String(daysStudied)}
            unit={daysStudied === 1 ? "day" : "days"}
            label="Days studied"
            icon={<CalendarGlyph />}
          />
          <Stat value={`${done.checks}`} unit={`/ ${totals.checks}`} label="Checkpoints" icon={<CheckGlyph />} />
          <Stat value={`${done.steps}`} unit={`/ ${totals.steps}`} label="Steps complete" icon={<MedalGlyph />} />
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

/* ---------------- stat glyphs ----------------
 *
 * Solar · Line, hand-inlined. Line rather than Bold Duotone: at 17px Solar's
 * duotones collapse into a grey blob — the faint layer is usually a filled
 * panel, and the detail drawn inside it disappears. Inlined rather than
 * resolved through <Icon> because this file is a client component, and <Icon>
 * would pull the whole ~7,400-icon Solar set into the bundle for four paths.
 * Bodies copied byte-for-byte from @iconify-json/solar.
 *
 * They're identifying marks, not decoration: one per measure, sized to sit
 * beside the number without competing with it. */

const G = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, className: "shrink-0" } as const;

function FireGlyph() {
  return (
    <svg {...G}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 13.111C20 20.222 13.956 22 10.933 22C8.29 22 3 20.222 3 13.111c0-2.782 1.461-4.65 2.86-5.716c.778-.594 1.77-.003 1.87.971l.086.838c.105 1.02 1.033 1.857 1.893 1.298C11.394 9.407 12 6.775 12 5.333V5.01c0-1.43 1.444-2.35 2.602-1.512C17.165 5.35 20 8.584 20 13.11Z" />
        <path d="M8 18.445C8 21.289 10.489 22 11.733 22c1.09 0 3.267-.711 3.267-3.555c0-1.102-.59-1.845-1.16-2.274c-.398-.299-.957-.03-1.094.449c-.178.624-.823 1.016-1.152.456c-.3-.512-.3-1.28-.3-1.743c0-.636-.64-1.048-1.155-.674C9.106 15.409 8 16.68 8 18.445Z" />
      </g>
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg {...G}>
      <g fill="none">
        <path stroke="currentColor" strokeWidth="1.5" d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" />
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M7 4V2.5M17 4V2.5M2.5 9h19" />
        <path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
      </g>
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg {...G}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5l2 2l5-5" />
      </g>
    </svg>
  );
}

function MedalGlyph() {
  return (
    <svg {...G}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 8V6c0-1.886 0-2.828-.586-3.414S14.886 2 13 2h-2c-1.886 0-2.828 0-3.414.586S7 4.114 7 6v2" />
        <path d="M10.564 5.783a3 3 0 0 1 2.872 0l4.794 2.614a3 3 0 0 1 1.564 2.634v4.938a3 3 0 0 1-1.564 2.634l-4.794 2.614a3 3 0 0 1-2.872 0l-4.795-2.614a3 3 0 0 1-1.563-2.634V11.03a3 3 0 0 1 1.563-2.634z" />
        <path d="M11.146 11.523c.38-.682.57-1.023.854-1.023s.474.341.854 1.023l.098.176c.108.194.162.29.246.355c.085.063.19.087.4.135l.19.043c.738.167 1.107.25 1.195.533c.088.282-.164.576-.667 1.164l-.13.152c-.143.168-.215.251-.247.355s-.021.214 0 .438l.02.203c.076.784.114 1.177-.115 1.351c-.23.175-.576.016-1.267-.302l-.178-.083c-.197-.09-.295-.135-.399-.135s-.202.045-.399.135l-.178.083c-.691.318-1.037.477-1.267.302c-.23-.174-.191-.567-.115-1.351l.02-.203c.021-.224.032-.335 0-.438c-.032-.104-.104-.187-.247-.355l-.13-.152c-.503-.588-.755-.882-.667-1.164c.088-.283.457-.366 1.195-.533l.19-.043c.21-.048.315-.072.4-.135c.084-.064.138-.161.246-.355z" />
      </g>
    </svg>
  );
}

function Stat({
  value,
  unit,
  label,
  lit,
  icon,
}: {
  value: string;
  unit?: string;
  label: string;
  lit?: boolean;
  icon: React.ReactNode;
}) {
  // The lit streak takes the icon with it, so the tile reads as one thing
  // rather than a green number beside a grey mark.
  const tone = lit ? "var(--color-brand-deep)" : "var(--color-ink)";
  return (
    <div className="dash-stat squircle">
      <p className="flex items-baseline gap-1.5">
        <span
          className="self-center"
          style={{ color: lit ? "var(--color-brand-deep)" : "var(--color-placeholder)" }}
        >
          {icon}
        </span>
        <span className="font-display text-[22px] font-semibold tabular-nums leading-none" style={{ color: tone }}>
          {value}
        </span>
        {unit && <span className="text-[11.5px] text-placeholder">{unit}</span>}
      </p>
      <p className="mt-1.5 text-[11.5px] leading-4 text-muted">{label}</p>
    </div>
  );
}
