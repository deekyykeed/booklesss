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
        json.dump({"duration": info.duration, "words": words}, f, indent=1)
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

    # 4. keep ranges: kept words, padded, with pauses squeezed to max_gap
    kept = [w for i, w in enumerate(words) if i not in drop]
    keep = []
    for w in kept:
        s, e = max(0.0, w["start"] - pad_before), w["end"] + pad_after
        if keep and s - keep[-1][1] <= max_gap:
            keep[-1][1] = max(keep[-1][1], e)
        else:
            keep.append([s, e])
    keep = [[round(s, 3), round(e, 3)] for s, e in keep]

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
    else:
        sys.exit(__doc__)
