/* ------------------------------------------------------------------ *
 * What a student DOES, in the shape both sides agree on.
 *
 * WHY IT IS ITS OWN FILE, and not four. `lib/saved`, `lib/step-notes`,
 * `lib/step-comments` and `lib/progress` are all browser stores — three of them
 * plain localStorage wrappers, one a `"use client"` useSyncExternalStore. The
 * route handler that persists them cannot import any of it without dragging a
 * browser-only store into a request. So the TYPES and the MERGE RULES live here,
 * where the route and the browser can each import them, exactly as
 * `progress-shared` already does for the three grasp values.
 *
 * ── THE MERGE IS ADDITIVE WHEREVER IT CAN BE, AND THAT IS THE WHOLE DESIGN ──
 *
 * `students.identity` merges last-writer-wins on an `updatedAt` clock, and that
 * is right for an ANSWER: a student has one name, and the newer one replaces the
 * older. It is wrong for a RECORD OF WORK. Two devices do not hold competing
 * claims about which checkpoints were cleared — they hold different halves of
 * the same history, and last-writer-wins would throw one half away.
 *
 * Concretely: read three steps on a laptop, four on a phone, and a
 * last-writer-wins merge leaves you with whichever device synced second. The
 * rules below leave you with seven.
 *
 * So: union the sets, take the max per counter, and fall back to a clock only
 * where two copies genuinely disagree about one value. The identity file's own
 * warning applies here too — BOTH CLOCKS ARE THE STUDENT'S OWN, a phone with a
 * wrong system clock wins forever — which is the second reason to lean on
 * arithmetic rather than on timestamps.
 * ------------------------------------------------------------------ */

import { isGrasp, type Grasp } from "./progress-shared";

/* ------------------------------------------------------------------ *
 * The five note verdicts. Duplicated from `lib/step-notes`' NOTES table on
 * purpose: that module imports the Solar icon names and the Lordicon states,
 * which is a client-side concern the route must not pull in. This is the
 * vocabulary alone, and the CHECK constraint on section_notes.note is the third
 * copy — a disagreement between them surfaces as a 400, not as a bad row.
 * ------------------------------------------------------------------ */
export type NoteId = "hard" | "long" | "example" | "wrong" | "clear";
export const NOTE_IDS: NoteId[] = ["hard", "long", "example", "wrong", "clear"];
export const isNoteId = (v: unknown): v is NoteId => (NOTE_IDS as string[]).includes(v as string);

/** Longest id the reader's own data can carry. The longest real one in
 *  course-data is ~60 characters; 120 keeps every honest caller and bounds a
 *  dishonest one. Same number the reaction route uses, and the same number the
 *  column's CHECK enforces. */
export const MAX_ID = 120;
/** A comment box is a few sentences. Matches section_comments' CHECK. */
export const MAX_COMMENT = 4000;

export const isId = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= MAX_ID;

/* ------------------------------------------------------------------ *
 * The four stores, as they travel.
 * ------------------------------------------------------------------ */

/** lessonId -> sectionId -> true. A key's presence IS the value. */
export type SavedStore = Record<string, Record<string, true>>;
/** lessonId -> sectionId -> which of the five. */
export type NotesStore = Record<string, Record<string, NoteId>>;
/** lessonId -> sectionId -> the words and when they were written. */
export type CommentsStore = Record<string, Record<string, { text: string; at: string }>>;

/** One day of studying. Mirrors StudyDay in lib/progress. */
export type StudyDay = {
  checks: number;
  secs: number;
  steps: number;
  courses?: Record<string, number>;
  courseChecks?: Record<string, number>;
};

/** The whole progress record. Mirrors State in lib/progress. */
export type ProgressState = {
  done: Record<string, string[]>;
  days: Record<string, StudyDay>;
  touched: Record<string, string>;
  grasp: Record<string, Record<string, Grasp>>;
  last?: { id: string; at: number } | null;
};

export const EMPTY_PROGRESS: ProgressState = { done: {}, days: {}, touched: {}, grasp: {} };

/* ------------------------------------------------------------------ *
 * Validation. Everything below treats its input as STRANGER INPUT, because on
 * one side it is a request body and on the other it is a localStorage key any
 * extension can write. Same posture `parseAccountIdentity` takes, and for the
 * same reason: a validator that stops being run because the source got safer is
 * a validator that was load-bearing for the wrong reason.
 *
 * The rule throughout is DROP, NEVER GUESS. A malformed day is not a day worth
 * inventing numbers for.
 * ------------------------------------------------------------------ */

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const whole = (n: unknown): number =>
  typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;

function cleanCounts(raw: unknown): Record<string, number> | undefined {
  if (!isObj(raw)) return undefined;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const n = whole(v);
    if (n && isId(k)) out[k] = n;
  }
  return Object.keys(out).length ? out : undefined;
}

export function cleanSaved(raw: unknown): SavedStore {
  if (!isObj(raw)) return {};
  const out: SavedStore = {};
  for (const [lesson, row] of Object.entries(raw)) {
    if (!isId(lesson) || !isObj(row)) continue;
    const next: Record<string, true> = {};
    for (const [section, v] of Object.entries(row)) if (isId(section) && v === true) next[section] = true;
    if (Object.keys(next).length) out[lesson] = next;
  }
  return out;
}

export function cleanNotes(raw: unknown): NotesStore {
  if (!isObj(raw)) return {};
  const out: NotesStore = {};
  for (const [lesson, row] of Object.entries(raw)) {
    if (!isId(lesson) || !isObj(row)) continue;
    const next: Record<string, NoteId> = {};
    for (const [section, v] of Object.entries(row)) if (isId(section) && isNoteId(v)) next[section] = v;
    if (Object.keys(next).length) out[lesson] = next;
  }
  return out;
}

export function cleanComments(raw: unknown): CommentsStore {
  if (!isObj(raw)) return {};
  const out: CommentsStore = {};
  for (const [lesson, row] of Object.entries(raw)) {
    if (!isId(lesson) || !isObj(row)) continue;
    const next: Record<string, { text: string; at: string }> = {};
    for (const [section, v] of Object.entries(row)) {
      if (!isId(section) || !isObj(v)) continue;
      const text = typeof v.text === "string" ? v.text.trim().slice(0, MAX_COMMENT) : "";
      if (!text) continue;
      /* An unparseable date sorts as 0 in the merge below rather than dropping
         the comment — the words are the valuable part, the timestamp only
         breaks ties. */
      const at = typeof v.at === "string" ? v.at : "";
      next[section] = { text, at };
    }
    if (Object.keys(next).length) out[lesson] = next;
  }
  return out;
}

export function cleanProgress(raw: unknown): ProgressState {
  if (!isObj(raw)) return { ...EMPTY_PROGRESS };

  const done: Record<string, string[]> = {};
  if (isObj(raw.done)) {
    for (const [lesson, v] of Object.entries(raw.done)) {
      if (!isId(lesson) || !Array.isArray(v)) continue;
      const ids = [...new Set(v.filter(isId))];
      if (ids.length) done[lesson] = ids;
    }
  }

  const days: Record<string, StudyDay> = {};
  if (isObj(raw.days)) {
    for (const [date, v] of Object.entries(raw.days)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isObj(v)) continue;
      const day: StudyDay = { checks: whole(v.checks), secs: whole(v.secs), steps: whole(v.steps) };
      const courses = cleanCounts(v.courses);
      if (courses) day.courses = courses;
      const courseChecks = cleanCounts(v.courseChecks);
      if (courseChecks) day.courseChecks = courseChecks;
      if (day.checks || day.secs || day.steps) days[date] = day;
    }
  }

  const touched: Record<string, string> = {};
  if (isObj(raw.touched)) {
    for (const [lesson, v] of Object.entries(raw.touched)) {
      if (isId(lesson) && typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) touched[lesson] = v;
    }
  }

  const grasp: Record<string, Record<string, Grasp>> = {};
  if (isObj(raw.grasp)) {
    for (const [lesson, row] of Object.entries(raw.grasp)) {
      if (!isId(lesson) || !isObj(row)) continue;
      const next: Record<string, Grasp> = {};
      for (const [section, g] of Object.entries(row)) if (isId(section) && isGrasp(g)) next[section] = g;
      if (Object.keys(next).length) grasp[lesson] = next;
    }
  }

  let last: { id: string; at: number } | null = null;
  if (isObj(raw.last) && isId(raw.last.id) && typeof raw.last.at === "number" && Number.isFinite(raw.last.at)) {
    last = { id: raw.last.id, at: raw.last.at };
  }

  return { done, days, touched, grasp, last };
}

/* ------------------------------------------------------------------ *
 * The merges. Each takes (mine, theirs) and returns the union — and each is
 * IDEMPOTENT and COMMUTATIVE where the rule allows, so syncing twice cannot
 * drift and it does not matter which device reaches the server first. That
 * property is what lets the client merge-then-push without a transaction.
 * ------------------------------------------------------------------ */

/**
 * Saved: a plain UNION.
 *
 * The known cost, accepted: un-saving on one device does not propagate — the
 * other device still holds the row and hands it back on the next merge. Fixing
 * that needs tombstones (a row per un-save, kept forever, so "deleted" can
 * out-rank "present"), and the trade is not worth it for a bookmark. A save
 * that comes back is a mild annoyance; a save that vanishes is the thing the
 * control exists to prevent. Revisit if a reader ever complains — the shape
 * to add is a `removed_at` on saved_sections, not a cleverer merge.
 */
export function mergeSaved(mine: SavedStore, theirs: SavedStore): SavedStore {
  const out: SavedStore = {};
  for (const src of [theirs, mine]) {
    for (const [lesson, row] of Object.entries(src)) {
      out[lesson] = { ...(out[lesson] ?? {}), ...row };
    }
  }
  return out;
}

/**
 * Notes: THIS device wins where both hold a verdict, otherwise adopt.
 *
 * One verdict per section, so this is a genuine conflict and needs a rule. The
 * local one wins because it is the tap the reader most recently made on the
 * device they are actually holding — and because a verdict is cheap to change
 * and expensive to have silently rewritten under you mid-session.
 */
export function mergeNotes(mine: NotesStore, theirs: NotesStore): NotesStore {
  const out: NotesStore = {};
  for (const src of [theirs, mine]) {
    for (const [lesson, row] of Object.entries(src)) {
      out[lesson] = { ...(out[lesson] ?? {}), ...row };
    }
  }
  return out;
}

/**
 * Comments: the LATER one wins, per section.
 *
 * The only store where a clock is the right rule — these are words a person
 * wrote, one version supersedes another, and `at` is already stamped on every
 * save. An unparseable date sorts oldest, so a malformed local row never
 * silently beats a good remote one.
 */
export function mergeComments(mine: CommentsStore, theirs: CommentsStore): CommentsStore {
  const stamp = (s: string) => {
    const t = Date.parse(s);
    return Number.isFinite(t) ? t : 0;
  };
  const out: CommentsStore = {};
  for (const src of [theirs, mine]) {
    for (const [lesson, row] of Object.entries(src)) {
      const dst = { ...(out[lesson] ?? {}) };
      for (const [section, c] of Object.entries(row)) {
        const held = dst[section];
        if (!held || stamp(c.at) >= stamp(held.at)) dst[section] = c;
      }
      out[lesson] = dst;
    }
  }
  return out;
}

/** Per-key max of two count maps. Used for the per-course breakdowns. */
function maxCounts(
  a: Record<string, number> | undefined,
  b: Record<string, number> | undefined,
): Record<string, number> | undefined {
  if (!a) return b;
  if (!b) return a;
  const out: Record<string, number> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return out;
}

/**
 * Progress: union the sets, MAX the counters, latest wins the singletons.
 *
 * ── WHY MAX AND NOT SUM, WHICH IS THE TEMPTING ONE ──
 *
 * Summing looks right — two devices, two half-days, add them up. It is wrong,
 * and wrong in the direction that inflates: every sync re-adds what the last
 * one already sent, so a student who syncs five times has five times the
 * reading. The merge has to be IDEMPOTENT, and `max` is, while `+` is not.
 *
 * The cost is real and is the honest trade: genuine same-day study on two
 * devices counts once, at whichever device did more. Under-counting a day is a
 * streak that is true; over-counting it is a number that flatters, and this app
 * has already decided (STUDY_DAY_MIN_SECS) that it would rather a streak be
 * earned than generous. Fixing it properly needs per-device day rows summed at
 * read time — a real option later, and the view over `days` is where it would
 * land.
 */
export function mergeProgress(mine: ProgressState, theirs: ProgressState): ProgressState {
  /* Checkpoints cleared: a union. Clearing one is a fact about the past and no
     device's copy can un-make it. */
  const done: Record<string, string[]> = {};
  for (const lesson of new Set([...Object.keys(mine.done), ...Object.keys(theirs.done)])) {
    done[lesson] = [...new Set([...(mine.done[lesson] ?? []), ...(theirs.done[lesson] ?? [])])];
  }

  const days: Record<string, StudyDay> = {};
  for (const date of new Set([...Object.keys(mine.days), ...Object.keys(theirs.days)])) {
    const a = mine.days[date];
    const b = theirs.days[date];
    if (!a || !b) {
      days[date] = (a ?? b)!;
      continue;
    }
    const day: StudyDay = {
      checks: Math.max(a.checks, b.checks),
      secs: Math.max(a.secs, b.secs),
      steps: Math.max(a.steps, b.steps),
    };
    const courses = maxCounts(a.courses, b.courses);
    if (courses) day.courses = courses;
    const courseChecks = maxCounts(a.courseChecks, b.courseChecks);
    if (courseChecks) day.courseChecks = courseChecks;
    days[date] = day;
  }

  /* Last touched: the later date. Review debt should reflect the most recent
     time the step was actually worked, on any device. */
  const touched: Record<string, string> = { ...theirs.touched };
  for (const [lesson, date] of Object.entries(mine.touched)) {
    if (!touched[lesson] || date > touched[lesson]) touched[lesson] = date;
  }

  /* Grasp: local wins a genuine conflict, same rule and same reasoning as
     notes — it is the answer the reader gave on the device in their hand. */
  const grasp: Record<string, Record<string, Grasp>> = {};
  for (const lesson of new Set([...Object.keys(mine.grasp), ...Object.keys(theirs.grasp)])) {
    grasp[lesson] = { ...(theirs.grasp[lesson] ?? {}), ...(mine.grasp[lesson] ?? {}) };
  }

  /* Where the reader is: the genuinely later of the two. This one IS a
     last-writer question — there is one place you most recently were. */
  const last =
    (mine.last?.at ?? 0) >= (theirs.last?.at ?? 0) ? (mine.last ?? theirs.last ?? null) : theirs.last;

  return { done, days, touched, grasp, last: last ?? null };
}

/* ------------------------------------------------------------------ *
 * The wire shape, both directions. One request each way rather than four:
 * this reader is read on Zambian mobile data, and a sign-in that costs four
 * round trips before the dashboard is right is a sign-in that looks broken on
 * a slow connection.
 * ------------------------------------------------------------------ */
export type StateBundle = {
  saved: SavedStore;
  notes: NotesStore;
  comments: CommentsStore;
  progress: ProgressState;
};

export function cleanBundle(raw: unknown): StateBundle {
  const o = isObj(raw) ? raw : {};
  return {
    saved: cleanSaved(o.saved),
    notes: cleanNotes(o.notes),
    comments: cleanComments(o.comments),
    progress: cleanProgress(o.progress),
  };
}

export function mergeBundle(mine: StateBundle, theirs: StateBundle): StateBundle {
  return {
    saved: mergeSaved(mine.saved, theirs.saved),
    notes: mergeNotes(mine.notes, theirs.notes),
    comments: mergeComments(mine.comments, theirs.comments),
    progress: mergeProgress(mine.progress, theirs.progress),
  };
}

/** Row counts, for the write cap below and for deciding whether a push is
 *  worth making at all. */
export function bundleSize(b: StateBundle): number {
  const rows = (s: Record<string, Record<string, unknown>>) =>
    Object.values(s).reduce((n, row) => n + Object.keys(row).length, 0);
  return rows(b.saved) + rows(b.notes) + rows(b.comments);
}
