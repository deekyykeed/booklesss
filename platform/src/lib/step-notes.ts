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

import { type SolarIconName } from "@/components/icons/solar";

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
 * SOLAR as of 2026-08-09 evening (owner: "for the flag thing use solar line
 * broken and then go solar duotone when selected"), Tabler for the afternoon
 * before it, Freehand and Ultimate Colors earlier the same day. The flag
 * collapses into one of these marks, so the menu could not stay in a different
 * family than the button that draws from it — that rule has now carried the
 * whole control through four families in one day.
 *
 * TWO NAMES PER REASON, LONGHAND, and the reason is a rule this file already
 * learned once with MynaUI's `-solid` twins: a template literal
 * (`${mark}-bold-duotone`) is a plain string to the compiler, and a missing
 * twin would render nothing with no error. Written out, `SolarIconName` makes
 * a typo or an absent style a build error. `mark` is the "-broken" style — a
 * stroke drawing with a gap in its line, greyed through currentColor at rest —
 * and `markOn` is "-bold-duotone", two currentColor fills with the back one at
 * half opacity, which is what "selected" looks like in this family.
 *
 * Every reason keeps the picture it had under Tabler — bulb, question mark,
 * clock, clipboard, warning triangle — because Solar draws all five. Only the
 * hand changed. */
/* A HUE PER VERDICT (owner, 2026-08-09: "use the same color styling we are
 * using for the animated icons — just pick colors that make sense"). The state
 * model is the Lordicon doodles' exactly: grey line at rest, its OWN colour
 * once chosen — a duotone shades itself out of one hue, so the hue is the whole
 * treatment. It also puts a second signal on the collapsed flag: a reader
 * scrolling back sees not just WHICH verdict they left but its temperature.
 *
 * Four of the five are the dashboard stat tiles' hues (TONE in HomeView.tsx),
 * reused rather than invented because they were VALIDATED as a set — lightness
 * band, chroma floor, CVD separation, contrast on a light surface — and this is
 * the same drawing style on the same kind of surface. The fifth is the app's
 * own error red (the auth form's), because "something looks wrong" is the one
 * verdict that is a defect report. Green keeps the one meaning it has
 * everywhere here: this worked. The clock is orange, not the time tile's blue —
 * same drawing, different sentence: "too long" is an overrun, not a tally. */
/* THE MARKS ARE ANIMATED LORDICON DOODLES, LIKE THE THREE ANSWERS (owner,
 * 2026-08-09: "am i not able to find free lordicons for the flag icons — just
 * need animations that make sense"). All six exist in the free doodle/color
 * set — `premium: false`, checked by the fetch script, which refuses paid rows
 * — so nothing had to be cut. Three meanings changed PICTURE to stay inside
 * the free set, and the substitutions are worth recording:
 *   · the flag → `messages-feedback`, a feedback bubble. The free set has no
 *     flag at all — and the bubble is honester: this control was never a
 *     report-abuse flag, it asks "how did that read?".
 *   · the bulb ("Clear") → `check`. No bulb in the free set; the tick is what
 *     Clear meant under Ultimate Colors too.
 *   · the question mark ("Hard to follow") → `puzzle-pair`. No question mark;
 *     two puzzle pieces being fitted is "I can't piece this together", which
 *     is the verdict, drawn.
 * `lordState` is read off `node scripts/lord-states.mjs`, never guessed — a
 * wrong name silently plays the wrong animation. All `hover-` states: an `in-`
 * state starts from an empty frame.
 *
 * THE SOLAR PAIR STAYS AS THE FALLBACK, exactly as Tabler does for the three
 * answers: a Lottie is a fetch, this reader is read on Zambian mobile data,
 * and a checkpoint on a bad connection must be a static mark, not a hole.
 * `hue` colours the fallback's chosen state so even the offline path keeps
 * the answers' grammar: grey at rest, its own colour once chosen. */
export const NOTES: {
  id: NoteId;
  label: string;
  lord: string;
  lordState: string;
  mark: SolarIconName;
  markOn: SolarIconName;
  hue: string;
}[] = [
  { id: "clear", label: "Clear", lord: "note-clear", lordState: "hover-pinch", mark: "lightbulb-broken", markOn: "lightbulb-bold-duotone", hue: "#17754d" },
  { id: "hard", label: "Hard to follow", lord: "note-hard", lordState: "hover-pinch", mark: "question-circle-broken", markOn: "question-circle-bold-duotone", hue: "#4a3aa7" },
  { id: "long", label: "Too long", lord: "note-long", lordState: "hover-pinch", mark: "clock-circle-broken", markOn: "clock-circle-bold-duotone", hue: "#eb6834" },
  { id: "example", label: "Needs an example", lord: "note-example", lordState: "hover-pinch", mark: "clipboard-text-broken", markOn: "clipboard-text-bold-duotone", hue: "#2a78d6" },
  { id: "wrong", label: "Something looks wrong", lord: "note-wrong", lordState: "hover-pinch", mark: "danger-triangle-broken", markOn: "danger-triangle-bold-duotone", hue: "#b42318" },
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
