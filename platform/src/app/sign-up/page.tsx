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
      {/* The onboarding page's surface — see sign-in/page.tsx and
          app/onboarding/page.tsx. Sign-up hands straight over to the questions,
          so the two screens have to be the same screen. */}
      <main className="relative z-10 min-h-dvh bg-white/[0.62] backdrop-blur-[16px]">
        <AuthPanel initialMode="sign-up" />
      </main>
    </>
  );
}
