/* A reader's own words about one section.
 *
 * The checkpoint row already asks two closed questions — what the reader wants
 * to do about a section ("Later" / "Got it") and how the writing read (the five
 * notes in step-notes.ts). Both are taps, and a tap can only pick from what was
 * offered. This is the box for the thing nobody thought to offer: the sentence
 * that did not parse, the figure that looks wrong, the example from their own
 * bank that would have made it land.
 *
 * Scoped to the SECTION, not the step. A comment filed against a whole step
 * says "somewhere in these 2,000 words"; against a section it says where, and
 * the section id is the same one the checkpoint and the note already key on, so
 * all three line up on the same seam when there is somewhere to send them.
 *
 * Device-local, exactly like notes and progress, and for the same reason: there
 * is no account and no endpoint. So this is a collection point, not a pipeline
 * — nobody else can read these yet, and the UI says so rather than implying a
 * conversation that does not exist. `allComments()` hands the lot over the day
 * there is somewhere for them to go.
 */

const KEY = "booklesss:step-comments:v1";

export type Comment = {
  text: string;
  /** ISO, set on every save. Whoever drains this will want to know when. */
  at: string;
};

/** Comment, by section id, by lesson id. */
export type Store = Record<string, Record<string, Comment>>;

/* Same store shape as progress.tsx and identity.tsx, and for the same reason:
 * localStorage is an external mutable store that does not exist during SSR, so
 * this is a useSyncExternalStore source rather than state-plus-an-effect.
 *
 * The parsed object is cached because useSyncExternalStore compares snapshots by
 * identity — re-parsing the JSON on every read would hand back a new object each
 * time and spin. `EMPTY` is a frozen constant so the server snapshot is stable
 * too, which is what stops a hydration mismatch: the server renders "nobody has
 * commented", and the real store swaps in after mount. */
const EMPTY: Store = Object.freeze({});

let cache: Store | null = null;
const listeners = new Set<() => void>();

function read(): Store {
  if (cache) return cache;
  if (typeof localStorage === "undefined") return EMPTY;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    cache = {}; // private mode, or someone else's key
  }
  return cache;
}

function write(s: Store) {
  cache = s;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* out of quota or private mode: losing a comment is not worth a crash */
  }
  for (const fn of listeners) fn();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  // Another tab writing the same key: drop the cache and re-read.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export const getSnapshot = (): Store => read();
export const getServerSnapshot = (): Store => EMPTY;

export function commentFor(lessonId: string, sectionId: string): Comment | null {
  return read()[lessonId]?.[sectionId] ?? null;
}

/** Save a comment, or clear it by saving blank — an emptied box means the
 *  reader took it back, which is the same rule the taps follow. */
export function setComment(lessonId: string, sectionId: string, text: string) {
  const trimmed = text.trim();
  const s = read();
  const forLesson = { ...(s[lessonId] ?? {}) };
  if (trimmed === "") delete forLesson[sectionId];
  else forLesson[sectionId] = { text: trimmed, at: new Date().toISOString() };
  s[lessonId] = forLesson;
  write(s);
}

/** Everything collected on this device, for whenever there is somewhere to
 *  send it. */
export function allComments(): Store {
  return read();
}
