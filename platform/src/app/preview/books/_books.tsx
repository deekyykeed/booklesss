"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { GLYPHS, type Glyph } from "./_glyphs";
import b from "./books.module.css";

/* Eight cover layouts. The first is the split cover already on the Paper board;
 * the other seven are each after one of the Headway covers the owner sent:
 *   split     — subject art on top, the course name in a bright band below   (the Paper board)
 *   focus     — title top left, a disc and a mark bottom right, a floor band  ("Stolen Focus")
 *   dark      — dark ground, centred title, a big mark, coins and stars        ("Your Infinite Power")
 *   number    — the video count as the art, a faded ring behind it            ("The 12 Week Year")
 *   condensed — condensed caps, a tilted note, a disc holding the count       ("Get Good With Money")
 *   bigword   — one huge word, a mark rising from the corner                  ("Drive")
 *   arc       — a big arc behind a centred title, a figure in a block         ("Four Thousand Weeks")
 *   scatter   — small marks thrown across the cover, a big mark at the foot   ("The Psychology of Money")
 * Every row uses six different ones, so no two books in a row match. On "split",
 * bg is the band and c1-c3 are the art's gradient. */
type Layout = "split" | "focus" | "dark" | "number" | "condensed" | "bigword" | "arc" | "scatter";

type Cover = {
  layout: Layout;
  /** background, title ink, then up to four tones for the art */
  bg: string;
  ink: string;
  c1: string;
  c2: string;
  c3?: string;
  c4?: string;
  glyph: Glyph;
  /** the small mark: coins on "dark", the thrown marks on "scatter" */
  glyph2?: Glyph;
  /** title size in em of the cover (the cover is 22em x 33em) */
  ts: number;
  kicker?: string;
  word?: string;
  sub: string;
};

type Course = { title: string; videos: number; time: string; updated: string; cover: Cover };
type Category = { name: string; courses: Course[] };

const CATEGORIES: Category[] = [
  {
    name: "Finance",
    courses: [
      { title: "Corporate Finance", videos: 45, time: "6h 20m", updated: "2d", cover: { layout: "split", bg: "#F4A63A", ink: "#121212", c1: "#2A4A38", c2: "#1F3A2B", c3: "#152A1F", glyph: "graph-new-up", ts: 3.4, kicker: "Finance", sub: "Valuation, capital and risk" } },
      { title: "Treasury Management", videos: 52, time: "7h 05m", updated: "5d", cover: { layout: "dark", bg: "#0F2B22", ink: "#FFC93C", c1: "#7EE0A1", c2: "#1F5B40", glyph: "safe-square", glyph2: "dollar", ts: 2.8, sub: "Cash, funding and risk: keeping a firm liquid" } },
      { title: "Financial Accounting", videos: 27, time: "3h 10m", updated: "4d", cover: { layout: "number", bg: "#D8D8D2", ink: "#111111", c1: "#A9C94A", c2: "#A9C94A", glyph: "calculator", ts: 2.2, sub: "27 short videos on records and statements" } },
      { title: "Management Accounting", videos: 24, time: "2h 50m", updated: "1w", cover: { layout: "condensed", bg: "#F96A1F", ink: "#D7F53A", c1: "#D7F53A", c2: "#E2470F", c3: "#8ED8C3", c4: "#0F2B22", glyph: "pie-chart-2", ts: 4.2, sub: "short videos on costing, budgets and control" } },
      { title: "Business Finance", videos: 18, time: "2h 05m", updated: "2w", cover: { layout: "bigword", bg: "#3C9A3F", ink: "#FFFFFF", c1: "#1C2457", c2: "#F4D03F", glyph: "wallet-money", ts: 4.1, kicker: "Business", word: "Finance", sub: "The money decisions inside a firm" } },
      { title: "Taxation", videos: 22, time: "2h 40m", updated: "3d", cover: { layout: "arc", bg: "#12392A", ink: "#FFD93B", c1: "#FFD93B", c2: "#1E5A3E", c3: "#E2421E", c4: "#F47C9A", glyph: "bill-list", ts: 3.4, sub: "How tax is worked out, for people and firms" } },
    ],
  },
  {
    name: "Business",
    courses: [
      { title: "Strategic Management", videos: 38, time: "4h 50m", updated: "1w", cover: { layout: "scatter", bg: "#F9A825", ink: "#141414", c1: "#8BD86B", c2: "#7B4DFF", glyph: "case-round", glyph2: "target", ts: 2.7, sub: "How firms compete, and how they win" } },
      { title: "Business Administration", videos: 31, time: "3h 40m", updated: "2w", cover: { layout: "number", bg: "#E6E0F4", ink: "#1C1240", c1: "#B7A3E6", c2: "#B7A3E6", glyph: "buildings-2", ts: 1.75, sub: "31 short videos on how organisations are run" } },
      { title: "Marketing", videos: 26, time: "3h 05m", updated: "4d", cover: { layout: "focus", bg: "#8ED8C3", ink: "#0F2B22", c1: "#E8432C", c2: "#1E6E6A", c3: "#FBC12E", glyph: "tag-price", ts: 3.1, sub: "Winning buyers, and keeping them" } },
      { title: "Human Resource Management", videos: 20, time: "2h 30m", updated: "6d", cover: { layout: "dark", bg: "#1C2457", ink: "#FFB4C8", c1: "#8EC5FF", c2: "#2E3A80", glyph: "users-group-rounded", glyph2: "case-round", ts: 2.5, sub: "People at work: hiring, pay and performance" } },
      { title: "Business Law", videos: 19, time: "2h 15m", updated: "1w", cover: { layout: "bigword", bg: "#E8432C", ink: "#FFF4E6", c1: "#1C1240", c2: "#F9A825", glyph: "scale", ts: 8.6, kicker: "Business", word: "Law", sub: "Contracts, companies and what the law expects" } },
      { title: "Operations Management", videos: 23, time: "2h 55m", updated: "5d", cover: { layout: "split", bg: "#5FC9A8", ink: "#121212", c1: "#22504A", c2: "#183A35", c3: "#0F2824", glyph: "box", ts: 3.4, kicker: "Business", sub: "Making and delivering" } },
    ],
  },
  {
    name: "Economics",
    courses: [
      { title: "Principles of Economics", videos: 64, time: "8h 15m", updated: "3d", cover: { layout: "arc", bg: "#F96A1F", ink: "#FFF4D6", c1: "#FFF4D6", c2: "#E85A12", c3: "#1C2457", c4: "#FFD93B", glyph: "shop", ts: 2.7, sub: "Markets, prices and policy, from the start" } },
      { title: "Micro­economics", videos: 40, time: "5h 10m", updated: "5d", cover: { layout: "scatter", bg: "#DDEB5A", ink: "#3A1A6E", c1: "#7B4DFF", c2: "#3A1A6E", glyph: "hand-money", glyph2: "banknote-2", ts: 2.9, sub: "How firms and households choose" } },
      { title: "Macro­economics", videos: 36, time: "4h 45m", updated: "1w", cover: { layout: "number", bg: "#CFE6F2", ink: "#10223F", c1: "#7FB3E8", c2: "#7FB3E8", glyph: "globus", ts: 2.2, sub: "36 short videos on growth, inflation and jobs" } },
      { title: "Development Economics", videos: 21, time: "2h 35m", updated: "2w", cover: { layout: "split", bg: "#F06A5A", ink: "#121212", c1: "#3A3434", c2: "#2E2A2A", c3: "#1F1C1C", glyph: "money-bag", ts: 3.4, kicker: "Economics", sub: "Why some countries grow" } },
      { title: "Business Statistics", videos: 28, time: "3h 30m", updated: "4d", cover: { layout: "condensed", bg: "#E8432C", ink: "#FFE14D", c1: "#FFE14D", c2: "#C62E1A", c3: "#F9A825", c4: "#1C1240", glyph: "chart-square", ts: 4.2, sub: "short videos on numbers you can trust" } },
      { title: "Quantitative Methods", videos: 25, time: "3h 00m", updated: "6d", cover: { layout: "focus", bg: "#F47C9A", ink: "#1C1240", c1: "#1C2457", c2: "#1C2457", c3: "#FFE14D", glyph: "chart-2", ts: 2.4, sub: "The maths behind good decisions" } },
    ],
  },
];

/* where the small marks land on "scatter" and the stars on "dark": [left, top, size] in em, plus a turn */
const THROWN: [number, number, number, number][] = [
  [3, 0.4, 3, -20], [9.5, -0.8, 3.2, 15], [16.5, 1, 3, -30], [19, 8.5, 3.2, 25], [-0.4, 13, 2.8, -15],
  [18.4, 15, 3.4, -10], [0.6, 20.5, 3, 30], [19, 21.5, 3, 15], [8, 16.4, 2.6, -25],
];
const STARS: [number, number, number][] = [
  [12, 3, 0.9], [19.4, 12, 0.7], [2.8, 18.6, 0.7], [19, 21.6, 0.9], [6, 23.6, 0.6], [14.4, 29, 0.7], [15.6, 6.4, 0.6],
];
const COINS: [number, number, number][] = [[16.6, 6.2, 2.6], [3.2, 25.6, 2.4], [8.6, 27.6, 3.2]];

function Mark({ name, className, style }: { name: Glyph; className?: string; style?: CSSProperties }) {
  return <svg viewBox="0 0 24 24" aria-hidden className={className} style={style} dangerouslySetInnerHTML={{ __html: GLYPHS[name] }} />;
}

function Art({ course }: { course: Course }) {
  const v = course.cover;
  const title = <h3 className={b.title}>{course.title}</h3>;

  switch (v.layout) {
    case "split":
      return (
        <div className={`${b.art} ${b.split}`}>
          <div className={b.splitArt}>
            <span className={b.subject}>{v.kicker}</span>
            <Mark name={v.glyph} className={b.splitMark} />
          </div>
          <div className={b.band}>
            {title}
            <p className={b.sub}>{v.sub}</p>
          </div>
        </div>
      );
    case "focus":
      return (
        <div className={`${b.art} ${b.focus}`}>
          <span className={b.floor} />
          <span className={b.disc} />
          <Mark name={v.glyph} className={b.focusMark} />
          <div className={b.focusText}>
            {title}
            <p className={b.sub}>{v.sub}</p>
          </div>
        </div>
      );
    case "dark":
      return (
        <div className={`${b.art} ${b.dark}`}>
          <Mark name={v.glyph} className={b.darkMark} />
          <span className={b.planet} />
          {v.glyph2 && <Mark name={v.glyph2} className={b.planetMark} />}
          {COINS.map(([l, t, s], i) => (
            <span key={i} className={b.coin} style={{ left: `${l}em`, top: `${t}em`, width: `${s}em`, height: `${s}em` }}>
              {v.glyph2 && <Mark name={v.glyph2} />}
            </span>
          ))}
          {STARS.map(([l, t, s], i) => (
            <span key={i} className={b.star} style={{ left: `${l}em`, top: `${t}em`, width: `${s}em`, height: `${s}em` }} />
          ))}
          <div className={b.darkText}>
            {title}
            <p className={b.sub}>{v.sub}</p>
          </div>
        </div>
      );
    case "number":
      return (
        <div className={`${b.art} ${b.number}`}>
          <span className={b.ring} />
          <Mark name={v.glyph} className={b.numberMark} />
          <div className={b.numberText}>
            <span className={b.count}>{course.videos}</span>
            {title}
            <p className={b.sub}>{v.sub}</p>
          </div>
        </div>
      );
    case "condensed":
      return (
        <div className={`${b.art} ${b.condensed}`}>
          <span className={b.hand} />
          <h3 className={b.title}>
            {course.title.split(" ").map((w) => (
              <span key={w}>{w}</span>
            ))}
          </h3>
          <span className={b.note}>
            <Mark name={v.glyph} />
          </span>
          <span className={b.badge}>
            <strong>{course.videos}</strong>
            {v.sub}
          </span>
        </div>
      );
    case "bigword":
      return (
        <div className={`${b.art} ${b.bigword}`}>
          <span className={b.disc} />
          <Mark name={v.glyph} className={b.bigMark} />
          <div className={b.bigText}>
            <span className={b.kicker}>{v.kicker}</span>
            <h3 className={b.title} aria-label={course.title}>
              {v.word}
            </h3>
            <p className={b.sub}>{v.sub}</p>
          </div>
        </div>
      );
    case "arc":
      return (
        <div className={`${b.art} ${b.arc}`}>
          <span className={b.sun} />
          {title}
          <Mark name={v.glyph} className={b.arcMark} />
          <div className={b.block}>
            <p className={b.sub}>{v.sub}</p>
          </div>
        </div>
      );
    case "scatter":
      return (
        <div className={`${b.art} ${b.scatter}`}>
          {v.glyph2 &&
            THROWN.map(([l, t, s, r], i) => (
              <Mark key={i} name={v.glyph2!} className={b.thrown} style={{ left: `${l}em`, top: `${t}em`, width: `${s}em`, height: `${s}em`, rotate: `${r}deg` }} />
            ))}
          <Mark name={v.glyph} className={b.scatterMark} />
          <div className={b.scatterText}>
            {title}
            <p className={b.sub}>{v.sub}</p>
          </div>
        </div>
      );
  }
}

function Book({ course }: { course: Course }) {
  const v = course.cover;
  const vars = {
    "--bg": v.bg,
    "--ink": v.ink,
    "--c1": v.c1,
    "--c2": v.c2,
    "--c3": v.c3 ?? v.c2,
    "--c4": v.c4 ?? v.ink,
    "--ts": `${v.ts}em`,
  } as CSSProperties;

  return (
    <article className={b.course}>
      <div className={b.book} style={vars}>
        <Art course={course} />
        <span className={b.groove} aria-hidden />
        <span className={b.sheen} aria-hidden />
      </div>
      <p className={b.meta}>
        {course.time} · updated {course.updated} ago
      </p>
    </article>
  );
}

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5.5 12.002H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M18.5 12L4.99997 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Row({ category }: { category: Category }) {
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // two books per press: far enough to feel like progress, short enough to keep your place
  const step = (dir: 1 | -1) => {
    const el = row.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * 2 * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section className={b.category} aria-label={category.name}>
      <div className={b.catHead}>
        <h2 className={b.catTitle}>
          {category.name} <span>{category.courses.length} courses</span>
        </h2>
        <div className={b.arrows}>
          <button type="button" className={b.prev} onClick={() => step(-1)} disabled={edge.start} aria-label={`Previous ${category.name} courses`}>
            <ArrowLeft />
          </button>
          <button type="button" className={b.next} onClick={() => step(1)} disabled={edge.end} aria-label={`More ${category.name} courses`}>
            <ArrowRight />
          </button>
        </div>
        <button type="button" className={b.seeAll}>See all</button>
      </div>
      <div className={b.row} ref={row} onScroll={measure}>
        {category.courses.map((course) => (
          <Book key={course.title} course={course} />
        ))}
      </div>
    </section>
  );
}

export function Books({ className }: { className: string }) {
  return (
    <main className={`${className} ${b.page}`}>
      <header className={b.top}>
        <span className={b.logo} aria-hidden />
        <label className={b.search}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M17 17L21 21" stroke="#9A978E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="#9A978E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input type="search" placeholder="Search courses, videos or topics" aria-label="Search" />
        </label>
        <button type="button" className={b.menu} aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 5L20 5" stroke="#1E1E24" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 12L20 12" stroke="#1E1E24" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 19L20 19" stroke="#1E1E24" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <nav className={b.tabs} aria-label="Browse">
        <span className={`${b.tab} ${b.tabOn}`} aria-current="page">Courses</span>
        <span className={b.tab}>Videos</span>
        <span className={b.tab}>Saved</span>
      </nav>

      <section className={b.heading}>
        <h1>pick a course, press play</h1>
        <p>Every course is a set of short videos. Scroll the subjects, swipe to see what&apos;s in each.</p>
      </section>

      {CATEGORIES.map((category) => (
        <Row key={category.name} category={category} />
      ))}
    </main>
  );
}
