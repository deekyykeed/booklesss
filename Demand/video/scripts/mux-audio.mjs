/* Put the owner's own voice back on a footage render, with the score under it.
 *
 *   node scripts/mux-audio.mjs <slug>
 *
 * out/<slug>.raw.mp4 is Remotion's render. With footage, its audio track holds
 * ONLY the music bed and the sound effects (Explainer.tsx renders no voice in
 * footage mode). This lays public/recordings/<slug>.audio.wav — the take's own
 * track, cut by scripts/footage.py and nothing else — on top at unity gain.
 * Picture is stream-copied.
 *
 * The voice is never processed: no EQ, no compression, no loudness pass, no
 * gain change (owner, 2026-10-09: "don't do anything to the sound"). The only
 * thing after the sum is a peak catcher at -0.2 dBFS that does nothing unless
 * voice + music would clip — a clip would be the bigger change to the sound.
 * If the render has no audio track at all, the voice goes on alone. */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node scripts/mux-audio.mjs <slug>");
  process.exit(1);
}
const video = `out/${slug}.raw.mp4`;
const voice = `public/recordings/${slug}.audio.wav`;
const output = `out/${slug}.mp4`;
for (const f of [video, voice]) {
  if (!existsSync(f)) {
    console.error(`missing ${f}`);
    process.exit(1);
  }
}
const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", video], { encoding: "utf8" });
const hasScore = probe.stdout.trim().length > 0;

const args = hasScore
  ? [
      "-v", "error", "-y", "-i", video, "-i", voice,
      "-filter_complex",
      "[1:a]aresample=48000[v];[0:a]aresample=48000[m];[v][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.977:attack=5:release=50:level=disabled[a]",
      "-map", "0:v:0", "-map", "[a]",
    ]
  : ["-v", "error", "-y", "-i", video, "-i", voice, "-map", "0:v:0", "-map", "1:a:0"];
args.push("-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-shortest", "-movflags", "+faststart", output);

const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stderr);
  process.exit(r.status ?? 1);
}
console.log(`${output}: picture from the render, your voice straight from the take${hasScore ? ", music + sfx under it" : ""}`);
