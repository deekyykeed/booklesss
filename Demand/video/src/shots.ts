/* Real captures of the reader app, shot from the MOBILE layout by
 * Demand/social/_scripts/cap-feature.mjs. They live in
 * Demand/social/_source/feature-capture/ (the shared source of truth) and are
 * copied into public/app by `npm run sync:shots` — public/app is gitignored so
 * the same PNG isn't committed twice.
 *
 * Intrinsic sizes are recorded here because the camera cover-fits every shot:
 * scale so the frame is filled, then crop toward `focus`. Full screens are
 * 1206x2622 (402x874 at dsf 3); the rest are crops of the live UI. */
export type Shot = { file: string; w: number; h: number };

export const SHOTS = {
  /** Top of the lesson — kicker, title, intro, first Key ideas. The hero. */
  lessonTop: { file: "app/01-reader.png", w: 1206, h: 2622 },
  /** Mid-lesson body — Key ideas, In practice, Summary. Good for a scroll pan. */
  reader: { file: "app/ev-reader.png", w: 1206, h: 2622 },
  /** Course nav drawer open over the lesson. */
  nav: { file: "app/ev-nav.png", w: 1206, h: 2622 },
  /** Right panel: STEP / ON THIS PAGE contents. */
  onThisPage: { file: "app/02-drawer.png", w: 1206, h: 2622 },
  /** Right panel with a question typed into the composer. */
  typedFull: { file: "app/04b-typed-full.png", w: 1206, h: 2622 },
  /** Right panel with voice mode lit. */
  voiceFull: { file: "app/05b-voice-full.png", w: 1206, h: 2622 },
  /** Composer band in context, at rest. */
  bandRest: { file: "app/06-band-rest.png", w: 1206, h: 1482 },
  /** Composer band in context, voice glow on. */
  bandVoice: { file: "app/07-band-voice.png", w: 1206, h: 1482 },
  /** Tight crops of the composer itself. */
  composer: { file: "app/03-composer.png", w: 1017, h: 342 },
  composerTyped: { file: "app/04-typed.png", w: 1017, h: 411 },
  composerVoice: { file: "app/05-voice-composer.png", w: 1017, h: 342 },
} as const satisfies Record<string, Shot>;

export type ShotKey = keyof typeof SHOTS;
