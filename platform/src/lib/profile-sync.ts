"use client";

import { accountShape, type Identity } from "@/lib/identity";
import { getMyReferralCode, referrer } from "@/lib/referral";

/* ------------------------------------------------------------------ *
 * The student's answers, mirrored to the server.
 *
 * TWO copies exist, since 2026-08-05, and each earns its place:
 *   localStorage  — instant, works signed-out and offline, per device.
 *   Supabase      — travels with the person AND is the only one that can be
 *                   ASKED A QUESTION. "What are CBU students being taught?"
 *                   is the question the whole course pipeline depends on, with
 *                   seven of ten universities publishing no curriculum.
 *
 * THERE USED TO BE THREE. The middle one was Clerk's `unsafeMetadata`, and it
 * existed because Clerk's session and Supabase's row were different systems: on
 * a second device, Clerk resolved first and reading the row was a separate call
 * to a separate service. Supabase auth collapsed that — the session and the row
 * are the same client on the same connection, and `auth.uid()` makes an RLS'd
 * read of your own row safe from the browser. So the copy that travels and the
 * copy that answers questions became one copy, which is also the one that is
 * not writable by any signed-in browser.
 *
 * What travelled in that metadata blob now rides this same post as `identity`
 * and is stored verbatim in `students.identity` — see the route handler.
 *
 * FIRE AND FORGET. Nothing waits on this, nothing shows a spinner, nothing
 * reports a failure to the student — the device's copy is already written and
 * is what the app reads. A student on a Zambian connection must never see a
 * sign-up stall because our analytics write was slow.
 * ------------------------------------------------------------------ */

/** The last payload sent, so an effect that re-runs on every identity change
 *  doesn't post the same record repeatedly. Module-level rather than a ref:
 *  it is per-tab state about the network, not about a component. */
let lastSent = "";

export function syncProfile(identity: Identity | null): void {
  if (!identity) return;
  const body = JSON.stringify({
    /* The whole answer set in the shape a second device wants it back in —
       stored as-is in `students.identity`, parsed by `parseAccountIdentity` on
       the next sign-in. It carries the four things the flat columns below
       cannot: `nameChosen` and `coursesChosen` (a name is never empty, so only
       these can say whether anybody was ASKED), `since`, and the `updatedAt`
       clock the merge is decided on. */
    identity: accountShape(identity),
    deviceId: identity.id,
    name: identity.name,
    avatarId: identity.avatar,
    school: identity.school,
    schoolName: identity.schoolName,
    programme: identity.programme,
    programmeName: identity.programmeName,
    year: identity.year,
    semester: identity.semester,
    curriculum: identity.curriculum,
    courses: identity.courses,
    typedCourses: identity.typedCourses,
    target: identity.target,
    studyWindow: identity.studyWindow,
    /* The one field here that can reach a person. It rides the same
       fire-and-forget post as everything else, because a number that fails to
       send is a number we ask for again on the next sign-in — not a reason to
       hold up a student's sign-up. */
    whatsapp: identity.whatsapp,
    heardFrom: identity.heardFrom,
    /* ------------------------------------------------------------------ *
     * The referral, made COUNTABLE.
     *
     * Both halves already existed and neither could be queried. `referredBy`
     * has been written to Clerk's unsafeMetadata since referrals landed, which
     * records who brought a student and makes "how many did Deeky bring"
     * answerable only by exporting every user and counting in memory. And a
     * student's own code was derived on the fly for their share links and
     * stored nowhere at all, so there was nothing for the other side of that
     * count to join against.
     *
     * Sending both puts one row per student in a table where the join is a
     * GROUP BY — which is what "trackable like an affiliate link" means
     * (owner, 2026-08-04). Nothing else about the referral loop changes: the
     * code is still derived, still name-based, still nothing to migrate.
     * ------------------------------------------------------------------ */
    referredBy: referrer(),
    referralCode: getMyReferralCode(),
  });
  if (body === lastSent) return;
  lastSent = body;

  fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    /* Survives the tab closing on the last step of onboarding, which is
       exactly when the most complete record exists and exactly when a student
       is most likely to leave. */
    keepalive: true,
  }).catch(() => {
    // Offline, blocked, or the route is not deployed. The answers are on the
    // device, which is the copy the app renders from; the next sign-in re-sends
    // them. Clearing lastSent is what makes that retry possible.
    lastSent = "";
  });
}
