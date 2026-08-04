"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { coursesForSchool } from "@/lib/courses";
import {
  firstUnanswered,
  saveOnboarding,
  useIdentity,
  type Identity,
  type StudyTarget,
} from "@/lib/identity";
import { OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";
import { CoursePicker, SchoolPicker } from "@/components/identity/pickers";
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

/* The offer for "how many days a week", and "how many minutes when you sit
 * down". Both are ranges a student can answer honestly rather than
 * aspirationally: the point of the number is that the dashboard will hold
 * them to it, so 2 days has to be as sayable as 7. */
const DAY_CHOICES = [2, 3, 4, 5, 6, 7];
const MINUTE_CHOICES = [15, 30, 45, 60, 90, 120];

type Step = "school" | "courses" | "target";
const ORDER: Step[] = ["school", "courses", "target"];

/** The three answers as the form holds them. */
type Draft = {
  school: SchoolChoice | null;
  schoolName: string;
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
    courses: identity?.courses ?? [],
    coursesAnswered: identity?.coursesChosen ?? false,
    target: identity?.target ?? { days: 4, minutes: 30 },
  };
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

  const { school, schoolName, courses, coursesAnswered, target } = draft ?? asDraft(identity);
  const step = stepPick ?? (hydrated ? firstUnanswered(identity) : "school");

  /** Change one answer, and take the form off the record for good. */
  function edit(patch: Partial<Draft>) {
    setDraft({ school, schoolName, courses, coursesAnswered, target, ...patch });
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
  const offered = useMemo(() => coursesForSchool(school), [school]);

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
  }) {
    const s = "school" in patch ? (patch.school ?? null) : school;
    saveOnboarding({
      school: s,
      schoolName: s === OTHER_SCHOOL ? schoolName.trim() || null : null,
      courses: patch.courses ?? courses,
      coursesChosen: patch.coursesChosen,
      ...(patch.target === undefined ? {} : { target: patch.target }),
    });
  }

  /** The last answer — the plan, written here and only here — and into the
   *  app. `replace`, so the back button out of the dashboard is the page they
   *  came from rather than the questions they just finished. */
  function finish() {
    save({ coursesChosen: true, target });
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
    goTo(ORDER[Math.max(0, index - 1)], "back");
  }

  return (
    /* A SCREEN, NOT A PAGE (owner's reference, 2026-08-04). The question and
       its action are pinned — heading at the top, primary action at the
       bottom in thumb reach — and only the options scroll between them. A
       button that sits directly under a list moves with the list's length,
       so on the courses question it lands somewhere different for a student
       at ZCAS than for one who asked for everything. Same place, every step.

       h-dvh rather than min-h-dvh: the column has to know its own height for
       the middle to be the only thing that scrolls. */
    <div className="mx-auto flex h-dvh w-full max-w-[440px] flex-col px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      {/* The wordmark, top left (owner, 2026-08-04). Onboarding was the one
          screen in the app with no brand on it at all — a student who has just
          handed over an email address is looking at three questions from
          nobody in particular.

          INLINE, NOT A MASTHEAD (owner, same call: "it must feel like its
          inline"). 18px is exactly what the app's own header wears on a phone,
          so this reads as the product's chrome rather than as a logo screen
          the questions happen to be under.

          The wordmark IS the logo — no mark beside it (2026-08-03). It is
          also NOT a link: every other place it appears goes to /dashboard, and
          from here that is a door straight into RequireOnboarding, which would
          measure this same unfinished record and send them back. A logo that
          bounces you where you already are is worse than one that sits still. */}
      <div className="shrink-0 pt-6">
        <span className="font-display text-[18px] font-bold leading-none tracking-tight text-ink">
          Booklesss
        </span>
      </div>

      {/* No progress bar (owner, 2026-08-04: "remove the progress thing
          entirely"). It was three labelled nodes over three questions — a
          legend for a form you can finish in three taps, telling a student
          something the questions themselves already tell them.

          Back moves to the left with it. It was on the right because it hung
          under the stepper's last node; on its own, a lone control on the
          right of a form reads as the thing that skips it. */}
      <div className="flex h-9 shrink-0 items-center">
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
      <div key={step} data-dir={dir} className="onboard-step flex min-h-0 flex-1 flex-col pt-6">
        {step === "school" && (
          <Card
            title="Where do you study?"
            why="So we show you the right courses."
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
              query={query}
              onQuery={setQuery}
              onPick={(id) => {
                /* A DIFFERENT school offers different courses, so anything
                   picked under the old one may not be on offer any more — and
                   the question goes back to unanswered with it. Re-tapping the
                   SAME school changes nothing and must not throw away an
                   answer already given, which is a real case now that the flow
                   resumes into a part-filled record. */
                const changed = id !== school;
                edit(changed ? { school: id, courses: [], coursesAnswered: false } : { school: id });
                if (id !== OTHER_SCHOOL) {
                  save({
                    school: id,
                    ...(changed ? { courses: [] } : {}),
                    coursesChosen: changed ? false : coursesAnswered,
                  });
                  goTo("courses");
                }
              }}
              onName={(v) => edit({ schoolName: v })}
              fill
            />
          </Card>
        )}

        {step === "courses" && (
          <Card
            title="Which courses are you taking?"
            why="Choose as many as you like — your dashboard counts only these."
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
            title="How much studying are you aiming for?"
            why="The only number we score you against."
            actions={
              <Button variant="primary" size="lg" block onClick={finish}>
                Start studying
              </Button>
            }
          >
            <Choices
              label="Days a week"
              value={target.days}
              options={DAY_CHOICES}
              format={(n) => String(n)}
              onPick={(days) => edit({ target: { ...target, days } })}
            />
            <div className="mt-4">
              <Choices
                label="Minutes each time"
                value={target.minutes}
                options={MINUTE_CHOICES}
                /* Math.floor, not a bare divide: 90/60 is 1.5, and the first
                   render of this said "1.5h 30m". */
                format={(n) => (n >= 60 ? `${Math.floor(n / 60)}h${n % 60 ? ` ${n % 60}m` : ""}` : `${n}m`)}
                onPick={(minutes) => edit({ target: { ...target, minutes } })}
              />
            </div>
            <p className="mt-4 text-[13.5px] leading-5 text-muted">
              That&apos;s{" "}
              <span className="font-medium text-ink">
                {Math.round((target.days * target.minutes) / 6) / 10} hours a week
              </span>
              . You can change it later.
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
  why: string;
  /** The step's primary action, pinned to the bottom of the screen. Null on a
   *  question that answers itself in one tap — a button under an answer you
   *  have already given is a second ask. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        {/* Back to 30px (owner, 2026-08-04: "make the question title big
            again"). It was cut to 23px in c869b05 alongside the quieter
            stepper — but the stepper is gone now, and the question is the only
            thing on the screen that says what this is. */}
        <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-5 text-muted">{why}</p>
      </div>
      {/* The only part that scrolls. `min-h-0` because a flex child's default
          min-height is its content, which would push the action off the bottom
          of the screen instead of scrolling — the one line that makes the whole
          layout work. The list ends above the action rather than sliding under
          it: a row half-hidden behind a button is a row somebody misses. */}
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto">{children}</div>
      {actions ? <div className="shrink-0 pt-4">{actions}</div> : null}
    </section>
  );
}

/** A row of set answers. Buttons rather than a slider or a number field: on a
 *  phone a slider is a fight, and a free number invites "600 minutes" from
 *  somebody being optimistic at midnight. */
function Choices({
  label,
  value,
  options,
  format,
  onPick,
}: {
  label: string;
  value: number;
  options: number[];
  format: (n: number) => string;
  onPick: (n: number) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-ink-2">{label}</p>
      <div className="grid grid-cols-6 gap-1.5">
        {options.map((n) => {
          const on = n === value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onPick(n)}
              aria-pressed={on}
              className={`squircle h-11 rounded-xl text-[14px] font-medium transition-colors ${
                on
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-ink-2 hover:border-line-2 hover:text-ink"
              }`}
            >
              {format(n)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
