"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HugeIcon, type HugeIconName } from "@/components/icons/huge";

/* ------------------------------------------------------------------ *
 * SETTINGS — the reference's "Round 6" modal, transcribed verbatim (every
 * panel, every placeholder value). Not wired to Booklesss, same rule as the
 * rest of this tree: this is the starting point, not a redesign.
 *
 * ⚠️ ON A PHONE THIS IS A CENTERED DIALOG, NOT A DRAWER. Owner, 2026-09-13:
 * no off-canvas/slide-in treatment for settings or anything like it. Below
 * 640px the dialog just shrinks to a small floating card and the desktop
 * left icon-nav is replaced by a horizontal scrollable tab strip across the
 * top — see `.settings-dialog` in globals.css. This is the pattern to reuse
 * for the next overlay like it, not the sidebar's edge-anchored drawer or
 * the resource-pack picker's bottom sheet.
 *
 * Lifecycle (focus return, Escape, both-scroller scroll lock) mirrors
 * ResourcePacks.tsx exactly — same trap, same fix, see the comments there.
 * ------------------------------------------------------------------ */

type PanelId =
  | "general"
  | "account"
  | "privacy"
  | "billing"
  | "usage"
  | "capabilities"
  | "memory"
  | "code"
  | "cowork"
  | "chrome"
  | "skills"
  | "connectors"
  | "plugins";

const PANELS: { id: PanelId; label: string; icon: HugeIconName }[] = [
  { id: "general", label: "General", icon: "cog" },
  { id: "account", label: "Account", icon: "user-circle" },
  { id: "privacy", label: "Privacy", icon: "shield" },
  { id: "billing", label: "Billing", icon: "credit-card" },
  { id: "usage", label: "Usage", icon: "chart-bar" },
  { id: "capabilities", label: "Capabilities", icon: "toolbox" },
  { id: "memory", label: "Memory", icon: "brain" },
  { id: "code", label: "Claude Code", icon: "code" },
  { id: "cowork", label: "Cowork", icon: "rows" },
  { id: "chrome", label: "Claude in Chrome", icon: "globe" },
  { id: "skills", label: "Skills", icon: "file" },
  { id: "connectors", label: "Connectors", icon: "grid" },
  { id: "plugins", label: "Plugins", icon: "puzzle" },
];

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return <input type="checkbox" className="toggle" defaultChecked={defaultChecked} />;
}

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [panel, setPanel] = useState<PanelId>("general");
  const [skillsTab, setSkillsTab] = useState(0);
  const [connectorsTab, setConnectorsTab] = useState(0);
  const [connectorsPill, setConnectorsPill] = useState(0);
  const [pluginsTab, setPluginsTab] = useState(0);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const scBodyRef = useRef<HTMLDivElement | null>(null);
  const mobileTabRef = useRef<HTMLDivElement | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });
    return () => returnTo.current?.focus?.({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const doc = document.documentElement;
    const pane = document.querySelector<HTMLElement>(".cui .pane-scroll");
    const prevDoc = doc.style.overflow;
    const prevPane = pane?.style.overflow ?? "";
    doc.style.overflow = "hidden";
    if (pane) pane.style.overflow = "hidden";
    return () => {
      doc.style.overflow = prevDoc;
      if (pane) pane.style.overflow = prevPane;
    };
  }, [open]);

  const onScrimDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const goPanel = useCallback((id: PanelId) => {
    setPanel(id);
    scBodyRef.current?.scrollTo({ top: 0 });
    /* Keep the tapped tab in view on the horizontal strip — the same reason
       the reference scrolls it into view on switch. */
    requestAnimationFrame(() => {
      mobileTabRef.current
        ?.querySelector(`[data-mtab="${id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }, []);

  if (!open) return null;

  const current = PANELS.find((p) => p.id === panel)!;

  return (
    <div className="settings-overlay" onMouseDown={onScrimDown}>
      <div
        className="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        tabIndex={-1}
        ref={panelRef}
      >
        {/* ---- left nav (desktop) ---- */}
        <nav className="sn">
          <div className="sn-search-wrap">
            <div className="sn-search-field">
              <HugeIcon name="search" className="i i-16" />
              <input type="text" className="sn-search-input" placeholder="Search" aria-label="Search settings" />
            </div>
          </div>
          <div className="sn-scroll">
            <div className="sn-label">Settings</div>
            <ul className="sn-list">
              {PANELS.slice(0, 10).map((p) => (
                <li key={p.id}>
                  <button
                    className={"sn-item" + (panel === p.id ? " is-active" : "")}
                    onClick={() => goPanel(p.id)}
                  >
                    <HugeIcon name={p.icon} className="i i-16" />
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="sn-label">Platform</div>
            <ul className="sn-list">
              <li>
                <a className="sn-item" href="#" aria-label="API keys (opens externally)">
                  <HugeIcon name="key" className="i i-16" />
                  API keys
                  <HugeIcon name="arrow-up-right" className="i i-12 sn-ext-icon" />
                </a>
              </li>
            </ul>
            <div className="sn-label">Customize</div>
            <ul className="sn-list">
              {PANELS.slice(10).map((p) => (
                <li key={p.id}>
                  <button
                    className={"sn-item" + (panel === p.id ? " is-active" : "")}
                    onClick={() => goPanel(p.id)}
                  >
                    <HugeIcon name={p.icon} className="i i-16" />
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ---- right content ---- */}
        <div className="sc">
          {/* mobile-only top bar + horizontal tab strip */}
          <div className="sc-mobile-header">
            <div className="sc-mobile-topbar">
              <span className="sc-mobile-title">Settings</span>
              <button className="sc-mobile-close" onClick={onClose} aria-label="Close settings">
                <HugeIcon name="x" className="i i-16" />
              </button>
            </div>
            <div className="sc-mobile-tabs" ref={mobileTabRef}>
              {PANELS.map((p) => (
                <button
                  key={p.id}
                  className={"sc-mobile-tab" + (panel === p.id ? " is-active" : "")}
                  data-mtab={p.id}
                  onClick={() => goPanel(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* desktop header */}
          <div className="sc-header">
            <span className="sc-header-title">{current.label}</span>
            <span style={{ flex: 1 }} />
            <button className="sc-close" onClick={onClose} aria-label="Close settings">
              <HugeIcon name="x" className="i i-16" />
            </button>
          </div>

          <div className="sc-body" ref={scBodyRef}>
            {panel === "general" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Profile</h3>
                <div className="sc-rows">
                  <div className="sc-row">
                    <span className="sc-row-label">Avatar</span>
                    <div className="sc-avatar">
                      <HugeIcon name="user" size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="sc-row">
                    <span className="sc-row-label">Full name</span>
                    <input className="sc-input" type="text" defaultValue="Deeky Mvula" />
                  </div>
                  <div className="sc-row">
                    <span className="sc-row-label">What should Claude call you?</span>
                    <input className="sc-input" type="text" defaultValue="Deeky" />
                  </div>
                  <div className="sc-row">
                    <span className="sc-row-label">What best describes your work?</span>
                    <button className="sc-select">
                      Finance
                      <HugeIcon name="chevron-down" className="i i-12" />
                    </button>
                  </div>
                </div>
                <div className="sc-field-group">
                  <label className="sc-field-label">Instructions for Claude</label>
                  <p className="sc-field-desc">
                    Claude will keep these in mind for this and any of your associated accounts across chats and
                    Cowork within <a href="#">Anthropic&rsquo;s guidelines</a>. <a href="#">Learn more</a>
                  </p>
                  <textarea className="sc-textarea" placeholder="e.g. I primarily code in Python (not a coding beginner)" />
                </div>
              </div>
            )}

            {panel === "account" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Account</h3>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Log out of all devices</span>
                    </div>
                    <button className="btn-sec" style={{ flexShrink: 0 }}>
                      Log out
                    </button>
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Delete account</span>
                    </div>
                    <button className="btn-danger" disabled>
                      Delete account
                    </button>
                  </div>
                </div>
                <div className="sc-field-group" style={{ marginTop: 20 }}>
                  <label className="sc-field-label">Organization ID</label>
                  <p className="sc-field-desc">Your organization identifier used for API access and billing.</p>
                  <code className="sc-code" style={{ marginTop: 6, display: "inline-block" }}>
                    62e93a2b-f04c-4bb0-920b-2a0a061ccf0e
                  </code>
                </div>
                <div style={{ marginTop: 20 }}>
                  <div className="sc-sub-title">Trusted devices</div>
                  <table className="sc-table" style={{ marginTop: 8 }}>
                    <thead>
                      <tr>
                        <th>Device</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Samsung SM-G991B</td>
                        <td>Aug 27</td>
                      </tr>
                      <tr>
                        <td>Electron &middot; Windows &middot; Lusaka</td>
                        <td>Aug 27</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 20 }}>
                  <div className="sc-sub-title">Active sessions</div>
                  <table className="sc-table" style={{ marginTop: 8 }}>
                    <thead>
                      <tr>
                        <th>Device</th>
                        <th>Location</th>
                        <th>Created</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          Chrome &middot; Windows<span className="sc-badge">Current</span>
                        </td>
                        <td>Lusaka</td>
                        <td>Aug 27</td>
                        <td>just now</td>
                      </tr>
                      <tr>
                        <td>Chrome &middot; Android</td>
                        <td>Lusaka</td>
                        <td>Aug 27</td>
                        <td>1 hr ago</td>
                      </tr>
                      <tr>
                        <td>Electron &middot; Windows</td>
                        <td>Lusaka</td>
                        <td>Aug 27</td>
                        <td>4 hr ago</td>
                      </tr>
                      <tr>
                        <td>Safari &middot; iOS</td>
                        <td>Lusaka</td>
                        <td>Sep 1</td>
                        <td>2 days ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {panel === "privacy" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Privacy</h3>
                <p className="sc-field-desc" style={{ marginBottom: 12 }}>
                  We believe you deserve to know exactly what happens to your data. We&rsquo;re committed to being
                  transparent about what we collect and how we protect it.
                </p>
                <div className="sc-accord-item">
                  <button className="sc-accord-btn">
                    How we protect your data <HugeIcon name="chevron-down" className="i i-16" />
                  </button>
                </div>
                <div className="sc-accord-item">
                  <button className="sc-accord-btn">
                    How we use your data <HugeIcon name="chevron-down" className="i i-16" />
                  </button>
                </div>
                <div className="sc-sub-title" style={{ marginTop: 20 }}>
                  Preferences
                </div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Location metadata</span>
                      <span className="sc-toggle-desc">Allow Claude to use your location to improve responses.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Help improve AI models</span>
                      <span className="sc-toggle-desc">Allow Anthropic to use your conversations to improve Claude.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                </div>
                <div className="sc-sub-title" style={{ marginTop: 20 }}>
                  Your data
                </div>
                <div className="sc-toggle-group">
                  {["Export data", "Shared chats", "Shared artifacts", "Uploaded files", "Your feedback"].map((label) => (
                    <div className="sc-toggle-row" key={label}>
                      <div className="sc-toggle-info">
                        <span className="sc-toggle-label">{label}</span>
                      </div>
                      <button className="btn-sec">{label === "Export data" ? "Export data" : "Manage"}</button>
                    </div>
                  ))}
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Memory preferences</span>
                    </div>
                    <button className="btn-sec">
                      Manage <HugeIcon name="arrow-up-right" className="i i-12" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {panel === "billing" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Billing</h3>
                <div className="sc-billing-head">
                  <div className="sc-billing-logo">A</div>
                  <div>
                    <div className="sc-billing-name">Pro plan</div>
                    <div className="sc-billing-freq">Monthly</div>
                  </div>
                </div>
                <div className="sc-info-box neutral" style={{ marginTop: 12 }}>
                  <HugeIcon name="info-circle" className="i i-16" />
                  <div>
                    <strong style={{ color: "var(--text-100)" }}>Subscribed via Android app</strong>
                    <br />
                    Manage your subscription and view invoices on your Android device.
                  </div>
                </div>
              </div>
            )}

            {panel === "usage" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">
                  Plan usage limits <span className="sc-badge">Pro</span>
                </h3>
                <div className="sc-sub-title" style={{ marginTop: 16 }}>
                  Current session
                </div>
                <div className="sc-progress-wrap">
                  <div className="sc-progress-top">
                    <span className="sc-progress-label">All models</span>
                    <span className="sc-progress-pct">12%</span>
                  </div>
                  <div className="sc-progress-bar">
                    <div className="sc-progress-fill" style={{ width: "12%" }} />
                  </div>
                  <span className="sc-progress-sub">Resets in 4 hr 34 min</span>
                </div>
                <div className="sc-sub-title" style={{ marginTop: 16 }}>
                  Weekly limits
                </div>
                <div className="sc-info-box" style={{ marginBottom: 8 }}>
                  <HugeIcon name="info-circle" className="i i-16" />
                  <div>
                    Boosted limits (50% higher) are available through Sep 13. <a href="#">Learn more about usage limits</a>
                  </div>
                </div>
                <div className="sc-progress-wrap">
                  <div className="sc-progress-top">
                    <span className="sc-progress-label">All models</span>
                    <span className="sc-progress-pct">12%</span>
                  </div>
                  <div className="sc-progress-bar">
                    <div className="sc-progress-fill" style={{ width: "12%" }} />
                  </div>
                  <span className="sc-progress-sub">Resets Wed 10:00 AM</span>
                </div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-300)" }}>Last updated: just now</span>
                  <button style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-300)" }}>
                    <HugeIcon name="refresh" className="i" style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>
            )}

            {panel === "capabilities" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Capabilities</h3>
                <div className="sc-group-label">General</div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Tool access mode</span>
                    </div>
                    <button className="sc-select" style={{ minWidth: 180 }}>
                      Load tools when needed
                      <HugeIcon name="chevron-down" className="i i-12" />
                    </button>
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Connector search</span>
                      <span className="sc-toggle-desc">Allow Claude to search for relevant connectors.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Switch models</span>
                      <span className="sc-toggle-desc">Allow Claude to switch between models mid-conversation.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                </div>
                <div className="sc-group-label">Visuals</div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Artifacts</span>
                      <span className="sc-toggle-desc">Show rich visual outputs like code, documents, and diagrams.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                </div>
                <div className="sc-group-label">Code execution</div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Cloud code execution</span>
                      <span className="sc-toggle-desc">Allow Claude to run code in a secure cloud environment.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Allow network egress</span>
                      <span className="sc-toggle-desc">Allow executed code to make outbound network requests.</span>
                      <div className="sc-sub-card" style={{ marginTop: 8 }}>
                        <span>Domain allowlist</span>
                        <button className="sc-select" style={{ minWidth: 120 }}>
                          All domains
                          <HugeIcon name="chevron-down" className="i i-12" />
                        </button>
                      </div>
                      <div className="sc-info-box neutral" style={{ marginTop: 8 }}>
                        <HugeIcon name="info-circle" className="i i-16" />
                        <span>Requests are logged. Restrict domains to limit exposure.</span>
                      </div>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                </div>
                <div className="sc-group-label">Skills</div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Skills have moved to Customize.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {panel === "memory" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Memory</h3>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Search and reference chats</span>
                      <span className="sc-toggle-desc">Allow Claude to search past conversations to give better answers.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Generate memory from chats</span>
                      <span className="sc-toggle-desc">Automatically extract and store facts about you from conversations.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Include sensitive topics</span>
                      <span className="sc-toggle-desc">Allow memory to include health, relationships, and personal beliefs.</span>
                    </div>
                    <Toggle />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Import memory from other AI providers</span>
                    </div>
                    <button className="btn-sec">Start import</button>
                  </div>
                </div>
                <div className="sc-field-group" style={{ marginTop: 16 }}>
                  <label className="sc-field-label">Edit memory</label>
                  <p className="sc-field-desc">Tell Claude what to change or remove from its memory about you.</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input className="sc-input" type="text" placeholder="Tell Claude what to change or remove" style={{ flex: 1, minWidth: 0 }} />
                    <button className="btn-pri" style={{ flexShrink: 0 }}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {panel === "code" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Claude Code</h3>
                <div className="sc-group-label">General</div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Classify session states</span>
                      <span className="sc-toggle-desc">Let Claude tag sessions by type for better context tracking.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Switch models</span>
                      <span className="sc-toggle-desc">Allow Claude to switch models when the task benefits from it.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                </div>
                <div className="sc-group-label">Code appearance</div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Light theme</span>
                    </div>
                    <button className="sc-select">
                      Claude Light
                      <HugeIcon name="chevron-down" className="i i-12" />
                    </button>
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Dark theme</span>
                    </div>
                    <button className="sc-select">
                      Claude Dark
                      <HugeIcon name="chevron-down" className="i i-12" />
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, margin: "8px 0" }}>
                  <div className="sc-code-preview" style={{ flex: 1, background: "#faf9f5", color: "#2d2d2d" }}>
                    {"// Light preview"}
                    <br />
                    <span style={{ color: "#7c3aed" }}>function</span> hello() {"{"} <span style={{ color: "#2a78d6" }}>return</span>{" "}
                    <span style={{ color: "#16a34a" }}>&apos;world&apos;</span> {"}"}
                  </div>
                  <div className="sc-code-preview" style={{ flex: 1, background: "#1a1a1a", color: "#d4d4d4" }}>
                    {"// Dark preview"}
                    <br />
                    <span style={{ color: "#c084fc" }}>function</span> hello() {"{"} <span style={{ color: "#60a5fa" }}>return</span>{" "}
                    <span style={{ color: "#4ade80" }}>&apos;world&apos;</span> {"}"}
                  </div>
                </div>
                <div className="sc-group-label">Pull requests</div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Branch prefix</span>
                    </div>
                    <input className="sc-input" type="text" defaultValue="claude" style={{ minWidth: 120 }} />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Create pull requests automatically</span>
                      <span className="sc-toggle-desc">Push a PR when Claude finishes a task on a branch.</span>
                      <div className="sc-sub-card">
                        <div className="sc-toggle-info">
                          <span className="sc-toggle-label" style={{ fontSize: 13 }}>
                            Create as draft
                          </span>
                        </div>
                        <Toggle defaultChecked />
                      </div>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Auto-fix pull requests</span>
                      <span className="sc-toggle-desc">Let Claude respond to review feedback automatically.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {panel === "cowork" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Cowork</h3>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Require trusted devices</span>
                      <span className="sc-toggle-desc">Only allow Cowork tasks on devices you&rsquo;ve verified.</span>
                    </div>
                    <Toggle />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Only on your computer</span>
                      <span className="sc-toggle-desc">Restrict Cowork tasks to your local machine only.</span>
                    </div>
                    <Toggle />
                  </div>
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Preferred browser</span>
                    </div>
                    <button className="sc-select">
                      Chrome (Claude in Chrome)
                      <HugeIcon name="chevron-down" className="i i-12" />
                    </button>
                  </div>
                </div>
                <div className="sc-field-group" style={{ marginTop: 16 }}>
                  <label className="sc-field-label">Global instructions</label>
                  <p className="sc-field-desc">Instructions Claude follows for all Cowork tasks, unless overridden by a project or task.</p>
                  <button className="btn-sec" style={{ marginTop: 8 }}>
                    Edit
                  </button>
                </div>
              </div>
            )}

            {panel === "chrome" && (
              <div className="sc-panel is-active">
                <div className="sc-chrome-head">
                  <div className="sc-chrome-icon">
                    <svg viewBox="0 0 40 40" style={{ width: 40, height: 40 }}>
                      <circle cx="20" cy="20" r="10" fill="#fff" />
                      <path d="M20 10h17a20 20 0 0 1 0 20z" fill="#ea4335" />
                      <path d="M37 30A20 20 0 0 1 3 30L12 14z" fill="#fbbc04" />
                      <path d="M3 30A20 20 0 0 1 20 0v10a10 10 0 0 0 0 20z" fill="#34a853" />
                      <circle cx="20" cy="20" r="6" fill="#4285f4" />
                    </svg>
                  </div>
                  <div className="sc-chrome-title">Claude in Chrome settings</div>
                </div>
                <div className="sc-toggle-group">
                  <div className="sc-toggle-row">
                    <div className="sc-toggle-info">
                      <span className="sc-toggle-label">Enable Claude in Chrome</span>
                      <span className="sc-toggle-desc">Show the Claude side panel in Chrome for any site.</span>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                </div>
                <div className="sc-sub-title" style={{ marginTop: 16 }}>
                  Site permissions
                </div>
                <p className="sc-field-desc" style={{ marginBottom: 10 }}>
                  Control which sites Claude can read and interact with.
                </p>
                <div className="sc-toggle-row" style={{ borderTop: ".667px solid var(--border)" }}>
                  <div className="sc-toggle-info">
                    <span className="sc-toggle-label">Default for all sites</span>
                  </div>
                  <button className="sc-select">
                    Allow all sites
                    <HugeIcon name="chevron-down" className="i i-12" />
                  </button>
                </div>
                <div className="sc-info-box neutral" style={{ marginTop: 8, marginBottom: 12 }}>
                  <HugeIcon name="info-circle" className="i i-16" />
                  <span>Site-specific settings override the default. Add blocked sites below.</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-100)" }}>Blocked sites</span>
                  <button className="btn-sec" style={{ height: 28, fontSize: 13 }}>
                    + Add websites
                  </button>
                </div>
                <table className="sc-table">
                  <thead>
                    <tr>
                      <th>Domain</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "var(--text-300)", fontStyle: "italic" }}>No sites added yet.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {panel === "skills" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Skills</h3>
                <div className="sc-search-row">
                  <div className="sc-search-field">
                    <HugeIcon name="search" className="i i-16" style={{ flexShrink: 0, color: "var(--text-300)" }} />
                    <input type="text" placeholder="Search skills and plugins" />
                  </div>
                  <button className="btn-pri">
                    Add <HugeIcon name="chevron-down" className="i i-12" />
                  </button>
                </div>
                <div className="sc-tabs">
                  <button className={"sc-tab" + (skillsTab === 0 ? " is-active" : "")} onClick={() => setSkillsTab(0)}>
                    Your skills
                  </button>
                  <button className={"sc-tab" + (skillsTab === 1 ? " is-active" : "")} onClick={() => setSkillsTab(1)}>
                    Discover
                  </button>
                </div>
                <div className="sc-group-label">Created by you &middot; 7</div>
                <div className="sc-item-list">
                  {["framer-setup", "wrap-session", "step-skill", "academic-synthesizer-style", "khadzika-quotations", "cold-email-copywriting"].map(
                    (name) => (
                      <div className="sc-item-row" key={name}>
                        <div className="sc-item-icon">
                          <HugeIcon name="file" className="i i-16" />
                        </div>
                        <div className="sc-item-body">
                          <div className="sc-item-name">{name}</div>
                          {name === "academic-synthesizer-style" && (
                            <div className="sc-item-meta">
                              <span className="sc-badge warn">Disabled</span>
                            </div>
                          )}
                        </div>
                        <div className="sc-item-actions">
                          {name === "academic-synthesizer-style" && (
                            <button className="btn-sec" style={{ height: 28, fontSize: 12 }}>
                              Turn on
                            </button>
                          )}
                          <button className="btn-sec" style={{ height: 28, fontSize: 12 }}>
                            &middot;&middot;&middot;
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {panel === "connectors" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Connectors</h3>
                <div className="sc-search-row">
                  <div className="sc-search-field">
                    <HugeIcon name="search" className="i i-16" style={{ flexShrink: 0, color: "var(--text-300)" }} />
                    <input type="text" placeholder="Search connectors" />
                  </div>
                  <button className="btn-pri">Add</button>
                </div>
                <div className="sc-tabs">
                  <button className={"sc-tab" + (connectorsTab === 0 ? " is-active" : "")} onClick={() => setConnectorsTab(0)}>
                    Your connectors
                  </button>
                  <button className={"sc-tab" + (connectorsTab === 1 ? " is-active" : "")} onClick={() => setConnectorsTab(1)}>
                    Discover
                  </button>
                </div>
                <div className="sc-pills">
                  {["All", "Connected", "Not connected"].map((label, i) => (
                    <button
                      key={label}
                      className={"sc-pill" + (connectorsPill === i ? " is-active" : "")}
                      onClick={() => setConnectorsPill(i)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="sc-item-list">
                  {[
                    { name: "Anthropic Economic Index", ok: true },
                    { name: "Attio", ok: false },
                    { name: "Canva", ok: true },
                    { name: "Clerk", ok: true },
                    { name: "ClickUp", ok: true },
                    { name: "ElevenLabs", ok: false, custom: true },
                    { name: "Facebook Ads MCP", ok: false, custom: true },
                  ].map((c) => (
                    <div className="sc-item-row" key={c.name}>
                      <div className="sc-item-icon">
                        <HugeIcon name="grid" className="i i-16" />
                      </div>
                      <div className="sc-item-body">
                        <div className="sc-item-name">{c.name}</div>
                        <div className="sc-item-desc">{c.custom ? "Web · Custom" : "Web"}</div>
                      </div>
                      <div className="sc-item-actions">
                        {c.ok ? (
                          <HugeIcon name="check" className="i i-16 sc-conn-ok" />
                        ) : (
                          <>
                            <HugeIcon name="danger-triangle" className="i i-16 sc-conn-warn" />
                            <button className="btn-sec" style={{ height: 28, fontSize: 12 }}>
                              Reconnect
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {panel === "plugins" && (
              <div className="sc-panel is-active">
                <h3 className="sc-section-title">Plugins</h3>
                <div className="sc-search-row">
                  <div className="sc-search-field">
                    <HugeIcon name="search" className="i i-16" style={{ flexShrink: 0, color: "var(--text-300)" }} />
                    <input type="text" placeholder="Search plugins" />
                  </div>
                  <button className="btn-pri">
                    Add <HugeIcon name="chevron-down" className="i i-12" />
                  </button>
                </div>
                <div className="sc-tabs">
                  <button className={"sc-tab" + (pluginsTab === 0 ? " is-active" : "")} onClick={() => setPluginsTab(0)}>
                    Your plugins
                  </button>
                  <button className={"sc-tab" + (pluginsTab === 1 ? " is-active" : "")} onClick={() => setPluginsTab(1)}>
                    Discover
                  </button>
                </div>
                <div className="sc-group-label">From Anthropic &amp; Partners &middot; 1</div>
                <div className="sc-item-list">
                  <div className="sc-item-row">
                    <div className="sc-item-icon" style={{ background: "#d97757", color: "#fff" }}>
                      <HugeIcon name="puzzle" className="i i-16" />
                    </div>
                    <div className="sc-item-body">
                      <div className="sc-item-name">Small Business</div>
                      <div className="sc-item-meta" style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
                        <span className="sc-badge">Operations</span>
                        <span className="sc-badge" style={{ background: "rgba(11,11,11,.06)", color: "var(--text-200)" }}>
                          +7
                        </span>
                      </div>
                      <div className="sc-item-desc" style={{ marginTop: 4 }}>
                        from Anthropic &middot; Pre-built small business workflows&hellip;
                      </div>
                      <div className="sc-item-desc">3d ago</div>
                    </div>
                    <div className="sc-item-actions">
                      <button className="btn-sec" style={{ height: 28, fontSize: 12 }}>
                        &middot;&middot;&middot;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
