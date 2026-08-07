import { CardMark } from "./card-glyphs";

/* ------------------------------------------------------------------ *
 * A course on the student's timetable that nobody has written yet.
 *
 * Owner, 2026-08-07: "in the queued courses in the pipeline they will still
 * be course cards just greyed out and the button giving the expected date and
 * countdown."
 *
 * NO DATE, NO COUNTDOWN — that half of the ask conflicts with something
 * already decided. The disclosure list this replaced (PendingCourses) carries
 * its own note from 2026-08-04: there is no expected-build date anywhere in
 * the data, on `courses` or in the pipeline tables, and inventing one is the
 * app making a promise nobody made — the same trap MemberCount's fake counter
 * fell into on the landing page. Raised with the owner directly; his call was
 * a REAL number instead — how many other students on the same programme also
 * listed this course, off `student_courses` via the same `/api/curriculum`
 * route onboarding already uses to suggest courses. Zero is a true answer too,
 * and reads as "on your timetable, not built yet" rather than a bare zero.
 *
 * GREYED, NOT DIMMED. No blanket `opacity` on the card — that would fade the
 * border and shadow into a smudge along with the text, and a smudged card
 * reads as broken rather than as "not available yet". Every colour that
 * would normally carry meaning here (the mark, the title) drops to a muted
 * token instead; the shape, border and shadow are the SAME `.course-card`
 * shell the active grid uses, so a pipeline card still reads as a course
 * card, just one with nothing lit up on it.
 *
 * THE FOOT IS A `<div>`, NOT A LINK. There is nowhere for it to go — the step
 * doesn't exist — so it wears the resume button's shape (same radius, same
 * padding, same border) without wearing its affordance. Nothing here should
 * look pressable.
 * ------------------------------------------------------------------ */

export function PipelineCard({
  title,
  year,
  students,
}: {
  title: string;
  /** Which year of the programme, where the source recorded one. */
  year?: number | null;
  /** How many OTHER students on this programme also listed this course —
   *  real, off `student_courses`. Null while that hasn't been asked yet
   *  (still loading, or nobody's programme is known), which reads as the
   *  same "not built yet" line as a genuine zero — a pipeline card should
   *  never sit there implying a number is coming if one never arrives. */
  students: number | null;
}) {
  return (
    <div className="course-card squircle flex flex-col p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-placeholder">
          <CardMark size={24} />
        </span>
      </div>

      <div className="mt-auto pt-8">
        <p className="min-w-0 flex-1 font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-ink-2">
          {title}
        </p>
        <p className="mt-2 text-[12.5px] leading-5 text-muted">
          {year ? `Year ${year} — not written yet` : "Not written yet"}
        </p>

        {/* The resume button's shape, carrying a fact instead of an action. */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] border border-line px-3.5 py-2.5">
          <span className="min-w-0 truncate text-[13px] leading-5 text-muted">
            {students && students > 0
              ? `${students} other${students === 1 ? "" : "s"} on your programme want this too`
              : "The more students taking it, the sooner it gets built"}
          </span>
        </div>
      </div>
    </div>
  );
}
