/* ------------------------------------------------------------------ *
 * The mark for a course.
 *
 * Solar · Bold Duotone throughout — duotone rather than Line because this names
 * the course you're actually in, the same weight the nav gives an active row.
 * Solar's own opacity=".5" is left untouched, so both tones follow whatever
 * colour the glyph inherits.
 *
 * Inlined rather than resolved through <Icon>: this renders inside client
 * components, and <Icon> would pull the whole ~7,400-icon Solar set into that
 * bundle for two paths. Bodies are copied byte-for-byte from
 * @iconify-json/solar so they stay the real icons.
 *
 * Keyed by course slug, with a book as the fallback — a new course shows a
 * sensible mark the day it's seeded, and picking a better one is a one-line
 * change here rather than a schema change in Supabase.
 * ------------------------------------------------------------------ */

type Glyph = (props: { size: number }) => React.ReactElement;

/* Solar · Bold Duotone · "Chart 2" — three bars on a baseline.
 *
 * Note which duotones survive this size. Solar's chart/banknote glyphs whose
 * faint layer is a full-bleed panel (graph-up, banknote-2) collapse into a dark
 * square at 22px — the detail is drawn inside the fill and disappears. The ones
 * kept here carry their tone in the shape itself, so they still read. */
const Chart: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <path
      fill="currentColor"
      d="M3.293 9.293C3 9.586 3 10.057 3 11v6c0 .943 0 1.414.293 1.707S4.057 19 5 19s1.414 0 1.707-.293S7 17.943 7 17v-6c0-.943 0-1.414-.293-1.707S5.943 9 5 9s-1.414 0-1.707.293"
    />
    <path
      fill="currentColor"
      opacity=".4"
      d="M17.293 2.293C17 2.586 17 3.057 17 4v13c0 .943 0 1.414.293 1.707S18.057 19 19 19s1.414 0 1.707-.293S21 17.943 21 17V4c0-.943 0-1.414-.293-1.707S19.943 2 19 2s-1.414 0-1.707.293"
    />
    <path
      fill="currentColor"
      opacity=".7"
      d="M10 7c0-.943 0-1.414.293-1.707S11.057 5 12 5s1.414 0 1.707.293S14 6.057 14 7v10c0 .943 0 1.414-.293 1.707S12.943 19 12 19s-1.414 0-1.707-.293S10 17.943 10 17z"
    />
    <path fill="currentColor" d="M3 21.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5z" />
  </svg>
);

/* Solar · Bold Duotone · "Case Round" — a briefcase.
 *
 * A briefcase rather than one of Solar's money marks: every money glyph in the
 * set draws a dollar sign, and this course counts in kwacha. */
const Briefcase: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.192 6H6.808c-1.688 0-2.531 0-3.175.33A3 3 0 0 0 2.33 7.633C2 8.277 2 9.12 2 10.808c0 .429 0 .643.073.824a1 1 0 0 0 .3.404c.153.122.358.183.77.307L8.5 13.95v1.213c0 .765.46 1.471 1.187 1.767l.56.227a4.65 4.65 0 0 0 3.506 0l.56-.227a1.91 1.91 0 0 0 1.187-1.767V13.95l5.358-1.607c.41-.124.616-.185.768-.307a1 1 0 0 0 .3-.404c.074-.18.074-.395.074-.824c0-1.688 0-2.531-.33-3.175a3 3 0 0 0-1.303-1.303C19.723 6 18.88 6 17.192 6M13.6 13h-3.2c-.22 0-.4.182-.4.406v1.757c0 .166.1.315.251.377l.56.228c.764.31 1.614.31 2.377 0l.56-.228a.41.41 0 0 0 .252-.377v-1.757a.403.403 0 0 0-.4-.406"
    />
    <path
      fill="currentColor"
      opacity=".5"
      d="m20.958 12.313l-.034.01L15.5 13.95v1.213c0 .765-.46 1.471-1.187 1.767l-.56.227a4.65 4.65 0 0 1-3.506 0l-.56-.227A1.91 1.91 0 0 1 8.5 15.163V13.95L3 12.3c0 3.675.035 7.388 1.318 8.528C5.636 22 7.758 22 12 22s6.364 0 7.682-1.172c1.283-1.14 1.317-4.853 1.318-8.528z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
      opacity=".5"
      d="M9.17 4a3.001 3.001 0 0 1 5.66 0"
    />
  </svg>
);

/* Solar · Bold Duotone · "Book 2" — the fallback for any course without a mark. */
const Book: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <path
      fill="currentColor"
      opacity=".5"
      d="M4.727 2.733c.306-.308.734-.508 1.544-.618C7.105 2.002 8.209 2 9.793 2h4.414c1.584 0 2.688.002 3.522.115c.81.11 1.238.31 1.544.618c.305.308.504.74.613 1.557c.112.84.114 1.955.114 3.552V18H7.426c-1.084 0-1.462.006-1.753.068c-.513.11-.96.347-1.285.667c-.11.108-.164.161-.291.505A1.3 1.3 0 0 0 4 19.7V7.842c0-1.597.002-2.711.114-3.552c.109-.816.308-1.249.613-1.557"
    />
    <path
      fill="currentColor"
      d="M20 18H7.426c-1.084 0-1.462.006-1.753.068c-.513.11-.96.347-1.285.667c-.11.108-.164.161-.291.505s-.107.489-.066.78l.022.15c.11.653.31.998.616 1.244c.307.246.737.407 1.55.494c.837.09 1.946.092 3.536.092h4.43c1.59 0 2.7-.001 3.536-.092c.813-.087 1.243-.248 1.55-.494c.2-.16.354-.362.467-.664H8a.75.75 0 0 1 0-1.5h11.975c.018-.363.023-.776.025-1.25M7.25 7A.75.75 0 0 1 8 6.25h8a.75.75 0 0 1 0 1.5H8A.75.75 0 0 1 7.25 7M8 9.75a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5z"
    />
  </svg>
);

const BY_SLUG: Record<string, Glyph> = {
  economics: Chart,
  "corporate-finance": Briefcase,
};

export function CourseGlyph({ slug, size = 22 }: { slug: string; size?: number }) {
  const G = BY_SLUG[slug] ?? Book;
  return <G size={size} />;
}
