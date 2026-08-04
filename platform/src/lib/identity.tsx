"use client";

import { useSyncExternalStore } from "react";
import { AVATARS, resolveAvatar, type AvatarId } from "@/components/identity/avatars";
import { isSchoolChoice, OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";

/* ------------------------------------------------------------------ *
 * Who is reading — a name and a face, ASSIGNED rather than asked, plus a
 * school and courses they may narrow later. All of it kept on the device.
 *
 * ANONYMOUS BY DEFAULT (owner, 2026-08-02). Nobody is asked anything. A reader
 * arriving from a WhatsApp link is given an avatar and a username on the spot,
 * and the username IS the avatar's name — the Astronaut is called Astronaut.
 * Neither can be changed.
 *
 * The reason is the first three seconds. A student tapping a link in a study
 * group has come for a lesson, and what used to meet them was a form: a name
 * field, twelve faces, every university, every course. Whatever that form
 * collected, it collected it from the people who got through it, and the ones
 * who didn't were never counted.
 *
 * School and courses are no longer asked either. They still earn their place
 * once someone cares — set them in Settings and the home page lists those
 * courses and measures progress against them — but an unanswered pair is a
 * legitimate, permanent state now, not a form left half-finished. `courses: []`
 * means "the whole library", and enrolledCourses() has always read it that way.
 *
 * When accounts land, signing up CONNECTS to the identity the device already
 * has, so a student keeps the name they have been reading under rather than
 * starting again. That is why `name` is a real stored field and not derived
 * from `avatar` at read time: an account connecting later needs the name that
 * was actually on screen, even if this build's naming table has moved on.
 *
 * Same store shape as progress.tsx and for the same reason: localStorage is an
 * external mutable store that doesn't exist during SSR, so this is a
 * useSyncExternalStore store rather than state-plus-an-effect. The server
 * snapshot is "nobody yet", and the real one swaps in after mount with no
 * hydration mismatch.
 *
 * `id` is a random per-device string, not a user id — it exists so that when
 * there IS a server to sync to, the rows written from this device can be
 * matched up. Nothing keys off it yet; progress deliberately stays on its own
 * unscoped key, because rescoping it now would read as wiping the ticks a
 * reader already has.
 * ------------------------------------------------------------------ */

const KEY = "booklesss:identity:v1";

/**
 * The username each avatar carries.
 *
 * PRODUCT COPY, not alt text — this is what a study group calls somebody, what
 * the greeting says every morning, and what will sit beside their comments.
 * Read the whole list before changing it: a word that is merely odd in English
 * can be unflattering in Zambia, and this one becomes a person.
 *
 * Deliberately NOT in avatars.tsx, which is generated from an icon set: a name
 * here is a decision about people, an entry there is metadata about a drawing,
 * and `npm run gen:avatars` would quietly overwrite the first with the second.
 * Kept as a total Record so adding a thirteenth avatar without naming it is a
 * type error rather than a student called "undefined".
 *
 * Each name says what the picture shows, because the tie between the two is
 * the whole idea — a Rainbow whose picture is a robot is a username, not an
 * identity. Where the icon's own label is a description rather than a name
 * ("Party popper", "Flying saucer", "Ice skate"), the name is the shortest
 * thing you could actually call someone.
 */
export const AVATAR_NAMES: Record<AvatarId, string> = {
  astronaut: "Astronaut",
  robot: "Robot",
  smiley: "Smiley",
  peace: "Peace",
  ladybug: "Ladybird",
  butterfly: "Butterfly",
  ufo: "Saucer",
  party: "Confetti",
  rainbow: "Rainbow",
  strawberry: "Strawberry",
  dice: "Dice",
  skate: "Skater",
};

/** Days a week, and minutes on each of those days. */
export type StudyTarget = { days: number; minutes: number };

/** Held to the ranges the onboarding step offers, because this arrives from
 *  localStorage and from account metadata, both of which a stranger can
 *  write. A target of 0 days would divide the dashboard by zero. */
export function parseTarget(v: unknown): StudyTarget | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const days = Math.round(Number(o.days));
  const minutes = Math.round(Number(o.minutes));
  if (!Number.isFinite(days) || !Number.isFinite(minutes)) return null;
  if (days < 1 || days > 7 || minutes < 5 || minutes > 480) return null;
  return { days, minutes };
}

export type Identity = {
  /** What to call them: the name of the avatar they were assigned. Trimmed,
   *  never empty — a record without one is treated as no record at all. */
  name: string;
  avatar: AvatarId;
  /** Where they study. `null` until they set it in Settings, which most never
   *  will, and on any record naming a school this build no longer carries. */
  school: SchoolChoice | null;
  /** The university they typed when theirs wasn't on the list. Set only
   *  alongside `school: "other"` — a demand signal for where to go next, and
   *  the only free text this app stores about anybody. */
  schoolName: string | null;
  /** Course slugs they're taking, as in course-index.json. Empty means "all of
   *  them" — see `coursesChosen` for why that is not the same as unanswered. */
  courses: string[];
  /**
   * Whether anyone has actually been ASKED which courses they take.
   *
   * `courses: []` cannot carry this on its own, and that ambiguity is the bug
   * the owner hit (2026-08-03: "I should not have been allowed to get here
   * without picking my courses"). Empty meant both "I haven't said" and "I
   * want the whole library", so `enrolledCourses` read it as everything and
   * nothing ever asked. Gate the ask on empty alone and a reader who genuinely
   * wants all four courses gets asked forever.
   *
   * So the answer is stored separately from the choice. False on a device that
   * has only ever read anonymously; true the moment somebody picks, INCLUDING
   * when they pick "everything" — which is a real answer, not a skip.
   */
  coursesChosen: boolean;
  /**
   * What the student said they'd do in a week: study days, and minutes on
   * each of them. Null until they say.
   *
   * Before this, the dashboard measured everyone against 5 days and 120
   * minutes — numbers nobody chose, invented in lib/performance and marked
   * there as owed. A score against a target the student set is a promise they
   * made; a score against ours is an opinion they never asked for.
   *
   * Stored as both raw halves rather than one weekly figure: "20 minutes most
   * days" and "an hour twice a week" are different habits that a single
   * number would flatten, and the north star needs the absolutes to compare
   * students at all.
   */
  target: StudyTarget | null;
  /** Random, per device. See the note above. */
  id: string;
  /** ISO date the identity was created, for a later "member since". */
  since: string;
};

/**
 * Has this student finished onboarding?
 *
 * ONE DEFINITION, because the dashboard now refuses to draw without it (owner,
 * 2026-08-04, on landing there himself: "a user is never supposed to hit this
 * screen with incomplete information from onboarding"). What he saw was the
 * real dashboard rendered over a record that had none of the answers in it: a
 * greeting with no name, four tiles of dashes, and ALL COURSES over a library
 * he had never been asked to narrow. Every one of those is correct code
 * reading an empty record — so the fix is not in the tiles, it is refusing to
 * render them until the record is filled.
 *
 * The three questions, and nothing else:
 *   - a school, and a typed name if it is one we don't carry. It decides which
 *     courses are even offered, so an unanswered school makes the next
 *     question unanswerable.
 *   - `coursesChosen`, not `courses.length`. "Show me everything" is a real
 *     answer that leaves the list empty; see the field's own note.
 *   - a target, because the Performance tile scores them against it. Without
 *     one the tile marks a student against a number nobody chose.
 *
 * Anonymous readers never pass this and are never asked to: the gate runs on
 * the dashboard alone, which already belongs to people with an account.
 *
 * The one way to un-complete a finished record is Settings, by switching to
 * "Another university" and typing nothing — the sheet writes the school on the
 * tap. That is the same half-answer the flow refuses to accept, so the next
 * visit to the dashboard walks them back through it rather than treating a
 * university nobody named as an answer. Rare, deliberate, and it ends in a
 * complete record instead of a dead end.
 */
export function onboardingComplete(v: Identity | null | undefined): boolean {
  if (!v) return false;
  if (!v.school) return false;
  if (v.school === OTHER_SCHOOL && !v.schoolName) return false;
  if (!v.coursesChosen) return false;
  if (!v.target) return false;
  return true;
}

/** Which question to open on — the first one without an answer. The flow uses
 *  it to resume rather than restart, so closing the tab on question three does
 *  not cost a student the two they already answered. */
export function firstUnanswered(v: Identity | null | undefined): "school" | "courses" | "target" {
  if (!v?.school || (v.school === OTHER_SCHOOL && !v.schoolName)) return "school";
  if (!v.coursesChosen) return "courses";
  return "target";
}

let cache: Identity | null = null;
let read = false;
const listeners = new Set<() => void>();

function load(): Identity | null {
  if (read) return cache;
  read = true;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Identity>;
    // A stored record with no name is not an identity — treat it as unset so
    // the popup asks again rather than greeting an empty string.
    if (!v || typeof v.name !== "string" || !v.name.trim()) return null;
    cache = {
      name: v.name.trim(),
      // The avatar set has changed once already (Plump → Kameleon), so a
      // stored id is only kept if this build still draws it.
      avatar: resolveAvatar(v.avatar),
      school: isSchoolChoice(v.school) ? v.school : null,
      schoolName: typeof v.schoolName === "string" && v.schoolName.trim() ? v.schoolName.trim() : null,
      // Course slugs are validated where they're used (lib/courses), not here:
      // this module loads on every page and has no business pulling the course
      // tree in to check a list of strings.
      courses: Array.isArray(v.courses) ? v.courses.filter((c) => typeof c === "string") : [],
      /* A record written before this field existed, but carrying courses, was
         plainly answered by someone in Settings — treat it as asked rather
         than interrogating a reader who has already told us. */
      coursesChosen:
        v.coursesChosen === true || (Array.isArray(v.courses) && v.courses.length > 0),
      target: parseTarget(v.target),
      id: typeof v.id === "string" ? v.id : newId(),
      since: typeof v.since === "string" ? v.since : new Date().toISOString(),
    };
  } catch {
    // Unparseable or storage blocked (private mode, embedded webview) — the
    // app runs fine unidentified, so fall back rather than throw.
    cache = null;
  }
  return cache;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  // Another tab writing the same key is the same person changing their name.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      invalidate();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/* The snapshot carries `hydrated` for the same reason progress.tsx's does:
 * "nobody has said who they are" and "localStorage hasn't been read yet" are
 * both `null`, and only one of them should open a modal. Reading it off the
 * snapshot keeps that out of an effect, so nothing re-renders to find out. */
type Snapshot = { identity: Identity | null; hydrated: boolean };

const EMPTY: Snapshot = { identity: null, hydrated: false };
let snapshot: Snapshot = EMPTY;

function getSnapshot(): Snapshot {
  if (!snapshot.hydrated) snapshot = { identity: load(), hydrated: true };
  return snapshot;
}

function invalidate() {
  read = false;
  cache = null;
  snapshot = EMPTY;
}

/** The reader, plus whether that answer is the stored one yet. */
export function useIdentity(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** Saves everything the form asked. Keeps `id` and `since` across later edits. */
export function saveIdentity(input: {
  name: string;
  avatar: AvatarId;
  school: SchoolChoice | null;
  schoolName: string | null;
  courses: string[];
  /** Only the setup sheet and onboarding pass this — everywhere else,
   *  choosing any course is itself the answer, and an already-asked device
   *  stays asked. */
  coursesChosen?: boolean;
  /** Omit to keep what is stored; null clears it. */
  target?: StudyTarget | null;
}): Identity {
  const prev = load();
  const next: Identity = {
    name: input.name.trim(),
    avatar: input.avatar,
    school: input.school,
    // Only "other" carries a typed name; picking a listed school later must
    // not leave the old one behind to be read as their university.
    schoolName: input.school === OTHER_SCHOOL ? (input.schoolName?.trim() || null) : null,
    // Deduplicated so a double tap in the picker can't enrol anyone twice.
    courses: [...new Set(input.courses)],
    coursesChosen: input.coursesChosen ?? prev?.coursesChosen ?? input.courses.length > 0,
    // `undefined` keeps whatever is stored; an explicit null clears it.
    target: input.target === undefined ? (prev?.target ?? null) : parseTarget(input.target),
    id: prev?.id ?? newId(),
    since: prev?.since ?? new Date().toISOString(),
  };
  persist(next);
  return next;
}

/**
 * The answer to "which courses are you taking?" — the one question the app
 * asks, and only of someone who has made an account.
 *
 * An empty list is a legitimate answer here and means the whole library; what
 * makes it an answer rather than a silence is `coursesChosen`, which this
 * always sets. See the field's note.
 */
/**
 * Everything the onboarding flow collects, written as one answer.
 *
 * The flow saves after every step rather than at the end, so a student who
 * closes the tab on question three keeps what they said — and the sign-up
 * card at the end reads this straight off the device (see ClerkGate and the
 * onboarding page), which is how the answers reach the account.
 *
 * EVERY SAVE SAYS WHAT WAS ACTUALLY ANSWERED. This used to hard-code
 * `coursesChosen: true` on every write, including the one that stores the
 * school — so answering question one marked question two answered, with an
 * empty list, and a student who stopped there was recorded as having asked
 * for the whole library. `onboardingComplete` reads exactly these fields, so
 * a save that overstates them is a half-filled record that passes the gate.
 * The plan is the same: omit `target` until the student has seen the
 * question, rather than storing the form's default as their choice.
 */
export function saveOnboarding(input: {
  school: SchoolChoice | null;
  schoolName: string | null;
  courses: string[];
  /** True only once the courses question itself has been answered —
   *  "everything" included, since that is an answer and not a skip. */
  coursesChosen: boolean;
  /** Omit to keep whatever is stored; the flow only passes this from the
   *  question that asks for it. */
  target?: StudyTarget | null;
}): Identity {
  const prev = assignIdentity();
  return saveIdentity({
    name: prev.name,
    avatar: prev.avatar,
    school: input.school,
    schoolName: input.schoolName,
    courses: input.courses,
    coursesChosen: input.coursesChosen,
    ...(input.target === undefined ? {} : { target: input.target }),
  });
}

export function chooseCourses(slugs: string[]): Identity {
  /* assignIdentity rather than `load()`, because a record with no name is
     treated as no record at all — writing one here would erase the reader
     instead of enrolling them. It returns the existing identity untouched
     whenever there is one, which is every real case. */
  const prev = assignIdentity();
  return saveIdentity({
    name: prev.name,
    avatar: prev.avatar,
    school: prev.school,
    schoolName: prev.schoolName,
    courses: slugs,
    coursesChosen: true,
  });
}

function persist(next: Identity): void {
  cache = next;
  read = true;
  snapshot = { identity: next, hydrated: true };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: they stay identified for this session and get asked
    // again next visit. Better than blocking the reader on a failed write.
  }
  emit();
}

/* ------------------------------------------------------------------ *
 * The identity, on the account.
 *
 * Signing up CONNECTS the account to the identity this device already has —
 * the promise at the top of this file. What travels is the person-facing
 * part: the name, the face, and the day they first arrived. School, courses
 * and `id` stay on the device; the first two are reading preferences rather
 * than who somebody is, and the third exists precisely to tell devices apart.
 *
 * AccountSignal is the only caller of the reconcile pair: it writes
 * accountIdentity() up to a bare account, and adopts the account's identity
 * down onto any device this person signs in on — so the Astronaut is the
 * Astronaut on their laptop too, not a freshly rolled stranger.
 * ------------------------------------------------------------------ */

export type AccountIdentity = {
  name: string;
  avatar: AvatarId;
  since: string;
  /**
   * Where they study, and the university they typed if it is one we don't
   * carry.
   *
   * THIS USED TO STAY ON THE DEVICE, on the reasoning that a school is a
   * reading preference rather than who somebody is. That held while nothing
   * depended on it. It stopped holding when the dashboard began refusing to
   * render an unfinished record: an answer that doesn't travel is an answer a
   * second device doesn't have, and the student who answered on their phone
   * would be marched back through onboarding on a borrowed laptop — which is
   * the same bug as never asking, seen from the other side.
   */
  school: SchoolChoice | null;
  schoolName: string | null;
  /** Carried so a second device does not ask a question this person has
   *  already answered — see above. */
  courses: string[];
  coursesChosen: boolean;
  /** The promise the dashboard scores them against — theirs, not ours, so it
   *  has to travel with the account rather than sit on one phone. */
  target: StudyTarget | null;
};

/** The device's identity shaped for account metadata, or null before any has
 *  been assigned. A plain accessor, not a hook — ClerkGate builds sign-up
 *  metadata inside an event's effect, and AccountSignal heals outside render. */
export function accountIdentity(): AccountIdentity | null {
  const v = load();
  return v
    ? {
        name: v.name,
        avatar: v.avatar,
        since: v.since,
        school: v.school,
        schoolName: v.schoolName,
        courses: v.courses,
        coursesChosen: v.coursesChosen,
        target: v.target,
      }
    : null;
}

/** Account metadata is `unsafeMetadata` — any signed-in browser can write it —
 *  so what comes back is stranger input, held to the same bar as a stored
 *  localStorage record: no usable name means no identity at all, an avatar id
 *  is only kept if this build still draws it, a date has to parse. */
export function parseAccountIdentity(v: unknown): AccountIdentity | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim().slice(0, 40) : "";
  if (!name) return null;
  return {
    name,
    avatar: resolveAvatar(typeof o.avatar === "string" ? o.avatar : null),
    since:
      typeof o.since === "string" && !Number.isNaN(Date.parse(o.since))
        ? o.since
        : new Date().toISOString(),
    school: isSchoolChoice(o.school) ? o.school : null,
    schoolName:
      typeof o.schoolName === "string" && o.schoolName.trim() ? o.schoolName.trim().slice(0, 80) : null,
    // Slugs are validated where they're used (lib/courses), as they are on the
    // stored record — this only guarantees the shape.
    courses: Array.isArray(o.courses) ? o.courses.filter((c): c is string => typeof c === "string") : [],
    coursesChosen: o.coursesChosen === true,
    target: parseTarget(o.target),
  };
}

/** The account's identity lands on this device. Sign-in on a new phone is the
 *  same person arriving, so the account wins over the placeholder the device
 *  rolled for itself. Keeps the device's school, courses and `id`; takes the
 *  account's `since`, because "member since" is about the person, not the
 *  phone they happen to be holding. */
export function adoptIdentity(acct: AccountIdentity): Identity {
  const next = mergeAccount(acct, load());
  persist(next);
  return next;
}

/**
 * The account's record and the device's, reconciled — pure, so AccountSignal
 * can ask what the answer WOULD be before deciding whether to write.
 *
 * The rule is the same on every field: the account wins where it has an
 * answer, and the device keeps what the account never learned. That second
 * half is what lets somebody answer on this phone against a bare account and
 * have it written upward a moment later instead of being wiped by it.
 *
 * IDEMPOTENT, and it has to be: AccountSignal compares this against what is
 * stored to decide whether to adopt, so merging an already-merged record must
 * come back unchanged or the two would write to each other forever. The one
 * non-deterministic field, `id`, only ever comes from `prev` — a device
 * without one is a device with no record at all, which is adopted outright
 * rather than compared.
 */
function mergeAccount(acct: AccountIdentity, prev: Identity | null): Identity {
  const school = acct.school ?? prev?.school ?? null;
  const takeCourses = acct.coursesChosen;
  return {
    name: acct.name,
    avatar: acct.avatar,
    school,
    // Only "other" carries a typed name, and it must come from whichever side
    // the school itself came from — an account's school with the device's
    // typed name would be two people's answers spliced together.
    schoolName:
      school !== OTHER_SCHOOL ? null : (acct.school ? acct.schoolName : (prev?.schoolName ?? null)),
    courses: takeCourses ? acct.courses : (prev?.courses ?? []),
    coursesChosen: takeCourses || (prev?.coursesChosen ?? false),
    target: acct.target ?? prev?.target ?? null,
    id: prev?.id ?? newId(),
    since: acct.since,
  };
}

/** Whether the stored record already IS the merge — everything but `id`,
 *  which is per-device by design and never travels. */
export function matchesAccount(id: Identity | null, acct: AccountIdentity): boolean {
  if (!id) return false;
  const next = mergeAccount(acct, id);
  return (
    id.name === next.name &&
    id.avatar === next.avatar &&
    id.since === next.since &&
    id.school === next.school &&
    id.schoolName === next.schoolName &&
    id.coursesChosen === next.coursesChosen &&
    id.courses.length === next.courses.length &&
    id.courses.every((s, i) => s === next.courses[i]) &&
    id.target?.days === next.target?.days &&
    id.target?.minutes === next.target?.minutes
  );
}

/** Whether this device knows an answer the account hasn't got — the cue for
 *  the upward write. Only ever "the account is missing something", never "the
 *  two differ": where both have an answer the account's is the one that
 *  stands, and mergeAccount has already applied it. */
export function accountBehind(id: Identity | null, acct: AccountIdentity): boolean {
  if (!id) return false;
  return (
    (!acct.school && !!id.school) ||
    (!acct.coursesChosen && id.coursesChosen) ||
    (!acct.target && !!id.target)
  );
}

/**
 * Gives this device an identity, if it doesn't have one. Returns whatever it
 * is now, assigned or already there.
 *
 * This is what replaced the first-visit form. It runs on mount, on whatever
 * page the reader happened to land on, and shows nothing: by the time the
 * greeting renders there is a name to put in it, and the reader was never
 * asked for one.
 *
 * Collisions are certain and are the cost of never asking — two Astronauts in
 * one course is fine. If it ever grates, the tiebreak is a number, not a form.
 *
 * Idempotent on purpose. React runs effects twice in development, two tabs can
 * open at once, and a re-render must not reroll somebody's face; so an existing
 * record always wins and nothing here overwrites one.
 */
export function assignIdentity(): Identity {
  const existing = load();
  if (existing) return existing;

  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)].id;
  return saveIdentity({
    name: AVATAR_NAMES[avatar],
    avatar,
    // Not asked, and not a gap to be filled in later by anything but the
    // reader themselves, in Settings. Empty courses reads as the whole library.
    school: null,
    schoolName: null,
    // Nothing asked yet — the whole library, and marked as unanswered so the
    // setup sheet knows to ask once there is an account to hang it on.
    courses: [],
    coursesChosen: false,
    target: null,
  });
}

/** Erases the identity from this device. Used by Settings' "forget this
 *  device", which pairs it with clearProgress() and a reload — every store on
 *  the page is holding a copy of what this just deleted. */
export function clearIdentity(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: nothing was stored to remove.
  }
  invalidate();
  emit();
}

/** The ISO date this device was first given an identity — the app's only
 *  record of "have you been here before". For plain-function callers (the
 *  greeting picks once at mount, outside React); returns null on the server
 *  and on a device that hasn't been assigned yet. */
export function identitySince(): string | null {
  return load()?.since ?? null;
}

/** Up to two letters for the fallback monogram — "Deeky Mvula" -> "DM". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
