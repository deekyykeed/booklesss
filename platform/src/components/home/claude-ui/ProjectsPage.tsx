"use client";

import { HugeIcon, type HugeIconName } from "@/components/icons/huge";

/* ------------------------------------------------------------------ *
 * PROJECTS, AS FOLDERS (2026-09-13) — owner, looking at this page's own mock
 * data (Corporate Finance, Strategic Management, Booklesss…): "this is what
 * I'm seeing if [these] can be projects — a collection of course files and
 * all." Restyled as folders off two reference screenshots: the first four
 * cards carry the file-count/storage/last-updated stat panel, the rest a
 * plain dark folder tile with small file-type badges peeking out of it —
 * "just need the way the folders are done, copy as they are." Content and
 * routing are unchanged; this is a repaint of the same ten mock projects.
 * ------------------------------------------------------------------ */

type Project = {
  title: string;
  files: number;
  storage: string;
  updated: string;
  badges: [HugeIconName, HugeIconName];
};

const PROJECTS: Project[] = [
  { title: "Content", files: 23, storage: "656MB", updated: "2 days ago", badges: ["file", "pdf"] },
  { title: "Khadzika Operations", files: 41, storage: "1.2GB", updated: "6 days ago", badges: ["pdf", "file"] },
  { title: "Corporate Finance", files: 26, storage: "310MB", updated: "1 week ago", badges: ["file", "pdf"] },
  { title: "Strategic Management", files: 8, storage: "94MB", updated: "1 week ago", badges: ["pdf", "file"] },
  { title: "Dissertation", files: 14, storage: "48MB", updated: "3 weeks ago", badges: ["file", "pdf"] },
  { title: "Booklesss", files: 60, storage: "2.1GB", updated: "1 month ago", badges: ["pdf", "file"] },
  { title: "Career", files: 5, storage: "12MB", updated: "2 months ago", badges: ["file", "pdf"] },
  { title: "Farm", files: 3, storage: "8MB", updated: "3 months ago", badges: ["pdf", "file"] },
  { title: "IA Course", files: 19, storage: "220MB", updated: "3 months ago", badges: ["file", "pdf"] },
  { title: "Innovation & Entrepreneurship", files: 11, storage: "36MB", updated: "4 months ago", badges: ["pdf", "file"] },
];

/* ---- style 1 — the stat-panel folder (first four) ------------------- */
function StatFolderCard({ p }: { p: Project }) {
  return (
    <li className="fcard-wrap">
      <a className="fcard" href="#">
        <span className="fcard-tab" aria-hidden="true" />
        <span className="fcard-panel">
          <span className="fcard-head">
            <HugeIcon name="folder" className="i" />
            <span className="fcard-title">{p.title}</span>
          </span>
          <span className="fcard-stats">
            <span className="fcard-stat">
              <span className="fcard-stat-label">
                <HugeIcon name="file" className="i i-16" />
                Files
              </span>
              <span className="fcard-leader" aria-hidden="true" />
              <span className="fcard-stat-value">{p.files}</span>
            </span>
            <span className="fcard-stat">
              <span className="fcard-stat-label">
                <HugeIcon name="hard-drive" className="i i-16" />
                Storage
              </span>
              <span className="fcard-leader" aria-hidden="true" />
              <span className="fcard-stat-value">{p.storage}</span>
            </span>
            <span className="fcard-stat">
              <span className="fcard-stat-label">
                <HugeIcon name="clock-1" className="i i-16" />
                Last updated
              </span>
              <span className="fcard-leader" aria-hidden="true" />
              <span className="fcard-stat-value">{p.updated}</span>
            </span>
          </span>
        </span>
      </a>
    </li>
  );
}

/* ---- style 2 — the dark folder tile (the rest) ----------------------- */
function DarkFolderTile({ p }: { p: Project }) {
  return (
    <li className="ftile-wrap">
      <a className="ftile" href="#">
        <span className="ftile-folder" aria-hidden="true">
          <span className="ftile-back" />
          <span className="ftile-front" />
          <span className="ftile-badge ftile-badge-a">
            <HugeIcon name={p.badges[0]} className="i i-16" />
          </span>
          <span className="ftile-badge ftile-badge-b">
            <HugeIcon name={p.badges[1]} className="i i-16" />
          </span>
        </span>
        <span className="ftile-title">{p.title}</span>
        <span className="ftile-meta">{p.files} Files</span>
      </a>
    </li>
  );
}

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

      <ul className="cards">
        {first.map((p) => (
          <StatFolderCard p={p} key={p.title} />
        ))}
        {rest.map((p) => (
          <DarkFolderTile p={p} key={p.title} />
        ))}
      </ul>
    </div>
  );
}
