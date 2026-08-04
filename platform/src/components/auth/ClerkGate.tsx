"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAccountAsk } from "@/lib/onboarding";

/* THE GATE SENDS PEOPLE TO ONBOARDING. It used to open Clerk's modal.
 *
 * Owner, 2026-08-04: "when someone not signed in lands on something like a step
 * page and they have to sign in just send them into onboarding — which makes it
 * strange to put the sign in modal where it is."
 *
 * He is right, and the reason is that the modal's justification quietly expired.
 * It opened over whatever the reader was doing so nobody lost their place; that
 * was worth the seam of a different-looking card appearing mid-page. But
 * everyone who signs up now has five questions to answer before the app is any
 * use to them, so the modal was never the end of the journey — it was a card
 * over a page, followed by a navigation to the questions anyway. Two context
 * switches where one will do.
 *
 * `after` is what keeps the promise the modal was making. A reader stopped by a
 * checkpoint halfway down a step is returned to that step, not dumped on the
 * dashboard — see the onboarding flow's `finish`.
 *
 * WHAT THIS COMPONENT STILL EXISTS FOR is unchanged, and it is the reason
 * requireAccount() was not simply replaced with a router call at each of its six
 * sites: the gates are ordinary pieces of a static page — a checkpoint button, a
 * next-step link, a note, a comment — and none of them can be sure a router or a
 * Clerk provider is above them. One component watching one store keeps that true.
 * It no longer touches Clerk at all, which is why the import is gone.
 *
 * NOT GATING THE READING. Steps and course pages stay open to everyone, signed
 * in or not (owner, same call: the gate is unchanged, only relocated). This
 * fires when a gate ALREADY fired — recording an answer, taking a note, the free
 * step running out — never on arrival.
 */
export function ClerkGate() {
  const router = useRouter();
  const ask = useAccountAsk();
  const seen = useRef(0);

  useEffect(() => {
    if (ask.seq === 0 || ask.seq === seen.current) return;
    seen.current = ask.seq;

    /* Where to land once they are through. `ask.after` where a gate named a
       destination, otherwise the page they were on — spelled out rather than
       left empty, because this is a navigation now and "stay put" has to be a
       URL for the flow to come back to. */
    const after = ask.after ?? window.location.pathname + window.location.search;

    const params = new URLSearchParams({ after });
    /* The mode the ask opened in, so a "Sign in" button lands on the sign-in
       side of the form rather than making an existing student find the toggle. */
    if (ask.mode === "sign-in") params.set("mode", "sign-in");
    /* An email the landing card already collected, so the form opens filled in
       rather than asking for it twice. */
    if (ask.email) params.set("email", ask.email);

    router.push("/onboarding?" + params);
  }, [ask, router]);

  return null;
}
