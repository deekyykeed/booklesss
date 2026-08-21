/* What a call leaves behind.
 *
 * The pinned lines and the student's own typing are the ONLY text a session
 * produces — there is no transcript, by design (owner, 2026-08-21: "we're not
 * writing everything verbatim … putting up important points so that they can
 * stay up for the user to read"). So this store is not a convenience. It is
 * the artifact. A call whose pins are gone the moment it ends taught nothing
 * anybody can revisit.
 *
 * Shaped like lib/saved and lib/step-notes on purpose: a bare localStorage key,
 * one read/write pair, a listener set for useSyncExternalStore. That shape is
 * what made saves and verdicts cheap to lift into /api/state on 2026-08-10, and
 * this store is the next obvious passenger — allSessionRecords/replaceSessions
 * at the bottom are the same two doors lib/saved grew for exactly that, so
 * wiring it into lib/state-sync is a table and a merge rule, not a rewrite.
 *
 * DEVICE-LOCAL FOR NOW, and that is a stated debt rather than a decision: the
 * 2026-08-10 session established that what a student DID must not die with the
 * browser, and notes typed during a call are squarely that.
 */

export type Pin = {
  text: string;
  /** Drives the mark on the card — see PIN_MARKS in study/PointStack. */
  kind: "key" | "warning" | "example" | "formula" | "point";
  /** ms into the call, so the pins keep the order they were made in. */
  at: number;
};

export type SessionRecord = {
  pins: Pin[];
  /** Whatever they typed, verbatim. One box, not per-pin — a person taking
   *  notes in a call writes in a stream and does not want to choose a slot. */
  notes: string;
  /** Epoch ms of the last write, for "you did this on Tuesday" and for the
   *  clock any future merge will need. */
  updatedAt: number;
};

export type SessionStore = Record<string, SessionRecord>;

const KEY = "booklesss:session:v1";

function read(): SessionStore {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as SessionStore;
  } catch {
    return {}; // private mode, or someone else's key
  }
}

function write(s: SessionStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* Out of quota or private mode. Losing notes is bad; crashing the call the
     * student is currently in is worse. */
  }
}

const listeners = new Set<() => void>();

export function subscribeSessions(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit() {
  for (const fn of listeners) fn();
}

const EMPTY: SessionRecord = { pins: [], notes: "", updatedAt: 0 };

/* useSyncExternalStore compares snapshots by identity, so this MUST return the
 * same object when nothing changed or React re-renders forever. Caching the
 * parsed record per id is the whole reason this isn't a plain read(). */
let snapCache: { raw: string; parsed: SessionStore } | null = null;

function store(): SessionStore {
  if (typeof localStorage === "undefined") return {};
  const raw = localStorage.getItem(KEY) ?? "{}";
  if (snapCache?.raw === raw) return snapCache.parsed;
  try {
    const parsed = JSON.parse(raw) as SessionStore;
    snapCache = { raw, parsed };
    return parsed;
  } catch {
    return {};
  }
}

export function sessionRecord(id: string): SessionRecord {
  return store()[id] ?? EMPTY;
}

/** Append a pin. Deduped on text, because an agent asked to pin one line per
 *  beat will occasionally pin the same line twice on a re-explanation. */
export function addPin(id: string, pin: Pin) {
  const s = read();
  const rec = s[id] ?? { pins: [], notes: "", updatedAt: 0 };
  const text = pin.text.trim();
  if (!text) return;
  if (rec.pins.some((p) => p.text.trim().toLowerCase() === text.toLowerCase())) return;
  s[id] = { ...rec, pins: [...rec.pins, { ...pin, text }], updatedAt: Date.now() };
  write(s);
  emit();
}

export function setNotes(id: string, notes: string) {
  const s = read();
  const rec = s[id] ?? { pins: [], notes: "", updatedAt: 0 };
  s[id] = { ...rec, notes, updatedAt: Date.now() };
  write(s);
  emit();
}

/** Wipe one session's record — the "start this call fresh" path. Notes are
 *  kept: they are the student's own words, and clearing them is never what
 *  "run the call again" means. */
export function clearPins(id: string) {
  const s = read();
  const rec = s[id];
  if (!rec) return;
  s[id] = { ...rec, pins: [], updatedAt: Date.now() };
  write(s);
  emit();
}

/* ---- the sync's two doors, for when this joins /api/state ---- */

export function allSessionRecords(): SessionStore {
  return read();
}

export function replaceSessions(next: SessionStore) {
  write(next);
  emit();
}
