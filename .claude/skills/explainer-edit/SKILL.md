---
name: explainer-edit
description: Edit the owner's raw talking-head take into a finished 9:16 explainer — cut the silences, coughs, mistakes and repeats, plain-cut full-screen to pixel-art animation on the words, white subtitles below the face, music + sfx under an untouched voice. Use whenever the owner drops a raw video in the bucket and says "edit this", "edit the video", "make the explainer", "cut this take", or asks for changes to an explainer already made. Covers Demand/video (Remotion) end to end. Not for still carousels (daily-post) or course steps (step-skill).
---

# Explainer edit — the house method

Settled with the owner on the first real take (D885, the cognition explainer,
2026-10-09). Every rule below came from their reaction to a render; follow it
before improvising. Code and commands: `Demand/video/README.md`.

## The owner's rules (non-negotiable)

1. **The voice is never processed.** No EQ, compression, denoise, gain or
   loudness pass on their speech. Cutting it is the only edit; joins get a 4 ms
   fade so they don't click. `mux-audio.mjs` lays the take's own cut track on
   top at unity gain.
2. **Music + sound effects go UNDER the voice** — "not too loud". Bed ~24 dB
   under speech (`UP 0.13 / DOWN 0.06` in Explainer.tsx), soft whoosh on cuts,
   small pops/hits on animation cues.
3. **Camera ↔ animation is a plain cut.** No heat-map, glow, flash or push-in
   between them ("a normal flip to the animation and back"). Animation →
   animation may whip.
4. **Full screen only.** Never split-screen person/animation.
5. **Subtitles on camera beats: white, one fixed place, below the face.**
   Word by word as spoken, short phrases. No face tracking, no layouts around
   the head, no colour marks. Figures as figures (K100, 2%).
6. **No background removal**, ever.
7. **No shake.** No film weave, no push-ins, no flashes on camera beats — on
   the first take that WAS the shake the owner saw; the camera itself was
   steady (0.7 px). Don't stabilise by default: vidstab locked onto the
   speaker's gestures and added 11.5 px of sway. Measure first (tracked wall
   features, not phase correlation) and stabilise only real handheld footage
   (`recut … --stabilize`).
8. **Cut every cough, silence, false start, filler, slip — and every repeat.**
   Read the whole cut transcript before rendering: it must make sense start to
   finish and never say the same point twice.

## The pipeline

```bash
cd Demand/video
# 0. the take: it lands in "Booklesss Bucket" via OneDrive. If ls shows nothing
#    but PowerShell lists it, it's an online-only placeholder:
#      attrib +P -U "<file>"   (then wait until the OFFLINE attribute clears)
npm run footage -- transcribe <slug> "<raw>"     # verbatim, ums kept (~3 min / 5 min take)
python scripts/find-noises.py <slug> "<raw>"     # coughs etc. Whisper never transcribes
npm run footage -- propose <slug>                # auto cut -> out/<slug>/edit.md
#   READ edit.md and the joined text. Write out/<slug>/manual.json:
#   {"undrop": [...], "drop": [[from, to, "why"], ...]}  (raw-words indices)
#   Re-run propose until the text reads clean. Then:
npm run footage -- cut <slug> "<raw>"            # 4K HEVC is slow: ~35 min for 5 min
#   plan: out/<slug>/plan.json (anchors + scenes), then
python scripts/beats-from-cut.py <slug> out/<slug>/plan.json
#   register the slug in src/explainers/index.ts
npx remotion still ExplainerSheet out/<slug>/_qa.png --props=<marks json> --timeout=300000
npx remotion render Explainer-<slug> out/<slug>.raw.mp4 --props='{"slug":"<slug>","footage":"recordings/<slug>.mp4"}' --timeout=300000
npm run mux -- <slug>                            # -> out/<slug>.mp4 (voice + score)
```

**Re-edits that only remove more** (extra drops, a cough, tighter joins): don't
re-cut the 4K take. `npm run footage -- recut <slug> out/<slug>/edl-cut1.json`
trims the previous 1080p cut (minutes, not 35); `--stabilize` only for real
handheld footage.
Keep the previous EDL as `edl-cut1.json` before re-proposing.

## Judgement the tools can't make

- **Retake detection is a proposal.** It flagged "Because attention is like a
  spotlight" as a retake of "So attention is like a gatekeeper" — wrong; it was
  the answer to "Why?". Read every flagged retake.
- **Repeats are the owner's biggest complaint after coughs.** Typical: restating
  the list just given ("put this another way…"), saying a statistic twice,
  "X is the next step, X is like…". Keep the clearer, later one.
- **Coughs hide at word edges.** Whisper often ends a word a few hundredths into
  the cough after it; the propose step cuts at the cough's onset for that reason.
  After proposing, check `noises.json` against the kept pieces — zero
  uncovered noises should remain inside them.
- **Beats:** open on camera; every concept gets its own full-screen animation
  cued to the words that name it; come back to camera between concepts. Give a
  long stretch of speech enough cues (cards every ~3 s) or the picture freezes.
- **Background:** a light wall behind the owner → set `"tone": "light"` in the
  plan (affects scene type colours only now that subtitles are always white).

## Before handing over

1. QA stills of camera beats and every scene (`ExplainerSheet` with `marks`).
2. After the render: 1 fps contact sheet of the whole video; check every cue.
3. Voice loudness of `out/<slug>.mp4` ≈ the cut track (it should only differ by
   the music sum, not by processing).
4. Send a <30 MB preview (540×960, two-pass, `-c:a copy`) — the upload limit.
