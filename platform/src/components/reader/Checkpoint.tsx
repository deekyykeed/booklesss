"use client";

import Link from "next/link";
import { labelFor, nextLessonId, pathForId } from "@/lib/course";
import { rate, useProgress, type Grasp } from "@/lib/progress";
import { SolarIcon, type SolarIconName } from "@/components/icons/solar";
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
 * Green is completion, the same thing it means everywhere else here.
 *
 * The marks changed twice on 2026-08-02. First the row lost its labels, and a
 * clipboard carrying the word "Later" became a bare clipboard saying nothing,
 * so it became a bookmark and a ticked circle. Then the owner called for a
 * thumbs pair, which is where it now sits — up for "Got it", down for "Later".
 *
 * Worth knowing why that was argued against first, in case it comes back
 * round: a thumb ordinarily rates the material, and the note button beside
 * this one already asks that ("Hard to follow", "Too long", "Needs an
 * example", "Something looks wrong"). The reading here is the other one — a
 * thumb is also the most universally understood yes/no on a phone, and needing
 * no word at all is exactly what a label-less row wants. Owner's call, taken
 * knowingly.
 *
 * Solar Duotone rather than MynaUI, also the owner's pick, which makes the
 * reader the third Solar surface after /workspace and the dashboard stat
 * cards. Duotone fills with currentColor twice (back layer at opacity .5), so
 * the mark shades itself out of whatever hue the button is set to and there is
 * no separate solid twin to swap in when answered — the colour is the whole
 * signal. */
const ANSWERS: { id: Grasp; label: string; icon: SolarIconName; tone: string }[] = [
  { id: "got", label: "Got it", icon: "like-bold-duotone", tone: "#17754d" },
  { id: "not", label: "Later", icon: "dislike-bold-duotone", tone: "#96601f" },
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
              /* The label is off-screen now (see .grasp-label), so the tooltip
                 is the only way a mouse reader recovers the word. */
              title={a.label}
              data-active={active ? "" : undefined}
              className="grasp-btn squircle"
              style={{ "--grasp-tone": a.tone } as React.CSSProperties}
            >
              {/* 21px. A duotone mark is filled, so it carries more weight per
                  pixel than the hairline it replaced — this is a shade smaller
                  than the 22px it would take as an outline, and it still fills
                  the 34px tap target properly. */}
              <SolarIcon name={a.icon} size={21} />
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
