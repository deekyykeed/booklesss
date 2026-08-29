"use client";

import { useState } from "react";
import { HugeIcon, type HugeIconName } from "@/components/icons/huge";

/* ------------------------------------------------------------------ *
 * The reference settings dialog, reproduced.
 *
 * Not an adaptation: this is the dialog the owner sent, section for section
 * and label for label, built to the measurements they read off its computed
 * styles. It lives on its own route the same way `/workspace` does — a replica
 * to look at, not the app's own settings, which are still the sheet behind the
 * profile picture.
 *
 * EVERY number here is the measured spec. Do not "improve" one without a new
 * measurement to replace it.
 *
 *   dialog     671 × 536, 16px from the viewport, max-width 960, white,
 *              12px radius, layered shadow (a 1px border-like ring plus two
 *              soft drops) instead of a border
 *   base       14px / 20px, INK
 *   h2         22px / 28px, weight 580
 *   close      8px radius, transparent, no border
 *   tabs       14px / 20px, weight 500, padding 0 12px.
 *              Active INK, inactive MUTED. No pill, no underline.
 *   h3         15px / 20px, weight 580
 *   labels     14px / 20px, weight 400, 12px vertical padding
 *   input      14px / weight 400, 8px radius, rgba(255,255,255,.5),
 *              padding 0 12px, no border stroke
 *   textarea   same, padding 8px 12px, 613 × 88
 *   helpers    14px / weight 400, MUTED
 *   links      14px / weight 400, MUTED, 2px radius, no underline
 *   toggles    36 × 20, 2px padding, pill, track ACCENT when on
 *
 * Three colours do all of it: INK primary, MUTED de-emphasised, ACCENT only
 * for a toggle that is on. Backgrounds are white or transparent; fields use a
 * translucent white overlay rather than a solid grey.
 *
 * The one substitution: the typeface is Anthropic Sans, which we do not have.
 * The app's own sans sits in the same slot of the same fallback stack
 * (system-ui / Segoe UI / Roboto / Helvetica / Arial), so it takes its place.
 * ------------------------------------------------------------------ */

const INK = "rgb(11,11,11)";
const MUTED = "rgb(137,135,129)";
const ACCENT = "rgb(42,120,214)";
/** "No visible border stroke" is literal, but a half-transparent white field on
 *  a white panel cannot be found. A 1px inset ring, the same device the spec
 *  describes for the dialog's own edge. */
const RING = "inset 0 0 0 1px rgba(11,11,11,0.10)";

const TABS = [
  "General",
  "Account",
  "Privacy",
  "Billing",
  "Usage",
  "Capabilities",
  "Claude Code",
  "Cowork",
  "Claude in Chrome",
  "Skills",
  "Connectors",
  "Plugins",
];

const NOTIFICATIONS: { id: string; label: string; note: string; on: boolean }[] = [
  {
    id: "responses",
    label: "Response completions",
    note: "Get notified when Claude has finished a response. Useful for long-running tasks.",
    on: true,
  },
  {
    id: "code",
    label: "Code notifications",
    note: "Claude can choose to notify you about important updates from a Code session.",
    on: true,
  },
  {
    id: "permissions",
    label: "Code permission requests",
    note: "Get a push notification when Claude needs your approval to run a command in a Code session.",
    on: true,
  },
  {
    id: "emails",
    label: "Emails from Claude Code on the web",
    note: "Get an email when Claude Code on the web has finished building or needs your response.",
    on: false,
  },
  {
    id: "dispatch",
    label: "Dispatch messages",
    note: "Get a push notification on your phone when Claude messages you in Dispatch.",
    on: true,
  },
];

export function ReferenceSettings() {
  const [tab, setTab] = useState("General");
  const [fullName, setFullName] = useState("Deeky Mvula");
  const [callYou, setCallYou] = useState("Deeky");
  const [instructions, setInstructions] = useState("");
  const [appearance, setAppearance] = useState("system");
  const [motion, setMotion] = useState("System");
  const [switches, setSwitches] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.on])),
  );

  return (
    /* 16px from the viewport on every side, per the spec's measured offset. */
    <div className="min-h-dvh bg-[#f4f3ef] p-4">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="ref-settings-title"
        className="mx-auto flex w-full flex-col overflow-hidden rounded-[12px] bg-white"
        style={{
          width: 671,
          maxWidth: "min(960px, 100%)",
          height: 536,
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          lineHeight: "20px",
          color: INK,
          boxShadow:
            "0 0 0 1px rgba(11,11,11,0.06), 0 8px 24px -8px rgba(0,0,0,0.10), 0 24px 48px -12px rgba(0,0,0,0.16)",
        }}
      >
        {/* Header: title, close, tab list. Fixed; only the panel scrolls. */}
        <div className="shrink-0 px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <h2 id="ref-settings-title" style={{ fontSize: 22, fontWeight: 580, lineHeight: "28px", color: INK }}>
              Settings
            </h2>
            <button
              type="button"
              aria-label="Close settings"
              className="grid h-7 w-7 place-items-center rounded-[8px] border-0 bg-transparent transition-colors hover:bg-[rgba(11,11,11,0.05)]"
              style={{ color: INK }}
            >
              <HugeIcon name="x" size={18} strokeWidth={1.6} />
            </button>
          </div>

          {/* Twelve tabs on one line. They scroll sideways rather than wrap:
              wrapping would move the whole panel every time one is added. */}
          <div role="tablist" className="no-scrollbar mt-3 flex overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="shrink-0 whitespace-nowrap border-0 bg-transparent transition-colors"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  padding: "0 12px",
                  color: tab === t ? INK : MUTED,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-2">
          {tab === "General" ? (
            <>
              <H3>Profile</H3>

              <Row label="Avatar">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full"
                  style={{ background: "rgb(122,166,214)" }}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3h5v5h5v5H3V3Z" fill="rgba(255,255,255,0.85)" />
                  </svg>
                </span>
              </Row>

              <Row label="Full name">
                <Input value={fullName} onChange={setFullName} label="Full name" />
              </Row>

              <Row label="What should Claude call you?">
                <Input value={callYou} onChange={setCallYou} label="What should Claude call you?" />
              </Row>

              <Row label="What best describes your work?">
                <Select value="Finance" label="What best describes your work?" />
              </Row>

              {/* Label, helper with two inline links, then the field beneath —
                  the one row in the dialog whose control is full width. */}
              <div className="py-3">
                <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: INK }}>
                  Instructions for Claude
                </div>
                <p className="mt-1" style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: MUTED }}>
                  Claude will keep these in mind across chats and Cowork within{" "}
                  <Link>Anthropic’s guidelines</Link>. <Link>Learn more</Link>
                </p>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. keep explanations brief and to the point"
                  aria-label="Instructions for Claude"
                  className="mt-2 w-full resize-none rounded-[8px] border-0 outline-none"
                  style={{
                    height: 88,
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: INK,
                    background: "rgba(255,255,255,0.5)",
                    padding: "8px 12px",
                    boxShadow: RING,
                  }}
                />
              </div>

              <H3>Preferences</H3>

              <Row label="Appearance">
                <IconSegmented
                  value={appearance}
                  onChange={setAppearance}
                  label="Appearance"
                  options={[
                    { id: "system", icon: "monitor", label: "System" },
                    { id: "light", icon: "sun", label: "Light" },
                    { id: "dark", icon: "moon", label: "Dark" },
                  ]}
                />
              </Row>

              <Row label="Chat font">
                <Select value="Anthropic Serif" label="Chat font" />
              </Row>

              <Row
                label="Motion"
                note="Reduce animation in streaming responses and other interface elements."
              >
                <Segmented value={motion} onChange={setMotion} options={["System", "Reduced"]} label="Motion" />
              </Row>

              <H3>Voice</H3>

              <Row label="Language">
                <Select value="English" label="Language" />
              </Row>
              <Row label="Style">
                <Select value="Mellow" label="Style" />
              </Row>
              <Row label="Speed">
                <Select value="Normal" label="Speed" />
              </Row>

              <H3>Notifications</H3>

              {NOTIFICATIONS.map((n) => (
                <Row key={n.id} label={n.label} note={n.note} divider>
                  <Toggle
                    on={switches[n.id]}
                    onChange={(v) => setSwitches((s) => ({ ...s, [n.id]: v }))}
                    label={n.label}
                  />
                </Row>
              ))}
            </>
          ) : (
            <p className="pt-6" style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: MUTED }}>
              {tab} is not part of the reference that was captured.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Section heading. 15px / 580 / 20px. */
function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1 mt-6" style={{ fontSize: 15, fontWeight: 580, lineHeight: "20px", color: INK }}>
      {children}
    </h3>
  );
}

/** Inline link: MUTED like the helper text it sits in, 2px radius, no underline. */
function Link({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="rounded-[2px] no-underline"
      style={{ fontSize: 14, fontWeight: 400, color: MUTED }}
    >
      {children}
    </a>
  );
}

/**
 * A field row: label left, control right, 12px of padding above and below.
 *
 * `divider` draws the hairline between notification rows, which is the only
 * place the reference rules its rows off.
 */
function Row({
  label,
  note,
  divider,
  children,
}: {
  label: string;
  note?: string;
  divider?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3"
      style={divider ? { borderBottom: "1px solid rgba(11,11,11,0.07)" } : undefined}
    >
      <div className="min-w-0 flex-1">
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: INK }}>{label}</div>
        {note && (
          <p className="mt-1" style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: MUTED }}>
            {note}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/** Single-line field: 8px radius, translucent white, padding 0 12px. */
function Input({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-9 rounded-[8px] border-0 outline-none"
      style={{
        width: 260,
        maxWidth: "100%",
        fontSize: 14,
        fontWeight: 400,
        color: INK,
        background: "rgba(255,255,255,0.5)",
        padding: "0 12px",
        boxShadow: RING,
      }}
    />
  );
}

/** A combobox: the value in INK with a MUTED chevron, no box around it. */
function Select({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex items-center gap-1.5 rounded-[8px] border-0 bg-transparent px-1.5 py-1 transition-colors hover:bg-[rgba(11,11,11,0.04)]"
    >
      <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: INK }}>{value}</span>
      <span style={{ color: MUTED }}>
        <HugeIcon name="chevron-down" size={16} />
      </span>
    </button>
  );
}

/** Two words, one chosen. A white pill over a faint track. */
function Segmented({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[8px] p-[2px]" style={{ background: "rgba(11,11,11,0.05)" }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className="rounded-[6px] border-0 px-3 py-1.5 transition-colors"
            style={{
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
              color: on ? INK : MUTED,
              background: on ? "rgb(255,255,255)" : "transparent",
              boxShadow: on ? "0 1px 2px rgba(11,11,11,0.10)" : "none",
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/** The same control drawn as three icons — system, light, dark. */
function IconSegmented({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; icon: HugeIconName; label: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[8px] p-[2px]" style={{ background: "rgba(11,11,11,0.05)" }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={o.label}
            title={o.label}
            onClick={() => onChange(o.id)}
            className="grid h-7 w-9 place-items-center rounded-[6px] border-0 transition-colors"
            style={{
              color: on ? INK : MUTED,
              background: on ? "rgb(255,255,255)" : "transparent",
              boxShadow: on ? "0 1px 2px rgba(11,11,11,0.10)" : "none",
            }}
          >
            <HugeIcon name={o.icon} size={16} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}

/** 36 × 20, 2px padding, pill, ACCENT track when on. */
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="block shrink-0 rounded-full border-0 transition-colors"
      style={{ width: 36, height: 20, padding: 2, background: on ? ACCENT : "rgba(11,11,11,0.18)" }}
    >
      <span
        className="block rounded-full bg-white transition-transform"
        style={{ width: 16, height: 16, transform: on ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}
