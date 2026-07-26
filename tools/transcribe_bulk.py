"""
Booklesss — Bulk Whisper transcription script
Scans a folder (recursively) for video files and transcribes any that don't
already have a transcript.

Usage:
    python _dev/scripts/transcribe_bulk.py "courses/"
    python _dev/scripts/transcribe_bulk.py "courses/Strategic Management"
    python _dev/scripts/transcribe_bulk.py "_dev/transcribe-test"

Each transcript is saved alongside its video:
    courses/.../Lecture_1.mp4  →  courses/.../Lecture_1_transcript.md

Skips files that already have a transcript. Re-run safely at any time.
"""

import sys
import os
import whisper
from datetime import datetime

MODEL_SIZE = "small.en"
VIDEO_EXTENSIONS = {".mp4", ".mp3", ".mov", ".m4a", ".wav", ".mkv", ".avi"}


def format_timestamp(seconds):
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def find_videos(root):
    videos = []
    for dirpath, _, filenames in os.walk(root):
        for f in filenames:
            if os.path.splitext(f)[1].lower() in VIDEO_EXTENSIONS:
                videos.append(os.path.join(dirpath, f))
    return sorted(videos)


def transcribe_file(model, video_path):
    base = os.path.splitext(video_path)[0]
    out_path = base + "_transcript.md"

    if os.path.exists(out_path):
        print(f"  [skip] Already transcribed: {os.path.basename(video_path)}")
        return False

    filename = os.path.basename(video_path)
    print(f"  [go]   Transcribing: {filename}")
    result = model.transcribe(video_path, fp16=False)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Transcript — {filename}\n")
        f.write(f"**Model:** {MODEL_SIZE}  \n")
        f.write(f"**Transcribed:** {datetime.today().strftime('%Y-%m-%d')}  \n\n")
        f.write("---\n\n")
        for segment in result["segments"]:
            start = format_timestamp(segment["start"])
            f.write(f"**[{start}]** {segment['text'].strip()}\n\n")

    print(f"  [done] Saved: {out_path}")
    return True


def main():
    if len(sys.argv) < 2:
        print("Usage: python _dev/scripts/transcribe_bulk.py <folder>")
        sys.exit(1)

    root = sys.argv[1]
    if not os.path.isdir(root):
        print(f"Not a folder: {root}")
        sys.exit(1)

    videos = find_videos(root)
    if not videos:
        print(f"No video files found in: {root}")
        sys.exit(0)

    pending = [v for v in videos if not os.path.exists(os.path.splitext(v)[0] + "_transcript.md")]

    print(f"\nFound {len(videos)} video(s) — {len(pending)} need transcription, {len(videos) - len(pending)} already done.\n")

    if not pending:
        print("Nothing to do.")
        sys.exit(0)

    print(f"Loading {MODEL_SIZE} model...")
    model = whisper.load_model(MODEL_SIZE)
    print("Model ready.\n")

    done = 0
    for i, video in enumerate(pending, 1):
        print(f"[{i}/{len(pending)}] {video}")
        transcribe_file(model, video)
        done += 1
        print()

    print(f"Done. {done} transcript(s) created.")


if __name__ == "__main__":
    main()
