"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { coursesForSchool } from "@/lib/courses";
import {
  normalisePhone,
  saveOnboarding,
  useIdentity,
  type HeardFrom,
  type Identity,
  type StudyTarget,
  type StudyWindow,
} from "@/lib/identity";
import { nextFromQuery } from "@/lib/next-path";
import { OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";
import {
  coursesByYear,
  levelLabel,
  liveSlugsFor,
  programmeBySlug,
  programmeLabel,
  programmesFor,
  semestersFor,
  type Programme,
} from "@/lib/programmes";
import {
  cleanTitle,
  isCourseTitle,
  MAX_TYPED_COURSES,
  normTitle,
  OTHER_PROGRAMME,
} from "@/lib/curriculum-text";
import {
  CurriculumPicker,
  OptionRows,
  SchoolPicker,
  TypedCoursePicker,
} from "@/components/identity/pickers";
import { Button } from "@/components/ui/Button";
import { FIELD } from "@/components/ui/Field";
import { WhatsAppMark } from "@/components/icons/whatsapp";
import { HugeIcon } from "@/components/icons/huge";
import { AuthForm } from "@/components/auth/AuthForm";
import { AvatarPicker } from "@/components/identity/AvatarPicker";
import { type AvatarId } from "@/components/identity/avatars";
import { useInstall } from "@/lib/install";

/* ------------------------------------------------------------------ *
 * Onboarding — three questions, asked straight after the account is made.
 *
 * The owner's design (2026-08-03): "a page where I pick up all this
 * information … instead of a list of questions the user will fill it like a
 * form, answering one question at a time", with a progress bar at the top —
 * and, settled the same evening, "after email address and sign up they go to
 * this page and start filling in a bunch of details".
 *
 * SO THE ACCOUNT COMES FIRST and this page comes second. The email is the
 * thing worth having early, and somebody who has just made an account will
 * answer three questions where a stranger might never have started. Clerk's
 * card on "/" sends new accounts here; sign-INS go straight to the app,
 * because they answered this the first time.
 *
 * IT DOES NOT BREAK "NOBODY IS ASKED ANYTHING". That rule protects the
 * stranger who taps a WhatsApp link to READ — they still land in the reader,
 * still get an assigned name and face, still never meet a form. This page is
 * only ever reached by someone who chose to make an account.
 *
 * EVERY STEP SAVES, on each advance rather than once at the end, so closing
 * the tab on question three keeps what was said. AccountSignal then carries
 * the answers up onto the account, which is what makes them follow the
 * student to a second device.
 *
 * NO CONTAINER AROUND A QUESTION (owner, 2026-08-03: "remove that container
 * around the questions … I don't need a whole container"). Each question is
 * the page: a heading, a line under it, and the rows. The rows keep their own
 * surface because they are the controls; a panel around them would be a card
 * holding cards.
 *
 * EVERY COLOUR IS A TOKEN, none of them written here — same call, same day:
 * "I already have colors that look good on my app, why aren't I using these
 * even for the website." The warm off-greys these screens had picked up
 * (#e7e7e6, #f4f4f3, #fafafa) read cream beside the app's neutral #f5f5f5,
 * which is what made this page look like a different product.
 * ------------------------------------------------------------------ */

/* NAMED DAYS, NOT A COUNT (owner, 2026-08-04: "instead of showing the number of
   days, just show a list of days — Monday, Tuesday, Wednesday — and let them
   pick the days"). "4 days a week" is a number somebody agrees to in the
   abstract; Monday and Thursday are a plan you either kept or did not. The
   count still exists, as the length of what they picked.

   Monday first, because a week that starts on Sunday is an American habit and
   nobody here plans against it. Index 0 = Monday throughout. */
/* Full names only. There was a short-form list beside this for the note under
   each row; two columns took the width that note lived in, and an array kept
   for nothing but its length is an array that will be read as meaning more. */
const WEEKDAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MINUTE_CHOICES = [30, 45, 60, 90, 120, 180];

/** "7.5 hours" / "1 hour" / "21 hours" — the number a student has to argue
 *  with. One decimal at most: "7.5" is a week, "7.53" is a spreadsheet. */
function hoursLabel(minutes: number): string {
  const h = Math.round(minutes / 6) / 10;
  return `${h} ${h === 1 ? "hour" : "hours"}`;
}

/* The recommendation (owner, same call: "a recommended amount, which is at
   least one hour thirty minutes a day"). Marked rather than forced — a default
   somebody cannot see the reasoning for is just our opinion in their record. */
const RECOMMENDED_MINUTES = 90;

/**
 * How long a tapped answer stays on screen before the next question arrives.
 *
 * Owner, 2026-08-04: "when i tap an option give me some time before change to
 * the different page — need time to look at the option before changing."
 * Tick-and-go answered the school question in one tap and left immediately, so
 * the tick filled and the screen slid away in the same frame: a student got no
 * confirmation of what they had just chosen, only a new question. On a
 * mis-tapped row that is worse still — the wrong answer is saved and gone
 * before they can see it was wrong.
 *
 * 700ms, and it is the second time this number has gone up. It was 380 —
 * reasoned against the row's own 150ms colour transition, so the square had
 * time to finish filling and be read as filled. That was the right sum for the
 * wrong quantity: filling is not reading. The owner, going through the live
 * flow on his phone (2026-08-04): "im not being given time to look at my
 * options … enough time to see what im selecting." At 380 the tick lands and
 * the screen is already leaving, so what a student gets is a flicker where
 * confirmation was meant to be — the beat existed but was too short to be
 * spent on anything.
 *
 * 700 is long enough to move your eye to the row you tapped and read it back,
 * and still under the ~1s mark where a screen starts reading as broken rather
 * than deliberate. The step transition's 260ms runs after this, not inside it.
 *
 * IT NOW GOVERNS EVERY FORWARD MOVE, not only the tap-to-advance ones — same
 * call, "put that delay through out the process". A flow that pauses on three
 * of its questions and snaps on the other two has a rhythm a student cannot
 * learn, and the questions that snapped were the ones with the most on screen
 * to look at. Back is deliberately exempt: nobody needs time to confirm an
 * answer they are leaving.
 */
const ANSWER_BEAT_MS = 700;

/* Whether we are past the server render, for the one thing on this page that
   cannot exist during it: a portal needs `document.body`.

   useSyncExternalStore rather than the usual useState + useEffect(() =>
   setMounted(true)) — that pattern is a cascading render and the lint rule that
   catches it is right. A store that never changes, whose server snapshot is
   false and whose client snapshot is true, gives the same answer without the
   extra render. */
const NEVER_CHANGES = () => () => {};
function useIsClient(): boolean {
  return useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );
}

type Step =
  | "you"
  | "school"
  | "programme"
  | "year"
  | "semester"
  | "courses"
  | "whatsapp"
  | "target"
  | "window"
  | "install"
  | "heard"
  | "account";

/**
 * The questions, in order. Every student gets all five.
 *
 * PREDICTIVE, NOT A QUESTIONNAIRE (owner, 2026-08-04): "when they say the
 * school, I already know which programmes are at the school; when they say the
 * programme, I already know the courses; when they say the year, now I know the
 * specific courses… I'll do as much to help them so they don't have to manually
 * pick things which we could avoid." Two extra taps buy the student a course
 * list that is already their own timetable instead of a library to hunt through.
 *
 * A CONSTANT AGAIN, where it was a function of the school. It branched: a
 * university whose curriculum we had scraped got programme → year → courses,
 * and everyone else was sent straight to a list of the four courses we have
 * BUILT and told it was their timetable. That was the hole. Seven of the ten
 * universities in the picker publish no curriculum at all, and so do 19 ZCAS
 * programmes, 98 UNZA ones and 106 of Mulungushi's 107 — so for most students
 * the branch that skipped the questions was the branch that ran, and the
 * answers we most needed were the ones never asked for.
 *
 * The questions are now the same for everybody; only what ANSWERS them changes.
 * A programme we hold is a list to tap and one we don't is a line to type; a
 * year is read off the programme where we know it and is 1–6 where we don't;
 * the courses are ticked off the timetable or typed into it. Nobody is asked to
 * find themselves in a list that cannot contain them, and nobody is skipped
 * past a question because we had nothing to prefill it with.
 *
 * THE COURSE STEP IS THE LAST OF THEM FOR A REASON. It came out on the
 * afternoon of 2026-08-04 — "don't show the courses — just get them finished
 * signing up" — and went back in the same evening on "I keep missing the
 * courses": a sign-up that never shows a student a single course leaves them
 * with no idea what they were enrolled in, and the dashboard is too late to
 * find out. What changed is what the screen ASKS. It arrives with the answer
 * already in it — their year's courses ticked, or what their classmates
 * reported offered — so the work is confirming, not building.
 *
 * "install" IS DATA-DEPENDENT TOO, and in the same sense as "year" and
 * "semester" — asked only where there is something to ask (owner, 2026-08-07:
 * "during onboarding please prompt user to install the app"). Placed ahead of
 * "heard" rather than after it so "heard" stays truly the last question: a
 * student who is never offered install (already running standalone, or a
 * browser with no install story at all) never sees a gap where it would have
 * been, and one who is sees it as one more thing before the last one, not
 * after it.
 *
 * "account" IS LAST, AND IT IS THE PASSWORD (owner, 2026-08-26: "this actual
 * thing with the password needs to now be at the end of onboarding … so meaning
 * the onboarding flow comes first"). Until today the email and password were the
 * FIRST thing a new student met — /sign-up made the account and handed over to
 * these questions — and the note at the top of this file argued for that order
 * at some length. That argument is reversed now, deliberately: a stranger is
 * asked what they study before they are asked to commit to anything, and the
 * account is what saves the answers they have already given rather than the toll
 * gate in front of them.
 *
 * IT IS DATA-DEPENDENT LIKE THE REST, which is what lets ONE flow serve both
 * doors. `asks` returns it only for somebody we positively know is signed OUT,
 * so the front-door student answers eleven questions and then makes an account,
 * while a student who arrived from a gated tap — who already made one on the way
 * in, see AuthForm — is skipped past it and `finish` simply leaves. No branch,
 * no second definition of "done", and the two paths cannot drift apart.
 */
const ORDER: Step[] = [
  "you",
  "school",
  "programme",
  "year",
  "semester",
  "courses",
  "whatsapp",
  "target",
  "window",
  "install",
  "heard",
  "account",
];

/* WHEN THE HARD STUFF GOES IN (owner, 2026-08-04: "ask what time of the day they
   usually find it easy to learn complex topics, whether they are a night owl or
   whatever"). Windows rather than clock times — see StudyWindow. The hours are
   on the row because "evening" means different things to different people and
   the point is to agree on one. */
const WINDOWS: { id: StudyWindow; title: string; note: string }[] = [
  { id: "early-morning", title: "Early morning", note: "Before 8" },
  { id: "morning", title: "Morning", note: "8 to noon" },
  { id: "afternoon", title: "Afternoon", note: "Noon to 5" },
  { id: "evening", title: "Evening", note: "5 to 9" },
  { id: "night", title: "Late night", note: "After 9" },
];

/* HOW THEY SAY THEY FOUND US. Every option is a place Booklesss actually is, so
   nobody has to pick "other" for the honest answer — a list that forces that is
   a list that measures nothing. */
const SOURCES: { id: HeardFrom; title: string }[] = [
  { id: "friend", title: "A friend told me" },
  { id: "whatsapp-group", title: "A WhatsApp group" },
  { id: "tiktok", title: "TikTok" },
  { id: "facebook", title: "Facebook" },
  { id: "flyer", title: "A flyer or poster" },
  { id: "search", title: "I searched for it" },
  { id: "other", title: "Somewhere else" },
];

/**
 * When a weekly plan stops being ambitious and starts being a lie.
 *
 * Owner, 2026-08-04: "if they start to pick ridiculous options like all the days
 * and 3h each tell them to be realistic with themselves — tell them they cant
 * change this any time soon and will be held accountable and lose points for
 * unrealistic goals."
 *
 * BOTH HALVES OF THAT WARNING ARE TRUE TODAY, which is the only reason it is
 * allowed to be said. The target is set here and NOWHERE else — Settings has no
 * goal editor — so "you can't change this any time soon" is a fact rather than a
 * deterrent. And lib/performance scores `35 x progress + 65 x effort` with
 * effort measured against this very number, so an inflated goal really does
 * suppress the score every week it is missed. A threat the app could not carry
 * out would be found out inside a fortnight and would cost more than it bought.
 *
 * 12 hours, because the recommendation is 90 minutes and a student keeping it
 * five days a week lands at 7.5 — comfortably clear. 12 is roughly two hours
 * every weekday, which is a real student's very good week, and everything past
 * it is someone typing their intentions rather than their habits.
 */
const UNREALISTIC_WEEKLY_MINUTES = 12 * 60;

/** The answers as the form holds them. */
type Draft = {
  /** What they want to be called, and the face that goes with it. Seeded from
   *  the pair this device was assigned on its first visit. */
  name: string;
  avatar: AvatarId;
  nameChosen: boolean;
  school: SchoolChoice | null;
  schoolName: string;
  programme: string | null;
  /** What they typed when their degree isn't one we hold — see lib/identity. */
  programmeName: string;
  year: number | null;
  /** Which half of the year — 1 or 2, null on a programme with no semesters
   *  recorded, where the question is skipped entirely. */
  semester: number | null;
  /** Curriculum slugs ticked — their real timetable, built or not. */
  curriculum: string[];
  /** Course titles typed, for a programme with nothing on file to tick. */
  typedCourses: string[];
  courses: string[];
  /** Whether the courses QUESTION has been answered, which is not the same as
   *  the list being non-empty — "Show me everything" answers it with none.
   *  Carried explicitly because every save has to state it honestly: a save
   *  that claims it while the student is still on question one is what let a
   *  half-filled record look finished to the dashboard's gate. */
  coursesAnswered: boolean;
  target: StudyTarget;
  studyWindow: StudyWindow | null;
  /** As typed, not as normalised — a field that rewrites itself under someone's
   *  cursor is a field nobody can correct. Normalising happens on save. */
  whatsapp: string;
  heardFrom: HeardFrom | null;
};

/** What the form shows before anybody has touched it: whatever the student
 *  already answered, and the offer for anything they haven't. Four days at
 *  half an hour is a habit most people can actually keep — the number is only
 *  worth anything if it is the one they'd have picked. */
function asDraft(identity: Identity | null): Draft {
  return {
    /* Empty rather than the assigned name, so the field reads as a question
       rather than as an answer already given. The assigned one is the
       placeholder — see the step. A name they DID choose comes back. */
    name: identity?.nameChosen ? identity.name : "",
    avatar: identity?.avatar ?? "astronaut",
    nameChosen: identity?.nameChosen ?? false,
    school: identity?.school ?? null,
    schoolName: identity?.schoolName ?? "",
    programme: identity?.programme ?? null,
    programmeName: identity?.programmeName ?? "",
    year: identity?.year ?? null,
    semester: identity?.semester ?? null,
    curriculum: identity?.curriculum ?? [],
    typedCourses: identity?.typedCourses ?? [],
    courses: identity?.courses ?? [],
    coursesAnswered: identity?.coursesChosen ?? false,
    /* No days pre-picked. The old default was "4 days, 30 minutes" — numbers
       nobody chose, sitting in the form looking like an answer, which is the
       thing the target field's own note in lib/identity warns about. The
       recommended length IS offered as the starting value, because it is
       labelled as a recommendation on screen where a silent default is not.
       `days: 0` never reaches storage: finish() writes the count of what they
       picked, and the button will not fire until that is at least one. */
    target: identity?.target ?? { days: 0, minutes: RECOMMENDED_MINUTES, weekdays: [] },
    studyWindow: identity?.studyWindow ?? null,
    whatsapp: identity?.whatsapp ?? "",
    heardFrom: identity?.heardFrom ?? null,
  };
}

/**
 * Whether this student is asked a given question at all.
 *
 * Two of the eight are data-dependent: a programme that publishes no years has
 * no year to ask about, and one whose source never recorded semesters has no
 * halves to choose between. Asking either would render a card with no options
 * and no way forward.
 *
 * ONE PREDICATE, THREE CALLERS — `firstGap`, `stepAfter` and `back`. They used
 * to disagree by construction: every screen named its own successor by hand,
 * and the WhatsApp question was added to ORDER while the courses screen went on
 * saying `advanceAfterBeat("target")`. So the question was in the flow, was
 * required by `onboardingComplete`, and was never shown — a student finished,
 * got bounced off the dashboard by the gate, and landed back in onboarding
 * (owner, 2026-08-04: "after I pick who told me I go back to the start").
 *
 * A screen naming its own next step is a decision duplicated once per screen.
 * This is the list; nothing else gets an opinion.
 *
 * `installOK` IS THE THIRD DATA SOURCE, alongside the draft and the programme
 * — it comes from `useInstall()`, not from anything saved, because whether
 * there is something to offer is a fact about the BROWSER (a fired
 * `beforeinstallprompt`, or iOS) rather than about the student. Threaded
 * through the same three callers as `prog` for the same reason `prog` is:
 * one predicate deciding for everyone downstream, not a question each caller
 * answers for itself.
 *
 * `signedOut` IS THE FOURTH, and it is `signedIn === false` rather than
 * `!signedIn` — the distinction lib/account documents and RequireOnboarding
 * makes in the same words: "we haven't heard yet" is not "signed out". Read the
 * loose way, the account step would be asked for the beat before the session
 * resolves, so a student arriving from a gated tap with an account already made
 * would watch a password form appear and then vanish. Skipped while unknown, it
 * appears only once the answer is really in.
 */
function asks(
  step: Step,
  d: Draft,
  prog: Programme | undefined,
  installOK: boolean,
  signedOut: boolean,
): boolean {
  /* Ask unless the programme's OWN timetable says the question is meaningless.
     Three cases, and the middle one is the reason this is not just
     `prog.years.length > 0`: no programme picked (typed) asks 1–6; a programme
     we hold NO curriculum for asks 1–6 too, because the student knows their own
     year whether or not we know their courses; and a programme whose scraped
     course list carries no years at all is skipped, since there is nothing to
     read a year off and nothing to tick once they answer. Most programmes are
     now the middle case — 98 of UNZA's 111 publish nothing — and gating on
     `years` alone silently skipped the year for every one of them the moment
     they started shipping. */
  if (step === "year") return !prog || !prog.courses.length || prog.years.length > 0;
  if (step === "semester") return semestersFor(prog, d.year).length > 1;
  if (step === "install") return installOK;
  if (step === "account") return signedOut;
  return true;
}

/** The next question this student is actually asked, skipping any that do not
 *  apply. The last one answers itself — `finish` either opens the account step
 *  or leaves for the dashboard, depending on whether there is one yet. */
function stepAfter(
  from: Step,
  d: Draft,
  prog: Programme | undefined,
  installOK: boolean,
  signedOut: boolean,
): Step {
  for (let i = ORDER.indexOf(from) + 1; i < ORDER.length; i++) {
    if (asks(ORDER[i], d, prog, installOK, signedOut)) return ORDER[i];
  }
  /* The last step this student is actually ASKED, not the last in the list —
     "account" is skipped for anyone already signed in, and falling back to it
     blindly would put a signed-in student on a password form after the install
     question. Walking backwards finds "heard" for them and "account" for
     everybody else. */
  for (let i = ORDER.length - 1; i >= 0; i--) {
    if (asks(ORDER[i], d, prog, installOK, signedOut)) return ORDER[i];
  }
  return ORDER[0];
}

/** The previous one they were actually asked. Back has to skip exactly what
 *  forward skipped, or it lands on a card with nothing in it. */
function stepBefore(
  from: Step,
  d: Draft,
  prog: Programme | undefined,
  installOK: boolean,
  signedOut: boolean,
): Step {
  for (let i = ORDER.indexOf(from) - 1; i >= 0; i--) {
    if (asks(ORDER[i], d, prog, installOK, signedOut)) return ORDER[i];
  }
  return ORDER[0];
}

/** Which question to open on — the first without an answer, over whichever
 *  steps this student is actually being asked. Mirrors lib/identity's
 *  `firstUnanswered` and extends it over the data-dependent ones.
 *
 *  Note that "install" has no case below, deliberately — there is nothing
 *  saved to check it against, so it is never the answer this returns. A
 *  student resuming a half-finished record is resuming the DATA questions;
 *  install is only ever reached by moving forward through the live flow.
 *
 *  "heard" DOES have one now, where it used to be the bare fallback. It had no
 *  case because it was the last step and returning it meant "nothing left to
 *  ask" — true right up until something came after it. Left as the fallback it
 *  would strand a signed-out student who answered everything on the question
 *  they had already answered, with the account step they still need sitting one
 *  past it and no way to reach it but Back-then-forward. */
function firstGap(
  d: Draft,
  steps: Step[],
  prog: Programme | undefined,
  installOK: boolean,
  signedOut: boolean,
): Step {
  for (const s of steps) {
    if (!asks(s, d, prog, installOK, signedOut)) continue;
    if (s === "you" && !d.name.trim()) return s;
    if (s === "school" && (!d.school || (d.school === OTHER_SCHOOL && !d.schoolName.trim()))) return s;
    /* Same shape as the school question above it: picking "not listed" is not
       an answer on its own — the answer is what they then type. */
    if (s === "programme" && (!d.programme || (d.programme === OTHER_PROGRAMME && !d.programmeName.trim())))
      return s;
    if (s === "year" && !d.year) return s;
    /* Skipped where the source never recorded semesters — asking "which half of
       the year?" with nothing to put in either half is a card with no options
       and no way forward, which is the same hole the year step already guards
       against for programmes that publish no years. */
    if (s === "semester" && !d.semester) return s;
    if (s === "courses" && !d.coursesAnswered) return s;
    /* Typed, not normalised: the field holds what they wrote and the save
       normalises it, so a resume has to judge the same thing the save would. */
    if (s === "whatsapp" && !normalisePhone(d.whatsapp)) return s;
    if (s === "target" && !d.target.weekdays?.length) return s;
    if (s === "window" && !d.studyWindow) return s;
    if (s === "heard" && !d.heardFrom) return s;
  }
  /* Everything answered. That means the account step for a student who has no
     account yet, and "heard" — the last question, sitting there answered — for
     one who has. */
  return asks("account", d, prog, installOK, signedOut) ? "account" : "heard";
}

export function OnboardingFlow() {
  const router = useRouter();
  const signedIn = useSignedIn();
  const { identity, hydrated } = useIdentity();

  /* RESUME, DON'T RESTART. Every step saves, so a student who closed the tab
     on question three already has two answers stored, and asking for them
     again is the same insult as never asking. The gate that sends people back
     here (RequireOnboarding) reads the same `firstUnanswered`, so the question
     it opens on is always the one actually missing.

     THE FORM FOLLOWS THE RECORD UNTIL IT IS TOUCHED, rather than being seeded
     into state. Copying the record into `useState` needs the copy to happen
     after the store hydrates, and the two ways to do that are both wrong here:
     a lazy initialiser reads localStorage during the render that has to match
     the server's HTML, and an effect is a cascading render (the lint rule that
     catches it is right — it would paint question one and then swap). Holding
     the whole draft as one nullable override means the first paint is the
     record itself, and the moment anybody answers anything the form takes
     over and later writes cannot move a field under their hands. */
  const [draft, setDraft] = useState<Draft | null>(null);
  const [stepPick, setStepPick] = useState<Step | null>(null);
  const [dir, setDir] = useState<"next" | "back">("next");
  const [query, setQuery] = useState("");
  /** Separate from `query`, which is the course typeahead two questions later.
   *  One box per question: sharing it would carry a half-typed degree name into
   *  the course search and filter it to nothing. */
  const [progQuery, setProgQuery] = useState("");
  /* Called once, here, rather than inside the "install" step itself. The
     hook's own listener has to be live for the WHOLE flow — Chrome can fire
     `beforeinstallprompt` at any point while the student is answering the
     other nine questions, and it fires exactly once, so a listener that only
     mounted when they reached this step would miss every event that arrived
     before it. */
  const { canInstall, showIosHelp, install } = useInstall();
  /** Whether there is anything to offer at all — the one thing `asks()` needs
   *  to know about this browser. */
  const installOK = canInstall || showIosHelp;
  /** The other thing `asks()` needs, and the reason it is `=== false` rather
   *  than `!signedIn` is argued over `asks` itself: unknown is not signed out,
   *  and treating it as one flashes a password form at a student who has an
   *  account. */
  const signedOut = signedIn === false;
  /** The native prompt is a modal the OS draws; this is only for the moment
   *  between tapping and it resolving, so the button says something rather
   *  than sitting there looking unpressed. */
  const [installing, setInstalling] = useState(false);
  /* What earlier students on this programme reported, and the pipeline's own
     titles as a typeahead. Both start empty and stay empty when there is no
     server — see the effects below. */
  const [suggested, setSuggested] = useState<{ title: string; students: number }[]>([]);
  const [known, setKnown] = useState<string[]>([]);

  const d = draft ?? asDraft(identity);
  const {
    name,
    avatar,
    school,
    schoolName,
    programme,
    programmeName,
    year,
    semester,
    curriculum,
    typedCourses,
    courses,
    coursesAnswered,
    target,
    studyWindow,
    whatsapp,
    heardFrom,
  } = d;

  /** The number as it will actually be stored, or null while it is not a
   *  Zambian mobile yet. Drives the button, the hint and the save — one source,
   *  so the button can never be enabled on something the save would reject. */
  const phone = normalisePhone(whatsapp);


  /* The avatar grid deals a random twelve, which cannot be rendered on the
     server without the markup disagreeing with the client's. */
  const isClientFlow = useIsClient();

  /** The days they picked, 0 = Monday. A record written before this question
   *  asked for named days has none, and gets an empty board rather than four
   *  days invented on its behalf — we genuinely never knew which. */
  const picked = target.weekdays ?? [];

  /** What they have promised, in minutes a week. The realism warning and the
   *  running total both read it. */
  const weeklyMinutes = picked.length * target.minutes;

  /** The programme they picked, with its courses. Undefined until they pick.
   *  Not memoised: it is a find over at most 41 rows, and a manual memo here is
   *  something the React Compiler has to give up optimising the component to
   *  preserve — a worse trade than the lookup it saves. */
  const prog = programmeBySlug(school, programme);

  /**
   * Which question is on screen.
   *
   * RESOLVED AGAINST THE SAVED RECORD, NOT THE FORM. This read `firstGap(d)` —
   * the live draft — and `stepPick` is null until the student advances, so the
   * step was recomputed from what they were CURRENTLY TYPING on every
   * keystroke. The moment a field satisfied its own gap, the screen answering
   * that gap stopped being the first unanswered one and the flow jumped
   * forward, out from under them.
   *
   * Tap-to-advance questions never showed it, because their answer and their
   * advance are the same event. Every text field on this page had it: the name,
   * the WhatsApp number, the typed university and the typed programme all
   * threw the student to the next screen mid-word, on the character that
   * happened to complete a valid answer.
   *
   * The record only changes when something is SAVED, which is when a student
   * advances — so resuming reads the same answer it always did, and typing
   * moves nothing. After the first advance `stepPick` is set and this is not
   * consulted at all.
   */
  const step =
    stepPick ?? (hydrated ? firstGap(asDraft(identity), ORDER, prog, installOK, signedOut) : "school");

  /** Whether this student is on the typed path — no curriculum on file for
   *  their programme, so their answers are the curriculum. The majority case;
   *  see ORDER. */
  const typing = !prog || prog.courses.length === 0;

  /** The years to offer. Off the programme where we have it, 1–6 where we do
   *  not: a year is a thing a student knows about themselves, and refusing to
   *  ask because we have no timetable to line it up against throws away the
   *  one answer that makes their course list mean something later. */
  /* A CURRICULUM NAMING ONE OR TWO YEARS IS A PARTIAL CURRICULUM, NOT A SHORT
     DEGREE. UNZA BA (Economics) has Year 1 typed in by hand and nothing else,
     because Year 1 is all we hold material for — and reading the options
     straight off it left a third-year student with "Year 1" as their only
     choice. That is the one fact this question exists to collect, and the
     student is the only person who has it.

     No bachelor's runs for one or two years, so a curriculum listing that few
     is definitionally incomplete and the full range is offered. Three or more
     is taken as the real shape of the degree. Either way the row carries a
     count of the courses we hold for that year, so an empty year is visibly
     empty rather than silently wrong. */
  const knownYears = prog?.years ?? [];
  const years = knownYears.length >= 3 ? knownYears : [1, 2, 3, 4, 5, 6];

  /** The programme as the server groups reports under: its slug where we hold
   *  it, otherwise the words they typed. */
  const programmeKey = (programme === OTHER_PROGRAMME ? programmeName : programme || "").trim();

  /* A FILTER, BECAUSE THE LIST STOPPED BEING SCROLLABLE. The picker used to
     hold only programmes whose curriculum had been scraped — 13 at UNZA, 1 at
     Mulungushi — and a bare list was the right control for that. Offering every
     programme (2026-08-08) took UNZA to 111 rows and Mulungushi to 107, which
     on a phone is a scroll long enough that a student stops believing their own
     degree is in there. Matching is on words in any order, so "econ arts" finds
     "Bachelor of Arts in Economics"; a student typing what they call their
     course should not have to guess the registry's word order. */
  const allProgrammes = programmesFor(school);
  const progTerms = progQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const shownProgrammes = progTerms.length
    ? allProgrammes.filter((p) => {
        const hay = `${p.name} ${p.level ?? ""}`.toLowerCase();
        return progTerms.every((t) => hay.includes(t));
      })
    : allProgrammes;

  /* WHAT THEIR CLASSMATES SAID, offered back. This is the mechanism the owner
     asked for — "we can find a way to do this dynamically as I bring in
     students" — and it is the only thing that ever fills in a university whose
     website publishes nothing: the first student types their courses into an
     empty box, the second is shown that list and corrects it.

     Progressive enhancement, deliberately. It is one fetch, it is never
     awaited by anything the student can see, and every failure leaves them
     exactly where they would have been — typing. */
  useEffect(() => {
    if (step !== "courses" || !typing || !programmeKey) return;
    const p = new URLSearchParams({ university: school ?? "", programme: programmeKey });
    if (year) p.set("year", String(year));
    let live = true;
    fetch("/api/curriculum?" + p)
      .then((r) => (r.ok ? r.json() : { suggested: [] }))
      .then((j) => live && setSuggested(Array.isArray(j.suggested) ? j.suggested : []))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [step, typing, programmeKey, school, year]);

  /* And the typeahead over the 600-odd courses the pipeline already knows, so
     a student typing "financ" is offered the title a scraped course already
     uses. Debounced: this fires on a keystroke, on a Zambian connection. */
  useEffect(() => {
    const q = query.trim();
    /* No setKnown([]) on the way out. Clearing state synchronously in an
       effect body is a cascading render, and it is not needed: a short query
       simply isn't passed to the picker below, so a stale hit cannot be drawn
       while nothing is being searched for. */
    if (!typing || step !== "courses" || q.length < 2) return;
    let live = true;
    const t = setTimeout(() => {
      fetch("/api/curriculum?q=" + encodeURIComponent(q))
        .then((r) => (r.ok ? r.json() : { known: [] }))
        .then((j) => live && setKnown(Array.isArray(j.known) ? j.known : []))
        .catch(() => {});
    }, 250);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [query, typing, step]);

  /** Add a course they typed, or one they tapped from the suggestions. */
  function addTyped(title: string) {
    const t = cleanTitle(title);
    if (!isCourseTitle(t) || typedCourses.some((x) => normTitle(x) === normTitle(t))) return;
    const next = [...typedCourses, t].slice(0, MAX_TYPED_COURSES);
    /* A typed course that IS one we have built enrols them in it — the
       dashboard has something to open, without the student having to find the
       same course twice under two different questions. */
    edit({ typedCourses: next, courses: builtFor(next) });
    setQuery("");
  }

  function toggleTyped(title: string) {
    const next = typedCourses.some((x) => normTitle(x) === normTitle(title))
      ? typedCourses.filter((x) => normTitle(x) !== normTitle(title))
      : [...typedCourses, cleanTitle(title)].slice(0, MAX_TYPED_COURSES);
    edit({ typedCourses: next, courses: builtFor(next) });
  }

  /** The built courses among a list of typed titles, matched on the same
   *  normalisation the server counts them with. */
  function builtFor(titles: string[]): string[] {
    const want = new Set(titles.map(normTitle));
    return offered.filter((c) => want.has(normTitle(c.title))).map((c) => c.slug);
  }

  /** Change one answer, and take the form off the record for good. */
  function edit(patch: Partial<Draft>) {
    setDraft({ ...d, ...patch });
  }

  /* NO BOUNCE FOR A SIGNED-OUT STUDENT ANY MORE (owner, 2026-08-26). This used
     to read `if (signedIn === false) router.replace("/")`, on the rule that
     "someone who has not signed in cannot be on the onboarding ever"
     (2026-08-04) — correct for as long as the account was made BEFORE these
     questions, and exactly backwards now that it is made after them. A signed-
     out student is no longer a stale link; they are the ordinary case, and the
     account step at the end of ORDER is where they stop being one.

     Nothing replaces it, deliberately. There is no state this page needs an
     account for: every answer is written to localStorage as it is given (see
     `save`), and AccountSignal carries the lot up the moment one exists. The
     page is now readable by anybody, which is what the front door requires. */

  /* Which courses to offer. A school narrows the list; "not listed" and no
     answer both mean the whole library (coursesForSchool reads null that
     way), which is the honest offer when we don't know their syllabus. */
  const offered = coursesForSchool(school);

  const index = ORDER.indexOf(step);

  /**
   * Write down what has been answered.
   *
   * `patch` exists for tap-to-advance: picking a university saves and moves in
   * the same handler, and React has not re-rendered with the new state by
   * then — reading `school` here would store the PREVIOUS answer. Passing the
   * picked value straight through is the difference between the flow working
   * and it silently recording one question behind.
   *
   * IT SAYS WHAT IT KNOWS AND NOTHING MORE. `coursesChosen` is passed by the
   * caller, and `target` only by the question that asks for it — the record
   * this writes is what the onboarding gate reads, so a field filled in
   * ahead of the student is a gate that opens on an empty dashboard.
   */
  function save(patch: {
    name?: string;
    avatar?: AvatarId;
    nameChosen?: boolean;
    school?: SchoolChoice | null;
    courses?: string[];
    coursesChosen: boolean;
    target?: StudyTarget;
    programme?: string | null;
    programmeName?: string | null;
    year?: number | null;
    semester?: number | null;
    curriculum?: string[];
    typedCourses?: string[];
    studyWindow?: StudyWindow | null;
    whatsapp?: string | null;
    heardFrom?: HeardFrom | null;
  }) {
    const s = "school" in patch ? (patch.school ?? null) : school;
    saveOnboarding({
      ...(patch.name === undefined ? {} : { name: patch.name }),
      ...(patch.avatar === undefined ? {} : { avatar: patch.avatar }),
      ...(patch.nameChosen === undefined ? {} : { nameChosen: patch.nameChosen }),
      school: s,
      schoolName: s === OTHER_SCHOOL ? schoolName.trim() || null : null,
      courses: patch.courses ?? courses,
      coursesChosen: patch.coursesChosen,
      ...(patch.target === undefined ? {} : { target: patch.target }),
      ...(patch.programme === undefined ? {} : { programme: patch.programme }),
      /* Sent whenever the programme is, so that clearing one clears the other:
         saveIdentity drops a typed name the moment a listed programme is
         picked, and passing it here keeps the reverse true — a name typed
         after "Mine isn't listed" reaches the record on the same write. */
      ...(patch.programmeName === undefined ? {} : { programmeName: patch.programmeName }),
      ...(patch.year === undefined ? {} : { year: patch.year }),
      ...(patch.semester === undefined ? {} : { semester: patch.semester }),
      ...(patch.curriculum === undefined ? {} : { curriculum: patch.curriculum }),
      ...(patch.typedCourses === undefined ? {} : { typedCourses: patch.typedCourses }),
      ...(patch.studyWindow === undefined ? {} : { studyWindow: patch.studyWindow }),
      ...(patch.whatsapp === undefined ? {} : { whatsapp: patch.whatsapp }),
      ...(patch.heardFrom === undefined ? {} : { heardFrom: patch.heardFrom }),
    });
  }

  /** The last answer — the plan, written here and only here — and into the
   *  app. `replace`, so the back button out of the dashboard is the page they
   *  came from rather than the questions they just finished. */
  /** The plan, written on leaving the target screen. `days` is the count of
   *  what they actually picked rather than anything off the draft — the draft
   *  starts at 0 and only the named days move, and this is the one place the two
   *  representations are reconciled. Everything downstream reads `days`. */
  function savePlan(window: StudyWindow | null = studyWindow) {
    save({
      coursesChosen: true,
      target: { ...target, days: picked.length, weekdays: picked },
      studyWindow: window,
    });
  }

  function finish(source: HeardFrom) {
    save({ coursesChosen: true, heardFrom: source });

    /* THE ANSWERS ARE DOWN; NOW THEY NEED SOMEWHERE TO LIVE. A student with no
       account has one more screen to go (see ORDER) and this is the hand-over
       to it — the same beat as every other advance, so the source they just
       tapped is on screen long enough to have been seen, and then the password.

       `save` above has already run, which is what makes leaving at this point
       safe in the other direction too: somebody who closes the tab on the
       account screen keeps all eleven answers on the device, and giving the
       same browser an account later adopts them rather than starting over. */
    if (signedOut) {
      afterBeat(() => goTo("account"));
      return;
    }

    /* BACK WHERE THEY CAME FROM, not always the dashboard (owner, 2026-08-06:
       "as long as it redirects to the right page the user came from and keeps
       the scroll position"). Whoever sent them here put the origin in `?next=`;
       `nextFromQuery` validates it and falls back to /dashboard, which is the
       right answer for the front-door sign-up that had no page behind it.

       THE SCROLL IS NOT THIS FUNCTION'S JOB. Landing on the right path is —
       reader/LessonReader saves the offset per lesson as they read and restores
       it on mount, so a student returned to their step lands on the paragraph
       they left rather than at the top of it.

       SAVED NOW, LEFT IN A MOMENT — the same split every other answer makes.
       The write does not wait on the beat, so a student who taps Done and
       closes the tab inside it has still finished; only the departure waits,
       so the plan they just set is on screen long enough to have been seen. */
    const back = nextFromQuery();
    afterBeat(() => router.replace(back));
  }

  /* Which way the next question comes in from. A form's movement means
     nothing if answering and going back look the same — see the .onboard-step
     rules in globals.css. */
  function goTo(next: Step, direction: "next" | "back" = "next") {
    setDir(direction);
    setStepPick(next);
  }

  function back() {
    /* Back cancels a pending advance. Tapping a school and immediately hitting
       Back would otherwise land on the previous question and then get dragged
       forward again by a timer the student can't see. */
    cancelAdvance();
    goTo(stepBefore(step, d, prog, installOK, signedOut), "back");
  }

  /* The pending tap-to-advance, so it can be called off. */
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelAdvance() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }

  /** Let them see what they just chose, then do the thing. See ANSWER_BEAT_MS.
   *
   *  RE-ARMED, NOT QUEUED. Tapping a second university inside the beat cancels
   *  the first and starts the wait again, so the last tap wins and a student
   *  correcting a mis-tap is never carried forward on the strength of the
   *  answer they just changed.
   *
   *  Takes an ACTION rather than a step, because the last beat in the flow does
   *  not move to a question — it leaves for the dashboard. One timer for both
   *  is what makes "the last tap wins" true of the Done button too. */
  function afterBeat(run: () => void) {
    cancelAdvance();
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      run();
    }, ANSWER_BEAT_MS);
  }

  /** Show the answer, then move on to whatever this student is asked next.
   *  Every screen uses this rather than naming a successor — see `asks`. */
  function onward(patch?: Partial<Draft>, nextProg: Programme | undefined = prog) {
    /* The programme is passed explicitly where the tap just changed it: `prog`
       is derived from the draft React has not re-rendered with, so reading it
       here would decide the next question against the PREVIOUS degree — which
       is the same one-answer-behind bug the `patch` argument on `save` exists
       to prevent. */
    const next = stepAfter(step, { ...d, ...patch }, nextProg, installOK, signedOut);
    afterBeat(() => goTo(next));
  }

  // A timer that outlives the page would move a question under whoever is on
  // it next, or set state on a component that has gone.
  useEffect(() => cancelAdvance, []);

  return (
    /* THE PAGE SCROLLS, ALL OF IT (owner, 2026-08-04: "the whole page should be
       scrollable").

       This was built the other way this morning — h-dvh, heading pinned at the
       top, action pinned at the bottom in thumb reach, and only the options
       scrolling between them. The argument for it was that a button sitting
       under a list moves with the list's length, so it lands somewhere
       different on a short question than a long one. That is true and it is not
       worth what it cost: with the full university names in, the list is the
       tallest thing here, and a pinned frame turns a long answer list into a
       small window a student has to scroll inside a page that itself cannot
       move. One scroll, the whole document, the way every other page in the app
       already behaves.

       No logo (owner, same call: "remove the Bklsss logo from the page"). It
       went in this morning because onboarding was the one surface with no brand
       on it; a student who has just made an account with us does not need
       telling whose form this is. */
    /* 16px of page padding (owner, 2026-08-04), where it was 20. */
    /* THE BAR IS FIXED NOW, so the page has to end above it rather than
       underneath it: 8rem is its full height (24 fade + 44 button + 12) with
       room to spare, and without it the last course in a list can never be
       scrolled out from behind the button that confirms it. */
    <div className="mx-auto w-full max-w-[440px] px-4 pb-[calc(8rem+env(safe-area-inset-bottom))]">
      {/* No progress bar (owner, 2026-08-04: "remove the progress thing
          entirely"). It was three labelled nodes over three questions — a
          legend for a form you can finish in three taps, telling a student
          something the questions themselves already tell them.

          Back moves to the left with it. It was on the right because it hung
          under the stepper's last node; on its own, a lone control on the
          right of a form reads as the thing that skips it. */}
      <div className="flex h-9 items-center pt-6">
        {index > 0 && (
          <button
            type="button"
            onClick={back}
            className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            Back
          </button>
        )}
      </div>

      {/* Keyed by step so the animation replays on every question, and told
          which way it is going. */}
      <div key={step} data-dir={dir} className="onboard-step pt-6">
        {step === "you" && isClientFlow && (
          <Card
            /* FIRST, AND THE ONLY QUESTION THAT IS ABOUT THEM (owner,
               2026-08-04: "i didnt get to pick my avatar, can i not select it
               during onboarding?" and "i didnt set my name with that").

               It does NOT undo anonymous-by-default. That rule protects the
               stranger who taps a WhatsApp link to read — still given a name and
               a face on the spot, still asked nothing. This screen is only ever
               reached by somebody who chose to make an account, and the 200-face
               set was built for exactly this: its own note says a student "picks
               from twelve UNCLAIMED faces".

               First because it is the easiest thing on the page and the only one
               that is a pleasure — a form that opens by asking which university
               you attend opens with admin. */
            title="What should we call you?"
            /* ONE NAME. A handle field sat above this for about an hour on
               2026-08-05 — @deeky beside "Deeky Mvula" — and the owner killed it
               on sight: "this messes stuff up, don't have me change my username
               again so soon."
               He was right, and the reason is worth keeping. Clerk already
               collects a username at sign-up, so by the time anyone reaches this
               screen they have one. Asking again a minute later does not read as
               "here is your handle, change it if you like" — it reads as the app
               having lost the answer and wanting it again. Two name fields under
               one heading that asks for a name is a question nobody can tell
               they have already answered. */
            why="Your name and a face for it. This is what your classmates will see."
            actions={
              <Button
                variant="primary"
                size="lg"
                block
                arrow
                disabled={!name.trim()}
                onClick={() => {
                  save({
                    name: name.trim(),
                    avatar,
                    nameChosen: true,
                    coursesChosen: coursesAnswered,
                  });
                  onward();
                }}
              >
                {name.trim() ? "Continue" : "Type your name"}
              </Button>
            }
          >
            <input
              autoFocus
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              value={name}
              onChange={(e) => edit({ name: e.target.value })}
              /* The name this device was given, as the placeholder rather than
                 as the value. A pre-filled field is an answer somebody has to
                 undo; a placeholder is a suggestion they can ignore. */
              placeholder={identity?.name ?? "Your name"}
              aria-label="Your name"
              maxLength={40}
              className={FIELD}
            />

            <div className="mt-5">
              <Choices label="Pick a face">
                <AvatarPicker value={avatar} onPick={(id) => edit({ avatar: id })} />
              </Choices>
            </div>
          </Card>
        )}

        {step === "school" && (
          <Card
            title="Which university are you at?"
            why="Tap your university to carry on. If it isn't on the list, pick Other and type it in."
            /* THERE IS NO SKIP ON THIS QUESTION (owner, 2026-08-03: "the
               student cannot skip this — why would they not add the school?
               How do we add their courses and stuff if we have missing info
               on them?"). An unanswered school is the one gap the next
               question cannot work around, since it decides which courses are
               even offered. "Another university" is the answer for everyone we
               don't carry yet — an answer, not a skip, which is why it insists
               on a name, and why it is the only state this step has a button
               in: every other answer is one tap and gone. */
            actions={
              school === OTHER_SCHOOL ? (
                <Button
                  variant="primary"
                  size="lg"
                  block
                  arrow
                  disabled={!schoolName.trim()}
                  onClick={() => {
                    save({ coursesChosen: coursesAnswered });
                    /* TO THE PROGRAMME QUESTION, not past it. This said
                       "courses", which was correct while the flow branched —
                       a university we had no curriculum for skipped the two
                       middle questions. It does not branch any more (see
                       ORDER), so that jump left a student who picked "Another
                       university" as the only person never asked what they
                       study, and `firstGap` — which still checks programme —
                       would have marched them back to it on their next visit
                       anyway. */
                    onward();
                  }}
                >
                  {schoolName.trim() ? "Continue" : "Type your university"}
                </Button>
              ) : null
            }
          >
            {/* TICK AND GO (owner, 2026-08-03: "I just tick a university and I
                get taken to a new question"). One tap is the whole answer, so
                there is no Continue under it — a button you must press after
                you have already said the thing is a second ask.
                "Another university" is the exception: it needs a name typed,
                so it opens the field and keeps a Continue of its own. */}
            <SchoolPicker
              school={school}
              schoolName={schoolName}
              onPick={(id) => {
                /* A DIFFERENT school offers different courses, so anything
                   picked under the old one may not be on offer any more — and
                   the question goes back to unanswered with it. Re-tapping the
                   SAME school changes nothing and must not throw away an
                   answer already given, which is a real case now that the flow
                   resumes into a part-filled record. */
                const changed = id !== school;
                /* The programme search goes with the programme. Left standing,
                   a term typed against the old university's list silently
                   filters the new one, and a student who backs up to correct
                   their campus is shown an empty list of their own degrees. */
                if (changed) setProgQuery("");
                /* A different university means a different curriculum, so the
                   programme and everything picked under it go with it — a
                   Mulungushi student must not carry a ZCAS programme. */
                edit(
                  changed
                    ? { school: id, programme: null, programmeName: "", year: null, curriculum: [], typedCourses: [], courses: [], coursesAnswered: false }
                    : { school: id },
                );
                if (id !== OTHER_SCHOOL) {
                  /* SAVED NOW, MOVED IN A MOMENT. The write is not delayed with
                     the advance — a student who taps their university and
                     closes the tab inside that beat has still answered it, and
                     the resume reads the record rather than the timer. */
                  save({
                    school: id,
                    ...(changed
                      ? { courses: [], programme: null, programmeName: null, year: null, curriculum: [], typedCourses: [] }
                      : {}),
                    coursesChosen: changed ? false : coursesAnswered,
                  });
                  /* Always the programme question, even where we hold no
                     curriculum for this university — it is a line to type
                     rather than a list to tap, and it is the answer that turns
                     an empty campus into one we know something about. */
                  onward();
                } else {
                  /* "Another university" opens a field instead of advancing, so
                     a beat armed by a previous tap has to be called off — it
                     would otherwise carry them to the courses question while
                     they were typing the name. */
                  cancelAdvance();
                }
              }}
              onName={(v) => edit({ schoolName: v })}
              fill
            />
          </Card>
        )}

        {step === "programme" && (
          <Card
            title="What are you studying?"
            why={
              allProgrammes.length
                ? "Find your programme. Tap Back if you picked the wrong university."
                : "Type your degree as your university writes it. Yours is the first — it becomes the list the next student sees."
            }
          >
            {/* A LIST WHERE WE HAVE ONE, A LINE WHERE WE DON'T, and the same
                control either way. `programmesFor` is empty for the seven
                universities that publish no programme list at all, and the
                "not listed" row is there even when it is not — a registry can
                be out of date, and a student on a programme it omits still has
                to get through this question.

                Note the list is now EVERY programme, not only those whose
                curriculum was scraped: not knowing someone's timetable was
                never a reason to leave their degree out of the picker. See
                scripts/gen-programmes.mjs. */}
            {/* THE SAME BLANK AS EVERY OTHER TYPED ANSWER, not a box. The
                fields lost their frames on 2026-08-06 ("let it instead look
                like a line, a blank that you fill"), so a bordered search sat
                on this page as the one control still wearing the old shape.
                This is Field's own internals — the 2px rule, the gap, the 44px
                height, `focus-within` on the wrapper — with a mark on the left
                where that component puts `trailing` on the right. Kept in step
                with `FIELD`; the three must never disagree. */}
            {allProgrammes.length > 8 && (
              <div className="mb-4 flex items-center gap-2 border-b-2 border-line transition-colors focus-within:border-ink">
                <HugeIcon name="search" size={18} className="shrink-0 text-placeholder" />
                <input
                  value={progQuery}
                  onChange={(e) => setProgQuery(e.target.value)}
                  placeholder="Search your programme"
                  aria-label="Search your programme"
                  className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-placeholder"
                />
              </div>
            )}
            {allProgrammes.length > 0 && (
              <OptionRows
                options={[
                  ...shownProgrammes.map((p) => ({
                    id: p.slug,
                    title: programmeLabel(p),
                    note: levelLabel(p),
                  })),
                  { id: OTHER_PROGRAMME, title: "Mine isn't listed", note: "Type it instead" },
                ]}
                value={programme}
                /* The screen reader gets the FULL name. Two programmes can share
                   a shortened title and be told apart only by the level line, so
                   the accessible name has to be the one that is always unique. */
                label={(slug) =>
                  slug === OTHER_PROGRAMME
                    ? "My programme isn't listed"
                    : (programmesFor(school).find((p) => p.slug === slug)?.name ?? String(slug))
                }
                onPick={(slug) => {
                  /* Changing programme invalidates the ticks under it — the same
                     rule the school question follows, one level down. The year
                     is kept: it is a fact about the student, not about the
                     programme, and re-asking it after a correction is asking
                     them something they have already told us. */
                  const changed = slug !== programme;
                  edit(
                    changed
                      ? {
                          programme: String(slug),
                          programmeName: "",
                          curriculum: [],
                          typedCourses: [],
                          courses: [],
                          coursesAnswered: false,
                        }
                      : { programme: String(slug) },
                  );
                  if (slug === OTHER_PROGRAMME) {
                    /* Typing is the answer, not the tap — so this row opens a
                       field instead of advancing, exactly as "Other" does on
                       the university question. A beat armed by a previous tap
                       has to be called off or it would drag them off the field
                       mid-word. */
                    cancelAdvance();
                    return;
                  }
                  save({
                    programme: String(slug),
                    programmeName: null,
                    ...(changed ? { curriculum: [], typedCourses: [], courses: [] } : {}),
                    coursesChosen: changed ? false : coursesAnswered,
                  });
                  onward({ programme: String(slug) }, programmeBySlug(school, slug));
                }}
              />
            )}

            {(programme === OTHER_PROGRAMME || allProgrammes.length === 0) && (
              <input
                autoFocus
                value={programmeName}
                onChange={(e) => edit({ programme: OTHER_PROGRAMME, programmeName: e.target.value })}
                placeholder="e.g. Bachelor of Accountancy"
                aria-label="Your programme"
                maxLength={160}
                className={FIELD + (allProgrammes.length ? " mt-2" : "")}
              />
            )}
          </Card>
        )}

        {step === "year" && (
          <Card
            title="Which year are you in?"
            why="This sets up your courses. You can change them any time in Settings."
          >
            <OptionRows
              /* 1–6 where we hold no timetable to read the years off. A student
                 knows their own year whether or not we know their curriculum,
                 and it is what makes the courses they list mean something to
                 the next student on the same programme. */
              options={years.map((y) => {
                const n = prog?.courses.filter((c) => c.year === y).length ?? 0;
                return {
                  id: y,
                  title: `Year ${y}`,
                  ...(n ? { note: `${n} course${n === 1 ? "" : "s"}` } : {}),
                };
              })}
              value={year}
              label={(y) => `Year ${y}`}
              onPick={(y) => {
                /* THE YEAR NO LONGER TICKS ANYTHING BY ITSELF. It used to tick
                   the whole year, which is eight courses where a student sits
                   four (owner, 2026-08-04: "don't like that we automatically
                   tick all these courses"). The ticking moved one question down,
                   to the semester, which is the granularity a timetable actually
                   has.

                   Where a programme records no semesters there is no next
                   question to do it, so the year still ticks its own courses —
                   the old behaviour, kept for the programmes that need it.

                   `coursesChosen` is deliberately NOT set here. It is what
                   `onboardingComplete` reads and what `firstGap` resumes on, so
                   setting it would mark the course question answered before the
                   student had seen it — and somebody who closed the tab on that
                   screen would be resumed past it, never having laid eyes on
                   their own courses. The screen that shows them is the screen
                   that gets to say they were answered.

                   Only on a CHANGE of year, so coming Back and re-tapping the
                   same year cannot wipe what they unticked after. */
                const changed = y !== year;
                const hasHalves = semestersFor(prog, y).length > 1;
                /* Changing year invalidates the semester under it, exactly as
                   changing programme invalidates the year. */
                const nextSem = changed ? null : semester;
                const picks = changed
                  ? hasHalves
                    ? []
                    : coursesByYear(prog, y).thisYear.map((c) => c.slug)
                  : curriculum;
                const live = prog ? liveSlugsFor(prog, picks) : builtFor(typedCourses);
                edit({ year: y, semester: nextSem, curriculum: picks, courses: live });
                save({
                  year: y,
                  semester: nextSem,
                  curriculum: picks,
                  courses: live,
                  coursesChosen: coursesAnswered,
                });
                onward({ year: y, semester: nextSem });
              }}
            />
          </Card>
        )}

        {step === "semester" && (
          <Card
            title="Which semester are you in?"
            why="We'll tick that semester's courses for you. You can add the other half on the next screen."
          >
            <OptionRows
              options={semestersFor(prog, year).map((n) => {
                const count = prog?.courses.filter((c) => c.year === year && c.semester === n).length ?? 0;
                return {
                  id: n,
                  title: `Semester ${n}`,
                  ...(count ? { note: `${count} course${count === 1 ? "" : "s"}` } : {}),
                };
              })}
              value={semester}
              label={(n) => `Semester ${n}`}
              onPick={(n) => {
                /* THIS is the predictive step now. Picking the semester ticks
                   ITS courses — four, not the year's eight — and hands them to
                   the next screen already filled in, so the work there is
                   confirming a list rather than building one.

                   Only on a CHANGE, so coming Back and re-tapping the same
                   semester cannot wipe what they unticked after. */
                const changed = n !== semester;
                const picks = changed
                  ? coursesByYear(prog, year, n).thisYear.map((c) => c.slug)
                  : curriculum;
                const live = prog ? liveSlugsFor(prog, picks) : builtFor(typedCourses);
                edit({ semester: n, curriculum: picks, courses: live });
                save({ semester: n, curriculum: picks, courses: live, coursesChosen: coursesAnswered });
                onward({ semester: n });
              }}
            />
          </Card>
        )}

        {step === "courses" && !typing && prog && (
          <Card
            title="These are your courses"
            why={
              semester
                ? "We've ticked this semester already. Untick anything you dropped, and add from the rest of the degree if you're taking it."
                : "We've ticked your year already. Untick anything you dropped, and add from another year if you're taking it."
            }
            actions={
              <Button
                variant="primary"
                size="lg"
                block
                arrow
                disabled={curriculum.length === 0}
                onClick={() => {
                  edit({ coursesAnswered: true });
                  save({ coursesChosen: true, curriculum, courses: liveSlugsFor(prog, curriculum) });
                  onward();
                }}
              >
                {curriculum.length === 0
                  ? "Pick at least one"
                  : `Continue with ${curriculum.length} course${curriculum.length > 1 ? "s" : ""}`}
              </Button>
            }
          >
            <CurriculumPicker
              thisYear={coursesByYear(prog, year, semester).thisYear}
              otherYears={coursesByYear(prog, year, semester).otherYears}
              year={year}
              semester={semester}
              picked={curriculum}
              onToggle={(slug) => {
                const next = curriculum.includes(slug)
                  ? curriculum.filter((s) => s !== slug)
                  : [...curriculum, slug];
                /* Both lists move together: `curriculum` is the demand signal
                   and `courses` is what the dashboard may actually render. */
                edit({ curriculum: next, courses: liveSlugsFor(prog, next) });
              }}
            />
          </Card>
        )}

        {step === "courses" && typing && (
          <Card
            title="Which courses are you taking?"
            why="Nothing is on file for your programme yet, so tell us — and what you list is what the next student on it gets offered."
            actions={
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  block
                  arrow
                  disabled={typedCourses.length === 0}
                  onClick={() => {
                    edit({ coursesAnswered: true });
                    save({ coursesChosen: true, typedCourses, courses: builtFor(typedCourses) });
                    onward();
                  }}
                >
                  {typedCourses.length === 0
                    ? "Add at least one"
                    : `Continue with ${typedCourses.length} course${typedCourses.length > 1 ? "s" : ""}`}
                </Button>
                {/* THE ESCAPE HATCH STAYS. Typing eight course names is real
                    work, and a sign-up that cannot be finished without it is a
                    sign-up some students will not finish. This is an ANSWER —
                    the question is marked asked — not a skip that leaves a
                    half-filled record for the dashboard's gate to catch. */}
                <Button
                  variant="secondary"
                  size="md"
                  block
                  onClick={() => {
                    edit({ typedCourses: [], courses: [], coursesAnswered: true });
                    save({ typedCourses: [], courses: [], coursesChosen: true });
                    onward();
                  }}
                >
                  I&rsquo;ll add these later
                </Button>
              </div>
            }
          >
            <TypedCoursePicker
              titles={typedCourses}
              suggested={suggested}
              known={query.trim().length >= 2 ? known : []}
              query={query}
              onQuery={setQuery}
              onToggle={toggleTyped}
              onAdd={addTyped}
              fill
            />
          </Card>
        )}

        {step === "target" && (
          <Card
            title="Set your weekly goal"
            why="Pick the days you'll put the time in, and how long each of them. An ordinary week, not your best one."
            actions={
              <Button
                variant="primary"
                size="lg"
                block
                arrow
                disabled={picked.length === 0}
                onClick={() => {
                  savePlan();
                  onward();
                }}
              >
                {picked.length === 0 ? "Pick at least one day" : "Continue"}
              </Button>
            }
          >
            {/* TICK ROWS HERE TOO (owner, 2026-08-04: "even on this part use the
                ticks throughout"). These were pills — the app's Button, so not
                invented, but still a second shape for the same job. Every other
                answer in the flow is a row you tick, and a question that asks
                for a different gesture is a question that reads as belonging to
                a different form. The days one takes more than one answer, which
                is what OptionRows' `values` is for. */}
            <Choices label="Which days?">
              <OptionRows
                /* No short-form note under the name. It was there when a row
                   had the whole width to itself and "Mon" under "Monday" was
                   merely redundant; in a half-width cell it is a second line
                   saying the same word again. */
                options={WEEKDAY_FULL.map((full, i) => ({ id: i, title: full }))}
                columns={2}
                values={picked}
                label={(i) => WEEKDAY_FULL[i]}
                onPick={(i) =>
                  edit({
                    target: {
                      ...target,
                      weekdays: picked.includes(i)
                        ? picked.filter((x) => x !== i)
                        : [...picked, i].sort((a, b) => a - b),
                    },
                  })
                }
              />
            </Choices>

            <div className="mt-5">
              <Choices label="How long each day?">
                <OptionRows
                  options={MINUTE_CHOICES.map((n) => ({
                    id: n,
                    /* Math.floor, not a bare divide: 90/60 is 1.5, and the
                       first render of this said "1.5h 30m". */
                    title: n >= 60 ? `${Math.floor(n / 60)}h${n % 60 ? ` ${n % 60}m` : ""}` : `${n}m`,
                    note: n === RECOMMENDED_MINUTES ? "Recommended" : undefined,
                  }))}
                  columns={2}
                  value={target.minutes}
                  label={(n) => `${n} minutes a day`}
                  onPick={(n) => edit({ target: { ...target, minutes: n } })}
                />
              </Choices>
            </div>

            {/* THE HONEST WARNING (owner, 2026-08-04: "if they start to pick
                ridiculous options like all the days and 3h each tell them to be
                realistic with themselves — tell them they cant change this any
                time soon and will be held accountable and lose points for
                unrealistic goals").

                Under the days, where the damage is done, and NOT a blocker: a
                student who means it should be allowed to promise it. It is a
                warning precisely because the two things it warns about are both
                real — see UNREALISTIC_WEEKLY_MINUTES. If either ever stops being
                true, this paragraph comes out the same day.

                It does the arithmetic for them, because "21 hours a week" is the
                argument. Nobody picks seven days and three hours having worked
                that out. */}
            {weeklyMinutes >= UNREALISTIC_WEEKLY_MINUTES && (
              <p className="mt-5 rounded-xl bg-ink/[0.04] p-3.5 text-[13.5px] leading-5 text-ink-2">
                <span className="font-medium text-ink">
                  That&apos;s {hoursLabel(weeklyMinutes)} a week.
                </span>{" "}
                Be honest about an ordinary week, not your best one. You can&apos;t change this for a
                while, and every week you fall short of a goal you set too high costs you points.
              </p>
            )}

            {/* The running total, once there is one and the warning above is not
                already saying it louder. */}
            {picked.length > 0 && weeklyMinutes < UNREALISTIC_WEEKLY_MINUTES && (
              <p className="mt-5 text-[13.5px] leading-5 text-muted">
                That&apos;s <span className="font-medium text-ink">{hoursLabel(weeklyMinutes)} a week</span>.
              </p>
            )}
          </Card>
        )}

        {step === "whatsapp" && (
          <Card
            title="What&rsquo;s your WhatsApp number?"
            /* WHAT IT IS FOR, IN THE QUESTION. Every other `why` on this page is
               an instruction, per the rule on Card — but a phone number is the
               one thing here we are asking for our benefit rather than theirs,
               and a student is entitled to know what it will be used for before
               they hand it over rather than after. */
            why="This is how we check in on you when you fall behind. We don't post it anywhere and we don't sell it."
            actions={
              <Button
                variant="primary"
                size="lg"
                block
                arrow
                disabled={!phone}
                onClick={() => {
                  save({ coursesChosen: coursesAnswered, whatsapp: phone });
                  onward();
                }}
              >
                {phone ? "Continue" : "Enter your number"}
              </Button>
            }
          >
            {/* THE MARK SITS IN THE FIELD (owner, 2026-08-04: "you can use the
                whatsapp icon to lighten it up a bit"). In the field rather than
                beside the heading, because that is where it says something: it
                tells you what KIND of number the box wants, at the moment you are
                about to type one. Beside a heading that already reads "What's
                your WhatsApp number?" it would only be saying it twice.

                The solid glyph, not the green disc with the handset knocked out
                of it in white — see components/icons/whatsapp for why that one
                vanishes on a pale surface. */}
            {/* The mark sits ON the line's left end now the box is gone. It was
                inset to left-3.5 to clear a border that no longer exists;
                against a rule, anything inset reads as floating away from it. */}
            <div className="relative">
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2">
                <WhatsAppMark size={19} />
              </span>
              <input
                autoFocus
                /* `tel`, so a phone raises the number pad rather than the
                   alphabet. Not `number`: that draws a spinner, silently drops a
                   leading zero, and 0977… is exactly how a Zambian number is
                   written down. */
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={whatsapp}
                onChange={(e) => edit({ whatsapp: e.target.value })}
                placeholder="0977 123 456"
                aria-label="Your WhatsApp number"
                maxLength={20}
                /* pl-7 clears the 19px mark at the line's left end — the box
                   version needed pl-11 to clear the same mark inset by 14. */
                className={FIELD + " pl-7"}
              />
            </div>
            {/* Shown only once they have typed enough to be wrong. A validation
                message that greets an empty field is telling somebody off for
                not having started. */}
            {whatsapp.trim().length >= 6 && !phone && (
              <p className="mt-2 text-[13px] leading-5 text-muted">
                That doesn&apos;t look like a Zambian mobile. Try it as 0977 123 456.
              </p>
            )}
            {phone && <p className="mt-2 text-[13px] leading-5 text-muted">We&apos;ll use {phone}.</p>}
          </Card>
        )}

        {step === "window" && (
          <Card
            /* ITS OWN SCREEN (owner, 2026-08-04: "the question about what time of
               day, can we put it on the next set of questions on its own — its
               pretty important").

               It was a third block under the weekly goal, below the days and the
               durations, which made it read as a detail of "how much time" when
               it is a different question entirely. How long you study is a plan
               you are making; when your head works is a fact about you that no
               plan changes — and it is the one that decides whether a reminder is
               worth sending at all. A question nobody scrolls to is a question
               answered by whoever happened to reach it. */
            title="When does the hard stuff go in easiest?"
            why="Think about where you actually get your best work done, not where you'd like to."
          >
            <OptionRows
              options={WINDOWS}
              columns={2}
              value={studyWindow}
              label={(id) => WINDOWS.find((w) => w.id === id)?.title ?? String(id)}
              onPick={(id) => {
                const w = id as StudyWindow;
                edit({ studyWindow: w });
                savePlan(w);
                onward({ studyWindow: w });
              }}
            />
          </Card>
        )}

        {step === "install" && (
          <Card
            /* ONE SCREEN, TWO STORIES — Chrome/Android gets a real button that
               fires the OS install dialog; iOS gets directions, because Safari
               has no API to trigger from here at all. `asks()` is what keeps a
               THIRD case — nothing to offer — from ever reaching this render,
               so there is no branch here for "neither": if this is on screen,
               one of the two is true. */
            title={canInstall ? "Install Booklesss on your phone" : "Add Booklesss to your home screen"}
            why={
              canInstall
                ? "One tap, and it opens like an app from here on — no browser bar."
                : "In Safari, tap the Share button, then “Add to Home Screen.” Ten seconds, and it opens like an app from here on."
            }
            actions={
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  block
                  /* An arrow says "continue"; installing is an action, not a
                     step, so it earns one only on the iOS card, where the
                     button really is just moving on past what was just read. */
                  arrow={!canInstall}
                  busy={installing}
                  onClick={async () => {
                    if (canInstall) {
                      /* The OS draws its own modal here — `install()` doesn't
                         resolve until the student has answered IT, which can be
                         several seconds either way. `busy` is what stops the
                         button looking unpressed for that whole stretch. Moving
                         on afterwards regardless of `accepted` vs `dismissed`:
                         a "no thanks" to Chrome's dialog is still an answer to
                         OUR question, not a reason to ask it again. */
                      setInstalling(true);
                      await install();
                      setInstalling(false);
                    }
                    onward();
                  }}
                >
                  {canInstall ? (installing ? "Waiting on you" : "Install the app") : "Continue"}
                </Button>
                {/* No skip on the iOS card — there is nothing to skip, since
                    tapping Continue there doesn't attempt anything the student
                    could decline. Chrome's card gets one because tapping
                    Install raises a real OS dialog asking permission, and a
                    student entitled to say no to THAT is entitled to not be
                    asked at all. */}
                {canInstall && (
                  <Button variant="secondary" size="md" block onClick={() => onward()}>
                    Not now
                  </Button>
                )}
              </div>
            }
          >
            <div className="flex flex-col gap-3">
              {[
                "Opens straight to your dashboard, no browser bar",
                "Lessons you've saved open with no signal",
                "Sits on your home screen like any other app",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 text-ink-2">
                    <HugeIcon name="check" size={16} />
                  </span>
                  <p className="text-[14px] leading-5 text-ink-2">{line}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {step === "heard" && (
          <Card
            title="How did you hear about us?"
            /* "Last one" is only true for a student who already has an account
               — everybody else has the password after this, and a screen that
               promises to be the end and then produces another one is the small
               dishonesty that makes a form feel longer than it is. */
            why={
              signedOut
                ? "Last question. Tap whichever is closest, then save your answers."
                : "Last one. Tap whichever is closest, then you're in."
            }
            /* IT DOES NOT FINISH ON THE TAP (owner, 2026-08-04: "dont auto select
               the how did you hear about us part"). It used to answer and leave
               in one gesture, which on the LAST screen means a student taps a row
               and the app is simply gone — no chance to see what they picked, and
               no chance to change it. Every other list in this flow shows the
               answer for a beat before moving; this one moved to a different page
               entirely, so it needed the button rather than the beat. */
            actions={
              <Button
                variant="primary"
                size="lg"
                block
                arrow
                disabled={!heardFrom}
                onClick={() => heardFrom && finish(heardFrom)}
              >
                {heardFrom ? (signedOut ? "Continue" : "Done") : "Pick one to finish"}
              </Button>
            }
          >
            <OptionRows
              options={SOURCES}
              value={heardFrom}
              label={(id) => SOURCES.find((x) => x.id === id)?.title ?? String(id)}
              onPick={(id) => edit({ heardFrom: id as HeardFrom })}
            />
          </Card>
        )}

        {/* THE PASSWORD, LAST (owner, 2026-08-26). Everything above this is
            answered by a stranger; this is where they become a student with an
            account, and the eleven answers already on the device go up with
            them the moment AccountSignal sees a session.

            NO `actions` ON THE CARD, and that is not an oversight. Card portals
            its action to the fixed bar at the bottom of the screen, which is
            right for a thirty-row course list and wrong for two fields — the
            same argument components/auth/AuthPanel makes for not reusing Card
            at all. AuthForm brings its own button and it sits under the
            password, where the eye already is.

            WHAT IT ASKS FOR IS UNCHANGED, and that is the point of routing it
            through AuthForm rather than building a second pair of fields here.
            One box that signs in OR creates, one password rule, one set of
            error sentences, one forgotten-password door — see the note atop
            AuthForm. A student who turns out to have an account already is
            simply signed into it, which on this screen is exactly right: their
            fresh answers are the newer ones and the merge in lib/identity hands
            it to them on `updatedAt`, so the eleven questions they just sat
            through are not thrown away by having been here before. */}
        {step === "account" && (
          <Card
            title="Save your answers"
            why="An email and a password, and your plan follows you to any phone you sign in on."
          >
            {/* Both destinations are the same one. AuthForm splits them because
                a NEW account normally owes us these questions — but they have
                just been answered, so there is nowhere to divert to and a new
                account goes exactly where a returning one does. */}
            <AuthForm after={nextFromQuery()} afterNew={nextFromQuery()} autoFocus={false} />
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * One question, ON THE PAGE — no card around it (owner, 2026-08-03: "remove
 * that container around the questions, I don't need a whole container").
 *
 * It wore Clerk's card geometry so the flow would match the sign-up card it
 * used to end on. That card is now on the landing page instead, so the box
 * was framing nothing: a white panel on a grey page, holding rows that are
 * themselves white panels — a card inside a card, which is the thing the
 * house style says not to draw.
 *
 * The rows keep their surface, because they are the controls. Everything
 * around them is the page.
 */
function Card({
  title,
  why,
  actions,
  children,
}: {
  title: string;
  /**
   * The line under the question. AN INSTRUCTION, NOT AN EXPLANATION.
   *
   * Owner, 2026-08-04: "dont say so we show the right courses on that
   * description, we just need to tell them what to do — we cannot be revealing
   * everything to the student."
   *
   * All three of these used to narrate our own machinery: "So we show you the
   * right courses" said the answer drives a filter, "your dashboard counts only
   * these" said what the tiles read, "the only number we score you against"
   * said there is a score and what feeds it. None of that is the student's
   * business at the moment they are being asked, and a form that explains why
   * it wants something invites a student to argue with the reason instead of
   * answering. Say what to do.
   *
   * TWO LINES, and use them (owner, same day: "the descriptions under the
   * questions can be a bit longer, 2 lines max, giving context on what the user
   * should do"). One clipped sentence was the over-correction: "Pick yours to
   * continue" tells somebody whose university is not on the list nothing at all.
   * The second line is where the edge case goes — what to do if yours is
   * missing, what to do if you don't know yet — which is context about THEIR
   * choice, not about our machinery. Two lines is the ceiling: a paragraph over
   * a list of options is a paragraph nobody reads.
   *
   * This is the rule for every new question added here, not a one-off edit to
   * three strings.
   */
  why: string;
  /** The step's primary action, under the options. Null on a question that
   *  answers itself in one tap — a button under an answer you have already
   *  given is a second ask. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  /* ORDINARY FLOW, nothing pinned and nothing with its own scrollbar (owner,
     2026-08-04: "the whole page should be scrollable"). This was a three-part
     frame this morning — fixed head, scrolling middle, fixed foot — and the
     min-h-0/flex-1 that made it work is exactly what made the options list a
     small window inside a page that could not itself move. */
  const isClient = useIsClient();

  return (
    <section>
      <div>
        {/* Back to 30px (owner, 2026-08-04: "make the question title big
            again"). It was cut to 23px in c869b05 alongside the quieter
            stepper — but the stepper is gone now, and the question is the only
            thing on the screen that says what this is. */}
        <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h1>
        {/* Room for two lines, and a measure that makes them break sensibly
            rather than leaving one word alone on the second. */}
        <p className="mt-2 max-w-[38ch] text-[14px] leading-[1.45] text-muted">{why}</p>
      </div>
      <div className="mt-5">{children}</div>
      {actions && isClient
        ? createPortal(
            /* THE ACTION RIDES THE BOTTOM OF THE SCREEN (owner, 2026-08-04:
               "the button is at the bottom of the page … it needs to always be
               visible in case I find my courses at the top").

               A full year's courses plus the other years' groups is a long
               list, and the button sat under all of it — so a student who found
               their courses in the first three rows still had to scroll past
               thirty to say so.

               PORTALLED TO <body>, AND THAT IS THE LOAD-BEARING PART. As a
               child of the question it vanished completely (owner: "now the
               button is not here anymore, its doing its calculations at the
               bottom of the page"). `.onboard-step` runs the slide-in with
               animation-fill-mode: both, so `transform: translate3d(0,0,0)`
               STAYS on the element after the animation ends — and any transform
               other than `none` makes an element the containing block for
               `position: fixed` descendants. So `bottom` stopped meaning the
               viewport and started meaning the bottom of the question's own
               content, which on a thirty-row list is far below the fold. Sticky
               was immune to this and fixed is not, which is why the bug arrived
               with the fix for the last one.

               Out at <body> there is no transformed ancestor to be captured by,
               and no future one can capture it either.

               PLAIN `bottom: 0`, AND NOTHING CLEVER ON TOP OF IT. It briefly
               carried a measured offset — `--vv-bottom`, the gap between the
               layout and visual viewports, read off visualViewport — to answer
               the earlier bug where the bar was sliced in half by the bottom of
               the screen. That bug was real and this was the wrong fix for it,
               because it was a bug about STICKY. Sticky is positioned in the
               scrollport, which on Chrome Android is sized for the collapsed URL
               bar; FIXED is anchored by the browser to the viewport you can
               actually see, and the keyboard is handled by the layout viewport
               shrinking (interactive-widget=resizes-content, set in layout.tsx).
               Both cases were already answered, so the measurement was a second
               correction applied on top of the browser's own — and with the
               keyboard open the two stacked and threw the button 400px up the
               page, over the field it belonged to (owner, with the screenshot:
               "now having problems with these buttons").

               NOT A PINNED FRAME. The rejected version (same day: "the whole
               page should be scrollable") was h-dvh with a fixed head, a fixed
               foot and only the options scrolling between them. That rule
               stands: one scroll, the whole document. Only the action floats,
               and the page reserves room so nothing hides behind it. */
            <div
              className="fixed inset-x-0 bottom-0 z-20"
              style={{
                background:
                  /* Opaque under the button, fading only above it. It was
                     0.94 across the whole bar and the rows behind still ghosted
                     through the strip beneath the button — 6% of a bold heading
                     is legible enough to read as a rendering fault. The fade
                     starts where the button's top edge is, so the softness is
                     all above and nothing shows through below. */
                  "linear-gradient(to top, rgb(255,255,255) 0%, rgb(255,255,255) 74%, rgba(255,255,255,0) 100%)",
              }}
            >
              {/* The page's own column, repeated — a portalled element cannot
                  inherit the width it is meant to line up with. Same max-width
                  and same 16px padding as the questions, or the button would run
                  the full width of the phone while everything it belongs to
                  stopped short. */}
              <div className="mx-auto w-full max-w-[440px] px-4 pt-6 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                {actions}
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}

/** A row of set answers. Buttons rather than a slider or a number field: on a
 *  phone a slider is a fight, and a free number invites "600 minutes" from
 *  somebody being optimistic at midnight. */
/**
 * A labelled row of choices. A LAYOUT, not a control.
 *
 * It used to draw its own buttons — a hand-rolled `<button>` with its own
 * background, border, radius and hover, which is a second button in an app that
 * already has one (owner, 2026-08-04: "this button that you are using, is it my
 * component button? Use my actual button, don't make up one"). It was drifting
 * too: `bg-ink text-white` is what `.btn[data-variant=primary]` already means,
 * copied by hand and free to fall out of step with it.
 *
 * So the caller passes real `<Button>`s and this only puts a label over them
 * and wraps them. Seven days do not fit a fixed six-column grid the way six
 * minute options did, so it flows instead of gridding — which also means a
 * future row of four or eight needs nothing here.
 */
function Choices({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-display text-[13px] font-medium text-ink-2">{label}</p>
      {children}
    </div>
  );
}
