import Link from "next/link";
import { Icon } from "@/lib/icon";
import { SLACK_INVITE_URL } from "@/lib/links";
import { SlackMark } from "./home/SlackMark";

/* ------------------------------------------------------------------ *
 * The narrow half of the duo sidebar: a 56px icon rail on the far left of
 * every desktop surface. The wide half sits beside it and changes with
 * context — the home rail's labelled list on the dashboard, the course
 * navigator inside a lesson — while this strip stays put, so the way
 * between the app's levels is always in the same place.
 *
 * A SERVER component on purpose, like HomeSidebar: <Icon> resolves Solar on
 * the server and inlines the SVG, so the icon set never reaches the browser.
 * Which item is lit comes in as a prop from the layout that owns the route —
 * no client-side path sniffing needed.
 *
 * Line at rest, Bold Duotone when current — the same weight language the
 * labelled rows use. Destinations that don't exist yet are drawn dim and
 * inert rather than wired to a 404.
 *
 * Desktop only (hidden below md): phones keep the drawer, which already
 * carries these destinations with their labels.
 * ------------------------------------------------------------------ */

type RailItem = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  solar?: string;
  brand?: React.ReactNode;
};

const ITEMS: RailItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/", solar: "widget" },
  { id: "courses", label: "My courses", href: "/#courses", solar: "book-2" },
  {
    id: "community",
    label: "Community",
    href: SLACK_INVITE_URL || undefined,
    external: true,
    brand: <SlackMark size={18} />,
  },
  { id: "exams", label: "Exams", solar: "clipboard-check" },
  { id: "events", label: "Upcoming", solar: "calendar-minimalistic" },
];

const SETTINGS: RailItem = { id: "settings", label: "Settings", solar: "settings-minimalistic" };

function glyph(item: RailItem, active: boolean) {
  if (item.brand) return item.brand;
  if (!item.solar) return null;
  return <Icon name={`${item.solar}-${active ? "bold-duotone" : "linear"}`} size={20} />;
}

function RailButton({ item, active }: { item: RailItem; active: boolean }) {
  if (!item.href) {
    return (
      <span className="rail-btn squircle" data-soon="" title={`${item.label} — coming soon`} aria-disabled="true">
        {glyph(item, false)}
        <span className="sr-only">{item.label} (coming soon)</span>
      </span>
    );
  }
  const inner = (
    <>
      {glyph(item, active)}
      <span className="sr-only">{item.label}</span>
    </>
  );
  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="rail-btn squircle"
      title={item.label}
    >
      {inner}
    </a>
  ) : (
    <Link
      href={item.href}
      className="rail-btn squircle"
      title={item.label}
      data-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
    >
      {inner}
    </Link>
  );
}

export function Rail({ active }: { active?: string }) {
  return (
    <aside className="app-rail fixed top-12 z-40 hidden h-[calc(100dvh-48px)] flex-col items-center border-r border-line md:flex">
      <nav className="flex flex-col items-center gap-1.5 pt-3">
        {ITEMS.map((item) => (
          <RailButton key={item.id} item={item} active={active === item.id} />
        ))}
      </nav>
      <div className="flex-1" />
      <div className="pb-3">
        <RailButton item={SETTINGS} active={active === SETTINGS.id} />
      </div>
    </aside>
  );
}
