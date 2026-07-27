"use client";

import Link from "next/link";
import { useMemo } from "react";
import { COURSES } from "@/lib/courses";
import { checkpointsFor, labelFor, pathForId } from "@/lib/course";
import { isStudyDay, studyHistory, useProgress } from "@/lib/progress";
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

/* One hue per stat, so a tile is identifiable before the number is read.
 * Validated together against the card surface with the dataviz script:
 * lightness band, chroma floor, all-pairs CVD separation and contrast all
 * pass. Green sits on Checkpoints deliberately — completion is the one thing
 * green means across this app, and a cleared checkpoint is exactly that. */
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

  /* This week against last. Both halves are measured the same way the streak
   * measures a day, so the tiles can't disagree with each other. */
  const week = useMemo(() => {
    const h = studyHistory(days, 14);
    const prev = h.slice(0, 7);
    const cur = h.slice(7);
    return {
      daysDelta: cur.filter(isStudyDay).length - prev.filter(isStudyDay).length,
      checks: cur.reduce((n, d) => n + d.checks, 0),
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
        <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Current streak"
            value={String(streak)}
            unit={streak === 1 ? "day" : "days"}
            lead={bestStreak > 0 ? `Best ${bestStreak}` : "—"}
            tail={bestStreak > 0 ? (bestStreak === 1 ? "day so far" : "days so far") : "no streak yet"}
            tone={TONE.streak}
            icon={<FireGlyph />}
          />
          <Stat
            label="Days studied"
            value={String(daysStudied)}
            unit={daysStudied === 1 ? "day" : "days"}
            lead={week.daysDelta > 0 ? `+${week.daysDelta}` : String(week.daysDelta)}
            tail="vs last week"
            tone={TONE.days}
            icon={<CalendarGlyph />}
          />
          <Stat
            label="Checkpoints"
            value={`${done.checks}`}
            unit={`/ ${totals.checks}`}
            lead={`+${week.checks}`}
            tail="this week"
            tone={TONE.checks}
            icon={<CheckGlyph />}
          />
          <Stat
            label="Steps complete"
            value={`${done.steps}`}
            unit={`/ ${totals.steps}`}
            lead={String(totals.steps - done.steps)}
            tail="still to go"
            tone={TONE.steps}
            icon={<MedalGlyph />}
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

/* ---------------- stat glyphs ----------------
 *
 * Solar · Bold Duotone, hand-inlined. Solar's duotones are two paths in
 * currentColor, the back one at opacity .5 — the set ships no colours of its
 * own, so "its default colours" would be whatever grey it inherits. Each stat
 * gets a hue instead and the two tones follow it, which is what makes the mark
 * read as itself at this size: grey duotone at 17px collapsed into a blob,
 * which is why these were Line before.
 *
 * The hues were run through the dataviz validator against the card surface:
 * lightness band, chroma floor, all-pairs CVD separation and contrast all
 * pass. Colour is never the only cue anyway — every tile is labelled.
 *
 * Inlined rather than resolved through <Icon> because this is a client
 * component, and <Icon> would pull the whole ~7,400-icon Solar set into the
 * bundle for four paths. Bodies copied byte-for-byte from @iconify-json/solar.
 */

const G = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, className: "shrink-0" } as const;

function FireGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" opacity=".5" d="M12.832 21.801c3.126-.626 7.168-2.875 7.168-8.69c0-5.291-3.873-8.815-6.658-10.434c-.619-.36-1.342.113-1.342.828v1.828c0 1.442-.606 4.074-2.29 5.169c-.86.559-1.79-.278-1.894-1.298l-.086-.838c-.1-.974-1.092-1.565-1.87-.971C4.461 8.46 3 10.33 3 13.11C3 20.221 8.289 22 10.933 22q.232 0 .484-.015c.446-.056 0 .099 1.415-.185" />
      <path fill="currentColor" d="M8 18.444c0 2.62 2.111 3.43 3.417 3.542c.446-.056 0 .099 1.415-.185C13.871 21.434 15 20.492 15 18.444c0-1.297-.819-2.098-1.46-2.473c-.196-.115-.424.03-.441.256c-.056.718-.746 1.29-1.215.744c-.415-.482-.59-1.187-.59-1.638v-.59c0-.354-.357-.59-.663-.408C9.495 15.008 8 16.395 8 18.445" />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724" />
      <path fill="currentColor" opacity=".5" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" />
      <path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" opacity=".5" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
      <path fill="currentColor" d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0" />
    </svg>
  );
}

function MedalGlyph() {
  return (
    <svg {...G}>
      <path fill="currentColor" opacity=".5" d="M12.795 2h-2c-1.886 0-2.829 0-3.414.586c-.586.586-.586 1.528-.586 3.414v3.5h10V6c0-1.886 0-2.828-.586-3.414S14.681 2 12.795 2" />
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M13.23 5.783a3 3 0 0 0-2.872 0L5.564 8.397A3 3 0 0 0 4 11.031v4.938a3 3 0 0 0 1.564 2.634l4.794 2.614a3 3 0 0 0 2.872 0l4.795-2.614a3 3 0 0 0 1.564-2.634V11.03a3 3 0 0 0-1.564-2.634zM11.794 10.5c-.284 0-.474.34-.854 1.023l-.098.176c-.108.194-.162.29-.246.354s-.19.088-.399.135l-.19.044c-.739.167-1.108.25-1.195.532c-.088.283.163.577.666 1.165l.13.152c.144.167.215.25.247.354s.022.215 0 .438l-.02.203c-.076.785-.114 1.178.116 1.352s.575.015 1.266-.303l.179-.082c.196-.09.294-.135.398-.135s.203.045.399.135l.179.082c.69.319 1.036.477 1.266.303s.192-.567.116-1.352l-.02-.203c-.022-.223-.033-.334 0-.438c.032-.103.103-.187.246-.354l.13-.152c.504-.588.755-.882.667-1.165c-.088-.282-.457-.365-1.194-.532l-.191-.044c-.21-.047-.315-.07-.399-.135c-.084-.064-.138-.16-.246-.354l-.098-.176c-.38-.682-.57-1.023-.855-1.023" />
    </svg>
  );
}

function Stat({
  label,
  value,
  unit,
  lead,
  tail,
  tone,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  /** The footer's emphasised figure, in the stat's hue. Always a measured
   *  number — there is no projection or target anywhere on this page. */
  lead: string;
  /** What that figure is of, in muted ink. */
  tail: string;
  /** The stat's hue. Carries the glyph, its chip and the footer figure. */
  tone: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="dash-stat squircle">
      <p className="dash-stat-label">{label}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="dash-stat-value">{value}</span>
        {unit && <span className="dash-stat-unit">{unit}</span>}
      </p>
      <p className="dash-stat-foot">
        {/* colour-mix rather than an eight-digit hex, so one token per stat
            drives the glyph, its chip and the figure, and they can't drift */}
        <span
          className="dash-stat-chip"
          style={{
            color: tone,
            borderColor: `color-mix(in oklab, ${tone} 55%, transparent)`,
          }}
        >
          {icon}
        </span>
        <span className="dash-stat-lead" style={{ color: tone }}>
          {lead}
        </span>
        <span className="truncate">{tail}</span>
      </p>
    </div>
  );
}
