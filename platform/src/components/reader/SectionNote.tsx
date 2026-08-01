"use client";

import { useEffect, useRef, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { NOTES, noteFor, setNote, type NoteId } from "@/lib/step-notes";

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
  const wrap = useRef<HTMLDivElement>(null);

  // localStorage is read after mount: the server render knows nothing, and
  // guessing would flash someone else's answer.
  useEffect(() => setChosen(noteFor(lessonId, sectionId)), [lessonId, sectionId]);

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
        className="grasp-btn squircle"
        data-active={chosen ? "" : undefined}
        style={{ "--grasp-tone": "#5b5b66" } as React.CSSProperties}
      >
        <MynaIcon name={chosen ? "chat-solid" : "chat"} size={17} />
        <span className="grasp-label">{label ?? "How did that read?"}</span>
      </button>

      {open && (
        /* Opens upward, because the button sits near the bottom of a section
           and a menu dropping down would land on the next section's first line.

           Aligned to the button's LEFT edge, not its right. This button is the
           first child of the checkpoint row's `justify-between`, so it is on the
           left at every width — a 230px menu hung off its right edge started
           66px off the side of a 390px phone, with its options cut in half. On
           desktop the same overflow was invisible because it spilled into the
           sidebar gutter rather than off the screen. */
        <div
          role="menu"
          className="squircle absolute bottom-[calc(100%+8px)] left-0 z-30 flex w-[230px] max-w-[calc(100vw-24px)] flex-col gap-0.5 rounded-2xl border border-[#e0e0e0] bg-white p-1.5 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.10),0_12px_24px_-8px_rgba(0,0,0,0.18)]"
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
