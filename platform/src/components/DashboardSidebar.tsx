import { Icon } from "@/lib/icon";

/* 208px icon rail for the org dashboard (the "/" surface). */

type NavItem = { label: string; icon: string; active?: boolean };

const ITEMS: NavItem[] = [
  { label: "Projects", icon: "widget-2-linear", active: true },
  { label: "Team", icon: "users-group-rounded-linear" },
  { label: "Integrations", icon: "plug-circle-linear" },
  { label: "Usage", icon: "chart-2-linear" },
  { label: "Billing", icon: "card-linear" },
  { label: "Organization Settings", icon: "settings-linear" },
];

export function DashboardSidebar() {
  return (
    <aside
      className="fixed left-0 top-12 hidden h-[calc(100vh-48px)] flex-col justify-between border-r border-[#dfdfdf] bg-canvas p-2 md:flex"
      style={{ width: "var(--sidebar-dash)" }}
    >
      <nav className="flex flex-col gap-0.5">
        {ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            className={
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors " +
              (item.active
                ? "bg-active font-medium text-ink"
                : "text-muted hover:bg-active/60 hover:text-ink")
            }
          >
            <Icon
              name={item.icon}
              size={20}
              className={item.active ? "text-ink" : "text-muted opacity-90"}
            />
            <span className="truncate">{item.label}</span>
          </a>
        ))}
      </nav>

      <button
        type="button"
        aria-label="Collapse sidebar"
        className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-active hover:text-ink"
      >
        <Icon name="sidebar-minimalistic-linear" size={18} />
      </button>
    </aside>
  );
}
