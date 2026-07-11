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
    tpl = TEMPLATE.read_text()
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
        voice = "\n" + (HERE / "voice_placeholder.html").read_text()

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


def update_manifest(entries):
    existing = []
    if MANIFEST.exists():
        existing = json.loads(MANIFEST.read_text())
    merged = {e["slug"]: e for e in existing}
    for e in entries:
        merged[e["slug"]] = e
    ordered = sorted(merged.values(), key=lambda e: (e["course"], e["slug"]))
    MANIFEST.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n")


def content_files():
    return sorted((ROOT / "Schools").glob("**/sources/content_*.py"))


def main():
    args = sys.argv[1:]
    check = "--check" in args
    args = [a for a in args if a != "--check"]

    if args == ["--all"]:
        paths = content_files()
        if not paths:
            sys.exit("no content_*.py files found under Schools/")
    elif len(args) == 1:
        paths = [Path(args[0]).resolve()]
    else:
        sys.exit(__doc__)

    entries = []
    for path in paths:
        step = load_step(path)
        html = render(step)
        out_path = OUT_DIR / f"{step['slug']}.html"
        if check:
            current = out_path.read_text() if out_path.exists() else ""
            if current == html:
                print(f"OK  {step['slug']}: output matches {out_path.relative_to(ROOT)}")
            else:
                print(f"DRIFT  {step['slug']}: generated output differs from {out_path.relative_to(ROOT)}")
                sys.exit(1)
        else:
            out_path.write_text(html)
            print(f"wrote {out_path.relative_to(ROOT)} ({len(html)} bytes)")
        entries.append(manifest_entry(step))

    if not check:
        update_manifest(entries)
        print(f"updated {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
