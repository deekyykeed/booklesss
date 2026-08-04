"use client";

import { useId } from "react";
import { MynaIcon } from "@/components/icons/myna";
import type { CourseMeta } from "@/lib/courses";
import type { ProgrammeCourse, YearGroup } from "@/lib/programmes";
import { OTHER_SCHOOL, SCHOOLS, type SchoolChoice } from "@/lib/schools";
import { crestSrc } from "./school-crests";

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
    <span className="grid h-5 w-5 shrink-0 place-items-center">
      {on ? <GradientCheck /> : <span className="text-line-2"><MynaIcon name="square" size={20} /></span>}
    </span>
  );
}

/**
 * The ticked state: Streamline's Flex Gradient "Check Square", in the colours it
 * ships with (owner sent it, 2026-08-04, asking for it at its defaults).
 *
 * ITS OWN COLOURS, NOT currentColor — the same exception the Plump course marks
 * and the Kameleon avatars get, and for the same reason: the colour is the
 * point. `#1b4dff` to `#ff51e3`, top-left to bottom-right, exactly as the set
 * draws it. Streamline Flex Gradient - Free, CC BY 4.0, attribution owed with
 * the rest.
 *
 * 16px INSIDE A 20px BOX, which is the whole trick. Flex is drawn on a 14 grid
 * and this mark fills 96% of it; MynaUI's `square` is on a 24 grid and fills
 * 75%. Rendered at the same 20px the gradient check carries 29% more ink than
 * the empty square it replaces, so a row visibly jumped as you ticked it. 16px
 * of a 96% mark is 15.4px of ink against the square's 15.0px — the same optical
 * size — and the fixed 20px box means neither state moves the row.
 *
 * THE GRADIENT ID IS PER-INSTANCE. A hardcoded id (the set ships
 * `paint0_linear_9371_5078`) is fine for one mark on a page and wrong here: the
 * course question takes as many answers as you like, so several of these render
 * at once, and duplicate ids in one document all resolve to the first.
 */
function GradientCheck() {
  /* STRIPPED TO WORD CHARACTERS. useId's output is not a safe fragment name —
     React 19 returns «r0» and React 18 returned :r0:, and both go into
     `fill="url(#…)"`, where a guillemet or a colon is asking every browser to
     agree about escaping in a URL fragment. They mostly do; "mostly" is not
     worth a checkbox that renders as a black square on one phone. The suffix
     keeps it unique per instance, which is the only thing it was for. */
  const id = "tick" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg width={16} height={16} viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path
        fill={`url(#${id})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.65727.474686C4.73112.35499 5.85168.25 7 .25s2.26888.10499 3.3427.224686c1.672.186363 3.0154 1.528614 3.1946 3.203594.1143 1.0683.2127 2.18136.2127 3.32172 0 1.14035-.0984 2.25341-.2127 3.3217-.1792 1.675-1.5226 3.0173-3.1946 3.2036C9.26888 13.645 8.14832 13.75 7 13.75c-1.14832 0-2.26888-.105-3.34273-.2247C1.98532 13.339.641908 11.9967.462704 10.3217.348408 9.25341.25 8.14035.25 7c0-1.14036.098408-2.25342.212704-3.32172C.641907 2.0033 1.98532.661049 3.65727.474686ZM9.91992 4.96291c.25568-.23192.27488-.62718.04299-.88283-.23191-.25566-.62717-.27491-.88283-.04299-.83075.7536-1.45479 1.43087-1.98155 2.25306-.38363.59878-.70658 1.26029-1.0228 2.06202L4.94869 7.18991c-.2403-.2478-.63598-.25389-.88378-.0136-.2478.2403-.25389.63598-.0136.88378l1.81818 1.875c.15096.15571.37183.22201.58357.17521.21173-.0468.38409-.20003.45538-.40482.42024-1.20717.79331-2.03973 1.2426-2.741.44682-.69741.98591-1.2913 1.76888-2.00157Z"
      />
      <defs>
        <linearGradient id={id} x1="13.704" x2="-2.283" y1="13.753" y2="4.76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff51e3" />
          <stop offset="1" stopColor="#1b4dff" />
        </linearGradient>
      </defs>
    </svg>
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
  /* 14px. Fourth size and the owner's call each time: 32 to 24 ("the logo is
     too big, it must feel like its inline"), to 20, to this ("logos ar still
     too big").

     I argued at 20 that nothing below ~18 stays recognisable at arm's length.
     That was reasoning about a crest a student has to IDENTIFY — and once the
     row spells out "Copperbelt University" in full, the mark is not doing that
     job any more. The name identifies the university; the mark just gives the
     line something to end on. At 14 it sits inside the cap height of the text
     beside it, which is the literal reading of "within the text" and the thing
     none of the bigger sizes managed.

     The detail is lost at this size — several of these are heraldic shields
     with lettering in them, and they read as coloured silhouettes. That is a
     real cost and it is the right trade here, because nothing depends on
     reading them. */
  const crest = crestSrc(id);
  if (crest) {
    /* A FILE, not a data URI — see school-crests. width/height are set as
       attributes as well as classes so the row reserves the box before the
       image arrives; nine of these load at once on the school question, and a
       list that reflows as they land is a list somebody mis-taps. */
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={crest}
        alt=""
        aria-hidden="true"
        width={14}
        height={14}
        loading="lazy"
        decoding="async"
        className="h-3.5 w-3.5 shrink-0 object-contain"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full text-[8px] font-semibold text-white"
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
  onPick,
  onName,
  fill,
}: {
  school: SchoolChoice | null;
  /** What they typed when theirs wasn't listed. */
  schoolName: string;
  onPick: (id: SchoolChoice) => void;
  onName: (v: string) => void;
  /** True where the page already gives the list its own scrolling area (the
   *  onboarding question, whose action is pinned to the bottom of the screen).
   *  Left off, the list caps its own height — which is what Settings needs,
   *  where it is one section of a sheet with other things under it. */
  fill?: boolean;
}) {
  const other = school === OTHER_SCHOOL;

  /* NO SEARCH FIELD (owner, 2026-08-04: "remove the search bar"). It appeared
     on its own when the list passed six rows, which ten universities did — but
     the rule it fired on counts rows, not effort, and eleven short names on a
     scrolling screen are quicker to read than a field is to type into. On a
     phone it was actively worse: tapping it raises the keyboard over the list
     it filters, so the student loses sight of the answers to narrow them.
     The list is the whole answer; scrolling it is the search. */
  return (
    <>
      <div className={"flex flex-col gap-2 " + (fill ? "" : "max-h-[38dvh] overflow-y-auto")}>
        {SCHOOLS.map((s) => {
          const on = s.id === school;
          return (
            /* Check, ONE name, then the crest sitting against the word
               (owner, 2026-08-04).

               ONE NAME, NOT TWO. The row used to carry the short name and the
               full one beside it — "ZCAS" then "Zambia Centre for Accountancy
               Studies" in 13px muted. That pairing only works for a university
               with a real abbreviation, and most have none: it rendered
               "Mulungushi · Mulungushi University", the same word twice, with
               the second half too small to read. So the row says what students
               call the place, once, at the size the short name already had.
               `full` is still on the record and still searched — it just is not
               something the row has to show to be understood.

               THE CREST MOVED TO THE END, and this is what "inline" meant. In
               front of the name it was a bullet the row was indented behind,
               and every row's text started at the same place whether its mark
               was a shield or a letter. After the word it reads as part of the
               line — hence tick-sized, so nothing in the row is taller than
               anything else. It sits against the name rather than out at the
               right margin: flex-1 is on the wrapper, not between them, or the
               mark would drift a different distance from every university's
               name and stop looking attached to any of them. */
            <button key={s.id} type="button" onClick={() => onPick(s.id)} aria-pressed={on} className={schoolTone(on)}>
              <Tick on={on} />
              <span className="flex min-w-0 flex-1 items-center gap-1.5">
                {/* THE FULL NAME (owner, 2026-08-04: "i want full names of the
                    universities not abbreviations"). The row showed `name` —
                    ZCAS, UNZA, CBU — which is what a student at one of them
                    says, but it asks everybody else to know an abbreviation to
                    find their own university in a list. "Copperbelt University"
                    needs nothing decoded.

                    NOT TRUNCATED. "Zambia Centre for Accountancy Studies" does
                    not fit one line on a 390px screen, and a full name cut off
                    mid-word is the abbreviation problem again with worse
                    manners. It wraps instead: only the longest one or two do,
                    and a row that is two lines tall costs less than a name
                    nobody can finish reading. */}
                <span
                  className={
                    "min-w-0 font-display text-[15px] leading-snug transition-colors " +
                    (on ? "font-semibold text-ink" : "font-medium text-ink-2")
                  }
                >
                  {s.full}
                </span>
                <SchoolMark id={s.id} letter={s.full.slice(0, 1)} tone={s.tone} />
              </span>
            </button>
          );
        })}
        {/* The last row, always. Booklesss is on a few campuses; every other
            student who lands here would otherwise be asked to claim one that
            isn't theirs, and their answer is the best evidence there is for
            which campus to build next. */}
        <button
          type="button"
          onClick={() => onPick(OTHER_SCHOOL)}
          aria-pressed={other}
          aria-label="Other university"
          className={schoolTone(other)}
        >
          <Tick on={other} />
          {/* "OTHER", one word (owner, 2026-08-04). It read "Another
              university", which is the longest label in a list whose whole
              point is now that the names are short — and it sat under ten rows
              that all end in "University", saying the word an eleventh time.

              A PLAIN ICON, not the tinted disc with a "+" in it (owner, same
              call: "the plus icon should just be an icon"). The disc was
              standing in for a crest, which made it look like the mark of a
              university nobody had named; and at 14px a letterform on a circle
              is a smudge. This is the one row whose mark is a control rather
              than a logo, so it should look like one. `aria-label` carries the
              full meaning that the visible word no longer spells out. */}
          <span className="flex min-w-0 flex-1 items-center gap-1.5">
            <span
              className={
                "min-w-0 font-display text-[15px] leading-snug transition-colors " +
                (other ? "font-semibold text-ink" : "font-medium text-ink-2")
              }
            >
              Other
            </span>
            <span className="shrink-0 text-muted">
              <MynaIcon name="plus" size={14} />
            </span>
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

/**
 * A plain list of options wearing the university row (owner, 2026-08-04: "this
 * same ticking mechanism that I'm setting up for picking the university should
 * go throughout the whole thing — so don't make up your designs and everything,
 * this is how it should look almost all the way").
 *
 * So the programme question and the year question are not new designs; they are
 * this row with different words in it. Anything added to the flow later should
 * reach for this before inventing a control.
 */
export function OptionRows<T extends string | number>({
  options,
  value,
  values,
  onPick,
  label,
  columns = 1,
}: {
  options: { id: T; title: string; note?: string }[];
  /** Single-select: the one that is on. */
  value?: T | null;
  /** Multi-select: all that are on. Takes precedence over `value` when given —
   *  the days-of-the-week question is the first thing here that takes more than
   *  one answer, and it wears the same row as everything else rather than
   *  growing a second control for the sake of it. */
  values?: T[];
  onPick: (id: T) => void;
  label: (id: T) => string;
  /**
   * Lay the rows out in two columns instead of one (owner, 2026-08-04: "for the
   * days of the week, and for the times, we can have them in two columns, like
   * a table with two columns").
   *
   * For the short answers only. Seven days and six lengths are one or two words
   * each, and stacked they made the last question of the flow a long scroll of
   * mostly empty rows; paired, the whole question is on screen at once. The
   * university, programme and course lists stay single-column — their rows
   * carry a full name and a crest, or a title and a semester, and half a phone
   * is not enough width for either.
   */
  columns?: 1 | 2;
}) {
  return (
    <div className={columns === 2 ? "grid grid-cols-2 gap-x-3 gap-y-2" : "flex flex-col gap-2"}>
      {options.map((o) => {
        const on = values ? values.includes(o.id) : o.id === value;
        return (
          <button
            key={String(o.id)}
            type="button"
            onClick={() => onPick(o.id)}
            aria-pressed={on}
            aria-label={label(o.id)}
            className={schoolTone(on)}
          >
            <Tick on={on} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span
                className={
                  "font-display text-[15px] leading-snug transition-colors " +
                  (on ? "font-semibold text-ink" : "font-medium text-ink-2")
                }
              >
                {o.title}
              </span>
              {o.note && <span className="mt-0.5 font-display text-[13px] leading-5 text-muted">{o.note}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * A student's own timetable: the year they are in first, the rest of the
 * programme under it.
 *
 * Owner's layout, 2026-08-04: "I'll first of all display the year four courses,
 * all the year four courses, and then below that I will display the other
 * years' courses… they also have the ability to add courses that are not in the
 * year they're in, in case they're studying them as well."
 *
 * EVERY COURSE SHOWS, BUILT OR NOT — owner's call: "we should show them
 * literally all the courses not just what we've built, that way we can
 * prioritise building properly." A row with nothing behind it yet is still
 * tickable and still marked, because the tick IS the demand signal that decides
 * what gets written next. What it must not do is quietly become a course on
 * somebody's dashboard with no content in it; that is handled upstream, where
 * the picks are split into built slugs and the rest (see lib/programmes).
 */
export function CurriculumPicker({
  thisYear,
  otherYears,
  year,
  semester,
  picked,
  onToggle,
}: {
  thisYear: ProgrammeCourse[];
  /** The rest of the programme, GROUPED BY YEAR (owner, 2026-08-04). See
   *  coursesByYear — a flat list of everything-not-this-year runs to 24 rows
   *  with nothing to say which is a first-year course and which a third. */
  otherYears: YearGroup[];
  year: number | null;
  /** Which half of the year they said they are in, so the heading can say so.
   *  Null on a programme whose source never recorded semesters. */
  semester?: number | null;
  /** Curriculum slugs currently ticked. */
  picked: string[];
  onToggle: (slug: string) => void;
}) {
  const row = (c: ProgrammeCourse) => {
    const on = picked.includes(c.slug);
    return (
      <button
        key={c.slug}
        type="button"
        onClick={() => onToggle(c.slug)}
        aria-pressed={on}
        className={schoolTone(on)}
      >
        <Tick on={on} />
        {/* NO "READY" MARK (owner, 2026-08-04: "don't show courses that are
            ready and courses that are not — just remove the ready symbol").
            Three of a year's seven wore a chip, which sorted a student's own
            timetable into ours-and-not-ours at the moment they were being shown
            it as theirs. Which courses have been written is our problem, not a
            property of their degree, and it is answered by opening one.

            The semester takes its place: lighter and smaller under the title,
            because "is this on now or after Christmas" is a fact about the
            course a student is actually choosing. */}
        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={
              "font-display text-[15px] leading-snug transition-colors " +
              (on ? "font-semibold text-ink" : "font-medium text-ink-2")
            }
          >
            {c.title}
          </span>
          {c.semester && (
            <span className="mt-0.5 font-display text-[12px] leading-4 text-muted">Semester {c.semester}</span>
          )}
        </span>
      </button>
    );
  };

  /* One heading per year, the student's own first and marked as theirs. Every
     other group says only which year it is: "Other years on this programme"
     used to sit above the lot as a single heading, which is a label for a
     leftover pile rather than a way through it. */
  const group = (key: string, heading: string, courses: ProgrammeCourse[]) => (
    <div key={key} className="flex flex-col gap-2">
      <p className="font-display text-[12px] font-semibold uppercase tracking-wide text-muted">{heading}</p>
      {courses.map(row)}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* The heading names the half they are in, because that is what the
          ticks now mean — heading four ticked rows "Year 4" would read as the
          whole year with half of it missing. */}
      {group(
        "current",
        year
          ? semester
            ? `Year ${year} · Semester ${semester} — yours`
            : `Year ${year} — yours`
          : "Your courses",
        thisYear,
      )}

      {otherYears.length > 0 && (
        <>
          {/* ONE DIVIDER SAYING WHAT FOLLOWS (owner, 2026-08-04: "eventually the
              divider will have a small title or something, saying that these
              are courses from other years"). The per-year headings say WHICH
              year each block is; without a line above them, nothing said why
              the list carried on past the student's own year at all — it read
              as more of their timetable rather than as the rest of the degree.

              Not hidden behind a "show more": a student repeating a module, or
              taking one early, is ordinary, and the alternative is a list that
              quietly refuses to contain their actual timetable. */}
          <div className="flex items-center gap-3 pt-1">
            <span className="h-px flex-1 bg-line" />
            <span className="font-display text-[11px] font-semibold uppercase tracking-wide text-muted">
              {/* "From other years" was exactly right until the first block
                  under it became the other half of the student's OWN year. */}
              {otherYears[0]?.label ? "The rest of the degree" : "From other years"}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {otherYears.map((g, i) =>
            group(
              /* The student's own year can now appear twice — their semester
                 above, its other half in here — so the year alone is no longer
                 a unique key. */
              g.label ?? String(g.year ?? `unplaced-${i}`),
              g.label ?? (g.year ? `Year ${g.year}` : "Not placed in a year"),
              g.courses,
            ),
          )}
        </>
      )}
    </div>
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
                    "block font-display text-[15px] leading-tight transition-colors " +
                    (on ? "font-semibold text-ink" : "font-medium text-ink-2")
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

/**
 * The course list for a student whose programme nobody has on file — typed,
 * not ticked, because there is nothing to tick.
 *
 * This is the majority case, not an edge: seven of the ten universities in the
 * picker publish no curriculum anywhere, and so do 19 ZCAS programmes, 98 UNZA
 * ones and 106 of Mulungushi's 107. Sending those students to a list of the
 * four courses we have built and calling it their timetable was the hole.
 *
 * IT IS STILL THE TICK ROW. What they type becomes a row like any other and is
 * unticked the same way — the owner's standing rule that this flow asks every
 * question with one control, so nobody meets a form field where the last screen
 * had a list.
 *
 * `suggested` is what earlier students on the same programme said they were
 * taking, and it is the point of the whole arrangement: the first student types
 * eight courses into an empty box, the second is offered those eight back and
 * corrects them, and by the fifth the list is better than anything the
 * university publishes. `known` is the typeahead over courses the pipeline
 * already carries, so a typed course lands on the same course as a scraped one
 * rather than beside it.
 */
export function TypedCoursePicker({
  titles,
  suggested,
  known,
  query,
  onQuery,
  onToggle,
  onAdd,
  fill,
}: {
  /** What they have said they are taking, in the order they said it. */
  titles: string[];
  /** Reported by students already on this programme, most-agreed first. */
  suggested: { title: string; students: number }[];
  /** Typeahead hits from the courses we already know about. */
  known: string[];
  query: string;
  onQuery: (v: string) => void;
  onToggle: (title: string) => void;
  onAdd: (title: string) => void;
  fill?: boolean;
}) {
  const has = (t: string) => titles.some((x) => x.toLowerCase() === t.toLowerCase());
  /* Their own answers first, then anything offered they have not taken. A
     suggestion they already ticked must not appear twice — it is one course. */
  const offered = [...suggested.map((s) => s.title), ...known].filter(
    (t, i, all) => !has(t) && all.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i,
  );
  const typed = query.trim();
  /* The escape hatch that makes the whole screen work offline and for a course
     nobody has ever named: whatever they typed, exactly as typed. */
  const canAdd = typed.length >= 3 && !has(typed);

  return (
    <>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canAdd) {
              e.preventDefault();
              onAdd(typed);
            }
          }}
          placeholder="Type a course, then add it"
          aria-label="Add a course"
          maxLength={90}
          className={FIELD}
        />
        <button
          type="button"
          disabled={!canAdd}
          onClick={() => onAdd(typed)}
          aria-label={typed ? `Add ${typed}` : "Add course"}
          className={
            "squircle h-11 shrink-0 rounded-xl px-4 font-display text-[15px] font-semibold transition-colors " +
            (canAdd ? "bg-ink text-white" : "bg-active text-placeholder")
          }
        >
          Add
        </button>
      </div>

      <div className={"mt-2 flex flex-col gap-2 " + (fill ? "" : "max-h-[38dvh] overflow-y-auto")}>
        {titles.map((t) => (
          <button
            key={"on:" + t}
            type="button"
            onClick={() => onToggle(t)}
            aria-pressed
            className={rowTone(true)}
          >
            <Tick on />
            <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold leading-snug text-ink">
              {t}
            </span>
          </button>
        ))}
        {offered.map((t) => {
          const votes = suggested.find((s) => s.title === t)?.students ?? 0;
          return (
            <button key={"off:" + t} type="button" onClick={() => onToggle(t)} aria-pressed={false} className={rowTone(false)}>
              <Tick on={false} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[15px] font-medium leading-snug text-ink-2">{t}</span>
                {/* Only where somebody actually said so. "1 student" is a
                    weaker claim than silence and reads as a recommendation the
                    app is making rather than a fact about their classmates. */}
                {votes > 1 && (
                  <span className="mt-0.5 block font-display text-[13px] leading-5 text-muted">
                    {votes} students on your programme
                  </span>
                )}
              </span>
            </button>
          );
        })}
        {titles.length === 0 && offered.length === 0 && (
          <p className="px-0.5 py-2 text-[13px] leading-5 text-muted">
            Nobody has listed this programme yet — so yours becomes the list the next student sees.
          </p>
        )}
      </div>
    </>
  );
}
