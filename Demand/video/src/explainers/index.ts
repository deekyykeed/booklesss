import { align, type Script, type Word } from "../explainer/align";
import pvScript from "./present-value/script.json";
import pvWords from "./present-value/words.json";
import cogScript from "./d885/script.json";
import cogWords from "./d885/words.json";
import cognitionScript from "./cognition/script.json";
import cognitionWords from "./cognition/words.json";

/* Every explainer: its script (what is said, what fills the screen) and its
 * word timings (when each word is said). To add one, make a folder beside
 * present-value/, write script.json, generate words.json, list it here. */

export type ExplainerProps = {
  slug: string;
  /** a file in public/, e.g. "recordings/present-value.mp4" — your real take.
   *  Null renders the placeholder presenter over the TTS voice. */
  footage?: string | null;
  /** per-frame face boxes [x,y,w,h] for the footage — loaded from
   *  public/recordings/<slug>.faces.json by calculateMetadata, never typed by hand */
  faces?: number[][] | null;
};

const FPS = 30;

export const EXPLAINERS = {
  "present-value": {
    script: pvScript as unknown as Script,
    timeline: align(pvScript as unknown as Script, pvWords as Word[], FPS),
  },
  // the biological basis of cognition — the owner's own take (A001_10091126_D885)
  d885: {
    script: cogScript as unknown as Script,
    timeline: align(cogScript as unknown as Script, cogWords as Word[], FPS),
  },
  // the same explainer, cut by the owner themselves (bucket 2026-10-09-231324844) — the one to post
  cognition: {
    script: cognitionScript as unknown as Script,
    timeline: align(cognitionScript as unknown as Script, cognitionWords as Word[], FPS),
  },
} as Record<string, { script: Script; timeline: ReturnType<typeof align> }>;
