import { Icon } from "@/lib/icon";
import { CommandSearch } from "./CommandSearch";

// Streamline · Solar Broken · "Stop" — Booklesss brand mark
function Logo() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      aria-hidden="true"
      className="shrink-0 text-ink"
    >
      <path
        d="M22 12c0 4.714 0 7.0711-1.4645 8.5355C19.0711 22 16.714 22 12 22c-4.71405 0-7.07107 0-8.53553-1.4645C2 19.0711 2 16.714 2 12c0-4.71405 0-7.07107 1.46447-8.53553C4.92893 2 7.28595 2 12 2c4.714 0 7.0711 0 8.5355 1.46447.9738.97374 1.3001 2.34208 1.4094 4.53553"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Shared, fixed 48px header. Boxy chrome, per the Framer "Header Row":
 * flat #fcfcfc fill, 1px #dfdfdf bottom hairline, px-16, space-between. */

function CircleButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-full border border-[#d4d4d4] bg-white text-muted shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)] transition-colors hover:text-ink"
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

function Avatar() {
  return (
    <div
      className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-black/10 text-[11px] font-semibold text-white shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16)]"
      style={{ background: "linear-gradient(135deg,#3ecf8e,#1f9e6b)" }}
      aria-label="Account"
    >
      DM
    </div>
  );
}

export function TopBar({
  orgName,
  breadcrumb,
  breadcrumbSlot,
}: {
  orgName: string;
  breadcrumb?: string[];
  breadcrumbSlot?: React.ReactNode;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between gap-2.5 border-b border-line bg-[#fcfcfc] px-4">
      {/* left cluster — the logo lockup sits apart from the breadcrumb */}
      <div className="flex min-w-0 items-center gap-5">
        {/* logo lockup: mark + wordmark read as one centered unit */}
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-[15px] font-medium leading-none tracking-tight text-ink">
            {orgName}
          </span>
          <Icon name="sort-vertical-linear" size={14} className="text-muted" />
        </div>

        {breadcrumbSlot
          ? breadcrumbSlot
          : breadcrumb && breadcrumb.length > 0 && (
              <nav className="flex min-w-0 items-center gap-2.5 overflow-hidden">
                {breadcrumb.map((crumb) => (
                  <span key={crumb} className="flex items-center gap-2.5">
                    <span className="select-none text-[#d0d0d0]">/</span>
                    <span className="whitespace-nowrap text-sm text-ink">{crumb}</span>
                  </span>
                ))}
              </nav>
            )}
      </div>

      {/* right cluster */}
      <div className="flex items-center gap-[15px]">
        <button type="button" className="text-xs text-ink-2 transition-colors hover:text-ink">
          Feedback
        </button>
        <div className="flex items-center gap-2">
          <CommandSearch />
          <CircleButton icon="question-circle-linear" label="Help" />
          <CircleButton icon="bolt-linear" label="Advisor Center" />
          <Avatar />
        </div>
      </div>
    </header>
  );
}
