import Link from "next/link";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import { clerkEnabled } from "@/lib/clerk";
import { Account as ClerkAccount } from "./Account";
import { ClerkIsland } from "./ClerkIsland";
import { CommandSearch } from "./CommandSearch";
import { MobileMenuButton, MobileContextButton } from "./reader/MobileNav";

/* Shared, fixed 48px header. Transparent so the blob backdrop shows through;
 * the only boxy element is the 1px #dfdfdf bottom hairline. px-16, space-between. */

function CircleButton({ icon, label, className = "" }: { icon: MynaIconName; label: string; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={
        "grid h-8 w-8 place-items-center rounded-full border border-[#d4d4d4] bg-white text-muted shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)] transition-colors hover:text-ink " +
        className
      }
    >
      <MynaIcon name={icon} size={16} />
    </button>
  );
}

/* Same shell as the circle buttons beside it — white, one #d4d4d4 hairline,
 * the same three-layer shadow. It used to be a green disc, which made the one
 * control that isn't about progress the loudest thing in the header; green is
 * reserved for completion. */
function Avatar() {
  return (
    <div
      className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border border-[#d4d4d4] bg-white text-[11px] font-semibold text-ink-2 shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)]"
      aria-label="Account"
    >
      DM
    </div>
  );
}

/* Account control. With Clerk configured this is the real thing — the user
 * menu once signed in, a sign-in button when not. Without keys it stays the
 * static placeholder avatar the header has always shown, so an unconfigured
 * clone looks unchanged. */
function Account() {
  if (!clerkEnabled) return <Avatar />;
  // If auth fails to load, fall back to the placeholder avatar rather than
  // letting the header take the lesson down with it.
  return (
    <ClerkIsland fallback={<Avatar />}>
      <ClerkAccount />
    </ClerkIsland>
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
    <header className="app-header fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between gap-2.5 border-b border-line px-4">
      {/* left cluster — the logo lockup sits apart from the breadcrumb */}
      <div className="flex min-w-0 items-center gap-5">
        {/* logo lockup: the wordmark IS the logo — no mark. Mobile adds the
            hamburger before it; desktop adds the org switcher after. */}
        <div className="flex items-center gap-2.5 md:gap-2">
          <MobileMenuButton />
          {/* The lockup is the way home. The course navigator shows one course
              and its steps and nothing above them, so without this a student
              who opened a lesson has no route back to the dashboard. */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70 md:gap-2">
            {/* The wordmark is the whole logo, so it gets logo scale — 22px
                against the 48px bar — rather than nav-label scale. On phones it
                shares the bar with the hamburger and the header controls, so it
                steps down to 18px. font-bold is already the heaviest weight
                Familjen Grotesk ships. */}
            <span className="font-display text-[18px] font-bold leading-none tracking-tight text-ink md:text-[22px]">
              {orgName}
            </span>
          </Link>
          <MynaIcon name="chevron-down" size={14} className="hidden text-muted md:block" />
        </div>

        {/* desktop only — on mobile the drawer carries navigation instead */}
        <div className="hidden min-w-0 md:flex">
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
      </div>

      {/* right cluster */}
      <div className="flex items-center gap-[15px]">
        <button type="button" className="text-xs text-ink-2 transition-colors hover:text-ink">
          Feedback
        </button>
        <div className="flex items-center gap-2">
          {/* Opens the right (step context) drawer — mirror of the left hamburger */}
          <MobileContextButton />
          <CommandSearch />
          {/* Help + advisor are desktop-only; mobile keeps just search + profile */}
          <CircleButton icon="question-circle" label="Help" className="hidden md:grid" />
          <CircleButton icon="zap" label="Advisor Center" className="hidden md:grid" />
          <Account />
        </div>
      </div>
    </header>
  );
}
