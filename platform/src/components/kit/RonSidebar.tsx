"use client";

import { useMemo, useState } from "react";
import { HugeIcon, type HugeIconName } from "@/components/icons/huge";
import { Surface } from "./primitives";
import { squircleClip } from "./squircle";

/* Squircles for the frame, the panel and the cards. Ron's radii (24 panel,
 * 22 card) at iOS smoothing. */
const FRAME_CLIP = squircleClip(519, 933, 32, 0.6);
const ART_CLIP = squircleClip(191, 190, 22, 0.6);
const STACK_BACK_CLIP = squircleClip(195, 96, 22, 0.6);
const STACK_FRONT_CLIP = squircleClip(203, 86, 22, 0.6);
const WHITE_TOP = "rgba(255,255,255,0.75)";

function CardSurface({ h, bottom, top = WHITE_TOP }: { h: number; bottom: string; top?: string }) {
  return <Surface w={191} h={h} r={22} s={0.6} kind="card" glow={{ top, bottom }} />;
}

/* The Ron sidebar direction (owner, 2026-10-18: "I'm thinking this direction
 * for the sidebar"), rebuilt from the Paper board "Sidebar — Ron direction
 * (exact, 1440)" at that board's own 1x. The reference's copy is kept on
 * purpose ("Managment" included) — this is the reference, not yet the app.
 *
 * Live here and not on the board: tap a row and it becomes the active pill
 * with its own close button; a + adds a sub-row under its item; the search
 * filters the list as you type; the close in the header slides the panel
 * away and leaves a button to bring it back; the cards lift, the invoices
 * fan out and the report stack rises when hovered. */

export type SidebarItem = { id: string; icon: HugeIconName; label: string; add?: boolean };
type Item = SidebarItem;

const NAV: Item[] = [
  { id: "dashboard", icon: "nav-home", label: "Main Dashboard" },
  { id: "files", icon: "nav-files", label: "Files Managment" },
  { id: "portfolio", icon: "nav-portfolio", label: "Company Portfolio" },
  { id: "tasks", icon: "nav-tasks", label: "Managing tasks", add: true },
  { id: "distribution", icon: "nav-distribution", label: "Task Distribution", add: true },
  { id: "indicators", icon: "nav-indicators", label: "Company Indicators" },
  { id: "accounting", icon: "nav-accounting", label: "Accounting", add: true },
  { id: "more", icon: "nav-more", label: "More" },
];

const FOOT: Item[] = [
  { id: "notifications", icon: "mail", label: "Notifications" },
  { id: "settings", icon: "settings", label: "Settings" },
  { id: "account", icon: "user", label: "Account" },
];

function Row({
  item,
  active,
  onPick,
  onClear,
  onAdd,
}: {
  item: Item;
  active: boolean;
  onPick: () => void;
  onClear: () => void;
  onAdd?: () => void;
}) {
  return (
    <div className="kit-ron-row" data-active={active ? "" : undefined}>
      <button type="button" className="kit-ron-hit" onClick={onPick} aria-current={active ? "page" : undefined}>
        <HugeIcon name={item.icon} size={19} strokeWidth={1.75} />
        <span>{item.label}</span>
      </button>
      {active ? (
        <button type="button" className="kit-ron-close" aria-label={`Close ${item.label}`} onClick={onClear}>
          <HugeIcon name="x" size={15} strokeWidth={1.9} />
        </button>
      ) : (
        item.add &&
        onAdd && (
          <button type="button" className="kit-ron-add" aria-label={`Add to ${item.label}`} onClick={onAdd}>
            <HugeIcon name="add" size={16} strokeWidth={1.5} />
          </button>
        )
      )}
    </div>
  );
}

/* What the app passes when the sidebar is its real navigation (AppShell)
 * rather than the reference on /components. Every prop is optional, so the
 * reference renders exactly as it did. */
type Props = {
  brand?: string;
  title?: string;
  nav?: Item[];
  foot?: Item[];
  /** Controlled selection: pass both, or neither for the reference's own. */
  active?: string | null;
  onPick?: (id: string | null) => void;
  /** The header ×. Given, it replaces the reference's slide-away (the shell
   * uses it to close the drawer). */
  onClose?: () => void;
  /** One column, 275 wide and as tall as its parent: the drawer and the
   * docked sidebar on a narrow desktop. The cards column is left out. */
  compact?: boolean;
  /** The app's copy on the cards (courses, not invoices). */
  app?: boolean;
};

const CARD_COPY = {
  reference: { insight: "AI Insights", files: [["Invoices", "193 files"], ["Reporting", "271 files"], ["Analysis", "295 files"], ["Overview", "421 files"]] },
  app: { insight: "This week", files: [["Finance", "24 courses"], ["Economics", "18 courses"], ["Accounting", "31 courses"], ["Tech", "42 courses"]] },
} as const;

export function RonSidebar({
  brand = "celoxis",
  title = "Managment Overview",
  nav = NAV,
  foot = FOOT,
  active: activeProp,
  onPick,
  onClose,
  compact,
  app,
}: Props = {}) {
  const [ownActive, setOwnActive] = useState<string | null>("files");
  const controlled = activeProp !== undefined;
  const active = controlled ? activeProp : ownActive;
  const setActive = (id: string | null) => {
    if (!controlled) setOwnActive(id);
    onPick?.(id);
  };
  const copy = CARD_COPY[app ? "app" : "reference"];
  const [query, setQuery] = useState("");
  const [subs, setSubs] = useState<Record<string, number>>({});
  const [closed, setClosed] = useState(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? nav.filter((n) => n.label.toLowerCase().includes(q)) : nav;
  }, [query, nav]);

  const add = (id: string) => setSubs((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }));

  return (
    <div className="kit-ron-frame" data-compact={compact ? "" : undefined} style={compact ? undefined : { clipPath: FRAME_CLIP }}>
      {closed && (
        <button type="button" className="kit-ron-reopen" onClick={() => setClosed(false)}>
          <HugeIcon name="sidebar" size={18} />
          Open sidebar
        </button>
      )}
      <aside className="kit-ron" data-closed={closed ? "" : undefined} aria-label="Sidebar">
        {!compact && <Surface w={503} h={917} r={24} s={0.6} kind="glass" />}
        <div className="kit-ron-logo">
          <span className="kit-ron-mark" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          {brand}
        </div>
        <button
          type="button"
          className="kit-ron-icon"
          style={{ left: compact ? 172 : 410.5, top: 15.5, transform: "scaleX(-1)" }}
          aria-label="Sign out"
        >
          <HugeIcon name="sign-out" size={21} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="kit-ron-icon"
          style={{ left: compact ? 216 : 455, top: 16 }}
          aria-label="Close sidebar"
          onClick={() => (onClose ? onClose() : setClosed(true))}
        >
          <HugeIcon name="x" size={18} strokeWidth={1.75} />
        </button>

        <div className="kit-ron-title">
          <button type="button" className="kit-ron-back" aria-label="Back">
            <HugeIcon name="back" size={24} strokeWidth={1.6} />
          </button>
          <h3>{title}</h3>
        </div>

        <label className="kit-ron-search">
          <HugeIcon name="search" size={20} strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by system"
            aria-label="Search by system"
          />
        </label>

        <div className="kit-ron-rule" style={{ left: 16, top: 247, width: 180 }} />
        {!compact && <div className="kit-ron-col-rule" />}

        <nav className="kit-ron-nav">
          {shown.map((item) => (
            <div key={item.id}>
              <Row
                item={item}
                active={active === item.id}
                onPick={() => setActive(item.id)}
                onClear={() => setActive(null)}
                onAdd={item.add ? () => add(item.id) : undefined}
              />
              {Array.from({ length: subs[item.id] ?? 0 }, (_, k) => (
                <div key={k} className="kit-ron-sub">
                  <i />
                  {item.id === "tasks" ? `New task ${k + 1}` : item.id === "accounting" ? `Invoice draft ${k + 1}` : `Group ${k + 1}`}
                </div>
              ))}
            </div>
          ))}
          {shown.length === 0 && <div className="kit-ron-empty">Nothing matches “{query}”</div>}
        </nav>

        <div
          className="kit-ron-rule"
          style={compact ? { left: 30, bottom: 160, width: 170 } : { left: 30, top: 616, width: 170 }}
        />

        <div className="kit-ron-bottom">
          {foot.map((item) => (
            <Row
              key={item.id}
              item={item}
              active={active === item.id}
              onPick={() => setActive(item.id)}
              onClear={() => setActive(null)}
            />
          ))}
        </div>

        {!compact && (
        <div className="kit-ron-cards">
          <button type="button" className="kit-ron-card kit-ron-insight">
            <CardSurface h={190} top="rgba(245,190,210,0.5)" bottom="rgba(175,190,240,0.55)" />
            <span className="kit-ron-art" style={{ clipPath: ART_CLIP }} aria-hidden>
              <span className="kit-ron-dots" />
              <span className="kit-ron-pixels">
                {Array.from({ length: 12 }, (_, k) => (
                  <i key={k} />
                ))}
              </span>
            </span>
            <strong>{copy.insight}</strong>
            <span className="kit-ron-chev" aria-hidden>
              <HugeIcon name="chevron-right" size={14} strokeWidth={1.9} />
            </span>
            {/* The reference's own four lines, so the bold lands where it does there. */}
            {app ? (
              <p>
                You watched
                <br />
                5 lessons and passed
                <br />
                <b>4 of 5 quick</b>
                <br />
                <b>checks</b>
              </p>
            ) : (
              <p>
                The Company&apos;s
                <br />
                profitability for the third
                <br />
                quarter <b>Increased by</b>
                <br />
                <b>27.1% - 31.2%</b>
              </p>
            )}
          </button>

          <div className="kit-ron-group kit-ron-group--invoices">
            <span className="kit-ron-doc kit-ron-doc--a" aria-hidden>
              <em>INVOICE</em>
              <i style={{ width: 50 }} />
              <i style={{ width: 34 }} />
              <i style={{ width: 70 }} />
            </span>
            <span className="kit-ron-doc kit-ron-doc--b" aria-hidden>
              <em>INVOICE</em>
              <i style={{ width: 30 }} />
              <i style={{ width: 60 }} />
              <i style={{ width: 88 }} />
              <i style={{ width: 44 }} />
            </span>
            <button type="button" className="kit-ron-card kit-ron-card--file">
              <CardSurface h={83} bottom="rgba(170,180,230,0.45)" />
              <strong>{copy.files[0][0]}</strong>
              <small>{copy.files[0][1]}</small>
              <span className="kit-ron-chev" aria-hidden>
                <HugeIcon name="chevron-right" size={14} strokeWidth={1.9} />
              </span>
            </button>
          </div>

          <div className="kit-ron-group kit-ron-group--reporting">
            <span className="kit-ron-stack kit-ron-stack--back" style={{ clipPath: STACK_BACK_CLIP }} aria-hidden />
            <span className="kit-ron-stack kit-ron-stack--front" style={{ clipPath: STACK_FRONT_CLIP }} aria-hidden>
              <i style={{ width: 38 }} />
              <i style={{ width: 150, height: 1 }} />
              <i style={{ width: 30 }} />
              <i style={{ width: 22 }} />
            </span>
            <button type="button" className="kit-ron-card kit-ron-card--file">
              <CardSurface h={89} bottom="rgba(240,185,205,0.55)" />
              <strong>{copy.files[1][0]}</strong>
              <small>{copy.files[1][1]}</small>
              <span className="kit-ron-chev" aria-hidden>
                <HugeIcon name="chevron-right" size={14} strokeWidth={1.9} />
              </span>
            </button>
          </div>

          <button type="button" className="kit-ron-card kit-ron-card--file">
            <CardSurface h={88} bottom="rgba(180,185,215,0.38)" />
            <strong>{copy.files[2][0]}</strong>
            <small>{copy.files[2][1]}</small>
            <span className="kit-ron-chev" aria-hidden>
              <HugeIcon name="chevron-right" size={14} strokeWidth={1.9} />
            </span>
          </button>
          <button type="button" className="kit-ron-card kit-ron-card--file">
            <CardSurface h={88} bottom="rgba(180,185,215,0.38)" />
            <strong>{copy.files[3][0]}</strong>
            <small>{copy.files[3][1]}</small>
            <span className="kit-ron-chev" aria-hidden>
              <HugeIcon name="chevron-right" size={14} strokeWidth={1.9} />
            </span>
          </button>
        </div>
        )}
      </aside>
    </div>
  );
}
