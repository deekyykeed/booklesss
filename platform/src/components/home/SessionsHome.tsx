"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PlumpIcon } from "@/components/icons/plump";
import { enrolledCourses } from "@/lib/courses";
import { useIdentity } from "@/lib/identity";
import { useProgress } from "@/lib/progress";
import { sessionsForCourse, type SessionRef } from "@/lib/session-nav";
import { courseTone } from "./tones";

/* ------------------------------------------------------------------ *
 * The home screen, 2026-08-27 — drawn from the owner's sketch.
 *
 * The sketch is a phone: the wordmark and two circles across the top, the words
 * "Your sessions", two cards under them, a lot of air, and a row at the bottom
 * with a big circle in the middle of it. That is the whole screen, and the
 * omissions are the design. What used to be here — a greeting, four stat tiles
 * with sparklines, the courses grid, the offline tools — is in
 * `archive/HomeView.tsx`, parked on the owner's call ("drop it for now").
 *
 * SO THIS FILE IS ONE LIST AND NOTHING ELSE. The top row is the app's own
 * TopBar, unchanged. The bottom row is `HomeDock`, which lives in the layout
 * because it is `position: fixed` (see the note there). Everything between them
 * is here, and it is sessions.
 *
 * WHY SESSIONS AND NOT COURSES. A course is a shelf; a session is a thing you
 * can do in the next twelve minutes. The home screen's job on a phone, on
 * Zambian mobile data, between lectures, is to answer "what now" in one tap —
 * and the big button below is a voice agent, so a screen that offers the same
 * material as guided calls is the screen that agrees with its own primary
 * action. The courses grid still exists; it is a tab away.
 *
 * NOTHING WAS AUTHORED TO FILL IT. `lib/session-nav` derives a session from the
 * lesson tree every course already has, so this list was populated the moment
 * it was written, for all four courses, and a new course appears in it by being
 * written normally.
 * ------------------------------------------------------------------ */

/** How many cards the list holds before it stops. */
const SHOWN = 6;

type Row = SessionRef & {
  /** Course slug, for the hue and the kicker. */
  course: string;
  courseTitle: string;
  /** Steps in this group the student has finished. */
  done: number;
};

/**
 * The sessions worth putting in front of somebody, in the order they should
 * meet them.
 *
 * ROUND-ROBIN ACROSS THEIR COURSES, not course-by-course. Treasury has 21
 * sessions and Strategic Management has 3; concatenating them would give a
 * student taking both a home screen that is entirely Treasury, six cards deep,
 * and the second course would never appear above the fold. Taking one from each
 * course in turn means the first row of the list is a picture of the term.
 *
 * Within a course the order is: the group they are part-way through first (a
 * thing half-done is the most likely next tap), then the first group they have
 * not started, then onwards. Finished groups drop out entirely — they are still
 * reachable from the course page, and a home screen is not an archive.
 */
function pick(
  courses: { slug: string; title: string; unitIds: string[] }[],
  isComplete: (lessonId: string) => boolean,
  hydrated: boolean,
): Row[] {
  const queues = courses.map((c) => {
    const rows = sessionsForCourse(c.unitIds).map((s) => ({
      ...s,
      course: c.slug,
      courseTitle: c.title,
      done: hydrated ? s.stepIds.filter(isComplete).length : 0,
    }));

    /* Before the store hydrates every count is zero, so "part-way through"
       cannot be known and this is simply course order — which is the right
       answer to show for the half-second before the device is read, and is why
       the skeleton below and this list are the same shape. */
    const unfinished = rows.filter((r) => r.done < r.stepIds.length);
    const started = unfinished.filter((r) => r.done > 0);
    const fresh = unfinished.filter((r) => r.done === 0);
    return [...started, ...fresh];
  });

  const out: Row[] = [];
  for (let i = 0; out.length < SHOWN; i++) {
    /* Nothing left in any queue — every one is shorter than i. Without this the
       loop would spin forever on a student whose courses are all complete. */
    if (queues.every((q) => i >= q.length)) break;
    for (const q of queues) {
      if (i < q.length && out.length < SHOWN) out.push(q[i]);
    }
  }
  return out;
}

export function SessionsHome() {
  const { identity, hydrated: idHydrated } = useIdentity();
  const { hydrated, isComplete } = useProgress();

  const mine = useMemo(() => enrolledCourses(identity?.courses), [identity]);
  const rows = useMemo(() => pick(mine, isComplete, hydrated), [mine, isComplete, hydrated]);

  /* Both stores, because the list needs the courses (identity) AND the counts
     (progress), and filling in the two halves at different moments is the
     "dashboard that assembles itself in four stages" this app has a rule
     against. One skeleton, one swap. */
  const ready = idHydrated && hydrated;

  return (
    <div className="home-surface">
      <header className="home-head">
        <h1 className="home-title">Your sessions</h1>
        <p className="home-sub">
          {ready && rows.length
            ? "Tap one to be walked through it, or press the button below and just ask."
            : "A guided run through a few steps at a time, about twelve minutes each."}
        </p>
      </header>

      {!ready ? (
        <SessionSkeleton />
      ) : rows.length ? (
        <ul className="home-cards">
          {rows.map((r) => (
            <SessionCard key={r.course + "/" + r.id} row={r} />
          ))}
        </ul>
      ) : mine.length ? (
        <Empty
          line="Every session in your courses is done."
          cta={{ href: "/dashboard/courses", label: "Go back over a course" }}
        />
      ) : (
        <Empty
          line="No courses on your record yet."
          cta={{ href: "/dashboard/courses", label: "Pick your courses" }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * One card.
 *
 * The sketch draws a plain rounded rectangle with nothing in it, so what goes
 * inside is a decision rather than a reading. It is the four things a person
 * needs to choose between two sessions: which course, what it is called, how
 * long it will take, and how much of it is already behind them.
 *
 * THE PROGRESS RULE IS THE ONLY ACCENT ON THE CARD. --color-accent marks the
 * current thing across this surface — the dock row you are on, the part of a
 * session you have covered — and a card carries no other colour, so a glance
 * down the list reads as a column of how-far-along rather than as decoration.
 * ------------------------------------------------------------------ */
function SessionCard({ row }: { row: Row }) {
  const total = row.stepIds.length;
  const ratio = total ? row.done / total : 0;

  /* The parent folder's name, falling back to the course's — and NEVER the
     title again. A course whose steps sit directly under one root node gives
     the group the course's own name, so Corporate Finance drew a card reading
     "CORPORATE FINANCE / Corporate Finance": the kicker said nothing and cost a
     line. Where they agree, the kicker is dropped rather than the title, since
     the title is the thing being chosen between. */
  const kicker = row.kicker ?? row.courseTitle;

  return (
    <li>
      <Link href={row.path} className="home-card">
        {kicker.toLowerCase() === row.title.toLowerCase() ? null : (
          <span className="home-card-kicker">{kicker}</span>
        )}
        <span className="home-card-title">{row.title}</span>

        <span className="home-card-meta">
          {total} {total === 1 ? "step" : "steps"} · about {row.minutes} min
        </span>

        {/* Drawn on every card, empty when nothing is done. A bar that appears
            only once you start would make the cards different heights and the
            list would reflow as you worked through it. */}
        <span className="home-card-bar" aria-hidden>
          <span style={{ transform: `scaleX(${ratio})` }} />
        </span>

        <span className="home-card-foot">
          <span className="home-card-done">
            {row.done ? `${row.done} of ${total} read` : "Not started"}
          </span>
          <span
            className="home-card-go"
            style={{ ["--tone" as string]: courseTone(row.course) }}
            aria-hidden
          >
            <PlumpIcon
              name="button-play-circle"
              size={26}
              light="var(--color-home-sunk)"
              dark="var(--tone)"
            />
          </span>
        </span>
      </Link>
    </li>
  );
}

/* Two cards, the same boxes the real ones are, with only the FILL differing —
 * the app's rule about placeholders. Two, because two is what the sketch draws
 * and because a screen of six grey rectangles reads as a failure state. */
function SessionSkeleton() {
  return (
    <ul className="home-cards" aria-hidden>
      {[0, 1].map((i) => (
        <li key={i}>
          <div className="home-card home-card-ghost">
            <span className="ghost-line" style={{ width: "38%" }} />
            <span className="ghost-line ghost-lg" style={{ width: "72%" }} />
            <span className="ghost-line" style={{ width: "46%" }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty({ line, cta }: { line: string; cta: { href: string; label: string } }) {
  return (
    <div className="home-empty">
      <PlumpIcon
        name="voice-scan-1"
        size={44}
        light="var(--color-home-sunk)"
        dark="var(--color-placeholder)"
      />
      <p className="home-empty-line">{line}</p>
      <Link href={cta.href} className="home-empty-cta">
        {cta.label}
      </Link>
    </div>
  );
}
