import { avatarSrc } from "./avatars";

/* ------------------------------------------------------------------ *
 * The assigned face as a CSS background, so Clerk's user button can wear it.
 *
 * Owner, 2026-08-04, on reaching the dashboard after the first completed
 * sign-up: "I have not gotten my user icon."
 *
 * The cause is an ordering nobody designed: signed OUT, the header draws
 * identity/HeaderAvatar — the face this device was given. Signed IN, the header
 * hands over to Clerk's <UserButton>, which draws Clerk's own avatar — and a
 * student who signed up with an email address has no photo there, so Clerk
 * falls back to initials. Making an account therefore REPLACED a face with two
 * grey letters. The person who committed got the less personal mark, which is
 * exactly backwards.
 *
 * Clerk's button cannot be handed a React element for its trigger, and its
 * appearance API takes CSS rather than components — so the face has to reach it
 * as a URL.
 *
 * IT IS NOW JUST THE FILE. This built a data-URI by hand — wrapping the inline
 * SVG fragment in an <svg> and percent-encoding roughly 2KB of path data into
 * the stylesheet — because the artwork only existed as a string in the bundle.
 * Since the set moved to public/avatars, there is a real URL to point at: the
 * browser fetches it once, caches it, and shares it with every other place the
 * same face is drawn.
 *
 * PAINTED AS A BACKGROUND, deliberately, rather than replacing Clerk's <img>.
 * Clerk renders an <img> only when the user actually has a photo, and initials
 * otherwise. As a background this sits UNDER both: it shows through where the
 * initials were, and a real uploaded photo covers it completely. So the student
 * who uploads a picture gets their picture, and everyone else gets their face.
 * Nothing has to detect which case it is.
 * ------------------------------------------------------------------ */

/** `url("/avatars/….svg")` for an avatar id, ready to drop into a CSS custom
 *  property. */
export function avatarCssUrl(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return `url("${avatarSrc(id)}")`;
}
