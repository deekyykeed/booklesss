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
/* Streamline · Plump Free · "Email Attachment Document" — attach, on the left of
 * the toolbar. Remix at rest, Solid once something is attached, mirroring the
 * line→bold switch on the mic and send. Drawn on a 48px grid, so unlike the
 * Solar glyphs it carries a 48 viewBox. Licensed CC BY 4.0. */
function ClipIcon({ size = 20, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {active ? (
        <>
          <path
            fill="currentColor"
            d="M46.5002 23c0 -2.0183 -0.0244 -3.8472 -0.0663 -5.5001 -0.7035 0.0006 -1.592 -0.0017 -2.5598 -0.0115 -2.271 -0.0231 -5.043 -0.0882 -6.8667 -0.2631 -3.3331 -0.3197 -5.9245 -2.9765 -6.2457 -6.325 -0.1751 -1.82511 -0.2355 -4.57494 -0.254 -6.82323 -0.008 -0.96246 -0.0083 -1.84503 -0.0061 -2.54211C29.4084 1.5125 28.2422 1.5 27.0003 1.5c-6.3148 0 -10.6741 0.32315 -13.4179 0.63673 -2.8955 0.33091 -5.09374 2.53124 -5.4134 5.43136 -0.20667 1.87505 -0.42036 4.53731 -0.54888 8.16821C8.99483 15.2582 10.471 15 12.0004 15c6.958 0 13 5.4408 13 12.6364v8.7272c0 3.1171 -1.1338 5.9049 -2.9848 8.0637 1.5043 0.0458 3.1632 0.0727 4.9847 0.0727 6.3148 0 10.6741 -0.3232 13.4179 -0.6367 2.8955 -0.3309 5.0938 -2.5313 5.4134 -5.4314 0.3256 -2.9539 0.6686 -7.8613 0.6686 -15.4319Z"
          />
          <path
            fill="currentColor"
            d="M33.5076 4.05228c0.0186 2.25433 0.0794 4.88302 0.2404 6.56152 0.1879 1.9584 1.683 3.4465 3.5458 3.6252 1.68 0.1611 4.3329 0.2264 6.6109 0.2495 0.8024 0.0082 1.5501 0.0111 2.1809 0.0115 -0.5933 -1.3939 -2.033 -3.944 -5.4324 -7.27679 -3.203 -3.1402 -5.694 -4.57146 -7.1526 -5.21 -0.0007 0.59794 0.0008 1.29451 0.007 2.03907Z"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.79155 18.8331C8.33278 17.9821 10.114 17.5 12 17.5c5.6881 0 10.5 4.4299 10.5 10.1364v8.7272C22.5 42.0701 17.6881 46.5 12 46.5c-5.68812 0 -10.5 -4.4299 -10.5 -10.1364V31.596c0 -3.6759 3.08735 -6.4596 6.64815 -6.4596 3.56075 0 6.64815 2.7837 6.64815 6.4596v4.6767c0 1.3807 -1.1193 2.5 -2.5 2.5s-2.5 -1.1193 -2.5 -2.5V31.596c0 -0.6978 -0.62703 -1.4596 -1.64815 -1.4596S6.5 30.8982 6.5 31.596v4.7676C6.5 39.092 8.85156 41.5 12 41.5c3.1484 0 5.5 -2.408 5.5 -5.1364v-8.7272C17.5 24.908 15.1484 22.5 12 22.5c-1.0283 0 -1.9794 0.2617 -2.79155 0.7101 -1.20869 0.6674 -2.72957 0.2286 -3.39698 -0.98 -0.66741 -1.2087 -0.22861 -2.7296 0.98008 -3.397Z"
          />
        </>
      ) : (
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.3026 1.26035C16.2547 1.00752 20.7375 0.75 26.7509 0.75c1.0603 0 2.0729 0.008005 3.038 0.022578 0.8522 0.012869 1.7663 0.165001 2.6472 0.559092 1.69 0.75603 4.9911 2.50485 8.2859 5.79957 3.2013 3.20136 4.943 6.40856 5.7324 8.13716 0.4083 0.8941 0.5705 1.824 0.5886 2.6959 0.0379 1.8197 0.0602 3.8282 0.0602 6.0357 0 7.7465 -0.2744 13.0441 -0.5347 16.3267 -0.2729 3.4418 -2.9256 6.118 -6.3692 6.413 -2.9521 0.2528 -7.4349 0.5103 -13.4484 0.5103 -1.9262 0 -3.6953 -0.0264 -5.3075 -0.0707 -1.1041 -0.0302 -1.9747 -0.9499 -1.9444 -2.054 0.0303 -1.1042 0.95 -1.9747 2.0541 -1.9444 1.5756 0.0432 3.3082 0.0691 5.1978 0.0691 5.8991 0 10.2681 -0.2526 13.107 -0.4958 1.4909 -0.1277 2.6046 -1.2484 2.7231 -2.7437 0.2511 -3.1662 0.5222 -8.3577 0.5222 -16.0105 0 -2.1078 -0.0206 -4.0289 -0.0556 -5.7724 -2.0625 -0.0824 -4.3191 -0.2656 -6.2108 -0.4455 -3.5942 -0.342 -6.4251 -3.1728 -6.7672 -6.7671 -0.1809 -1.90193 -0.3651 -4.17288 -0.4469 -6.24444 -0.9131 -0.01328 -1.8704 -0.02056 -2.8718 -0.02056 -5.8991 0 -10.268 0.25261 -13.1069 0.49576 -1.491 0.12769 -2.6046 1.24842 -2.7232 2.74373 -0.159 2.00526 -0.326 4.82321 -0.4272 8.56451 -0.0298 1.1042 -0.94911 1.9751 -2.05327 1.9453 -1.10417 -0.0299 -1.97508 -0.9492 -1.94523 -2.0533 0.10288 -3.8059 0.27339 -6.69339 0.43824 -8.77265 0.27288 -3.44184 2.92563 -6.11807 6.36926 -6.413ZM10.0996 20.25c-2.58762 0 -4.93783 1.0379 -6.64872 2.7144 -0.98616 0.9664 -1.00222 2.5492 -0.03586 3.5354 0.96636 0.9861 2.5492 1.0022 3.53536 0.0358 0.81418 -0.7978 1.92224 -1.2856 3.14922 -1.2856 2.4853 0 4.5 2.0147 4.5 4.5v8c0 2.4853 -2.0147 4.5 -4.5 4.5 -2.48527 0 -4.49999 -2.0147 -4.49999 -4.5v-3.3704c0 -0.6238 0.50575 -1.1296 1.12963 -1.1296 0.62388 0 1.12963 0.5058 1.12963 1.1296v3.2871c0 1.3807 1.11929 2.5 2.50003 2.5 1.3807 0 2.5 -1.1193 2.5 -2.5v-3.2871c0 -3.3853 -2.7444 -6.1296 -6.12966 -6.1296 -3.3853 0 -6.129631 2.7443 -6.129631 6.1296V37.75c0 5.2467 4.253291 9.5 9.499991 9.5s9.5 -4.2533 9.5 -9.5v-8c0 -5.2467 -4.2533 -9.5 -9.5 -9.5Z"
        />
      )}
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
 * attach on the left, voice and send on the right. Enter inserts a newline (send
 * is the button only); the field auto-grows. In voice mode the mic
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
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  voiceOn: boolean;
  onToggleVoice: () => void;
}) {
  const canSend = value.trim().length > 0;
  const taRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  /* Picked files, listed as chips above the field. Nothing uploads them yet —
   * they ride along with the draft and clear when it sends. */
  const [files, setFiles] = useState<{ id: number; name: string }[]>([]);
  const fileId = useRef(1);

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
          const target = Math.min(1, rms * 7); // gain: ordinary speech should peg the top of the range
          // Fast attack, slow release — the glow jumps on a syllable and eases
          // back down, instead of averaging every sentence into a flat wash.
          level += (target - level) * (target > level ? 0.5 : 0.1);
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

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
        setFiles([]);
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
          {files.length > 0 && (
            <div className="composer-chips">
              {files.map((f) => (
                <span key={f.id} className="composer-chip squircle">
                  <span className="composer-chip-name">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((list) => list.filter((x) => x.id !== f.id))}
                    aria-label={`Remove ${f.name}`}
                    className="composer-chip-x"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={1}
            placeholder="Ask about this step…"
            aria-label="Ask about this step"
            style={{ maxHeight: 132 }}
            className="composer-input no-scrollbar"
          />
          <div className="composer-tools">
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? []).map((f) => ({
                  id: fileId.current++,
                  name: f.name,
                }));
                if (picked.length) setFiles((list) => [...list, ...picked]);
                e.target.value = ""; // so picking the same file twice still fires
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Attach a file"
              title="Attach"
              data-on={files.length > 0 ? "" : undefined}
              className="composer-icon squircle"
            >
              <ClipIcon active={files.length > 0} />
            </button>

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
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: nextId.current++, text }]);
    setDraft("");
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
        />
      </aside>
    </>
  );
}
