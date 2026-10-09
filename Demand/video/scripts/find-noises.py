"""Find coughs, throat-clears and other non-speech bursts in a take.

    python scripts/find-noises.py <slug>

Whisper writes words, not coughs, so a transcript-driven cut can't see them:
a cough between two kept words stays in. This listens to the RAW take instead:
anything loud that no transcribed word covers, plus anything inside a word's
span that is noise-like (spectrally flat, the signature of a cough or a clear
rather than a voiced syllable), is listed with its time and the words around it.
-> out/<slug>/noises.json
"""
import json
import os
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 16000
HOP = 160  # 10 ms


def main(slug, media):
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", media, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    a = np.frombuffer(pcm, dtype=np.float32)
    n = len(a) // HOP
    frames = a[: n * HOP].reshape(n, HOP)
    rms = np.sqrt(np.mean(frames**2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    # spectral flatness per 32 ms window: ~0 for a voiced tone, toward 1 for noise
    W = 512
    flat = np.zeros(n)
    win = np.hanning(W)
    for i in range(n):
        s = i * HOP
        seg = a[s : s + W]
        if len(seg) < W:
            break
        mag = np.abs(np.fft.rfft(seg * win))[4:200] + 1e-9  # 125 Hz .. 6 kHz
        flat[i] = np.exp(np.mean(np.log(mag))) / np.mean(mag)

    words = json.load(open(os.path.join(ROOT, "out", slug, "raw-words.json"), encoding="utf-8"))["words"]
    speech_db = np.percentile(db[db > np.percentile(db, 40)], 60)
    loud = db > speech_db - 9

    covered = np.zeros(n, bool)
    for w in words:
        covered[int(w["start"] * 100) : int(w["end"] * 100) + 1] = True

    out = []
    i = 0
    while i < n:
        noisy = loud[i] and (not covered[i] or flat[i] > 0.32)
        if not noisy:
            i += 1
            continue
        j = i
        while j < n and loud[j] and (not covered[j] or flat[j] > 0.28):
            j += 1
        dur = (j - i) / 100
        if dur >= 0.12:
            t0, t1 = i / 100, j / 100
            before = [w["word"] for w in words if w["end"] <= t0 + 0.05][-4:]
            after = [w["word"] for w in words if w["start"] >= t1 - 0.05][:4]
            peak = float(db[i:j].max() - speech_db)
            fl = float(np.median(flat[i:j]))
            out.append({"start": round(t0, 2), "end": round(t1, 2), "dur": round(dur, 2), "flatness": round(fl, 2), "peak_vs_speech_db": round(peak, 1),
                        "uncovered": bool((~covered[i:j]).mean() > 0.5), "context": " ".join(before) + "  [?]  " + " ".join(after)})
        i = j
    json.dump(out, open(os.path.join(ROOT, "out", slug, "noises.json"), "w", encoding="utf-8"), indent=1)
    for o in out:
        print(f"{o['start']:7.2f}-{o['end']:7.2f}s {o['dur']:4.2f}s flat {o['flatness']:.2f} {'GAP ' if o['uncovered'] else 'WORD'} {o['peak_vs_speech_db']:+5.1f}dB  {o['context']}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
