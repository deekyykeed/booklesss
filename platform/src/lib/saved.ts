/* Sections a reader has saved for later — its own store, because independence
 * is a STORAGE property, not a UI one.
 *
 * Save shipped (2026-08-09, morning) as the third value in the checkpoint's
 * `Grasp` slot — one value per section, so tapping Like silently un-saved, and
 * the owner met it within the day: "the save should be independent from the
 * lost and like. when I tap like the saved goes off." The row's own comments
 * had already named Save a DECISION and Lost/Like a VERDICT; two different
 * questions cannot share one answer slot, and no amount of button wiring fixes
 * that — the slot has to split. This file is the split.
 *
 * Same shape as lib/step-notes, deliberately: a bare localStorage key (no
 * course scope — lesson slugs are the keys, same as step-notes), one read/write
 * pair, a listener set for useSyncExternalStore. Device-local like everything
 * else the reader answers; nothing here goes to the server. The reaction POST
 * carries verdicts only — its table holds ONE grasp per user/section, so
 * recording a save there would clobber the verdict row, which is the same
 * one-slot bug this file exists to end.
 *
 * LEGACY: devices that saved sections while Save was `grasp: "almost"` keep
 * that value in the progress store. Checkpoint reads `grasp === "almost"` as
 * saved-too and migrates it here on the next tap. `rate()` never writes
 * "almost" again; the weight it still carries in lib/progress (0.5) is for
 * those historical rows alone.
 */

export type SavedStore = Record<string, Record<string, true>>;

const KEY = "booklesss:saved:v1";

function read(): SavedStore {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as SavedStore;
  } catch {
    return {}; // private mode, or someone else's key
  }
}

function write(s: SavedStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* out of quota or private mode: losing a bookmark is not worth a crash */
  }
}

const listeners = new Set<() => void>();

/** For useSyncExternalStore. Returns the unsubscribe, as it must. */
export function subscribeSaved(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** A boolean — a primitive — so it is safe as a useSyncExternalStore snapshot. */
export function savedFor(lessonId: string, sectionId: string): boolean {
  return read()[lessonId]?.[sectionId] === true;
}

export function setSaved(lessonId: string, sectionId: string, saved: boolean) {
  const s = read();
  const forLesson = { ...(s[lessonId] ?? {}) };
  if (saved) forLesson[sectionId] = true;
  else delete forLesson[sectionId];
  if (Object.keys(forLesson).length) s[lessonId] = forLesson;
  else delete s[lessonId];
  write(s);
  for (const fn of listeners) fn();
}
