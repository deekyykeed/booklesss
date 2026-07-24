# Booklesss

A speed-optimized rebuild of the Booklesss Framer site — learn without the textbook.
Recreated pixel-faithfully from the Framer source on a hand-tuned, static-first stack.

## Stack

- **Next.js 16** (App Router, React Server Components) — every route prerendered as static HTML
- **Tailwind CSS v4** — design tokens measured from the Framer project
- **`next/font`** — self-hosted **Inter** (UI) + **Familjen Grotesk** (headings), zero CLS
- **Solar Bold + Solar Line** icons (`@iconify-json/solar`) inlined as SVG on the server — no icon font, no client JS, no per-icon network request
- Client JS only where interaction demands it: the ⌘K command palette and the collapsible docs sidebar

## Routes

| Route | Surface |
|-------|---------|
| `/` | Org dashboard — icon sidebar + stat cards (credits, spend, caching, token volume) |
| `/project` | Docs/lesson reader — collapsible docs sidebar + lesson heading |
| `/page` | Work-in-progress docs nav |

## Develop

```bash
npm run dev      # http://localhost:3000
npm run build    # production build (all routes static)
npm start        # serve the production build
```

## Structure

```
src/
  app/                 route entries (/, /project, /page) + root layout
  components/
    TopBar.tsx         fixed 48px header (logo, org switcher, breadcrumb, actions)
    CommandSearch.tsx  ⌘K palette (client island)
    DocsSidebar.tsx    collapsible lesson navigator (client island)
    DashboardSidebar.tsx  org icon rail
    StatCard.tsx       dashboard cards, progress ring, buttons
  lib/icon.tsx         server-only Solar SVG renderer — <Icon name="magnifer-linear" />
```

Design tokens live in `src/app/globals.css` (`@theme`). Icons: use `-linear` for Solar Line,
`-bold` for Solar Bold.
