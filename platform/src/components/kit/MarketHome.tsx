"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { CATEGORIES, CategoryBar, CategoryMark } from "./CategoryBar";
import { Button, HappyFolder } from "./primitives";

/* The marketplace's first page (owner, 2026-10-18: "build out the first page
 * of the marketplace — I want to see what I'm dealing with on desktop and
 * mobile"). Built from the kit and nothing else: the soft tile material, the
 * glass button, Happy Files as the course folder (a course IS a folder), the
 * category selector. Covers are simple placeholders until the videos make
 * their own (owner: "just use simple placeholders").
 *
 * ⚠️ THE COURSES BELOW ARE PLACEHOLDER DATA. No table exists yet; the names
 * are invented and attached to no real person's work. */

type Course = {
  id: string;
  title: string;
  by: string;
  cat: string;
  lessons: number;
  mins: number;
  price: number; // ZMW, 0 = free
  progress?: number; // 0..1, the "continue" row
};

const COURSES: Course[] = [
  { id: "balance-sheet", title: "Reading a balance sheet", by: "Chanda Mwila", cat: "finance", lessons: 8, mins: 42, price: 0, progress: 0.62 },
  { id: "tvm", title: "Time value of money", by: "Mutale Banda", cat: "finance", lessons: 6, mins: 35, price: 120 },
  { id: "bookkeeping", title: "Bookkeeping for a small shop", by: "Natasha Phiri", cat: "accounting", lessons: 10, mins: 58, price: 150, progress: 0.25 },
  { id: "supply-demand", title: "Supply and demand at Soweto market", by: "Bwalya Zulu", cat: "economics", lessons: 7, mins: 40, price: 0 },
  { id: "kwacha", title: "Inflation and the kwacha", by: "Mwansa Tembo", cat: "economics", lessons: 5, mins: 28, price: 90, progress: 0.8 },
  { id: "pricing", title: "Pricing what you sell", by: "Thandiwe Lungu", cat: "business", lessons: 9, mins: 47, price: 130 },
  { id: "python", title: "Python from zero", by: "Kondwani Mulenga", cat: "tech", lessons: 12, mins: 74, price: 200 },
  { id: "logo", title: "Designing a logo that lasts", by: "Luyando Sakala", cat: "design", lessons: 6, mins: 33, price: 100 },
  { id: "cells", title: "Cells and how they work", by: "Mapalo Chileshe", cat: "science", lessons: 8, mins: 45, price: 0 },
  { id: "contracts", title: "Contracts, plainly", by: "Musonda Kabwe", cat: "law", lessons: 7, mins: 39, price: 140 },
  { id: "first-aid", title: "First aid basics", by: "Chipo Mwale", cat: "health", lessons: 5, mins: 26, price: 0 },
  { id: "plan", title: "Writing a business plan", by: "Mulenga Daka", cat: "startups", lessons: 8, mins: 44, price: 150 },
  { id: "clear", title: "Writing clearly", by: "Precious Ngoma", cat: "writing", lessons: 6, mins: 30, price: 0 },
  { id: "cash-flow", title: "Cash flow for a farm business", by: "Joseph Siame", cat: "finance", lessons: 7, mins: 38, price: 110 },
];

const CREATORS = ["Chanda Mwila", "Kondwani Mulenga", "Natasha Phiri", "Bwalya Zulu", "Luyando Sakala", "Musonda Kabwe"];

const hueOf = (cat: string) => CATEGORIES.find((c) => c.id === cat)?.hue ?? "#5c68fe";
const catOf = (cat: string) => CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0];
const price = (k: number) => (k ? `K${k}` : "Free");
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");

function greeting(h: number) {
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/* A placeholder cover: the category's hue as a soft wash and its mark. */
function Cover({ c, big }: { c: Course; big?: boolean }) {
  const cat = catOf(c.cat);
  return (
    <span className="kit-mk-cover" style={{ "--hue": cat.hue } as CSSProperties} aria-hidden>
      <span className="kit-mk-cover-mark">
        <CategoryMark c={cat} look="duotone" size={big ? 44 : 28} />
      </span>
      <span className="kit-mk-cover-play">
        <HugeIcon name="play" size={big ? 22 : 16} strokeWidth={1.75} />
      </span>
    </span>
  );
}

export function MarketHome({ onMenu, name = "Deeky" }: { onMenu?: () => void; name?: string }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const hour = useMemo(() => new Date().getHours(), []);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return COURSES.filter(
      (c) => (cat === "all" || c.cat === cat) && (!t || c.title.toLowerCase().includes(t) || c.by.toLowerCase().includes(t)),
    );
  }, [cat, q]);
  const featured = shown[0] ?? COURSES[0];
  const going = COURSES.filter((c) => c.progress !== undefined);
  const catLabel = catOf(cat).label;

  return (
    <div className="kit-mk">
      <header className="kit-mk-top">
        {onMenu && (
          <span className="kit-mk-menu">
            <Button variant="soft" size="sm" icon="menu" iconOnly label="Open menu" onClick={onMenu} />
          </span>
        )}
        <div className="kit-mk-hello">
          <h1>
            {greeting(hour)}, {name}
          </h1>
          <p>What do you want to learn today?</p>
        </div>
        <label className="kit-mk-search">
          <HugeIcon name="search" size={18} strokeWidth={1.75} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses and creators" aria-label="Search courses and creators" />
        </label>
        <span className="kit-mk-me">
          <Button variant="soft" size="md" icon="user" iconOnly label="Your account" />
        </span>
      </header>

      <CategoryBar value={cat} onChange={setCat} />

      <section className="kit-mk-hero" style={{ "--hue": hueOf(featured.cat) } as CSSProperties}>
        <Cover c={featured} big />
        <div className="kit-mk-hero-body">
          <span className="kit-mk-eyebrow">Featured{cat === "all" ? "" : ` in ${catLabel}`}</span>
          <h2>{featured.title}</h2>
          <p className="kit-mk-by">
            <span className="kit-mk-avatar" aria-hidden>
              {initials(featured.by)}
            </span>
            {featured.by}
          </p>
          <p className="kit-mk-meta">
            {featured.lessons} lessons · {featured.mins} min · quick checks in every lesson
          </p>
          <div className="kit-mk-hero-cta">
            <Button size="md" icon="play">
              {featured.price ? `Start · ${price(featured.price)}` : "Start watching"}
            </Button>
            <Button
              variant="soft"
              size="md"
              icon="bookmark"
              onClick={() => setSaved((s) => ({ ...s, [featured.id]: !s[featured.id] }))}
            >
              {saved[featured.id] ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </section>

      {cat === "all" && !q && (
        <section className="kit-mk-section">
          <header>
            <h3>Continue watching</h3>
          </header>
          <ul className="kit-mk-rail">
            {going.map((c) => (
              <li key={c.id}>
                <button type="button" className="kit-mk-continue">
                  <Cover c={c} />
                  <span className="kit-mk-continue-body">
                    <strong>{c.title}</strong>
                    <small>
                      Lesson {Math.max(1, Math.round((c.progress ?? 0) * c.lessons))} of {c.lessons}
                    </small>
                    <span className="kit-mk-bar" style={{ "--p": c.progress } as CSSProperties} aria-hidden>
                      <i />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="kit-mk-section">
        <header>
          <h3>{q ? `Results for “${q}”` : cat === "all" ? "Popular courses" : `${catLabel} courses`}</h3>
          <span>{shown.length} courses</span>
        </header>
        {shown.length === 0 ? (
          <p className="kit-mk-empty">Nothing here yet. Try another category, or make this course yourself in Studio.</p>
        ) : (
          <ul className="kit-mk-grid">
            {shown.map((c) => (
              <li key={c.id}>
                <button type="button" className="kit-mk-folder" style={{ "--hue": hueOf(c.cat) } as CSSProperties}>
                  <span className="kit-mk-folder-art">
                    <HappyFolder />
                    <span className="kit-mk-folder-count">{c.lessons}</span>
                  </span>
                  <strong>{c.title}</strong>
                  <small>
                    {c.by} · {c.mins} min
                  </small>
                  <span className="kit-mk-price" data-free={c.price ? undefined : ""}>
                    {price(c.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="kit-mk-section">
        <header>
          <h3>Creators to follow</h3>
        </header>
        <ul className="kit-mk-rail kit-mk-creators">
          {CREATORS.map((n, i) => (
            <li key={n}>
              <span className="kit-mk-creator">
                <span className="kit-mk-avatar kit-mk-avatar--lg" style={{ "--hue": CATEGORIES[(i % 11) + 1].hue } as CSSProperties} aria-hidden>
                  {initials(n)}
                </span>
                <strong>{n}</strong>
                <small>{COURSES.filter((c) => c.by === n).length} course</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
