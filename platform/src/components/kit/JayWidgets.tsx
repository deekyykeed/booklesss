"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { GlassButton, HappyFolder, PlusMark, Surface, useCountUp } from "./primitives";
import { squircleClip } from "./squircle";

/* The Jay tiles' corner, measured off the reference: radius 62.5 at smoothing
 * 0.8 (1x). Every tile in the set shares it, tall or short. */
const TILE_R = 62.5;
const TILE_S = 0.8;

/* The Jay widget set, live. Each widget is the Paper board "Widgets — Jay set
 * (1:1)" at half size, plus what a still frame cannot show: the stepper
 * rolls, the clock runs, the brief cycles, the folder menu opens and renames,
 * the counters count, the nudge types itself. The copy is the reference's own
 * (owner, 2026-10-18: build them "exactly as they come"). */

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/* ---------------------------------------------------------------- 1 · book a call */

const MINUTES = [15, 30, 45, 60, 90];

export function BookCall() {
  const [i, setI] = useState(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [booked, setBooked] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const step = (d: 1 | -1) => {
    setDir(d);
    setBooked(false);
    setI((v) => Math.min(MINUTES.length - 1, Math.max(0, v + d)));
  };
  const book = () => {
    setBooked(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBooked(false), 2200);
  };

  return (
    <div className="kit-tile kit-call">
      <Surface w={563} h={168.5} r={TILE_R} s={TILE_S} />
      <div className="kit-call-value" aria-live="polite">
        <span key={MINUTES[i]} className="kit-call-num" data-dir={dir}>
          {MINUTES[i]}
        </span>
        <span className="kit-call-unit">mins</span>
      </div>
      <div className="kit-stepper">
        <button type="button" aria-label="Longer call" disabled={i === MINUTES.length - 1} onClick={() => step(1)}>
          <HugeIcon name="arrow-up" size={38} strokeWidth={1.85} />
        </button>
        <button type="button" aria-label="Shorter call" disabled={i === 0} onClick={() => step(-1)}>
          <HugeIcon name="chevron-down" size={38} strokeWidth={1.85} />
        </button>
      </div>
      <GlassButton onClick={book}>
        <span key={booked ? "booked" : "book"} className="kit-gbtn-label" data-swap={booked ? "" : undefined}>
          {booked ? `Booked · ${MINUTES[i]}m` : "Book a Call"}
        </span>
      </GlassButton>
    </div>
  );
}

/* A forced-state copy of the glass button, for the states row. */
export function GlassButtonState({ state }: { state: "rest" | "hover" | "pressed" | "disabled" }) {
  return (
    <div className="kit-tile kit-state-cell">
      <Surface w={320} h={165} r={TILE_R} s={TILE_S} />
      <div style={{ position: "absolute", left: 28.5, top: 15 }}>
        <GlassButton state={state === "hover" || state === "pressed" ? state : undefined} disabled={state === "disabled"}>
          <span className="kit-gbtn-label">Book a Call</span>
        </GlassButton>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2 · avatar */

export function AvatarTile() {
  return (
    <button type="button" className="kit-tile kit-avatar" aria-label="Your profile">
      <Surface w={166} h={168.5} r={TILE_R} s={TILE_S} />
      <span className="kit-avatar-ring">
        <HugeIcon name="user" size={32} />
      </span>
      <span className="kit-sparkle" style={{ left: 52.5, top: 95.5 }} aria-hidden />
      <span className="kit-sparkle" style={{ left: 114, top: 78, animationDelay: "1.2s" }} aria-hidden />
    </button>
  );
}

/* ---------------------------------------------------------------- 3 · morning brief */

const NOTES: ReactNode[] = [
  <>
    You have to start <b>delegating tasks</b>, now go <b>carpe diem</b> :)
  </>,
  <>
    You should <b>finish your portfolio</b> today, what do you think?
  </>,
];

type Clock = { t: string; ap: string; hour: number };

/* The brief's squircles: the gradient panel inside the white frame, the two
 * ghost cards behind the note, and the note itself (rounder at the base,
 * where it sits inside the frame's corner). */
const PANEL_CLIP = squircleClip(370.5, 331.5, 63.5, 0.85);
const GHOST_CLIP = squircleClip(276, 55, 32, 0.75);
const GHOST_FAR_CLIP = squircleClip(221, 55, 28, 0.75);
const NOTE_CLIP = squircleClip(350.5, 153, [44, 44, 52, 52], 0.75);

function readClock(): Clock {
  const d = new Date();
  const hour = d.getHours();
  const h = hour % 12 || 12;
  return { t: `${h}:${String(d.getMinutes()).padStart(2, "0")}`, ap: hour < 12 ? "AM" : "PM", hour };
}

/* The greeting follows the reader's own clock: sun before noon, sun-and-cloud
 * until five, moon after. `size` is the sun's; the other two marks are scaled
 * to sit at the same optical size beside the label. */
function Greeting({ hour, name, size = 22 }: { hour: number; name: string; size?: number }) {
  if (hour < 12)
    return (
      <>
        <HugeIcon name="sun" size={size} strokeWidth={1.6} className="kit-sun" style={{ color: "#F7B500" }} />
        <span>MORNING {name}</span>
      </>
    );
  if (hour < 17)
    return (
      <>
        <HugeIcon name="sun-cloud" size={Math.round(size * 1.09)} strokeWidth={1.6} style={{ color: "#F7B500" }} />
        <span>AFTERNOON {name}</span>
      </>
    );
  return (
    <>
      <HugeIcon
        name="moon"
        size={Math.round(size * 0.9)}
        strokeWidth={1.6}
        className="kit-moon"
        style={{ color: "#8C7CF0" }}
      />
      <span>EVENING {name}</span>
    </>
  );
}

/* The hour on this device, read after mount so the server's markup (morning)
 * and the first client render agree. */
function useHour(fixed?: number) {
  const [hour, setHour] = useState(fixed ?? 9);
  useEffect(() => {
    if (fixed !== undefined) return;
    const tick = () => setHour(new Date().getHours());
    tick();
    const iv = window.setInterval(tick, 60_000);
    return () => window.clearInterval(iv);
  }, [fixed]);
  return hour;
}

export function BriefCard({ stack = 2, fixed }: { stack?: 1 | 2 | 3; fixed?: Clock }) {
  // 9:41 on the server and on first paint — the clock only runs after mount,
  // so the server and the browser agree on the markup.
  const [now, setNow] = useState<Clock>({ t: "9:41", ap: "AM", hour: 9 });
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (fixed) return;
    const tick = () => setNow(readClock());
    tick();
    const iv = window.setInterval(tick, 10_000);
    return () => window.clearInterval(iv);
  }, [fixed]);

  const shown = fixed ?? now;
  const next = () => {
    if (leaving || stack < 2) return;
    setLeaving(true);
    window.setTimeout(() => {
      setIdx((v) => (v + 1) % NOTES.length);
      setLeaving(false);
    }, 380);
  };

  return (
    <button
      type="button"
      className="kit-brief"
      data-leaving={leaving ? "" : undefined}
      onClick={next}
      aria-label="Show the next note"
    >
      <Surface w={382.5} h={344} r={69} s={0.85} kind="white" />
      <span className="kit-brief-panel" style={{ clipPath: PANEL_CLIP }} aria-hidden />
      <span className="kit-brief-time">
        <b>{shown.t}</b>
        <i>{shown.ap}</i>
      </span>
      {stack >= 3 && <span className="kit-ghost kit-ghost--far" style={{ clipPath: GHOST_FAR_CLIP }} aria-hidden />}
      {stack >= 2 && <span className="kit-ghost" style={{ clipPath: GHOST_CLIP }} aria-hidden />}
      <span className="kit-note" style={{ clipPath: NOTE_CLIP }}>
        <span className="kit-eyebrow">
          <Greeting hour={shown.hour} name="JAY" />
        </span>
        <span key={idx} className="kit-note-text" data-in="">
          {NOTES[idx]}
        </span>
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- 4 · happy files */

export function FilesCard({ state }: { state?: "hover" | "selected" | "menu" }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [menu, setMenu] = useState(state === "menu");
  const [selected, setSelected] = useState(state === "selected");
  const [title, setTitle] = useState("Happy Files");
  const [editing, setEditing] = useState(false);
  const images = useCountUp(88, seen);
  const videos = useCountUp(24, seen);
  const files = useCountUp(9, seen);
  const clips = useCountUp(89, seen);

  useEffect(() => {
    if (!menu || state === "menu") return;
    const away = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".kit-menu, .kit-dots")) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [menu, state]);

  return (
    <div
      ref={ref}
      className="kit-tile kit-tile--tall kit-files"
      data-state={state === "hover" ? "hover" : undefined}
      data-selected={selected ? "" : undefined}
      onClick={(e) => {
        if (state || (e.target as Element).closest(".kit-dots, .kit-menu, input")) return;
        setSelected((s) => !s);
      }}
    >
      <Surface w={346.5} h={344} r={TILE_R} s={TILE_S} />
      <HappyFolder className="kit-folder" />
      <button
        type="button"
        className="kit-dots"
        aria-label="Folder options"
        aria-expanded={menu}
        onClick={() => !state && setMenu((m) => !m)}
      >
        <i />
        <i />
        <i />
      </button>
      {menu && (
        <div className="kit-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => setMenu(false)}>
            Open
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenu(false);
              setEditing(true);
            }}
          >
            Rename
          </button>
          <button type="button" role="menuitem" onClick={() => setMenu(false)}>
            Share
          </button>
          <hr />
          <button type="button" role="menuitem" className="kit-danger" onClick={() => setMenu(false)}>
            Delete
          </button>
        </div>
      )}
      <span className="kit-new">NEW</span>
      <h3 className="kit-files-title">
        {editing ? (
          <input
            autoFocus
            defaultValue={title}
            aria-label="Folder name"
            onFocus={(e) => e.currentTarget.select()}
            onBlur={(e) => {
              setTitle(e.currentTarget.value.trim() || title);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                e.currentTarget.value = title;
                e.currentTarget.blur();
              }
            }}
          />
        ) : (
          title
        )}
      </h3>
      <div className="kit-stats">
        <span className="kit-stat kit-stat--image">
          <HugeIcon name="image" size={20} />
          {state ? 88 : images}
        </span>
        <span className="kit-stat kit-stat--video">
          <HugeIcon name="video" size={20} />
          {state ? 24 : videos}
        </span>
        <span className="kit-stat kit-stat--file">
          <HugeIcon name="file" size={20} />
          {state ? 9 : files}
        </span>
        <span className="kit-stat kit-stat--video">
          <HugeIcon name="video" size={20} />
          {state ? 89 : clips}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5 · add */

export function PlusTile() {
  const [ripples, setRipples] = useState<number[]>([]);
  const add = () => {
    const k = performance.now();
    setRipples((r) => [...r, k]);
    window.setTimeout(() => setRipples((r) => r.filter((x) => x !== k)), 720);
  };
  return (
    <button type="button" className="kit-tile kit-plus" onClick={add} aria-label="Add">
      <Surface w={201.5} h={188} r={TILE_R} s={TILE_S} />
      <span className="kit-plus-glow" aria-hidden />
      <PlusMark className="kit-plus-mark" />
      {ripples.map((k) => (
        <span key={k} className="kit-ripple" aria-hidden />
      ))}
    </button>
  );
}

/* ---------------------------------------------------------------- 6 · nudge */

const NUDGE: [string, boolean][] = [
  ["You should ", false],
  ["finish your portfolio", true],
  [" today, what do you think?", false],
];
const NUDGE_LEN = NUDGE.reduce((n, [s]) => n + s.length, 0);

export function NudgeCard() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [typed, setTyped] = useState(NUDGE_LEN);
  const hour = useHour();

  useEffect(() => {
    if (!seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    setTyped(0);
    const iv = window.setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= NUDGE_LEN) window.clearInterval(iv);
    }, 32);
    return () => window.clearInterval(iv);
  }, [seen]);

  let left = typed;
  return (
    <div ref={ref} className="kit-tile kit-nudge">
      <Surface w={527} h={188.5} r={TILE_R} s={TILE_S} />
      <span className="kit-eyebrow">
        <Greeting hour={hour} name="X’IES" size={28} />
      </span>
      <p>
        {NUDGE.map(([s, bold], k) => {
          const part = s.slice(0, Math.max(0, left));
          left -= s.length;
          return bold ? <b key={k}>{part}</b> : <span key={k}>{part}</span>;
        })}
        {typed < NUDGE_LEN && <span className="kit-caret" aria-hidden />}
      </p>
    </div>
  );
}
