"""Raw take -> clean cut, ready to animate over.

    python scripts/footage.py transcribe <slug> <raw video>
    python scripts/footage.py propose    <slug>
    (review out/<slug>/edit.md, adjust out/<slug>/edl.json by hand)
    python scripts/footage.py cut        <slug> <raw video>
    python scripts/footage.py faces      <slug>

transcribe  verbatim word timings — fillers and false starts KEPT, because those
            are what the edit has to find. -> out/<slug>/raw-words.json
propose     an edit decision list: drop silences, filler words and retakes,
            keep what flows. -> out/<slug>/edl.json + out/<slug>/edit.md
            This is a PROPOSAL. Retakes are a judgement call; read edit.md.
cut         apply the EDL: 9:16, 1080x1920, 30 fps CFR.
            -> public/recordings/<slug>.mp4          (picture + audio, for Remotion)
            -> public/recordings/<slug>.audio.wav    (the same cuts, PCM, for the final mux)
            -> src/explainers/<slug>/words.json      (word timings remapped onto the cut)
faces       track where the face is in every frame (YuNet, detection only —
            nothing is cut out), so subtitles are set AROUND the head.
            -> public/recordings/<slug>.faces.json

The sound: nothing is added, levelled, denoised or mixed (owner, 2026-10-09:
"don't do anything to the sound at all"). The only thing done to it is cutting
it where the picture is cut, with a 4 ms fade at each join — without that every
join clicks, and a click is a change to the sound too.
"""
import json
import os
import re
import subprocess
import sys
from difflib import SequenceMatcher

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
W, H = 1080, 1920
SR = 16000

FILLERS = {"um", "umm", "uh", "uhh", "erm", "er", "ah", "hmm", "mm", "eh"}


def odir(slug):
    d = os.path.join(ROOT, "out", slug)
    os.makedirs(d, exist_ok=True)
    return d


def norm(s):
    return re.sub(r"[^a-z0-9']", "", s.lower())


def load_pcm(media):
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", media, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    return np.frombuffer(pcm, dtype=np.float32)


def silence_mask(audio):
    """10 ms frames, True where it's quiet relative to this recording."""
    hop = SR // 100
    n = len(audio) // hop
    rms = np.sqrt(np.mean(audio[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    return db < max(-50.0, np.percentile(db, 95) - 32)


# ---------------------------------------------------------------- transcribe
def transcribe(slug, media, model_name="small.en"):
    from faster_whisper import WhisperModel

    audio = load_pcm(media)
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    # A disfluent prompt is the known trick for keeping disfluencies: Whisper
    # imitates the style of its prompt, and by default it tidies ums away.
    segs, info = model.transcribe(
        audio,
        language="en",
        word_timestamps=True,
        initial_prompt="Umm, so, uh, let me— let me start again. Okay, so, um, the thing is, like, hmm.",
        vad_filter=False,
        condition_on_previous_text=False,
    )
    words = []
    for s in segs:
        for w in s.words or []:
            t = w.word.strip()
            if t:
                words.append({"word": t, "start": round(w.start, 3), "end": round(w.end, 3), "p": round(w.probability, 3)})

    # same fix as words-from-footage.py: Whisper stamps post-pause words early
    quiet = silence_mask(audio)
    n = len(quiet)
    for w in words:
        i = int(w["start"] * 100)
        if 0 <= i < n and quiet[i]:
            j = i
            while j < n and quiet[j] and j - i < 100:
                j += 1
            if j < n and j / 100 < w["end"] + 0.3:
                w["start"] = round(j / 100, 3)
                w["end"] = max(w["end"], w["start"] + 0.08)

    path = os.path.join(odir(slug), "raw-words.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"duration": info.duration, "media": os.path.abspath(media), "words": words}, f, indent=1)
    print(f"{len(words)} words over {info.duration:.1f}s -> {os.path.relpath(path, ROOT)}")


# ---------------------------------------------------------------- propose
def utterances(words, gap=0.55):
    """Runs of speech split at pauses or sentence ends — the unit a retake replaces."""
    out, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        nxt = words[i + 1] if i + 1 < len(words) else None
        if nxt is None or nxt["start"] - w["end"] > gap or re.search(r"[.?!]$", w["word"]):
            out.append(cur)
            cur = []
    return out


def propose(slug, pad_before=0.10, pad_after=0.16, max_gap=0.30):
    raw = json.load(open(os.path.join(odir(slug), "raw-words.json"), encoding="utf-8"))
    words = raw["words"]
    drop = {}  # word index -> reason

    # 1. filler words standing on their own
    for i, w in enumerate(words):
        if norm(w["word"]) in FILLERS:
            drop[i] = "filler"

    # 2. stutters: the same word twice in a row ("the the", "I— I")
    for i in range(len(words) - 1):
        if norm(words[i]["word"]) and norm(words[i]["word"]) == norm(words[i + 1]["word"]) and words[i + 1]["start"] - words[i]["end"] < 0.6:
            drop.setdefault(i, "stutter")

    # 3. retakes: an utterance whose opening is said again soon after — keep the
    #    LATER one (people restart because the first try went wrong)
    utts = utterances(words)
    toks = [[norm(words[i]["word"]) for i in u if i not in drop] for u in utts]
    for a in range(len(utts)):
        if not toks[a]:
            continue
        for b in range(a + 1, min(a + 4, len(utts))):
            if not toks[b] or words[utts[b][0]]["start"] - words[utts[a][-1]]["end"] > 25:
                continue
            k = min(len(toks[a]), len(toks[b]), 6)
            head = SequenceMatcher(None, toks[a][:k], toks[b][:k]).ratio()
            whole = SequenceMatcher(None, toks[a], toks[b][: len(toks[a]) + 2]).ratio()
            if k >= 2 and (head >= 0.67 or whole >= 0.6):
                for i in utts[a]:
                    drop[i] = "retake"
                break

    # 4. the editor's calls, which win over the automatic pass:
    #    out/<slug>/manual.json  {"undrop": [i, ...], "drop": [[from, to, "why"], ...]}
    #    (word indices from raw-words.json, inclusive). Kept as a file so the
    #    judgement is recorded and the cut can be re-made from scratch.
    mpath = os.path.join(odir(slug), "manual.json")
    if os.path.exists(mpath):
        man = json.load(open(mpath, encoding="utf-8"))
        for a, b, *why in man.get("drop", []):
            for i in range(a, b + 1):
                drop[i] = why[0] if why else "edit"
        for i in man.get("undrop", []):
            drop.pop(i, None)

    # 5. keep ranges: kept words, padded, with pauses squeezed to max_gap.
    #    Noise-aware: a cough or clear between two kept words (found by
    #    scripts/find-noises.py — Whisper never transcribes them) is never
    #    bridged and never caught in a pad. The owner's first cut kept a cough
    #    between "cognition," and "your ability", inside a 0.28 s gap that the
    #    old rule merged without looking.
    npath = os.path.join(odir(slug), "noises.json")
    noises = []
    if os.path.exists(npath):
        noises = [(n["start"], n["end"]) for n in json.load(open(npath, encoding="utf-8")) if n.get("uncovered")]

    def noise_in(a, b):
        return [(s, e) for s, e in noises if s < b and e > a]

    kept = [w for i, w in enumerate(words) if i not in drop]
    keep = []  # [start, end, first_word_start, last_word_end]
    prev_end = None
    for w in kept:
        s, e = max(0.0, w["start"] - pad_before), w["end"] + pad_after
        between = noise_in(prev_end, w["start"]) if prev_end is not None else []
        if between:
            s = max(s, max(n[1] for n in between) + 0.02)
        # never let the trailing pad reach into a noise after this word
        # (including one that starts just INSIDE the word: Whisper often ends a
        # word a few hundredths into the cough that follows it)
        ahead = [n for n in noises if n[1] > w["end"] and n[0] < e]
        if ahead:
            # cut at the noise's onset, even if that trims the last few
            # hundredths of the word's decay: a click of cough is worse
            e = max(w["start"] + 0.1, min(n[0] for n in ahead) - 0.01)
        if keep and s - keep[-1][1] <= max_gap and not between:
            keep[-1][1] = max(keep[-1][1], e)
            keep[-1][3] = w["end"]
        else:
            if keep and between:
                keep[-1][1] = min(keep[-1][1], max(keep[-1][3] + 0.02, min(n[0] for n in between) - 0.02))
            keep.append([s, e, w["start"], w["end"]])
        prev_end = w["end"]

    # snap every cut point to the quietest 10 ms nearby (never into a word),
    # so a join lands in a breath-gap rather than on the tail of a syllable
    media_audio = raw.get("media")
    if media_audio and os.path.exists(media_audio):
        a = load_pcm(media_audio)
        hop = SR // 100
        nfr = len(a) // hop
        rms = np.sqrt(np.mean(a[: nfr * hop].reshape(nfr, hop) ** 2, axis=1) + 1e-12)

        def quiet(t, lo, hi):
            i0, i1 = max(0, int(lo * 100)), min(nfr - 1, int(hi * 100))
            if i1 <= i0:
                return t
            return (i0 + int(np.argmin(rms[i0 : i1 + 1]))) / 100

        # inward only: a cut may move INTO its own pad, never out past it —
        # outward is where the coughs and breaths the pad was clamped against are
        for r in keep:
            r[0] = quiet(r[0], r[0], min(r[0] + 0.06, r[2] - 0.02))
            r[1] = quiet(r[1], min(r[1], max(r[1] - 0.06, r[3] + 0.01)), r[1])
    keep = [[round(s, 3), round(e, 3)] for s, e, _, _ in keep]

    edl = {"keep": keep, "dropped": sorted(({"i": i, "word": words[i]["word"], "at": words[i]["start"], "why": r} for i, r in drop.items()), key=lambda d: d["i"])}
    d = odir(slug)
    json.dump(edl, open(os.path.join(d, "edl.json"), "w", encoding="utf-8"), indent=1)

    # human-readable sheet: the whole take, struck-through where it's cut
    lines = [f"# Edit proposal — {slug}", "", f"Raw {raw['duration']:.1f}s -> cut {sum(e - s for s, e in keep):.1f}s, {len(keep)} pieces.", ""]
    for u in utts:
        t0 = words[u[0]]["start"]
        parts = []
        for i in u:
            w = words[i]["word"]
            parts.append(f"~~{w}~~" if i in drop else w)
        why = {drop[i] for i in u if i in drop}
        lines.append(f"- `{t0:6.2f}s` " + " ".join(parts) + (f"  _({', '.join(sorted(why))})_" if why else ""))
    open(os.path.join(d, "edit.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(drop)} words cut ({', '.join(f'{v} {k}' for k, v in sorted(_count(drop).items()))}); {len(keep)} pieces kept -> out/{slug}/edit.md")


def _count(drop):
    c = {}
    for r in drop.values():
        c[r] = c.get(r, 0) + 1
    return c


# ---------------------------------------------------------------- cut
def probe(media):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:stream_side_data=rotation", "-of", "json", media],
        capture_output=True,
        text=True,
    ).stdout
    s = json.loads(out)["streams"][0]
    w, h = s["width"], s["height"]
    rot = 0
    for sd in s.get("side_data_list", []) or []:
        rot = int(sd.get("rotation", 0) or 0)
    if abs(rot) == 90:
        w, h = h, w
    return w, h


def cut(slug, media):
    d = odir(slug)
    edl = json.load(open(os.path.join(d, "edl.json"), encoding="utf-8"))
    keep = edl["keep"]
    w, h = probe(media)
    if w > h:
        print("warning: landscape source — centre-cropping to 9:16", file=sys.stderr)
    # cover-fit to 1080x1920, then constant 30 fps so frame N of the cut is
    # frame N of the composition (and of the matte)
    conform = f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},fps={FPS},setsar=1"
    F = 0.004  # the 4 ms join fade — see the module docstring
    vf, af, cat = [], [], ""
    for k, (s, e) in enumerate(keep):
        vf.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[v{k}]")
        af.append(
            f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,afade=t=in:d={F},afade=t=out:st={max(0, e - s - F):.4f}:d={F}[a{k}]"
        )
        cat += f"[v{k}][a{k}]"
    graph = ";".join(vf + af) + f";{cat}concat=n={len(keep)}:v=1:a=1[vc][ac];[vc]{conform}[vo];[ac]asplit=2[ac1][ac2]"
    rec = os.path.join(ROOT, "public", "recordings")
    os.makedirs(rec, exist_ok=True)
    gfile = os.path.join(d, "cut.filter")
    open(gfile, "w").write(graph)
    mp4 = os.path.join(rec, f"{slug}.mp4")
    wav = os.path.join(rec, f"{slug}.audio.wav")
    subprocess.run(
        # "-/filter_complex FILE" reads the graph from a file: ffmpeg 7+ syntax
        # (-filter_complex_script is gone in 9). A long take has hundreds of
        # pieces, too long for a Windows command line.
        ["ffmpeg", "-v", "error", "-y", "-i", media, "-/filter_complex", gfile, "-map", "[vo]", "-map", "[ac1]",
         "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "320k", mp4,
         "-map", "[ac2]", "-c:a", "pcm_s24le", wav],
        check=True,
    )

    # remap the kept words onto the cut's timeline -> the explainer's words.json
    raw = json.load(open(os.path.join(d, "raw-words.json"), encoding="utf-8"))
    dropped = {x["i"] for x in edl["dropped"]}
    offs, acc = [], 0.0
    for s, e in keep:
        offs.append((s, e, acc))
        acc += e - s
    words = []
    for i, w in enumerate(raw["words"]):
        if i in dropped:
            continue
        for s, e, a in offs:
            if s <= w["start"] < e:
                words.append({"word": w["word"], "start": round(w["start"] - s + a, 3), "end": round(min(w["end"], e) - s + a, 3)})
                break
    xdir = os.path.join(ROOT, "src", "explainers", slug)
    os.makedirs(xdir, exist_ok=True)
    json.dump(words, open(os.path.join(xdir, "words.json"), "w", encoding="utf-8"), indent=1)
    print(f"cut {acc:.1f}s -> public/recordings/{slug}.mp4 (+ .audio.wav), {len(words)} words -> src/explainers/{slug}/words.json")


# ---------------------------------------------------------------- recut
def recut(slug, old_edl_path, stabilize=False):
    """Re-make the cut from the PREVIOUS cut instead of the raw take.

    Decoding a phone's 4K HEVC is the slow part of `cut` (35 min for 5 min of
    take). When a new edit only removes more — every new piece lies inside a
    piece of the old cut, which is true when the changes are extra drops and
    tighter joins — the old 1080p cut already holds every frame needed. Raw
    times are mapped onto the old cut's timeline and trimmed from it.

    stabilize: two-pass vidstab — OFF by default, and measure before turning it
    on. On the first take the "shake" the owner saw was the edit's own effects
    (film weave, push-ins, heat flashes), not the camera: tracked features on
    the wall wobbled 0.7 px. vidstab then locked onto the speaker's gestures
    and ADDED up to 11.5 px of sideways sway. Only for genuinely handheld
    footage; check wall features after, not phase correlation (a smooth wall
    gradient biases phaseCorrelate into a phantom 2 px/frame drift)."""
    d = odir(slug)
    rec = os.path.join(ROOT, "public", "recordings")
    old = json.load(open(old_edl_path, encoding="utf-8"))["keep"]
    new = json.load(open(os.path.join(d, "edl.json"), encoding="utf-8"))["keep"]
    src_v = os.path.join(rec, f"{slug}.cut1.mp4")
    src_a = os.path.join(rec, f"{slug}.cut1.audio.wav")
    if not os.path.exists(src_v):
        os.replace(os.path.join(rec, f"{slug}.mp4"), src_v)
        os.replace(os.path.join(rec, f"{slug}.audio.wav"), src_a)

    offs, acc = [], 0.0
    for s, e in old:
        offs.append((s, e, acc))
        acc += e - s

    def to_old(t):
        for s, e, a in offs:
            if s - 0.02 <= t <= e + 0.02:  # the 10 ms snapping grid can land a hair outside
                return a + min(max(t, s), e) - s
        sys.exit(f"raw time {t:.3f} is outside the old cut — this edit can't be made from it; use `cut` on the raw take")

    pieces = [(to_old(s), to_old(e)) for s, e in new]
    F = 0.004
    vf, af, cat = [], [], ""
    for k, (s, e) in enumerate(pieces):
        vf.append(f"[0:v]trim=start={s:.4f}:end={e:.4f},setpts=PTS-STARTPTS[v{k}]")
        af.append(f"[1:a]atrim=start={s:.4f}:end={e:.4f},asetpts=PTS-STARTPTS,afade=t=in:d={F},afade=t=out:st={max(0, e - s - F):.4f}:d={F}[a{k}]")
        cat += f"[v{k}][a{k}]"
    graph = ";".join(vf + af) + f";{cat}concat=n={len(pieces)}:v=1:a=1[vc][ac];[vc]fps={FPS},setsar=1[vo];[ac]asplit=2[ac1][ac2]"
    gfile = os.path.join(d, "recut.filter")
    open(gfile, "w").write(graph)
    tmp = os.path.join(d, "recut-tmp.mp4")
    mp4 = os.path.join(rec, f"{slug}.mp4")
    wav = os.path.join(rec, f"{slug}.audio.wav")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", src_v, "-i", src_a, "-/filter_complex", gfile,
         "-map", "[vo]", "-map", "[ac1]", "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "320k", tmp,
         "-map", "[ac2]", "-c:a", "pcm_s24le", wav],
        check=True,
    )
    if stabilize:
        trf = os.path.join(d, "stab.trf").replace("\\", "/").replace(":", "\\:")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-vf", f"vidstabdetect=shakiness=5:accuracy=15:result='{trf}'", "-f", "null", "-"], check=True)
        vf2 = f"vidstabtransform=input='{trf}':smoothing=30:zoom=4:optzoom=0:interpol=bicubic,unsharp=5:5:0.4:5:5:0"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-vf", vf2, "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", mp4], check=True)
        os.remove(tmp)
    else:
        os.replace(tmp, mp4)

    # words onto the new cut's timeline
    raw = json.load(open(os.path.join(d, "raw-words.json"), encoding="utf-8"))
    dropped = {x["i"] for x in json.load(open(os.path.join(d, "edl.json"), encoding="utf-8"))["dropped"]}
    noffs, nacc = [], 0.0
    for s, e in new:
        noffs.append((s, e, nacc))
        nacc += e - s
    words = []
    for i, w in enumerate(raw["words"]):
        if i in dropped:
            continue
        for s, e, a in noffs:
            if s - 0.02 <= w["start"] < e:
                words.append({"word": w["word"], "start": round(max(w["start"], s) - s + a, 3), "end": round(min(w["end"], e) - s + a, 3)})
                break
    xdir = os.path.join(ROOT, "src", "explainers", slug)
    json.dump(words, open(os.path.join(xdir, "words.json"), "w", encoding="utf-8"), indent=1)
    print(f"recut {nacc:.1f}s from the old cut{' + stabilised' if stabilize else ''} -> public/recordings/{slug}.mp4, {len(words)} words")


# ---------------------------------------------------------------- faces
YUNET = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"


def faces(slug, every=3):
    """Where the face is, frame by frame — so the subtitles can be set in the
    space AROUND the head instead of across it. Detection only: nothing is cut
    out of the picture (owner, 2026-10-09: no background removal).
    -> public/recordings/<slug>.faces.json  {"fps", "boxes": [[x, y, w, h], ...]}
    one box per frame of the cut, in 1080x1920 coordinates."""
    import cv2

    model = os.path.join(ROOT, "models", "face_yunet.onnx")
    if not os.path.exists(model):
        os.makedirs(os.path.dirname(model), exist_ok=True)
        subprocess.run(["curl", "-sfL", YUNET, "-o", model], check=True)
    src = os.path.join(ROOT, "public", "recordings", f"{slug}.mp4")
    cap = cv2.VideoCapture(src)
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    SW, SH = 360, 640  # detect on a small copy: fast, and plenty for a head
    det = cv2.FaceDetectorYN.create(model, "", (SW, SH), 0.7)
    raw = {}
    k = 0
    while True:
        ok, bgr = cap.read()
        if not ok:
            break
        if k % every == 0:
            _, found = det.detect(cv2.resize(bgr, (SW, SH)))
            if found is not None and len(found):
                x, y, w, h = max(found, key=lambda f: f[2] * f[3])[:4]  # the biggest face is the speaker
                sx = W / SW
                raw[k] = [x * sx, y * sx, w * sx, h * sx]
        k += 1
    n = k
    if not raw:
        print("warning: no face found — subtitles fall back to the default head position", file=sys.stderr)
        boxes = [[W * 0.3, H * 0.28, W * 0.4, H * 0.3]] * n
    else:
        keys = sorted(raw)
        arr = np.array([raw[i] for i in keys])
        # fill every frame by interpolation, then smooth: the layout should
        # follow a head that moves, not shiver with the detector
        boxes = np.stack([np.interp(np.arange(n), keys, arr[:, c]) for c in range(4)], 1)
        kern = np.ones(15) / 15
        pad = np.pad(boxes, ((7, 7), (0, 0)), mode="edge")
        boxes = np.stack([np.convolve(pad[:, c], kern, mode="valid") for c in range(4)], 1)
        boxes = [[round(float(v), 1) for v in b] for b in boxes]
    out = os.path.join(ROOT, "public", "recordings", f"{slug}.faces.json")
    json.dump({"fps": FPS, "boxes": boxes}, open(out, "w"))
    print(f"face tracked in {len(raw)}/{(n + every - 1) // every} sampled frames -> public/recordings/{slug}.faces.json")


if __name__ == "__main__":
    cmd, slug = sys.argv[1], sys.argv[2]
    if cmd == "transcribe":
        transcribe(slug, sys.argv[3], *(sys.argv[4:5]))
    elif cmd == "propose":
        propose(slug)
    elif cmd == "cut":
        cut(slug, sys.argv[3])
    elif cmd == "faces":
        faces(slug)
    elif cmd == "recut":
        recut(slug, sys.argv[3], stabilize="--stabilize" in sys.argv)
    else:
        sys.exit(__doc__)
