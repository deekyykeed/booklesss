import { notFound, redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

export const metadata = { title: "Sign in" };

/**
 * THE FRONT OF THIS ROUTE REDIRECTS; ITS SUB-STEPS STILL RENDER CLERK.
 *
 * `/sign-in` used to render Clerk's own card, which by 2026-08-04 made it one
 * of four ways into the same product — alongside Clerk's card on "/", Clerk's
 * card at /sign-up, and the real one at /onboarding. Only /onboarding is ours,
 * and only /onboarding derives a handle (lib/handle), so every account made
 * through here came out second class: a different-looking form and no @name.
 *
 * WHY THE CARD IS STILL HERE FOR SUB-PATHS, AND WHY THAT IS NOT AN OVERSIGHT.
 * The catch-all segment exists so Clerk can route its own sub-steps underneath
 * this URL — email verification, SSO callback, factor-one challenges. Those
 * links are minted by Clerk and land in a student's inbox, and a blanket
 * redirect would answer a verification email with the sign-in form it was
 * meant to complete. So only the BARE route moves; anything below it is a flow
 * already in progress and is left to finish.
 *
 * It is also the standing fallback if the custom form ever fails on a device
 * we cannot reproduce: Clerk's card is one URL away and still works.
 *
 * `redirect()` is a 307, so nothing is cached against a decision that may be
 * revisited. `mode=sign-in` opens the account step on the sign-in side, so
 * somebody who asked to sign in is not made to find a toggle.
 */
export default async function SignInPage({
  params,
}: {
  params: Promise<{ "sign-in"?: string[] }>;
}) {
  // Without keys there is no auth to sign into, so the route simply isn't there.
  if (!clerkEnabled) notFound();

  const { "sign-in": rest } = await params;
  if (!rest?.length) redirect("/onboarding?mode=sign-in");

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas p-6">
      <SignIn />
    </main>
  );
}
