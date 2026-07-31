"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AVATARS, Avatar, DEFAULT_AVATAR, type AvatarId } from "./avatars";
import { saveIdentity, useIdentity } from "@/lib/identity";

/* First visit, once: what should we call you, and which face is yours.
 *
 * There is no account to sign into, so this is the only moment the app gets to
 * learn who is reading — but it is also the moment a student is one tap from
 * the lesson they came for. So it asks for two things, both answerable in
 * seconds, and neither of them an email address.
 *
 * Not dismissible by design: a skip link here would be taken every time, and
 * an app full of anonymous readers can't address anybody. It is two taps.
 *
 * Nothing renders until the store has read localStorage, so a returning reader
 * never sees this flash on screen before it disappears. */

/** Surfaces that aren't the app: the sign-in screens Clerk owns when it's on,
 *  the offline fallback, and the /workspace design scratchpad. Asking a
 *  student's name over any of them is asking in the wrong place. */
const SKIP = ["/sign-in", "/sign-up", "/offline", "/workspace"];

/** Fired by the header avatar to reopen the picker on an identity that already
 *  exists — the app never asks twice on its own, so this is the way back in. */
export const EDIT_EVENT = "booklesss:edit-identity";

export function IdentityGate() {
  const { identity, hydrated } = useIdentity();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>(DEFAULT_AVATAR);
  /* Reopened from the header, on an identity that already exists. */
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const onEdit = () => {
      setName(identity?.name ?? "");
      setAvatar(identity?.avatar ?? DEFAULT_AVATAR);
      setEditing(true);
    };
    window.addEventListener(EDIT_EVENT, onEdit);
    return () => window.removeEventListener(EDIT_EVENT, onEdit);
  }, [identity?.name, identity?.avatar]);

  const skipped = SKIP.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const open = hydrated && !skipped && (editing || !identity);

  /* A modal over the page shouldn't leave the page scrolling behind it. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const ready = name.trim().length > 0;
  const submit = () => {
    if (!ready) return;
    saveIdentity(name, avatar);
    setEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/25 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-title"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="squircle w-full max-w-[420px] rounded-3xl border border-[#e7e7e6] bg-white p-6 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_24px_48px_-12px_rgba(0,0,0,0.18)]"
      >
        <h2 id="identity-title" className="font-display text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">
          {editing ? "Your name and picture" : "Who’s reading?"}
        </h2>
        <p className="mt-1.5 text-[14px] leading-[22px] text-muted">
          {editing
            ? "Change either one. It stays on this device."
            : "Pick a face and tell us what to call you. It stays on this device — no email, no password."}
        </p>

        <fieldset className="mt-5">
          <legend className="sr-only">Choose a profile picture</legend>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map((a) => {
              const on = a.id === avatar;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatar(a.id)}
                  aria-label={a.label}
                  aria-pressed={on}
                  title={a.label}
                  className={
                    "squircle grid aspect-square place-items-center rounded-2xl border transition-colors " +
                    (on
                      ? "border-ink bg-active"
                      : "border-[#e7e7e6] bg-white hover:bg-[#fafafa]")
                  }
                >
                  <Avatar id={a.id} size={30} />
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Your name</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Deeky"
            maxLength={40}
            /* One line, one answer — the browser's own autofill is the fastest
               path for a returning device. */
            autoComplete="given-name"
            className="squircle h-11 w-full rounded-xl border border-[#e7e7e6] bg-white px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-ink"
          />
        </label>

        <button
          type="submit"
          disabled={!ready}
          className="squircle mt-5 h-11 w-full rounded-xl bg-ink text-[15px] font-medium text-white transition-opacity disabled:opacity-35"
        >
          {editing ? "Save" : "Start reading"}
        </button>
        {/* Only an edit can be abandoned — the first ask has nothing to go
            back to. */}
        {editing && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="mt-2 h-9 w-full text-[14px] text-muted transition-colors hover:text-ink"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
