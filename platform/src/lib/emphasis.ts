/* Inline markup for step prose.
 *
 * Step text is authored in `.mjs` files as plain strings, and the reader prints
 * them as React text, so there is no markup channel and no HTML to sanitise.
 * This adds exactly three marks and nothing else:
 *
 *   **bold**              the phrase worth carrying out of the section (W-8)
 *   [[term|definition]]   a word the reader can tap to get defined (E-8)
 *   [label](url)          a link out to where this is taught properly (C-7)
 *   [label](step:slug)    a link ACROSS to another step in the course (C-8)
 *
 * The two link forms share one syntax and render as opposites, which is the
 * point of giving them one. An `https://` link renders as NOTHING: the words
 * read as ordinary prose and the site turns up as a chip under the block. A
 * `step:` link renders as a visible, tappable link, because it is navigation
 * rather than provenance — the reader is meant to be able to go there.
 *
 * `step:` takes a step's SLUG, not a path: `[the operating cycle](step:
 * working-capital-and-liquidity)`. The reader resolves the slug to a URL
 * through the nav tree at render, so moving a step to a different lesson
 * changes its URL and every link to it still lands. That is the whole reason
 * the old rule said step references had to be plain text — Slack minted a new
 * unpredictable file id on every upload, so a link went stale immediately.
 * Nothing here mints anything: the slug is authored in the step's own .mjs and
 * is the same string the sidebar and the URL are built from. `seed:course`
 * refuses a slug no step answers to, so a typo blocks the write instead of
 * shipping a dead link into somebody's exam week.
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

/** The scheme that marks a link as pointing at another step rather than out. */
export const STEP_SCHEME = "step:";

/** One run of prose. `define` means a tappable term, `href` means a link. */
export type Run = { text: string; bold: boolean; define?: string; href?: string };

/* One pass, all three marks. `[[…]]` is tried before `[…](…)` so a term whose
 * definition contains a bracket can't be torn in half, and both are non-greedy
 * so `**a** and **b**` is two runs rather than one long one. An unpaired mark
 * matches nothing and stays literal, which is the right failure: it shows up in
 * the draft rather than silently eating the rest of the sentence.
 *
 * The URL alternative accepts `https://…` or `step:…` and nothing else. A bare
 * relative path is deliberately not allowed: a hand-written `/treasury-
 * management/…` would go stale the moment a step moved between lessons, which
 * is exactly what `step:` exists to prevent. */
const MARK =
  /\[\[([^\]|]+)\|([^\]]+)\]\]|\[([^\][]+)\]\(((?:https?:\/\/|step:)[^)\s]+)\)|\*\*(.+?)\*\*/g;

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

/** Every URL a step links OUT to, for the source strip and for link-checking.
 *
 *  Step links are excluded on purpose. They share the syntax but not the job:
 *  a source chip says what a claim rests on, and another step in this course is
 *  not a source. Leaving them in would put a favicon chip under the block for a
 *  scheme no favicon exists for. */
export function links(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(MARK))
    if (m[4] && !m[4].startsWith(STEP_SCHEME)) out.push(m[4]);
  return out;
}

/** Every step slug this text links ACROSS to, so seed-course can refuse one
 *  that no step answers to. */
export function stepRefs(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(MARK))
    if (m[4]?.startsWith(STEP_SCHEME)) out.push(m[4].slice(STEP_SCHEME.length));
  return out;
}
