/* Put the owner's own sound back on a footage render.
 *
 *   node scripts/mux-audio.mjs <slug>
 *
 * Takes out/<slug>.raw.mp4 (Remotion's render) and replaces its audio with
 * public/recordings/<slug>.audio.wav — the take's own track, cut by
 * scripts/footage.py and nothing else. Picture is stream-copied. The only
 * encode is the single AAC pass every .mp4 for social needs, at 320k.
 *
 * Owner, 2026-10-09: "don't do anything to the sound at all. It already comes
 * done as it is." So there is no loudnorm here, no music, no sfx — this is the
 * footage path; scripts/master.mjs is only for the placeholder (TTS) renders. */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node scripts/mux-audio.mjs <slug>");
  process.exit(1);
}
const video = `out/${slug}.raw.mp4`;
const audio = `public/recordings/${slug}.audio.wav`;
const output = `out/${slug}.mp4`;
for (const f of [video, audio]) {
  if (!existsSync(f)) {
    console.error(`missing ${f}`);
    process.exit(1);
  }
}
const r = spawnSync(
  "ffmpeg",
  ["-v", "error", "-y", "-i", video, "-i", audio, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-shortest", "-movflags", "+faststart", output],
  { encoding: "utf8" },
);
if (r.status !== 0) {
  console.error(r.stderr);
  process.exit(r.status ?? 1);
}
console.log(`${output}: picture from the render, sound straight from the take`);
