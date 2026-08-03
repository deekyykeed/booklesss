import type { Metadata } from "next";
import { openGraph } from "@/lib/site";

/* Terms of service — short, honest, and matching what the product actually
 * is. Linked from Google's OAuth consent screen, so it must stay public and
 * desktop-readable (see DesktopGate's SKIP list). */

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The agreement for reading and studying on Booklesss.",
  alternates: { canonical: "/terms" },
  openGraph: openGraph({
    title: "Terms of service",
    description: "The agreement for reading and studying on Booklesss.",
    path: "/terms",
  }),
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-5 py-12">
      <h1 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.01em] text-ink">
        Terms of service
      </h1>
      <p className="mt-1 text-[13px] text-muted">Last updated 3 August 2026</p>

      <div className="mt-8 flex flex-col gap-6 text-[15px] leading-7 text-ink-2">
        <p>
          Booklesss is a study platform: course notes written as short readable steps, with
          checkpoints that track how your studying is going. Using it means agreeing to the
          following, which we have kept as short as honesty allows.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">What Booklesss is</h2>
        <p>
          Booklesss is independent study material. It is not affiliated with, endorsed by, or
          acting for any university or examining body, and reading it is not enrolment in
          anything. It exists to help you understand your course; your institution's own
          materials and instructions always come first.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">Your account</h2>
        <p>
          You can read without an account. Some actions — saving checkpoint answers, rating
          sections, commenting, reading beyond your first step — need one. Keep your password to
          yourself; what happens under your account is yours. You must be old enough to hold an
          email account to sign up.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">Paid access</h2>
        <p>
          Parts of Booklesss are free. Paid plans unlock full courses, priced in Zambian kwacha
          and shown clearly before you pay. If a plan is not what you expected, message us — we
          would rather refund you than keep money you regret spending.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">The content</h2>
        <p>
          The notes, steps, checkpoints and design are ours. They are for your own studying: do
          not resell them, repost them, or pass them off as your own. Share links, not copies —
          the link is free and it counts who sent it.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">The honest limits</h2>
        <p>
          We work hard to keep the material accurate, but we cannot promise your grade, and we
          are not liable for exam outcomes or for losses beyond what you have paid us. We may
          close accounts that abuse the platform or other readers. These terms are governed by
          the laws of Zambia.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href="mailto:deekymvula@gmail.com" className="text-ink underline underline-offset-2">
            deekymvula@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
