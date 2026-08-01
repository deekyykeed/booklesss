/* Inline markup for step prose.
 *
 * Step text is authored in `.mjs` files as plain strings, and the reader prints
 * them as React text — so there is no markup channel and no HTML to sanitise.
 * This adds exactly two marks and nothing else:
 *
 *   **bold**              the phrase worth carrying out of the section (W-8)
 *   [[term|definition]]   a word the reader can tap to get defined (E-8)
 *
 * No italics, no links, no nesting: a step that needs a link needs a block
 * type, and every extra inline mark is another thing a step can get wrong.
 *
 * Two consumers, and they must agree. The reader renders the marks; search
 * indexes the text with them removed — so typing "error account" still matches
 * a phrase that happens to be bold, a defined term matches on the term rather
 * than on its definition, and an excerpt never shows a reader raw syntax.
 */

/** One run of prose. `define` set means it was a `[[term|definition]]`. */
export type Run = { text: string; bold: boolean; define?: string };

/* One pass, both marks. `[[…]]` is tried first so a term whose definition
 * contains an asterisk can't be torn in half. Both are non-greedy, so
 * `**a** and **b**` is two runs rather than one long one. An unpaired mark
 * matches nothing and stays literal — the right failure: it shows up in the
 * draft rather than silently eating the rest of the sentence. */
const MARK = /\[\[([^\]|]+)\|([^\]]+)\]\]|\*\*(.+?)\*\*/g;

/** Split authored text into plain, bold and definable runs, in order. */
export function runs(text: string): Run[] {
  const out: Run[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at), bold: false });
    if (m[1] !== undefined) out.push({ text: m[1], bold: false, define: m[2].trim() });
    else out.push({ text: m[3], bold: true });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), bold: false });
  return out;
}

/** The same text with the marks dropped, keeping the term and losing its
 *  definition — for search, excerpts, anything that wants the words. */
export function plain(text: string): string {
  return text.replace(MARK, (_m, term, _def, bold) => term ?? bold);
}
