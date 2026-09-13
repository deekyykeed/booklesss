"use client";

import { HugeIcon } from "@/components/icons/huge";
import { PROJECTS } from "@/lib/projects";
import { StatFolderCard, DarkFolderTile } from "./Folder";

/* ------------------------------------------------------------------ *
 * PROJECTS, AS FOLDERS — owner, looking at this page's own mock data
 * (Corporate Finance, Strategic Management, Booklesss…): "this is what I'm
 * seeing if [these] can be projects — a collection of course files and all."
 *
 * ⚠️ TWO GRIDS, NOT ONE MIXED GRID. The two card styles have very different
 * natural widths, and in a single auto-fill grid the column count is set by
 * whichever minimum is smaller — so the four stat cards would spill into a
 * row of tiles at most widths and each row's height would be set by whatever
 * tall card happened to land in it. Separate lists let each style keep its
 * own column rhythm.
 * ------------------------------------------------------------------ */

export function ProjectsPage() {
  const first = PROJECTS.slice(0, 4);
  const rest = PROJECTS.slice(4);

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

      <ul className="cards cards-stat">
        {first.map((p) => (
          <StatFolderCard p={p} key={p.title} />
        ))}
      </ul>

      <ul className="cards cards-tile">
        {rest.map((p) => (
          <DarkFolderTile p={p} key={p.title} />
        ))}
      </ul>
    </div>
  );
}
