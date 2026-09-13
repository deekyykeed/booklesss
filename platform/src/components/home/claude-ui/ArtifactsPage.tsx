"use client";

import { useState } from "react";
import { HugeIcon } from "@/components/icons/huge";

/* ------------------------------------------------------------------ *
 * ARTIFACTS — the reference's `.art-grid`, transcribed verbatim. The
 * All/Yours/Shared tabs only toggle their own active state in the source
 * too — it never filters the grid — so the same is true here.
 * ------------------------------------------------------------------ */

const ARTIFACTS: { title: string; ago: string; private?: boolean }[] = [
  {
    title: "Step 2.1 · Working Capital & Liquidity Management — Booklesss",
    ago: "Edited 2 months ago",
    private: true,
  },
  { title: "Background Remover", ago: "Edited 2 months ago" },
  {
    title:
      "Factors Influencing AI-Powered Learning Technology Adoption Among Accounting and Finance Students in Zambian Higher Education",
    ago: "Edited 2 months ago",
  },
  {
    title: "HYTORC Industrial Bolting: Zambia Cold Call Sales Reference Guide",
    ago: "Edited 3 months ago",
  },
  { title: "Background Remover", ago: "Edited 4 months ago" },
  {
    title: "Building Booklesss Student Onboarding in Slack Workflow Builder",
    ago: "Edited 6 months ago",
  },
  {
    title: "Innovation & Entrepreneurship Course - Simplified Learning Plan",
    ago: "Edited 10 months ago",
  },
  {
    title: "Innovation & Entrepreneurship 2.0 Course Structure",
    ago: "Edited 10 months ago",
  },
  { title: "The Philosophy of Simple Design", ago: "Edited 10 months ago" },
];

const TABS = ["All", "Yours", "Shared with you"];

export function ArtifactsPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="proj-page">
      <div className="proj-head tight">
        <h1 className="proj-title">Artifacts</h1>
        <div className="proj-actions">
          <button className="btn-sec is-icon" aria-label="Search artifacts">
            <HugeIcon name="search" className="i" />
          </button>
          <button className="btn-pri">New artifact</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={"tab" + (i === tab ? " is-active" : "")}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="art-grid">
        {ARTIFACTS.map((a, i) => (
          <li className="art-wrap" key={i}>
            <div className="art-card">
              <a className="art-link" href="#" aria-label={a.title} />
              <div className="art-preview" />
              <div className="art-divider" />
              <div className="art-foot">
                <div className="art-title">{a.title}</div>
                <div className="art-meta">
                  {a.private && (
                    <>
                      <HugeIcon name="lock" className="i i-12" />
                      <span>&middot;</span>
                    </>
                  )}
                  <span>{a.ago}</span>
                </div>
              </div>
            </div>
            <button className="art-menu" aria-label="More options">
              <HugeIcon name="dots" className="i" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
