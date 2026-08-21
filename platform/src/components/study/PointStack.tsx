"use client";

import { useEffect, useRef } from "react";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import type { Pin } from "@/lib/session-notes";

/* The points, stacked.
 *
 * This is the whole reason the pivot is not just "a podcast" — the owner's
 * line (2026-08-21) was "putting up important points so that they can stay up
 * for the user to read and understand". STAY UP is the operative half. A line
 * that appears and dissolves is a subtitle, and a subtitle is a transcript in
 * pieces, which is exactly the reading this replaces.
 *
 * CHRONOLOGICAL, AND IT AUTO-SCROLLS TO THE NEWEST. Newest-first was the other
 * option and it is wrong here: these become the student's notes, and notes read
 * in the order the ideas arrived. So it behaves like a chat — appended at the
 * bottom, scrolled into view as it lands — which also means the finished stack
 * needs no re-sorting to be readable when the call is over.
 *
 * SATOSHI, NOT APTOS. The owner's rule (2026-08-02) splits the two faces by
 * job: a sentence someone reads is Aptos, and chrome that frames or annotates a
 * sentence is Satoshi. A pinned card frames a spoken sentence, so it is a
 * container — the same call already made for callouts and cards in the reader.
 */

const MARKS: Record<Pin["kind"], { icon: MynaIconName; label: string }> = {
  /* Deliberately the same marks the reader draws for the same ideas — see
   * CALLOUTS in reader/LessonView.tsx. A key point should not wear one glyph
   * when it is read and a different one when it is heard. */
  key: { icon: "key", label: "Key point" },
  warning: { icon: "danger-triangle", label: "Watch out" },
  example: { icon: "clipboard", label: "Example" },
  formula: { icon: "zap", label: "Formula" },
  point: { icon: "check", label: "Point" },
};

export function PointStack({ pins }: { pins: Pin[] }) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const count = pins.length;

  /* Scroll the newest into view. Keyed on the COUNT, not on the array: the
   * store hands back a new array identity on every write, including a note
   * keystroke, and scrolling the point stack because somebody typed a letter
   * would fight them for the screen. */
  useEffect(() => {
    if (!count) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [count]);

  if (!count) {
    return (
      <p className="font-container px-6 text-center text-[13px] leading-relaxed text-white/35">
        Points worth keeping will appear here as you go.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {pins.map((p, i) => {
        const mark = MARKS[p.kind] ?? MARKS.point;
        return (
          <div
            key={p.at + ":" + i}
            className="point-card flex gap-3 rounded-2xl px-4 py-3.5"
            style={{
              /* A light glass card on the dark surface — the reference decks
               * all do this, and it is what keeps the points readable as TEXT
               * while the surface behind them stays a call. */
              background: "rgba(255,255,255,0.94)",
              boxShadow: "0 1px 2px -1px rgb(0 0 0 / 0.25), 0 12px 28px -18px rgb(0 0 0 / 0.55)",
              /* Only the newest animates. Replaying the entrance on all of them
               * every time one lands makes the stack twitch. */
              animation: i === count - 1 ? "point-in 380ms cubic-bezier(0.2,0.8,0.2,1) both" : undefined,
            }}
          >
            <MynaIcon
              name={mark.icon}
              size={16}
              strokeWidth={1.6}
              className="mt-0.5 shrink-0"
              style={{ color: "#171717" }}
            />
            <div className="min-w-0">
              <div className="font-container text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                {mark.label}
              </div>
              <p className="font-container mt-1 text-[14px] font-medium leading-[1.45] text-neutral-900">
                {p.text}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />

      <style>{`
        @keyframes point-in {
          from { opacity: 0; transform: translateY(10px) scale(0.985); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .point-card { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
