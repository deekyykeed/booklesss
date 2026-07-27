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
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  { id: "home", label: "Home", href: "/", icon: <Icon name="home-2-linear" size={17} /> },
  { id: "courses", label: "My courses", href: "/#courses", icon: <Icon name="book-2-linear" size={17} /> },
  {
    id: "community",
    label: "Community",
    // Empty until the workspace question is settled — see lib/links.ts.
    href: SLACK_INVITE_URL || undefined,
    external: true,
    icon: <SlackMark size={17} />,
  },
  { id: "exams", label: "Exams", icon: <Icon name="clipboard-check-linear" size={17} /> },
  { id: "events", label: "Upcoming", icon: <Icon name="calendar-minimalistic-linear" size={17} /> },
  { id: "settings", label: "Settings", icon: <Icon name="settings-minimalistic-linear" size={17} /> },
];

export function HomeSidebar({ active = "home" }: { active?: string }) {
  return (
    <aside
      className="sidebar-panel fixed left-0 top-12 z-40 flex h-[calc(100dvh-48px)] flex-col border-r border-line"
      style={{ width: "var(--sidebar-docs)" }}
    >
      <nav className="no-scrollbar flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-0.5">
          {ITEMS.map((item) =>
            item.href ? (
              <HomeNavLink
                key={item.id}
                href={item.href}
                external={item.external}
                active={active === item.id}
              >
                {item.icon}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </HomeNavLink>
            ) : (
              <span key={item.id} className="home-nav squircle" data-soon="">
                {item.icon}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="home-soon">Soon</span>
              </span>
            ),
          )}
        </div>
      </nav>
    </aside>
  );
}
