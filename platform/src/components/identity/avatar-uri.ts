import { AVATARS, resolveAvatar } from "./avatars";

/* ------------------------------------------------------------------ *
 * The assigned face as a CSS background, so Clerk's user button can wear it.
 *
 * Owner, 2026-08-04, on reaching the dashboard after the first completed
 * sign-up: "I have not gotten my user icon."
 *
 * The cause is an ordering nobody designed: signed OUT, the header draws
 * identity/HeaderAvatar — the Kameleon face this device was given. Signed IN,
 * the header hands over to Clerk's <UserButton>, which draws Clerk's own
 * avatar — and a student who signed up with an email address has no photo
 * there, so Clerk falls back to initials. Making an account therefore REPLACED
 * a face with two grey letters. The person who committed got the less personal
 * mark, which is exactly backwards.
 *
 * Clerk's button cannot be handed a React element for its trigger, and its
 * appearance API takes CSS rather than components — so the face has to reach it
 * as a URL. These are inline SVG fragments, not files, so there is no URL to
 * give: this makes one, by wrapping the fragment in an <svg> and encoding it.
 *
 * PAINTED AS A BACKGROUND, deliberately, rather than replacing Clerk's <img>.
 * Clerk renders an <img> only when the user actually has a photo, and initials
 * otherwise. As a background this sits UNDER both: it shows through where the
 * initials were, and a real uploaded photo covers it completely. So the student
 * who uploads a picture gets their picture, and everyone else gets their face
 * instead of "DM". Nothing has to detect which case it is.
 * ------------------------------------------------------------------ */

const BODY = new Map(AVATARS.map((a) => [a.id, a.body]));

/**
 * `url("data:image/svg+xml,…")` for an avatar id, ready to drop into a CSS
 * custom property.
 *
 * encodeURIComponent rather than base64: the fragments are ~1–2KB of markup and
 * base64 would inflate them by a third, where percent-encoding leaves most of
 * the characters alone. The single quotes in the wrapper are what let the whole
 * thing sit inside CSS double quotes without escaping.
 */
export function avatarCssUrl(id: string | null | undefined): string | undefined {
  const body = BODY.get(resolveAvatar(id));
  if (!body) return undefined;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
