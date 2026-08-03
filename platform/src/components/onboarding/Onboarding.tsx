"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";
import { useInstall } from "@/lib/install";
import { closeOnboarding, setOnboardingMode, useOnboarding, type OnboardingReason } from "@/lib/onboarding";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";
import { MynaIcon } from "@/components/icons/myna";

/* ------------------------------------------------------------------ *
 * Onboarding — the sheet where signing up actually happens.
 *
 * NOT a page. /sign-in and /sign-up still exist as real routes, because a
 * link has to go somewhere and a browser has to be able to bookmark it, but
 * no student is sent to them: the owner's flow (2026-08-03) is that nobody is
 * asked anything until they do something that needs an account, and then this
 * comes up over whatever they were reading. Sending them to a page instead
 * would lose their place, which is the whole thing this avoids.
 *
 * It is opened by `requireAccount(reason, after)` from lib/onboarding — from
 * a checkpoint answer, or from the gate on moving to the next step. It says
 * WHY it appeared, because a sheet that interrupts without explaining itself
 * is one people close.
 *
 * Dismissible, and now the ONLY thing in the app that ever interrupts a
 * reader. The first-visit "who's reading?" form that used to sit in front of
 * this is gone — a name and a face are assigned silently — so this sheet is no
 * longer the second interruption of a first visit but the first, and it earns
 * that by arriving at a moment the student created, not on arrival.
 * ------------------------------------------------------------------ */

/* What the sheet says, per the thing that raised it: a heading naming what the
 * reader gets, and a line saying why they are being stopped.
 *
 * The heading was "Onboarding" for every reason, which is OUR word for this
 * sheet and not a thing anybody would say to a student — it named the
 * mechanism to the one person who has no use for its name. A heading has to be
 * about them: what they keep, or where they are going. */
const SAYS: Record<OnboardingReason, { title: string; why: string }> = {
  checkpoint: {
    title: "Keep your answers",
    why: "Answering checkpoints needs an account, so what you tick is yours on any phone you sign in on.",
  },
  "next-step": {
    title: "Carry on",
    why: "Create an account to keep reading, and pick up where you left off next time.",
  },
  manual: {
    title: "Take this with you",
    why: "Your progress follows you to any phone or laptop you sign in on.",
  },
};

export function Onboarding() {
  /* `mode` is store state, not local: each opening starts on the form the
     caller asked for — the header's "Sign in" opens onto sign-in, a gate onto
     sign-up — and a local copy would need an effect to follow that. The
     toggle at the bottom writes back through setOnboardingMode. */
  const { open, reason, after, mode } = useOnboarding();
  const { isSignedIn } = useAuth();
  const { canInstall, showIosHelp, install } = useInstall();

  // Signing in is what the sheet is for, so getting one closes it.
  useEffect(() => {
    if (open && isSignedIn) closeOnboarding();
  }, [open, isSignedIn]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOnboarding();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // With no Clerk keys there is no account to make, so the sheet cannot help.
  if (!clerkEnabled || !open) return null;

  return (
    <div className="onboarding-scrim" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="onboarding-sheet squircle">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="onboarding-title" className="font-display text-[22px] font-medium leading-tight text-ink">
              {SAYS[reason].title}
            </h2>
            <p className="mt-1 text-[14px] leading-5 text-muted">{SAYS[reason].why}</p>
          </div>
          <button
            type="button"
            onClick={closeOnboarding}
            aria-label="Close"
            className="squircle -mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-active hover:text-ink"
          >
            <MynaIcon name="x" size={18} />
          </button>
        </div>

        <div className="mt-5">
          {/* `after` is null for a checkpoint ask, and null means stay on this
              step — see AuthForm. It used to pass "" here, which would have
              been router.push(""); nothing had ever called requireAccount(),
              so nothing had ever run it. */}
          <AuthForm mode={mode} redirectTo={after} />
        </div>

        <p className="mt-4 text-center text-[13.5px] text-muted">
          {mode === "sign-up" ? "Already have an account? " : "New here? "}
          <button
            type="button"
            onClick={() => setOnboardingMode(mode === "sign-up" ? "sign-in" : "sign-up")}
            className="text-ink underline underline-offset-2"
          >
            {mode === "sign-up" ? "Sign in" : "Create one"}
          </button>
        </p>

        {/* Install, at the bottom — owner's ask. Only shown when it can
            actually do something: a device that has already installed the app
            gets nothing here rather than a button that does nothing. */}
        {(canInstall || showIosHelp) && (
          <div className="mt-5 border-t border-line pt-4">
            {canInstall ? (
              <Button variant="secondary" size="md" block onClick={install}>
                <MynaIcon name="download" size={16} />
                Install Bklsss on this phone
              </Button>
            ) : (
              <p className="text-center text-[13px] leading-5 text-muted">
                To install: tap <span className="text-ink">Share</span>, then{" "}
                <span className="text-ink">Add to Home Screen</span>.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
