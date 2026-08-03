"use client";

import { MynaIcon } from "@/components/icons/myna";
import type { CourseMeta } from "@/lib/courses";
import { OTHER_SCHOOL, SCHOOLS, searchSchools, type SchoolChoice } from "@/lib/schools";

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

/** The selected mark on a school or course row. Keeps its space when off, so
 *  nothing shifts sideways as rows are tapped. */
export function Tick({ on }: { on: boolean }) {
  return (
    <span className={"shrink-0 " + (on ? "text-ink" : "text-[#d4d4d4]")}>
      <MynaIcon name={on ? "check-circle-solid" : "circle"} size={20} />
    </span>
  );
}

const FIELD =
  "squircle h-11 w-full rounded-xl border border-[#e7e7e6] bg-white px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-ink";

const ROW =
  "squircle flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ";
const rowTone = (on: boolean) =>
  ROW + (on ? "border-ink bg-active" : "border-[#e7e7e6] bg-white hover:bg-[#fafafa]");

/** The tighter row the school list uses: one line, less height, so three
 *  universities read as a list rather than as three cards (owner, 2026-08-03:
 *  "simple list not taking up too much space"). */
const SCHOOL_ROW =
  "squircle flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ";
const schoolTone = (on: boolean) =>
  SCHOOL_ROW + (on ? "border-ink bg-active" : "border-[#e7e7e6] bg-white hover:bg-[#fafafa]");

/**
 * A school's mark: its first letter on a disc in its own tint.
 *
 * Deliberately not a crest — see the `tone` field in lib/schools for why a
 * real university logo is the one image this app must not draw. One letter
 * reads at 28px where two do not, and the tint is what actually tells the
 * rows apart at a glance.
 */
function SchoolMark({ letter, tone }: { letter: string; tone: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold text-white"
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
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a3a3a3]">
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
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-[#f4f4f3] hover:text-ink"
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
}: {
  school: SchoolChoice | null;
  /** What they typed when theirs wasn't listed. */
  schoolName: string;
  query: string;
  onQuery: (v: string) => void;
  onPick: (id: SchoolChoice) => void;
  onName: (v: string) => void;
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
      <div className="flex max-h-[38dvh] flex-col gap-2 overflow-y-auto">
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
              <SchoolMark letter={s.name.slice(0, 1)} tone={s.tone} />
              <span className="min-w-0 flex-1 truncate">
                <span className="text-[15px] font-medium leading-tight text-ink">{s.name}</span>
                <span className="ml-2 text-[13px] leading-5 text-muted">{s.full}</span>
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
          <SchoolMark letter="+" tone="#8a8a86" />
          <span className="min-w-0 flex-1 truncate">
            <span className="text-[15px] font-medium leading-tight text-ink">Another university</span>
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
}: {
  offered: CourseMeta[];
  /** Slugs currently chosen. */
  courses: string[];
  query: string;
  onQuery: (v: string) => void;
  onToggle: (slug: string) => void;
  /** One line above the list, when the school needs explaining. */
  note?: string;
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
      <div className="flex max-h-[42dvh] flex-col gap-2 overflow-y-auto">
        {matches.map((c) => {
          const on = courses.includes(c.slug);
          return (
            <button key={c.slug} type="button" onClick={() => onToggle(c.slug)} aria-pressed={on} className={rowTone(on)}>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium leading-tight text-ink">{c.title}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-muted">{c.subtitle}</span>
              </span>
              <Tick on={on} />
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
