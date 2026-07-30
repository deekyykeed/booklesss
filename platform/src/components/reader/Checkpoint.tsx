"use client";

import Link from "next/link";
import { checkpointsFor, labelFor, nextLessonId, pathForId } from "@/lib/course";
import { rate, useProgress, type Grasp } from "@/lib/progress";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import { CompletionRing } from "./CompletionRing";

/* The five answers, best first — a confidence ramp that reads by meaning, not
 * by an abstract bar count: a tick for understood, a smile for nearly, a
 * half-circle for the middle, a frown for struggling, a cross for not yet. Each
 * is a proper labelled button, the icon beside its word.
 *
 * Hues run green to red across the ramp, evenly stepped, each dark enough to
 * hold at 5.2:1 or better on the content surface. Green is completion, the
 * same thing it means everywhere else here. */
const ANSWERS: { id: Grasp; label: string; icon: MynaIconName; tone: string }[] = [
  { id: "got", label: "Got it", icon: "check-circle", tone: "#17754d" },
  { id: "mostly", label: "Mostly", icon: "smile", tone: "#4d7326" },
  { id: "half", label: "Half", icon: "circle-half", tone: "#7a6a1c" },
  { id: "barely", label: "Barely", icon: "sad", tone: "#a3512b" },
  { id: "not", label: "Not yet", icon: "x-circle", tone: "#a33b31" },
];

/* End-of-section checkpoint — a scale rather than a tick.
 *
 * "Mark as done" only ever asked whether the reader had scrolled past. Asking
 * how much of the section landed costs the same one tap and returns something
 * the dashboard can use: which steps are understood and which need another
 * pass. Any of the five answers clears the checkpoint (see rate() —
 * withholding progress from an honest "Not yet" would just teach everyone to
 * press the top of the scale); pressing the answer you already gave takes it
 * back.
 *
 * The buttons carry their own words, so there's no prompt above them — a row
 * of "Got it … Not yet" reads as a self-rating on its own. */
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
    <div className="checkpoint-row">
      <span className="checkpoint-rule" aria-hidden="true" />
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

/* Closing panel of every step: the ring at full size, how far you've got, and
 * the way on. Answer the last checkpoint and this is what confirms it. */
export function StepComplete({ lessonId }: { lessonId: string }) {
  const { hydrated, doneCount, ratio, isComplete, completeAll, reset, grasp } = useProgress();
  const total = checkpointsFor(lessonId).length;
  if (!total) return null;

  const done = hydrated ? doneCount(lessonId) : 0;
  const complete = hydrated && isComplete(lessonId);
  const next = nextLessonId(lessonId);

  /* What the reader said about this step, so the closer reports the sections
   * that didn't land rather than only counting the ones that are finished. */
  const answers = Object.values(grasp[lessonId] ?? {});
  const shaky = answers.filter((g) => g !== "got").length;

  return (
    <div className="step-complete squircle" data-complete={complete ? "" : undefined}>
      <div className="flex items-center gap-4">
        <CompletionRing
          value={hydrated ? ratio(lessonId) : 0}
          size={44}
          stroke={3.5}
          className="text-ink"
          label={`${done} of ${total} checkpoints complete`}
        />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[17px] font-semibold leading-tight text-ink">
            {complete ? "Step complete" : "Keep going"}
          </p>
          <p className="mt-0.5 text-[13.5px] leading-5 text-muted">
            {complete
              ? shaky > 0
                ? `Every section answered — ${shaky} you'd want another pass at.`
                : "Every section here landed."
              : `${done} of ${total} sections answered.`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {complete ? (
          <button type="button" onClick={() => reset(lessonId)} className="step-complete-btn squircle">
            Reset step
          </button>
        ) : (
          /* Clears the remaining checkpoints without answering them — for a
             step being revisited, where the reader doesn't want to re-answer
             what they already know. It records progress, not understanding,
             which is why the sections it clears stay out of the figures. */
          <button type="button" onClick={() => completeAll(lessonId)} className="step-complete-btn squircle">
            Mark rest done
          </button>
        )}
        {next && (
          <Link href={pathForId(next)} className="step-complete-next squircle" data-primary={complete ? "" : undefined}>
            <span className="truncate">Next · {labelFor(next)}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
              <path
                d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
