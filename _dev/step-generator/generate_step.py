#!/usr/bin/env python3
"""Booklesss step generator — builds login-gated web steps from content files.

Usage:
    python3 _dev/step-generator/generate_step.py <path/to/content_*.py>
    python3 _dev/step-generator/generate_step.py --all
    python3 _dev/step-generator/generate_step.py --check <path/to/content_*.py>

Content files live next to the PDF build scripts:
    Schools/<School>/<Course>/<lesson>/sources/content_<slug>.py
Each defines a STEP dict (see README.md for the schema).

Output: platform/public/steps/<slug>.html + refreshed manifest.json.
The design lives in template.html — change it once, run --all, every
step is rebuilt.
"""

import importlib.util
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent  # Booklesss repo root
TEMPLATE = HERE / "template.html"
OUT_DIR = ROOT / "platform" / "public" / "steps"
MANIFEST = OUT_DIR / "manifest.json"

sys.path.insert(0, str(HERE))
import blocks  # noqa: E402


def load_step(content_path):
    spec = importlib.util.spec_from_file_location("step_content", content_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    step = mod.STEP
    assert re.fullmatch(r"[a-z0-9-]{1,64}", step["slug"]), f"bad slug: {step['slug']}"
    return step


def js_object(value):
    """Dict → JS object literal; raw strings pass through untouched."""
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False, indent=2)


def render(step):
    tpl = TEMPLATE.read_text(encoding="utf-8")
    sources = step.get("sources", {})

    if "raw_sections" in step:
        sections_html = step["raw_sections"]
    else:
        parts = [blocks.build_section(s, sources) for s in step["sections"]]
        parts.append(blocks.build_outcomes(step["outcomes"]))
        if step.get("sources_list"):
            parts.append(blocks.build_sources_section(step["sources_list"], sources))
        sections_html = "\n\n".join(parts)

    meta = step["meta"]
    meta_items = (
        f'      <span><svg class="ic" aria-hidden="true"><use href="#ic-clock"/></svg>~{meta["minutes"]} min</span>\n'
        f'      <span><svg class="ic" aria-hidden="true"><use href="#ic-doc"/></svg>{meta["sections"]} sections</span>\n'
        f'      <span><svg class="ic" aria-hidden="true"><use href="#ic-calc"/></svg>{meta["examples"]} worked example{"s" if meta["examples"] != 1 else ""}</span>\n'
        '      <span><svg class="ic" aria-hidden="true"><use href="#ic-cursor"/></svg>Tap to define</span>'
    )

    if step.get("voice_agent_id"):
        # Real ElevenLabs Agents widget once a public agent id is supplied.
        voice = (
            "\n<!-- Booklesss voice tutor (ElevenLabs Agents) -->\n"
            f'<elevenlabs-convai agent-id="{step["voice_agent_id"]}" '
            f'dynamic-variables=\'{{"step_slug": "{step["slug"]}", "step_title": "{step["page_title"]}"}}\'>'
            "</elevenlabs-convai>\n"
            '<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>\n'
        )
    else:
        # Placeholder orb (idle/active demo) until a real agent is wired.
        voice = "\n" + (HERE / "voice_placeholder.html").read_text(encoding="utf-8")

    out = tpl
    replacements = {
        "{{PAGE_TITLE}}": step["page_title"],
        "{{COURSE_CHIP}}": step["course_chip"],
        "{{EYEBROW}}": step["eyebrow"],
        "{{TITLE_HTML}}": step["title_html"],
        "{{STANDFIRST}}": step["standfirst_html"],
        "{{META_ITEMS}}": meta_items,
        "{{CONTENT_SECTIONS}}": sections_html,
        "{{CLOSER_HTML}}": step["closer_html"],
        "{{NEXT_LINE}}": step["next_line"],
        "{{BRAND_JSON}}": js_object(step["brand"]),
        "{{GLOSSARY_JSON}}": js_object(step["glossary"]),
        "{{STEP_SLUG}}": step["slug"],
        "{{CALCULATOR_JS}}": step.get("calculator_js", ""),
        "{{VOICE_AGENT}}": voice,
    }
    for key, value in replacements.items():
        assert key in out, f"template missing {key}"
        out = out.replace(key, value)
    return out


def manifest_entry(step):
    return {
        "slug": step["slug"],
        "title": re.sub(r"<[^>]+>|&amp;", lambda m: "&" if m.group(0) == "&amp;" else " ", step["title_html"]).replace("\n", " ").strip(),
        "eyebrow": step["eyebrow"],
        "course": step["course"],
        "course_chip": step["course_chip"],
        "minutes": step["meta"]["minutes"],
    }


def plain_text(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).replace("&amp;", "&").strip()


def to_obj(value):
    """brand/glossary → dict. Content files may hold them as Python dicts or
    as raw JS object-literal strings (some use `"…" + "…"` concatenation, so
    plain json.loads isn't enough — Node evaluates those)."""
    if isinstance(value, dict):
        return value
    s = str(value or "").strip()
    if not s:
        return {}
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        pass
    import subprocess
    out = subprocess.run(
        ["node", "-e",
         'const fs=require("fs");'
         'process.stdout.write(JSON.stringify(eval("("+fs.readFileSync(0,"utf8")+")")))'],
        input=s.encode(), capture_output=True,
    )
    assert out.returncode == 0, f"could not parse JS object literal: {out.stderr.decode()[:200]}"
    return json.loads(out.stdout)


def emit_json(step, html):
    """Row for the public.steps table (BUILD_PLAN §2): the body between the
    icon sprite and the tap-define tip, plus everything the app shell and
    /steps index need. The sprite/tip/voice/CSS/JS live in the app
    (port_shell.py), so only content travels."""
    start = html.index('<div class="shell">')
    end = html.index('\n<div class="tip"')
    body = html[start:end].rstrip()

    outcomes = re.findall(r'<ul class="outcomes">(.*?)</ul>', body, re.S)
    outcome_texts = re.findall(r"<span>(.*?)</span>", outcomes[0], re.S) if outcomes else []

    m = re.fullmatch(r"([a-z]{2,4})-(\d+)-(\d+)", step["slug"])
    course_code = step.get("course_code") or (m.group(1) if m else "ops")
    lesson = int(m.group(2)) if m else None
    step_label = f"Step {m.group(2)}.{m.group(3)}" if m else None

    return {
        "slug": step["slug"],
        "course_code": course_code,
        "lesson": lesson,
        "step_label": step_label,
        "title": plain_text(step["title_html"]),
        "description": plain_text(step["standfirst_html"]),
        "body_html": body,
        "outcomes": [plain_text(t) for t in outcome_texts],
        "course_chip": step["course_chip"],
        "eyebrow": step["eyebrow"],
        "minutes": step["meta"]["minutes"],
        "glossary": to_obj(step["glossary"]),
        "brand": to_obj(step["brand"]),
        "extra_js": step.get("calculator_js") or None,
        "access": step.get("access", "members"),
    }


def update_manifest(entries):
    existing = []
    if MANIFEST.exists():
        existing = json.loads(MANIFEST.read_text(encoding="utf-8"))
    merged = {e["slug"]: e for e in existing}
    for e in entries:
        merged[e["slug"]] = e
    ordered = sorted(merged.values(), key=lambda e: (e["course"], e["slug"]))
    MANIFEST.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def content_files():
    return sorted((ROOT / "Schools").glob("**/sources/content_*.py"))


def main():
    args = sys.argv[1:]
    check = "--check" in args
    as_json = "--emit-json" in args
    args = [a for a in args if a not in ("--check", "--emit-json")]

    if args == ["--all"]:
        paths = content_files()
        if not paths:
            sys.exit("no content_*.py files found under Schools/")
    elif len(args) >= 1:
        paths = [Path(a).resolve() for a in args]
    else:
        sys.exit(__doc__)

    entries = []
    for path in paths:
        step = load_step(path)
        html = render(step)
        if as_json:
            # Publish payload for the public.steps table — written to
            # _dev/tmp (gitignored); a session/owner script upserts it.
            row = emit_json(step, html)
            json_dir = ROOT / "_dev" / "tmp" / "steps-json"
            json_dir.mkdir(parents=True, exist_ok=True)
            json_path = json_dir / f"{step['slug']}.json"
            json_path.write_text(
                json.dumps(row, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
            )
            print(f"wrote {json_path.relative_to(ROOT)} ({json_path.stat().st_size} bytes)")
            continue
        out_path = OUT_DIR / f"{step['slug']}.html"
        if check:
            current = out_path.read_text(encoding="utf-8") if out_path.exists() else ""
            if current == html:
                print(f"OK  {step['slug']}: output matches {out_path.relative_to(ROOT)}")
            else:
                print(f"DRIFT  {step['slug']}: generated output differs from {out_path.relative_to(ROOT)}")
                sys.exit(1)
        else:
            out_path.write_text(html, encoding="utf-8")
            print(f"wrote {out_path.relative_to(ROOT)} ({len(html)} bytes)")
        entries.append(manifest_entry(step))

    if not check and not as_json:
        update_manifest(entries)
        print(f"updated {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
