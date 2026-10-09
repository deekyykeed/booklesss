"""Word timings from a real recording — the step that replaces the TTS voice.

    python scripts/words-from-footage.py present-value public/recordings/present-value.mp4

Transcribes the take with faster-whisper (word timestamps on) and writes
src/explainers/<slug>/words.json in the same [{word,start,end}] shape that
scripts/voice-placeholder.ps1 writes. Nothing else changes: re-render with
`footage` set and the whole edit re-times itself to your voice.

The script's own words are passed as the initial prompt, so Whisper spells
kwacha, NPV and the like the way script.json does, which keeps the alignment
exact instead of interpolated. Numbers are still written however Whisper likes
("10%"); align.ts places those by interpolation, a frame or two either way.

Model: small.en on CPU (int8), ~2-3x realtime on this machine. Pass
--model base.en for speed or medium.en for a hard-to-hear take.
"""
import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("media", help="the recording (video or audio)")
    ap.add_argument("--model", default="small.en")
    ap.add_argument("--out", help="override the output path")
    a = ap.parse_args()

    from faster_whisper import WhisperModel

    script_path = os.path.join(ROOT, "src", "explainers", a.slug, "script.json")
    with open(script_path, encoding="utf-8") as f:
        script = json.load(f)
    prompt = " ".join(b["say"] for b in script["beats"])

    # Decode with ffmpeg rather than letting faster-whisper do it: its PyAV
    # path breaks on this machine's PyAV ("unexpected keyword argument
    # 'metadata_errors'"), and ffmpeg reads any container a phone produces.
    import subprocess
    import numpy as np

    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", a.media, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)

    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        audio,
        language="en",
        word_timestamps=True,
        initial_prompt=prompt[:800],  # Whisper reads only the tail of a long prompt
        vad_filter=True,
    )
    words = []
    for seg in segments:
        for w in seg.words or []:
            text = w.word.strip()
            if text:
                words.append({"word": text, "start": round(w.start, 3), "end": round(w.end, 3)})

    # Whisper stamps a word that follows a pause EARLY — into the silence
    # before it — by up to 0.7s (measured 2026-10-09 against the TTS track,
    # whose phrase starts sit within 0.05s of the real onsets). Those are
    # exactly the words a cut lands on. So: wherever a word's start falls in
    # silence, slide it forward to where sound actually begins.
    HOP = 160  # 10 ms at 16 kHz
    n = len(audio) // HOP
    rms = np.sqrt(np.mean(audio[: n * HOP].reshape(n, HOP) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    silent = db < max(-45.0, np.percentile(db, 95) - 35)
    snapped = 0
    for w in words:
        i = int(w["start"] * 100)
        if 0 <= i < n and silent[i]:
            j = i
            while j < n and silent[j] and j - i < 100:
                j += 1
            new = round(j / 100, 3)
            if j < n and not silent[j] and new < w["end"] + 0.3:
                w["start"] = new
                w["end"] = max(w["end"], new + 0.1)
                snapped += 1
    if snapped:
        print(f"snapped {snapped} word starts out of silence onto the voice")

    out = a.out or os.path.join(ROOT, "src", "explainers", a.slug, "words.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2)

    said = sum(len(b["say"].split()) for b in script["beats"])
    print(f"{len(words)} words transcribed ({said} in the script), {info.duration:.1f}s -> {os.path.relpath(out, ROOT)}")
    if abs(len(words) - said) > said * 0.15:
        print("warning: transcript and script differ by more than 15% — check the take follows the script", file=sys.stderr)


if __name__ == "__main__":
    main()
