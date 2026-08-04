"use client";

import { useId } from "react";
import { MynaIcon } from "@/components/icons/myna";
import type { CourseMeta } from "@/lib/courses";
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
  /* 20px, down from 32 and then from 24 (owner, 2026-08-04: "the logo is too
     big, it must feel like its inline", and again on the 24 — "the uni logos
     are still too big").

     20 is the tick's box, so every mark in the row is now one size and the row
     is led by the NAME rather than by the crest. That is the right way round:
     the student is reading a list of universities, not picking a logo, and at
     32 the crest set the row's height and read as a mark the name was
     captioning. There is no smaller step worth taking after this one — below
     about 18 a crest stops being recognisable at arm's length on a phone,
     which is the entire reason the row carries one. */
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
        width={20}
        height={20}
        loading="lazy"
        decoding="async"
        className="h-5 w-5 shrink-0 object-contain"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white"
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
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className={
                    "truncate font-display text-[15px] leading-tight text-ink " +
                    (on ? "font-semibold" : "font-medium")
                  }
                >
                  {s.name}
                </span>
                <SchoolMark id={s.id} letter={s.name.slice(0, 1)} tone={s.tone} />
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
