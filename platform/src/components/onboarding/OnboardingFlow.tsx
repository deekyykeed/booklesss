"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { coursesForSchool } from "@/lib/courses";
import { saveOnboarding, useIdentity, type Identity, type StudyTarget } from "@/lib/identity";
import { OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";
import {
  coursesByYear,
  levelLabel,
  liveSlugsFor,
  programmeBySlug,
  programmeLabel,
  programmesFor,
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
 * 380ms, against the row's own 150ms colour transition: long enough for the
 * square to finish filling and be READ as filled, short enough that a student
 * answering three questions never feels held up. The step transition's 260ms
 * runs after this, not inside it.
 */
const ANSWER_BEAT_MS = 380;

type Step = "school" | "programme" | "year" | "courses" | "target";

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
 */
const ORDER: Step[] = ["school", "programme", "year", "courses", "target"];

/** The answers as the form holds them. */
type Draft = {
  school: SchoolChoice | null;
  schoolName: string;
  programme: string | null;
  /** What they typed when their degree isn't one we hold — see lib/identity. */
  programmeName: string;
  year: number | null;
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
};

/** What the form shows before anybody has touched it: whatever the student
 *  already answered, and the offer for anything they haven't. Four days at
 *  half an hour is a habit most people can actually keep — the number is only
 *  worth anything if it is the one they'd have picked. */
function asDraft(identity: Identity | null): Draft {
  return {
    school: identity?.school ?? null,
    schoolName: identity?.schoolName ?? "",
    programme: identity?.programme ?? null,
    programmeName: identity?.programmeName ?? "",
    year: identity?.year ?? null,
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
  };
}

/** Which question to open on — the first without an answer, over whichever
 *  steps this student is actually being asked. Mirrors lib/identity's
 *  `firstUnanswered` and extends it over the two data-dependent ones. */
function firstGap(d: Draft, steps: Step[]): Step {
  for (const s of steps) {
    if (s === "school" && (!d.school || (d.school === OTHER_SCHOOL && !d.schoolName.trim()))) return s;
    /* Same shape as the school question above it: picking "not listed" is not
       an answer on its own — the answer is what they then type. */
    if (s === "programme" && (!d.programme || (d.programme === OTHER_PROGRAMME && !d.programmeName.trim())))
      return s;
    if (s === "year" && !d.year) return s;
    if (s === "courses" && !d.coursesAnswered) return s;
  }
  return "target";
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
  /* What earlier students on this programme reported, and the pipeline's own
     titles as a typeahead. Both start empty and stay empty when there is no
     server — see the effects below. */
  const [suggested, setSuggested] = useState<{ title: string; students: number }[]>([]);
  const [known, setKnown] = useState<string[]>([]);

  const d = draft ?? asDraft(identity);
  const {
    school,
    schoolName,
    programme,
    programmeName,
    year,
    curriculum,
    typedCourses,
    courses,
    coursesAnswered,
    target,
  } = d;

  /** The days they picked, 0 = Monday. A record written before this question
   *  asked for named days has none, and gets an empty board rather than four
   *  days invented on its behalf — we genuinely never knew which. */
  const picked = target.weekdays ?? [];

  /** The programme they picked, with its courses. Undefined until they pick.
   *  Not memoised: it is a find over at most 41 rows, and a manual memo here is
   *  something the React Compiler has to give up optimising the component to
   *  preserve — a worse trade than the lookup it saves. */
  const prog = programmeBySlug(school, programme);

  const step = stepPick ?? (hydrated ? firstGap(d, ORDER) : "school");

  /** Whether this student is on the typed path — no curriculum on file for
   *  their programme, so their answers are the curriculum. The majority case;
   *  see ORDER. */
  const typing = !prog || prog.courses.length === 0;

  /** The years to offer. Off the programme where we have it, 1–6 where we do
   *  not: a year is a thing a student knows about themselves, and refusing to
   *  ask because we have no timetable to line it up against throws away the
   *  one answer that makes their course list mean something later. */
  const years = prog?.years.length ? prog.years : [1, 2, 3, 4, 5, 6];

  /** The programme as the server groups reports under: its slug where we hold
   *  it, otherwise the words they typed. */
  const programmeKey = (programme === OTHER_PROGRAMME ? programmeName : programme || "").trim();

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

  /* This page is for somebody who has just made an account. Anyone who lands
     here without one came from a stale link — send them to the front door,
     where the sign-up card is. `=== false` rather than falsy: null means Clerk
     has not reported yet, and bouncing a student mid-handshake would throw
     away the answers they are about to give. */
  useEffect(() => {
    if (signedIn === false) router.replace("/");
  }, [signedIn, router]);

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
    school?: SchoolChoice | null;
    courses?: string[];
    coursesChosen: boolean;
    target?: StudyTarget;
    programme?: string | null;
    programmeName?: string | null;
    year?: number | null;
    curriculum?: string[];
    typedCourses?: string[];
  }) {
    const s = "school" in patch ? (patch.school ?? null) : school;
    saveOnboarding({
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
      ...(patch.curriculum === undefined ? {} : { curriculum: patch.curriculum }),
      ...(patch.typedCourses === undefined ? {} : { typedCourses: patch.typedCourses }),
    });
  }

  /** The last answer — the plan, written here and only here — and into the
   *  app. `replace`, so the back button out of the dashboard is the page they
   *  came from rather than the questions they just finished. */
  function finish() {
    /* `days` is written as the count of what they actually picked, not carried
       off the draft — the draft starts at 0 and only the named days move. This
       is the one place the two representations are reconciled, and everything
       downstream (lib/performance) reads `days`. */
    save({ coursesChosen: true, target: { ...target, days: picked.length, weekdays: picked } });
    router.replace("/dashboard");
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
    goTo(ORDER[Math.max(0, index - 1)], "back");
  }

  /* The pending tap-to-advance, so it can be called off. */
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelAdvance() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }

  /** Show them the answer they just gave, then move. See ANSWER_BEAT_MS.
   *
   *  RE-ARMED, NOT QUEUED. Tapping a second university inside the beat cancels
   *  the first advance and starts the wait again, so the last tap wins and a
   *  student correcting a mis-tap is never carried forward on the strength of
   *  the answer they just changed. */
  function advanceAfterBeat(next: Step) {
    cancelAdvance();
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      goTo(next);
    }, ANSWER_BEAT_MS);
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
    <div className="mx-auto w-full max-w-[440px] px-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
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
                    goTo("courses");
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
                  advanceAfterBeat("programme");
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
              programmesFor(school).length
                ? "Pick your programme and we'll line up its courses for you. Tap Back if you picked the wrong university."
                : "Type your degree as your university writes it. Yours is the first — it becomes the list the next student sees."
            }
          >
            {/* A LIST WHERE WE HAVE ONE, A LINE WHERE WE DON'T, and the same
                control either way. `programmesFor` is empty for seven of the
                ten universities, and the last row is there even when it is
                not: 19 ZCAS programmes and 98 UNZA ones publish no curriculum,
                so they are absent from the index and a student on one of them
                would otherwise be asked to find a degree the list cannot
                contain. */}
            {programmesFor(school).length > 0 && (
              <OptionRows
                options={[
                  ...programmesFor(school).map((p) => ({
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
                  advanceAfterBeat("year");
                }}
              />
            )}

            {(programme === OTHER_PROGRAMME || programmesFor(school).length === 0) && (
              <input
                autoFocus
                value={programmeName}
                onChange={(e) => edit({ programme: OTHER_PROGRAMME, programmeName: e.target.value })}
                placeholder="e.g. Bachelor of Accountancy"
                aria-label="Your programme"
                maxLength={160}
                className={
                  "squircle h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink " +
                  "outline-none transition-colors placeholder:text-placeholder focus:border-ink " +
                  (programmesFor(school).length ? "mt-2" : "")
                }
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
                /* THE PREDICTIVE STEP. Picking a year TICKS that year's courses
                   and hands them to the next screen already filled in — the
                   whole point of the two questions above. The student confirms
                   a list instead of building one.

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
                const picks = changed ? coursesByYear(prog, y).thisYear.map((c) => c.slug) : curriculum;
                const live = prog ? liveSlugsFor(prog, picks) : builtFor(typedCourses);
                edit({ year: y, curriculum: picks, courses: live });
                save({ year: y, curriculum: picks, courses: live, coursesChosen: coursesAnswered });
                advanceAfterBeat("courses");
              }}
            />
          </Card>
        )}

        {step === "courses" && !typing && prog && (
          <Card
            title="These are your courses"
            why="We've ticked your year already. Untick anything you dropped, and add from another year if you're taking it."
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
                  goTo("target");
                }}
              >
                {curriculum.length === 0
                  ? "Pick at least one"
                  : `Continue with ${curriculum.length} course${curriculum.length > 1 ? "s" : ""}`}
              </Button>
            }
          >
            <CurriculumPicker
              thisYear={coursesByYear(prog, year).thisYear}
              otherYears={coursesByYear(prog, year).otherYears}
              year={year}
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
                    goTo("target");
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
                    goTo("target");
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
              <Button variant="primary" size="lg" block arrow disabled={picked.length === 0} onClick={finish}>
                {picked.length === 0 ? "Pick at least one day" : "Done"}
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

            <p className="mt-5 text-[13.5px] leading-5 text-muted">
              {picked.length > 0 ? (
                <>
                  That&apos;s{" "}
                  <span className="font-medium text-ink">
                    {Math.round((picked.length * target.minutes) / 6) / 10} hours a week
                  </span>
                  . You can change it later.
                </>
              ) : (
                "You can change this later."
              )}
            </p>
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
      {actions ? <div className="pt-5">{actions}</div> : null}
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
