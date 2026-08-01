"use client";

import { useEffect, useId, useRef, useState } from "react";

/* A word the reader can tap to get defined, authored as
 * `[[term|definition]]` in the step's .mjs.
 *
 * Why a popover and not a parenthesis: a definition in brackets is read by
 * everyone, including the reader who already knew the word, and it breaks the
 * sentence for them every time. A tap is paid for only by the reader who needs
 * it. W-5 still stands for terms the step is actually teaching — those get
 * defined in the prose. This is for the words around them: jargon the source
 * material assumes, or a phrase a first-year hasn't met yet.
 *
 * The affordance is a dotted underline rather than a colour, because the body
 * already spends its one colour on bold emphasis (W-8) and a second coloured
 * inline mark makes a paragraph read as a link farm.
 */
export function Term({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);

  // Tap anywhere else, or Escape, closes it. Bound only while open so the
  // common case — a step full of terms nobody has tapped — costs nothing.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={wrap} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className="cursor-help border-b border-dashed border-[#b9b9c0] text-left transition-colors hover:border-ink hover:text-ink"
      >
        {term}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          /* Centred on the word but clamped to the reading column, so a term at
             the end of a line doesn't push the card off screen. min() against
             the viewport keeps it inside a 360px phone. */
          className="squircle absolute left-1/2 top-[calc(100%+8px)] z-40 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-[#e7e7e6] bg-white px-3.5 py-2.5 text-[14px] font-normal leading-[22px] text-[#4a4a52] shadow-[0_1px_1px_-0.5px_rgba(0,0,0,0.1),0_6px_10px_-4px_rgba(0,0,0,0.1),0_18px_28px_-10px_rgba(0,0,0,0.1)]"
        >
          <span className="mb-0.5 block font-semibold text-ink">{term}</span>
          {definition}
        </span>
      )}
    </span>
  );
}
