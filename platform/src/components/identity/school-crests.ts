/* GENERATED — do not edit by hand. Run scripts/gen-school-crests.py.
 *
 * WHICH universities have their own crest on disk. The artwork itself lives
 * in public/schools/<id>.png and is fetched by the browser like any other
 * image; this file is only the list, so importing it costs a few bytes.
 *
 * IT USED TO BE THE ARTWORK, inlined as data URIs. That was right for the two
 * crests it started with and wrong the moment there were nine: 128px of PNG
 * per university is ~170KB of base64, and this module is imported by
 * identity/pickers, a client component. The same trap card-glyphs and AVATARS
 * are marked with — a picture per row is fine until you count the rows.
 *
 * Same-origin files are not the thing the CSP forbids. `default-src 'self'`
 * blocks a logo hotlinked from a university's own server, which is why these
 * are fetched once and committed rather than linked; it has never blocked
 * /schools/cbu.png. Sources are recorded in scripts/gen-school-crests.py.
 *
 * These are the universities' marks, used so a student can recognise their own
 * school in a list. They are not ours and imply no endorsement.
 */
export const SCHOOL_CRESTS = new Set<string>([
  "cavendish",
  "cbu",
  "chalimbana",
  "mukuba",
  "mulungushi",
  "northrise",
  "unilus",
  "unza",
  "zcas",
]);

/** The file a crest lives at, or null where we have no mark for that
 *  university and the row falls back to a monogram. */
export function crestSrc(id: string | undefined): string | null {
  return id && SCHOOL_CRESTS.has(id) ? `/schools/${id}.png` : null;
}
