"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { browserClient } from "@/lib/supabase/browser";

/* ------------------------------------------------------------------ *
 * "I've forgotten it."
 *
 * ⚠️ THIS EXISTED AS A SENTENCE BEFORE IT EXISTED AS A PAGE. AuthForm has told
 * students "That password doesn't match this email. Try again, or reset it."
 * since 2026-08-07, and there was nowhere to reset it — no route, no handler,
 * no call to `resetPasswordForEmail` anywhere in the app. A wrong password was
 * a dead end for anyone who could not remember theirs, on the one screen where
 * a dead end costs you the account. Built 2026-08-09.
 *
 * IT SAYS THE SAME THING WHATEVER HAPPENS, and that is the security property,
 * not a lazy error path. "No account with that email" turns this box into an
 * account-enumeration oracle: type a hundred addresses, learn which hundred
 * students are registered. Supabase's own API is built the same way — it
 * returns success for an unknown address — and this matches it rather than
 * leaking the difference back through the UI. The wording is chosen to be true
 * either way: "if there's an account, the link is on its way."
 *
 * RATE LIMITING IS SUPABASE'S HERE, and it is real: the auth server caps
 * recovery emails per address and per IP (Auth → Rate Limits), which is what
 * stops this becoming a way to mail-bomb somebody. The 429 comes back as a
 * message this form shows. Do NOT add a second limiter in front of it — a
 * client-side counter is bypassed by a page reload and would only mislead.
 * ------------------------------------------------------------------ */

export function ForgotPassword({
  initialEmail,
  onBack,
}: {
  initialEmail?: string | null;
  onBack: () => void;
}) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    const mail = email.trim();
    if (!mail) {
      setError("Your email, please.");
      return;
    }

    const supabase = browserClient();
    if (!supabase) {
      setError("Accounts aren't set up on this build.");
      return;
    }

    setBusy(true);
    try {
      /* `redirectTo` is where the emailed link lands, and it must be an
         allowed redirect URL in the Supabase dashboard (Auth → URL
         Configuration) or the link silently sends them to the site root
         signed-out. Built from the live origin rather than SITE_URL so that a
         preview deploy's reset link comes back to that preview. */
      const { error } = await supabase.auth.resetPasswordForEmail(mail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      /* Everything except a rate limit is swallowed on purpose — see the
         enumeration note above. A 429 is shown because it is about the
         REQUEST rather than about whether the account exists, so saying it
         leaks nothing and not saying it would leave them tapping a dead
         button. */
      if (error && /rate limit|too many|429/i.test(error.message)) {
        setError("Too many requests. Wait a minute and try again.");
        setBusy(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[14px] leading-5 text-ink">
          If there&apos;s an account for <strong>{email.trim()}</strong>, a reset link is on its way.
          It expires in an hour.
        </p>
        <p className="text-[13px] leading-[18px] text-muted">
          Nothing arrived? Check spam, and make sure that&apos;s the address you signed up with.
        </p>
        <Button variant="secondary" block onClick={onBack}>
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <p className="text-[14px] leading-5 text-muted">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

      <Field
        id="reset-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        disabled={busy}
      />

      {error && (
        <p role="alert" className="text-[13px] leading-[18px] text-[#b42318]">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" block busy={busy} className="mt-1">
        {busy ? "Sending the link" : "Send reset link"}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="text-[13px] leading-[18px] text-muted underline underline-offset-2 hover:text-ink"
      >
        Back to sign in
      </button>
    </form>
  );
}
