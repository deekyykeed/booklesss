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

## Diagrams (responsive, icon-driven)

Pattern used by TM 2.1's Cash Conversion Cycle diagram: a row of cards joined
by operators, collapsing to a stack on mobile. Self-contained — a `raw` block
(or raw markup inside `raw_sections`) carrying its own scoped `<style>` and
inline SVG, so it ships with the page and needs no template change. Skeleton:

```html
<div class="ccc-viz" role="img" aria-label="Plain-language description of the whole diagram.">
  <style>
    .ccc-viz { margin: 1.5rem 0 1.7rem; }
    .ccc-cap { font-family:"Satoshi","Onest",system-ui,sans-serif; font-size:0.6875rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--steel); margin:0 0 0.9rem; }
    .ccc-flow { display:flex; align-items:stretch; gap:0.5rem; }
    .ccc-node { flex:1 1 0; min-width:0; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.45rem; padding:1.05rem 0.7rem; background:#ffffff; border:1px solid var(--border); border-radius:18px; box-shadow:var(--shadow); }
    .ccc-ic { width:54px; height:54px; flex:none; }
    .ccc-term { font-family:"Satoshi","Onest",system-ui,sans-serif; font-weight:650; font-size:0.85rem; color:var(--ink); line-height:1.2; }
    .ccc-sub { font-size:0.72rem; line-height:1.3; color:var(--steel); }
    .ccc-op { flex:0 0 auto; align-self:center; font-family:"Geist Mono",ui-monospace,monospace; font-size:1.5rem; font-weight:700; color:var(--amber); }
    .ccc-eq { display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:0.4rem; margin-top:0.7rem; padding:0.7rem 1rem; background:var(--amber-soft); border:1px solid var(--amber-line); border-radius:14px; font-family:"Satoshi","Onest",system-ui,sans-serif; font-weight:600; font-size:0.875rem; color:var(--steel); text-align:center; }
    .ccc-eq b { color:var(--ink); font-weight:700; } .ccc-eq .eqs { color:var(--amber); font-weight:700; }
    @media (max-width:560px) { .ccc-flow { flex-direction:column; gap:0.35rem; } .ccc-op { font-size:1.35rem; margin:0.05rem 0; } }
  </style>
  <p class="ccc-cap">Short caption</p>
  <div class="ccc-flow">
    <div class="ccc-node"><!-- inline SVG icon --><span class="ccc-term">Label</span><span class="ccc-sub">one-line gloss</span></div>
    <span class="ccc-op" aria-hidden="true">+</span>
    <div class="ccc-node">…</div>
    <span class="ccc-op" aria-hidden="true">&minus;</span>
    <div class="ccc-node">…</div>
  </div>
  <div class="ccc-eq"><span class="eqs">=</span>&nbsp;<b>Result</b> — what it means</div>
</div>
```

Rules that keep it on-brand and responsive: cards are white with `var(--shadow)`
(match tables/formula boxes); use palette tokens (`--ink`, `--steel`, `--amber`,
`--amber-soft`, `--amber-line`, `--border`) not hex; keep upright `+` / `&minus;`
operators (don't rotate — a rotated minus reads as a bar); always verify **zero
horizontal overflow** on a 390px viewport before shipping.

**Icons — freehand duotone from Streamline.** Find a free icon
(`freehand-duotone-free` set; premium sets 403 on the free account), then pull
its SVG with `get_icon_by_hash` — the response's `svg` field is the full source
**inline** (the download-URL route is egress-blocked in cloud sessions). Drop
the `<desc>`, string-replace the two default colours (`#020202` → `#18181B`
ink, `#0c6fff` → `#c5613f` terracotta), and set the opening tag to
`<svg class="ccc-ic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">`.
The width/height come from `.ccc-ic`, so the viewBox is all the SVG needs.
