"use client";

import { useAccountUser, useSignedIn, type AccountUser } from "@/lib/account";
import { useIdentity } from "@/lib/identity";
import { requireAccount } from "@/lib/onboarding";
import { HomeView } from "./HomeView";

/* Supplies the signed-in name to the greeting. Reads lib/account rather than an
 * auth SDK, so it needs no provider above it. */

/**
 * A name to greet someone by, in descending order of how deliberately they
 * chose it.
 *
 * THE IDENTITY RECORD COMES FIRST, and that is the change Supabase auth allowed
 * (2026-08-05). Under Clerk this function had four rungs, three of which were
 * Clerk profile fields — firstName, fullName, username — that existed only
 * because AccountSignal wrote the onboarding name UP onto the Clerk user, so
 * that the greeting could read it back down. That round trip is gone: the name
 * a student typed in onboarding is on their identity record and on their
 * `students` row, and both are already in hand here.
 *
 * `nameChosen` is what separates a name they typed from the avatar's — every
 * record has a name, and greeting somebody as "Astronaut" is worse than
 * greeting them by their email's first token.
 */
function displayName(user: AccountUser, chosen: string | null): string | undefined {
  // "Deeky Mvula" -> "Deeky". Greet by first name, not full name.
  if (chosen) return chosen.trim().split(/\s+/)[0];

  const local = (user.email ?? "").split("@")[0];
  // Split on the separators and digits people pad addresses with, so
  // "deeky.mvula84" greets as "Deeky" rather than the whole handle.
  const token = local.split(/[._+\-0-9]+/).filter(Boolean)[0];
  return token ? token[0].toUpperCase() + token.slice(1) : undefined;
}

/* Why there's no name, and what to do about it. Progress is stored per user,
 * so this is a real reason to sign in rather than a nag — signed out, it lives
 * in this browser only. */
function SignInPrompt() {
  return (
    <p className="mt-2 text-[13.5px] leading-5 text-muted">
      <button
        type="button"
        onClick={() => requireAccount("manual", null, "sign-in")}
        className="font-medium text-ink underline underline-offset-2 hover:opacity-70"
      >
        Sign in
      </button>{" "}
      to keep your progress across devices.
    </p>
  );
}

export function HomeViewWithUser() {
  const signedIn = useSignedIn();
  const user = useAccountUser();
  const { identity } = useIdentity();
  const chosen = identity?.nameChosen ? identity.name : null;

  // Until the session has resolved, show neither a name nor a prompt —
  // otherwise the prompt flashes up and is replaced by a name a moment later.
  return (
    <HomeView
      name={signedIn && user ? displayName(user, chosen) : undefined}
      afterGreeting={signedIn === false ? <SignInPrompt /> : null}
    />
  );
}
