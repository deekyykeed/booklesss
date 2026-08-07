"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { needsAccount } from "@/lib/account";
import { requireAccount } from "@/lib/onboarding";
import { NOTES, noteFor, setNote, subscribeNotes, type NoteId } from "@/lib/step-notes";

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
  /* READ FROM THE STORE, not copied into state after mount. This was
     `useState(null)` plus an effect that called setChosen(noteFor(...)) — a
     cascading render, and one that painted the wrong answer first: every
     section drew as unanswered for a frame before its real note arrived.
     useSyncExternalStore gives the server `null` (it has no localStorage) and
     the client the stored value on its first render, with no frame in between,
     and setNote's own notify re-renders this without anything here having to
     hold a copy. */
  const chosen = useSyncExternalStore(
    subscribeNotes,
    () => noteFor(lessonId, sectionId),
    () => null,
  );
  /* Which way the menu opens. Up is the default and the common case; it flips
     down only when up would put it behind the header. */
  const [drop, setDrop] = useState<"up" | "down">("up");
  const wrap = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);


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
    /* One write, and the store tells everyone — including this component,
       which no longer keeps a copy to update alongside it. */
    setNote(lessonId, sectionId, next);
    setOpen(false);
  };

  /* The whole row, not just its label: the flag wears the chosen reason's
     own mark, so this needs the icon off it too. */
  const active = chosen ? (NOTES.find((n) => n.id === chosen) ?? null) : null;
  const label = active?.label ?? null;

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        /* Gated the same way as the two faces beside it (owner's rule,
           2026-08-03: feedback controls are signed-in controls). Opening a
           menu of verdicts a signed-out reader cannot give would be the same
           broken promise one tap later. */
        onClick={() => {
          if (needsAccount()) {
            requireAccount("note");
            return;
          }
          setOpen((o) => !o);
        }}
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
        {/* A FLAG, and once something is flagged it BECOMES what was flagged
            (owner, 2026-08-07: "i want students to flag the content and that
            same popup will come up … the flag to indicate it's been flagged
            will then change to that icon of the thing they just flagged").
            That is the whole idea and it is better than the tick it replaces.
            A tick says an answer was given; the reason's own mark says WHICH,
            so a reader scrolling back through a step sees which sections they
            called confusing and which they called too long, without opening
            anything. The five marks are on the menu rows too, so the one that
            appears here is the one that was pressed there.
            It replaced an "i" in a circle. The "i" asked a question ("how did
            that read?") where a flag makes a claim ("something is wrong here"),
            and the second is what a student actually wants to do mid-read.
            Solid once flagged, like every other mark in this row. */}
        <MynaIcon
          name={active ? active.iconOn : "flag"}
          size={20}
          strokeWidth={1.2}
        />
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
                "squircle flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[14.5px] leading-5 transition-colors hover:bg-[#f4f4f3] " +
                (chosen === n.id ? "font-medium text-ink" : "text-ink-2")
              }
            >
              {n.label}
              {/* The row's own mark, right-aligned, solid when it is the answer
                  given (owner, 2026-08-07). `shrink-0` because "Something looks
                  wrong" wraps to two lines at 230px and the mark must not be
                  squeezed into an ellipse when it does. 16px against the
                  label's 14.5px: a hairline glyph reads a size smaller than
                  text does, and at 15 it disappeared beside the words. */}
              <MynaIcon name={chosen === n.id ? n.iconOn : n.icon} size={16} className="shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
