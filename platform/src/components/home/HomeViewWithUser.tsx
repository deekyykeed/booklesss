"use client";

import { useUser } from "@clerk/nextjs";
import { requireAccount } from "@/lib/onboarding";
import { HomeView } from "./HomeView";

// Derived from the hook rather than imported from @clerk/types, which isn't a
// direct dependency — this stays correct if Clerk's shape changes under us.
type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

/* Supplies the signed-in name to the greeting. Only mounted when Clerk is
 * configured (the route checks), so useUser always has a provider above it. */

/**
 * A name to greet someone by, in descending order of how deliberately they
 * chose it.
 *
 * firstName alone isn't enough: Clerk only collects it if the instance asks
 * for it at sign-up, so an email-and-password user can be perfectly signed in
 * and still have none — which is what left the greeting bare. Each rung below
 * is something the person actually gave us, ending at the local part of their
 * address, which beats greeting a signed-in student as nobody.
 */
function displayName(user: ClerkUser): string | undefined {
  const first = user.firstName?.trim();
  if (first) return first;

  // "Deeky Mvula" -> "Deeky". Greet by first name, not full name.
  const full = user.fullName?.trim();
  if (full) return full.split(/\s+/)[0];

  const username = user.username?.trim();
  if (username) return username;

  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const local = email.split("@")[0];
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
      {/* Our sheet, not Clerk's modal — same reason as the header button
          (see Account.tsx): Clerk's dialog wears Clerk's dress and the
          dashboard's logo, neither of which is this app. */}
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
  const { isLoaded, user } = useUser();

  // Until Clerk has loaded, show neither a name nor a prompt — otherwise the
  // prompt flashes up and is replaced by a name a moment later.
  return (
    <HomeView
      name={isLoaded && user ? displayName(user) : undefined}
      afterGreeting={isLoaded && !user ? <SignInPrompt /> : null}
    />
  );
}
