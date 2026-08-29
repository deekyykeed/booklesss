"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { HugeIcon } from "@/components/icons/huge";
import { browserClient } from "@/lib/supabase/browser";
import { MIN_PASSWORD, weakness } from "@/lib/password";

/* ------------------------------------------------------------------ *
 * Where the emailed reset link lands.
 *
 * HOW THE SESSION GETS HERE, because it is not obvious and it is the part that
 * breaks. Supabase's recovery link carries its tokens in the URL FRAGMENT
 * (`#access_token=…&type=recovery`), which never reaches the server — so this
 * cannot be a Server Component reading a query param. `@supabase/ssr`'s browser
 * client parses that fragment on load and fires an `onAuthStateChange` event of
 * type `PASSWORD_RECOVERY`, at which point there is a real (limited) session and
 * `updateUser` will work. Until that fires there is nothing to update, which is
 * why this waits for it rather than rendering the form immediately.
 *
 * A RECOVERY SESSION IS A REAL SESSION. Once that event lands, the visitor is
 * signed in as that account — which is exactly why the link is single-use and
 * expires in an hour, and why this page sets the password and gets out rather
 * than becoming somewhere to linger.
 *
 * THE RULE IS THE SAME ONE THE SIGN-UP BRANCH USES, imported rather than
 * restated. A password floor that applies when you create an account and not
 * when you reset it is not a floor — reset is the easier of the two paths to
 * walk a weak password in through, because the student is mid-recovery and
 * wants to be done.
 * ------------------------------------------------------------------ */

type State = "waiting" | "ready" | "expired" | "done";

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<State>("waiting");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = browserClient();
    if (!supabase) {
      setState("expired");
      return;
    }

    /* The event may have fired before this effect ran — the client parses the
       fragment as soon as it is constructed, and in production that can beat
       hydration. So check for an existing session first, then subscribe for the
       case where it has not happened yet. */
    let settled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session && !settled) {
        settled = true;
        setState("ready");
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
        settled = true;
        setState("ready");
      }
    });

    /* If nothing has arrived in a few seconds the link was bad, already used,
       or older than an hour. Say so and offer the way to get another, rather
       than spinning forever on a page with no other exit. */
    const t = setTimeout(() => {
      if (!settled) setState("expired");
    }, 4000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    const weak = weakness(password);
    if (weak) {
      setError(weak);
      return;
    }

    const supabase = browserClient();
    if (!supabase) return;

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        /* Supabase's leaked-password check runs here too when it is enabled,
           which is the point of putting the reset path behind the same rules. */
        setError(
          /known to be weak|pwned|easy to guess/i.test(error.message)
            ? "That password has appeared in a known data breach. Pick a different one."
            : /should be at least/i.test(error.message)
              ? `Passwords need at least ${MIN_PASSWORD} characters.`
              : error.message,
        );
        setBusy(false);
        return;
      }
      setState("done");
      /* Straight into the app — they are already signed in as themselves, and
         asking them to type the password they just set would be theatre. */
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  if (state === "waiting") {
    return <p className="text-[14px] leading-5 text-muted">Checking your link…</p>;
  }

  if (state === "expired") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[14px] leading-5 text-ink">
          This link has expired or has already been used. Reset links last an hour and work once.
        </p>
        <Button variant="primary" size="lg" block onClick={() => router.push("/sign-in")}>
          Get a new link
        </Button>
      </div>
    );
  }

  if (state === "done") {
    return (
      <p className="text-[14px] leading-5 text-ink">
        Password changed. Taking you in…
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <Field
        id="new-password"
        label="New password"
        type={show ? "text" : "password"}
        value={password}
        onChange={setPassword}
        /* `new-password` here, unlike the sign-in box: this form only ever sets
           a fresh one, so a password manager SHOULD offer to generate and save
           it. */
        autoComplete="new-password"
        placeholder={`At least ${MIN_PASSWORD} characters`}
        disabled={busy}
        trailing={
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] bg-transparent text-muted transition-colors hover:bg-active"
            tabIndex={-1}
          >
            <HugeIcon name={show ? "eye-off" : "eye"} size={16} strokeWidth={1.6} />
          </button>
        }
      />

      {error && (
        <p role="alert" className="text-[13px] leading-[18px] text-[#b42318]">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" block busy={busy} className="mt-1">
        {busy ? "Saving it" : "Set new password"}
      </Button>
    </form>
  );
}
