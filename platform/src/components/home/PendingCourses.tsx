"use client";

import { MynaIcon } from "@/components/icons/myna";
import { useIdentity } from "@/lib/identity";
import { pendingCourses, programmeBySlug } from "@/lib/programmes";

/* ------------------------------------------------------------------ *
 * The courses they picked that we have not written yet.
 *
 * Owner, 2026-08-04: "i should be shown the courses i picked, ordered first
 * with the ones that are available and then the ones that are not available in
 * a closed dropdown below it."
 *
 * The available half is the card grid above this — that has always been drawn.
 * This is the other half, which until now went nowhere a student could see: a
 * timetable of eight courses was ticked, three had content, and the other five
 * vanished. From the student's side that reads as the app having lost their
 * answer, which is worse than it reads from ours, where those five are the most
 * valuable thing they gave us — the demand signal that ranks what gets built.
 *
 * CLOSED BY DEFAULT, and a `<details>` rather than a hand-rolled disclosure: it
 * opens with no JavaScript, it is announced correctly to a screen reader
 * without a single aria attribute, and it survives the page being saved for
 * offline reading. The summary carries the count, so the answer to "did it keep
 * my other five?" is legible without opening anything.
 *
 * NO DATE ON THESE, DELIBERATELY. The obvious thing to put beside a course we
 * have not built is when it will be ready, and there is no such data anywhere —
 * not on `courses`, not in the pipeline tables. Inventing one would be the app
 * making a promise nobody has made: a student who paces themselves to a date we
 * guessed and does not get the course has been misled by us, and that costs
 * more than the reassurance is worth. When there is a date somebody will
 * actually stand behind, it goes on the course row and prints here.
 * ------------------------------------------------------------------ */

export function PendingCourses() {
  const { identity, hydrated } = useIdentity();

  /* Nothing until the store has been read — a list that renders empty and then
     fills in is a list that moves the page under somebody's thumb. */
  if (!hydrated || !identity) return null;

  const prog = programmeBySlug(identity.school, identity.programme);
  const pending = pendingCourses(prog, identity.curriculum);
  /* A student whose programme is not on file typed their courses instead, and
     for them EVERY typed course is pending — there is nothing built behind a
     title nobody has scraped. `courses` holds whatever of them matched a built
     course, so the titles are shown as they wrote them. */
  const typed = prog ? [] : identity.typedCourses;

  const total = pending.length + typed.length;
  if (!total) return null;

  return (
    <details className="group mt-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 py-1.5 text-[13px] text-muted transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
        <MynaIcon
          name="chevron-right"
          size={15}
          strokeWidth={1.6}
          className="shrink-0 transition-transform group-open:rotate-90"
        />
        <span>
          {total} more {total === 1 ? "course" : "courses"} on your timetable
        </span>
      </summary>

      {/* Said once, here, rather than on every row — a line of small grey type
          repeated eight times is eight times the noise for one fact. */}
      <p className="mt-1 pl-[23px] text-[12.5px] leading-5 text-muted">
        We haven&apos;t written these yet. They&apos;re on the list, and the more students taking them,
        the sooner they get built.
      </p>

      <ul className="mt-2 flex flex-col gap-1.5 pl-[23px]">
        {pending.map((c) => (
          <li key={c.slug} className="flex items-baseline gap-2 text-[13px] leading-5">
            <span className="min-w-0 flex-1 truncate text-ink-2">{c.title}</span>
            {c.year ? <span className="shrink-0 text-[12px] text-placeholder">Year {c.year}</span> : null}
          </li>
        ))}
        {typed.map((title) => (
          <li key={title} className="flex items-baseline gap-2 text-[13px] leading-5">
            <span className="min-w-0 flex-1 truncate text-ink-2">{title}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
