"use client";

import { useEffect, useRef, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { MynaIcon } from "@/components/icons/myna";
import { useAccountAsk, type OnboardingMode, type OnboardingReason } from "@/lib/onboarding";

/* ------------------------------------------------------------------ *
 * The one place an account is asked for, and it opens over the page.
 *
 * Replaces ClerkGate (2026-08-05), keeping its shape exactly: the things that
 * ask are a checkpoint button halfway down a step and a next-step link in the
 * footer, and they are ordinary pieces of a static page. So they call
 * `requireAccount()` — a plain function on a module store — and exactly one
 * component consumes the ask and puts a form on screen. Nothing else in the app
 * imports anything auth-shaped.
 *
 * WHY THAT INDIRECTION SURVIVED THE MIGRATION even though it was built for
 * Clerk's constraint (its hooks throw without a provider). Two reasons that are
 * ours rather than Clerk's: a build with no Supabase keys must still render
 * every step, and a gate that lives in one component is a gate that cannot be
 * half-implemented across four call sites.
 *
 * NOBODY LOSES THEIR PLACE. The sheet opens over whatever the reader was doing
 * and closes back onto it — `after` is null for every in-page gate, so a
 * checkpoint answered at the foot of a step leaves them at the foot of that
 * step with a session. This is the same promise Clerk's modal made and the
 * reason a redirect to /sign-up was never the answer.
 * ------------------------------------------------------------------ */

/** The one line above the form, chosen by why we asked. Clerk's card said
 *  Clerk's words and the reason was carried but unused; it says ours now.
 *  Sign-in never gets a reason — somebody who already has an account did not
 *  need talking into it.
 *
 *  `mode` NOW CHOOSES WORDS AND NOTHING ELSE (2026-08-07). The form below does
 *  both jobs from one box, so this is a greeting picked by what the caller was
 *  asking for, not a branch — a gate that opens on "sign-in" still creates an
 *  account for somebody who turns out not to have one. */
const WHY: Record<OnboardingReason, string> = {
  checkpoint: "Make an account to keep your answers and your streak.",
  note: "Make an account so your notes are here next time.",
  comment: "Make an account to post that.",
  "next-step": "Make an account to keep reading.",
  manual: "Your courses, your progress and your notes, on any phone you sign in on.",
};

export function AuthGate() {
  const ask = useAccountAsk();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<OnboardingMode>("sign-up");
  const seen = useRef(0);

  /* One ask, one opening. `seq` is what makes a second tap reopen a sheet the
     reader closed — comparing the rest of the fields would swallow it. */
  useEffect(() => {
    if (ask.seq === 0 || ask.seq === seen.current) return;
    seen.current = ask.seq;
    setMode(ask.mode);
    setOpen(true);
  }, [ask]);

  /* Escape closes it, the way every other dialog on a keyboard does — and the
     way the settings sheet next door already does. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* The page behind must not scroll under an open sheet. A phone keyboard
     appearing over a dialog turns a scrollable body into a page that drifts
     while somebody is typing their password into it. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const signUp = mode === "sign-up";

  return (
    <div
      className="fixed inset-0 z-[110] grid items-start justify-items-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px] sm:items-center"
      /* Tapping the dimmed area closes it, which is what everyone tries first.
         `target === currentTarget` so a drag that starts inside the panel and
         releases over the backdrop doesn't count as tapping outside. */
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      {/* z-110, one above the settings sheet's 100: a gate can be raised from
          inside settings ("forget this device", then read a step) and the one
          asking the question has to be the one on top. */}
      <div
        className="flex w-full flex-col overflow-hidden rounded-[12px] bg-white"
        style={{
          maxWidth: 420,
          fontFamily: "var(--font-sans)",
          color: "rgb(11,11,11)",
          boxShadow:
            "0 0 0 1px rgba(11,11,11,0.06), 0 8px 24px -8px rgba(0,0,0,0.10), 0 24px 48px -12px rgba(0,0,0,0.16)",
        }}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <h2 id="auth-title" style={{ fontSize: 22, fontWeight: 580, lineHeight: "28px" }}>
            {signUp ? "Create your account" : "Welcome back"}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-transparent transition-colors hover:bg-[rgba(11,11,11,0.05)]"
          >
            <MynaIcon name="x" size={18} strokeWidth={1.6} />
          </button>
        </div>

        {signUp && (
          <p className="px-5 pt-1" style={{ fontSize: 14, lineHeight: "20px", color: "rgb(137,135,129)" }}>
            {WHY[ask.reason]}
          </p>
        )}

        <div className="px-5 pb-6 pt-4">
          {/* NO `afterNew`. A student who turns out to be new gets their
              account made and stays exactly where they were — the sheet's whole
              promise. RequireOnboarding asks the questions the moment they
              reach for the dashboard, which is the first screen that needs an
              answer to draw anything. */}
          <AuthForm initialEmail={ask.email} after={ask.after} onDone={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
