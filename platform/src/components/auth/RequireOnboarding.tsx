"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountRead, useSignedIn } from "@/lib/account";
import { authEnabled } from "@/lib/auth";
import { onboardingComplete, useIdentity } from "@/lib/identity";
import { currentPath, onboardingHref } from "@/lib/next-path";

/**
 * Nothing renders here until the student's record is complete.
 *
 * Owner, 2026-08-04, having landed on his own dashboard as a signed-in user
 * with an empty record: "a user is never supposed to hit this screen with
 * incomplete information from onboarding." What he saw was a greeting with no
 * name over four tiles of dashes, headed ALL COURSES — every part of it
 * correct code reading a record nobody had filled in.
 *
 * WHY A HOLD AND NOT A FLASH. RequireAccount, next door, deliberately lets its
 * page paint for the instant before it redirects: the dashboard shows nobody
 * else's data, so a signed-out glimpse of it leaks nothing. That argument does
 * not transfer. Here the page itself IS the problem — a dashboard of dashes is
 * the app telling a new student it has nothing for them, in the first ten
 * seconds of their account. So this one renders its children or renders
 * nothing, and never the half-filled version in between.
 *
 * WHAT IT COSTS, AND WHY THAT IS ALMOST NOTHING. The answers live on the
 * device, so a student who HAS finished is through on the first client render
 * — this waits on localStorage, not on Clerk. Only an unfinished record has to
 * wait for the account, and only to find out whether the answers are already
 * up there (see useAccountRead: signing in on a second device is signed-in a
 * beat before the answers arrive, and bouncing that student into onboarding to
 * re-answer would be this same bug from the other side).
 *
 * WHERE THE ASKING HAPPENS: /onboarding, and only there. This used to be a
 * modal on the dashboard (the deleted CourseSetup) that asked one of the three
 * questions with the unfinished page behind it. One question is not the record,
 * and a page you can see past is not a gate.
 *
 * NOT A GATE ON READING. Steps and course pages stay open to everyone, signed
 * in or not — that is the growth loop, and it is untouched. This is the
 * dashboard alone, which already belongs to people with an account.
 */
export function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const signedIn = useSignedIn();
  const accountRead = useAccountRead();
  const { identity, hydrated } = useIdentity();

  const complete = hydrated && onboardingComplete(identity);

  /* Send them to answer only once every softer explanation is ruled out: the
     device has been read, the session has reported, and the account's own
     record has landed. `signedIn === true` and never truthy, for the reason
     lib/account documents — "we haven't heard yet" is not "signed out". */
  const send = authEnabled && signedIn === true && accountRead && hydrated && !complete;

  /* CARRYING WHERE THEY WERE. Onboarding is a page, so being sent there means
     leaving whatever was on screen; `?next=` is how it puts them back
     afterwards, and reader/LessonReader restores the scroll offset once the
     path is right. Read off `window.location` inside the effect rather than
     from `useSearchParams`, which would force a Suspense boundary onto every
     page this component wraps. */
  useEffect(() => {
    if (send) router.replace(onboardingHref(currentPath()));
  }, [send, router]);

  /* THE HOLD HAS A FLOOR UNDER IT. Everything above waits on the session
     resolving, and it not resolving is a real state on a Zambian connection: a
     student
     with an unfinished record and a session that never resolves would sit on a
     blank page for as long as they were willing to. After four seconds the
     hold says so and offers the door, which is where they were going anyway.
     Four rather than one, so a slow handshake resolves in silence instead of
     accusing itself in front of somebody whose page was about to load. */
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    if (complete) return;
    const t = setTimeout(() => setStuck(true), 4000);
    return () => clearTimeout(t);
  }, [complete]);

  // No keys means no accounts, no onboarding and nothing to gate — the same
  // no-op RequireAccount makes, and for the same reason: a redirect here would
  // strand the reader on a door that opens nowhere.
  if (!authEnabled) return <>{children}</>;

  /* Complete is the only way through, and it does not consult the session: a
     student with a filled record is a student with a filled record whether or
     not the session has resolved yet. A signed-OUT visitor with one is RequireAccount's
     business, and it is already sending them to the front door. */
  if (complete) return <>{children}</>;

  return stuck ? (
    <div className="mx-auto w-full max-w-[900px] px-4 pt-28 md:px-6 md:pt-36">
      <p className="text-[14px] leading-6 text-muted">
        Still setting up your dashboard.{" "}
        <Link href={onboardingHref()} className="font-medium text-ink underline underline-offset-2">
          Finish your setup
        </Link>{" "}
        and it will have something to show.
      </p>
    </div>
  ) : null;
}
