"""Split a cut transcript into beats -> src/explainers/<slug>/script.json.

    python scripts/beats-from-cut.py <slug> <plan.json>

For real footage the words already exist — you said them — so a script isn't
written, it's CUT: the plan lists where each beat starts (the first few words
of it, as said) and what fills the screen, and this fills in each beat's `say`
from the cut transcript so alignment is exact.

plan.json: {"title": "...", "tail": 1.0, "beats": [
  {"from": "so let's talk about", "show": "you"},
  {"from": "cognition your ability", "show": "anim", "in": "thermal", "scene": "trio", ...}, ...]}

Anchors are matched in order, on words with punctuation stripped, so they only
have to be unique from the previous anchor onwards.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
norm = lambda s: re.sub(r"[^a-z0-9%]", "", s.lower())


def main(slug, plan_path):
    d = os.path.join(ROOT, "out", slug)
    raw = json.load(open(os.path.join(d, "raw-words.json"), encoding="utf-8"))["words"]
    edl = json.load(open(os.path.join(d, "edl.json"), encoding="utf-8"))
    dropped = {x["i"] for x in edl["dropped"]}
    words = [w["word"] for i, w in enumerate(raw) if i not in dropped]
    nw = [norm(w) for w in words]

    plan = json.load(open(plan_path, encoding="utf-8"))
    starts = []
    pos = 0
    for b in plan["beats"]:
        anchor = [norm(x) for x in b["from"].split()]
        for i in range(pos, len(nw)):
            if nw[i : i + len(anchor)] == anchor:
                starts.append(i)
                pos = i + 1
                break
        else:
            sys.exit(f"anchor not found after word {pos}: {b['from']!r}")
    starts.append(len(words))

    beats = []
    for k, b in enumerate(plan["beats"]):
        beat = {key: v for key, v in b.items() if key != "from"}
        beat["say"] = " ".join(words[starts[k] : starts[k + 1]])
        beats.append(beat)
    out = {"slug": slug, "title": plan.get("title", slug), "tail": plan.get("tail", 1.0), "tone": plan.get("tone", "dark"), "beats": beats}
    xdir = os.path.join(ROOT, "src", "explainers", slug)
    os.makedirs(xdir, exist_ok=True)
    json.dump(out, open(os.path.join(xdir, "script.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    for b in beats:
        n = len(b["say"].split())
        print(f"{b['show']:4} {b.get('scene', ''):9} {n:3}w  {b['say'][:70]}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
