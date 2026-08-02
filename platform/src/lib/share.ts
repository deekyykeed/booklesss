import { pathForId } from "./course";
import { courseForNode } from "./courses";
import { plain } from "./emphasis";
import { lessonContent } from "./lesson-content";
import { shareText } from "./site";

/* ------------------------------------------------------------------ *
 * What a shared step link says about itself.
 *
 * Two consumers — the page's generateMetadata and the opengraph-image beside
 * it — and they must agree, or the card shows one title and the message
 * beneath it shows another. So the answer is computed once, here.
 *
 * Both run at build time only. That is what makes it safe for this module to
 * pull in the full course text: nothing here reaches a browser.
 * ------------------------------------------------------------------ */

export type Share = {
  /** The step's own name — the bold line of the preview. */
  title: string;
  /** First sentence of the step, trimmed to what WhatsApp will show. */
  description: string;
  /** The same sentence with more room, for the card — see below. */
  blurb: string;
  /** The course it belongs to, drawn above the title. */
  eyebrow?: string;
  /** Absolute-from-root path, for og:url and canonical. */
  path: string;
};

/**
 * A step's opening sentence, as plain text.
 *
 * Deliberately the first `p` and not the first block: a section can open on a
 * callout, and a callout is an aside — "Rule of thumb: …" is a poor answer to
 * "what is this page". Inline marks are stripped, so a preview never shows a
 * reader `**bold**` or a raw `[[term|definition]]`.
 */
function opening(lessonId: string): string | undefined {
  const lesson = lessonContent(lessonId);
  for (const section of lesson?.sections ?? []) {
    for (const block of section.blocks) {
      if (block.type === "p") return plain(block.text);
    }
  }
  return undefined;
}

export function stepShare(lessonId: string): Share | null {
  const lesson = lessonContent(lessonId);
  if (!lesson) return null;

  const course = courseForNode(lessonId);
  const body = opening(lessonId);

  /* Falling back to the unit name rather than to nothing: a step with no
   * prose is a step being written, and "Getting started" still tells a
   * reader more than an empty second line. */
  const text = body ?? lesson.kicker ?? course?.subtitle ?? "";

  return {
    title: lesson.title,
    description: shareText(text),
    /* The card is an image, so nothing truncates it but the space it has —
     * two lines at this size, which is about 118 characters. Cutting it at
     * WhatsApp's 80 as well would leave the card ending mid-clause with a
     * third of its second line empty. */
    blurb: shareText(text, 118),
    eyebrow: course?.title,
    path: pathForId(lessonId),
  };
}
