"""
Booklesss Deck Generator
Converts a Booklesss-format .md file to a standalone HTML deck (Gamma replacement).
Outputs to /web/[course]/[slug].html

Usage:
  python3 _dev/scripts/md_to_deck.py <path_to_md_file>
  python3 _dev/scripts/md_to_deck.py courses/Treasury\ Management/lesson-01-foundations/notes/1_1_introduction-to-tm.md

The HTML file is self-contained — no internet required to view it.
Host via GitHub Pages for a shareable link.
"""

import sys
import os
import re

# ─────────────────────────────────────────────────────────────────────────────
#  MARKDOWN → HTML PARSER
# ─────────────────────────────────────────────────────────────────────────────

def parse_inline(text):
    """Convert inline markdown to HTML."""
    # Links [text](url) — render as styled button if text starts with a CTA keyword
    def link_sub(m):
        label, url = m.group(1), m.group(2)
        cta_words = ('join', 'click', 'sign up', 'get started', 'access', 'enrol', 'register')
        is_cta = any(label.lower().startswith(w) for w in cta_words)
        cls = ' class="btn-cta"' if is_cta else ' class="inline-link"'
        return f'<a href="{url}" target="_blank"{cls}>{label}</a>'
    text = re.sub(r'\[(.+?)\]\((.+?)\)', link_sub, text)
    # Bold
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    # Italic
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    # Inline code
    text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
    return text


def parse_table(lines):
    """Convert markdown table lines to HTML table."""
    rows = []
    for line in lines:
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        rows.append(cells)
    if not rows:
        return ''
    html = '<table>'
    # First row = header
    html += '<thead><tr>'
    for cell in rows[0]:
        html += f'<th>{parse_inline(cell)}</th>'
    html += '</tr></thead>'
    # Body rows (skip separator row)
    html += '<tbody>'
    for row in rows[2:]:
        if row and not all(re.match(r'^[-:]+$', c.replace(' ', '')) for c in row):
            html += '<tr>'
            for cell in row:
                html += f'<td>{parse_inline(cell)}</td>'
            html += '</tr>'
    html += '</tbody></table>'
    return html


def parse_body(lines):
    """Convert a list of markdown lines to HTML body content."""
    html = ''
    i = 0
    while i < len(lines):
        line = lines[i]

        # Blank line
        if not line.strip():
            i += 1
            continue

        # Callout boxes: /warning, /info, /success, /note, /caution, /question
        callout_match = re.match(r'^/(warning|info|success|note|caution|question)\s*(.*)', line, re.IGNORECASE)
        if callout_match:
            ctype = callout_match.group(1).lower()
            first_line = callout_match.group(2)
            content_lines = [first_line] if first_line else []
            i += 1
            while i < len(lines) and lines[i].strip() and not lines[i].startswith('/') and not lines[i].startswith('#'):
                content_lines.append(lines[i])
                i += 1
            icons = {'warning': '⚠', 'caution': '⚠', 'info': 'ℹ', 'note': '📌',
                     'success': '✓', 'question': '?'}
            icon = icons.get(ctype, '•')
            body = ' '.join(content_lines)
            html += f'<div class="callout callout-{ctype}"><span class="callout-icon">{icon}</span><span>{parse_inline(body)}</span></div>'
            continue

        # H3
        if line.startswith('### '):
            html += f'<h3>{parse_inline(line[4:])}</h3>'
            i += 1
            continue

        # Blockquote
        if line.startswith('> '):
            content = line[2:]
            i += 1
            while i < len(lines) and lines[i].startswith('> '):
                content += ' ' + lines[i][2:]
                i += 1
            html += f'<blockquote>{parse_inline(content)}</blockquote>'
            continue

        # Unordered list
        if re.match(r'^[-*] ', line):
            html += '<ul>'
            while i < len(lines) and re.match(r'^[-*] ', lines[i]):
                html += f'<li>{parse_inline(lines[i][2:])}</li>'
                i += 1
            html += '</ul>'
            continue

        # Ordered list
        if re.match(r'^\d+\. ', line):
            html += '<ol>'
            while i < len(lines) and re.match(r'^\d+\. ', lines[i]):
                text = re.sub(r'^\d+\. ', '', lines[i])
                html += f'<li>{parse_inline(text)}</li>'
                i += 1
            html += '</ol>'
            continue

        # Table
        if '|' in line:
            table_lines = []
            while i < len(lines) and '|' in lines[i]:
                table_lines.append(lines[i])
                i += 1
            html += parse_table(table_lines)
            continue

        # Paragraph
        para = line
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith('#') \
              and not lines[i].startswith('>') and not lines[i].startswith('|') \
              and not re.match(r'^[-*] ', lines[i]) and not re.match(r'^\d+\. ', lines[i]) \
              and not lines[i].startswith('/') and not lines[i].startswith('***'):
            para += ' ' + lines[i]
            i += 1
        html += f'<p>{parse_inline(para)}</p>'

    return html


def split_cards(md_text):
    """
    Split markdown into list of (heading, body_lines) tuples.
    Splits on ## headings and *** dividers.
    """
    lines = md_text.split('\n')
    cards = []
    current_heading = None
    current_lines = []

    for line in lines:
        if line.startswith('## '):
            if current_heading is not None or current_lines:
                cards.append((current_heading, current_lines))
            current_heading = line[3:].strip()
            current_lines = []
        elif line.strip() == '***':
            cards.append((current_heading, current_lines))
            current_heading = None
            current_lines = []
        else:
            current_lines.append(line)

    if current_heading is not None or current_lines:
        cards.append((current_heading, current_lines))

    # Filter empty
    return [(h, b) for h, b in cards if h or any(l.strip() for l in b)]


# ─────────────────────────────────────────────────────────────────────────────
#  HTML TEMPLATE
# ─────────────────────────────────────────────────────────────────────────────

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy:   #1B2A4A;
  --amber:  #C17E3A;
  --cream:  #F5F0E8;
  --ink:    #18181B;
  --steel:  #71717A;
  --mist:   #9CA3AF;
  --rule:   #E5E7EB;
  --ghost:  #F9FAFB;
  --white:  #FFFFFF;
  --warn-bg: #FEF3C7;
  --warn-tx: #92400E;
  --info-bg: #EFF6FF;
  --info-tx: #1D4ED8;
  --succ-bg: #ECFDF5;
  --succ-tx: #065F46;
  --note-bg: #FFF7ED;
  --note-tx: #9A3412;
}

html, body {
  width: 100%; height: 100%;
  font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
  background: #0D1117;
  overflow: hidden;
}

/* ── DECK WRAPPER ── */
.deck {
  width: 100vw; height: 100dvh;
  display: flex; align-items: stretch;
  position: relative;
}

/* ── CARDS ── */
.card {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  opacity: 0; pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1),
              transform 0.35s cubic-bezier(0.16,1,0.3,1);
  transform: translateY(18px);
  overflow-y: auto;
}
.card.active {
  opacity: 1; pointer-events: all;
  transform: translateY(0);
}
.card.exit {
  opacity: 0; transform: translateY(-18px);
}

/* ── COVER CARD ── */
.card-cover {
  background: var(--navy);
  justify-content: flex-end;
  padding: 0;
}
.cover-inner {
  padding: 10vmin 8vmin;
  max-width: 860px;
}
.cover-eyebrow {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em;
  color: var(--amber); text-transform: uppercase; margin-bottom: 1rem;
}
.cover-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 5.5vw, 3.8rem);
  font-weight: 700; line-height: 1.1; letter-spacing: -0.02em;
  color: var(--white); margin-bottom: 1.5rem;
}
.cover-rule {
  width: 3rem; height: 2px; background: var(--amber);
  margin-bottom: 1.2rem;
}
.cover-sub {
  font-size: 0.95rem; color: #8B9AB0; line-height: 1.6;
  max-width: 52ch; margin-bottom: 0.5rem;
}
.cover-tag {
  font-size: 0.75rem; font-weight: 600;
  color: var(--amber); margin-top: 0.5rem;
}
/* Accent strip */
.card-cover::before {
  content: ''; position: absolute;
  left: 0; top: 0; bottom: 0; width: 4px;
  background: var(--amber);
}

/* ── CONTENT CARDS ── */
.card-body {
  background: var(--white);
}
.card-content {
  padding: clamp(2rem, 5vmin, 3.5rem) clamp(1.5rem, 7vmin, 5rem);
  max-width: 860px; width: 100%; margin: 0 auto;
  flex: 1;
}

/* ── TYPOGRAPHY ── */
.card-eyebrow {
  font-size: 0.63rem; font-weight: 700; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--amber);
  margin-bottom: 0.4rem;
}
.card-content h2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.4rem, 3.5vw, 2.2rem);
  font-weight: 700; line-height: 1.15; letter-spacing: -0.015em;
  color: var(--ink); margin-bottom: 1rem;
}
.card-content h3 {
  font-size: 0.85rem; font-weight: 700;
  color: var(--steel); text-transform: uppercase;
  letter-spacing: 0.06em; margin: 1.4rem 0 0.5rem;
}
.card-content p {
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  color: var(--ink); line-height: 1.7;
  max-width: 68ch; margin-bottom: 0.8rem;
}
.card-content strong { font-weight: 700; }
.card-content em { font-style: italic; color: var(--steel); }
.card-content code {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.88em; background: var(--ghost);
  padding: 0.1em 0.4em; border-radius: 3px; color: var(--navy);
}
.card-content ul, .card-content ol {
  padding-left: 1.4rem; margin-bottom: 0.8rem;
}
.card-content li {
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  color: var(--ink); line-height: 1.7; margin-bottom: 0.3rem;
}
.card-content blockquote {
  border-left: 2.5px solid var(--amber);
  padding: 0.6rem 0 0.6rem 1.1rem;
  margin: 1rem 0; background: #FBF7F0; border-radius: 0 4px 4px 0;
}
.card-content blockquote p {
  color: var(--steel); font-style: italic; margin: 0;
}

/* ── TABLES ── */
.card-content table {
  width: 100%; border-collapse: collapse;
  margin: 1rem 0; font-size: 0.88rem;
}
.card-content th {
  background: var(--ink); color: var(--white);
  font-weight: 600; text-align: left;
  padding: 0.5rem 0.75rem;
}
.card-content td {
  padding: 0.45rem 0.75rem;
  border-bottom: 0.5px solid var(--rule);
  color: var(--ink); vertical-align: top;
}
.card-content tr:nth-child(even) td { background: var(--ghost); }
.card-content tr:last-child td {
  font-weight: 700; background: #ECFDF5; color: #065F46;
}

/* ── CALLOUT BOXES ── */
.callout {
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 0.85rem 1.1rem; border-radius: 6px;
  margin: 0.8rem 0; font-size: 0.9rem; line-height: 1.6;
}
.callout-icon { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }
.callout-warning, .callout-caution {
  background: var(--warn-bg); color: var(--warn-tx);
  border: 0.5px solid #D97706;
}
.callout-info {
  background: var(--info-bg); color: var(--info-tx);
  border: 0.5px solid #3B82F6;
}
.callout-success {
  background: var(--succ-bg); color: var(--succ-tx);
  border: 0.5px solid #10B981;
}
.callout-note, .callout-question {
  background: var(--note-bg); color: var(--note-tx);
  border: 0.5px solid #F97316;
}

/* ── FOOTER ── */
.card-footer {
  padding: 0.6rem clamp(1.5rem, 7vmin, 5rem);
  display: flex; justify-content: space-between; align-items: center;
  border-top: 0.5px solid var(--rule);
  font-size: 0.7rem; color: var(--mist);
}
.card-cover .card-footer {
  border-top: 0.5px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.3);
}

/* ── NAVIGATION ── */
.nav {
  position: fixed; bottom: 1.8rem; left: 50%;
  transform: translateX(-50%);
  display: flex; align-items: center; gap: 1.2rem;
  z-index: 100; pointer-events: none;
}
.nav-dots {
  display: flex; gap: 0.4rem; align-items: center;
}
.nav-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transition: all 0.25s ease; cursor: pointer; pointer-events: all;
}
.nav-dot.active {
  background: var(--amber); width: 18px; border-radius: 3px;
}
.nav-arrows {
  display: flex; gap: 0.5rem;
}
.nav-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.08); border: 0.5px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.6); font-size: 0.9rem;
  cursor: pointer; pointer-events: all;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease; backdrop-filter: blur(8px);
}
.nav-btn:hover { background: rgba(255,255,255,0.15); color: white; }
.nav-btn:disabled { opacity: 0.2; pointer-events: none; }

/* ── PROGRESS BAR ── */
.progress {
  position: fixed; top: 0; left: 0; height: 2px;
  background: var(--amber); transition: width 0.35s ease;
  z-index: 200;
}

/* ── CARD COUNT ── */
.card-count {
  position: fixed; top: 1rem; right: 1.4rem;
  font-size: 0.68rem; color: rgba(255,255,255,0.3);
  z-index: 100; font-weight: 500; letter-spacing: 0.06em;
}

/* ── LINKS & BUTTONS ── */
.inline-link {
  color: var(--amber); text-decoration: underline;
  text-underline-offset: 3px; transition: opacity 0.2s;
}
.inline-link:hover { opacity: 0.75; }

.btn-cta {
  display: inline-flex; align-items: center; gap: 0.4rem;
  margin-top: 0.8rem;
  padding: 0.65rem 1.4rem;
  background: var(--amber); color: #fff;
  font-size: 0.88rem; font-weight: 700;
  letter-spacing: 0.03em; border-radius: 4px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}
.btn-cta:hover { background: #A8692E; }
.btn-cta:active { transform: scale(0.98); }

/* CTA page overrides — dark bg so invert button */
.card-cover .btn-cta, .cta-card .btn-cta {
  background: var(--amber); color: #fff;
}

/* ── MOBILE ── */
@media (max-width: 600px) {
  .cover-title { font-size: 1.9rem; }
  .card-content { padding: 1.5rem 1.2rem; }
  .card-content h2 { font-size: 1.4rem; }
}
"""

JS = """
const cards = document.querySelectorAll('.card');
const dots = document.querySelectorAll('.nav-dot');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const progress = document.getElementById('progress');
const countEl = document.getElementById('card-count');
let current = 0;

function goTo(n) {
  if (n < 0 || n >= cards.length) return;
  cards[current].classList.remove('active');
  cards[current].classList.add('exit');
  setTimeout(() => cards[current < n ? current : n + 1]?.classList.remove('exit'), 400);
  current = n;
  cards.forEach(c => c.classList.remove('active', 'exit'));
  cards[current].classList.add('active');
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  btnPrev.disabled = current === 0;
  btnNext.disabled = current === cards.length - 1;
  progress.style.width = ((current + 1) / cards.length * 100) + '%';
  countEl.textContent = (current + 1) + ' / ' + cards.length;
}

btnPrev.addEventListener('click', () => goTo(current - 1));
btnNext.addEventListener('click', () => goTo(current + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')  { e.preventDefault(); goTo(current - 1); }
});

// Touch/swipe
let tx = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
document.addEventListener('touchend', e => {
  const dx = tx - e.changedTouches[0].clientX;
  if (Math.abs(dx) > 40) { dx > 0 ? goTo(current + 1) : goTo(current - 1); }
}, {passive:true});

goTo(0);
"""


def build_html(title, course_code, cards_data):
    """Assemble the full HTML string."""

    # Build card HTML
    cards_html = ''
    for idx, (heading, body_lines) in enumerate(cards_data):
        is_cover = idx == 0
        body_html = parse_body(body_lines)

        if is_cover:
            # Extract subtitle if first body paragraph exists
            subtitle_lines = [l for l in body_lines if l.strip() and not l.startswith('>')]
            eyebrow_text = course_code.upper() + '  ·  BOOKLESSS'
            # Check for > blockquote on cover for deadline
            deadline = ''
            for l in body_lines:
                if l.startswith('> '):
                    deadline = l[2:].strip()
                    break

            cards_html += f'''
<div class="card card-cover" data-idx="{idx}">
  <div class="cover-inner">
    <div class="cover-eyebrow">{eyebrow_text}</div>
    <h1 class="cover-title">{heading or title}</h1>
    <div class="cover-rule"></div>
    {''.join(f'<p class="cover-sub">{parse_inline(l)}</p>' for l in subtitle_lines[:2] if not l.startswith('>'))}
    {f'<p class="cover-tag">{parse_inline(deadline)}</p>' if deadline else ''}
  </div>
  <div class="card-footer">
    <span>Booklesss</span>
    <span>booklesss.framer.ai</span>
  </div>
</div>'''
        else:
            eyebrow = ''
            # Check if heading contains eyebrow pattern (CONCEPT 01 OF 03 style)
            # Otherwise build from card index
            eyebrow = f'SLIDE {idx}'
            cards_html += f'''
<div class="card card-body" data-idx="{idx}">
  <div class="card-content">
    <div class="card-eyebrow">{eyebrow}</div>
    {f'<h2>{parse_inline(heading)}</h2>' if heading else ''}
    {body_html}
  </div>
  <div class="card-footer">
    <span>Booklesss  ·  {course_code}</span>
    <span>{title}</span>
  </div>
</div>'''

    # Dots
    dots_html = ''.join(f'<div class="nav-dot" title="Slide {i+1}"></div>'
                        for i in range(len(cards_data)))

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Booklesss</title>
<style>{CSS}</style>
</head>
<body>
<div id="progress" class="progress"></div>
<div id="card-count" class="card-count"></div>
<div class="deck">
{cards_html}
</div>
<nav class="nav">
  <div class="nav-arrows">
    <button class="nav-btn" id="btn-prev" title="Previous (←)">&#8592;</button>
  </div>
  <div class="nav-dots">{dots_html}</div>
  <div class="nav-arrows">
    <button class="nav-btn" id="btn-next" title="Next (→)">&#8594;</button>
  </div>
</nav>
<script>{JS}</script>
</body>
</html>"""


# ─────────────────────────────────────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 md_to_deck.py <path_to_md_file>")
        sys.exit(1)

    md_path = sys.argv[1]
    if not os.path.exists(md_path):
        print(f"File not found: {md_path}")
        sys.exit(1)

    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # Infer title and course code from filename or first heading
    filename = os.path.basename(md_path)
    cards_data = split_cards(md_text)

    title = cards_data[0][0] if cards_data and cards_data[0][0] else filename.replace('.md', '').replace('-', ' ').replace('_', ' ')
    course_code = 'BBF4302'  # default — update via arg or frontmatter later

    # Output path: web/<course_slug>/<file_slug>.html
    file_slug = slugify(os.path.splitext(filename)[0])
    # Try to detect course from path
    path_parts = md_path.replace('\\', '/').split('/')
    course_slug = 'tm'
    for part in path_parts:
        if 'treasury' in part.lower():
            course_slug = 'tm'
        elif 'corporate' in part.lower():
            course_slug = 'cf'
            course_code = 'BBF4301'
        elif 'strategic' in part.lower():
            course_slug = 'sm'
            course_code = 'BBF4303'

    # Workspace root = 2 levels above _dev/
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace = os.path.dirname(os.path.dirname(script_dir))
    out_dir = os.path.join(workspace, 'web', course_slug)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f'{file_slug}.html')

    html = build_html(title, course_code, cards_data)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    # Also write an index redirect at web/index.html if it doesn't exist
    index_path = os.path.join(workspace, 'web', 'index.html')
    if not os.path.exists(index_path):
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write('<meta http-equiv="refresh" content="0; url=tm/">\n')

    print(f"Saved:  {out_path}")
    print(f"URL:    https://deekyykeed.github.io/booklesss/web/{course_slug}/{file_slug}.html")
    print(f"Slides: {len(cards_data)}")


if __name__ == '__main__':
    main()
