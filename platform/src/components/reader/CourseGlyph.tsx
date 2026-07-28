/* ------------------------------------------------------------------ *
 * The mark for a course.
 *
 * Solar · Bold throughout — the sidebar speaks two weights only, Line and
 * Bold, and this names the course you're in, so it takes the selected
 * weight. Inlined rather than resolved through <Icon>: this renders inside
 * client components, and <Icon> would pull the whole ~7,400-icon Solar set
 * into that bundle. Bodies are copied byte-for-byte from
 * @iconify-json/solar so they stay the real icons.
 *
 * Keyed by course slug, with a book as the fallback — a new course shows a
 * sensible mark the day it's seeded, and picking a better one is a one-line
 * change here rather than a schema change in Supabase.
 * ------------------------------------------------------------------ */

type Glyph = (props: { size: number }) => React.ReactElement;

/* Solar · Bold · "Chart 2" — three bars on a baseline. */
const Chart: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
    <path
      fill="currentColor"
      d="M17.293 2.293C17 2.586 17 3.057 17 4v13c0 .943 0 1.414.293 1.707S18.057 19 19 19s1.414 0 1.707-.293S21 17.943 21 17V4c0-.943 0-1.414-.293-1.707S19.943 2 19 2s-1.414 0-1.707.293M10 7c0-.943 0-1.414.293-1.707S11.057 5 12 5s1.414 0 1.707.293S14 6.057 14 7v10c0 .943 0 1.414-.293 1.707S12.943 19 12 19s-1.414 0-1.707-.293S10 17.943 10 17zM3.293 9.293C3 9.586 3 10.057 3 11v6c0 .943 0 1.414.293 1.707S4.057 19 5 19s1.414 0 1.707-.293S7 17.943 7 17v-6c0-.943 0-1.414-.293-1.707S5.943 9 5 9s-1.414 0-1.707.293M3 21.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5z"
    />
  </svg>
);

/* Solar · Bold · "Case Round" — a briefcase; every Solar money glyph draws a
 * dollar sign, and this course counts in kwacha. */
const Briefcase: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2.75c-.978 0-1.813.625-2.122 1.5a.75.75 0 0 1-1.414-.5a3.751 3.751 0 0 1 7.073 0a.75.75 0 1 1-1.415.5A2.25 2.25 0 0 0 12 2.75"
    />
    <path
      fill="currentColor"
      d="M14 12.5h-4a.5.5 0 0 0-.5.5v2.162a.5.5 0 0 0 .314.464l.7.28a4 4 0 0 0 2.972 0l.7-.28a.5.5 0 0 0 .314-.464V13a.5.5 0 0 0-.5-.5"
    />
    <path
      fill="currentColor"
      d="m8.01 15.37l-5.004-1.502c.03 3.114.212 5.983 1.312 6.96C5.636 22 7.758 22 12 22s6.364 0 7.682-1.172c1.1-.977 1.282-3.846 1.312-6.96l-5.005 1.501a2 2 0 0 1-1.246 1.65l-.7.28a5.5 5.5 0 0 1-4.086 0l-.7-.28a2 2 0 0 1-1.246-1.65M7.609 5h8.782c2.45 0 3.675 0 4.502.673q.24.195.434.434C22 6.934 22 8.159 22 10.609c0 .622 0 .932-.15 1.175a1 1 0 0 1-.1.134c-.19.214-.487.303-1.082.482L16 13.8V13a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v.8l-4.668-1.4c-.595-.179-.893-.268-1.082-.482a1 1 0 0 1-.1-.134C2 11.541 2 11.231 2 10.609c0-2.45 0-3.675.673-4.502q.195-.24.434-.434C3.934 5 5.159 5 7.609 5"
    />
  </svg>
);

/* Solar · Bold · "Book 2" — the fallback for any course without a mark. */
const Book: Glyph = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.727 2.712c.306-.299.734-.494 1.544-.6C7.105 2.002 8.209 2 9.793 2h4.414c1.584 0 2.688.002 3.522.112c.81.106 1.238.301 1.544.6c.305.3.504.72.613 1.513c.112.817.114 1.899.114 3.45v7.839H7.346c-.903 0-1.519-.001-2.047.138c-.472.124-.91.326-1.299.592V7.676c0-1.552.002-2.634.114-3.451c.109-.793.308-1.213.613-1.513m2.86 3.072a.82.82 0 0 0-.828.81c0 .448.37.811.827.811h8.828a.82.82 0 0 0 .827-.81a.82.82 0 0 0-.827-.811zm-.828 4.594c0-.447.37-.81.827-.81h5.517a.82.82 0 0 1 .828.81a.82.82 0 0 1-.828.811H7.586a.82.82 0 0 1-.827-.81"
    />
    <path
      fill="currentColor"
      d="M7.473 17.135c-1.079 0-1.456.007-1.746.083a2.46 2.46 0 0 0-1.697 1.538q.023.571.084 1.019c.109.793.308 1.213.613 1.513c.306.299.734.494 1.544.6c.834.11 1.938.112 3.522.112h4.414c1.584 0 2.688-.002 3.522-.111c.81-.107 1.238-.302 1.544-.601c.216-.213.38-.486.495-.91H7.586a.82.82 0 0 1-.827-.81c0-.448.37-.811.827-.811H19.97c.02-.466.027-1 .03-1.622z"
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
