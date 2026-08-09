"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SIGN_IN_URL, SIGN_UP_URL } from "@/lib/auth";
import { currentPath, safeNext } from "@/lib/next-path";
import { useAccountAsk } from "@/lib/onboarding";

/* ------------------------------------------------------------------ *
 * The one place an account-ask becomes a navigation.
 *
 * REPLACES AuthGate, the sheet (2026-08-09, owner: a reader who came in
 * through a shared step link and taps a gated control "should actually go
 * into onboarding", not meet a popup). The sheet's file is gone — this
 * codebase's rule is that a replaced option lives in git, not parked in the
 * tree; it's at ddba5b9 and earlier if it's ever argued back.
 *
 * WHY THE INDIRECTION STAYS even though the sheet it was built to open is
 * gone: the gates that ask are plain click handlers on static pages with no
 * router of their own, and a gate that lives in one component cannot be
 * half-implemented across four call sites. They call `requireAccount()`; this
 * component, mounted once in the root layout, turns the ask into a soft
 * `router.push` — no full page load on mobile data.
 *
 * WHAT THE URL CARRIES. `next` is where the round trip ends — the ask's
 * `after` if the caller named a destination (the next-step gate names the
 * step being reached for), otherwise wherever the reader is standing,
 * hash included, so a checkpoint tapped mid-step comes back to that section.
 * `why` is the reason the gate fired, and AuthPanel turns it into the one
 * line above the form. Both are validated on the way out AND read back
 * through `safeNext` on the way in — a query param is stranger input even
 * when we wrote it (see lib/next-path).
 * ------------------------------------------------------------------ */

export function AuthRedirect() {
  const router = useRouter();
  const ask = useAccountAsk();
  const seen = useRef(0);

  /* One ask, one navigation. `seq` is what makes a second tap re-navigate
     after the reader pressed Back on the form — comparing the other fields
     would swallow it. */
  useEffect(() => {
    if (ask.seq === 0 || ask.seq === seen.current) return;
    seen.current = ask.seq;
    const next = safeNext(ask.after ?? currentPath());
    const base = ask.mode === "sign-in" ? SIGN_IN_URL : SIGN_UP_URL;
    const qs = new URLSearchParams({ next });
    if (ask.reason !== "manual") qs.set("why", ask.reason);
    router.push(`${base}?${qs.toString()}`);
  }, [ask, router]);

  return null;
}
