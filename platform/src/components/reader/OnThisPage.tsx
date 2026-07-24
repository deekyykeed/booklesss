"use client";

import { useRef } from "react";
import type { Section } from "@/lib/course";
import { useFollow } from "./useFollow";

/* Rail + bar geometry, kept identical to the sidebar: a 2px rail with a
 * 3x16px bar centred on it and 15.5px of clear space either side. */
const RAIL = 2;
const BAR = 3;
const BAR_H = 16;
const GUTTER = 15.5;
const BAR_X = (RAIL - BAR) / 2; // centres the bar on the rail
const PAD = BAR_X + BAR + GUTTER; // text indent
const ROW_H = 32;
/* Inset the rail by exactly the bar's offset inside a row, so the bar sits
 * flush with the rail's end on the first and last section. */
const RAIL_INSET = (ROW_H - BAR_H) / 2;

// Right-hand "on this page" TOC.
export function OnThisPage({
  sections,
  activeId,
  onSelect,
}: {
  sections: Section[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const m = useFollow([activeId, sections], () => ({ container: listRef.current, active: activeRef.current }));

  return (
    // Full-height sticky column. Its height is set inline (a calc() arbitrary
    // class is one of the values this project's scanner has dropped), sized to
    // stop short of the top and bottom of the scroll viewport.
    <nav className="sticky top-[76px]" style={{ height: "calc(100vh - 160px)" }}>
      {/* One element, two jobs: the rail is both the TOC's active-section rail
          AND the vertical divider that fences off the right-hand column (where
          AI answers / voice will eventually live). It spans the whole column,
          inset top & bottom, so it reads as a divider that doesn't reach the
          edges. The heading and links live inside it so useFollow's rect-based
          measurement keeps the bar aligned to the active section. */}
      <div ref={listRef} className="relative h-full">
        <span
          className="rail pointer-events-none absolute left-0 rounded-full"
          style={{ width: RAIL, top: RAIL_INSET, bottom: RAIL_INSET }}
        />
        <span
          className="step-bar pointer-events-none absolute"
          style={{
            left: BAR_X,
            width: BAR,
            top: m.top + (m.height - BAR_H) / 2,
            height: BAR_H,
            opacity: m.visible ? 1 : 0,
            transition: "top 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 160ms ease",
          }}
        />
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.09em] text-[#9a9aa2]" style={{ paddingLeft: PAD }}>
          On this page
        </p>
        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              ref={active ? activeRef : undefined}
              type="button"
              onClick={() => onSelect(s.id)}
              style={{ paddingLeft: PAD }}
              className={
                "block w-full py-1.5 pr-2 text-left text-[13px] font-medium transition-colors " +
                (active ? "text-ink" : "text-[#8a8a92] hover:text-ink")
              }
            >
              {s.heading}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
