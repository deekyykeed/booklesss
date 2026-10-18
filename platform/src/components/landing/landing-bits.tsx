"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignedIn } from "@/lib/account";
import { authEnabled } from "@/lib/auth";
import { useProgress } from "@/lib/progress";

/* The landing page's client piece. Singular now: the front door became one
 * screen on 2026-08-06 (see app/page.tsx) and the whole of it is static, so
 * the only thing left that needs the browser is the redirect below — which
 * draws nothing either. */

/**
 * Sends people who already live here past the front door. A signed-in student
 * opening booklesss.app wants their dashboard, not the pitch — the pitch is for
 * people who haven't answered "what is this" yet. `replace` so the landing
 * doesn't sit in history making the back button bounce them through it again.
 *
 * THIS CONDITION IS THE COMPLEMENT OF RequireAccount'S, AND HAS TO STAY THAT
 * WAY. That component ejects anyone from /dashboard where `authEnabled &&
 * signedIn === false`. So anyone this one lets through on a weaker test than a
 * live session gets sent straight back, and the two redirects run at each other
 * forever: / → /dashboard → / → /dashboard, with `replace` on both ends eating
 * the history that would have let the student escape by going back. The tab is
 * simply lost, and the only way out is retyping the URL of somewhere else.
 *
 * That shipped, and the owner hit it on 2026-08-08 by signing out after a
 * study session. **Signing out was not the bug, it was just the easiest way
 * in.** The old test admitted on `hydrated && daysStudied > 0` with no regard
 * for the session at all, so it caught every device with studying on it and no
 * live account — which includes the anonymous reader who finishes their free
 * step and comes back the next day by typing the domain. That reader is the
 * growth loop's whole target audience, and the front door was a trap for them.
 *
 * WHY PROGRESS ALONE CANNOT BUY ENTRY ANY MORE. It never could — the code just
 * didn't know it. The dashboard has belonged to people with an account since
 * 2026-08-03 (owner: "if the account is not found a user shouldn't be able to
 * see the dashboard"), so on a build with keys, "this device has studied" is
 * not a fact that opens that page. It could only ever buy a redirect that
 * bounced. Gating the branch on `!authEnabled` keeps the shortcut exactly where
 * it is still true: a keyless build — a fresh clone, a preview, CI — where
 * RequireAccount is a no-op and there is no account to lack.
 *
 * `signedIn === true` and never truthy, per lib/account: null is "we haven't
 * heard yet", and admitting on it would only move the collision a beat later,
 * once the session resolved to false on the other side.
 */
export function ToApp() {
  const router = useRouter();
  const signedIn = useSignedIn();
  const { hydrated, daysStudied } = useProgress();

  const through = signedIn === true || (!authEnabled && hydrated && daysStudied > 0);

  useEffect(() => {
    if (through) router.replace("/dashboard");
  }, [through, router]);

  return null;
}

/* `LandingAuth` lived here — the sign-up card, inline on the front door, so a
 * stranger could make an account without leaving the page. It went with the
 * rest of the old landing on 2026-08-06: the new design has one control and it
 * is a link. The card itself is not lost, it is AuthPanel, which /sign-up
 * renders on its own route and which the CTA now points at. */
