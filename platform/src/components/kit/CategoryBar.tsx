"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { Button } from "./primitives";
import { PlumpIcon, type PlumpIconName } from "@/components/icons/plump";
import { SolarIcon, type SolarIconName } from "@/components/icons/solar";

/* The marketplace's category selector (owner, 2026-10-18: "category
 * selectors with icons … solar bold or duotone or plump"). One list, drawn
 * three ways so the pick can be made by looking: Solar Bold Duotone, Solar
 * Bold, Streamline Plump. Each category owns a hue and its mark is drawn in
 * it, on the soft tile material at control size (44 tall, like a md button).
 * Chosen, the chip turns ink and the mark keeps its colour. */

export type CategoryLook = "duotone" | "bold" | "plump";

type Solar = "widget" | "wallet-money" | "calculator" | "graph-up" | "case" | "code-square" | "palette" | "test-tube" | "library" | "stethoscope" | "lightbulb-bolt" | "pen-new-square";

export type Category = { id: string; label: string; solar: Solar; plump: PlumpIconName; hue: string };

export const CATEGORIES: Category[] = [
  { id: "all", label: "All", solar: "widget", plump: "dashboard-1", hue: "#5c68fe" },
  { id: "finance", label: "Finance", solar: "wallet-money", plump: "wallet", hue: "#14a37a" },
  { id: "accounting", label: "Accounting", solar: "calculator", plump: "calculator-1", hue: "#2f7bf6" },
  { id: "economics", label: "Economics", solar: "graph-up", plump: "graph-bar-increase", hue: "#f08c00" },
  { id: "business", label: "Business", solar: "case", plump: "bag-suitcase-4", hue: "#8b5cf6" },
  { id: "tech", label: "Tech", solar: "code-square", plump: "code-monitor-2", hue: "#0ea5e9" },
  { id: "design", label: "Design", solar: "palette", plump: "paint-palette", hue: "#ec4899" },
  { id: "science", label: "Science", solar: "test-tube", plump: "erlenmeyer-flask", hue: "#10b981" },
  { id: "law", label: "Law", solar: "library", plump: "justice-scale-2", hue: "#64748b" },
  { id: "health", label: "Health", solar: "stethoscope", plump: "medical-bag", hue: "#ef4444" },
  { id: "startups", label: "Startups", solar: "lightbulb-bolt", plump: "lightbulb", hue: "#e5a500" },
  { id: "writing", label: "Writing", solar: "pen-new-square", plump: "feather-pen", hue: "#f97316" },
];

export function CategoryMark({ c, look, size }: { c: Category; look: CategoryLook; size: number }) {
  if (look === "plump") {
    return (
      <PlumpIcon
        name={c.plump}
        size={size}
        light={`color-mix(in srgb, ${c.hue} 38%, white)`}
        dark={c.hue}
      />
    );
  }
  const name = `${c.solar}-${look === "bold" ? "bold" : "bold-duotone"}` as SolarIconName;
  return <SolarIcon name={name} size={size} style={{ color: c.hue }} />;
}

/* Categories as a POPUP, not a sliding row (owner, 2026-10-19: "remove the
 * sliding filters and just use popups instead so I don't have to deal with
 * this sliding off the screen"). One Filters button; the panel drops from
 * it, right-aligned to it, so on a phone it can never leave the screen.
 * Layout off the owner's filter-panel pin: a titled header with a close, a
 * search, a caps-free section label, and one row per category carrying its
 * mark, its name, a count and the check when chosen. */
export function CategoryFilter({
  value,
  onChange,
  counts = {},
  categories = CATEGORIES,
}: {
  value: string;
  onChange: (id: string) => void;
  /** Courses per category id; a category with none shows no badge. */
  counts?: Record<string, number>;
  categories?: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const chosen = categories.find((c) => c.id === value);
  const t = q.trim().toLowerCase();
  const shown = categories.filter((c) => !t || c.label.toLowerCase().includes(t));

  return (
    <div className="kit-flt" ref={root}>
      <Button variant="soft" size="sm" icon="filter" onClick={() => setOpen((o) => !o)}>
        {chosen && chosen.id !== "all" ? chosen.label : "Filters"}
      </Button>
      {open && (
        <div className="kit-flt-pop" role="dialog" aria-label="Filters">
          <header className="kit-flt-head">
            <strong>Filters</strong>
            <button type="button" className="kit-flt-x" aria-label="Close filters" onClick={() => setOpen(false)}>
              <HugeIcon name="x" size={18} />
            </button>
          </header>
          <label className="kit-flt-search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search categories" aria-label="Search categories" />
            <HugeIcon name="search" size={18} />
          </label>
          <span className="kit-flt-label">Categories</span>
          <div className="kit-flt-list" role="radiogroup" aria-label="Categories">
            {shown.map((c) => {
              const on = c.id === value;
              const n = counts[c.id] ?? 0;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  className="kit-flt-row"
                  data-on={on ? "" : undefined}
                  onClick={() => {
                    onChange(c.id);
                    setOpen(false);
                    setQ("");
                  }}
                >
                  <CategoryMark c={c} look="bold" size={18} />
                  <span className="kit-flt-name">{c.label}</span>
                  {n > 0 && <span className="kit-flt-count">{n}</span>}
                  <span className="kit-flt-tick">{on && <HugeIcon name="check" size={18} />}</span>
                </button>
              );
            })}
            {shown.length === 0 && <p className="kit-flt-none">No category called “{q}”.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function CategoryBar({
  value,
  onChange,
  // Solar Bold won the pick (owner, 2026-10-18: "solar bold wins by far").
  look = "bold",
  layout = "chips",
  categories = CATEGORIES,
  onAdd,
}: {
  value: string;
  onChange: (id: string) => void;
  look?: CategoryLook;
  layout?: "chips" | "tiles";
  categories?: Category[];
  /** Given, a dashed "Add Filter" chip sits in front of the track. */
  onAdd?: () => void;
}) {
  const items = categories.map((c) => {
    const on = c.id === value;
    return (
      <button
        key={c.id}
        type="button"
        role="radio"
        aria-checked={on}
        className="kit-cat-item"
        data-on={on ? "" : undefined}
        style={{ "--hue": c.hue } as CSSProperties}
        onClick={() => onChange(c.id)}
      >
        <span className="kit-cat-face">
          <span className="kit-cat-mark">
            <CategoryMark c={c} look={look} size={layout === "tiles" ? 30 : 16} />
          </span>
          <span className="kit-cat-label">{c.label}</span>
        </span>
      </button>
    );
  });

  if (layout === "tiles") {
    return (
      <div className="kit-cat kit-cat--tiles" role="radiogroup" aria-label="Categories">
        {items}
      </div>
    );
  }

  /* Filter idea 9 (owner, 2026-10-19: "try these"): the categories sit in
   * one raised capsule track, and the chosen one is PRESSED into it, lit
   * along its top edge in the category's own hue. "Add Filter" stands
   * outside the track, in front of it. */
  return (
    <div className="kit-cat kit-cat--chips">
      {onAdd && (
        <button type="button" className="kit-cat-item kit-cat-add" onClick={onAdd}>
          <HugeIcon name="add" size={16} />
          Add Filter
        </button>
      )}
      <div className="kit-cat-track" role="radiogroup" aria-label="Categories">
        {items}
      </div>
    </div>
  );
}
