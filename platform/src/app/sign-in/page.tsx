import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authEnabled } from "@/lib/auth";
import { AuthPanel } from "@/components/auth/AuthPanel";

/* `noindex` for the same reason /onboarding carries it: this is a funnel, not a
 * page anyone should arrive at from a search. The landing at "/" is what Google
 * reads. */
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/* FLATTENED FROM A CATCH-ALL (2026-08-05). This was `[[...sign-in]]`, which
 * existed so Clerk could route its own sub-steps — the SSO callback and email
 * verification — underneath it. Supabase needs none of that: password sign-in
 * is one request, and an OAuth callback, if Google is ever turned on, lands on
 * its own /auth/callback route rather than under here. A catch-all left in
 * place would quietly serve this page for /sign-in/anything. */
export default function SignInPage() {
  // Without keys there is no auth to sign into, so the route simply isn't there.
  if (!authEnabled) notFound();
  return (
    <>
      <div className="bg-waves" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <main className="relative z-10 grid min-h-dvh place-items-center p-6">
        <AuthPanel initialMode="sign-in" />
      </main>
    </>
  );
}
