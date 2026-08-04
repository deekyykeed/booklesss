/* ------------------------------------------------------------------ *
 * The handle — the one name that is unique, and the one Clerk enforces.
 *
 * Owner, 2026-08-04: "im abandoning the anonymous thing, users will be
 * identified by their username", and on its shape: a handle PLUS a display
 * name. The handle is @deeky and there is only one of them; the display name is
 * "Deeky Mvula" and two people may share it.
 *
 * WHY THIS LIVES IN CLERK AND NOT IN THE IDENTITY RECORD. Uniqueness is the
 * entire point of a handle, and uniqueness is a property of the SET, not of a
 * record — a device cannot know whether anyone else took "deeky", and neither
 * can localStorage. Clerk already enforces it across every account and rejects
 * a duplicate at the source. Storing a second copy in the identity blob would
 * be the same duplication that produced the merge bug, over a field whose whole
 * value is that there is exactly one of it. So `user.username` is the truth;
 * anything else is a mirror for querying.
 *
 * DERIVED AT SIGN-UP, EDITABLE AFTERWARDS. A gated reader — somebody who tapped
 * a checkpoint halfway down a step — pays two fields, and asking for a third at
 * that exact moment is putting the toll back on the cheapest commitment anyone
 * makes. Their email already contains a serviceable handle, so one is derived
 * and offered rather than demanded, and the "you" step is where they change it
 * if they care. That is not the anonymous assignment coming back in disguise:
 * "deeky" off deeky@gmail.com is recognisably them, where "Astronaut" was a
 * random draw from a table of two hundred.
 * ------------------------------------------------------------------ */

/** Clerk's own bounds. Its default minimum is 4 and its maximum is 64; 30 is
 *  ours, because a handle is read in a comment byline and at 64 characters it
 *  is not a handle, it is a sentence. */
const MIN = 4;
const MAX = 30;

/**
 * Whether a handle is one Clerk will accept — shape only.
 *
 * IT CANNOT SAY WHETHER IT IS TAKEN, and nothing on the frontend can. Clerk
 * publishes no "is this free" endpoint to the browser, which is the correct
 * call on their side: an open availability oracle is a way to enumerate who has
 * an account. So the only honest answer to "is deeky free?" comes back from the
 * attempt itself, and the UI reports it there rather than promising a green
 * tick it has no way to earn.
 */
export function isHandle(v: string): boolean {
  return /^[a-z0-9_]+$/.test(v) && v.length >= MIN && v.length <= MAX;
}

/** What a student's typing becomes: lowercased, with anything Clerk will not
 *  take dropped rather than rejected. Someone typing "Deeky Mvula" into a
 *  handle field means `deeky_mvula`, and telling them off for the capital is a
 *  worse answer than simply meaning what they meant. */
export function cleanHandle(v: string): string {
  return v
    .toLowerCase()
    .replace(/[\s.]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_{2,}/g, "_")
    .slice(0, MAX);
}

/**
 * A handle off an email address.
 *
 * `deeky.mvula+test@gmail.com` -> `deeky_mvula`. The `+tag` goes because it is
 * routing rather than name, and dots become underscores because Gmail treats
 * them as nothing at all — two students at deeky.m@ and deekym@ are one inbox
 * and should not become two different-looking handles.
 *
 * Padded when it comes out too short: Clerk rejects anything under four, and
 * `jo@x.com` is a real address. Padding beats rejecting, because this runs
 * during a sign-up the student cannot see and must never block.
 */
export function handleFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const base = cleanHandle(local.split("+")[0] ?? "");
  if (!base) return "student";
  return base.length >= MIN ? base : (base + "_student").slice(0, MAX);
}

/**
 * The same handle with a number on it, for when Clerk says it is taken.
 *
 * Counted rather than random, so the second Deeky is `deeky2` and not
 * `deeky_8f3a` — a handle somebody has to read out loud. Trimmed from the front
 * so the suffix always survives the length cap.
 */
export function nextHandle(base: string, n: number): string {
  const suffix = String(n);
  return cleanHandle(base.slice(0, MAX - suffix.length) + suffix);
}
