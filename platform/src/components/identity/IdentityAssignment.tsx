"use client";

import { useEffect } from "react";
import { assignIdentity } from "@/lib/identity";

/* Gives a new device its avatar and its name, and renders nothing at all.
 *
 * This replaced the "Who's reading?" form (owner, 2026-08-02, built 2026-08-03).
 * That form asked four things — a name, a face, a university, a course list —
 * across three screens, and it asked them before a word of the lesson, of
 * someone who had just tapped a link in a WhatsApp group. It was not
 * dismissible, on the reasoning that a skip link would be taken every time.
 * Which was true, and was the answer: a question everyone would skip is a
 * question not worth asking at the door.
 *
 * So nothing is asked. The device is assigned one of the twelve avatars and
 * takes that avatar's name, and the reader meets the lesson they came for. The
 * university and course list live in Settings for anyone who wants their
 * dashboard narrowed; unanswered is a normal, permanent state.
 *
 * Why a component rather than a call in the root layout: this has to run in the
 * browser, after hydration, because localStorage does not exist on the server
 * and a name that appears on the server would be a hydration mismatch on every
 * first visit. A mounted client component with an effect is the smallest thing
 * that guarantees both.
 *
 * It runs on EVERY page, including sign-in and the design scratchpads. The old
 * gate skipped those, because a modal over a sign-in screen is asking in the
 * wrong place — but there is no modal now, and an identity is exactly what a
 * sign-up wants to find already sitting on the device so it can connect an
 * account to it.
 */
export function IdentityAssignment() {
  useEffect(() => {
    assignIdentity();
  }, []);

  return null;
}
