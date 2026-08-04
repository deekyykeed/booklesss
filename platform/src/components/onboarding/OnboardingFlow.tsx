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
import { MynaIcon } from "@/components/icons/myna";

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

  function back() {
    setStepPick(ORDER[Math.max(0, index - 1)]);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 pb-10">
      {/* ---- progress: a line with a check on every step done ---- */}
      <div className="pt-6">
        <Stepper index={index} />
        <div className="mt-3 flex items-center justify-end">
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
      </div>

      <div className="flex flex-1 flex-col pt-8 pb-8">
        {step === "school" && (
          <Card
            title="Where do you study?"
            why="So we show you the right courses."
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
                  setStepPick("courses");
                }
              }}
              onName={(v) => edit({ schoolName: v })}
            />
            {/* THERE IS NO SKIP ON THIS QUESTION (owner, 2026-08-03: "the
                student cannot skip this — why would they not add the school?
                How do we add their courses and stuff if we have missing info
                on them?"). He is right: an unanswered school is the one gap
                the next question cannot work around, since it is what decides
                which courses are even offered. "Another university" is the
                answer for everyone we don't carry yet — an answer, not a
                skip, which is why it insists on a name. */}
            {school === OTHER_SCHOOL && (
              <Button
                variant="primary"
                size="lg"
                block
                className="mt-4"
                disabled={!schoolName.trim()}
                onClick={() => {
                  save({ coursesChosen: coursesAnswered });
                  setStepPick("courses");
                }}
              >
                {schoolName.trim() ? "Continue" : "Type your university"}
              </Button>
            )}
          </Card>
        )}

        {step === "courses" && (
          <Card
            title="Which courses are you taking?"
            why="Your dashboard counts only these."
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
            />
            <div className="mt-5 flex flex-col gap-2">
              <Button
                variant="primary"
                size="lg"
                block
                disabled={courses.length === 0}
                onClick={() => {
                  edit({ coursesAnswered: true });
                  save({ coursesChosen: true });
                  setStepPick("target");
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
                  setStepPick("target");
                }}
              >
                Show me everything
              </Button>
            </div>
          </Card>
        )}

        {step === "target" && (
          <Card
            title="How much studying are you aiming for?"
            why="The only number we score you against."
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
            <Button variant="primary" size="lg" block className="mt-5" onClick={finish}>
              Start studying
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Progress as a labelled line of nodes — the owner's reference (2026-08-03):
 * a name over each step, a filled tick behind you, a ring where you are, an
 * empty node ahead, and the connector filled only as far as you have got.
 *
 * THE LABELS ARE WHAT MAKE THE TICKS MEAN ANYTHING. Without them this is
 * three dots, and "I don't see the checkmarks" is the fair reading of three
 * dots — nothing names what was completed. With SCHOOL / COURSES / PLAN over
 * them, a tick is visibly a question answered.
 *
 * NOTE THE FIRST SCREEN HAS NO TICK, and should not: nothing is finished when
 * you arrive. The reference behaves the same way — its own first row is one
 * ring and two empty nodes.
 *
 * THE NODES ARE SQUARES NOW (owner, 2026-08-04, who sent MynaUI's own
 * check-square page): an empty square for a question not yet answered, the
 * square with a tick in it once it is, and the tick drawn BOLD so an answered
 * step is legible in the shape as well as the colour. The empty node is the
 * separate `square` icon rather than a faded check-square — he asked for the
 * tick to come out when unchecked, and he is right that a ghosted tick reads
 * as answered from arm's length, which is the one thing this row must not say.
 *
 * A tick with no box around it is what the row used to draw, on a filled green
 * disc. That was a state, not a control; a checkbox is the thing everyone
 * already knows how to read, and it says "three questions, this many done"
 * without a legend.
 *
 * GREEN, AND NOT AS A PREFERENCE. Green is what completion means everywhere
 * else in this app — the coverage tile, the checkpoint ticks, the course-card
 * rings — so a ticked step in any other colour would be the one green thing
 * that isn't progress. `--color-brand-deep` rather than the brighter
 * `--color-brand`, because this sits on a near-white frosted surface where
 * the light green fails contrast. (The reference is blue; blue in this app is
 * already the Time tile.)
 */
const STEP_LABELS: Record<Step, string> = {
  school: "School",
  courses: "Courses",
  target: "Plan",
};

function Stepper({ index }: { index: number }) {
  const GREEN = "var(--color-brand-deep)";
  return (
    <ol className="flex items-start" aria-label={`Step ${index + 1} of ${ORDER.length}`}>
      {ORDER.map((s, i) => {
        const done = i < index;
        const now = i === index;
        const lit = done || now;
        return (
          <li
            key={s}
            className={"flex min-w-0 items-start " + (i === 0 ? "shrink-0" : "flex-1")}
          >
            {/* The connector sits at the nodes' centre line, so it has to be
                nudged down past the label above them. */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className="mt-[28px] h-[2px] flex-1 rounded-full transition-colors duration-500"
                style={{ backgroundColor: lit ? GREEN : "var(--color-line)" }}
              />
            )}
            <div className="flex flex-col items-center gap-1.5 px-1.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.07em] transition-colors duration-300"
                style={{ color: lit ? GREEN : "var(--color-placeholder)" }}
              >
                {STEP_LABELS[s]}
              </span>
              {/* Three states in two icons: a bold ticked square behind you,
                  an empty square in the step's own green where you are, and a
                  grey empty square ahead. The stroke does the same work the
                  fill used to — 2.2 on the tick against MynaUI's 1.5 — so
                  "answered" survives being read at 20px on a phone in the
                  sun, which a hairline tick does not. */}
              <span
                aria-current={now ? "step" : undefined}
                className="grid h-5 w-5 shrink-0 place-items-center transition-colors duration-300"
                style={{ color: lit ? GREEN : "var(--color-line-2)" }}
              >
                <MynaIcon
                  name={done ? "check-square" : "square"}
                  size={20}
                  strokeWidth={done ? 2.2 : now ? 1.9 : 1.5}
                />
              </span>
            </div>
          </li>
        );
      })}
    </ol>
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
function Card({ title, why, children }: { title: string; why: string; children: React.ReactNode }) {
  return (
    <section>
      <h1 className="font-display text-[23px] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
        {title}
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-5 text-muted">{why}</p>
      <div className="mt-5">{children}</div>
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
