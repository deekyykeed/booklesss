"use client";

import { useCallback, useEffect, useRef } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { packsSnapshot } from "@/lib/resource-packs";

/* ------------------------------------------------------------------ *
 * THE RESOURCE PACK PICKER.
 *
 * Owner, 2026-08-29: tapping Resources "opens a bunch of resource packs which
 * is essentially a collection of pdfs they may have saved over time … to add
 * as context for the agent to use to inform explanations", and the popup "will
 * be a full on modal of resource packs … just the user selecting different
 * packs to go into this".
 *
 * So it is a PICKER AND NOTHING ELSE. No upload, no rename, no delete, no
 * preview — every one of those is a management screen wearing a picker's
 * clothes, and this control is opened mid-thought by someone who is about to
 * type a question. It closes on Done and the selection is the whole output.
 *
 * ⚠️ IT IS BUILT FROM THE `.cui` PATTERNS, NOT FROM THE APP'S. This tree ships
 * its own palette and reads none of `--color-canvas` / `--color-ink`. The panel
 * is pattern 4 (raised panel: --surface-3, the ring-and-glow shadow, the
 * radius PAIR), and a pack is pattern 2 (row: 8px gap, fixed icon slot,
 * ellipsised label) with the selected state carrying BOTH signals the spec
 * requires — the --row-selected fill AND the label going to --text-100.
 * ------------------------------------------------------------------ */

export function ResourcePacks({
  open,
  selected,
  onToggle,
  onClose,
}: {
  open: boolean;
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  /* Where focus was when this opened, so it can be handed back on close.
     Without it, dismissing the modal drops focus to <body> and the composer —
     which the whole screen exists to put a caret in — is no longer focused. */
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    /* Focus the panel, not the first row: landing on a row makes it look
       chosen, and this is a multi-select where nothing is chosen by default. */
    panelRef.current?.focus({ preventScroll: true });
    return () => returnTo.current?.focus?.({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* ⚠️ THE SCROLL LOCK HAS TO HOLD BOTH SCROLLERS, and which one actually
     scrolls depends on width — the pane's own scroller on desktop, the
     document on a phone. Locking only one passes on a desktop probe and
     leaves the page scrolling behind the modal at 390px, which is the exact
     trap the archived ask box documented. */
  useEffect(() => {
    if (!open) return;
    const doc = document.documentElement;
    const pane = document.querySelector<HTMLElement>(".cui .pane-scroll");
    const prevDoc = doc.style.overflow;
    const prevPane = pane?.style.overflow ?? "";
    doc.style.overflow = "hidden";
    if (pane) pane.style.overflow = "hidden";
    return () => {
      doc.style.overflow = prevDoc;
      if (pane) pane.style.overflow = prevPane;
    };
  }, [open]);

  const onScrimDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open) return null;

  const packs = packsSnapshot();
  const n = selected.size;

  return (
    <div className="rp-scrim" onMouseDown={onScrimDown}>
      <div
        className="rp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Resource packs"
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="rp-head">
          <div className="rp-heading">
            <h2 className="rp-title">Resource packs</h2>
            <p className="rp-sub">
              Pick what this session should explain against.
            </p>
          </div>
          <button className="cbtn" onClick={onClose} aria-label="Close">
            <HugeIcon name="x" className="i" />
          </button>
        </div>

        <div className="rp-list">
          {packs.map((p) => {
            const on = selected.has(p.id);
            return (
              <button
                key={p.id}
                type="button"
                className={"rp-row" + (on ? " is-on" : "")}
                aria-pressed={on}
                onClick={() => onToggle(p.id)}
              >
                <span className="rp-slot" aria-hidden="true">
                  {/* The tick is the only thing that changes shape between the
                      two states. The fill and the text colour carry the rest —
                      three signals, because a checkbox at 20px on a warm grey
                      row is genuinely hard to read at a glance. */}
                  {/* ⚠️ THE SAME MARK AS THE CHIP, AND IT FOLLOWED THE CHIP
                      (2026-08-29). This row wore `folder-library` while the
                      control that opened it was a Resources button in the
                      composer bar — the mark named the CONTAINER, which was
                      correct for a button standing for "packs, plural". The
                      owner moved the control up into the source row above the
                      composer and asked for a PDF mark on it, so a pack is
                      now drawn as a PDF one tap away and as a folder the tap
                      after. One meaning, one mark: the glyph you tap in this
                      list is the glyph that appears on the chip. */}
                  {on ? (
                    <HugeIcon name="check-circle-solid" className="i" />
                  ) : (
                    <HugeIcon name="pdf" className="i" />
                  )}
                </span>
                <span className="rp-text">
                  <span className="rp-name">{p.name}</span>
                  <span className="rp-blurb">{p.blurb}</span>
                </span>
                <span className="rp-count">{p.count}</span>
              </button>
            );
          })}
        </div>

        <div className="rp-foot">
          <span className="rp-tally">
            {n === 0
              ? "Nothing selected"
              : n === 1
                ? "1 pack selected"
                : `${n} packs selected`}
          </span>
          <button className="rp-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
