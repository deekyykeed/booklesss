"use client";

import { useSyncExternalStore } from "react";
import { AVATARS, avatarLabel, resolveAvatar, type AvatarId } from "@/components/identity/avatars";
import { isSchoolChoice, OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";
import { OTHER_PROGRAMME } from "@/lib/curriculum-text";

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
 *
 * NO LONGER TOTAL, and it cannot be. It was a Record over twelve ids, so
 * missing one was a type error; the set is 200 now and hand-naming all of them
 * would be 200 decisions about how a person sounds in Zambia, made in one
 * sitting, most of them never used. So these twelve keep their considered names
 * and `avatarName()` falls back to the icon's own label for the rest — which is
 * already a noun, already reads as a handle ("Anvil", "Beach"), and is at worst
 * plain rather than wrong.
 *
 * The names that ARE here matter more than the ones that are not: they are the
 * twelve people already carry.
 *
 * Each says what the picture shows, because the tie between the two is the
 * whole idea — a Rainbow whose picture is a robot is a username, not an
 * identity. Where the icon's own label is a description rather than a name
 * ("Party popper", "Flying saucer", "Ice skate"), the name is the shortest
 * thing you could actually call someone.
 */
export const AVATAR_NAMES: Record<string, string> = {
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

/**
 * What to call whoever wears this face.
 *
 * A considered name where one exists, the icon's own label otherwise. The
 * fallback is not a compromise so much as an admission: 200 faces cannot each
 * get a name weighed for how it lands in Zambia, and "Anvil" is a plain handle
 * rather than a wrong one. The twelve above are the ones people already carry.
 *
 * THE TRAILING NUMBER COMES OFF, and it is the difference between plain and
 * wrong. An icon set numbers its near-duplicates — the second certificate is
 * "Certificate 2", the twelfth man "Man 12" — and 35 of the 200 labels carry
 * one. That is a 1-in-6 chance the app greets a brand new student as
 * "Certificate 2" every morning, which is not a name, it is a row id. The
 * argument for the fallback was that a drawing's label is at worst plain; a
 * number on the end is the case where that stops being true.
 *
 * Only a number that is the WHOLE last word goes: "R2d2" is a name and keeps
 * its digits. What is left can collide — "Pencil" and "Pencil 2" become the
 * same handle — and collisions were already accepted here and for the same
 * reason: two Astronauts in one course is fine, and the tiebreak, if it is
 * ever wanted, is a number we choose rather than one the icon set left behind.
 */
export function avatarName(avatar: string): string {
  const named = AVATAR_NAMES[avatar];
  if (named) return named;
  return avatarLabel(avatar).replace(/\s+\d+$/, "").trim() || avatarLabel(avatar);
}

/**
 * How many days a week, how long on each — and, now, WHICH days.
 *
 * `weekdays` holds 0..6 with 0 = Monday (owner, 2026-08-04: "instead of showing
 * the number of days, just show a list of days, Monday Tuesday Wednesday, and
 * let them pick the days"). A count was a number somebody agreed to in the
 * abstract; named days are a plan you either kept on Tuesday or did not, which
 * is the difference between a target and a wish.
 *
 * `days` STAYS, and stays authoritative for anything counting. It is
 * `weekdays.length` whenever weekdays are present, so lib/performance keeps
 * working untouched and every record written before this — where nobody was
 * ever asked which days — still parses and still scores. Optional for exactly
 * that reason: it is an addition, not a replacement.
 */
export type StudyTarget = { days: number; minutes: number; weekdays?: number[] };

/**
 * When the hard stuff goes in easiest (owner, 2026-08-04: "ask what time of the
 * day they usually find it easy to learn complex topics, whether they are a
 * night owl or whatever").
 *
 * A WINDOW, NOT A CLOCK TIME. "Half past six" is a promise about a minute;
 * "evening" is a fact about a person, and it is the fact the app needs — to
 * decide when a ping is worth sending, and to know whether a student who
 * studies at midnight is failing at mornings or simply not a morning person.
 *
 * Deliberately separate from `weekdays`: which days you will study is a plan
 * you make, and when your head works is a thing about you that no plan
 * changes. A student can promise Tuesday and still be useless before noon.
 */
export type StudyWindow = "early-morning" | "morning" | "afternoon" | "evening" | "night";

/**
 * How they say they found us (owner, 2026-08-04: "how did you hear about us is
 * very important — even though id know but its better they say it incase its an
 * odd link").
 *
 * DELIBERATELY REDUNDANT WITH `referredBy`, and the redundancy is the point. The
 * referral code says which link a device arrived on; this says what a student
 * thinks brought them. They disagree in exactly the cases worth knowing about —
 * a link forwarded through three WhatsApp groups still carries the first
 * sharer's code, and a flyer or a word-of-mouth arrival carries none at all. One
 * is measurement, the other is attribution, and only the second can be asked.
 */
export type HeardFrom =
  | "friend"
  | "whatsapp-group"
  | "tiktok"
  | "facebook"
  | "flyer"
  | "search"
  | "other";

const HEARD_FROM: HeardFrom[] = [
  "friend",
  "whatsapp-group",
  "tiktok",
  "facebook",
  "flyer",
  "search",
  "other",
];

export function isHeardFrom(v: unknown): v is HeardFrom {
  return typeof v === "string" && (HEARD_FROM as string[]).includes(v);
}

const STUDY_WINDOWS: StudyWindow[] = ["early-morning", "morning", "afternoon", "evening", "night"];

export function isStudyWindow(v: unknown): v is StudyWindow {
  return typeof v === "string" && (STUDY_WINDOWS as string[]).includes(v);
}

/**
 * A Zambian mobile number, normalised to +260XXXXXXXXX.
 *
 * Accepts the four things people actually type — 0977123456, 977123456,
 * +260977123456, 260977123456 — plus any spaces, dashes or brackets they put
 * in, and returns one shape or null. One shape matters because this is a key
 * the owner will paste into WhatsApp: two spellings of the same number are two
 * students who are one student.
 *
 * Zambian mobiles are 9 digits after the country code and start 7 or 9 (MTN,
 * Airtel, Zamtel). Landlines are not accepted — this is for WhatsApp.
 */
export function normalisePhone(raw: string): string | null {
  const d = raw.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const local = d.startsWith("260") ? d.slice(3) : d.startsWith("0") ? d.slice(1) : d;
  return /^[79]\d{8}$/.test(local) ? `+260${local}` : null;
}

/** Held to the ranges the onboarding step offers, because this arrives from
 *  localStorage and from account metadata, both of which a stranger can
 *  write. A target of 0 days would divide the dashboard by zero. */
export function parseTarget(v: unknown): StudyTarget | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  /* Deduped, in range, sorted — it is read back as "your days" and a record
     saying [1,1,9] would draw Tuesday twice and something that is not a day. */
  const weekdays = Array.isArray(o.weekdays)
    ? [...new Set(o.weekdays.map(Number).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort(
        (a, b) => a - b,
      )
    : [];
  // Named days win over any stored count: if we know which, "how many" is not a
  // separate fact that could disagree with them.
  const days = weekdays.length || Math.round(Number(o.days));
  const minutes = Math.round(Number(o.minutes));
  if (!Number.isFinite(days) || !Number.isFinite(minutes)) return null;
  if (days < 1 || days > 7 || minutes < 5 || minutes > 480) return null;
  return { days, minutes, ...(weekdays.length ? { weekdays } : {}) };
}

export type Identity = {
  /** What to call them: the name of the avatar they were assigned. Trimmed,
   *  never empty — a record without one is treated as no record at all. */
  name: string;
  avatar: AvatarId;
  /**
   * Whether the student typed this name themselves, rather than being given it.
   *
   * ANONYMOUS-BY-DEFAULT STILL STANDS, and this does not undo it. That rule
   * protects the stranger who taps a WhatsApp link to READ — they are still
   * given a name and a face on the spot, still asked nothing, still never meet a
   * form. What changed is that somebody who has chosen to make an account is
   * asked (owner, 2026-08-04: "i didnt get to pick my avatar, can i not select
   * it during onboarding?" and "i didnt set my name with that"). Those are two
   * different people and always were; the 200-face set was built for the second
   * one, whose own note says a student "picks from twelve UNCLAIMED faces".
   *
   * Stored separately from `name` for the same reason `coursesChosen` is stored
   * separately from `courses`: the field is never empty, so it cannot say on its
   * own whether anyone was asked. "Astronaut" is a real value and a non-answer
   * at the same time, and only this tells them apart — which is what stops
   * AccountSignal writing an avatar's name into Clerk as somebody's real one.
   */
  nameChosen: boolean;
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
  /**
   * When complex material actually goes in — see StudyWindow.
   *
   * Asked beside the weekly goal because it completes it: which days, how long,
   * and when. Part of `onboardingComplete` for the same reason the target is —
   * it is one tap on a screen the student is already on, and the plan is not a
   * plan without it.
   */
  studyWindow: StudyWindow | null;
  /**
   * Their WhatsApp number, as +260XXXXXXXXX (owner, 2026-08-04: "we should get
   * this person's whatsapp number so that we can hold them accountable and
   * other reasons as well"). REQUIRED — see onboardingComplete.
   *
   * THE MOST SENSITIVE THING THIS APP STORES, and the only field that can reach
   * a person off the platform. Everything else here is a preference; this is a
   * way to contact somebody. It travels to the account and to Supabase like the
   * rest, and normalisePhone is what keeps it one value rather than four
   * spellings of the same student.
   *
   * The privacy policy has to say what it is used for before this ships to real
   * students, because "accountability" is us messaging them and that is exactly
   * what a person handing over a number is entitled to know in advance.
   */
  whatsapp: string | null;
  /**
   * What they say brought them here — see HeardFrom. Required, because it is one
   * tap and it is the only attribution that exists for a student who arrived on
   * no link at all.
   */
  heardFrom: HeardFrom | null;
  /**
   * The programme they are on, as a slug in programme-index.json — and the year
   * of it they are in.
   *
   * Both null where we don't know, which today is most people: only one
   * university has had its curriculum scraped, so the flow skips these two
   * questions everywhere else (see lib/programmes). They are NOT part of
   * `onboardingComplete` for that reason — they make the course question
   * answerable in one tap instead of ten, they are not themselves the record.
   *
   * Deliberately not validated here against the programme index. This module
   * loads on every page including the reader, and pulling 81KB of curriculum in
   * to check two strings is the trade lib/programmes exists to avoid.
   */
  programme: string | null;
  /**
   * The programme they TYPED, when it is one we do not carry.
   *
   * The same pair as `school` / `schoolName`, one level down, and for the same
   * reason — except that here the unlisted case is the majority. 19 ZCAS
   * programmes, 98 UNZA ones and 106 Mulungushi ones publish no curriculum, so
   * they are not in programme-index at all and a student on one of them would
   * otherwise reach a picker that does not contain their degree.
   *
   * `programme` holds OTHER_PROGRAMME when this is set, so one field always
   * answers "did they find themselves in our list".
   */
  programmeName: string | null;
  year: number | null;
  /**
   * Which half of that year they are in — 1 or 2, null where we never asked.
   *
   * Owner, 2026-08-04, on a whole year arriving pre-ticked: "don't like that we
   * automatically tick all these courses — what if I just tick the 4 in the
   * semester they are going into?" A year is eight courses where a student sits
   * four, so without this the record overstated everyone's load by double: the
   * dashboard listed courses nobody was taking, the retake signal compared a
   * count against 8 when the norm it is judged against is 4 a semester, and the
   * demand ranking could not say which semester to write first.
   *
   * NOT part of `onboardingComplete`, on the same reasoning as `programme` and
   * `year`: it makes the course question answerable in four taps instead of
   * eight, it is not itself the record. A programme whose source never recorded
   * semesters skips the question and keeps the whole-year behaviour.
   *
   * It has a shelf life. Once a campus academic calendar is on file (see
   * lib/schools), today's date says which semester a student is in and the
   * question can go.
   */
  semester: number | null;
  /**
   * Every course they ticked off their own timetable, as curriculum slugs —
   * INCLUDING the ones nobody has written yet.
   *
   * Separate from `courses`, which holds built-course slugs and drives the
   * dashboard. Owner, 2026-08-04: "we should show them literally all the
   * courses not just what we've built, that way we can prioritise building
   * properly." So a student ticks their real eight, three of which exist; the
   * three land in `courses` and all eight land here.
   *
   * Keeping them apart is what stops the dashboard rendering five courses with
   * no content behind them, while still recording that five people on that
   * programme wanted Financial Reporting — which is the number that should
   * decide what gets built next.
   */
  curriculum: string[];
  /**
   * Courses they TYPED, as titles, because nothing was on file to tick.
   *
   * Not slugs: a course nobody has scraped has no slug to be, and inventing one
   * on the device would mean two students' spellings becoming two courses. The
   * title is what they said, and normalising it into something countable is a
   * server job (lib/curriculum-text, /api/profile).
   *
   * This is the seam the whole "fill it in as students arrive" plan hangs on —
   * every one of these is a line in the curriculum of a university that
   * publishes none.
   */
  typedCourses: string[];
  /** Random, per device. See the note above. */
  id: string;
  /** ISO date the identity was created, for a later "member since". */
  since: string;
  /**
   * When this record was last ANSWERED — stamped by saveIdentity, and by
   * nothing else.
   *
   * It exists because the merge had no way to tell which of two copies was
   * written last, and guessed. The account's copy is a snapshot of the device
   * taken at sign-up; the student then answers ten questions against the
   * device, and every one of those answers is NEWER than the snapshot sitting
   * in Clerk. Without a clock the merge read that snapshot as authority and
   * handed it back down — see mergeAccount for what that cost.
   *
   * NOT touched by `persist`, which is what makes the merge settle: adopting a
   * record must not make the device look freshly answered, or the two copies
   * would out-date each other forever.
   *
   * A record written before this field existed falls back to `since` — the one
   * date it definitely has, and never newer than an account snapshot taken
   * after it.
   */
  updatedAt: string;
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
  /* A name they chose. Every record has a name, so `name` alone cannot gate
     this — see nameChosen. */
  if (!v.nameChosen) return false;
  if (!v.school) return false;
  if (v.school === OTHER_SCHOOL && !v.schoolName) return false;
  if (!v.coursesChosen) return false;
  /* The number is REQUIRED (owner, 2026-08-04). It is the only answer here that
     is worth something to us rather than to the student, so it is the only one
     a student could reasonably resent — which is the argument for asking it in
     the middle of the flow rather than last, where a refusal costs everything
     already given. It is not a question the dashboard can work around: being
     held to a goal you set means somebody being able to reach you. */
  if (!v.whatsapp) return false;
  if (!v.target) return false;
  /* Half a plan is not a plan. The window is one tap on the screen that already
     asks for the days and the length, so a record with a target and no window
     is a student who left mid-question, not one who declined. */
  if (!v.studyWindow) return false;
  /* One tap, and the only thing that will ever say whether the flyers worked —
     a student who walked in off a poster carries no referral code to count. */
  if (!v.heardFrom) return false;
  return true;
}

/** Which question to open on — the first one without an answer. The flow uses
 *  it to resume rather than restart, so closing the tab on question three does
 *  not cost a student the two they already answered. */
export function firstUnanswered(
  v: Identity | null | undefined,
): "school" | "courses" | "whatsapp" | "target" | "heard" {
  if (!v?.school || (v.school === OTHER_SCHOOL && !v.schoolName)) return "school";
  if (!v.coursesChosen) return "courses";
  if (!v.whatsapp) return "whatsapp";
  if (!v.target || !v.studyWindow) return "target";
  return "heard";
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
      nameChosen: v.nameChosen === true,
      target: parseTarget(v.target),
      studyWindow: isStudyWindow(v.studyWindow) ? v.studyWindow : null,
      // Re-normalised on read, not trusted as stored: a record written by an
      // older build, or by hand, may hold whatever the field once accepted.
      whatsapp: typeof v.whatsapp === "string" ? normalisePhone(v.whatsapp) : null,
      heardFrom: isHeardFrom(v.heardFrom) ? v.heardFrom : null,
      programme: typeof v.programme === "string" && v.programme ? v.programme : null,
      programmeName:
        typeof v.programmeName === "string" && v.programmeName.trim()
          ? v.programmeName.trim().slice(0, 160)
          : null,
      // A year is 1..6 across every programme scraped (a masters starts at 5).
      // Anything else is a record from a build that meant something different.
      year: typeof v.year === "number" && v.year >= 1 && v.year <= 6 ? v.year : null,
      semester: v.semester === 1 || v.semester === 2 ? v.semester : null,
      curriculum: Array.isArray(v.curriculum) ? v.curriculum.filter((c) => typeof c === "string") : [],
      typedCourses: Array.isArray(v.typedCourses)
        ? v.typedCourses.filter((c) => typeof c === "string")
        : [],
      id: typeof v.id === "string" ? v.id : newId(),
      since: typeof v.since === "string" ? v.since : new Date().toISOString(),
      // Falls back to `since` on a record written before the field existed —
      // see the field's note.
      updatedAt:
        typeof v.updatedAt === "string"
          ? v.updatedAt
          : typeof v.since === "string"
            ? v.since
            : new Date().toISOString(),
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
  /** Only the screen that ASKS passes this. Everywhere else omits it and an
   *  already-asked device stays asked. */
  nameChosen?: boolean;
  school: SchoolChoice | null;
  schoolName: string | null;
  courses: string[];
  /** Only the setup sheet and onboarding pass this — everywhere else,
   *  choosing any course is itself the answer, and an already-asked device
   *  stays asked. */
  coursesChosen?: boolean;
  /** Omit to keep what is stored; null clears it. */
  target?: StudyTarget | null;
  /** Omit to keep what is stored; null clears. Same rule as `target`. */
  studyWindow?: StudyWindow | null;
  whatsapp?: string | null;
  heardFrom?: HeardFrom | null;
  /** Omit any of these to keep what is stored. See the fields' notes. */
  programme?: string | null;
  programmeName?: string | null;
  year?: number | null;
  semester?: number | null;
  curriculum?: string[];
  typedCourses?: string[];
}): Identity {
  const prev = load();
  const next: Identity = {
    name: input.name.trim(),
    avatar: input.avatar,
    nameChosen: input.nameChosen ?? prev?.nameChosen ?? false,
    school: input.school,
    // Only "other" carries a typed name; picking a listed school later must
    // not leave the old one behind to be read as their university.
    schoolName: input.school === OTHER_SCHOOL ? (input.schoolName?.trim() || null) : null,
    // Deduplicated so a double tap in the picker can't enrol anyone twice.
    courses: [...new Set(input.courses)],
    coursesChosen: input.coursesChosen ?? prev?.coursesChosen ?? input.courses.length > 0,
    // `undefined` keeps whatever is stored; an explicit null clears it.
    target: input.target === undefined ? (prev?.target ?? null) : parseTarget(input.target),
    studyWindow:
      input.studyWindow === undefined
        ? (prev?.studyWindow ?? null)
        : (isStudyWindow(input.studyWindow) ? input.studyWindow : null),
    whatsapp:
      input.whatsapp === undefined
        ? (prev?.whatsapp ?? null)
        : (input.whatsapp ? normalisePhone(input.whatsapp) : null),
    heardFrom:
      input.heardFrom === undefined
        ? (prev?.heardFrom ?? null)
        : (isHeardFrom(input.heardFrom) ? input.heardFrom : null),
    programme: input.programme === undefined ? (prev?.programme ?? null) : input.programme,
    // Only OTHER_PROGRAMME carries a typed name, on the same rule the school
    // pair follows: picking a listed programme later must not leave the old
    // typed one behind to be read as their degree.
    programmeName:
      input.programme !== undefined && input.programme !== OTHER_PROGRAMME
        ? null
        : input.programmeName === undefined
          ? (prev?.programmeName ?? null)
          : (input.programmeName?.trim() || null),
    year: input.year === undefined ? (prev?.year ?? null) : input.year,
    semester:
      input.semester === undefined
        ? (prev?.semester ?? null)
        : (input.semester === 1 || input.semester === 2 ? input.semester : null),
    curriculum: input.curriculum === undefined ? (prev?.curriculum ?? []) : [...new Set(input.curriculum)],
    typedCourses:
      input.typedCourses === undefined ? (prev?.typedCourses ?? []) : [...new Set(input.typedCourses)],
    id: prev?.id ?? newId(),
    since: prev?.since ?? new Date().toISOString(),
    /* THE ONLY PLACE THIS IS STAMPED. This function is the one that writes an
       ANSWER — every question in the flow, and every control in Settings, comes
       through here — so a save is exactly the event the merge needs to date.
       adoptIdentity deliberately does not stamp: see mergeAccount. */
    updatedAt: new Date().toISOString(),
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
 * answers are pushed to the account by profile-sync as they are given, which
 * is how they reach a second device.
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
  /** Passed only by the screen that asks. Omitted everywhere else, where the
   *  name and face already on the record stand. */
  name?: string;
  avatar?: AvatarId;
  nameChosen?: boolean;
  school: SchoolChoice | null;
  schoolName: string | null;
  courses: string[];
  /** True only once the courses question itself has been answered —
   *  "everything" included, since that is an answer and not a skip. */
  coursesChosen: boolean;
  /** Omit to keep whatever is stored; the flow only passes this from the
   *  question that asks for it. */
  target?: StudyTarget | null;
  /** Same rule: passed only by the question that asks for it. */
  studyWindow?: StudyWindow | null;
  whatsapp?: string | null;
  heardFrom?: HeardFrom | null;
  /** Same rule for all of these: passed only by the question that asks. */
  programme?: string | null;
  programmeName?: string | null;
  year?: number | null;
  semester?: number | null;
  curriculum?: string[];
  typedCourses?: string[];
}): Identity {
  const prev = assignIdentity();
  return saveIdentity({
    name: input.name?.trim() || prev.name,
    avatar: input.avatar ?? prev.avatar,
    ...(input.nameChosen === undefined ? {} : { nameChosen: input.nameChosen }),
    school: input.school,
    schoolName: input.schoolName,
    courses: input.courses,
    coursesChosen: input.coursesChosen,
    ...(input.target === undefined ? {} : { target: input.target }),
    ...(input.studyWindow === undefined ? {} : { studyWindow: input.studyWindow }),
    ...(input.whatsapp === undefined ? {} : { whatsapp: input.whatsapp }),
    ...(input.heardFrom === undefined ? {} : { heardFrom: input.heardFrom }),
    ...(input.programme === undefined ? {} : { programme: input.programme }),
    ...(input.programmeName === undefined ? {} : { programmeName: input.programmeName }),
    ...(input.year === undefined ? {} : { year: input.year }),
    ...(input.semester === undefined ? {} : { semester: input.semester }),
    ...(input.curriculum === undefined ? {} : { curriculum: input.curriculum }),
    ...(input.typedCourses === undefined ? {} : { typedCourses: input.typedCourses }),
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
  /** Travels, or a student who named themselves on their phone is asked again
   *  on a borrowed laptop — and worse, `onboardingComplete` would refuse the
   *  dashboard until they did. */
  nameChosen: boolean;
  since: string;
  /** When the copy this was made from was last answered — the whole basis on
   *  which the merge decides who is right. See Identity.updatedAt. */
  updatedAt: string;
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
  /** Both travel: the window is half the plan, and the number is the thing that
   *  makes accountability possible from any device they sign in on. */
  studyWindow: StudyWindow | null;
  whatsapp: string | null;
  heardFrom: HeardFrom | null;
  /** The programme, the year, and everything they ticked off its timetable.
   *  Travels for the same reason `courses` does: a student who answered on
   *  their phone must not be asked again on a borrowed laptop — and this is the
   *  answer that took the most taps to give. */
  programme: string | null;
  programmeName: string | null;
  year: number | null;
  semester: number | null;
  curriculum: string[];
  /** Travels for the same reason, and matters more: for a student at a
   *  university that publishes no curriculum this list IS their timetable, and
   *  there is nothing on file to rebuild it from if it stays on one phone. */
  typedCourses: string[];
};

/** The device's identity shaped for the account's copy, or null before any has
 *  been assigned. A plain accessor rather than a hook, so it can be called from
 *  an event handler or an effect. */
export function accountIdentity(): AccountIdentity | null {
  const v = load();
  return v ? asAccount(v) : null;
}

/** A stored record shaped for the account. Split out from `accountIdentity` so
 *  the merge's own result can be compared against the account in the same
 *  shape.
 *
 *  EXPORTED since 2026-08-05, as `accountShape`: profile-sync sends this exact
 *  object to /api/profile, which stores it verbatim in `students.identity` —
 *  the column AccountSignal reads back on the next sign-in. Taking it from the
 *  record in hand rather than from `accountIdentity()`, which re-reads
 *  localStorage, so the blob that goes up is provably the one the caller was
 *  looking at. */
export function accountShape(v: Identity): AccountIdentity {
  return asAccount(v);
}

function asAccount(v: Identity): AccountIdentity {
  return {
    name: v.name,
    avatar: v.avatar,
    nameChosen: v.nameChosen,
    since: v.since,
    updatedAt: v.updatedAt,
    school: v.school,
    schoolName: v.schoolName,
    courses: v.courses,
    coursesChosen: v.coursesChosen,
    target: v.target,
    studyWindow: v.studyWindow,
    whatsapp: v.whatsapp,
    heardFrom: v.heardFrom,
    programme: v.programme,
    programmeName: v.programmeName,
    year: v.year,
    semester: v.semester,
    curriculum: v.curriculum,
    typedCourses: v.typedCourses,
  };
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
    nameChosen: o.nameChosen === true,
    since:
      typeof o.since === "string" && !Number.isNaN(Date.parse(o.since))
        ? o.since
        : new Date().toISOString(),
    /* Falls back to `since` rather than to now, and the difference matters: an
       account written before this field existed must read as OLD, so the answers
       a student is giving on this device right now win over it. Defaulting to
       now would make every legacy account permanently newer than the person
       using it. */
    updatedAt:
      typeof o.updatedAt === "string" && !Number.isNaN(Date.parse(o.updatedAt))
        ? o.updatedAt
        : typeof o.since === "string" && !Number.isNaN(Date.parse(o.since))
          ? o.since
          : new Date(0).toISOString(),
    school: isSchoolChoice(o.school) ? o.school : null,
    schoolName:
      typeof o.schoolName === "string" && o.schoolName.trim() ? o.schoolName.trim().slice(0, 80) : null,
    // Slugs are validated where they're used (lib/courses), as they are on the
    // stored record — this only guarantees the shape.
    courses: Array.isArray(o.courses) ? o.courses.filter((c): c is string => typeof c === "string") : [],
    coursesChosen: o.coursesChosen === true,
    target: parseTarget(o.target),
    studyWindow: isStudyWindow(o.studyWindow) ? o.studyWindow : null,
    /* Held to the same shape as a stored record: unsafeMetadata is writable
       by any signed-in browser, so a number arriving from it is no more
       trusted than one typed into the form. */
    whatsapp: typeof o.whatsapp === "string" ? normalisePhone(o.whatsapp) : null,
    heardFrom: isHeardFrom(o.heardFrom) ? o.heardFrom : null,
    programme: typeof o.programme === "string" && o.programme ? o.programme.slice(0, 120) : null,
    programmeName:
      typeof o.programmeName === "string" && o.programmeName.trim()
        ? o.programmeName.trim().slice(0, 160)
        : null,
    year: typeof o.year === "number" && o.year >= 1 && o.year <= 6 ? o.year : null,
    semester: o.semester === 1 || o.semester === 2 ? o.semester : null,
    /* Capped. Every other field here is one value; this is a list a signed-in
       browser can write freely, and unsafeMetadata has a size limit that a
       student's real answer will never approach. The longest programme on file
       is 33 courses. */
    curriculum: Array.isArray(o.curriculum)
      ? o.curriculum.filter((c): c is string => typeof c === "string").slice(0, 60)
      : [],
    /* Capped harder than `curriculum` and per-entry, because these are free
       text a signed-in browser writes: 20 courses of 90 characters is more
       than any real timetable and still nowhere near unsafeMetadata's limit. */
    typedCourses: Array.isArray(o.typedCourses)
      ? o.typedCourses
          .filter((c): c is string => typeof c === "string")
          .map((c) => c.trim().slice(0, 90))
          .filter(Boolean)
          .slice(0, 20)
      : [],
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
  /**
   * WHICH COPY WAS WRITTEN LAST.
   *
   * This is the fact the merge was missing, and missing it cost a student every
   * answer they gave. The account's copy is a SNAPSHOT OF THE DEVICE taken at
   * sign-up: the device's own record is pushed up at the moment the account is
   * created, which on a fresh visit is the placeholder the device rolled for
   * itself — Astronaut, no school, no courses. The student
   * then answers ten questions against the device. Every one of those answers is
   * newer than the snapshot, and the rule "the account wins where it has an
   * answer" read the snapshot as authority and handed it straight back down.
   *
   * What that looked like (owner, 2026-08-04, going through the live flow):
   * "i missed the part to pick my profile icon and my name, so i got in as the
   * default Astronaut" and "the courses that i picked are not the ones showing
   * on the dashboard". He had not missed the screen. He filled it in, this
   * function overwrote it a beat later, and six sign-ups in Supabase all carry
   * the same Astronaut, the same empty curriculum and the same 4-days/30-minutes
   * target that no build has offered since the morning.
   *
   * So: the account still wins where it has an answer and the device does not —
   * that is the second-device case and it is the whole reason any of this exists
   * — but where BOTH sides hold an answer, the one written last wins.
   *
   * BOTH CLOCKS ARE THE STUDENT'S OWN, which is the honest limit of this. Every
   * stamp is written by a browser, so a phone set three days fast would claim to
   * be fresher than a laptop answered this morning. The blast radius is one
   * person's own two devices and the losing answer is still recoverable in
   * Settings, which is a better failure than the one this replaced — where the
   * side that won was simply always the same side, and it was the wrong one
   * during the ten minutes that matter most. A server-stamped write would fix it
   * properly and needs the /api/profile row to become the arbiter, which is a
   * bigger change than the bug justifies today.
   */
  const deviceFresher = !!prev && prev.updatedAt > acct.updatedAt;

  /** The answer that stands, for a field either side may hold. A placeholder
   *  device holds null in all of these, which is what makes a fresh phone
   *  signing in adopt the account rather than blank it. */
  const pick = <T,>(a: T | null | undefined, p: T | null | undefined): T | null =>
    (deviceFresher ? (p ?? a) : (a ?? p)) ?? null;

  /* THE NAME AND THE FACE, gated the way the courses always were.
     `name` is never empty — every record has one, most of them an avatar's — so
     it cannot say on its own whether anybody was asked. `nameChosen` is the only
     thing that can, which is exactly what the field was added for, and this is
     the one place that was not consulting it. */
  const takeName = acct.nameChosen && !(deviceFresher && (prev?.nameChosen ?? false));
  const takeCourses = acct.coursesChosen && !(deviceFresher && (prev?.coursesChosen ?? false));
  /* The school and the name typed under it move as a pair, or an account's
     university ends up wearing the device's typed one — two people's answers
     spliced together. */
  const takeSchool = deviceFresher ? !prev?.school : !!acct.school;
  const school = takeSchool ? acct.school : (prev?.school ?? null);

  return {
    name: takeName ? acct.name : (prev?.name ?? acct.name),
    avatar: takeName ? acct.avatar : (prev?.avatar ?? acct.avatar),
    nameChosen: acct.nameChosen || (prev?.nameChosen ?? false),
    school,
    schoolName:
      school !== OTHER_SCHOOL ? null : (takeSchool ? acct.schoolName : (prev?.schoolName ?? null)),
    courses: takeCourses ? acct.courses : (prev?.courses ?? []),
    coursesChosen: takeCourses || (prev?.coursesChosen ?? false),
    target: pick(acct.target, prev?.target),
    studyWindow: pick(acct.studyWindow, prev?.studyWindow),
    whatsapp: pick(acct.whatsapp, prev?.whatsapp),
    heardFrom: pick(acct.heardFrom, prev?.heardFrom),
    /* The programme travels with the courses, not on its own: the two were
       answered together and `curriculum` is only meaningful against the
       programme it was picked from. Splitting them across a merge would give a
       student one programme's ticks read against another's timetable. */
    programme: takeCourses ? acct.programme : (prev?.programme ?? null),
    programmeName: takeCourses ? acct.programmeName : (prev?.programmeName ?? null),
    year: takeCourses ? acct.year : (prev?.year ?? null),
    semester: takeCourses ? acct.semester : (prev?.semester ?? null),
    curriculum: takeCourses ? acct.curriculum : (prev?.curriculum ?? []),
    typedCourses: takeCourses ? acct.typedCourses : (prev?.typedCourses ?? []),
    id: prev?.id ?? newId(),
    since: acct.since,
    /* The later of the two, so the merge is IDEMPOTENT: merging an already
       merged record recomputes `deviceFresher` to the same answer and comes back
       unchanged. Stamping `now` here instead would make every adopted record
       look freshly answered, and the two copies would out-date each other
       forever. */
    updatedAt: deviceFresher ? (prev as Identity).updatedAt : acct.updatedAt,
  };
}

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((s, i) => s === b[i]);

/**
 * Whether two copies of a student hold the same answers.
 *
 * ONE COMPARATOR, TWO QUESTIONS. `matchesAccount` asks it of the device against
 * the settled truth, `accountBehind` asks it of the ACCOUNT against the same
 * truth, and between them they decide which way the next write goes. They were
 * two hand-written field lists before, which is a promise to keep three things
 * in step by hand — and they had already fallen out of it: neither compared
 * `target.weekdays`, so a student who moved their study days from Monday to
 * Tuesday reported "already matches", the upward write never fired, and the
 * change lived on one phone. Neither compared `semester` or `programmeName`
 * either.
 *
 * A field added to AccountIdentity and not added here is a field that silently
 * stops travelling, so this list is the one to check when adding one.
 */
function sameAnswers(a: AccountIdentity, b: AccountIdentity): boolean {
  return (
    a.name === b.name &&
    a.avatar === b.avatar &&
    a.nameChosen === b.nameChosen &&
    a.since === b.since &&
    a.updatedAt === b.updatedAt &&
    a.school === b.school &&
    a.schoolName === b.schoolName &&
    a.coursesChosen === b.coursesChosen &&
    sameList(a.courses, b.courses) &&
    a.target?.days === b.target?.days &&
    a.target?.minutes === b.target?.minutes &&
    sameList(
      (a.target?.weekdays ?? []).map(String),
      (b.target?.weekdays ?? []).map(String),
    ) &&
    a.studyWindow === b.studyWindow &&
    a.whatsapp === b.whatsapp &&
    a.heardFrom === b.heardFrom &&
    a.programme === b.programme &&
    a.programmeName === b.programmeName &&
    a.year === b.year &&
    a.semester === b.semester &&
    sameList(a.curriculum, b.curriculum) &&
    sameList(a.typedCourses, b.typedCourses)
  );
}

/** Whether the stored record already IS the merge — everything but `id`,
 *  which is per-device by design and never travels. */
export function matchesAccount(id: Identity | null, acct: AccountIdentity): boolean {
  if (!id) return false;
  return sameAnswers(asAccount(id), asAccount(mergeAccount(acct, id)));
}

/**
 * Whether the ACCOUNT is the copy that needs writing — the cue for the upward
 * write.
 *
 * It used to ask a narrower question: "is the account missing something this
 * device knows?", on the reasoning that where both hold an answer the account's
 * is the one that stands. That reasoning is no longer true — where both hold an
 * answer the fresher one stands (see mergeAccount), and the fresher one is
 * usually this device, because this device is where answers are given. So the
 * question is now simply: does the account differ from the settled truth?
 *
 * Settles, and it has to: after the write the account IS the truth, so this
 * comes back false on the pass that follows.
 */
export function accountBehind(id: Identity | null, acct: AccountIdentity): boolean {
  if (!id) return false;
  return !sameAnswers(acct, asAccount(mergeAccount(acct, id)));
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
    name: avatarName(avatar),
    avatar,
    // Given, not chosen — see the field's note.
    nameChosen: false,
    // Not asked, and not a gap to be filled in later by anything but the
    // reader themselves, in Settings. Empty courses reads as the whole library.
    school: null,
    schoolName: null,
    // Nothing asked yet — the whole library, and marked as unanswered so the
    // setup sheet knows to ask once there is an account to hang it on.
    courses: [],
    coursesChosen: false,
    target: null,
    studyWindow: null,
    whatsapp: null,
    heardFrom: null,
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
