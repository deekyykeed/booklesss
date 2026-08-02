/* ------------------------------------------------------------------ *
 * The greeting on the home page.
 *
 * Six bands rather than the usual three: a student opening this at 01:00 and
 * one opening it at 06:00 are having very different nights, and "Good
 * morning" is wrong for both. Each band carries a set, and one is picked per
 * visit — the page is read most days, so a line that never changes stops
 * being read at all.
 *
 * Every line is a bare vocative phrase, because the caller appends the name
 * as `, {name}`: "Still up" becomes "Still up, Deeky". That rules out
 * anything ending in punctuation ("Coffee first?" would render as
 * "Coffee first?, Deeky") and anything already carrying a comma. Each line
 * has to read as well without a name as with one, since identity is
 * per-device and a fresh browser has none.
 *
 * Kept short on purpose: this sets at 30px display, and a 390px phone fits
 * roughly 18 characters a line. Longer entries wrap to two lines, which is
 * fine; three is not, so nothing here runs past ~24 characters.
 * ------------------------------------------------------------------ */

/** Bands, low hour inclusive. Ordered late → late so the day reads down. */
const BANDS: { from: number; lines: readonly string[] }[] = [
  {
    // 00:00–04:59 — deep night. They are up when they shouldn't be; say so
    // with some warmth rather than pretending it's morning.
    from: 0,
    lines: [
      "Still up",
      "Burning the midnight oil",
      "The world's asleep",
      "Midnight study club",
      "Nobody's awake but you",
      "Quiet hours",
      "Late, late shift",
      "This is dedication",
    ],
  },
  {
    // 05:00–07:59 — before the day starts.
    from: 5,
    lines: [
      "Up before the sun",
      "Early start",
      "First one up",
      "Beat the sunrise",
      "Ahead of the day",
      "Early bird",
      "Sunrise shift",
      "Up with the birds",
    ],
  },
  {
    // 08:00–11:59 — morning proper.
    from: 8,
    lines: [
      "Good morning",
      "Morning",
      "A fresh page",
      "A new day",
      "Bright and early",
      "Let's make it count",
      "Off we go",
      "Top of the morning",
    ],
  },
  {
    // 12:00–16:59 — afternoon.
    from: 12,
    lines: [
      "Good afternoon",
      "Afternoon",
      "Back at it",
      "Halfway there",
      "Post-lunch push",
      "The second half",
      "Afternoon shift",
      "Good to see you",
    ],
  },
  {
    // 17:00–20:59 — evening.
    from: 17,
    lines: [
      "Good evening",
      "Evening",
      "Winding down",
      "Evening shift",
      "One more push",
      "Golden hour",
      "Sun's going down",
      "Dinner can wait",
    ],
  },
  {
    // 21:00–23:59 — night, but not yet the small hours.
    from: 21,
    lines: [
      "Night owl",
      "Late shift",
      "Still going",
      "One more before bed",
      "Late-night session",
      "Burning the lamp",
      "The night is young",
      "Almost bedtime",
    ],
  },
];

/** The set for an hour of the day. Last band whose `from` the hour has passed. */
function linesFor(hour: number): readonly string[] {
  let band = BANDS[0];
  for (const b of BANDS) if (hour >= b.from) band = b;
  return band.lines;
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
export function rememberGreeting(line: string): void {
  try {
    localStorage.setItem(LAST_KEY, line);
  } catch {
    /* nothing to do — worst case the next visit may repeat */
  }
}

/**
 * A greeting for right now.
 *
 * Excludes whatever was shown last visit: with eight lines a plain random
 * pick repeats one visit in eight, and a repeat is exactly what this set
 * exists to avoid — a student who sees the same line twice running concludes
 * it never changes.
 *
 * Client-only. It reads the clock and localStorage, and both differ from the
 * server, so the caller must not render the result until after hydration.
 */
export function pickGreeting(now: Date = new Date()): string {
  const lines = linesFor(now.getHours());
  const last = readLast();
  const pool = lines.length > 1 ? lines.filter((l) => l !== last) : lines;
  return pool[Math.floor(Math.random() * pool.length)];
}
