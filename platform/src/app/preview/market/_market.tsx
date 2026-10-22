"use client";

import { useEffect, useMemo, useState } from "react";
import { Close, COURSES, SavedContext, Search, Tuning, fmtTime } from "./_shared";
import type { Course, Level, Subject } from "./_types";
import { SETS } from "./sets";
import m from "./market.module.css";

const SUBJECTS: Subject[] = ["Finance", "Business", "Economics"];
const SAVED_KEY = "booklesss:market-saved:v1";

type Sort = "newest" | "shortest" | "most-videos" | "top-rated";
type Length = "any" | "short" | "medium" | "long";
type Filters = { sort: Sort; length: Length; level: Level | "any"; verifiedOnly: boolean; savedOnly: boolean };
const DEFAULT: Filters = { sort: "newest", length: "any", level: "any", verifiedOnly: false, savedOnly: false };

const SORTS: [Sort, string][] = [
  ["newest", "Newest"],
  ["shortest", "Shortest"],
  ["most-videos", "Most videos"],
  ["top-rated", "Top rated"],
];
const LENGTHS: [Length, string][] = [
  ["any", "Any"],
  ["short", "Under 3h"],
  ["medium", "3–6h"],
  ["long", "Over 6h"],
];
const LEVELS: (Level | "any")[] = ["any", "Beginner", "Intermediate", "Advanced"];

function apply(courses: Course[], subject: Subject | null, f: Filters, saved: Set<string>, q: string) {
  let out = courses.filter((c) => !subject || c.subject === subject);
  const needle = q.trim().toLowerCase();
  if (needle) out = out.filter((c) => `${c.title} ${c.creator.name} ${c.blurb} ${c.subject}`.toLowerCase().includes(needle));
  if (f.length === "short") out = out.filter((c) => c.minutes < 180);
  if (f.length === "medium") out = out.filter((c) => c.minutes >= 180 && c.minutes <= 360);
  if (f.length === "long") out = out.filter((c) => c.minutes > 360);
  if (f.level !== "any") out = out.filter((c) => c.level === f.level);
  if (f.verifiedOnly) out = out.filter((c) => c.creator.verified);
  if (f.savedOnly) out = out.filter((c) => saved.has(c.slug));
  const by: Record<Sort, (a: Course, b: Course) => number> = {
    newest: (a, b) => a.updatedDays - b.updatedDays,
    shortest: (a, b) => a.minutes - b.minutes,
    "most-videos": (a, b) => b.videos - a.videos,
    "top-rated": (a, b) => b.rating - a.rating,
  };
  return [...out].sort(by[f.sort]);
}

export function Market({ className }: { className: string }) {
  /* The three segments are the three subjects. Tapping the active one again
     lifts it, and the page shows every subject. */
  const [subject, setSubject] = useState<Subject | null>("Finance");
  const [filters, setFilters] = useState<Filters>(DEFAULT);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, []);

  const toggle = (slug: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });

  const visible = useMemo(() => apply(COURSES, subject, filters, saved, query), [subject, filters, saved, query]);
  /* the featured strip ignores the subject so it always has something, but
     honours the search and the extra filters */
  const featured = useMemo(() => apply(COURSES, null, filters, saved, query).filter((c) => c.featured), [filters, saved, query]);
  const active = (filters.sort !== "newest" ? 1 : 0) + (filters.length !== "any" ? 1 : 0) + (filters.level !== "any" ? 1 : 0) + (filters.verifiedOnly ? 1 : 0) + (filters.savedOnly ? 1 : 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <SavedContext.Provider value={{ saved, toggle }}>
      <main className={`${className} ${m.page}`}>
        <header className={m.top}>
          <span className={m.brand}>Booklesss</span>
          <span className={m.savedCount}>{saved.size ? `${saved.size} saved` : ""}</span>
        </header>

        <label className={m.search}>
          <Search size={20} />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses or creators" aria-label="Search courses" />
          {query && (
            <button type="button" className={m.clear} aria-label="Clear search" onClick={() => setQuery("")}>
              <Close size={16} />
            </button>
          )}
        </label>

        {/* the dark neumorphic pin: three segments left, the same style of
            button far right for the rest of the filters */}
        <div className={m.controls}>
          <div className={m.seg} role="tablist" aria-label="Subject">
            {SUBJECTS.map((s) => {
              const on = subject === s;
              const n = COURSES.filter((c) => c.subject === s).length;
              return (
                <button key={s} type="button" role="tab" aria-selected={on} className={`${m.segBtn} ${on ? m.segOn : ""}`} onClick={() => setSubject(on ? null : s)}>
                  <span className={m.segLabel}>{s}</span>
                  <span className={m.segCount}>{n}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className={`${m.filterBtn} ${active ? m.filterOn : ""}`} aria-label="More filters" aria-expanded={open} onClick={() => setOpen(true)}>
            <Tuning size={22} />
            {active > 0 && <span className={m.dot}>{active}</span>}
          </button>
        </div>

        <p className={m.summary}>
          {visible.length} {visible.length === 1 ? "course" : "courses"}
          {subject ? ` in ${subject}` : " across every subject"}
          {query ? ` matching “${query.trim()}”` : ""}
          {active ? ` · ${active} ${active === 1 ? "filter" : "filters"} on` : ""}
        </p>

        {/* the featured strip: every featured course, full-bleed, each drawn
            by a different set so the strip is also a tour of the designs */}
        {featured.length > 0 && (
          <section className={m.set} aria-label="Featured">
            <div className={m.setHead}>
              <h2 className={m.setTitle}>Featured</h2>
              <p className={m.setFrom}>Full-bleed covers, one per design</p>
            </div>
            <div className={m.row}>
              {featured.map((course, i) => {
                const set = SETS[i % SETS.length];
                return (
                  <div key={course.slug} className={m.slot} style={{ "--w": `${set.width}px` } as React.CSSProperties}>
                    <set.Card course={course} index={i} featured />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {SETS.map((set, i) => (
          <section key={set.id} className={m.set} aria-label={set.name} style={{ "--w": `${set.width}px` } as React.CSSProperties}>
            <div className={m.setHead}>
              <h2 className={m.setTitle}>
                <span className={m.setNo}>{String(i + 1).padStart(2, "0")}</span> {set.name}
              </h2>
              <p className={m.setFrom}>{set.from}</p>
            </div>
            {visible.length ? (
              <div className={m.row}>
                {visible.map((course, index) => (
                  <div key={course.slug} className={m.slot}>
                    <set.Card course={course} index={index} featured={!!course.featured} />
                  </div>
                ))}
              </div>
            ) : (
              <p className={m.empty}>Nothing here with these filters.</p>
            )}
          </section>
        ))}

        {open && (
          <div className={m.scrim} onClick={() => setOpen(false)}>
            <div className={m.sheet} role="dialog" aria-modal="true" aria-label="Filters" onClick={(e) => e.stopPropagation()}>
              <div className={m.sheetHead}>
                <h2>Filters</h2>
                <button type="button" className={m.iconBtn} aria-label="Close" onClick={() => setOpen(false)}>
                  <Close size={20} />
                </button>
              </div>

              <p className={m.group}>Sort</p>
              <div className={m.chips}>
                {SORTS.map(([k, label]) => (
                  <button key={k} type="button" className={`${m.chip} ${filters.sort === k ? m.chipOn : ""}`} onClick={() => setFilters({ ...filters, sort: k })}>
                    {label}
                  </button>
                ))}
              </div>

              <p className={m.group}>Length</p>
              <div className={m.chips}>
                {LENGTHS.map(([k, label]) => (
                  <button key={k} type="button" className={`${m.chip} ${filters.length === k ? m.chipOn : ""}`} onClick={() => setFilters({ ...filters, length: k })}>
                    {label}
                  </button>
                ))}
              </div>

              <p className={m.group}>Level</p>
              <div className={m.chips}>
                {LEVELS.map((k) => (
                  <button key={k} type="button" className={`${m.chip} ${filters.level === k ? m.chipOn : ""}`} onClick={() => setFilters({ ...filters, level: k })}>
                    {k === "any" ? "Any" : k}
                  </button>
                ))}
              </div>

              <p className={m.group}>Options</p>
              <label className={m.toggleRow}>
                <span>Verified creators only</span>
                <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })} />
                <span className={m.toggle} aria-hidden />
              </label>
              <label className={m.toggleRow}>
                <span>Saved only {saved.size ? `(${saved.size})` : ""}</span>
                <input type="checkbox" checked={filters.savedOnly} onChange={(e) => setFilters({ ...filters, savedOnly: e.target.checked })} />
                <span className={m.toggle} aria-hidden />
              </label>

              <div className={m.sheetFoot}>
                <button type="button" className={m.ghost} onClick={() => setFilters(DEFAULT)} disabled={!active}>
                  Reset
                </button>
                <button type="button" className={m.primary} onClick={() => setOpen(false)}>
                  Show {visible.length} {visible.length === 1 ? "course" : "courses"}
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className={m.foot}>
          {COURSES.length} courses · {fmtTime(COURSES.reduce((a, c) => a + c.minutes, 0))} of video · every number here is a placeholder
        </footer>
      </main>
    </SavedContext.Provider>
  );
}
