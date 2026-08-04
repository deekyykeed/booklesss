"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cleanHandle, isHandle } from "@/lib/handle";

/* ------------------------------------------------------------------ *
 * The handle, as a field — @deeky, and there is only one.
 *
 * It arrives already filled in: sign-up derived one from the email (see
 * lib/handle) so that a reader stopped by a checkpoint paid two fields rather
 * than three. This is where they change it, on a screen they reached by
 * choosing to, with a session already live behind them.
 *
 * IT WRITES STRAIGHT TO CLERK, and does not touch the identity record. The
 * handle's entire value is that no two students share one, and only Clerk can
 * say that — a device cannot know who else took "deeky". Mirroring it into
 * localStorage would put a second, staler copy of a uniqueness claim next to
 * the authoritative one, which is the shape of the bug that cost this app six
 * sign-ups today.
 *
 * "TAKEN" IS ONLY KNOWN ON SUBMIT, and the UI does not pretend otherwise.
 * Clerk publishes no availability endpoint to the browser, which is right —
 * an open "is this free?" oracle is a way to enumerate who has an account. So
 * the shape is checked as they type, and the one question this component cannot
 * answer is asked of the server when they press the button. No green tick that
 * has not been earned.
 *
 * SAVED ON A BUTTON, not on every keystroke like the rest of Settings. A
 * handle is a round trip that can be REFUSED, and a field that silently fails
 * three times while somebody types "deeky" is a field that has told them
 * nothing. One press, one answer.
 * ------------------------------------------------------------------ */

export function HandleField() {
  const { user, isLoaded } = useUser();
  const current = user?.username ?? "";

  /* THE FIELD FOLLOWS CLERK UNTIL IT IS TOUCHED, held as one nullable override
     rather than seeded into state. Sign-up derives the handle a moment AFTER
     this may first render — an account made seconds ago is still settling — so
     a value copied once from an empty `user` would sit blank beside a handle
     that exists. Syncing it back with an effect is the obvious fix and the
     wrong one: it is a cascading render, and the lint rule that catches it is
     right. `null` means "whatever Clerk says"; anything else is theirs, and no
     later arrival can move it under their cursor.
     Same shape, same reasoning, as the draft in OnboardingFlow. */
  const [edited, setEdited] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const value = edited ?? current;
  const clean = cleanHandle(value);
  const valid = isHandle(clean);
  const changed = clean !== current;

  async function save() {
    if (!valid || !changed || !user || state === "saving") return;
    setState("saving");
    setError(null);
    try {
      await user.update({ username: clean });
      /* Back to following Clerk. `user.update` refreshes the resource, so
         `current` is now the saved handle — and releasing the override is what
         makes the confirmation line below read the truth rather than the draft
         that produced it. */
      setEdited(null);
      setState("saved");
    } catch (e) {
      setState("idle");
      /* Clerk's errors come back on the exception rather than as a value here
         — `user.update` is the classic resource API, not the Signals one the
         account step talks to. Its own wording is better than anything we
         could write for "that username is taken". */
      const first = (e as { errors?: { longMessage?: string; message?: string }[] })?.errors?.[0];
      setError(first?.longMessage ?? first?.message ?? "That handle didn't stick. Try another.");
    }
  }

  if (!isLoaded) return null;

  return (
    <div>
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          {/* The @ is drawn, not typed. It is part of what a handle IS, and a
              student who types one would otherwise have it silently stripped
              and be left wondering which of the two is stored. */}
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-placeholder">
            @
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setEdited(e.target.value);
              setState("idle");
              setError(null);
            }}
            placeholder="deeky"
            aria-label="Your handle"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={30}
            className={
              "squircle h-11 w-full rounded-xl border border-line bg-white pl-[26px] pr-3.5 text-[15px] text-ink " +
              "outline-none transition-colors placeholder:text-placeholder focus:border-ink"
            }
          />
        </div>
        {/* Only once there is something to do. A button that is permanently
            present and permanently disabled is a control that reads as broken. */}
        {changed && valid && (
          <button
            type="button"
            onClick={save}
            disabled={state === "saving"}
            className="squircle shrink-0 rounded-xl border border-ink bg-ink px-4 text-[14px] font-medium text-white transition-opacity disabled:opacity-50"
          >
            {state === "saving" ? "…" : "Save"}
          </button>
        )}
      </div>

      {/* One line, and only when it is saying something. Shape first, because
          that is what we can answer as they type; the server's answer replaces
          it once they press. */}
      {error ? (
        <p role="alert" className="mt-1.5 text-[13px] leading-5 text-[#b42318]">
          {error}
        </p>
      ) : changed && clean && !valid ? (
        <p className="mt-1.5 text-[13px] leading-5 text-muted">
          Four characters or more — letters, numbers and underscores.
        </p>
      ) : state === "saved" ? (
        <p className="mt-1.5 text-[13px] leading-5 text-muted">
          Saved. You&rsquo;re <span className="font-medium text-ink">@{current}</span>.
        </p>
      ) : (
        <p className="mt-1.5 text-[13px] leading-5 text-muted">
          Unique to you, and how classmates find you.
        </p>
      )}
    </div>
  );
}
