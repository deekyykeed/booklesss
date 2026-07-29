"use client";

import { useState } from "react";
import Link from "next/link";
import { checkpointsFor, hasChecks, labelFor, nextLessonId, pathForId, type Check } from "@/lib/course";
import { recordCheck, useProgress } from "@/lib/progress";
import { CompletionRing } from "./CompletionRing";
import { CheckQuiz } from "./CheckQuiz";

/* Hand-inlined rather than via <Icon>: that helper imports the whole Solar
 * JSON, which would land in the client bundle for one glyph. Same reasoning
 * as the composer's icons in RightPanel. */
function CheckMark({ done, quiz }: { done: boolean; quiz?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle
        cx="12"
        cy="12"
        r="9.25"
        fill={done ? "var(--color-brand)" : "none"}
        stroke={done ? "var(--color-brand)" : "currentColor"}
        strokeWidth="1.5"
        style={{ transition: "fill 200ms ease, stroke 200ms ease" }}
      />
      {/* A question mark where there's a question to answer, so the control
          says what it will do before you press it. Once earned, both states
          settle into the same tick. */}
      {quiz && !done ? (
        <path
          d="M9.6 9.3a2.5 2.5 0 1 1 3.3 2.37c-.55.2-.9.72-.9 1.3v.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        /* Ghosted at rest, half-lit on hover, solid once done — so the control
           reads as "there is a tick to earn here" before you touch it. */
        <path
          className="checkpoint-tick"
          d="m8.4 12.15 2.45 2.45 4.75-5.2"
          fill="none"
          stroke={done ? "#fff" : "currentColor"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {quiz && !done && <circle cx="12" cy="16.1" r="0.95" fill="currentColor" />}
    </svg>
  );
}

/* End-of-section checkpoint. One per section, so working your way down a step
 * fills its ring; the last one completes the step.
 *
 * Where the section carries a comprehension check, the tick has to be earned
 * by answering it — clicking opens the question rather than granting the tick.
 * Sections without one keep the plain self-marked tick. Already-done
 * checkpoints untick directly, so progress stays the reader's to correct. */
export function Checkpoint({
  lessonId,
  checkpointId,
  heading,
  check,
}: {
  lessonId: string;
  checkpointId: string;
  heading: string;
  check?: Check;
}) {
  const { hydrated, isDone, toggle } = useProgress();
  const [quizOpen, setQuizOpen] = useState(false);
  // Before hydration the server HTML knows nothing, so everything renders
  // unticked and settles once localStorage has been read.
  const done = hydrated && isDone(lessonId, checkpointId);
  const gated = !!check && !done;

  return (
    <div className="checkpoint-row">
      <span className="checkpoint-rule" aria-hidden="true" />
      <button
        type="button"
        onClick={() => (gated ? setQuizOpen(true) : toggle(lessonId, checkpointId))}
        aria-pressed={done}
        aria-haspopup={gated ? "dialog" : undefined}
        data-done={done ? "" : undefined}
        className="checkpoint-btn squircle"
      >
        <CheckMark done={done} quiz={!!check} />
        <span>{done ? "Done" : check ? "Check understanding" : "Mark as done"}</span>
      </button>

      {quizOpen && check && (
        <CheckQuiz
          check={check}
          heading={heading}
          onPass={(firstTry) => {
            recordCheck(lessonId, firstTry);
            toggle(lessonId, checkpointId);
            setQuizOpen(false);
          }}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </div>
  );
}

/* Closing panel of every step: the ring at full size, how far you've got, and
 * the way on. Complete the last checkpoint and this is what confirms it. */
export function StepComplete({ lessonId }: { lessonId: string }) {
  const { hydrated, doneCount, ratio, isComplete, completeAll, reset } = useProgress();
  const total = checkpointsFor(lessonId).length;
  if (!total) return null;

  const done = hydrated ? doneCount(lessonId) : 0;
  const complete = hydrated && isComplete(lessonId);
  const next = nextLessonId(lessonId);
  const gated = hasChecks(lessonId);

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
              ? "Every checkpoint on this step is ticked."
              : gated
                ? `${done} of ${total} checkpoints — answer each section's check to finish.`
                : `${done} of ${total} checkpoints ticked.`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {complete ? (
          <button type="button" onClick={() => reset(lessonId)} className="step-complete-btn squircle">
            Reset step
          </button>
        ) : (
          /* "Mark all done" would tick every checkpoint at once — which on a
             step with comprehension checks is a button for skipping them, so
             it only exists where the checkpoints are self-marked anyway. */
          !gated && (
            <button type="button" onClick={() => completeAll(lessonId)} className="step-complete-btn squircle">
              Mark all done
            </button>
          )
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
