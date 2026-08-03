"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { coursesForSchool } from "@/lib/courses";
import { saveOnboarding, type StudyTarget } from "@/lib/identity";
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
 * The cards wear Clerk's geometry — same 24px radius, same width, same black
 * button — so arriving here from Clerk's card reads as the next step of one
 * flow rather than as a different application.
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
  /* Fills as each question is answered, so the last one completes the bar
     rather than leaving it short of the end. */
  const pct = Math.round(((index + 1) / ORDER.length) * 100);

  /** Save everything answered so far, then move. */
  function go(next: Step) {
    save();
    setStep(next);
  }

  function save() {
    saveOnboarding({
      school,
      schoolName: school === OTHER_SCHOOL ? schoolName.trim() || null : null,
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
      {/* ---- the progress bar, at the top (owner's ask) ---- */}
      <div className="pt-6">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={ORDER.length}
          aria-label={`Step ${index + 1} of ${ORDER.length}`}
        >
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${Math.max(pct, 4)}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[12px] font-medium tracking-[0.1em] text-muted">
            STEP {index + 1} OF {ORDER.length}
          </span>
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

      <div className="flex flex-1 flex-col justify-center py-8">
        {step === "school" && (
          <Card
            title="Where do you study?"
            why="It decides which courses you get to choose from. Skip it and you get the whole library."
          >
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
              }}
              onName={setSchoolName}
            />
            <div className="mt-5 flex flex-col gap-2">
              <Button variant="primary" size="lg" block onClick={() => go("courses")}>
                Continue
              </Button>
              <Button
                variant="secondary"
                size="md"
                block
                onClick={() => {
                  setSchool(null);
                  go("courses");
                }}
              >
                Mine isn&apos;t listed
              </Button>
            </div>
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

/** One question, on Clerk's card geometry — so the last step, which really is
 *  Clerk's card, is not a change of scenery. */
function Card({ title, why, children }: { title: string; why: string; children: React.ReactNode }) {
  return (
    <section className="squircle rounded-[24px] border border-line bg-white p-6 shadow-[0_1px_1px_-0.5px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.16)]">
      <h1 className="font-display text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink">
        {title}
      </h1>
      <p className="mt-1.5 text-[14px] leading-5 text-muted">{why}</p>
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
