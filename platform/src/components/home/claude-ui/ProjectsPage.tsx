"use client";

import { HugeIcon } from "@/components/icons/huge";

/* ------------------------------------------------------------------ *
 * PROJECTS — the reference's `.proj-page`, transcribed verbatim (card
 * titles, dates and descriptions included). What the "Projects" sidebar row
 * has always been meant to open; it just went to `href="#"` until this
 * round of the reference landed. Not wired to Booklesss — same rule as the
 * rest of this tree, see ClaudeUI.tsx.
 * ------------------------------------------------------------------ */

const PROJECTS: { title: string; desc?: string; date: string }[] = [
  { title: "Content", date: "Mar 10" },
  { title: "Khadzika Operations", date: "Mar 6" },
  { title: "Corporate Finance", date: "Mar 2" },
  { title: "Strategic Management", date: "Mar 2" },
  {
    title: "Dissertation",
    desc: "To write a complete dissertation paper with the topic “An examination of factors influencing the adoption of AI-powered learning technologies among accounting students”",
    date: "Feb 24",
  },
  {
    title: "Booklesss",
    desc: "An online community of students who want to find ways of making school a lot easier and more engaging. These are people who have recognized that the current system is not working for them.",
    date: "Feb 2",
  },
  { title: "Career", date: "Jan 5" },
  { title: "Farm", date: "Dec 23, 2025" },
  { title: "IA Course", date: "Dec 15, 2025" },
  { title: "Innovation & Entrepreneurship", date: "Nov 29, 2025" },
];

export function ProjectsPage() {
  return (
    <div className="proj-page">
      <div className="proj-head">
        <h1 className="proj-title">Projects</h1>
        <div className="proj-actions">
          <button className="btn-sec is-icon" aria-label="Search projects">
            <HugeIcon name="search" className="i" />
          </button>
          <button className="btn-sec">
            <span className="muted">Sort by</span>
            <span>Last updated</span>
            <HugeIcon name="chevron-down" className="i i-16" />
          </button>
          <button className="btn-pri">New project</button>
        </div>
      </div>

      <ul className="cards">
        {PROJECTS.map((p) => (
          <li className="card-wrap" key={p.title}>
            <a className="card" href="#">
              <div className="card-title">{p.title}</div>
              {p.desc && <div className="card-desc">{p.desc}</div>}
              <div className="card-date">
                <time>{p.date}</time>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
