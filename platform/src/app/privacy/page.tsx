import type { Metadata } from "next";
import { openGraph } from "@/lib/site";

/* The privacy policy — written to what the app actually does, not to a
 * template. If a feature changes what is collected (server-side progress,
 * analytics, payments), this page changes in the same PR. Google's OAuth
 * consent screen links here, so it must stay public and desktop-readable
 * (see DesktopGate's SKIP list). */

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Booklesss stores, where it lives, and what it is never used for.",
  alternates: { canonical: "/privacy" },
  openGraph: openGraph({
    title: "Privacy policy",
    description: "What Booklesss stores, where it lives, and what it is never used for.",
    path: "/privacy",
  }),
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-5 py-12">
      <h1 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.01em] text-ink">
        Privacy policy
      </h1>
      <p className="mt-1 text-[13px] text-muted">Last updated 3 August 2026</p>

      <div className="mt-8 flex flex-col gap-6 text-[15px] leading-7 text-ink-2">
        <p>
          Booklesss is a course reader. You can read it without telling us anything, and most
          people do. This page says exactly what is stored, where, and what it is never used for.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">On your device</h2>
        <p>
          When you first open the app, your browser is given a random reading identity — a picture
          and its name, like Astronaut. Your reading progress, checkpoint answers, section notes,
          comments, study time, which step you read free, and the code of whoever shared the link
          that brought you here are all stored in your browser on your device, and nowhere else.
          Clearing your browser data erases all of it. The app cannot see any of it unless you
          create an account, and today it stays on the device even then.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">With an account</h2>
        <p>
          If you create an account we store your email address and a securely hashed password.
          Accounts and the rest of your data are held by Supabase, which runs our database and
          sign-in. If you arrived through someone&rsquo;s shared link, their referral code is
          recorded on your account so we can thank the person who brought you.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">What we never do</h2>
        <p>
          We do not sell your data. We do not show ads. We do not share your details with anyone
          except the services that run the app: Supabase (accounts and database) and Vercel
          (hosting), which log standard request data the way every web host does.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">Your choices</h2>
        <p>
          Settings → Privacy → &ldquo;Forget this device&rdquo; erases everything the device knows and starts
          you over as somebody new. To delete an account and everything on it, message us and it
          is done within seven days.
        </p>

        <h2 className="font-display text-[19px] font-semibold text-ink">Contact</h2>
        <p>
          Booklesss operates from Lusaka, Zambia. Questions or deletion requests:{" "}
          <a href="mailto:deekymvula@gmail.com" className="text-ink underline underline-offset-2">
            deekymvula@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
