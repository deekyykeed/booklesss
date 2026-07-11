# Booklesss Step Generator

Turns a content file into a login-gated web step at
`platform/public/steps/<slug>.html`. The design (fonts, icons, popover,
feedback card, scroll animation) lives once in `template.html` — change it
there, rebuild all, every step updates.

## Commands

```bash
# one step
python3 _dev/step-generator/generate_step.py "Schools/ZCAS/Treasury Management/02-working-capital/sources/content_tm_2_1.py"

# every step (any file matching Schools/**/sources/content_*.py)
python3 _dev/step-generator/generate_step.py --all

# verify a content file's output matches what's on disk (CI-friendly)
python3 _dev/step-generator/generate_step.py --check <content-file>
```

Each run also refreshes `platform/public/steps/manifest.json`, which feeds
the `/steps` index page. Commit + push and Vercel deploys the pages.

## Authoring a step

One Python file per step, next to its PDF build script:
`Schools/<School>/<Course>/<lesson>/sources/content_<slug>.py`

```python
STEP = {
    "slug": "tm-2-2",                      # file name + feedback API key
    "course": "Treasury Management",       # groups the /steps index
    "page_title": "Step 2.2 · Inventory Management — Booklesss",
    "course_chip": "BBF4302 · ZCAS",
    "eyebrow": "Treasury Management · Lesson 2 · Step 2.2",
    "title_html": "Inventory Management,\nEOQ &amp; Creditor Management",
    "standfirst_html": "One-paragraph promise of the step.",
    "meta": {"minutes": 10, "sections": 4, "examples": 2},

    "sources": {   # ids used by {src:...} tokens and the sources list
        "inv": {"domain": "investopedia.com", "label": "Investopedia",
                "mono": "I", "color": "#0E5F4C"},
    },

    "sections": [
        {"eyebrow": "Foundations", "title": "Why Inventory Ties Up Cash", "blocks": [
            {"t": "p", "html": "Body text with an inline source "
                               "{src:inv:https://www.investopedia.com/terms/e/economicorderquantity.asp}."},
            {"t": "h3", "text": "A subheading"},
            {"t": "bullets", "items": ["First point", "Second point"]},
            {"t": "formula", "html": "EOQ  <span class=\"op\">=</span>  &radic;(2DS &divide; H)"},
            {"t": "table", "head": ["Item", "Value (ZMW)"], "rows": [["Inventory", "K2,600,000"]]},
            {"t": "callout", "tag": "Exam tip", "icon": "medal", "html": "..."},   # icons: bulb, medal, check
            {"t": "discuss", "html": "A genuine discussion prompt for the channel."},
            {"t": "raw", "html": "<div class=\"lab\">…custom interactive markup…</div>"},
        ]},
    ],

    "outcomes": ["What the student can now do", "..."],
    "sources_list": [{"src": "inv", "href": "https://…", "label": "EOQ — Definition"}],
    "glossary": {"eoq": "Economic order quantity — the order size that minimises …"},

    "closer_html": "Community closer paragraph.",
    "next_line": "NEXT: 2.3 — CASH MANAGEMENT &amp; CASH FLOW FORECASTING",

    "calculator_js": "",        # optional per-step interactive JS (IIFE), or ""
    "voice_agent_id": None,     # ElevenLabs public agent id enables the voice tutor
}
```

Notes:
- `raw_sections` (a single markup string) can replace `sections`/`outcomes`/
  `sources_list` for ported pages — `content_tm_2_1.py` uses it.
- `brand`/`glossary` accept dicts or raw JS-object strings.
- The glossary feeds the highlight-to-define popover; write definitions the
  way a student would want them read back.
- Text follows the Booklesss writing rules (no banned words, ZMW examples).

## Voice tutor (ElevenLabs Agents)

Set `"voice_agent_id": "<public agent id>"` and regenerate: the page gets a
floating "Talk to Booklesss" widget, passed `step_slug` and `step_title` as
dynamic variables so the agent knows what the student is reading. Create the
agent at elevenlabs.io (Agents → New), put the tutor persona in its system
prompt, and reference `{{step_title}}` there. Free tier is enough for a demo.

## Porting a PDF step

Copy the text out of the step's ReportLab `build_*.py` into blocks — it is
transcription, not translation (`section()` → section dict, `body()` → `p`,
`callout()` → `callout`, `table_std` → `table`, `formula_box` → `formula`).
Budget 1–2 hours per step. Write the glossary and discussion prompts fresh.
