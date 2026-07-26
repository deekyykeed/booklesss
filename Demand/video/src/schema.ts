import { z } from "zod";

/* Everything a demo needs, editable from the Studio props panel — so a video
 * can be re-cut without touching code. */
export const demoSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  sub: z.string(),
  /** Path inside public/, e.g. "recordings/reader.mp4". Blank = placeholder. */
  screenSrc: z.string(),
  caption: z.string(),
  subcaption: z.string(),
  ctaHeadline: z.string(),
  ctaSub: z.string(),
});

export type DemoProps = z.infer<typeof demoSchema>;

/* Copy follows the house rules: lead with "studying made easy", no hard sell,
 * and the student-facing CTA is the Google search, not a link. */
export const defaultDemoProps: DemoProps = {
  eyebrow: "Studying made easy",
  headline: "Your whole course, in one place.",
  sub: "Notes in order, written to be read — not slides dumped in a folder.",
  screenSrc: "",
  caption: "Open the lesson. Start reading.",
  subcaption: "Every step in order, on your phone, no scrolling through a group chat.",
  ctaHeadline: "Search Booklesss on Google.",
  ctaSub: "Three S's at the end.",
};

/* Frame budget at 30fps. TransitionSeries subtracts each overlap, so the
 * composition length is the sum of the scenes minus the transitions. */
export const FPS = 30;
export const INTRO = 75;
export const SCREEN = 210;
export const OUTRO = 90;
export const TRANSITION = 15;
export const TOTAL = INTRO + SCREEN + OUTRO - TRANSITION * 2;
