import { identitySince } from "@/lib/identity";

/* ------------------------------------------------------------------ *
 * The greeting on the home page.
 *
 * Six bands rather than the usual three: a student opening this at 01:00 and
 * one opening it at 06:00 are having very different nights, and "Good
 * morning" is wrong for both. Each band carries a set, and one is picked per
 * visit — the page is read most days, so a line that never changes stops
 * being read at all.
 *
 * THREE RULES, all from the owner reading it live.
 *
 * 1. EVERY LINE HAS TO MEAN SOMETHING (2026-08-03). The set used to carry
 *    "Halfway there" and "The second half" in the afternoon band, and the
 *    reaction was the right one: halfway to *what*? The reader never agreed
 *    the day was a race with a midpoint. A greeting may observe the hour,
 *    welcome the reader, or say something warm about them being here. It may
 *    not refer to a goal, a schedule or a quantity the reader has not been
 *    shown. If a line needs a footnote, it is not a greeting.
 *
 * 2. THE NAME MOVES (2026-08-03). It used to be appended by the caller as
 *    `, {name}`, so every line for the life of the app read "<something>,
 *    Deeky". Now each entry decides for itself, and the three forms are mixed
 *    through every band:
 *      - a plain string          — no name at all, ever
 *      - ["…, {name}", "…"]      — name at the end
 *      - ["{name}, …", "…"]      — name at the front
 *    The second element is what shows when there is no name to use. Both
 *    halves are written out rather than derived, because deriving one from
 *    the other means string surgery on punctuation and it gets "Deeky," or a
 *    stray comma wrong eventually.
 *
 * 3. A LINE MAY NOT PRESUME A PAST THE READER DOESN'T HAVE (2026-08-03,
 *    the same day the first-visit form was removed). A stranger from a
 *    WhatsApp link opened the dashboard and it said "Back at it" — the
 *    owner's reaction: *"why do I see a greeting when I've hypothetically
 *    never been here."* So each band is split in two: `anyone` is safe for a
 *    first visit ("Good afternoon" observes the clock, not a history), and
 *    `returning` is every line that claims recognition — "Welcome back",
 *    "Back at it", "Still going", "One more before bed". The returning pool
 *    only opens once this device's identity is at least a day old, which is
 *    the app's record of having met them before (see identitySince).
 *
 * Kept short on purpose: this sets at 30px display, and a 390px phone fits
 * roughly 18 characters a line. Two lines is fine, three is not — so a bare
 * line stays under ~24 characters and a named one under ~20 plus the name.
 * ------------------------------------------------------------------ */

/** A line with a name in it, and the line to use when there is no name. */
type Entry = string | readonly [withName: string, without: string];

/** Bands, low hour inclusive. Ordered late → late so the day reads down.
 *  `anyone` is first-visit safe; `returning` presumes we've met. */
const BANDS: { from: number; anyone: readonly Entry[]; returning: readonly Entry[] }[] = [
  {
    // 00:00–04:59 — deep night. They are up when they shouldn't be; say so
    // with some warmth rather than pretending it's morning. Being up late is
    // true of a stranger too, so almost all of it is safe for anyone.
    from: 0,
    anyone: [
      "The world's asleep",
      ["Still up, {name}", "Still up"],
      ["{name}, it's late", "It's late"],
      "Burning the midnight oil",
      ["Respect, {name}", "This is dedication"],
      "Nobody else is awake",
      ["Late one, {name}", "A late one"],
      "The small hours",
    ],
    returning: [],
  },
  {
    // 05:00–07:59 — before the day starts.
    from: 5,
    anyone: [
      "Up before the sun",
      ["Morning, {name}", "Morning"],
      ["{name}, you're up early", "You're up early"],
      "First one up",
      ["Early start, {name}", "Early start"],
      "Ahead of the day",
      ["Early one, {name}", "An early one"],
      "Before the day starts",
    ],
    returning: [],
  },
  {
    // 08:00–11:59 — morning proper.
    from: 8,
    anyone: [
      ["Good morning, {name}", "Good morning"],
      ["Morning, {name}", "Morning"],
      "A fresh page",
      "A new day",
      ["Let's begin, {name}", "Let's begin"],
      "Bright and early",
      ["Welcome, {name}", "Welcome"],
    ],
    returning: [
      ["{name}, welcome back", "Welcome back"],
      ["Good to see you, {name}", "Good to see you"],
    ],
  },
  {
    // 12:00–16:59 — afternoon. "Halfway there" and "The second half" were
    // both here and both went: they measured the day against a finish line
    // the reader was never given. "Back at it" survives, but only for a
    // reader who has an "it" to be back at.
    from: 12,
    anyone: [
      ["Good afternoon, {name}", "Good afternoon"],
      ["Afternoon, {name}", "Afternoon"],
      "Plenty of day left",
      "The day's still young",
      ["Welcome, {name}", "Welcome"],
      ["Good to have you, {name}", "Good to have you"],
    ],
    returning: [
      "Back at it",
      ["{name}, good to see you", "Good to see you"],
      ["Welcome back, {name}", "Welcome back"],
      ["Let's carry on, {name}", "Let's carry on"],
    ],
  },
  {
    // 17:00–20:59 — evening.
    from: 17,
    anyone: [
      ["Good evening, {name}", "Good evening"],
      ["Evening, {name}", "Evening"],
      "Golden hour",
      "The sun's going down",
      "The day's winding down",
      ["Dinner can wait, {name}", "Dinner can wait"],
    ],
    returning: [
      ["{name}, welcome back", "Welcome back"],
      ["Good to see you, {name}", "Good to see you"],
    ],
  },
  {
    // 21:00–23:59 — night, but not yet the small hours.
    from: 21,
    anyone: [
      ["Evening, {name}", "Evening"],
      "Night owl",
      "A late session",
      "The night is young",
      ["Late one, {name}", "A late one"],
      "Almost bedtime",
    ],
    returning: [
      ["Still going, {name}", "Still going"],
      ["{name}, one more before bed", "One more before bed"],
    ],
  },
];

/** What a picked entry renders to, in both cases. */
export type Greeting = { withName: string; without: string };

const asGreeting = (e: Entry): Greeting =>
  typeof e === "string" ? { withName: e, without: e } : { withName: e[0], without: e[1] };

/** Whether this device has been here on an earlier day. Same calendar day
 *  counts as the same first visit — an identity assigned this morning is not
 *  a history, it is the doormat still being warm. */
function hasBeenHereBefore(now: Date): boolean {
  const since = identitySince();
  if (!since) return false;
  const first = new Date(since);
  return !isNaN(first.getTime()) && first.toDateString() !== now.toDateString();
}

/** The pool for an hour of the day. Last band whose `from` the hour has
 *  passed, plus the returning lines only when they'd be true. */
function entriesFor(hour: number, returning: boolean): readonly Entry[] {
  let band = BANDS[0];
  for (const b of BANDS) if (hour >= b.from) band = b;
  return returning ? [...band.anyone, ...band.returning] : band.anyone;
}

const LAST_KEY = "booklesss:greeting:last";

function readLast(): string | null {
  try {
    return localStorage.getItem(LAST_KEY);
  } catch {
    return null; // private mode, or storage disabled — the exclusion is a nicety
  }
}

/** Remember what was shown, so the next visit can avoid repeating it. */
export function rememberGreeting(g: Greeting): void {
  try {
    // Keyed on the template, not the rendered line, so "Still up, Deeky" and
    // "Still up" are recognised as the same entry.
    localStorage.setItem(LAST_KEY, g.withName);
  } catch {
    /* nothing to do — worst case the next visit may repeat */
  }
}

/**
 * A greeting for right now, in both forms.
 *
 * Both forms are returned rather than one finished string because the name
 * arrives late: identity is read from localStorage after mount, and the
 * greeting is picked at mount. Choosing here and substituting at render keeps
 * the line stable while the name fills in, instead of re-rolling it the moment
 * identity loads.
 *
 * Excludes whatever was shown last visit: with eight entries a plain random
 * pick repeats one visit in eight, and a repeat is exactly what this set
 * exists to avoid — a student who sees the same line twice running concludes
 * it never changes.
 *
 * Client-only. It reads the clock and localStorage (its own last-shown key
 * and, through identitySince, whether this device has a past), and all of
 * that differs from the server, so the caller must not render the result
 * until after hydration.
 */
export function pickGreeting(now: Date = new Date()): Greeting {
  const all = entriesFor(now.getHours(), hasBeenHereBefore(now)).map(asGreeting);
  const last = readLast();
  const pool = all.length > 1 ? all.filter((g) => g.withName !== last) : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** The finished line. Falls back to the nameless form when there is no name. */
export function renderGreeting(g: Greeting, name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed ? g.withName.replace("{name}", trimmed) : g.without;
}
