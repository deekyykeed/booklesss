"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { coursesForSchool } from "@/lib/courses";
import { saveOnboarding, useIdentity, type Identity, type StudyTarget } from "@/lib/identity";
import { OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";
import {
  coursesByYear,
  hasProgrammes,
  levelLabel,
  liveSlugsFor,
  programmeBySlug,
  programmeLabel,
  programmesFor,
} from "@/lib/programmes";
import { CoursePicker, OptionRows, SchoolPicker } from "@/components/identity/pickers";
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
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
 * The questions, in order — and which of them this student is asked at all.
 *
 * PREDICTIVE, NOT A QUESTIONNAIRE (owner, 2026-08-04): "when they say the
 * school, I already know which programmes are at the school; when they say the
 * programme, I already know the courses; when they say the year, now I know the
 * specific courses… I'll do as much to help them so they don't have to manually
 * pick things which we could avoid." Two extra taps buy the student a course
 * list that is already their own timetable instead of a library to hunt through.
 *
 * THE MIDDLE TWO ARE DATA-DEPENDENT, which is the whole reason this is a
 * function and not a constant. Only one university has had its curriculum
 * scraped, so the other nine skip straight from school to courses and get the
 * plain library — no empty programme list, no dead end. Adding a university's
 * curriculum later turns its two questions on with no code change, which is
 * what was asked for: "set this up so it works dynamically, i will be filling
 * in those courses later."
 */
function stepsFor(school: SchoolChoice | null): Step[] {
  /* NO COURSE QUESTION WHERE WE ALREADY KNOW THE ANSWER (owner, 2026-08-04:
     "you don't have to show that to the user right now — just get them finished
     signing up, don't show the courses"). Programme plus year IS the course
     list; putting it on screen to be confirmed is the manual picking this flow
     exists to remove, and it is a screen of eight rows standing between someone
     who just made an account and being finished.

     They are still set — the year step writes them — and they are still
     editable, in Settings, which is where a student who is repeating a module
     or taking one early goes. Onboarding's job is to get them in.

     A university with no curriculum on file still has to ask, because nothing
     else can answer it there. */
  return hasProgrammes(school)
    ? ["school", "programme", "year", "target"]
    : ["school", "courses", "target"];
}

/** The answers as the form holds them. */
type Draft = {
  school: SchoolChoice | null;
  schoolName: string;
  programme: string | null;
  year: number | null;
  /** Curriculum slugs ticked — their real timetable, built or not. */
  curriculum: string[];
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
    year: identity?.year ?? null,
    curriculum: identity?.curriculum ?? [],
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
    if (s === "programme" && !d.programme) return s;
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

  const d = draft ?? asDraft(identity);
  const { school, schoolName, programme, year, curriculum, courses, coursesAnswered, target } = d;

  /** The days they picked, 0 = Monday. A record written before this question
   *  asked for named days has none, and gets an empty board rather than four
   *  days invented on its behalf — we genuinely never knew which. */
  const picked = target.weekdays ?? [];

  /* Which questions this student gets, and where they resume. Both read off the
     school, so a university with no curriculum on file never renders a
     programme step to resume into. */
  const ORDER = stepsFor(school);
  const step = stepPick ?? (hydrated ? firstGap(d, ORDER) : "school");

  /** The programme they picked, with its courses. Undefined until they pick.
   *  Not memoised: it is a find over at most 41 rows, and a manual memo here is
   *  something the React Compiler has to give up optimising the component to
   *  preserve — a worse trade than the lookup it saves. */
  const prog = programmeBySlug(school, programme);

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
    year?: number | null;
    curriculum?: string[];
  }) {
    const s = "school" in patch ? (patch.school ?? null) : school;
    saveOnboarding({
      school: s,
      schoolName: s === OTHER_SCHOOL ? schoolName.trim() || null : null,
      courses: patch.courses ?? courses,
      coursesChosen: patch.coursesChosen,
      ...(patch.target === undefined ? {} : { target: patch.target }),
      ...(patch.programme === undefined ? {} : { programme: patch.programme }),
      ...(patch.year === undefined ? {} : { year: patch.year }),
      ...(patch.curriculum === undefined ? {} : { curriculum: patch.curriculum }),
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
                    ? { school: id, programme: null, year: null, curriculum: [], courses: [], coursesAnswered: false }
                    : { school: id },
                );
                if (id !== OTHER_SCHOOL) {
                  /* SAVED NOW, MOVED IN A MOMENT. The write is not delayed with
                     the advance — a student who taps their university and
                     closes the tab inside that beat has still answered it, and
                     the resume reads the record rather than the timer. */
                  save({
                    school: id,
                    ...(changed ? { courses: [], programme: null, year: null, curriculum: [] } : {}),
                    coursesChosen: changed ? false : coursesAnswered,
                  });
                  // Straight to courses where we don't know the curriculum.
                  advanceAfterBeat(hasProgrammes(id) ? "programme" : "courses");
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
            title="What are you doing?"
            why="Pick your programme and we'll line up its courses for you. Tap Back if you picked the wrong university."
          >
            <OptionRows
              options={programmesFor(school).map((p) => ({
                id: p.slug,
                title: programmeLabel(p),
                note: levelLabel(p),
              }))}
              value={programme}
              /* The screen reader gets the FULL name. Two programmes can share
                 a shortened title and be told apart only by the level line, so
                 the accessible name has to be the one that is always unique. */
              label={(slug) => programmesFor(school).find((p) => p.slug === slug)?.name ?? slug}
              onPick={(slug) => {
                /* Changing programme invalidates the ticks under it — the same
                   rule the school question follows, one level down. The year is
                   kept where the new programme also teaches it, so somebody
                   correcting BSc to BA in year 4 stays in year 4. */
                const changed = slug !== programme;
                const next = programmeBySlug(school, slug);
                const keepYear = year && next?.years.includes(year) ? year : null;
                edit(
                  changed
                    ? { programme: slug, year: keepYear, curriculum: [], courses: [], coursesAnswered: false }
                    : { programme: slug },
                );
                save({
                  programme: slug,
                  ...(changed ? { year: keepYear, curriculum: [], courses: [] } : {}),
                  coursesChosen: changed ? false : coursesAnswered,
                });
                advanceAfterBeat("year");
              }}
            />
          </Card>
        )}

        {step === "year" && (
          <Card
            title="Which year are you in?"
            why="This sets up your courses. You can change them any time in Settings."
          >
            <OptionRows
              options={(prog?.years ?? []).map((y) => {
                const n = prog?.courses.filter((c) => c.year === y).length ?? 0;
                return { id: y, title: `Year ${y}`, note: `${n} course${n === 1 ? "" : "s"}` };
              })}
              value={year}
              label={(y) => `Year ${y}`}
              onPick={(y) => {
                /* THE STEP THAT ANSWERS THE COURSE QUESTION. Picking a year
                   enrols them in that year's courses outright — no confirming
                   screen after it (owner: "don't show the courses"). This is
                   what the two questions above were for: three taps and their
                   timetable is set.

                   `coursesChosen: true` is the load-bearing part. It is what
                   `onboardingComplete` reads, and with the courses screen gone
                   nothing else would ever set it — the student would finish the
                   flow, reach the dashboard, and be sent straight back by the
                   gate for a question they were never asked.

                   Only on a CHANGE of year, so coming Back and re-tapping the
                   same year cannot wipe edits made in Settings since. */
                const changed = y !== year;
                const picks = changed ? coursesByYear(prog, y).thisYear.map((c) => c.slug) : curriculum;
                const live = liveSlugsFor(prog, picks);
                edit({ year: y, curriculum: picks, courses: live, coursesAnswered: true });
                save({ year: y, curriculum: picks, courses: live, coursesChosen: true });
                advanceAfterBeat("target");
              }}
            />
          </Card>
        )}

        {/* The "These are your courses" confirmation screen stood here and is
            gone (owner, 2026-08-04: "don't show the courses"). The year step
            enrols them directly; see stepsFor. CurriculumPicker still exists in
            identity/pickers and is where the owner's "add courses that are not
            in the year they're in" ability lives — it belongs in Settings now,
            which is the one thing this change leaves owing. */}
        {step === "courses" && (
          <Card
            title="Which courses are you taking?"
            why="Tick the ones you're taking this semester. Not sure yet? Take everything and narrow it down later."
            actions={
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  block
                  disabled={courses.length === 0}
                  onClick={() => {
                    edit({ coursesAnswered: true });
                    save({ coursesChosen: true });
                    goTo("target");
                  }}
                >
                  {courses.length === 0
                    ? "Pick at least one"
                    : `Continue with ${courses.length} course${courses.length > 1 ? "s" : ""}`}
                </Button>
                {/* A real answer — the whole library — not a skip. */}
                <Button
                  variant="secondary"
                  size="md"
                  block
                  onClick={() => {
                    /* An answer, not a skip — so `courses: []` is passed
                       explicitly rather than read off state React has not
                       re-rendered with, and it is marked answered. */
                    edit({ courses: [], coursesAnswered: true });
                    save({ courses: [], coursesChosen: true });
                    goTo("target");
                  }}
                >
                  Show me everything
                </Button>
              </div>
            }
          >
            <CoursePicker
              offered={offered}
              courses={courses}
              query={query}
              onQuery={setQuery}
              onToggle={(slug) =>
                edit({
                  courses: courses.includes(slug) ? courses.filter((s) => s !== slug) : [...courses, slug],
                })
              }
              fill
            />
          </Card>
        )}

        {step === "target" && (
          <Card
            title="Set your weekly goal"
            why="Pick the days you'll put the time in, and how long each of them. An ordinary week, not your best one."
            actions={
              <Button variant="primary" size="lg" block disabled={picked.length === 0} onClick={finish}>
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
                options={WEEKDAYS.map((d, i) => ({ id: i, title: WEEKDAY_FULL[i], note: d }))}
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
