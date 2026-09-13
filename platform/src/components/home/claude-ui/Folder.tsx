"use client";

import { HugeIcon } from "@/components/icons/huge";
import type { Project } from "@/lib/projects";

/* ------------------------------------------------------------------ *
 * THE TWO FOLDERS, off the owner's two reference shots.
 *
 * ⚠️ BOTH REFERENCES USE THE SAME SILHOUETTE, AND IT IS THE WHOLE POINT OF
 * THE DRAWING: a tab on the LEFT that stands taller than the body, a smooth
 * S-curve stepping down off its right shoulder, then the body's own top edge
 * running level to the right corner. A first pass drew the tab as a small
 * rounded rectangle sitting on top of a box — which is a box with a box on
 * it, not a folder. What makes a folder read as a folder is that one curve,
 * so it is drawn as a real path here rather than approximated.
 *
 * The dark tile is a fixed-size SVG, so the path can be exact. The stat
 * card's back has to stretch to whatever width its column is, so it is CSS
 * instead (see `.fcard-tab` in globals.css) — a tab of fixed width with the
 * same shoulder cut as a radial-gradient fillet, which keeps the curve
 * undistorted at any card width where a stretched SVG would smear it.
 * ------------------------------------------------------------------ */

/** The dark folder, drawn once: back with the tab, two sheets, front flap. */
function FolderGlyph() {
  return (
    <svg className="fglyph" viewBox="0 0 104 86" aria-hidden="true" focusable="false">
      {/* The back carries the tab — the only piece with the silhouette. The
          shoulder is one cubic from the tab's top edge down to the body's,
          which is the curve both references share. */}
      <path
        className="fglyph-back"
        d="M0 19a9 9 0 0 1 9-9h38c9 0 10 12 20 12h28a9 9 0 0 1 9 9v46a9 9 0 0 1-9 9H9a9 9 0 0 1-9-9Z"
      />
      {/* Sheets, mid-folder: they sit between the back and the front, so the
          front's top edge crops them and only their heads show. Rotated a
          couple of degrees apart — parallel sheets read as one printed block,
          not as paper.

          ⚠️ THEY PEEK, THEY DO NOT STICK OUT. A first pass had them rising a
          quarter of the folder's height and cropped low, which made the tile
          read as paper with a folder under it rather than a folder with
          something in it — and it buried the tab, which is the whole
          silhouette. They clear the body's top edge by about a sixth of the
          folder's height now, which is what the reference does. */}
      <g className="fglyph-paper">
        <rect x="40" y="12" width="29" height="24" rx="3" transform="rotate(-7 54 24)" />
        <rect x="56" y="10" width="29" height="26" rx="3" transform="rotate(7 70 23)" />
      </g>
      {/* The front flap: no tab, its own shade, and the thing that makes the
          folder look open rather than like a filled rectangle. Its top edge is
          what crops the sheets, so it sits just under the back's own top
          edge — drop it lower and the folder gapes. */}
      <path
        className="fglyph-front"
        d="M0 36a9 9 0 0 1 9-9h86a9 9 0 0 1 9 9v41a9 9 0 0 1-9 9H9a9 9 0 0 1-9-9Z"
      />
    </svg>
  );
}

function Badges({ badges }: { badges: Project["badges"] }) {
  return (
    <>
      <span className="ftile-badge ftile-badge-a">
        <HugeIcon name={badges[0]} className="i" />
      </span>
      <span className="ftile-badge ftile-badge-b">
        <HugeIcon name={badges[1]} className="i" />
      </span>
    </>
  );
}

/* ---- style 1 — the stat-panel folder -------------------------------- */
export function StatFolderCard({ p }: { p: Project }) {
  return (
    <li className="fcard-wrap">
      <a className="fcard" href="#">
        {/* The grey leaf behind the white panel: a full-height rounded rect
            peeking a few px proud of it, plus the tab standing above. */}
        <span className="fcard-back" aria-hidden="true" />
        <span className="fcard-tab" aria-hidden="true" />
        <span className="fcard-panel">
          <span className="fcard-head">
            <HugeIcon name="folder" className="i" />
            <span className="fcard-title">{p.title}</span>
          </span>
          {/* Pushed to the foot of the panel, as the reference has them —
              the gap under the title is what gives the card its air. */}
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

/* ---- style 2 — the dark folder tile --------------------------------- */
export function DarkFolderTile({ p }: { p: Project }) {
  return (
    <li className="ftile-wrap">
      <a className="ftile" href="#">
        <span className="ftile-folder">
          <FolderGlyph />
          <Badges badges={p.badges} />
        </span>
        <span className="ftile-title">{p.title}</span>
        <span className="ftile-meta">{p.files} Files</span>
      </a>
    </li>
  );
}
