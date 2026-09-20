"use client";

import { HugeIcon } from "@/components/icons/huge";
import { PROJECTS } from "@/lib/projects";
import { ProjectCard } from "./ProjectDetail";

/* ------------------------------------------------------------------ *
 * PROJECTS — the reference's own grid (proj.png), one card style, one list.
 * A hand-drawn folder pair sat here from 2026-09-13 to 2026-09-20; the owner
 * called both "designs that don't work" and asked for the cards that
 * actually shipped with the UI back. See git history if either is ever
 * wanted again — ProjectCard in ./ProjectDetail is the replacement.
 * ------------------------------------------------------------------ */

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
          <ProjectCard p={p} key={p.title} />
        ))}
      </ul>
    </div>
  );
}
