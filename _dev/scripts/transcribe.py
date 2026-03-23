"""
Booklesss — Whisper transcription script
Usage: python3 _dev/scripts/transcribe.py "path/to/video.mp4"

Saves transcript as a .md file alongside the video.
Skips files that have already been transcribed.
"""
import sys
import os
import whisper
from datetime import datetime

MODEL_SIZE = "small.en"  # best balance for English lectures

def format_timestamp(seconds):
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def transcribe(video_path):
    if not os.path.exists(video_path):
        print(f"File not found: {video_path}")
        sys.exit(1)

    base = os.path.splitext(video_path)[0]
    out_path = base + "_transcript.md"

    if os.path.exists(out_path):
        print(f"Already transcribed: {out_path}")
        return

    filename = os.path.basename(video_path)
    print(f"Loading {MODEL_SIZE} model...")
    model = whisper.load_model(MODEL_SIZE)

    print(f"Transcribing: {filename}")
    print("This will take a few minutes...")
    result = model.transcribe(video_path, fp16=False)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Transcript — {filename}\n")
        f.write(f"**Model:** {MODEL_SIZE}  \n")
        f.write(f"**Transcribed:** {datetime.today().strftime('%Y-%m-%d')}  \n\n")
        f.write("---\n\n")
        for segment in result["segments"]:
            start = format_timestamp(segment["start"])
            f.write(f"**[{start}]** {segment['text'].strip()}\n\n")

    print(f"Saved: {out_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 _dev/scripts/transcribe.py path/to/video.mp4")
        sys.exit(1)
    transcribe(sys.argv[1])
