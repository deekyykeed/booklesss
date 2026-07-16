# Clerk docs — structural design reference

**Why these are recreations, not live captures:** the Booklesss cloud
sandbox's egress allowlist blocks `clerk.com` (the proxy answers 403 to
CONNECT — same wall as Linear/Supabase/Streamline), and the Wayback Machine
is blocked too, so a live screenshot is impossible from a cloud session.
The two HTML files here rebuild the docs' *structure* from memory and were
screenshot with the sandbox's local Chromium; each carries a
"RECREATION" badge. If pixel-true captures are wanted, take them on the
local machine and drop them in this folder next to these.

Files:

| File | What it shows |
|------|---------------|
| `clerk-docs-guide-page.html/.png` | The doc-page frame: topbar, sidebar, content, right rail |
| `clerk-docs-home.html/.png` | The docs landing: hero search + card grids |

## The structural skeleton (what makes it read as "Clerk docs")

1. **Flat three-column app frame.** Fixed hairline-bordered topbar; left
   sidebar and right rail are *part of the page frame* (sticky, full
   height, separated by 1px hairlines) — not floating cards. The content
   column is the only thing that scrolls visually; the frame stays put.
2. **One accent color, used only for "you are here".** Purple marks the
   active nav item, the active ToC entry, the breadcrumb tail, and link
   hovers. Everything else is near-black on white with 2 gray steps
   (body `#3f3f46`, muted `#5e5f6e`, faint `#9394a1`).
3. **Left sidebar = the whole course map.** Context picker at top (their
   SDK dropdown), then flat groups with small bold group labels, 13.5px
   items, 6px-radius hover pills, active = accent text on accent-tint pill,
   subsections indented behind a 1px left rule.
4. **Content column ~700–800px** with: breadcrumb (13px, muted, accent on
   the current page) → H1 (32px, 650, −0.03em) → muted lede → H2 sections
   *separated by hairline top-borders* with hover `#` anchors.
5. **Right rail = "On this page".** 12px bold label, 13px items hanging on
   a 1px left rule; the active item's rule segment turns accent. Below a
   hairline: last-updated, edit-link, feedback row.
6. **The Steps component** — numbered 27px circles joined by a 1px vertical
   connector line, content indented right of the line. The signature Clerk
   pattern for anything sequential.
7. **Prev/next pager** — two bordered 12px-radius cards after a hairline,
   "Previous"/"Next" in faint over the target title; hover = accent border.
8. **Callouts** — 10px radius, tinted bg + matching border, icon dot, 14px.
9. **Small radii, no shadows** (6–12px; shadows only on search + card
   hover). Hairlines do all the separating work.

## Mapping onto Booklesss steps (Clerk structure, Booklesss skin)

Keep the house palette (warm canvas `#f9f9f7`, ink `#18181B`, amber
`#c5613f`, warm hairline `#e7e1d5`, Parastoo wordmark) and swap the
*structure*:

| Clerk pattern | Booklesss equivalent |
|---|---|
| SDK picker atop sidebar | Course name + chip atop sidebar |
| Sidebar nav groups | Lessons as groups, steps as items (active = amber on amber-tint) |
| Breadcrumb | Course → Lesson n → Step n.n |
| Right rail "On this page" | Step's section ToC (already scanned by the chrome) |
| Rail meta block | minutes, feedback entry, Slack channel link |
| Prev/next pager | Previous/next step in the course |
| Steps component | Worked-example sequences inside step content (future) |
| Floating metallic cards | Retired in favor of the flat hairline frame |

Applied in `platform/components/step-chrome.tsx` + `app/steps/[slug]/chrome.css`
on branch `claude/clerk-design-booklesss-steps-b6md26`.
