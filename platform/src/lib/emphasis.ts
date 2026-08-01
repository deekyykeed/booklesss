/* Inline markup for step prose.
 *
 * Step text is authored in `.mjs` files as plain strings, and the reader prints
 * them as React text, so there is no markup channel and no HTML to sanitise.
 * This adds exactly three marks and nothing else:
 *
 *   **bold**              the phrase worth carrying out of the section (W-8)
 *   [[term|definition]]   a word the reader can tap to get defined (E-8)
 *   [label](url)          a link out to where this is taught properly (C-7)
 *
 * The link mark replaced a `sources` block that sat at the foot of each
 * section. A box labelled "read further" is furniture: it arrives after the
 * reader has finished the idea, and it makes the link a chore rather than part
 * of the sentence. Marking the words the claim came from puts the source where
 * the reader is already looking.
 *
 * No italics and no nesting. Every extra inline mark is another thing a step
 * can get wrong.
 *
 * Two consumers, and they must agree. The reader renders the marks; search
 * indexes the text with them removed, so a defined term matches on the term
 * rather than its definition, a link matches on its label rather than its URL,
 * and an excerpt never shows a reader raw syntax.
 */

/** One run of prose. `define` means a tappable term, `href` means a link. */
export type Run = { text: string; bold: boolean; define?: string; href?: string };

/* One pass, all three marks. `[[…]]` is tried before `[…](…)` so a term whose
 * definition contains a bracket can't be torn in half, and both are non-greedy
 * so `**a** and **b**` is two runs rather than one long one. An unpaired mark
 * matches nothing and stays literal, which is the right failure: it shows up in
 * the draft rather than silently eating the rest of the sentence. */
const MARK =
  /\[\[([^\]|]+)\|([^\]]+)\]\]|\[([^\][]+)\]\((https?:\/\/[^)\s]+)\)|\*\*(.+?)\*\*/g;

/** Split authored text into plain, bold, definable and linked runs, in order. */
export function runs(text: string): Run[] {
  const out: Run[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at), bold: false });
    if (m[1] !== undefined) out.push({ text: m[1], bold: false, define: m[2].trim() });
    else if (m[3] !== undefined) out.push({ text: m[3], bold: false, href: m[4] });
    else out.push({ text: m[5], bold: true });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), bold: false });
  return out;
}

/** The same text with the marks dropped, keeping the words and losing the
 *  definitions and URLs, for search, excerpts, anything that wants the prose. */
export function plain(text: string): string {
  return text.replace(MARK, (_m, term, _def, label, _url, bold) => term ?? label ?? bold);
}

/** Every URL a step links out to, for link-checking the whole course. */
export function links(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(MARK)) if (m[4]) out.push(m[4]);
  return out;
}
