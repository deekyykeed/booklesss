"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

/* Where Google sends the browser back mid-OAuth (see AuthForm's Google
 * button: `redirectCallbackUrl` points here). Clerk's callback component
 * finishes the handshake — trading the returned code for a session, creating
 * the account if this Google user is new — and then forwards to the
 * `redirectUrl` the button asked for, which is the page the reader was on.
 *
 * A student sees this page for well under a second, so it says one quiet
 * line rather than drawing chrome. */
export default function SSOCallback() {
  if (!clerkEnabled) return null;
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas">
      <p className="text-[14px] text-muted">Signing you in…</p>
      <AuthenticateWithRedirectCallback />
    </main>
  );
}
