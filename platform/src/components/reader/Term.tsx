"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/* A word the reader can tap to get defined, authored as
 * `[[term|definition]]` in the step's .mjs.
 *
 * Why a popover and not a parenthesis: a definition in brackets is read by
 * everyone, including the reader who already knew the word, and it breaks the
 * sentence for them every time. A tap is paid for only by the reader who needs
 * it. W-5 still stands for terms the step is actually teaching, which get
 * defined in the prose. This is for the words around them: jargon the source
 * material assumes, or a phrase a first-year hasn't met yet.
 *
 * The card is positioned in FIXED coordinates measured from the word, not with
 * `absolute; left:50%`. A term near the right edge of the column pushed a
 * centred card off screen, and no amount of max-width fixes that: the card has
 * to know where the viewport edge is. On open we measure the word, place the
 * card under it, then clamp both edges into the viewport.
 */
const GUTTER = 12; // px kept clear of each viewport edge
const GAP = 8; // px between the word and the card

export function Term({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLSpanElement>(null);

  const place = useCallback(() => {
    const b = btn.current?.getBoundingClientRect();
    if (!b) return;
    const width = Math.min(340, window.innerWidth - GUTTER * 2);
    // Centre on the word, then push back inside whichever edge it crossed.
    const wanted = b.left + b.width / 2 - width / 2;
    const left = Math.min(Math.max(wanted, GUTTER), window.innerWidth - width - GUTTER);
    // Below the word by default; above it if there isn't room underneath.
    const below = b.bottom + GAP;
    const h = card.current?.offsetHeight ?? 0;
    const top = h && below + h > window.innerHeight - GUTTER ? b.top - GAP - h : below;
    setPos({ left, top, width });
  }, []);

  // Place before paint so the card never shows in the wrong spot first.
  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  // Measured height is only known once rendered, so re-place after the first
  // paint to let the flip-above branch apply.
  useLayoutEffect(() => {
    if (open && card.current) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, definition]);

  // Tap elsewhere, Escape, scroll or resize closes it. Bound only while open,
  // so a step full of terms nobody has tapped costs nothing.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!btn.current?.contains(t) && !card.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onMove = () => setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        /* Solid rule, tight to the word. The dashed line read as a spelling
           error at 18px, and the wide offset made it look like it belonged to
           the line below. */
        className="cursor-help border-b border-[#b9b9c0] text-left underline-offset-1 transition-colors hover:border-ink hover:text-ink"
      >
        {term}
      </button>
      {open && (
        <span
          ref={card}
          id={id}
          role="tooltip"
          style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, width: pos?.width ?? 340 }}
          className="squircle fixed z-50 rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-left text-[16px] font-normal leading-[25px] text-[#3f3f47] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.08),0_12px_20px_-6px_rgba(0,0,0,0.16),0_28px_48px_-16px_rgba(0,0,0,0.22)]"
        >
          <span className="mb-1 block text-[15px] font-semibold text-ink">{term}</span>
          {definition}
        </span>
      )}
    </>
  );
}
