import { Icon } from "@/lib/icon";
import { SLACK_INVITE_URL } from "@/lib/links";
import { HomeNavLink } from "./HomeNavLink";
import { SlackMark } from "./SlackMark";

/* The home rail. Same material and geometry as the course navigator — this is
 * the same app, not a separate marketing shell — but it lists places rather
 * than steps.
 *
 * A SERVER component on purpose: <Icon> resolves Solar on the server and
 * inlines the SVG, so none of the ~7,400-icon set reaches the browser. Only
 * the links themselves are a client island (HomeNavLink), because tapping one
 * has to close the mobile drawer.
 *
 * Destinations with no href are drawn as they will be and marked "Soon"
 * instead of being wired to a 404 — showing the shape is useful, pretending
 * it works is not. */

type Item = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  /** Solar base name — the variant is picked by state, see glyphFor. */
  solar?: string;
  /** Brand marks aren't in Solar at all (see SlackMark). */
  brand?: React.ReactNode;
};

const ITEMS: Item[] = [
  { id: "dashboard", label: "Dashboard", href: "/", solar: "widget" },
  { id: "courses", label: "My courses", href: "/#courses", solar: "book-2" },
  {
    id: "community",
    label: "Community",
    // Empty until the workspace question is settled — see lib/links.ts.
    href: SLACK_INVITE_URL || undefined,
    external: true,
    brand: <SlackMark size={17} />,
  },
  { id: "exams", label: "Exams", solar: "clipboard-check" },
  { id: "events", label: "Upcoming", solar: "calendar-minimalistic" },
  { id: "settings", label: "Settings", solar: "settings-minimalistic" },
];

/* Line at rest, Bold Duotone once the row is the current page — the weight
 * change is what reads as selected, alongside the darkened background.
 *
 * Solar ships duotone as two currentColor paths with opacity=".5" on the
 * secondary shape, and that is left exactly as authored: no fill or opacity is
 * overridden here, so the icon tones are the set's own. They follow the row's
 * text colour, which is what makes an active row's glyph ink-coloured without
 * anything being hard-coded. */
function glyphFor(item: Item, active: boolean) {
  if (item.brand) return item.brand;
  if (!item.solar) return null;
  return <Icon name={`${item.solar}-${active ? "bold-duotone" : "linear"}`} size={17} />;
}

export function HomeSidebar({ active = "dashboard" }: { active?: string }) {
  return (
    <aside
      className="sidebar-panel fixed left-0 top-12 z-40 flex h-[calc(100dvh-48px)] flex-col border-r border-line"
      style={{ width: "var(--sidebar-docs)" }}
    >
      <nav className="no-scrollbar flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-0.5">
          {ITEMS.map((item) => {
            const isActive = active === item.id;
            return item.href ? (
              <HomeNavLink key={item.id} href={item.href} external={item.external} active={isActive}>
                {glyphFor(item, isActive)}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </HomeNavLink>
            ) : (
              <span key={item.id} className="home-nav squircle" data-soon="">
                {glyphFor(item, false)}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="home-soon">Soon</span>
              </span>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
