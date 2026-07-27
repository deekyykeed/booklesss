"use client";

import Link from "next/link";
import { checkpointsFor, labelFor, nextLessonId, pathForId } from "@/lib/course";
import { useProgress } from "@/lib/progress";
import { CompletionRing } from "./CompletionRing";

/* Hand-inlined rather than via <Icon>: that helper imports the whole Solar
 * JSON, which would land in the client bundle for one glyph. Same reasoning
 * as the composer's icons in RightPanel. */
function CheckMark({ done }: { done: boolean }) {
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
      {/* Ghosted at rest, half-lit on hover, solid once done — so the control
          reads as "there is a tick to earn here" before you touch it. */}
      <path
        className="checkpoint-tick"
        d="m8.4 12.15 2.45 2.45 4.75-5.2"
        fill="none"
        stroke={done ? "#fff" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* End-of-section checkpoint. One per section, so ticking your way down a step
 * fills its ring; the last tick completes the step. */
export function Checkpoint({ lessonId, checkpointId }: { lessonId: string; checkpointId: string }) {
  const { hydrated, isDone, toggle } = useProgress();
  // Before hydration the server HTML knows nothing, so everything renders
  // unticked and settles once localStorage has been read.
  const done = hydrated && isDone(lessonId, checkpointId);

  return (
    <div className="checkpoint-row">
      <span className="checkpoint-rule" aria-hidden="true" />
      <button
        type="button"
        onClick={() => toggle(lessonId, checkpointId)}
        aria-pressed={done}
        data-done={done ? "" : undefined}
        className="checkpoint-btn squircle"
      >
        <CheckMark done={done} />
        <span>{done ? "Done" : "Mark as done"}</span>
      </button>
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
          <button type="button" onClick={() => completeAll(lessonId)} className="step-complete-btn squircle">
            Mark all done
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
