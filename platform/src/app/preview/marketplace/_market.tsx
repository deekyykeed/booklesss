"use client";

import { useState } from "react";
import m from "./marketplace.module.css";

type Subject = "Finance" | "Business" | "Economics" | "Accounting";

type Course = {
  title: [string, string];
  sub: string;
  subject: Subject;
  verified: boolean;
  videos: number;
  time: string;
  students: number;
  /** front, middle, back: the three preview videos, as gradients until there are stills */
  covers: [string, string, string];
};

const g = (a: string, b: string, c?: string) =>
  c ? `linear-gradient(170deg, ${a} 0%, ${b} 55%, ${c} 100%)` : `linear-gradient(170deg, ${a} 0%, ${b} 100%)`;

const COURSES: Course[] = [
  { title: ["Corporate", "Finance"], sub: "Valuation, capital and risk.", subject: "Finance", verified: true, videos: 45, time: "6h 20m", students: 28, covers: [g("#2F5A3E", "#1C3826", "#0F2016"), g("#A23A1C", "#5E1A0E"), g("#3A6390", "#1C3456")] },
  { title: ["Treasury", "Management"], sub: "Cash, funding and risk.", subject: "Finance", verified: true, videos: 52, time: "7h 05m", students: 19, covers: [g("#2E4A7A", "#1B2D52", "#101A33"), g("#C9A55A", "#7A5A22"), g("#2E5560", "#132A30")] },
  { title: ["Strategic", "Management"], sub: "How firms compete.", subject: "Business", verified: true, videos: 38, time: "4h 50m", students: 41, covers: [g("#8E2A22", "#5E1A12", "#3A0E08"), g("#262E44", "#151A28"), g("#C0533C", "#7A2A1C")] },
  { title: ["Principles of", "Economics"], sub: "Markets, prices and policy.", subject: "Economics", verified: true, videos: 64, time: "8h 15m", students: 57, covers: [g("#8BA36A", "#5E7A46", "#3F5630"), g("#A23A1C", "#5E1A0E"), g("#2E5560", "#132A30")] },
  { title: ["Business", "Administration"], sub: "How organisations are run.", subject: "Business", verified: false, videos: 31, time: "3h 40m", students: 12, covers: [g("#5B3A5E", "#3E2541", "#24142A"), g("#D8C39A", "#A8895A"), g("#28402F", "#14241A")] },
  { title: ["Financial", "Accounting"], sub: "Records and statements.", subject: "Accounting", verified: false, videos: 27, time: "3h 10m", students: 9, covers: [g("#3A6390", "#264870", "#1C3456"), g("#B33A33", "#7A1F1C"), g("#2F5A3E", "#0F2016")] },
];

const SUBJECTS: ("All" | Subject)[] = ["All", "Finance", "Business", "Economics", "Accounting"];

/* Solar Bold, filled in the stat grey; paths straight from @iconify-json/solar */
const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
  </svg>
);
const Clock = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75" />
  </svg>
);
const User = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="6" r="4" />
    <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5" />
  </svg>
);
const Verified = () => (
  <svg className={m.badge} viewBox="0 0 24 24" role="img" aria-label="Verified course">
    <circle cx="12" cy="12" r="6.5" fill="#fff" />
    <path
      fill="#1D9BF0"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
    />
  </svg>
);
const Chevron = () => (
  <svg className={m.chev} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function CourseCard({ c }: { c: Course }) {
  return (
    <article className={m.card}>
      <div className={m.stack} aria-hidden>
        <span className={m.back} style={{ backgroundImage: c.covers[2] }} />
        <span className={m.mid} style={{ backgroundImage: c.covers[1] }} />
        <span className={m.front} style={{ backgroundImage: c.covers[0] }} />
      </div>
      <div className={m.text}>
        <div className={m.heading}>
          <h3 className={m.title}>
            {c.title[0]}
            <br />
            <span className={m.last}>
              {c.title[1]}
              {c.verified && <Verified />}
            </span>
          </h3>
          <p className={m.sub}>{c.sub}</p>
        </div>
        <div className={m.stats}>
          <div className={m.pair}>
            <span className={m.stat} title="Videos"><Play />{c.videos}</span>
            <span className={m.stat} title="Total time"><Clock />{c.time}</span>
          </div>
          <span className={m.stat} title="Students"><User />{c.students}</span>
        </div>
      </div>
    </article>
  );
}

export function Marketplace({ className }: { className: string }) {
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("All");
  const shown = subject === "All" ? COURSES : COURSES.filter((c) => c.subject === subject);

  return (
    <main className={`${className} ${m.page}`}>
      <div className={m.wrap}>
        <header className={m.top}>
          <div className={m.left}>
            <span className={m.logo} aria-hidden />
            <label className={m.search}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M17 17L21 21" stroke="#3A3A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 11C19 6.582 15.418 3 11 3C6.582 3 3 6.582 3 11C3 15.418 6.582 19 11 19C15.418 19 19 15.418 19 11Z" stroke="#3A3A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input type="search" placeholder="Search courses, videos, topics ..." aria-label="Search" />
            </label>
          </div>
          <div className={m.right}>
            <span className={m.avatar} aria-hidden />
            <span className={m.name}>Alexander Mark</span>
            <button type="button" className={m.bell} aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" stroke="#1F1F24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.231 18H4.769C3.792 18 3 17.208 3 16.231C3 15.762 3.186 15.312 3.518 14.98L4.121 14.377C4.684 13.815 5 13.051 5 12.256V9.5C5 5.634 8.134 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.256C19 13.051 19.316 13.815 19.879 14.377L20.482 14.98C20.814 15.312 21 15.762 21 16.231C21 17.208 20.208 18 19.231 18Z" stroke="#1F1F24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </header>

        <section className={m.hero}>
          <div className={m.heroText}>
            <h1 className={m.headline}>Find your next course</h1>
            <p className={m.intro}>
              Every course is a stack of short videos made from its own material. Filter by subject or length, then press play.
            </p>
          </div>
          <p className={m.count}>
            <b>{String(shown.length).padStart(2, "0")}</b> courses
          </p>
        </section>

        <div className={m.filters}>
          <div className={m.subjects} role="group" aria-label="Subject">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                type="button"
                className={`${m.chip} ${s === subject ? m.on : ""}`}
                aria-pressed={s === subject}
                onClick={() => setSubject(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className={m.refine}>
            <button type="button" className={m.chip}>Any length <Chevron /></button>
            <button type="button" className={m.chip}>Most watched <Chevron /></button>
          </div>
        </div>

        <div className={m.grid}>
          {shown.map((c) => <CourseCard key={c.title.join(" ")} c={c} />)}
        </div>
      </div>
    </main>
  );
}
