"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AVATARS, Avatar, resolveAvatar, type AvatarId } from "./avatars";
import { MynaIcon } from "@/components/icons/myna";
import { coursesForSchool } from "@/lib/courses";
import { schoolById, searchSchools, type SchoolId } from "@/lib/schools";
import { saveIdentity, useIdentity } from "@/lib/identity";

/* First visit, once: who is reading, where they study, and what they're taking.
 *
 * There is no account to sign into, so this is the only moment the app gets to
 * learn anything about the person reading — but it is also the moment a student
 * is one tap from the lesson they came for. So it asks four things, all
 * answerable by tapping, and none of them an email address.
 *
 * It asks them one screen at a time rather than as one long form. A single
 * modal carrying a name field, twelve faces, two schools and every course is a
 * wall on a phone; three short screens with a visible end are not, and each
 * answer narrows the next — the school picked is what decides which courses are
 * offered, so a student never scrolls past a course their school doesn't teach.
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
 * Nothing renders until the store has read localStorage, so a returning reader
 * never sees this flash on screen before it disappears.
 *
 * Reopened from the header (EDIT_EVENT) it drops the one-at-a-time pacing and
 * shows all three sections at once — someone fixing a typo in their name should
 * not have to click through two screens they weren't changing. */

/** Surfaces that aren't the app: the sign-in screens Clerk owns when it's on,
 *  the offline fallback, and the /workspace design scratchpad. Asking a
 *  student's name over any of them is asking in the wrong place. */
const SKIP = ["/sign-in", "/sign-up", "/offline", "/workspace"];

/** Fired by the header avatar to reopen the form on an identity that already
 *  exists — the app never asks twice on its own, so this is the way back in.
 *  `detail.step` opens it on a particular section ("courses" from the home
 *  page's own Change button). */
export const EDIT_EVENT = "booklesss:edit-identity";

const STEPS = ["who", "school", "courses"] as const;
type Step = (typeof STEPS)[number];

/** Above this many courses on offer, the course list gets a search field too.
 *  Below it, the whole list is on screen and a search box is furniture. */
const SEARCHABLE = 6;

export function IdentityGate() {
  const { identity, hydrated } = useIdentity();
  const pathname = usePathname();
  /* Every field is a draft OVER the stored identity, not a copy of it: null
   * means "not touched on this open", so the value shown is whatever is
   * stored. That is what keeps the form free of a seeding effect — the store
   * hydrates a render or two after mount, and copying it into state at that
   * point is a cascade of renders to arrive back where the identity already
   * was. Cancelling and saving both just clear the drafts. */
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [avatarDraft, setAvatarDraft] = useState<AvatarId | null>(null);
  const [schoolDraft, setSchoolDraft] = useState<SchoolId | null>(null);
  const [coursesDraft, setCoursesDraft] = useState<string[] | null>(null);
  const [stepDraft, setStepDraft] = useState<Step | null>(null);
  /* Reopened from the header, on an identity that already exists. */
  const [editing, setEditing] = useState(false);
  /* What's been typed into the two search fields. Not drafts — nothing here is
   * stored, and both are cleared the moment their answer is given. */
  const [schoolQuery, setSchoolQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");

  const name = nameDraft ?? identity?.name ?? "";
  const avatar = avatarDraft ?? resolveAvatar(identity?.avatar);
  const school = schoolDraft ?? identity?.school ?? null;
  const courses = coursesDraft ?? identity?.courses ?? [];

  /* An identity is stale, not absent, when it was written before this form
   * asked about school and courses. Those readers keep their name and face and
   * are asked only what's missing, which is where the form opens. */
  const stale = !!identity && (identity.school === null || identity.courses.length === 0);
  const step = stepDraft ?? (stale ? (identity.school ? "courses" : "school") : "who");

  const clear = () => {
    setNameDraft(null);
    setAvatarDraft(null);
    setSchoolDraft(null);
    setCoursesDraft(null);
    setStepDraft(null);
    setSchoolQuery("");
    setCourseQuery("");
  };

  useEffect(() => {
    const onEdit = (e: Event) => {
      const at = (e as CustomEvent<{ step?: Step }>).detail?.step;
      clear();
      setStepDraft(at && STEPS.includes(at) ? at : "who");
      setEditing(true);
    };
    window.addEventListener(EDIT_EVENT, onEdit);
    return () => window.removeEventListener(EDIT_EVENT, onEdit);
  }, []);

  const skipped = SKIP.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const open = hydrated && !skipped && (editing || !identity || stale);

  /* A modal over the page shouldn't leave the page scrolling behind it. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Opened from the home page's Change button, which asks for the course
   * section: editing draws all three at once, so the one they came for has to
   * be scrolled to rather than switched to. */
  useEffect(() => {
    if (!open || !editing || !stepDraft) return;
    document.getElementById(`identity-${stepDraft}`)?.scrollIntoView({ block: "start" });
  }, [open, editing, stepDraft]);

  /* What this school teaches — the course step's whole list — and what's left
   * of it once they've typed. Both searches are plain substring matches over
   * short lists, so they run on every keystroke without a debounce. */
  const offered = useMemo(() => coursesForSchool(school), [school]);
  const schoolMatches = useMemo(() => searchSchools(schoolQuery), [schoolQuery]);
  const courseMatches = useMemo(() => {
    const q = courseQuery.trim().toLowerCase();
    if (!q) return offered;
    return offered.filter((c) => `${c.title} ${c.subtitle}`.toLowerCase().includes(q));
  }, [offered, courseQuery]);

  if (!open) return null;

  /* Editing shows everything at once; a first visit takes one question at a
   * time. `at()` is the test both render paths share. */
  const at = (s: Step) => editing || step === s;

  const pickSchool = (id: SchoolId) => {
    setSchoolDraft(id);
    /* The search has done its job — leaving the query in place would hide the
     * schools either side of the one they picked, so a change of mind means
     * clearing a box first. */
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
    school: school !== null,
    courses: courses.length > 0,
  };
  const ready = editing ? STEPS.every((s) => answered[s]) : answered[step];
  const last = editing || step === "courses";

  const submit = () => {
    if (!ready) return;
    if (!last) {
      setStepDraft(STEPS[STEPS.indexOf(step) + 1]);
      return;
    }
    saveIdentity({ name, avatar, school, courses });
    setEditing(false);
    clear();
  };

  const back = () => setStepDraft(STEPS[Math.max(0, STEPS.indexOf(step) - 1)]);

  const cancel = () => {
    setEditing(false);
    clear();
  };

  const title = editing
    ? "Your details"
    : step === "who"
      ? "Who’s reading?"
      : step === "school"
        ? "Where do you study?"
        : "What are you taking?";

  const blurb = editing
    ? "Change anything here. It stays on this device."
    : step === "who"
      ? "Pick a face and tell us what to call you. It stays on this device — no email, no password."
      : step === "school"
        ? "This decides which courses you get to choose from next."
        : "Pick every course you’re taking. Your dashboard shows these and nothing else.";

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px]"
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
            they've got. Absent while editing, which has no order to it. */}
        {!editing && (
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
        )}

        <h2 id="identity-title" className="font-display text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <p className="mt-1.5 text-[14px] leading-[22px] text-muted">{blurb}</p>

        {at("who") && (
          <>
            <fieldset id="identity-who" className="mt-5">
              <legend className="sr-only">Choose a profile picture</legend>
              {/* The art is a finished disc, so the tile is round and the
                  selected one is ringed rather than boxed. */}
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((a) => {
                  const on = a.id === avatar;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAvatarDraft(a.id)}
                      aria-label={a.label}
                      aria-pressed={on}
                      title={a.label}
                      className={
                        "grid aspect-square place-items-center rounded-full transition-all " +
                        (on
                          ? "ring-2 ring-ink ring-offset-2 ring-offset-white"
                          : "opacity-70 hover:opacity-100")
                      }
                    >
                      <Avatar id={a.id} size={34} />
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-5 block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Your name</span>
              <input
                autoFocus={!editing}
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

        {at("school") && (
          <fieldset id="identity-school" className={editing ? "mt-6" : "mt-5"}>
            <legend className={editing ? "mb-1.5 text-[13px] font-medium text-ink-2" : "sr-only"}>
              Your school
            </legend>
            {/* Type it rather than scroll for it. Two schools don't need this;
                the twentieth will, and a student who knows their own
                university's name should never be reading past someone else's
                to find it. */}
            <Search
              value={schoolQuery}
              onChange={setSchoolQuery}
              placeholder="Search universities"
              label="Search universities"
              autoFocus={!editing}
            />
            <div className="mt-2 flex max-h-[38dvh] flex-col gap-2 overflow-y-auto">
              {schoolMatches.map((s) => {
                const on = s.id === school;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickSchool(s.id)}
                    aria-pressed={on}
                    className={
                      "squircle flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors " +
                      (on ? "border-ink bg-active" : "border-[#e7e7e6] bg-white hover:bg-[#fafafa]")
                    }
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium leading-tight text-ink">{s.name}</span>
                      <span className="mt-0.5 block truncate text-[13px] leading-5 text-muted">{s.full}</span>
                    </span>
                    <Tick on={on} />
                  </button>
                );
              })}
              {/* Says why, not just that nothing matched: the library is only
                  on a few campuses, and that's the honest reason. */}
              {schoolMatches.length === 0 && (
                <p className="px-0.5 py-2 text-[13px] leading-5 text-muted">
                  Nothing matches “{schoolQuery.trim()}”. Booklesss is only on a few campuses so far —
                  clear the search to see them.
                </p>
              )}
            </div>
          </fieldset>
        )}

        {at("courses") && (
          <fieldset id="identity-courses" className={editing ? "mt-6" : "mt-5"}>
            <legend className={editing ? "mb-1.5 text-[13px] font-medium text-ink-2" : "sr-only"}>
              Your courses
            </legend>
            {school === null ? (
              /* Only reachable while editing, where every section is on screen
                 at once and the school above may have just been cleared. */
              <p className="text-[13px] leading-5 text-muted">Pick a school first.</p>
            ) : (
              <>
                {/* Scoped to the school already picked, and only once the list
                    is long enough to be worth searching — a search box over
                    three courses is furniture. */}
                {offered.length > SEARCHABLE && (
                  <Search
                    value={courseQuery}
                    onChange={setCourseQuery}
                    placeholder="Search your courses"
                    label="Search courses"
                  />
                )}
                <div
                  className={
                    "flex max-h-[42dvh] flex-col gap-2 overflow-y-auto " +
                    (offered.length > SEARCHABLE ? "mt-2" : "")
                  }
                >
                  {courseMatches.map((c) => {
                    const on = courses.includes(c.slug);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => toggleCourse(c.slug)}
                        aria-pressed={on}
                        className={
                          "squircle flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors " +
                          (on ? "border-ink bg-active" : "border-[#e7e7e6] bg-white hover:bg-[#fafafa]")
                        }
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-medium leading-tight text-ink">{c.title}</span>
                          <span className="mt-0.5 block text-[13px] leading-5 text-muted">{c.subtitle}</span>
                        </span>
                        <Tick on={on} />
                      </button>
                    );
                  })}
                  {/* A course they can't find is a course their school doesn't
                      teach — say which school, since that is the fix. */}
                  {courseMatches.length === 0 && (
                    <p className="px-0.5 py-2 text-[13px] leading-5 text-muted">
                      No {schoolById(school)?.name ?? "course"} course matches “{courseQuery.trim()}”.
                    </p>
                  )}
                </div>
              </>
            )}
          </fieldset>
        )}

        <button
          type="submit"
          disabled={!ready}
          className="squircle mt-5 h-11 w-full rounded-xl bg-ink text-[15px] font-medium text-white transition-opacity disabled:opacity-35"
        >
          {editing ? "Save" : last ? "Start reading" : "Continue"}
        </button>

        {/* Only an edit can be abandoned, and only a later screen can go back —
            the first question has nothing behind it. */}
        {editing ? (
          <button
            type="button"
            onClick={cancel}
            className="mt-2 h-9 w-full text-[14px] text-muted transition-colors hover:text-ink"
          >
            Cancel
          </button>
        ) : (
          step !== "who" && (
            <button
              type="button"
              onClick={back}
              className="mt-2 h-9 w-full text-[14px] text-muted transition-colors hover:text-ink"
            >
              Back
            </button>
          )
        )}
      </form>
    </div>
  );
}

/** The search field above a list of schools or courses. Same shell as the name
 *  field, with the glyph inset and a clear button once there's something to
 *  clear — on a phone, backspacing a university's name is nobody's idea of a
 *  good time.
 *
 *  type="text", not "search": Safari draws its own clear button on a search
 *  input, in its own place, and two of them is worse than either. */
function Search({
  value,
  onChange,
  placeholder,
  label,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  /** For screen readers — the field has no visible label of its own. */
  label: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a3a3a3]">
        <MynaIcon name="search" size={17} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        /* Enter belongs to the form's own button, not to submitting a search
           that has already filtered as they typed. */
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="squircle h-11 w-full rounded-xl border border-[#e7e7e6] bg-white pl-10 pr-10 text-[15px] text-ink outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-ink"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-[#f4f4f3] hover:text-ink"
        >
          <MynaIcon name="x" size={16} />
        </button>
      )}
    </div>
  );
}

/** The selected mark on a school or course row. Keeps its space when off, so
 *  nothing shifts sideways as rows are tapped. */
function Tick({ on }: { on: boolean }) {
  return (
    <span className={"shrink-0 " + (on ? "text-ink" : "text-[#d4d4d4]")}>
      <MynaIcon name={on ? "check-circle-solid" : "circle"} size={20} />
    </span>
  );
}
