import { notFound } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

export const metadata = { title: "Sign in" };

/* Clerk's own card (owner, 2026-08-03: "use clerk stuff just remove the
 * logo") — styled once by the appearance on ClerkProvider, logo slot hidden
 * there. The catch-all segment is what lets Clerk route its own sub-steps
 * (SSO callback, verification) under /sign-in. */
export default function SignInPage() {
  // Without keys there is no auth to sign into, so the route simply isn't there.
  if (!clerkEnabled) notFound();
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas p-6">
      <SignIn />
    </main>
  );
}
