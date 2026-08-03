"use client";

import { useMemo, useState } from "react";
import { useSignedIn } from "@/lib/account";
import { coursesForSchool } from "@/lib/courses";
import { chooseCourses, useIdentity } from "@/lib/identity";
import { CoursePicker } from "@/components/identity/pickers";
import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------ *
 * The one question this app asks: which courses are you taking?
 *
 * Owner, on reaching the dashboard as production user #1 (2026-08-03): "this
 * is a mistake, I should not have been allowed to get here without picking my
 * courses." He was right — signing up landed on a dashboard headed ALL
 * COURSES, every course at 0%, with the only way to narrow it a "Change" link
 * he had no reason to notice.
 *
 * WHY IT ASKS HERE AND NOT EARLIER. Nobody is asked anything before they read
 * — that rule was written for the stranger arriving on a WhatsApp link, whose
 * first three seconds a form would spend. Someone who has just made an
 * account is the opposite person: they have committed, and this is the
 * question that turns a library into their dashboard. So the ask sits exactly
 * at that boundary.
 *
 * WHY IT IS NOT A REDIRECT AFTER SIGN-UP. A reader who signs up from a
 * checkpoint halfway down a step must stay on that step — taking the page
 * away as a reward for signing up is the thing the whole gate design avoids.
 * So this waits on the dashboard instead: sign up at the front door and it is
 * the next thing you see; sign up mid-step and you keep reading, and it asks
 * the first time you come home.
 *
 * "Everything" IS AN ANSWER. There is no dismiss and no X — the owner's whole
 * complaint was getting past this — but "Show me everything" is a real reply
 * that sets the same flag, so a student who genuinely wants all four courses
 * answers once and is never asked again. The distinction lives in
 * `coursesChosen`; see the note on that field.
 * ------------------------------------------------------------------ */

export function CourseSetup() {
  const signedIn = useSignedIn();
  const { identity, hydrated } = useIdentity();
  const [picked, setPicked] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  /* Nobody is asked their school any more, so the offer is the whole library
     (coursesForSchool(null) reads null as "all"). */
  const offered = useMemo(() => coursesForSchool(null), []);

  /* Only ever for a signed-in reader who has not answered. `signedIn === true`
     rather than a truthy check: null means Clerk has not reported yet, and
     asking a student who turns out to be signed in already — or one who isn't
     — is worse than asking a moment later. */
  if (!hydrated || signedIn !== true || !identity || identity.coursesChosen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[rgba(20,20,22,0.34)] p-3 backdrop-blur-[3px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-setup-title"
    >
      <div className="squircle max-h-[calc(100dvh-24px)] w-full max-w-[440px] overflow-y-auto rounded-[28px] border border-line bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_1px_1px_-0.5px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.16)]">
        <h2
          id="course-setup-title"
          className="font-display text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink"
        >
          Which courses are you taking?
        </h2>
        <p className="mt-1.5 text-[14px] leading-5 text-muted">
          Your dashboard, your streak and your coverage all count these. You can change them any
          time in Settings.
        </p>

        <div className="mt-4">
          <CoursePicker
            offered={offered}
            courses={picked}
            query={query}
            onQuery={setQuery}
            onToggle={(slug) =>
              setPicked((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]))
            }
          />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            block
            disabled={picked.length === 0}
            onClick={() => chooseCourses(picked)}
          >
            {picked.length === 0
              ? "Pick at least one"
              : `Study ${picked.length} course${picked.length > 1 ? "s" : ""}`}
          </Button>
          {/* A real answer, not a skip — see the note above. */}
          <Button variant="secondary" size="md" block onClick={() => chooseCourses([])}>
            Show me everything
          </Button>
        </div>
      </div>
    </div>
  );
}
