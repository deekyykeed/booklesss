"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";
import { useInstall } from "@/lib/install";
import { closeOnboarding, useOnboarding, type OnboardingReason } from "@/lib/onboarding";
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
 * Dismissible, unlike IdentityGate. That gate is the first-visit "who's
 * reading" and refuses to be skipped; this one interrupts someone mid-read,
 * and a student who would rather keep reading should be able to.
 * ------------------------------------------------------------------ */

const WHY: Record<OnboardingReason, string> = {
  checkpoint: "Save this answer, and everything else you tick, to your account.",
  "next-step": "Create an account to carry on to the next step.",
  manual: "Your progress follows you to any phone or laptop you sign in on.",
};

export function Onboarding() {
  const { open, reason, after } = useOnboarding();
  const { isSignedIn } = useAuth();
  const [mode, setMode] = useState<"sign-up" | "sign-in">("sign-up");
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
              Onboarding
            </h2>
            <p className="mt-1 text-[14px] leading-5 text-muted">{WHY[reason]}</p>
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
          <AuthForm mode={mode} redirectTo={after ?? ""} />
        </div>

        <p className="mt-4 text-center text-[13.5px] text-muted">
          {mode === "sign-up" ? "Already have an account? " : "New here? "}
          <button
            type="button"
            onClick={() => setMode(mode === "sign-up" ? "sign-in" : "sign-up")}
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
