import { align, type Script, type Word } from "../explainer/align";
import pvScript from "./present-value/script.json";
import pvWords from "./present-value/words.json";

/* Every explainer: its script (what is said, what fills the screen) and its
 * word timings (when each word is said). To add one, make a folder beside
 * present-value/, write script.json, generate words.json, list it here. */

export type ExplainerProps = {
  slug: string;
  /** a file in public/, e.g. "recordings/present-value.mp4" — your real take.
   *  Null renders the placeholder presenter over the TTS voice. */
  footage?: string | null;
};

const FPS = 30;

export const EXPLAINERS = {
  "present-value": {
    script: pvScript as unknown as Script,
    timeline: align(pvScript as unknown as Script, pvWords as Word[], FPS),
  },
} as Record<string, { script: Script; timeline: ReturnType<typeof align> }>;
