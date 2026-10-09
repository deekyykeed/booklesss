/* Loudness master for a rendered video.
 *
 *   node scripts/master.mjs in.mp4 out.mp4
 *
 * Remotion mixes at whatever the parts sum to (the explainer came out at
 * -20.4 LUFS). Instagram, TikTok and Reels play back at roughly -14, so a quiet
 * upload sounds weak next to everything around it in the feed. Two-pass EBU R128
 * loudnorm to -14 LUFS / -1.5 dBTP, picture stream-copied (never re-encoded).
 *
 * ffmpeg prints its measurement to STDERR, which is why this uses spawnSync and
 * reads stderr rather than execFileSync's return value. */
import { spawnSync } from "node:child_process";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error("usage: node scripts/master.mjs in.mp4 out.mp4");
  process.exit(1);
}
const TARGET = { I: -14, TP: -1.5, LRA: 11 };
const base = `loudnorm=I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}`;

// pass 1: measure
const p1 = spawnSync("ffmpeg", ["-hide_banner", "-i", input, "-af", `${base}:print_format=json`, "-vn", "-f", "null", "-"], {
  encoding: "utf8",
});
const json = p1.stderr.slice(p1.stderr.lastIndexOf("{"), p1.stderr.lastIndexOf("}") + 1);
const m = JSON.parse(json);

// pass 2: apply, linear, using the measurement
const filter =
  `${base}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
  `:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
const p2 = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-v", "error", "-y", "-i", input, "-c:v", "copy", "-af", filter, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", output],
  { encoding: "utf8" },
);
if (p2.status !== 0) {
  console.error(p2.stderr);
  process.exit(p2.status ?? 1);
}
console.log(`mastered ${output}: ${m.input_i} LUFS -> ${TARGET.I} LUFS`);
