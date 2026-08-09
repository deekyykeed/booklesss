import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authEnabled } from "@/lib/auth";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

/* `noindex`, like /sign-in and /onboarding: this is the end of an emailed link,
 * not a page anyone should reach from a search. */
export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

/* ⚠️ THIS ROUTE MUST BE LISTED IN SUPABASE'S REDIRECT ALLOWLIST or the emailed
 * link will not come here. Dashboard → Authentication → URL Configuration →
 * Redirect URLs must include `https://booklesss.app/reset-password` (and the
 * Vercel preview host, and `http://localhost:3000/reset-password` for local
 * work). Supabase silently falls back to the Site URL for any redirect it does
 * not recognise, so the failure looks like "the link dumps me on the homepage,
 * signed out" rather than like an error.
 *
 * NOT a Server Component gate: the recovery tokens arrive in the URL FRAGMENT,
 * which the server never sees. Everything real happens in the client component
 * — see the note at the top of ResetPasswordForm. */
export default function ResetPasswordPage() {
  if (!authEnabled) notFound();
  return (
    <>
      <div className="bg-waves" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      {/* The same frosted surface the sign-in and onboarding pages wear, so
          arriving here from an email does not feel like a different product. */}
      <main className="relative z-10 min-h-dvh bg-white/[0.62] backdrop-blur-[16px]">
        <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-6 py-16">
          <h1 className="font-display text-[26px] font-medium leading-tight text-ink">
            Set a new password
          </h1>
          <p className="mt-2 mb-8 text-[14px] leading-5 text-muted">
            Pick something you haven&apos;t used anywhere else.
          </p>
          <ResetPasswordForm />
        </div>
      </main>
    </>
  );
}
