/* Where a reader had got to in each step.
 *
 * A step is a long read, and students come back to one across days and
 * devices-worth of interruptions. Landing at the top every time means scrolling
 * back through what you've already read to find the paragraph you stopped on —
 * so the position is remembered per lesson and restored on return.
 *
 * Two scroll containers, saved together rather than detected. On desktop the
 * reader scrolls #content-surface; on mobile the document scrolls, so the URL
 * bar can collapse. Which one is live depends on viewport width at the moment
 * of reading, and a reader who saves on a phone may return on a laptop — so
 * both are recorded and both are restored. The one that isn't the scroller
 * clamps itself to 0 and costs nothing.
 *
 * Heights are stored alongside. A step whose text has been rewritten since is a
 * different document, and dropping someone into the middle of it by raw pixel
 * offset would land them somewhere arbitrary — so a large height change
 * discards the position instead of honouring it. */

const KEY = "booklesss-reading-position-v1";

/** Below this, the reader hadn't really started — restoring would be noise. */
const MIN_OFFSET = 120;

/** Beyond this much height change, the step is treated as rewritten. */
const HEIGHT_TOLERANCE = 0.2;

type Position = {
  /** #content-surface scrollTop (desktop). */
  s: number;
  /** window scrollY (mobile). */
  w: number;
  /** #content-surface scrollHeight when saved. */
  sh: number;
  /** document scrollHeight when saved. */
  wh: number;
};

type Store = Record<string, Position>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // A full or blocked storage must never break reading.
  }
}

const surface = () => document.getElementById("content-surface");

export function savePosition(lessonId: string) {
  if (typeof window === "undefined" || !lessonId) return;
  const el = surface();
  const pos: Position = {
    s: el?.scrollTop ?? 0,
    w: window.scrollY,
    sh: el?.scrollHeight ?? 0,
    wh: document.documentElement.scrollHeight,
  };

  const store = read();
  if (Math.max(pos.s, pos.w) < MIN_OFFSET) {
    // Back at the top is a real answer: forget, rather than keep a stale
    // position that would fight the reader next time.
    if (store[lessonId]) {
      delete store[lessonId];
      write(store);
    }
    return;
  }
  store[lessonId] = pos;
  write(store);
}

/** True if a position was found and applied. */
export function restorePosition(lessonId: string): boolean {
  if (typeof window === "undefined" || !lessonId) return false;
  const pos = read()[lessonId];
  if (!pos) return false;

  const el = surface();
  const nowSh = el?.scrollHeight ?? 0;
  const nowWh = document.documentElement.scrollHeight;

  // Rewritten step: the offsets no longer point at the same words.
  const changed = (was: number, now: number) =>
    was > 0 && now > 0 && Math.abs(now - was) / was > HEIGHT_TOLERANCE;
  if (changed(pos.sh, nowSh) && changed(pos.wh, nowWh)) return false;

  // Clamp: content can still have shifted a little (a font landing late, a
  // table reflowing), and scrolling past the end just pins to the bottom.
  if (el) el.scrollTo({ top: Math.min(pos.s, Math.max(0, el.scrollHeight - el.clientHeight)) });
  if (pos.w > 0) {
    window.scrollTo(0, Math.min(pos.w, Math.max(0, nowWh - window.innerHeight)));
  }
  return true;
}

export function forgetPosition(lessonId: string) {
  const store = read();
  if (!store[lessonId]) return;
  delete store[lessonId];
  write(store);
}
