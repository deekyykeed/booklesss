import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authEnabled } from "@/lib/auth";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

/* See sign-in/page.tsx — same page, opened on the other card, and flattened
 * from a catch-all for the same reason. */
export default function SignUpPage() {
  if (!authEnabled) notFound();
  return (
    <>
      <div className="bg-waves" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <main className="relative z-10 grid min-h-dvh place-items-center p-6">
        <AuthPanel initialMode="sign-up" />
      </main>
    </>
  );
}
