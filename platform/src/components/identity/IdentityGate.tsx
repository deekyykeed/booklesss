"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { resolveAvatar, type AvatarId } from "./avatars";
import { AvatarGrid, CoursePicker, SchoolPicker } from "./pickers";
import { coursesForSchool } from "@/lib/courses";
import { OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";
import { saveIdentity, useIdentity } from "@/lib/identity";

/* First visit, once: who is reading, where they study, and what they're taking.
 *
 * There is no account to sign into, so this is the only moment the app gets to
 * learn anything about the person reading — but it is also the moment a student
 * is one tap from the lesson they came for. So it asks four things, all
 * answerable by tapping, and none of them an email address.
 *
 * It asks them one screen at a time rather than as one long form. A single
 * modal carrying a name field, twelve faces, every university and every course
 * is a wall on a phone; three short screens with a visible end are not, and
 * each answer narrows the next — the university picked is what decides which
 * courses are offered, so a student never scrolls past a course their school
 * doesn't teach.
 *
 * The courses answer is the one that pays for the whole form: it is what the
 * home page lists, and what its four stat tiles are measured against. Someone
 * taking two courses shouldn't be told they've covered 14% of a library, most
 * of which belongs to another school.
 *
 * Not dismissible by design: a skip link here would be taken every time, and an
 * app full of anonymous readers can't address anybody, nor show them their own
 * courses. It is four taps and a name.
 *
 * This is the FIRST VISIT only. Changing an answer afterwards is a different
 * job — you know which thing you came for — and belongs to SettingsSheet, which
 * opens the same pickers as rows. Both read lib/identity, so neither can
 * disagree with the other about what was answered.
 *
 * Nothing renders until the store has read localStorage, so a returning reader
 * never sees this flash on screen before it disappears. */

/** Surfaces that aren't the app: the sign-in screens Clerk owns when it's on,
 *  the offline fallback, and the two design scratchpads (/workspace, and
 *  /settings, which is the reference settings dialog reproduced). Asking a
 *  student's name over any of them is asking in the wrong place. */
const SKIP = ["/sign-in", "/sign-up", "/offline", "/workspace", "/settings"];

const STEPS = ["who", "school", "courses"] as const;
type Step = (typeof STEPS)[number];

export function IdentityGate() {
  const { identity, hydrated } = useIdentity();
  const pathname = usePathname();
  /* Every field is a draft OVER the stored identity, not a copy of it: null
   * means "not touched", so the value shown is whatever is stored. That is what
   * keeps this free of a seeding effect — the store hydrates a render or two
   * after mount, and copying it into state at that point is a cascade of
   * renders to arrive back where the identity already was. */
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [avatarDraft, setAvatarDraft] = useState<AvatarId | null>(null);
  const [schoolDraft, setSchoolDraft] = useState<SchoolChoice | null>(null);
  const [schoolNameDraft, setSchoolNameDraft] = useState<string | null>(null);
  const [coursesDraft, setCoursesDraft] = useState<string[] | null>(null);
  const [stepDraft, setStepDraft] = useState<Step | null>(null);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");

  const name = nameDraft ?? identity?.name ?? "";
  const avatar = avatarDraft ?? resolveAvatar(identity?.avatar);
  const school = schoolDraft ?? identity?.school ?? null;
  const schoolName = schoolNameDraft ?? identity?.schoolName ?? "";
  const courses = coursesDraft ?? identity?.courses ?? [];
  /* Their university isn't one of ours — the one answer that carries text. */
  const other = school === OTHER_SCHOOL;

  /* An identity is stale, not absent, when it was written before this form
   * asked about school and courses. Those readers keep their name and face and
   * are asked only what's missing, which is where the form opens. */
  const stale = !!identity && (identity.school === null || identity.courses.length === 0);
  const step = stepDraft ?? (stale ? (identity.school ? "courses" : "school") : "who");

  const skipped = SKIP.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const open = hydrated && !skipped && (!identity || stale);

  /* What this university teaches — the course step's whole list. */
  const offered = useMemo(() => coursesForSchool(school), [school]);

  if (!open) return null;

  const pickSchool = (id: SchoolChoice) => {
    setSchoolDraft(id);
    /* Picking a listed school drops whatever they had typed under "another
     * university" — leaving it would save a name for a school we do carry. */
    if (id !== OTHER_SCHOOL) setSchoolNameDraft("");
    /* The search has done its job. */
    setSchoolQuery("");
    setCourseQuery("");
    /* Courses belong to a school. Keeping a ZCAS pick after a switch to UNZA
     * would enrol someone in a course their school doesn't teach. */
    const keep = new Set(coursesForSchool(id).map((c) => c.slug));
    setCoursesDraft(courses.filter((slug) => keep.has(slug)));
  };

  const toggleCourse = (slug: string) =>
    setCoursesDraft(courses.includes(slug) ? courses.filter((s) => s !== slug) : [...courses, slug]);

  /* Each screen has one thing it needs before it will move on. */
  const answered: Record<Step, boolean> = {
    who: name.trim().length > 0,
    // "Another university" isn't an answer on its own — it's the promise of one.
    school: school !== null && (!other || schoolName.trim().length > 0),
    courses: courses.length > 0,
  };
  const ready = answered[step];
  const last = step === "courses";

  const submit = () => {
    if (!ready) return;
    if (!last) {
      setStepDraft(STEPS[STEPS.indexOf(step) + 1]);
      return;
    }
    saveIdentity({ name, avatar, school, schoolName, courses });
  };

  const back = () => setStepDraft(STEPS[Math.max(0, STEPS.indexOf(step) - 1)]);

  const title =
    step === "who" ? "Who’s reading?" : step === "school" ? "Where do you study?" : "What are you taking?";

  const blurb =
    step === "who"
      ? "Pick a face and tell us what to call you. It stays on this device — no email, no password."
      : step === "school"
        ? "This decides which courses you get to choose from next."
        : "Pick every course you’re taking. Your dashboard shows these and nothing else.";

  return (
    <div
      /* Top-anchored on a phone, centred once there is room. Centring a tall
         dialog on a short screen puts its first question under the browser
         chrome and its last under the keyboard.

         Deliberately NOT dismissible by tapping the backdrop, unlike
         SettingsSheet. This is the first-visit form, not a panel: a stray tap
         while reaching for the name field would drop the reader into the app
         unnamed, with no obvious way back to the question. Settings is
         re-openable from the header; this is not. */
      className="fixed inset-0 z-[100] grid items-start justify-items-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-title"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="squircle max-h-[92dvh] w-full max-w-[420px] overflow-y-auto rounded-3xl border border-[#e7e7e6] bg-white p-6 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_24px_48px_-12px_rgba(0,0,0,0.18)]"
      >
        {/* How much is left, without a number: three segments, filled as far as
            they've got. */}
        <div className="mb-4 flex gap-1" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={
                "h-[3px] flex-1 rounded-full transition-colors " +
                (i <= STEPS.indexOf(step) ? "bg-ink" : "bg-[#ececeb]")
              }
            />
          ))}
        </div>

        <h2 id="identity-title" className="font-display text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <p className="mt-1.5 text-[14px] leading-[22px] text-muted">{blurb}</p>

        {step === "who" && (
          <>
            <fieldset className="mt-5">
              <legend className="sr-only">Choose a profile picture</legend>
              <AvatarGrid value={avatar} onChange={setAvatarDraft} />
            </fieldset>

            <label className="mt-5 block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Your name</span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="e.g. Deeky"
                maxLength={40}
                /* One line, one answer — the browser's own autofill is the
                   fastest path for a returning device. */
                autoComplete="given-name"
                className="squircle h-11 w-full rounded-xl border border-[#e7e7e6] bg-white px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-ink"
              />
            </label>
          </>
        )}

        {step === "school" && (
          <fieldset className="mt-5">
            <legend className="sr-only">Your university</legend>
            <SchoolPicker
              school={school}
              schoolName={schoolName}
              query={schoolQuery}
              onQuery={setSchoolQuery}
              onPick={pickSchool}
              onName={setSchoolNameDraft}
            />
          </fieldset>
        )}

        {step === "courses" && (
          <fieldset className="mt-5">
            <legend className="sr-only">Your courses</legend>
            <CoursePicker
              offered={offered}
              courses={courses}
              query={courseQuery}
              onQuery={setCourseQuery}
              onToggle={toggleCourse}
              note={
                other
                  ? `We’re not at ${schoolName.trim() || "your university"} yet — here’s everything we have. Plenty of it is the same material.`
                  : undefined
              }
            />
          </fieldset>
        )}

        <button
          type="submit"
          disabled={!ready}
          className="squircle mt-5 h-11 w-full rounded-xl bg-ink text-[15px] font-medium text-white transition-opacity disabled:opacity-35"
        >
          {last ? "Start reading" : "Continue"}
        </button>

        {/* Only a later screen can go back — the first question has nothing
            behind it, and none of this can be abandoned. */}
        {step !== "who" && (
          <button
            type="button"
            onClick={back}
            className="mt-2 h-9 w-full text-[14px] text-muted transition-colors hover:text-ink"
          >
            Back
          </button>
        )}
      </form>
    </div>
  );
}
