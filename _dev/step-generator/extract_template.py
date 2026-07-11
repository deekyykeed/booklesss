#!/usr/bin/env python3
"""One-time extraction: split the hand-built TM 2.1 page into
template.html (design, placeholders) + content_tm_2_1.py (content).

Kept for reference — rerunning it overwrites template.html and the
content file from whatever platform/public/steps/tm-step-2-1.html (or
tm-2-1.html) currently contains.
"""

import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SRC = ROOT / "platform" / "public" / "steps" / "tm-step-2-1.html"
if not SRC.exists():
    SRC = ROOT / "platform" / "public" / "steps" / "tm-2-1.html"
CONTENT_OUT = (
    ROOT / "Schools" / "ZCAS" / "Treasury Management" / "02-working-capital"
    / "sources" / "content_tm_2_1.py"
)

page = SRC.read_text()


def slice_between(start, end, s=None):
    s = s if s is not None else page
    i = s.index(start) + len(start)
    j = s.index(end, i)
    return s[i:j]


def cut(start, end):
    """Return inner slice and replace it (in the global template) later."""
    return slice_between(start, end)


extracted = {}
extracted["page_title"] = slice_between("<title>", "</title>")
extracted["course_chip"] = slice_between('<span class="coursechip">', "</span>")
extracted["eyebrow"] = slice_between('<span class="eyebrow">', "</span>")
extracted["title_html"] = slice_between("<h1>", "</h1>")
extracted["standfirst_html"] = slice_between('<p class="standfirst">', "</p>")
extracted["meta_items"] = slice_between('<div class="metarow">\n', "\n    </div>")
extracted["content_sections"] = slice_between(
    '<div class="content" id="content">\n\n', "\n\n    <section>\n      <span class=\"eyebrow\">Wrap up</span>"
).rstrip()
closer_inner = slice_between('<div class="closer">\n', "\n    </div>\n\n  </div>")
extracted["closer_html"] = slice_between("<p>", "</p>", closer_inner)
extracted["next_line"] = slice_between('<p class="next">', "</p>", closer_inner)
extracted["brand_json"] = slice_between("var BRAND = ", ";\n")
extracted["glossary_json"] = slice_between("var GLOSSARY = ", ";\n")
# exact substring from the calc comment up to (not including) the generic
# feedback block that follows it (which stays in the template)
_calc_start = page.index("  /* ── Interactive CCC calculator ── */")
_calc_end = page.index("  /* ── Rate + complete (Supabase via same-origin API) ── */")
extracted["calculator_js"] = page[_calc_start:_calc_end]

# ── Build template.html ─────────────────────────────────────
tpl = page
tpl = tpl.replace(f"<title>{extracted['page_title']}</title>", "<title>{{PAGE_TITLE}}</title>")
tpl = tpl.replace(
    f'<span class="coursechip">{extracted["course_chip"]}</span>',
    '<span class="coursechip">{{COURSE_CHIP}}</span>',
)
tpl = tpl.replace(
    f'<span class="eyebrow">{extracted["eyebrow"]}</span>',
    '<span class="eyebrow">{{EYEBROW}}</span>',
    1,
)
tpl = tpl.replace(f"<h1>{extracted['title_html']}</h1>", "<h1>{{TITLE_HTML}}</h1>")
tpl = tpl.replace(
    f'<p class="standfirst">{extracted["standfirst_html"]}</p>',
    '<p class="standfirst">{{STANDFIRST}}</p>',
)
tpl = tpl.replace(extracted["meta_items"], "{{META_ITEMS}}")
tpl = tpl.replace(extracted["content_sections"], "{{CONTENT_SECTIONS}}")
tpl = tpl.replace(f"<p>{extracted['closer_html']}</p>", "<p>{{CLOSER_HTML}}</p>")
tpl = tpl.replace(
    f'<p class="next">{extracted["next_line"]}</p>', '<p class="next">{{NEXT_LINE}}</p>'
)
tpl = tpl.replace(f"var BRAND = {extracted['brand_json']};", "var BRAND = {{BRAND_JSON}};")
tpl = tpl.replace(
    f"var GLOSSARY = {extracted['glossary_json']};", "var GLOSSARY = {{GLOSSARY_JSON}};"
)
tpl = tpl.replace('var STEP = "tm-2-1";', 'var STEP = "{{STEP_SLUG}}";')
tpl = tpl.replace(extracted["calculator_js"], "{{CALCULATOR_JS}}")
tpl = tpl.replace("</body>", "{{VOICE_AGENT}}</body>")

for marker in [
    "{{PAGE_TITLE}}", "{{COURSE_CHIP}}", "{{EYEBROW}}", "{{TITLE_HTML}}",
    "{{STANDFIRST}}", "{{META_ITEMS}}", "{{CONTENT_SECTIONS}}", "{{CLOSER_HTML}}",
    "{{NEXT_LINE}}", "{{BRAND_JSON}}", "{{GLOSSARY_JSON}}", "{{STEP_SLUG}}",
    "{{CALCULATOR_JS}}", "{{VOICE_AGENT}}",
]:
    assert tpl.count(marker) == 1, f"{marker} x{tpl.count(marker)}"

(HERE / "template.html").write_text(tpl)
print(f"wrote template.html ({len(tpl)} bytes)")

# ── Build content_tm_2_1.py ─────────────────────────────────
def q(s):
    return '"""' + s.replace("\\", "\\\\").replace('"""', '\\"\\"\\"') + '"""'


content = f'''"""TM Step 2.1 — Working Capital & Liquidity Management (web step content).

Ported from the hand-built page; sections are carried as raw markup.
New steps should prefer typed blocks — see _dev/step-generator/README.md.

Build:  python3 _dev/step-generator/generate_step.py "{CONTENT_OUT.relative_to(ROOT)}"
"""

STEP = {{
    "slug": "tm-2-1",
    "course": "Treasury Management",
    "page_title": {q(extracted["page_title"])},
    "course_chip": {q(extracted["course_chip"])},
    "eyebrow": {q(extracted["eyebrow"])},
    "title_html": {q(extracted["title_html"])},
    "standfirst_html": {q(extracted["standfirst_html"])},
    "meta": {{"minutes": 12, "sections": 5, "examples": 2}},

    # Raw port of the hand-built sections (incl. Outcomes + Sources).
    "raw_sections": {q(extracted["content_sections"])},

    # JS object literals carried verbatim (dicts also accepted).
    "brand": {q(extracted["brand_json"])},
    "glossary": {q(extracted["glossary_json"])},

    "closer_html": {q(extracted["closer_html"])},
    "next_line": {q(extracted["next_line"])},

    "calculator_js": {q(extracted["calculator_js"])},

    # Set to the public agent id from ElevenLabs to enable the voice tutor.
    "voice_agent_id": None,
}}
'''

CONTENT_OUT.write_text(content)
print(f"wrote {CONTENT_OUT.relative_to(ROOT)} ({len(content)} bytes)")
