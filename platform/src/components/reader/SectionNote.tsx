"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { NOTES, noteFor, setNote, type NoteId } from "@/lib/step-notes";

// useLayoutEffect on the client, useEffect on the server (avoids the SSR
// warning). Same helper the sidebar uses for its own measuring.
const useIso = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/** The fixed header, which is what a menu opening upward runs into. */
const HEADER_H = 48;
/** Breathing room between the menu and the edge it is avoiding. */
const EDGE = 12;

/* "How did that read?" — the other end of the checkpoint row.
 *
 * The two answers on the left are the reader's decision about the section.
 * This is their verdict on the writing, which is a different question and the
 * one that improves the step. It stays shut until asked for, because a row of
 * five opinions under every section would out-shout the section.
 *
 * Once answered it collapses back to the chosen label, so a reader can see what
 * they said and change it, and so the row doesn't keep asking.
 */
export function SectionNote({ lessonId, sectionId }: { lessonId: string; sectionId: string }) {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<NoteId | null>(null);
  /* Which way the menu opens. Up is the default and the common case; it flips
     down only when up would put it behind the header. */
  const [drop, setDrop] = useState<"up" | "down">("up");
  const wrap = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // localStorage is read after mount: the server render knows nothing, and
  // guessing would flash someone else's answer.
  useEffect(() => setChosen(noteFor(lessonId, sectionId)), [lessonId, sectionId]);

  /* Flip the menu below the button when there isn't room above it.
   *
   * The menu was hard-coded to open upward, on the reasoning that the button
   * sits near the bottom of a section and a downward menu would land on the
   * next section's first line. True most of the time — but a reader who has
   * scrolled so the checkpoint row sits just under the header gets a menu that
   * opens straight into it and loses its top options behind the bar. That is
   * the second time this menu has been clipped by an edge it didn't measure
   * (the first ran off the left of a 390px phone), so this measures rather
   * than guesses.
   *
   * Measured in a LAYOUT effect, so the flip is decided before the browser
   * paints and the menu never appears in the wrong place first. Measuring the
   * real element rather than estimating from NOTES.length means adding or
   * rewording an option can't silently break it. */
  useIso(() => {
    if (!open) return;
    const btn = wrap.current?.getBoundingClientRect();
    const box = menu.current?.getBoundingClientRect();
    if (!btn || !box) return;
    const roomAbove = btn.top - HEADER_H;
    const roomBelow = window.innerHeight - btn.bottom;
    // Only give up "up" if down is genuinely better — near a short viewport
    // neither fits, and up is still the least bad.
    setDrop(roomAbove < box.height + EDGE && roomBelow > roomAbove ? "down" : "up");
  }, [open]);

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

  const pick = (id: NoteId) => {
    // Pressing the answer you already gave takes it back, the same rule the
    // checkpoint buttons follow.
    const next = chosen === id ? null : id;
    setNote(lessonId, sectionId, next);
    setChosen(next);
    setOpen(false);
  };

  const label = chosen ? NOTES.find((n) => n.id === chosen)?.label : null;

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label ? `You said: ${label}. Change it` : "How did that read?"}
        /* The label is off-screen now (see .grasp-label), so the tooltip is the
           only way a mouse reader recovers the word — and here it carries the
           answer already given, which the bare glyph cannot say on its own. */
        title={label ? `You said: ${label}. Change it` : "How did that read?"}
        className="grasp-btn squircle"
        data-active={chosen ? "" : undefined}
        style={{ "--grasp-tone": "#5b5b66" } as React.CSSProperties}
      >
        {/* Back on MynaUI with the two answers, so the row is one set of
            hairlines again, and the line/solid swap on `chosen` returns with
            it: having said how the section read, the mark fills in. */}
        <MynaIcon name={chosen ? "info-circle-solid" : "info-circle"} size={20} strokeWidth={1.2} />
        <span className="grasp-label">{label ?? "How did that read?"}</span>
      </button>

      {open && (
        /* Opens upward by default, because the button sits near the bottom of a
           section and a menu dropping down would land on the next section's
           first line. It flips below when up would run into the header — see
           the layout effect above, which measures rather than assumes.

           Aligned to the button's LEFT edge, not its right. This button is the
           first child of the checkpoint row's `justify-between`, so it is on the
           left at every width — a 230px menu hung off its right edge started
           66px off the side of a 390px phone, with its options cut in half. On
           desktop the same overflow was invisible because it spilled into the
           sidebar gutter rather than off the screen. */
        <div
          ref={menu}
          role="menu"
          data-drop={drop}
          /* `font-container` — a menu of options, not reading. Medium, like
             every other container surface. */
          className={
            "note-menu squircle absolute left-0 z-30 flex w-[230px] max-w-[calc(100vw-24px)] flex-col gap-0.5 rounded-2xl border border-[#e0e0e0] bg-white p-1.5 font-container font-medium shadow-[0_2px_4px_-1px_rgba(0,0,0,0.10),0_12px_24px_-8px_rgba(0,0,0,0.18)] " +
            (drop === "up" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]")
          }
        >
          {NOTES.map((n) => (
            <button
              key={n.id}
              type="button"
              role="menuitemradio"
              aria-checked={chosen === n.id}
              onClick={() => pick(n.id)}
              className={
                "squircle flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[14.5px] leading-5 transition-colors hover:bg-[#f4f4f3] " +
                (chosen === n.id ? "font-medium text-ink" : "text-ink-2")
              }
            >
              {n.label}
              {chosen === n.id && <MynaIcon name="check" size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
