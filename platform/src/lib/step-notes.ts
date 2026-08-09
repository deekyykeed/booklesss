/* What a reader thought of a section, in their own taps.
 *
 * The checkpoint already asks what they want to DO about a section ("Later" or
 * "Got it"). This asks the different question: how the writing landed. They are
 * not the same thing, and the second one is the one the step can act on — a
 * reader who understood a section and had to read it three times to get there
 * has told us something no completion figure will.
 *
 * Device-local, like progress. There is no account and no endpoint yet, so this
 * is a collection point rather than a pipeline: the notes accumulate under one
 * key, and `allNotes()` hands the lot over whenever there is somewhere to send
 * them. Storing them now costs nothing and means the first weeks of reading are
 * not lost when that endpoint arrives.
 *
 * The options map onto the rules in .claude/skills/step-skill/RULES.md, so a
 * tally points at a specific rule rather than at a mood:
 *   hard      → W-3 / W-12   the writing, or a sentence doing two jobs
 *   long      → S-8 / W-2    the step, or the section, is too much at once
 *   example   → C-5 / C-3    definition end to end, nothing concrete
 *   wrong     → E-7          a figure or a method looks wrong: urgent
 *   clear     → the "keep" signal, so a rewrite doesn't delete what worked
 */

import { type FreehandIconName } from "@/components/icons/freehand";

export type NoteId = "hard" | "long" | "example" | "wrong" | "clear";

/* Each row carries its own mark, on the right (owner, 2026-08-07). The mark says
 * which answer the row IS and, by whether it carries colour, whether it is the
 * one selected — replacing a tick that could only ever say the second of those,
 * in the slot where the first belonged.
 *
 * The pair it used to draw was a MynaUI outline and its `-solid` twin, both
 * written out longhand rather than built as `${icon}-solid`, because a template
 * literal is a plain string to the compiler and would have let a missing twin
 * render nothing at all. That whole mechanism is gone: one name per reason now,
 * with the chosen/unchosen states drawn by the generator instead of named here. */
/* ONE MARK PER REASON, drawn in two places: the menu row that offers it, and the
 * collapsed flag once it has been given. Both are the same picture on purpose —
 * that is what lets a reader recognise a verdict later without reopening the
 * menu.
 *
 * `icon`/`iconOn` (MynaUI, an outline and its solid twin) were here until
 * 2026-08-08 and are gone rather than left in place: nothing drew them once the
 * menu moved to this family, and a dead field with a "keep in step with" story
 * attached is exactly the drift that makes the next addition half-done. The
 * MynaUI names are recoverable from git if a monochrome fallback is ever wanted.
 *
 * STREAMLINE FREEHAND as of 2026-08-09, moved off Ultimate Colors with the rest
 * of the checkpoint row (owner: "lets use freehand duotone free icons for
 * everything in that row"). The flag collapses into one of these marks, so the
 * menu could not stay in a different family than the button that draws from it.
 *
 * TWO ROWS GOT THE PICTURE THEY ALWAYS WANTED. Ultimate has no plain lightbulb
 * and no plain warning triangle, so "Clear" settled for a green tick and
 * "Something looks wrong" for a red cross. Freehand draws both, so the
 * substitutions are gone rather than carried over (they were argued in
 * gen-ultimate-icons.mjs, which went with the family — see git history).
 * `FreehandIconName` is what makes a typo a build error rather than a blank
 * space in the menu. */
export const NOTES: {
  id: NoteId;
  label: string;
  mark: FreehandIconName;
}[] = [
  { id: "clear", label: "Clear", mark: "creativity-idea-bulb" },
  { id: "hard", label: "Hard to follow", mark: "help-question-circle" },
  { id: "long", label: "Too long", mark: "time-clock-circle" },
  { id: "example", label: "Needs an example", mark: "form-edition-clipboard" },
  { id: "wrong", label: "Something looks wrong", mark: "alerts-warning-triangle" },
];

const KEY = "booklesss:step-notes:v1";

/** noteId, by section id, by lesson id. */
type Store = Record<string, Record<string, NoteId>>;

function read(): Store {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {}; // private mode, or someone else's key
  }
}

function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* out of quota or private mode: losing a note is not worth a crash */
  }
}

/* ------------------------------------------------------------------ *
 * Who is watching. localStorage is an external mutable store, so a component
 * reading it needs to be told when it changes rather than copying it into
 * state inside an effect — that copy is a cascading render, and the lint rule
 * that refuses it is right. Same shape as lib/identity and lib/progress, which
 * both solved this first.
 * ------------------------------------------------------------------ */
const listeners = new Set<() => void>();

/** For useSyncExternalStore. Returns the unsubscribe, as it must. */
export function subscribeNotes(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function noteFor(lessonId: string, sectionId: string): NoteId | null {
  /* A PRIMITIVE, which is what makes this safe as a snapshot:
     useSyncExternalStore compares snapshots by identity and would loop forever
     on a fresh object each call. A NoteId or null cannot do that. */
  return read()[lessonId]?.[sectionId] ?? null;
}

/** Set a note, or clear it by passing the one already stored. */
export function setNote(lessonId: string, sectionId: string, note: NoteId | null) {
  const s = read();
  const forLesson = { ...(s[lessonId] ?? {}) };
  if (note === null) delete forLesson[sectionId];
  else forLesson[sectionId] = note;
  s[lessonId] = forLesson;
  write(s);
  for (const fn of listeners) fn();
}

/** Everything collected on this device, for whenever there is somewhere to
 *  send it. */
export function allNotes(): Store {
  return read();
}
