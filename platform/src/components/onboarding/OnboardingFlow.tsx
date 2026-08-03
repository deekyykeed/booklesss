"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { useSignedIn } from "@/lib/account";
import { clerkEnabled } from "@/lib/clerk";
import { coursesForSchool } from "@/lib/courses";
import { accountIdentity, saveOnboarding, type StudyTarget } from "@/lib/identity";
import { referrer } from "@/lib/referral";
import { OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";
import { CoursePicker, SchoolPicker } from "@/components/identity/pickers";
import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------ *
 * Onboarding — the questions first, the account last.
 *
 * The owner's design (2026-08-03): "a page where I pick up all this
 * information and at the end the user signs up … instead of a list of
 * questions the user will fill it like a form, answering one question at a
 * time", with a progress bar at the top.
 *
 * THIS INVERTS THE ORDER, and the inversion is the point. Signing up first
 * and asking afterwards put the work after the commitment, which is how a
 * dashboard headed ALL COURSES got in front of production user #1. Asking
 * first means every account is created already knowing who it belongs to —
 * the answers ride into Clerk as unsafeMetadata on the very card that makes
 * the user, so there is no window where an account exists and knows nothing.
 *
 * IT DOES NOT BREAK "NOBODY IS ASKED ANYTHING". That rule protects the
 * stranger who taps a WhatsApp link to READ — they still land in the reader,
 * still get an assigned name and face, still never meet a form. This page is
 * only ever reached by someone who chose to make an account.
 *
 * EVERY STEP SAVES. `saveOnboarding` is called on each advance rather than
 * once at the end, so closing the tab on question three keeps what was said,
 * and the sign-up card reads the answers straight off the device.
 *
 * The card is Clerk's geometry — same 24px radius, same width, same black
 * button — because the last step IS Clerk's card, and the four screens should
 * read as one flow rather than as our form and then their form.
 * ------------------------------------------------------------------ */

/* The offer for "how many days a week", and "how many minutes when you sit
 * down". Both are ranges a student can answer honestly rather than
 * aspirationally: the point of the number is that the dashboard will hold
 * them to it, so 2 days has to be as sayable as 7. */
const DAY_CHOICES = [2, 3, 4, 5, 6, 7];
const MINUTE_CHOICES = [15, 30, 45, 60, 90, 120];

type Step = "school" | "courses" | "target" | "account";
const ORDER: Step[] = ["school", "courses", "target", "account"];

export function OnboardingFlow() {
  const router = useRouter();
  const signedIn = useSignedIn();

  const [step, setStep] = useState<Step>("school");
  const [school, setSchool] = useState<SchoolChoice | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [target, setTarget] = useState<StudyTarget>({ days: 4, minutes: 30 });
  const [query, setQuery] = useState("");

  /* Someone who already has an account has nothing to onboard — they came
     here from a stale link or the back button. */
  useEffect(() => {
    if (signedIn === true) router.replace("/home");
  }, [signedIn, router]);

  /* Which courses to offer. A school narrows the list; "not listed" and no
     answer both mean the whole library (coursesForSchool reads null that
     way), which is the honest offer when we don't know their syllabus. */
  const offered = useMemo(() => coursesForSchool(school), [school]);

  const index = ORDER.indexOf(step);
  /* The bar counts answers behind you, so it starts empty on the first
     question and fills as you go — landing full on the sign-up card, which
     is the step you are being carried to rather than one more question. */
  const pct = Math.round((index / (ORDER.length - 1)) * 100);

  /** Save everything answered so far, then move. */
  function go(next: Step) {
    saveOnboarding({
      school,
      schoolName: school === OTHER_SCHOOL ? schoolName.trim() || null : null,
      courses,
      target,
    });
    setStep(next);
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
          {index > 0 && step !== "account" && (
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
            <Button variant="primary" size="lg" block className="mt-5" onClick={() => go("account")}>
              Continue
            </Button>
          </Card>
        )}

        {step === "account" && <AccountStep courses={courses} />}
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

/** The last step: Clerk's own card, carrying everything answered.
 *
 *  The metadata is read from the device rather than from this component's
 *  state, because `saveOnboarding` has already written it — one source, and
 *  it survives a reload on this very step. */
function AccountStep({ courses }: { courses: string[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!clerkEnabled) {
    return (
      <Card title="Almost there" why="Accounts aren't switched on in this environment.">
        <p className="text-[14px] leading-5 text-muted">
          Your answers are saved on this device.
        </p>
      </Card>
    );
  }
  if (!ready) return <div className="min-h-[420px]" aria-hidden="true" />;

  const referredBy = referrer();
  const identity = accountIdentity();
  return (
    <div>
      <div className="mb-4 px-1 text-center">
        <h1 className="font-display text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink">
          Last thing — make it yours
        </h1>
        <p className="mt-1.5 text-[14px] leading-5 text-muted">
          {courses.length
            ? `Your ${courses.length} course${courses.length > 1 ? "s" : ""} and your plan are ready. Create an account to keep them.`
            : "Your plan is ready. Create an account to keep it, on any phone you sign in on."}
        </p>
      </div>
      <div className="flex justify-center">
        <SignUp
          routing="hash"
          signInUrl="/sign-in"
          forceRedirectUrl="/home"
          signInForceRedirectUrl="/home"
          /* No header: the line above says where they are, and Clerk's own
             "Create your account" would be the second title on one screen. */
          appearance={{ elements: { header: { display: "none" } } }}
          unsafeMetadata={{
            ...(referredBy ? { referredBy } : {}),
            ...(identity ? { identity } : {}),
          }}
        />
      </div>
    </div>
  );
}
