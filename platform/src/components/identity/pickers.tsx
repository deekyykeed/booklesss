"use client";

import { MynaIcon } from "@/components/icons/myna";
import type { CourseMeta } from "@/lib/courses";
import { OTHER_SCHOOL, SCHOOLS, searchSchools, type SchoolChoice } from "@/lib/schools";
import { SCHOOL_CRESTS } from "./school-crests";

/* The two things this app still asks a student — which university, which
 * courses — as the lists that ask them.
 *
 * There used to be a third, an avatar grid, and there used to be two places
 * asking: a first-visit form and these same lists as rows in Settings. The
 * form is gone (see identity/IdentityAssignment) and the face is assigned, so
 * this is now one set of lists with one caller. It stays a module of its own
 * anyway — a picker is a picker whether one sheet opens it or three.
 *
 * Neither question is asked unprompted any more. A reader who never opens
 * Settings never sees either, and gets the whole library, which is a perfectly
 * good answer.
 *
 * The event that opens Settings lives here too, so the header button and the
 * home page can fire it without importing the sheet itself. */

/** Fired by the header avatar and the home page's Change button. `detail.tab`
 *  picks which tab of Settings opens. */
export const SETTINGS_EVENT = "booklesss:edit-identity";

/** Above this many rows, a list gets a search field. Below it the whole list
 *  is on screen already and a search box is furniture — worse than furniture
 *  on a phone, where it opens the keyboard over the list it filters. */
export const SEARCHABLE = 6;

/**
 * The selected mark on a school or course row. Keeps its space when off, so
 * nothing shifts sideways as rows are tapped.
 *
 * SQUARE (owner, 2026-08-04: "the check can be square as well"), where it was
 * a ring and a filled disc since these rows were built. A square is what a
 * checkbox is everywhere else a student has used one, and these rows are
 * checkboxes — the course list takes as many as you like. Both surfaces that
 * draw these rows, onboarding and Settings, get it from here, so nobody meets
 * the same question wearing two different controls.
 */
export function Tick({ on }: { on: boolean }) {
  return (
    <span className={"shrink-0 transition-colors " + (on ? "text-ink" : "text-line-2")}>
      <MynaIcon name={on ? "check-square-solid" : "square"} size={20} />
    </span>
  );
}

const FIELD =
  "squircle h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-placeholder focus:border-ink";

/** Course rows carry no box either — same call as the school list, same day.
 *  The tick and the weight of the title carry selection. */
const ROW =
  "flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition-colors ";
const rowTone = (on: boolean) => ROW + (on ? "" : "hover:bg-active/60");

/** NO BOX (owner, 2026-08-03: "remove the containers around the options,
 *  that's what I'm saying looks ugly"). A bordered card per option, three deep,
 *  was the heaviest thing on a page whose whole job is to ask one short
 *  question — and the row is already legible without one, because the tick and
 *  the crest mark it. Selection shows in the tick and the weight of the name,
 *  not in a frame drawn round it. */
const SCHOOL_ROW =
  "flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition-colors ";
const schoolTone = (on: boolean) => SCHOOL_ROW + (on ? "" : "hover:bg-active/60");

/**
 * A school's mark: its own crest where we have one, else a monogram disc.
 *
 * The crests are real, inlined at build (see ./school-crests). A student
 * scanning for their university recognises the shield long before they read
 * "ZCAS" — which is the entire reason this row has a mark at all.
 *
 * The monogram survives as the fallback for any school added later whose logo
 * has not been fetched yet, so a new row is never blank.
 */
function SchoolMark({ id, letter, tone }: { id?: string; letter: string; tone: string }) {
  /* 24px, down from 32 (owner, 2026-08-04: "the logo is too big, it must feel
     like its inline"). At 32 the crest was the tallest thing in the row by
     half again — it set the row's height, pushed the 15px name off the optical
     line the 20px tick sits on, and read as a logo the name was captioning
     rather than as one item in a list. 24 sits between the tick and the name,
     so the three land as one line. */
  const crest = id ? SCHOOL_CRESTS[id] : undefined;
  if (crest) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={crest} alt="" aria-hidden="true" className="h-6 w-6 shrink-0 object-contain" />;
  }
  return (
    <span
      aria-hidden="true"
      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
      style={{ backgroundColor: tone }}
    >
      {letter}
    </span>
  );
}

/** The search field above a list. Same shell as the text fields, with the
 *  glyph inset and a clear button once there's something to clear — on a
 *  phone, backspacing a university's name is nobody's idea of a good time.
 *
 *  type="text", not "search": Safari draws its own clear button on a search
 *  input, in its own place, and two of them is worse than either. */
export function Search({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  /** For screen readers — the field has no visible label of its own. */
  label: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-placeholder">
        <MynaIcon name="search" size={17} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        /* Enter belongs to the form's own button, not to submitting a search
           that has already filtered as they typed. */
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className={FIELD + " pl-10 pr-10"}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-active hover:text-ink"
        >
          <MynaIcon name="x" size={16} />
        </button>
      )}
    </div>
  );
}

/* AvatarGrid — twelve faces in a six-column grid, the chosen one ringed — was
 * here until 2026-08-03. Nobody picks a face any more, so there was no caller
 * left: it was deleted rather than left for a future picker to find, because a
 * picker sitting in the tree is an invitation to ask the question again. If
 * choosing ever comes back, so does thirty lines of grid. */

/** The universities, plus the row for everyone else. */
export function SchoolPicker({
  school,
  schoolName,
  query,
  onQuery,
  onPick,
  onName,
  fill,
}: {
  school: SchoolChoice | null;
  /** What they typed when theirs wasn't listed. */
  schoolName: string;
  query: string;
  onQuery: (v: string) => void;
  onPick: (id: SchoolChoice) => void;
  onName: (v: string) => void;
  /** True where the page already gives the list its own scrolling area (the
   *  onboarding question, whose action is pinned to the bottom of the screen).
   *  Left off, the list caps its own height — which is what Settings needs,
   *  where it is one section of a sheet with other things under it. */
  fill?: boolean;
}) {
  const other = school === OTHER_SCHOOL;
  const matches = searchSchools(query);

  return (
    <>
      {SCHOOLS.length > SEARCHABLE && (
        <div className="mb-2">
          <Search value={query} onChange={onQuery} placeholder="Search universities" label="Search universities" />
        </div>
      )}
      <div className={"flex flex-col gap-2 " + (fill ? "" : "max-h-[38dvh] overflow-y-auto")}>
        {matches.map((s) => {
          const on = s.id === school;
          return (
            /* Check, mark, name — in that order, one line (owner's layout,
               2026-08-03). The tick leads because it is what the row is FOR;
               the full name trails in muted and truncates, so the row stays
               one line on a 390px screen and still says which university
               "UNZA" is to somebody who doesn't know. */
            <button key={s.id} type="button" onClick={() => onPick(s.id)} aria-pressed={on} className={schoolTone(on)}>
              <Tick on={on} />
              <SchoolMark id={s.id} letter={s.name.slice(0, 1)} tone={s.tone} />
              <span className="min-w-0 flex-1 truncate">
                <span
                  className={
                    "font-display text-[15px] leading-tight text-ink " + (on ? "font-semibold" : "font-medium")
                  }
                >
                  {s.name}
                </span>
                <span className="ml-2 font-display text-[13px] leading-5 text-muted">{s.full}</span>
              </span>
            </button>
          );
        })}
        {/* The last row, always. Booklesss is on a few campuses; every other
            student who lands here would otherwise be asked to claim one that
            isn't theirs, and their answer is the best evidence there is for
            which campus to build next. */}
        <button type="button" onClick={() => onPick(OTHER_SCHOOL)} aria-pressed={other} className={schoolTone(other)}>
          <Tick on={other} />
          {/* A neutral disc, so the row lines up with the ones above it rather
              than starting where their names do. */}
          <SchoolMark letter="+" tone="var(--color-muted)" />
          <span className="min-w-0 flex-1 truncate">
            <span className="font-display text-[15px] font-medium leading-tight text-ink">Another university</span>
          </span>
        </button>
      </div>

      {/* Revealed by that row rather than sitting there: the keyboard comes up
          when they've asked for it, under a field that is now the last thing
          on screen. */}
      {other && (
        <input
          autoFocus
          value={schoolName}
          onChange={(e) => onName(e.target.value)}
          placeholder="Which university?"
          aria-label="Your university"
          maxLength={80}
          autoComplete="organization"
          className={FIELD + " mt-2"}
        />
      )}
    </>
  );
}

/** The courses on offer for whichever school is picked. */
export function CoursePicker({
  offered,
  courses,
  query,
  onQuery,
  onToggle,
  note,
  fill,
}: {
  offered: CourseMeta[];
  /** Slugs currently chosen. */
  courses: string[];
  query: string;
  onQuery: (v: string) => void;
  onToggle: (slug: string) => void;
  /** One line above the list, when the school needs explaining. */
  note?: string;
  /** See SchoolPicker's — the page is doing the scrolling. */
  fill?: boolean;
}) {
  const q = query.trim().toLowerCase();
  const matches = q
    ? offered.filter((c) => `${c.title} ${c.subtitle}`.toLowerCase().includes(q))
    : offered;
  const searchable = offered.length > SEARCHABLE;

  return (
    <>
      {note && <p className="mb-2 text-[13px] leading-5 text-muted">{note}</p>}
      {searchable && (
        <div className="mb-2">
          <Search value={query} onChange={onQuery} placeholder="Search your courses" label="Search courses" />
        </div>
      )}
      <div className={"flex flex-col gap-2 " + (fill ? "" : "max-h-[42dvh] overflow-y-auto")}>
        {matches.map((c) => {
          const on = courses.includes(c.slug);
          return (
            <button key={c.slug} type="button" onClick={() => onToggle(c.slug)} aria-pressed={on} className={rowTone(on)}>
              <Tick on={on} />
              <span className="min-w-0 flex-1">
                <span
                  className={
                    "block font-display text-[15px] leading-tight text-ink " + (on ? "font-semibold" : "font-medium")
                  }
                >
                  {c.title}
                </span>
                <span className="mt-0.5 block truncate font-display text-[13px] leading-5 text-muted">
                  {c.subtitle}
                </span>
              </span>
            </button>
          );
        })}
        {matches.length === 0 && (
          <p className="px-0.5 py-2 text-[13px] leading-5 text-muted">No course matches “{query.trim()}”.</p>
        )}
      </div>
    </>
  );
}
