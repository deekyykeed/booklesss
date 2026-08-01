"use client";

import Link from "next/link";
import { labelFor, nextLessonId, pathForId } from "@/lib/course";
import { rate, useProgress, type Grasp } from "@/lib/progress";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import { SectionNote } from "./SectionNote";

/* Two answers: "Later" and "Got it".
 *
 * It was three, worst-to-best ("Not yet", "Almost", "Got it"), and the owner's
 * objection to "Not yet" is the right one: it asks the reader to grade
 * themselves and then leaves them with nothing to do about the grade. "Later"
 * is a decision instead of a verdict, and it is the one the reader actually
 * has: come back to this, or move on. "Almost" went with it, because the
 * moment the scale stops being a self-rating a midpoint means nothing.
 *
 * `Grasp` still carries "almost" and progress.tsx still weights it at 0.5, so
 * ratings already saved on a device keep counting. Nothing writes it any more.
 *
 * Amber then green, each dark enough to hold 5.2:1 on the content surface.
 * Green is completion, the same thing it means everywhere else here. */
const ANSWERS: { id: Grasp; label: string; icon: MynaIconName; tone: string }[] = [
  { id: "not", label: "Later", icon: "clipboard", tone: "#96601f" },
  { id: "got", label: "Got it", icon: "like", tone: "#17754d" },
];

/* End-of-section checkpoint — a scale rather than a tick.
 *
 * "Mark as done" only ever asked whether the reader had scrolled past. Asking
 * what they want to do about the section costs the same one tap and returns
 * something the dashboard can use: which steps are understood and which are
 * waiting to be come back to. Either answer clears the checkpoint (see rate():
 * withholding progress from an honest "Later" would just teach everyone to
 * press the good one); pressing the answer you already gave takes it back.
 *
 * The buttons carry their own words, so there is no prompt above them. */
export function Checkpoint({
  lessonId,
  checkpointId,
  heading,
}: {
  lessonId: string;
  checkpointId: string;
  heading: string;
}) {
  const { hydrated, isDone, graspOf, toggle } = useProgress();
  // Before hydration the server HTML knows nothing, so everything renders
  // unanswered and settles once localStorage has been read.
  const done = hydrated && isDone(lessonId, checkpointId);
  const chosen = hydrated ? graspOf(lessonId, checkpointId) : null;

  return (
    /* Two controls at opposite ends, asking two different questions: what the
       reader wants to do about the section (left) and how it read (right).
       Pushed apart rather than sat together, so neither looks like an option
       in the other's set. */
    <div className="checkpoint-row flex flex-wrap items-center justify-between gap-3">
      <SectionNote lessonId={lessonId} sectionId={checkpointId} />
      <div
        className="grasp-group"
        role="radiogroup"
        aria-label={`How much of "${heading}" landed?`}
        data-answered={chosen ?? undefined}
      >
        {ANSWERS.map((a) => {
          const active = chosen === a.id;
          return (
            <button
              key={a.id}
              type="button"
              /* Pressing the current answer takes it back — the same
                 second-press-undoes rule the tick had, so an answer stays the
                 reader's to correct. */
              onClick={() => (active ? toggle(lessonId, checkpointId) : rate(lessonId, checkpointId, a.id))}
              role="radio"
              aria-checked={active}
              aria-label={a.label}
              data-active={active ? "" : undefined}
              className="grasp-btn squircle"
              style={{ "--grasp-tone": a.tone } as React.CSSProperties}
            >
              <MynaIcon name={active ? (`${a.icon}-solid` as MynaIconName) : a.icon} size={17} />
              <span className="grasp-label">{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* The foot of a step. */
export function StepComplete({ lessonId }: { lessonId: string }) {
  const next = nextLessonId(lessonId);
  /* No closing card. It carried a ring, a progress count, a "Keep going"
   * heading and a "Mark rest done" button, and every one of those was the page
   * talking about itself. "Keep going" congratulates a reader who has not
   * finished; the count repeats what the sidebar already shows; and "Mark rest
   * done" asks someone to declare sections finished that they have not read,
   * which is the one thing the checkpoints exist to record honestly.
   *
   * What is left is the only thing the reader wanted at the foot of a step:
   * the way on. With no next step the page simply stops. */
  if (!next) return null;

  return (
    <Link
      href={pathForId(next)}
      className="mt-14 flex items-center gap-2 text-[17px] font-medium text-ink transition-colors hover:text-muted"
    >
      <span className="truncate">{labelFor(next)}</span>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        <path
          d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
