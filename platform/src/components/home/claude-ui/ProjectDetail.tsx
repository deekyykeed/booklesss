"use client";

import { useState } from "react";
import { HugeIcon, type HugeIconName } from "@/components/icons/huge";
import type { Project } from "@/lib/projects";

/* ------------------------------------------------------------------ *
 * A PROJECT, OPENED — owner, 2026-09-19, off ten screenshots of the real
 * Claude app's own Projects flow: tap a project card on the home screen
 * and it opens into this — memory, knowledge (files), custom instructions,
 * and the chats that live inside it. Mock, like the rest of `.cui`: no
 * upload, no real chat history, nothing wired to Booklesss yet.
 *
 * These render inside `.center`, the same 40rem column as the greeting and
 * composer above `ClaudeUI` swaps them in for — not a separate page, so the
 * composer dock never unmounts going in or out. See the state machine and
 * the "why" comment in ClaudeUI.tsx.
 *
 * ⚠️ THE REFERENCE'S "Add Content to Project" IS A BOTTOM SHEET. This one is
 * a centered dialog instead — the owner's standing rule from 2026-09-13 (no
 * mobile-drawer treatment for a modal on this surface; see Settings and the
 * resource-pack picker) outranks matching this one screenshot exactly.
 *
 * ⚠️ TWO OF THE REFERENCE'S FOUR "ADD CONTENT" ROWS ARE DROPPED, NOT
 * MISLABELED. "Take picture" and "Choose image" need a camera/photo glyph
 * this codebase's generated Hugeicons set does not carry yet (only the icons
 * already pulled into `huge.tsx` are usable without a `npm run gen:icons`
 * pass this environment can't run). Two honest rows beat four where two wear
 * a nearby icon standing in for a different noun.
 * ------------------------------------------------------------------ */

/** The home screen's project card — the `.art-card` shape (now squircled,
 *  see globals.css), reused for real `Project` data instead of Artifacts'
 *  chat titles. Same trap this codebase avoids everywhere else: one card
 *  component so the home slice and any future full list can't disagree. */
export function ProjectHomeCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <li className="art-wrap">
      <div className="art-card">
        <button className="art-link" aria-label={`Open ${p.title}`} onClick={onOpen} />
        <div className="art-preview" />
        <div className="art-divider" />
        <div className="art-foot">
          <div className="art-title">{p.title}</div>
          <div className="art-meta">
            <span>{p.files} files</span>
            <span>&middot;</span>
            <span>{p.updated}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ProjectOverview({
  project,
  onOpenKnowledge,
  onOpenInstructions,
  onNewChat,
}: {
  project: Project;
  onOpenKnowledge: () => void;
  onOpenInstructions: () => void;
  onNewChat: () => void;
}) {
  return (
    <div className="pd-overview">
      <h1 className="pd-title">{project.title}</h1>

      <span className="pd-private">
        <HugeIcon name="lock" className="i i-16" />
        Private
      </span>

      <div className="pd-memory">Project memory will appear after a few chats.</div>

      <div className="pd-two-up">
        <button className="pd-info-card" onClick={onOpenKnowledge}>
          <span className="pd-info-label">Project knowledge</span>
          <span className="pd-info-action">{project.files} files</span>
        </button>
        <button className="pd-info-card" onClick={onOpenInstructions}>
          <span className="pd-info-label">Custom instructions</span>
          <span className="pd-info-action">Add instructions</span>
        </button>
      </div>

      <div className="pd-chats">
        <div className="pd-chats-head">
          <span className="pd-chats-title">Chats</span>
          <button className="btn-sec" onClick={onNewChat}>
            <HugeIcon name="plus" className="i i-16" />
            New chat
          </button>
        </div>
        <div className="pd-chats-empty">
          <HugeIcon name="message-dots" className="i pd-chats-icon" />
          <p>Ask Claude anything. Chats in this project will show up here.</p>
        </div>
      </div>
    </div>
  );
}

export function ProjectKnowledge({ project }: { project: Project }) {
  const [addOpen, setAddOpen] = useState(false);
  const pct = Math.min(99, Math.round((project.files / 60) * 6));

  return (
    <div className="pd-knowledge">
      <div className="pd-capacity">
        <div className="pd-capacity-track">
          <div className="pd-capacity-fill" style={{ width: `${Math.max(pct, 2)}%` }} />
        </div>
        <span className="pd-capacity-label">{pct}% of project capacity used</span>
      </div>

      <ul className="pd-file-grid">
        {Array.from({ length: Math.min(project.files, 6) }).map((_, i) => (
          <li className="pd-file" key={i}>
            <span className="pd-file-badge">PDF</span>
            <button className="pd-file-menu" aria-label="File options">
              <HugeIcon name="dots" className="i i-16" />
            </button>
          </li>
        ))}
      </ul>

      <button className="pd-add-content" onClick={() => setAddOpen(true)}>
        <HugeIcon name="file" className="i i-16" />
        Add Content
      </button>

      {addOpen && <AddContentDialog onClose={() => setAddOpen(false)} />}
    </div>
  );
}

function AddContentDialog({ onClose }: { onClose: () => void }) {
  const rows: { icon: HugeIconName; label: string }[] = [
    { icon: "arrow-up", label: "Upload from device" },
    { icon: "edit", label: "Create new document" },
  ];

  return (
    <div
      className="rp-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* The `.rp-*` classes are ResourcePacks' — same centered-dialog panel,
          same icon-slot row, reused rather than re-declared. */}
      <div
        className="rp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Add content to project"
      >
        <div className="rp-head">
          <div className="rp-heading">
            <h2 className="rp-title">Add Content to Project</h2>
            <p className="rp-sub">Upload files or create new text content</p>
          </div>
          <button className="cbtn" onClick={onClose} aria-label="Close">
            <HugeIcon name="x" className="i" />
          </button>
        </div>
        <div className="rp-list">
          {rows.map((r) => (
            <button className="rp-row" key={r.label}>
              <span className="rp-slot" aria-hidden="true">
                <HugeIcon name={r.icon} className="i" />
              </span>
              <span className="rp-text">
                <span className="rp-name">{r.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CustomInstructionsModal({
  open,
  project,
  onClose,
}: {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}) {
  if (!open || !project) return null;

  return (
    <div
      className="rp-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="rp-panel pd-inst-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Set custom instructions"
      >
        <div className="pd-inst-body">
          <h2 className="rp-title">Set custom instructions</h2>
          <p className="rp-sub">
            Instruct Claude how to behave and respond within {project.title}
          </p>
          <textarea
            className="pd-inst-input"
            placeholder="Instruct Claude with prompts like: Use a professional tone, Use concise and simple wording, You are an expert in Astrophysics, etc."
          />
        </div>
        <div className="rp-foot">
          <span className="rp-tally" aria-hidden="true" />
          <button className="btn-sec" onClick={onClose}>
            Cancel
          </button>
          <button className="rp-done" onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
