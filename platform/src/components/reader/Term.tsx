"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
 * card beside it, then clamp both edges into the viewport and slide the arrow
 * back along the card's edge so it still points at the word.
 *
 * And it is PORTALLED to document.body, which is not cosmetic. `position:
 * fixed` resolves against the nearest ancestor carrying a transform, a filter
 * or a backdrop-filter rather than against the viewport, and the reader has
 * both: `.content-frame` takes a translateX for the mobile drawer, and the
 * chrome uses backdrop-filter. Rendered in place, the card was offset by
 * whichever of those applied, which is why it sat close to the word in some
 * places and a couple of lines below it in others. Outside that subtree the
 * measured coordinates and the fixed coordinates finally mean the same thing.
 */
const GUTTER = 12; // px kept clear of each viewport edge
const GAP = 8; // px between the word and the arrow tip, not the card edge
const ARROW = 9; // px half-width of the arrow square
const ARROW_OUT = 5; // px the arrow tip stands proud of the card edge
const ARROW_INSET = 22; // px the arrow stays clear of the card's rounded corners

type Pos = { left: number; top: number; width: number; arrow: number; above: boolean };

export function Term({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
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

    /* Flip above only when the card genuinely won't fit below. Until it has
     * rendered once its height is 0, and treating that as "fits" is what put
     * the card over the word: it placed below, measured, then jumped. So while
     * the height is unknown, assume a tall card and place conservatively. */
    const h = card.current?.offsetHeight || 160;
    // GAP is measured to the arrow's tip, so the card sits ARROW_OUT further
    // out. Measuring to the card edge instead left the tip almost touching the
    // word while the card itself read as floating away from it.
    const below = b.bottom + GAP + ARROW_OUT;
    const above = below + h > window.innerHeight - GUTTER && b.top - GAP - ARROW_OUT - h > GUTTER;
    const top = above ? b.top - GAP - ARROW_OUT - h : below;

    // The arrow tracks the word, not the card, so a clamped card still points
    // at what it defines. Kept off the corners, where a diamond would sit
    // outside the radius and look detached.
    const arrow = Math.min(
      Math.max(b.left + b.width / 2 - left, ARROW_INSET),
      width - ARROW_INSET,
    );
    setPos({ left, top, width, arrow, above });
  }, []);

  // Place before paint so the card never shows in the wrong spot first, then
  // again once it has a measured height so the flip decision is made on real
  // numbers rather than the 160px guess above.
  useLayoutEffect(() => {
    if (!open) return;
    place();
    const raf = requestAnimationFrame(place);
    return () => cancelAnimationFrame(raf);
  }, [open, place]);

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
        /* text-decoration, not border-bottom. A button's border sits at the
           foot of its box, which at 30px line-height drew the rule most of a
           line below the word and looked like it belonged to the next one.
           An underline hangs off the text itself, so it stays put. */
        className="cursor-help underline decoration-[#b9b9c0] decoration-2 underline-offset-2 transition-colors hover:decoration-ink hover:text-ink"
      >
        {term}
      </button>
      {open &&
        createPortal(
          <span
            ref={card}
            id={id}
            role="tooltip"
            style={{ left: pos?.left ?? 0, top: pos?.top ?? -9999, width: pos?.width ?? 340 }}
            className="squircle fixed z-[120] rounded-3xl border border-[#e0e0e0] bg-white px-4 py-3 text-left font-content text-[17px] font-normal leading-[27px] text-[#3f3f47] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.08),0_12px_20px_-6px_rgba(0,0,0,0.16),0_28px_48px_-16px_rgba(0,0,0,0.22)]"
          >
            {/* A rotated square with two of its borders showing, sitting half
                outside the card so the card's own fill hides its inner half.
                Cheaper than an SVG and it inherits the border colour. */}
            <span
              aria-hidden="true"
              className={
                "absolute h-[18px] w-[18px] rotate-45 bg-white " +
                (pos?.above
                  ? "border-b border-r border-[#e0e0e0] bottom-[-9px]"
                  : "border-l border-t border-[#e0e0e0] top-[-9px]")
              }
              style={{ left: (pos?.arrow ?? 0) - ARROW, borderRadius: 3 }}
            />
            <span className="relative mb-1 block text-[16px] font-semibold text-ink">{term}</span>
            <span className="relative">{definition}</span>
          </span>,
          document.body,
        )}
    </>
  );
}
