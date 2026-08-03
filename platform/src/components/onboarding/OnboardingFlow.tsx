"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { coursesForSchool } from "@/lib/courses";
import { saveOnboarding, type StudyTarget } from "@/lib/identity";
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

export function OnboardingFlow() {
  const router = useRouter();
  const signedIn = useSignedIn();

  const [step, setStep] = useState<Step>("school");
  const [school, setSchool] = useState<SchoolChoice | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [target, setTarget] = useState<StudyTarget>({ days: 4, minutes: 30 });
  const [query, setQuery] = useState("");

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

  /** Save everything answered so far, then move. */
  function go(next: Step) {
    save();
    setStep(next);
  }

  /* `patch` exists for tap-to-advance: picking a university saves and moves in
     the same handler, and React has not re-rendered with the new state by
     then — reading `school` here would store the PREVIOUS answer. Passing the
     picked value straight through is the difference between the flow working
     and it silently recording one question behind. */
  function save(patch?: { school?: SchoolChoice | null }) {
    const s = patch && "school" in patch ? (patch.school ?? null) : school;
    saveOnboarding({
      school: s,
      schoolName: s === OTHER_SCHOOL ? schoolName.trim() || null : null,
      courses,
      target,
    });
  }

  /** The last answer, and into the app. */
  function finish() {
    save();
    router.replace("/home");
  }

  function back() {
    setStep(ORDER[Math.max(0, index - 1)]);
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
            why="So we can put the right courses in front of you. Not on the list? Tell us — that's how we pick the next campus to build for."
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
                setSchool(id);
                // A different school offers different courses; anything picked
                // under the old one may not be on offer any more.
                setCourses([]);
                if (id !== OTHER_SCHOOL) {
                  save({ school: id });
                  setStep("courses");
                }
              }}
              onName={setSchoolName}
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
                onClick={() => go("courses")}
              >
                {schoolName.trim() ? "Continue" : "Type your university"}
              </Button>
            )}
          </Card>
        )}

        {step === "courses" && (
          <Card
            title="Which courses are you taking?"
            why="Your dashboard, your streak and your coverage all count these. You can change them any time."
          >
            <CoursePicker
              offered={offered}
              courses={courses}
              query={query}
              onQuery={setQuery}
              onToggle={(slug) =>
                setCourses((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]))
              }
            />
            <div className="mt-5 flex flex-col gap-2">
              <Button
                variant="primary"
                size="lg"
                block
                disabled={courses.length === 0}
                onClick={() => go("target")}
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
                  setCourses([]);
                  go("target");
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
            why="This is the only number your dashboard scores you against — so answer it honestly, not hopefully."
          >
            <Choices
              label="Days a week"
              value={target.days}
              options={DAY_CHOICES}
              format={(n) => String(n)}
              onPick={(days) => setTarget((t) => ({ ...t, days }))}
            />
            <div className="mt-4">
              <Choices
                label="Minutes each time"
                value={target.minutes}
                options={MINUTE_CHOICES}
                /* Math.floor, not a bare divide: 90/60 is 1.5, and the first
                   render of this said "1.5h 30m". */
                format={(n) => (n >= 60 ? `${Math.floor(n / 60)}h${n % 60 ? ` ${n % 60}m` : ""}` : `${n}m`)}
                onPick={(minutes) => setTarget((t) => ({ ...t, minutes }))}
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
 * Progress as a line of nodes, one per question, each ticked once answered
 * (owner, 2026-08-03: "use a horizontal line with check marks for form
 * progress — pick a better colour for it too").
 *
 * GREEN, AND NOT AS A PREFERENCE. Green is what completion means everywhere
 * else in this app — the coverage tile, the checkpoint ticks, the course-card
 * rings — so a ticked step in any other colour would be the one green thing
 * that isn't progress. `--color-brand-deep` rather than the brighter
 * `--color-brand`, because this sits on a near-white frosted surface where
 * the light green fails contrast.
 *
 * The connector fills only up to the step you have finished, so the line is
 * itself a bar: it says how far along you are before you have read a word of
 * it. The current node is ringed rather than filled, because a filled circle
 * on the step you are still answering claims it is done.
 */
function Stepper({ index }: { index: number }) {
  return (
    <ol className="flex items-center" aria-label={`Step ${index + 1} of ${ORDER.length}`}>
      {ORDER.map((s, i) => {
        const done = i < index;
        const now = i === index;
        return (
          <li key={s} className={"flex items-center " + (i === 0 ? "" : "flex-1")}>
            {/* The connector, before every node but the first. Filled when the
                step behind it is answered. */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className="mx-1.5 h-[2px] flex-1 rounded-full transition-colors duration-500"
                style={{ backgroundColor: done || now ? "var(--color-brand-deep)" : "var(--color-line)" }}
              />
            )}
            <span
              aria-current={now ? "step" : undefined}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors duration-300"
              style={{
                backgroundColor: done ? "var(--color-brand-deep)" : "transparent",
                boxShadow: done
                  ? "none"
                  : `inset 0 0 0 2px ${now ? "var(--color-brand-deep)" : "var(--color-line)"}`,
              }}
            >
              {done ? (
                <MynaIcon name="check" size={14} className="text-white" strokeWidth={3} />
              ) : (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: now ? "var(--color-brand-deep)" : "transparent" }}
                />
              )}
            </span>
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
      <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-6 text-muted">{why}</p>
      <div className="mt-6">{children}</div>
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
