"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Section } from "@/lib/course";
import { useReaderShell } from "./MobileNav";
import { useFollow } from "./useFollow";

/* ---- geometry, mirroring the left sidebar's resize model ---- */
const RIGHTBAR_MIN = 240;
const RIGHTBAR_MAX = 480;
const RIGHTBAR_DEFAULT = 300;
const RIGHTBAR_KEY = "booklesss:rightbar-w";

const clampW = (w: number) => Math.min(RIGHTBAR_MAX, Math.max(RIGHTBAR_MIN, w));

/* Both the panel and the content's right padding read --rightbar-w, so writing
 * that one variable resizes them in lockstep. Written straight to the DOM during
 * a drag — re-rendering on every pointermove would drop frames. */
const applyWidth = (w: number) =>
  document.documentElement.style.setProperty("--rightbar-w", `${w}px`);

/* Flags the drag affordance on :root; the content surface reads it and darkens
 * its own right border so the moving edge highlights instead of a stray line. */
const setResizeHint = (on: boolean) =>
  document.documentElement.toggleAttribute("data-resize-hint-right", on);

const useIso = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/* ---- TOC rail geometry, kept identical to the sidebar / old OnThisPage ---- */
const RAIL = 2;
const BAR = 3;
const BAR_H = 16;
const GUTTER = 15.5;
const BAR_X = (RAIL - BAR) / 2;
const PAD = BAR_X + BAR + GUTTER;
const ROW_H = 30;
const RAIL_INSET = (ROW_H - BAR_H) / 2;

/* "On this page" — the current step's sections, with scroll-spy and an animated
 * active bar riding the same rail language as the left nav. Fed by the shell
 * (published by the lesson route) so this persistent panel needn't know the
 * lesson. Picking a section smooth-scrolls the content; on mobile it also lets
 * the drawer slide back. */
function TableOfContents({ sections }: { sections: Section[] }) {
  const { close } = useReaderShell();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const m = useFollow([activeId, sections], () => ({ container: listRef.current, active: activeRef.current }));

  // scroll-spy — observes the content sections by id (same document).
  useEffect(() => {
    if (!sections.length) return;
    setActiveId(sections[0].id);
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = sections.find((s) => visible.has(s.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: "-72px 0px -68% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  const go = useCallback(
    (id: string) => {
      setActiveId(id);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.matchMedia("(max-width: 767px)").matches) window.setTimeout(close, 280);
    },
    [close],
  );

  return (
    <div ref={listRef} className="relative">
      <span
        className="rail pointer-events-none absolute left-0 rounded-full"
        style={{ width: RAIL, top: RAIL_INSET, bottom: RAIL_INSET }}
      />
      <span
        className="step-bar pointer-events-none absolute"
        style={{
          left: BAR_X,
          width: BAR,
          top: m.top + (m.height - BAR_H) / 2,
          height: BAR_H,
          opacity: m.visible ? 1 : 0,
          transition: "top 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 160ms ease",
        }}
      />
      <p
        className="mb-2 text-[11px] font-medium uppercase tracking-[0.09em] text-[#9a9aa2]"
        style={{ paddingLeft: PAD }}
      >
        On this page
      </p>
      {sections.map((s) => {
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            ref={active ? activeRef : undefined}
            type="button"
            onClick={() => go(s.id)}
            style={{ paddingLeft: PAD, minHeight: ROW_H }}
            className={
              "flex w-full items-center py-1 pr-2 text-left text-[13px] font-medium transition-colors " +
              (active ? "text-ink" : "text-[#8a8a92] hover:text-ink")
            }
          >
            {s.heading}
          </button>
        );
      })}
    </div>
  );
}

/* Solar · Broken · panel-collapse glyph — points the way the panel will go. */
function PanelIcon({ dir }: { dir: "close" | "open" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 4v16" stroke="currentColor" strokeWidth="1.6" />
      <path
        d={dir === "close" ? "m8 9.5 2.5 2.5L8 14.5" : "m10.5 9.5-2.5 2.5 2.5 2.5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Solar, hand-inlined (not via <Icon>, which would pull the whole Solar JSON
 * into this client bundle). Line at rest; bold once active (voice mode on / a
 * message ready to send). Send is a round-arrow-up. */
function SendArrow({ size = 20, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10m-13.53-.47a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0l3 3a.75.75 0 1 1-1.06 1.06l-1.72-1.72V16a.75.75 0 0 1-1.5 0V9.81l-1.72 1.72a.75.75 0 0 1-1.06 0" />
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V8m0 0l3 3m-3-3l-3 3" />
        </g>
      )}
    </svg>
  );
}
/* Plus — the attach-style square on the left of the toolbar. Here it starts a
 * fresh conversation rather than attaching a file (nothing to attach yet). */
function PlusIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function MicIcon({ size = 20, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <>
          <path fill="currentColor" d="M12 2a5.75 5.75 0 0 0-5.75 5.75v3a5.75 5.75 0 0 0 11.452.75H13a.75.75 0 0 1 0-1.5h4.75V8.5H13A.75.75 0 0 1 13 7h4.701A5.75 5.75 0 0 0 12 2" />
          <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M4 9a.75.75 0 0 1 .75.75v1a7.25 7.25 0 1 0 14.5 0v-1a.75.75 0 0 1 1.5 0v1a8.75 8.75 0 0 1-8 8.718v2.282a.75.75 0 0 1-1.5 0v-2.282a8.75 8.75 0 0 1-8-8.718v-1A.75.75 0 0 1 4 9" />
        </>
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 8a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0z" />
          <path strokeLinecap="round" d="M13 8h4m-4 3h4m3-1v1a8 8 0 1 1-16 0v-1m8 9v3" />
        </g>
      )}
    </svg>
  );
}

type ChatMessage = { id: number; text: string };

/* Whether a question is about the open step or the whole course. */
type AskScope = "step" | "course";
const SCOPE_KEY = "booklesss:ask-scope";

/* The messages you've sent, above the composer. No AI backend yet, so these are
 * your own turns only — the composer captures input and is ready to wire to a
 * tutor endpoint later. */
function ChatThread({ messages }: { messages: ChatMessage[] }) {
  if (!messages.length) return null;
  return (
    <div className="mt-6 flex flex-col gap-2 border-t border-line pt-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className="squircle max-w-[85%] self-end rounded-2xl bg-active px-3 py-2 text-[13px] leading-5 text-ink"
          data-no-swipe
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}

/* Composer pinned to the panel's bottom: message on top, a control row beneath —
 * new-chat, the scope segmented control, then voice and send. Enter inserts a
 * newline (send is the button only); the field auto-grows. In voice mode the mic
 * drives coloured glow blobs behind the card, scaled by live loudness, so the
 * card lights up as you speak. Blob colours are randomised each session.
 * data-no-swipe so a drag while typing never yanks the drawer.
 * The card's construction (nested radii, two-layer shadow, compact step-down)
 * lives in globals.css under "AI composer". */
function ChatComposer({
  value,
  onChange,
  onSubmit,
  voiceOn,
  onToggleVoice,
  scope,
  onScopeChange,
  onNewChat,
  canReset,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  voiceOn: boolean;
  onToggleVoice: () => void;
  scope: AskScope;
  onScopeChange: (s: AskScope) => void;
  onNewChat: () => void;
  canReset: boolean;
}) {
  const canSend = value.trim().length > 0;
  const taRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-grow with the content, capped so the composer never eats the panel.
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 132) + "px";
  }, [value]);

  // Voice mode: capture the mic and write smoothed loudness to --voice on the
  // form (the glow blobs + border ring read it). Randomise the blob colours each
  // time voice mode switches on. No mic / denied permission just leaves it dark.
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const clear = () => {
      el.style.setProperty("--von", "0");
      el.style.setProperty("--voice", "0");
    };
    if (!voiceOn) {
      clear();
      return;
    }

    const palette = [
      "168 85 247", "59 130 246", "45 212 191", "236 72 153",
      "251 146 60", "52 211 153", "129 140 248", "244 63 94",
    ];
    const shuffled = [...palette].sort(() => Math.random() - 0.5);
    el.style.setProperty("--g1", shuffled[0]);
    el.style.setProperty("--g2", shuffled[1]);
    el.style.setProperty("--g3", shuffled[2]);
    el.style.setProperty("--von", "1");
    el.style.setProperty("--voice", "0");

    let raf = 0;
    let stream: MediaStream | null = null;
    let audio: AudioContext | null = null;
    let cancelled = false;
    let level = 0;

    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        audio = new AudioContext();
        const source = audio.createMediaStreamSource(s);
        const analyser = audio.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length); // ~0..0.4 while speaking
          const target = Math.min(1, rms * 4);
          level += (target - level) * 0.25; // smooth so it isn't jittery
          el.style.setProperty("--voice", level.toFixed(3));
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {
        /* no mic / permission denied — no glow */
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      audio?.close().catch(() => {});
      clear();
    };
  }, [voiceOn]);

  const label = scope === "step" ? "this step" : "this course";

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="voice-host composer-host relative shrink-0"
      data-no-swipe
    >
      {/* Coloured glow behind the card; each blob's opacity scales with --voice. */}
      <div aria-hidden="true" className="voice-glow pointer-events-none absolute inset-0">
        <span />
        <span />
        <span />
      </div>
      <div className="composer-shell relative">
        <div className="composer-card squircle">
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={1}
            placeholder={`Ask about ${label}…`}
            aria-label={`Ask about ${label}`}
            style={{ maxHeight: 132 }}
            className="composer-input no-scrollbar"
          />
          <div className="composer-tools">
            <button
              type="button"
              onClick={onNewChat}
              disabled={!canReset}
              aria-label="New chat"
              title="New chat"
              className="composer-attach squircle"
            >
              <PlusIcon />
            </button>

            {/* What the answer is allowed to draw on. No backend yet, so this
                only sets the placeholder — but it is real state, persisted, and
                the value a tutor endpoint will need on day one. */}
            <div
              role="group"
              aria-label="Answer scope"
              data-active={scope}
              className="seg-track squircle"
            >
              <span aria-hidden="true" className="seg-thumb squircle" />
              {(["step", "course"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onScopeChange(s)}
                  aria-pressed={scope === s}
                  data-on={scope === s ? "" : undefined}
                  className="seg-pill squircle"
                >
                  {s === "step" ? "Step" : "Course"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggleVoice}
              aria-pressed={voiceOn}
              aria-label={voiceOn ? "Turn off voice mode" : "Turn on voice mode"}
              title="Voice mode"
              data-on={voiceOn ? "" : undefined}
              className="composer-icon squircle ml-auto"
            >
              <MicIcon active={voiceOn} />
            </button>
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send"
              data-on={canSend ? "" : undefined}
              className="composer-icon squircle"
            >
              <SendArrow active={canSend} />
            </button>
          </div>
        </div>
        <p className="mt-1.5 hidden px-1 text-[10.5px] text-placeholder xl:block">
          {voiceOn ? "Voice mode on — coming soon" : "AI tutor — coming soon"}
        </p>
      </div>
    </form>
  );
}

export function RightPanel() {
  const { rightCollapsed, toggleRightCollapsed, sections } = useReaderShell();

  /* ---------------- resize ---------------- */
  const widthRef = useRef(RIGHTBAR_DEFAULT);
  const [width, setWidth] = useState(RIGHTBAR_DEFAULT); // mirrors the ref for aria only
  const draggingRef = useRef(false);

  // Restore before paint so a customised width doesn't flash at the default.
  useIso(() => {
    let saved = NaN;
    try { saved = Number(localStorage.getItem(RIGHTBAR_KEY)); } catch { /* private mode */ }
    if (!Number.isFinite(saved) || saved <= 0) return;
    const w = clampW(saved);
    widthRef.current = w;
    applyWidth(w);
    setWidth(w);
  }, []);

  const commit = (w: number) => {
    widthRef.current = w;
    applyWidth(w);
    setWidth(w);
    try { localStorage.setItem(RIGHTBAR_KEY, String(w)); } catch { /* ignore */ }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = widthRef.current;

    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    draggingRef.current = true;
    setResizeHint(true);

    // Handle is on the LEFT edge: dragging left (clientX shrinks) widens it.
    const move = (ev: PointerEvent) => {
      const w = clampW(startW - (ev.clientX - startX));
      widthRef.current = w;
      applyWidth(w);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
      draggingRef.current = false;
      setResizeHint(!!e.currentTarget && (e.currentTarget as HTMLElement).matches(":hover"));
      commit(widthRef.current);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 24 : 8;
    // Mirror: ArrowLeft grows (edge moves left), ArrowRight shrinks.
    if (e.key === "ArrowLeft") commit(clampW(widthRef.current + step));
    else if (e.key === "ArrowRight") commit(clampW(widthRef.current - step));
    else if (e.key === "Home") commit(clampW(RIGHTBAR_DEFAULT));
    else return;
    e.preventDefault();
  };

  /* ---------------- chat (no backend yet) ---------------- */
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceOn, setVoiceOn] = useState(false);
  const [scope, setScope] = useState<AskScope>("step");
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: nextId.current++, text }]);
    setDraft("");
  };
  const newChat = () => {
    setMessages([]);
    setDraft("");
  };

  // Scope survives reloads — it is a preference, not per-conversation state.
  // Restored before paint (same as the width above) so the thumb never starts
  // on Step and jumps.
  useIso(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(SCOPE_KEY); } catch { /* private mode */ }
    if (saved === "step" || saved === "course") setScope(saved);
  }, []);
  const pickScope = (s: AskScope) => {
    setScope(s);
    try { localStorage.setItem(SCOPE_KEY, s); } catch { /* ignore */ }
  };
  // Keep the newest message in view once it's added.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <>
      {/* Reopen affordance — only when collapsed, desktop only (mobile uses the
          drawer). Pinned to the right edge just below the header. */}
      {rightCollapsed && (
        <button
          type="button"
          onClick={toggleRightCollapsed}
          aria-label="Open step context"
          title="Open step context"
          className="squircle fixed right-3 top-16 z-40 hidden h-8 w-8 place-items-center rounded-lg border border-line bg-white/80 text-muted shadow-sm backdrop-blur-md transition-colors hover:text-ink xl:grid"
        >
          <PanelIcon dir="open" />
        </button>
      )}

      <aside
        className="rightbar-panel fixed right-0 top-12 z-40 flex h-[calc(100dvh-48px)] flex-col border-l border-line"
        style={{ width: "var(--rightbar-w)" }}
        data-collapsed={rightCollapsed ? "" : undefined}
      >
        {/* Drag to resize — sits over the left border, 8px wide; double-click
            restores the default width. Desktop only. */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize step context panel"
          aria-valuenow={width}
          aria-valuemin={RIGHTBAR_MIN}
          aria-valuemax={RIGHTBAR_MAX}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onKeyDown={onHandleKeyDown}
          onDoubleClick={() => commit(clampW(RIGHTBAR_DEFAULT))}
          title="Drag to resize — double-click to reset"
          onPointerEnter={() => setResizeHint(true)}
          onPointerLeave={() => { if (!draggingRef.current) setResizeHint(false); }}
          onFocus={() => setResizeHint(true)}
          onBlur={() => setResizeHint(false)}
          className="absolute inset-y-0 -left-1 z-30 hidden w-2 cursor-col-resize focus:outline-none xl:block"
        />

        {/* Header row — collapse control. Mirrors the left panel's footer button
            placement but at the top, on the side nearest its edge. */}
        <div className="flex h-11 shrink-0 items-center justify-between px-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-muted">Step</span>
          <button
            type="button"
            onClick={toggleRightCollapsed}
            aria-label="Collapse step context"
            title="Collapse"
            className="squircle hidden h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-active hover:text-ink xl:grid"
          >
            <PanelIcon dir="close" />
          </button>
        </div>

        {/* Scroll area: the TOC up top, then your chat turns (the AI answer
            surface will grow here once wired). */}
        <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
          {sections && sections.length > 0 ? (
            <TableOfContents sections={sections} />
          ) : (
            <p className="px-1 pt-1 text-[13px] text-placeholder">No sections</p>
          )}
          <ChatThread messages={messages} />
        </div>

        <ChatComposer
          value={draft}
          onChange={setDraft}
          onSubmit={sendMessage}
          voiceOn={voiceOn}
          onToggleVoice={() => setVoiceOn((v) => !v)}
          scope={scope}
          onScopeChange={pickScope}
          onNewChat={newChat}
          canReset={messages.length > 0 || draft.length > 0}
        />
      </aside>
    </>
  );
}
