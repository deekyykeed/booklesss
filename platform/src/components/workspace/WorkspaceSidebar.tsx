"use client";

/* ------------------------------------------------------------------------- *
 * Workspace sidebar — a replica of the reference shot in Booklesss Bucket/
 * (original-ad190f2d228041cce3aba7da32fe7a94.webp).
 *
 * Every colour below was pulled off that image with a pixel sampler rather
 * than eyeballed, so the hexes are the reference's own. Large flat fills
 * (button, mic, active tile) were read from their interiors; thin strokes were
 * read at their brightest pixel, which is the closest an antialiased 1px line
 * gets to its true colour.
 *
 *   panel / rail bg   #000000      divider to content   #232323
 *   content bg        #101010      rail dividers        #282828
 *   accent blue       #3478F7      active rail tile     #171B2C
 *   record red        #F74C4C      unread badge         #D23B19
 *   sign-out          #B8462B      tree line            #222222
 *   primary text      #FFFFFF      dim text / icons     #969696
 *   marker rings      #878787      star (off)           #343434
 *
 * Geometry is the reference's too, divided by the 1.22 scale the shot was
 * taken at: 80px rail + 240px panel, 48px rail tiles on a 52px pitch, 36px
 * nav rows, 14px labels, markers on a 9px grid.
 *
 * Icons are Solar Linear (see components/icons/solar.tsx). Two marks are drawn
 * by hand because Solar has no equivalent: the bare "+" on Create new task,
 * and the ring / diamond row markers, which are geometry rather than icons.
 * ------------------------------------------------------------------------- */

import { useState } from "react";
import { SolarIcon, type SolarIconName } from "@/components/icons/solar";

/* ---- rail ---------------------------------------------------------------- */

type RailItem = { id: string; icon: SolarIconName; label: string; badge?: number };

const RAIL_TOP: RailItem[] = [
  { id: "boards", icon: "widget-linear", label: "Boards" },
  { id: "docs", icon: "file-text-linear", label: "Documents" },
  { id: "calendar", icon: "calendar-linear", label: "Calendar" },
];

const RAIL_MID: RailItem[] = [
  { id: "share", icon: "share-linear", label: "Shared with me" },
  { id: "time", icon: "clock-circle-linear", label: "Time tracking" },
  { id: "chat", icon: "chat-round-dots-linear", label: "Messages", badge: 2 },
];

/* ---- panel --------------------------------------------------------------- */

type Project = {
  id: string;
  name: string;
  /* the ring beside a project; null draws the neutral grey ring */
  tone?: string;
  starred?: boolean;
  pages?: string[];
};

const FAVOURITES: Project[] = [
  { id: "over9k-fav", name: "Over9k: Gamers app", tone: "#5BBC70", starred: true },
  { id: "aftermidnight-fav", name: "AfterMidnight", tone: "#4F77C2", starred: true },
];

const PROJECTS: Project[] = [
  {
    id: "over9k",
    name: "Over9k: Gamers app",
    starred: true,
    pages: ["Overview", "Branding", "Mobile app for iOS", "Landing page", "Development"],
  },
  { id: "guitar", name: "Guitar Tuner" },
  { id: "aftermidnight", name: "AfterMidnight", starred: true },
  { id: "doctor", name: "Doctor+" },
];

const COMPANY: Project[] = [
  { id: "dribbble", name: "Dribbble shots" },
  { id: "behance", name: "Behance cases" },
  { id: "mp", name: "MP redesign concept" },
  { id: "brandbook", name: "Brand book logotype" },
];

/* ---- small parts --------------------------------------------------------- */

/** The 9px ring that opens every project row. Filled and white when the
 *  project is the open one — that dot is what says "you are in here". */
function Ring({ tone, filled }: { tone?: string; filled?: boolean }) {
  if (filled) {
    return <span className="block size-[9px] shrink-0 rounded-full bg-white" />;
  }
  return (
    <span
      className="block size-[9px] shrink-0 rounded-full border-[1.5px]"
      style={{ borderColor: tone ?? "#878787" }}
    />
  );
}

/** Page marker: a 7px square stood on its corner. Outline at rest, solid white
 *  on the open page. */
function Diamond({ filled }: { filled?: boolean }) {
  return (
    <span
      className="block size-[7px] shrink-0 rotate-45"
      style={
        filled
          ? { background: "#FFFFFF" }
          : { border: "1.2px solid #8E8E8E" }
      }
    />
  );
}

function Star({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={on ? "Remove from favourites" : "Add to favourites"}
      className="shrink-0 transition-colors"
      style={{ color: on ? "#888888" : "#343434" }}
    >
      <SolarIcon name={on ? "star-bold" : "star-linear"} size={14} strokeWidth={1.5} />
    </button>
  );
}

/* ---- sidebar ------------------------------------------------------------- */

export function WorkspaceSidebar() {
  const [rail, setRail] = useState("docs");
  const [project, setProject] = useState("over9k");
  const [page, setPage] = useState("Mobile app for iOS");
  const [open, setOpen] = useState({ favourites: true, projects: true, company: true });
  const [starred, setStarred] = useState<Record<string, boolean>>({
    "over9k-fav": true,
    "aftermidnight-fav": true,
    over9k: true,
    aftermidnight: true,
  });
  const [collapsed, setCollapsed] = useState(false);

  const toggleStar = (id: string) => setStarred((s) => ({ ...s, [id]: !s[id] }));

  /* A rail button: 48px tile, 24px glyph. Only the current one carries the
   * navy tile and the blue glyph. */
  const railButton = (item: RailItem) => {
    const on = rail === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setRail(item.id)}
        title={item.label}
        aria-label={item.label}
        aria-current={on ? "page" : undefined}
        className="relative grid size-12 shrink-0 place-items-center rounded-[14px] transition-colors"
        style={{
          background: on ? "#171B2C" : "transparent",
          color: on ? "#4D8BF5" : "#9A9A9A",
          cornerShape: "superellipse(2.2)",
        } as React.CSSProperties}
      >
        <SolarIcon name={item.icon} size={24} strokeWidth={on ? 1.6 : 1.5} />
        {item.badge ? (
          <span
            className="absolute right-[5px] top-[5px] grid size-4 place-items-center rounded-full text-[10px] font-semibold leading-none text-white"
            style={{ background: "#D23B19" }}
          >
            {item.badge}
          </span>
        ) : null}
      </button>
    );
  };

  const railDivider = <span className="my-[18px] block h-px w-6" style={{ background: "#282828" }} />;

  /* A project row. Same box everywhere — favourites, projects, company — so
   * the three lists align down a single column. */
  const projectRow = (p: Project, list: "fav" | "all") => {
    const on = list === "all" && project === p.id;
    return (
      <button
        key={p.id}
        type="button"
        onClick={() => setProject(p.id)}
        className="group flex h-9 w-full items-center gap-[11px] pl-2 pr-0 text-left"
      >
        <Ring tone={p.tone} filled={on} />
        <span
          className="flex-1 truncate text-[13.5px] leading-none tracking-[-0.01em]"
          style={{ color: "#FFFFFF", fontWeight: 400 }}
        >
          {p.name}
        </span>
        <Star on={!!starred[p.id]} onClick={() => toggleStar(p.id)} />
      </button>
    );
  };

  const sectionHeader = (label: string, key: keyof typeof open) => (
    <button
      type="button"
      onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
      className="flex h-9 w-full items-center gap-[5px] pl-1 text-left"
      aria-expanded={open[key]}
    >
      <SolarIcon
        name="alt-arrow-down-linear"
        size={16}
        strokeWidth={1.6}
        className="shrink-0 transition-transform"
        style={{ color: "#939393", transform: open[key] ? undefined : "rotate(-90deg)" }}
      />
      <span className="text-[13.5px] leading-none tracking-[-0.01em]" style={{ color: "#969696" }}>
        {label}
      </span>
    </button>
  );

  return (
    <aside
      className="relative flex h-full shrink-0 overflow-hidden"
      style={{
        background: "#000000",
        borderRight: "1px solid #232323",
        width: collapsed ? 80 : 320,
        transition: "width 260ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* ---------------- rail ---------------- */}
      <div className="flex w-20 shrink-0 flex-col items-center">
        {/* the mark, centred on the search row beside it */}
        <div className="grid h-20 w-full shrink-0 place-items-center">
          <Mark />
        </div>

        <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto pt-2 [scrollbar-width:none]">
          {RAIL_TOP.map(railButton)}
          {railDivider}
          {RAIL_MID.map(railButton)}
        </div>

        <div className="flex shrink-0 flex-col items-center pb-[26px]">
          {/* record — the one filled control in the whole rail */}
          <button
            type="button"
            aria-label="Record a voice note"
            className="mb-2 grid size-12 place-items-center"
          >
            <span
              className="grid size-10 place-items-center rounded-full text-white transition-transform hover:scale-105"
              style={{ background: "#F74C4C", boxShadow: "0 0 0 4px rgba(247,76,76,0.10)" }}
            >
              <SolarIcon name="microphone-3-linear" size={20} strokeWidth={1.6} />
            </span>
          </button>
          {railButton({ id: "settings", icon: "settings-linear", label: "Settings" })}
          {railButton({ id: "support", icon: "headphones-round-linear", label: "Support" })}
          {railDivider}
          <button
            type="button"
            aria-label="Sign out"
            className="grid size-12 place-items-center transition-opacity hover:opacity-80"
            style={{ color: "#B8462B" }}
          >
            <SolarIcon name="logout-2-linear" size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ---------------- panel ---------------- */}
      <div
        className="flex w-60 shrink-0 flex-col pr-[26px]"
        style={{
          opacity: collapsed ? 0 : 1,
          transition: "opacity 160ms ease",
          pointerEvents: collapsed ? "none" : undefined,
        }}
      >
        {/* search + collapse, on the mark's line */}
        <div className="flex h-20 shrink-0 items-center pr-2">
          <label className="flex h-11 flex-1 items-center gap-3">
            <SolarIcon
              name="magnifer-linear"
              size={22}
              strokeWidth={2}
              className="shrink-0"
              style={{ color: "#FFFFFF" }}
            />
            <input
              placeholder="Search..."
              className="w-full bg-transparent text-[14.5px] tracking-[-0.01em] text-white outline-none placeholder:text-[#969696]"
            />
          </label>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Collapse sidebar"
            className="grid size-6 shrink-0 place-items-center text-white transition-opacity hover:opacity-70"
          >
            <SolarIcon name="double-alt-arrow-left-linear" size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-6 pt-[5px] [scrollbar-width:none]">
          {/* favourites */}
          {sectionHeader("Favorites", "favourites")}
          {open.favourites && FAVOURITES.map((p) => projectRow(p, "fav"))}

          {/* all projects */}
          <div className="mt-7">{sectionHeader("All projects", "projects")}</div>
          {open.projects &&
            PROJECTS.map((p) => (
              <div key={p.id}>
                {projectRow(p, "all")}
                {p.pages && project === p.id ? (
                  <div className="relative">
                    {/* the tree: one hairline from under the project's dot,
                        turning right into Create new task */}
                    <span
                      className="absolute left-[10px] top-0 w-px"
                      style={{ background: "#222222", bottom: 18 }}
                    />
                    <span
                      className="absolute left-[10px] h-[10px] w-[9px] rounded-bl-[9px] border-b border-l"
                      style={{ borderColor: "#222222", bottom: 12 }}
                    />
                    {p.pages.map((name) => {
                      const on = page === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setPage(name)}
                          className="relative flex h-9 w-full items-center gap-[11px] pl-7 text-left"
                        >
                          {on ? (
                            <span
                              className="absolute left-[10px] top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-white"
                              aria-hidden
                            />
                          ) : null}
                          <Diamond filled={on} />
                          <span
                            className="truncate text-[13.5px] leading-none tracking-[-0.01em]"
                            style={{ color: on ? "#FFFFFF" : "#969696", fontWeight: on ? 500 : 400 }}
                          >
                            {name}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      className="flex h-9 w-full items-center gap-[10px] pl-6 text-left"
                      style={{ color: "#3478F7" }}
                    >
                      <Plus />
                      <span className="text-[13.5px] leading-none tracking-[-0.01em]">
                        Create new task
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
            ))}

          {/* company */}
          <div className="mt-7">{sectionHeader("Company's stuff", "company")}</div>
          {open.company && COMPANY.map((p) => projectRow(p, "all"))}

          <button
            type="button"
            className="mt-6 h-12 w-full rounded-[14px] text-[15px] tracking-[-0.01em] text-white transition-opacity hover:opacity-90"
            style={{ background: "#3478F7", cornerShape: "superellipse(2)" } as React.CSSProperties}
          >
            New project
          </button>
        </div>
      </div>
    </aside>
  );
}

/* The workspace mark: a four-point star cut from a square, the shape the
 * reference uses. Drawn rather than imported — it is a logo, not an icon. */
function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      {/* A square whose four sides bow inward, with a round hole punched out
          of the middle — one path, evenodd doing the punching. */}
      <path
        d="M0 0 Q12 8.4 24 0 Q15.6 12 24 24 Q12 15.6 0 24 Q8.4 12 0 0 Z M12 6.9 a5.1 5.1 0 1 0 0 10.2 a5.1 5.1 0 1 0 0-10.2 Z"
        fill="#2C7BFD"
        fillRule="evenodd"
      />
    </svg>
  );
}

/* Solar has no bare plus in its Linear set — only add-square / add-circle — so
 * this one is drawn to the same 1.5 stroke language. */
function Plus() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <path
        d="M6 1.5v9M1.5 6h9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
