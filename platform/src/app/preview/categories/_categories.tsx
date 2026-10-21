"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import c from "./categories.module.css";

type Course = { title: string; videos: number; sub: string; time: string; updated: string; cover: [string, string, string] };
type Category = { name: string; courses: Course[] };

const CATEGORIES: Category[] = [
  {
    name: "Finance",
    courses: [
      { title: "Corporate Finance", videos: 45, sub: "Valuation, capital and risk.", time: "6h 20m", updated: "2d", cover: ["#2F5A3E", "#1C3826", "#0F2016"] },
      { title: "Treasury Management", videos: 52, sub: "Cash, funding and risk.", time: "7h 05m", updated: "5d", cover: ["#2E4A7A", "#1B2D52", "#101A33"] },
      { title: "Financial Accounting", videos: 27, sub: "Records and statements.", time: "3h 10m", updated: "4d", cover: ["#3A6390", "#264870", "#1C3456"] },
      { title: "Management Accounting", videos: 24, sub: "Costing, budgets and control.", time: "2h 50m", updated: "1w", cover: ["#A23A1C", "#7A2A16", "#5E1A0E"] },
      { title: "Business Finance", videos: 18, sub: "Money decisions in a firm.", time: "2h 05m", updated: "2w", cover: ["#2E5560", "#1F3D46", "#132A30"] },
      { title: "Taxation", videos: 22, sub: "How tax is worked out.", time: "2h 40m", updated: "3d", cover: ["#C9A55A", "#A0803E", "#7A5A22"] },
    ],
  },
  {
    name: "Business",
    courses: [
      { title: "Strategic Management", videos: 38, sub: "How firms compete.", time: "4h 50m", updated: "1w", cover: ["#8E2A22", "#5E1A12", "#3A0E08"] },
      { title: "Business Administration", videos: 31, sub: "How organisations are run.", time: "3h 40m", updated: "2w", cover: ["#5B3A5E", "#3E2541", "#24142A"] },
      { title: "Marketing", videos: 26, sub: "Winning and keeping buyers.", time: "3h 05m", updated: "4d", cover: ["#B5574B", "#8A3B33", "#5E2420"] },
      { title: "Human Resource Management", videos: 20, sub: "People at work.", time: "2h 30m", updated: "6d", cover: ["#4A5568", "#323B4A", "#1E2430"] },
      { title: "Business Law", videos: 19, sub: "Contracts and companies.", time: "2h 15m", updated: "1w", cover: ["#28402F", "#1C3022", "#14241A"] },
      { title: "Operations Management", videos: 23, sub: "Making and delivering.", time: "2h 55m", updated: "5d", cover: ["#D8C39A", "#B8A070", "#8A7448"] },
    ],
  },
  {
    name: "Economics",
    courses: [
      { title: "Principles of Economics", videos: 64, sub: "Markets, prices and policy.", time: "8h 15m", updated: "3d", cover: ["#8BA36A", "#5E7A46", "#3F5630"] },
      { title: "Microeconomics", videos: 40, sub: "How firms and homes choose.", time: "5h 10m", updated: "5d", cover: ["#4B4E8C", "#33356A", "#22234A"] },
      { title: "Macroeconomics", videos: 36, sub: "Growth, inflation and jobs.", time: "4h 45m", updated: "1w", cover: ["#B33A33", "#8E2A26", "#7A1F1C"] },
      { title: "Development Economics", videos: 21, sub: "Why some countries grow.", time: "2h 35m", updated: "2w", cover: ["#2E6B60", "#1F4D45", "#13302B"] },
      { title: "Business Statistics", videos: 28, sub: "Numbers you can trust.", time: "3h 30m", updated: "4d", cover: ["#2E4A7A", "#1B2D52", "#101A33"] },
      { title: "Quantitative Methods", videos: 25, sub: "Maths for decisions.", time: "3h 00m", updated: "6d", cover: ["#C9A55A", "#A0803E", "#7A5A22"] },
    ],
  },
];

/* the fade under the title sits in the cover's own background, so it can never draw over the text */
const cover = ([a, b, d]: Course["cover"]) =>
  `linear-gradient(0deg, rgba(0,0,0,.36) 0%, rgba(0,0,0,0) 58%), linear-gradient(170deg, ${a} 0%, ${b} 55%, ${d} 100%)`;

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

  // two covers per press: far enough to feel like progress, short enough to keep your place
  const step = (dir: 1 | -1) => {
    const el = row.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * 2 * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section className={c.category} aria-label={category.name}>
      <div className={c.catHead}>
        <h2 className={c.catTitle}>
          {category.name} <span>{category.courses.length} courses</span>
        </h2>
        <div className={c.arrows}>
          <button type="button" className={c.prev} onClick={() => step(-1)} disabled={edge.start} aria-label={`Previous ${category.name} courses`}>
            <ArrowLeft />
          </button>
          <button type="button" className={c.next} onClick={() => step(1)} disabled={edge.end} aria-label={`More ${category.name} courses`}>
            <ArrowRight />
          </button>
        </div>
        <button type="button" className={c.seeAll}>See all</button>
      </div>
      <div className={c.row} ref={row} onScroll={measure}>
        {category.courses.map((course) => (
          <article key={course.title} className={c.course}>
            <div className={c.cover} style={{ backgroundImage: cover(course.cover) }}>
              <h3 className={c.coverTitle}>{course.title}</h3>
              <p className={c.coverMeta}>{course.videos} videos</p>
            </div>
            <p className={c.sub}>{course.sub}</p>
            <p className={c.meta}>
              {course.time} · updated {course.updated} ago
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Categories({ className }: { className: string }) {
  return (
    <main className={`${className} ${c.page}`}>
      <header className={c.top}>
        <span className={c.logo} aria-hidden />
        <label className={c.search}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M17 17L21 21" stroke="#9A978E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="#9A978E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input type="search" placeholder="Search courses, videos or topics" aria-label="Search" />
        </label>
        <button type="button" className={c.menu} aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 5L20 5" stroke="#1E1E24" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 12L20 12" stroke="#1E1E24" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 19L20 19" stroke="#1E1E24" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <nav className={c.tabs} aria-label="Browse">
        <span className={`${c.tab} ${c.tabOn}`} aria-current="page">Courses</span>
        <span className={c.tab}>Videos</span>
        <span className={c.tab}>Saved</span>
      </nav>

      <section className={c.heading}>
        <h1>pick a course, press play</h1>
        <p>Every course is a set of short videos. Scroll the subjects, swipe to see what&apos;s in each.</p>
      </section>

      {CATEGORIES.map((category) => <Row key={category.name} category={category} />)}
    </main>
  );
}
