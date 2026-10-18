"use client";

import type { CSSProperties } from "react";
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

export function CategoryBar({
  value,
  onChange,
  // Solar Bold won the pick (owner, 2026-10-18: "solar bold wins by far").
  look = "bold",
  layout = "chips",
  categories = CATEGORIES,
}: {
  value: string;
  onChange: (id: string) => void;
  look?: CategoryLook;
  layout?: "chips" | "tiles";
  categories?: Category[];
}) {
  return (
    <div className={`kit-cat kit-cat--${layout}`} role="radiogroup" aria-label="Categories">
      {categories.map((c) => {
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
            <span className="kit-cat-mark">
              <CategoryMark c={c} look={look} size={layout === "tiles" ? 30 : 20} />
            </span>
            <span className="kit-cat-label">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
