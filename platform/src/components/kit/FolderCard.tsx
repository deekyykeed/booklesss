"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HugeIcon, type HugeIconName } from "@/components/icons/huge";
import { Button, Surface } from "./primitives";

/* The folder card at REAL SIZE (owner, 2026-10-19: "in Paper everything is
 * way too scaled up … bring Paper back to proportions; the smallest text for
 * reading I go 16px"). Every number below is the size on screen, the same
 * number Paper's text panel shows on the "Kit · 1x — real sizes" board:
 *
 *   eyebrow 13/16 caps · title 28/32 · description 16/22 · stats 16/20 with
 *   18px icons · 24px padding · 38px corners · folder art 132 × 126
 *
 * Nothing scales it. It is as wide as its column and the type stays put —
 * a wider column gives the title and description more room before they
 * truncate, never bigger letters. This replaced the Jay-scale FilesCard,
 * which was drawn at the reference's size and then zoomed to fit, so the
 * number in the code was never the size on the screen. */

export type FolderStat = { icon: HugeIconName; n: number; label: string; kind?: "image" | "video" | "file" };
export type FolderAction = { label: string; danger?: boolean; onPick?: () => void };

const RADIUS = 38;
const SMOOTHING = 0.8;

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/* The numbers no longer count up (owner, 2026-10-19: "stop them doing that"). */

export function FolderCard({
  title,
  eyebrow,
  description,
  stats,
  actions = [],
  onOpen,
  state,
}: {
  title: string;
  eyebrow?: string;
  /** One line, cut with an ellipsis. */
  description?: string;
  stats: FolderStat[];
  actions?: FolderAction[];
  /** Given, a tap on the card opens it; otherwise a tap selects it. */
  onOpen?: () => void;
  /** Forces a look, for the states row on /components. */
  state?: "hover" | "selected" | "menu";
}) {
  const [ref, { w, h }] = useSize<HTMLDivElement>();
  const [menu, setMenu] = useState(state === "menu");
  const [selected, setSelected] = useState(state === "selected");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu || state === "menu") return;
    const away = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".kit-fc-menu, .kit-fc-dots")) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [menu, state]);

  // Keep the menu on screen: once open, slide it back inside the viewport
  // with 8px to spare, sideways first, then up if it runs off the bottom.
  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!menu || !el) return;
    el.style.translate = "";
    const r = el.getBoundingClientRect();
    const pad = 8;
    let dx = 0;
    let dy = 0;
    if (r.left < pad) dx = pad - r.left;
    else if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right;
    if (r.bottom > window.innerHeight - pad) dy = Math.max(pad - r.top, window.innerHeight - pad - r.bottom);
    if (dx || dy) el.style.translate = `${dx}px ${dy}px`;
  }, [menu]);

  const danger = actions.findIndex((a) => a.danger);

  return (
    <div
      ref={ref}
      className="kit-fc"
      data-state={state === "hover" ? "hover" : undefined}
      data-selected={selected ? "" : undefined}
      role={onOpen ? "link" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Open ${title}` : undefined}
      onKeyDown={(e) => onOpen && e.target === e.currentTarget && e.key === "Enter" && onOpen()}
      onClick={(e) => {
        if (state || (e.target as Element).closest(".kit-fc-dots, .kit-fc-menu")) return;
        if (onOpen) onOpen();
        else setSelected((s) => !s);
      }}
    >
      {/* A two-up phone card is ~174px wide; 38px corners eat it, so it gets 26. */}
      {w > 0 && h > 0 && <Surface w={w} h={h} r={w < 240 ? 26 : RADIUS} s={SMOOTHING} />}
      {/* The folder art is a FILE, not inline SVG (owner, 2026-10-19: "glitchy
          when I scroll"). Inline, every card carried its own six blur filters
          and a dozen blurred shapes, and 33 cards of that repainted on every
          scroll. As an <img> the browser rasterises it once and caches it. */}
      <img className="kit-fc-folder" src="/kit/happy-folder.svg" alt="" draggable={false} />
      {actions.length > 0 && (
        <button
          type="button"
          className="kit-fc-dots"
          aria-label={`${title} options`}
          aria-expanded={menu}
          onClick={() => !state && setMenu((m) => !m)}
        >
          <HugeIcon name="more-vertical" size={24} strokeWidth={2} />
        </button>
      )}
      {menu && (
        <div ref={menuRef} className="kit-fc-menu" role="menu">
          {actions.map((a, i) => (
            <span key={a.label} style={{ display: "contents" }}>
              {i === danger && i > 0 && <hr />}
              <button
                type="button"
                role="menuitem"
                className={a.danger ? "kit-danger" : undefined}
                onClick={() => {
                  setMenu(false);
                  a.onPick?.();
                }}
              >
                {a.label}
              </button>
            </span>
          ))}
        </div>
      )}
      {eyebrow && <span className="kit-fc-eyebrow">{eyebrow}</span>}
      <h3 className="kit-fc-title" title={title}>
        {title}
      </h3>
      {description && (
        <p className="kit-fc-desc" title={description}>
          {description}
        </p>
      )}
      <div className="kit-fc-stats">
        {stats.map((st, i) => (
          <span key={i} className="kit-stat" title={`${st.n} ${st.label}`}>
            <HugeIcon name={st.icon} size={16} />
            {st.n}
          </span>
        ))}
        {/* In the row, not floating (owner, 2026-10-19: "don't make the
            button float, just stack it in the same row"). */}
        {/* The glass Start button, in the row. Hidden on phones (app.css),
            where the whole card is the button. */}
        {onOpen && (
          <span className="kit-fc-start">
            <Button size="sm" icon="play" onClick={onOpen}>
              Start
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}
