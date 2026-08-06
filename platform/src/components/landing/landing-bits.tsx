"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { useProgress } from "@/lib/progress";

/* The landing page's client piece. Singular now: the front door became one
 * screen on 2026-08-06 (see app/page.tsx) and the whole of it is static, so
 * the only thing left that needs the browser is the redirect below — which
 * draws nothing either. */

/** Sends people who already live here past the front door. A signed-in
 *  student, or a device with real studying on it, opening booklesss.app
 *  wants their dashboard, not the pitch — the pitch is for people who
 *  haven't answered "what is this" yet. `replace` so the landing doesn't
 *  sit in history making the back button bounce them through it again. */
export function ToApp() {
  const router = useRouter();
  const signedIn = useSignedIn();
  const { hydrated, daysStudied } = useProgress();

  useEffect(() => {
    if (signedIn === true || (hydrated && daysStudied > 0)) router.replace("/dashboard");
  }, [signedIn, hydrated, daysStudied, router]);

  return null;
}

/* `LandingAuth` lived here — the sign-up card, inline on the front door, so a
 * stranger could make an account without leaving the page. It went with the
 * rest of the old landing on 2026-08-06: the new design has one control and it
 * is a link. The card itself is not lost, it is AuthPanel, which /sign-up
 * renders on its own route and which the CTA now points at. */
