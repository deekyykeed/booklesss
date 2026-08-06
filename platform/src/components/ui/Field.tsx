/* ------------------------------------------------------------------ *
 * A blank you fill in.
 *
 * Owner, 2026-08-06: "instead of the text boxes being containers and closed
 * like that let it instead look like a line. a blank that you fill."
 *
 * Every typed answer in the app was a bordered, rounded, white-filled box —
 * `h-11 rounded-xl border border-line bg-white`. On a page whose whole job is
 * to ask one short question, that box is the heaviest thing on screen, and it
 * is the same argument the OPTIONS already won on 2026-08-03: "remove the
 * containers around the options, that's what I'm saying looks ugly." The rows
 * lost their frames then and the fields kept theirs, so a question with a list
 * under it and a question with a field under it stopped looking related.
 *
 * A rule and a caret is a form anyone has filled in on paper. It carries the
 * same information a box does — here is where you write — with one line
 * instead of four, and it darkens on focus so the active blank is obvious.
 *
 * 16px TEXT, AND THAT IS NOT A STYLE CHOICE. iOS Safari zooms the viewport
 * when a focused input's font-size is under 16px, and every field in this app
 * was 14 or 15 — so tapping the name field on an iPhone jumped the page and
 * left the student scrolled sideways. The usual "fix" is `maximum-scale=1` on
 * the viewport, which disables pinch-zoom for everybody and is an
 * accessibility failure; sizing the text correctly costs nothing.
 * ------------------------------------------------------------------ */

/**
 * The bare underline, for callers that render their own `<input>` — the
 * onboarding questions do, because each needs its own type, mode and mark.
 *
 * NO HORIZONTAL PADDING. A box needs its text inset off the border; a rule
 * needs the text to start exactly where the line starts, or the blank reads as
 * beginning somewhere it doesn't. `h-11` keeps the 44px rhythm the boxed
 * version set, so nothing else on the page moves.
 */
export const FIELD =
  "h-11 w-full border-b border-line bg-transparent text-[16px] text-ink " +
  "outline-none transition-colors placeholder:text-placeholder focus:border-ink";

/**
 * One labelled blank.
 *
 * The label is the `Choices` label from the onboarding flow — same size, same
 * weight, same token — because this is the same kind of thing: a small heading
 * over the control that answers it. Do not restyle it here without moving that
 * one too.
 *
 * `trailing` is for a control that belongs INSIDE the blank rather than beside
 * it — the password field's show/hide eye. It sits on the line's right end, so
 * the rule still runs the full width of the answer.
 *
 * Focus is drawn with `focus-within` rather than React state. The wrapper has
 * to react to focus on the input inside it, which is exactly what the pseudo
 * class is for; the version this replaced held an `onFocus`/`onBlur` boolean
 * in state, which is a re-render per focus change to compute something CSS
 * already knows.
 */
export function Field({
  ref,
  id,
  label,
  type,
  value,
  onChange,
  trailing,
  hint,
  ...rest
}: {
  ref?: React.Ref<HTMLInputElement>;
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  trailing?: React.ReactNode;
  /** A line under the blank — what went wrong, or what we made of what they
   *  typed. Muted, so it reads as a note rather than as a second question. */
  hint?: React.ReactNode;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "type" | "value" | "onChange" | "ref"
>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-[13px] font-medium text-ink-2">
        {label}
      </label>
      <div className="flex items-center gap-2 border-b border-line transition-colors focus-within:border-ink">
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={
            "h-11 min-w-0 flex-1 bg-transparent text-[16px] text-ink " +
            "outline-none placeholder:text-placeholder"
          }
          {...rest}
        />
        {trailing}
      </div>
      {hint && <p className="text-[13px] leading-5 text-muted">{hint}</p>}
    </div>
  );
}
