import Link from "next/link";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import { Account } from "./Account";
import { CommandSearch } from "./CommandSearch";
import { ShareControl } from "./ShareControl";
import { MobileMenuButton } from "./reader/MobileNav";

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
    <header className="app-header app-enter-top fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between gap-2.5 border-b border-line px-4">
      {/* left cluster — the logo lockup sits apart from the breadcrumb */}
      <div className="flex min-w-0 items-center gap-5">
        {/* logo lockup: the wordmark IS the logo — no mark. Mobile adds the
            hamburger before it; desktop adds the org switcher after. */}
        {/* The hamburger is a 32px tap target around a 16px glyph, so it
            carries 8px of its own padding — a 10px gap on top of that left the
            drawer icon floating away from the wordmark on a phone. 4px here
            reads as the ~12px it actually looks like. */}
        <div className="flex items-center gap-1 md:gap-2">
          <MobileMenuButton />
          {/* The lockup is the way home. The course navigator shows one course
              and its steps and nothing above them, so without this a student
              who opened a lesson has no route back to the dashboard. */}
          <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-70 md:gap-2">
            {/* The wordmark is the whole logo, so it gets logo scale — against
                the 48px bar — rather than nav-label scale, and it steps down on
                phones where it shares the bar with the hamburger and the header
                controls.

                THE BURBANK TRIAL IS OVER (owner, 2026-08-08: "for the logo text
                lets go back to familjen as well"). Burbank Big Condensed was
                put on this wordmark on 2026-08-06 to see how the logo's own face
                read as the app's text logo; two days of looking at it settled
                it, and the face goes back to where it was.

                THE SIZES COME BACK TOO — 18/22, not the 20/24 Burbank wore.
                That bump was never a design decision, it was compensation:
                Burbank is CONDENSED and sets narrower at the same point size,
                so the lockup shrank visibly when the face changed under it.
                Leaving 20/24 on a non-condensed face would hand the header a
                wordmark a size too big for a reason that no longer exists.

                AND THE LICENCE QUESTION LEAVES THE APP WITH IT. Burbank is a
                Font Bureau retail family with no licence recorded beside it in
                this repo, which made every deploy of this header a small bet.
                It is still vendored and still drawn on "/" — the ◯B disc and
                the Booklesss lockup there are the owner's Framer design — so
                the question is deferred, not answered. It has to be settled
                before that mark reaches print or an app icon. */}
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
        {/* Was "Feedback", a button with no handler behind it. Sharing is what
            a student actually does from here — see ShareControl.tsx. */}
        <ShareControl />
        <div className="flex items-center gap-2">
          {/* No button for the right (step context) drawer. It was a third
              control in a three-control bar, and the swipe already opens it —
              swipe left from anywhere in the step. */}
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
