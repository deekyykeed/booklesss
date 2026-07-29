"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Check } from "@/lib/course";

/* ------------------------------------------------------------------ *
 * The comprehension check behind a checkpoint.
 *
 * A checkpoint is only ticked by answering correctly — "Done" on its own
 * proves nothing. A wrong answer isn't a dead end though: the explanation
 * appears either way, and you can try again immediately. So the tick still
 * has to be earned, but nobody gets stuck on it.
 *
 * Rendered in a portal on document.body: the reader's content surface is a
 * scroll container with its own stacking context, so a dialog rendered
 * inline would be trapped inside it.
 * ------------------------------------------------------------------ */

type Props = {
  check: Check;
  /** Section heading, shown as the eyebrow so the question has context. */
  heading: string;
  /** Passed the check — `firstTry` is false if it took more than one go. */
  onPass: (firstTry: boolean) => void;
  onClose: () => void;
};

export function CheckQuiz({ check, heading, onPass, onClose }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<"right" | "wrong" | null>(null);
  const [attempts, setAttempts] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  // Whatever was focused when the dialog opened — focus goes back there on close.
  const returnTo = useRef<HTMLElement | null>(null);

  /* Remember where focus came from, then move it into the dialog so keyboard
   * and screen-reader users land on the question instead of being left behind
   * in the page. Focus returns to the trigger on close. */
  useEffect(() => {
    returnTo.current = document.activeElement as HTMLElement | null;
    firstOptionRef.current?.focus();
    return () => returnTo.current?.focus?.();
  }, []);

  /* Freeze the page behind the dialog. On desktop the scroll container is the
   * content surface, not the document, so both are pinned. Scrollbars are
   * hidden project-wide, so nothing jumps when overflow changes. */
  useEffect(() => {
    const surface = document.getElementById("content-surface");
    const prevBody = document.body.style.overflow;
    const prevSurface = surface?.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    if (surface) surface.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      if (surface) surface.style.overflow = prevSurface;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      // Simple focus trap — Tab cycles within the card.
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const submit = useCallback(() => {
    if (picked === null) return;
    setAttempts((n) => n + 1);
    setResult(picked === check.answer ? "right" : "wrong");
  }, [picked, check.answer]);

  const retry = useCallback(() => {
    setResult(null);
    setPicked(null);
    firstOptionRef.current?.focus();
  }, []);

  // This only ever mounts from a click, so it never renders on the server —
  // the guard just keeps createPortal honest.
  if (typeof document === "undefined") return null;

  const answered = result !== null;

  /* A first wrong answer marks only what you picked — it doesn't say which
   * option was right. Revealing immediately would turn "Try again" into
   * clicking the one highlighted in green, which proves nothing. So the first
   * miss sends you back to the text; a second miss gives you the answer and
   * the reasoning, and you still have to select it to earn the tick. */
  const reveal = result === "right" || attempts >= 2;

  return createPortal(
    <div className="quiz-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-question"
        className="quiz-card squircle"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="quiz-eyebrow">Check · {heading}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="quiz-close squircle">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <h2 id="quiz-question" className="quiz-question">
          {check.question}
        </h2>

        <div className="quiz-options">
          {check.options.map((opt, i) => {
            // Once answered the card becomes feedback rather than a picker.
            // The correct option is only marked once `reveal` is true (see
            // above); a wrong pick is always marked, so you can see what you
            // actually chose.
            const state = !answered
              ? picked === i
                ? "picked"
                : undefined
              : i === check.answer && reveal
                ? "right"
                : picked === i && result === "wrong"
                  ? "wrong"
                  : undefined;
            return (
              <button
                key={i}
                ref={i === 0 ? firstOptionRef : undefined}
                type="button"
                disabled={answered}
                aria-pressed={picked === i}
                data-state={state}
                onClick={() => setPicked(i)}
                onDoubleClick={submit}
                className="quiz-option squircle"
              >
                <span className="quiz-marker" aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0 flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="quiz-explain" data-result={result}>
            <p className="quiz-verdict">
              {result === "right"
                ? attempts === 1
                  ? "Correct — first time."
                  : "Correct."
                : "Not quite."}
            </p>
            <p className="quiz-explain-text">
              {reveal ? check.explain : "Have another look at this section, then try again."}
            </p>
          </div>
        )}

        <div className="quiz-actions">
          {!answered && (
            <button
              type="button"
              onClick={submit}
              disabled={picked === null}
              className="quiz-btn-primary squircle"
            >
              Check answer
            </button>
          )}
          {answered && result === "wrong" && (
            <button type="button" onClick={retry} className="quiz-btn-primary squircle">
              Try again
            </button>
          )}
          {answered && result === "right" && (
            <button type="button" onClick={() => onPass(attempts <= 1)} className="quiz-btn-primary squircle">
              Mark checkpoint done
            </button>
          )}
          <button type="button" onClick={onClose} className="quiz-btn-ghost squircle">
            {answered && result === "wrong" ? "Back to the step" : "Cancel"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
