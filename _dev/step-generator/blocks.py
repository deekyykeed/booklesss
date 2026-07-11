"""HTML builders for Booklesss step content blocks.

Each builder returns markup matching the step template's design system.
Content authors use these via typed block dicts in a step's content file;
`{"t": "raw", "html": ...}` is the escape hatch for custom markup
(calculators, ported sections).

Inline source chips: write `{src:ID:URL}` or `{src:ID:URL:Label}` inside
any html/text value. IDs must exist in STEP["sources"].
"""

import html as _html
import re

SRC_TOKEN = re.compile(r"\{src:([a-z0-9_]+):([^:}]+)(?::([^}]+))?\}")


def expand_sources(text, sources):
    """Expand {src:ID:URL[:Label]} tokens into source chip markup."""
    def repl(m):
        sid, url, label = m.group(1), m.group(2), m.group(3)
        s = sources[sid]
        return (
            f'<a class="src" href="{url}" target="_blank" rel="noopener" '
            f'data-dom="{s["domain"]}" data-mono="{s["mono"]}" data-color="{s["color"]}">'
            f'<span class="ico"></span>{label or s["label"]}</a>'
        )
    return SRC_TOKEN.sub(repl, text)


def p(block, sources):
    return f'      <p>{expand_sources(block["html"], sources)}</p>'


def h3(block, sources):
    return f'      <h3>{block["text"]}</h3>'


def bullets(block, sources):
    items = "\n".join(
        f'        <li>{expand_sources(i, sources)}</li>' for i in block["items"]
    )
    return f'      <ul class="tick">\n{items}\n      </ul>'


def _td(cell):
    cls = ' class="num"' if str(cell).startswith("K") and str(cell)[1:2].isdigit() else ""
    return f"<td{cls}>{cell}</td>"


def table(block, sources):
    head = "".join(f"<th>{h}</th>" for h in block["head"])
    rows = "\n".join(
        "          <tr>" + "".join(_td(c) for c in row) + "</tr>"
        for row in block["rows"]
    )
    return (
        '      <div class="tbl-wrap"><table>\n'
        f'        <thead><tr>{head}</tr></thead>\n'
        f'        <tbody>\n{rows}\n        </tbody>\n'
        '      </table></div>'
    )


def formula(block, sources):
    return (
        '      <div class="formula-wrap"><div class="formula"><pre>'
        + block["html"]
        + "</pre></div></div>"
    )


def callout(block, sources):
    return (
        '      <div class="callout">\n'
        f'        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-{block.get("icon", "bulb")}"/></svg>{block["tag"]}</span>\n'
        f'        {expand_sources(block["html"], sources)}\n'
        "      </div>"
    )


def discuss(block, sources):
    return (
        '      <div class="discuss">\n'
        '        <span class="tag"><svg class="ic" aria-hidden="true"><use href="#ic-chat"/></svg>Discuss in the channel</span>\n'
        f'        <p>{expand_sources(block["html"], sources)}</p>\n'
        "      </div>"
    )


def raw(block, sources):
    return block["html"]


BUILDERS = {
    "p": p,
    "h3": h3,
    "bullets": bullets,
    "table": table,
    "formula": formula,
    "callout": callout,
    "discuss": discuss,
    "raw": raw,
}


def build_section(section, sources):
    """One <section>: eyebrow + h2 + blocks."""
    body = "\n".join(BUILDERS[b["t"]](b, sources) for b in section["blocks"])
    return (
        "    <section>\n"
        f'      <span class="eyebrow">{section["eyebrow"]}</span>\n'
        f'      <h2>{section["title"]}</h2>\n'
        f"{body}\n"
        "    </section>"
    )


def build_outcomes(outcomes):
    items = "\n".join(
        '        <li><svg class="ic" aria-hidden="true"><use href="#ic-check"/></svg>'
        f"<span>{o}</span></li>"
        for o in outcomes
    )
    return (
        "    <section>\n"
        '      <span class="eyebrow">Outcomes</span>\n'
        "      <h2>What You Should Now Be Able To Do</h2>\n"
        '      <ul class="outcomes">\n'
        f"{items}\n"
        "      </ul>\n"
        "    </section>"
    )


def build_sources_section(sources_list, sources):
    items = "\n".join(
        f'        <li><a href="{e["href"]}" target="_blank" rel="noopener" '
        f'data-dom="{sources[e["src"]]["domain"]}" data-mono="{sources[e["src"]]["mono"]}" '
        f'data-color="{sources[e["src"]]["color"]}"><span class="ico"></span>{e["label"]}'
        '<svg class="ic open-ic" aria-hidden="true"><use href="#ic-open"/></svg></a></li>'
        for e in sources_list
    )
    return (
        "    <section>\n"
        '      <span class="eyebrow">Sources</span>\n'
        "      <h2>Where This Step Draws From</h2>\n"
        "      <p>Inline citations above link to the exact pages. Full list:</p>\n"
        '      <ul class="sources-list">\n'
        f"{items}\n"
        "      </ul>\n"
        "    </section>"
    )
