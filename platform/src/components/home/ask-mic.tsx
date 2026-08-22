/**
 * The microphone on the home screen's one button.
 *
 * Streamline **Plump Solid – Free** ("Voice Mail"), the owner's own pick
 * (2026-08-22, sent as a screenshot of the Streamline page with Free + Plump
 * filtered). Plump is the family already on the course cards, so the roundest,
 * friendliest drawing in the app is now also the only thing on the home screen
 * — which is the right register for a control whose whole job is to look
 * askable.
 *
 * HAND-INLINED, like `reader/file-icons.tsx` and `home/plump-glyphs.tsx`,
 * rather than generated. The generated modules (`icons/myna.tsx`, `solar`,
 * `mingcute`, `tabler`) each earn a generator by carrying a *set*; this is one
 * path used in one place, and a package plus a `gen:` script plus an npm script
 * for a single glyph is more machinery than the glyph.
 *
 * Deliberately NOT added to `home/plump-glyphs.tsx`, which holds the course
 * cards' multicolour Plump **gradient** marks. Different set, different colour
 * contract — those carry their own fills, this one is one `currentColor` shape
 * so it takes the white of the button it sits on. WORKSPACE.md flags that file
 * as one of the two still shipping artwork as code; it does not need help
 * growing.
 *
 * 48×48 grid, which is Plump's own — do not rescale the path to 24. CC BY 4.0,
 * attribution owed alongside the rest of the Streamline sets.
 */
export function AskMic({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.879 4.667c2.043-2.03 4.873-3.165 8.121-3.165s6.078 1.135 8.121 3.165c2.04 2.026 3.206 4.853 3.305 8.08c.046 1.514.074 3.256.074 5.255s-.028 3.741-.074 5.256c-.099 3.226-1.265 6.053-3.305 8.079c-2.043 2.03-4.873 3.165-8.121 3.165s-6.078-1.135-8.121-3.165c-2.04-2.026-3.206-4.853-3.305-8.08a173 173 0 0 1-.074-5.255c0-2 .028-3.741.074-5.256c.098-3.226 1.265-6.053 3.305-8.08M9.556 19.502q.228 0 .45.026c.01 1.4.034 2.665.07 3.806c.115 3.79 1.496 7.25 4.041 9.777c2.554 2.536 6.036 3.891 9.883 3.891s7.33-1.355 9.883-3.891c2.544-2.528 3.926-5.987 4.042-9.777c.035-1.145.06-2.415.07-3.821q.146-.01.294-.011h1.083c2.242 0 4.027 1.867 3.97 4.087c-.246 9.667-6.207 16.786-15.121 18.511a46 46 0 0 1-.204 1.683c-.19 1.35-1.232 2.574-2.796 2.68q-.513.037-1.22.039q-.708-.002-1.221-.039c-1.564-.107-2.608-1.33-2.795-2.683a47 47 0 0 1-.197-1.649C10.784 40.463 4.75 33.317 4.501 23.59c-.056-2.22 1.73-4.087 3.97-4.087z"
      />
    </svg>
  );
}
