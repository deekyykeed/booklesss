"use client";

import { useIdentity } from "@/lib/identity";
import { avatarCssUrl } from "./avatar-uri";

/**
 * Puts this student's assigned face behind Clerk's user button.
 *
 * Owner, 2026-08-04, on the first completed sign-up: "I have not gotten my user
 * icon." Signed out the header draws the Kameleon face; signed in it hands over
 * to Clerk's <UserButton>, which has no photo for an email-and-password account
 * and falls back to two grey initials. Making an account swapped a face for
 * letters.
 *
 * A WRAPPER RATHER THAN A PROP, because Clerk's appearance API takes CSS and
 * not components — there is no way to hand <UserButton> a React element for its
 * trigger. So the face arrives as a custom property on an element above it, and
 * globals.css paints Clerk's own avatar box with it.
 *
 * It renders nothing of its own and adds no box: `contents` keeps the wrapper
 * out of the header's flex layout entirely, so the button sits exactly where it
 * did. Before the store hydrates there is no face to name, and rather than
 * flash the wrong one it simply sets nothing and lets Clerk's initials stand.
 */
export function ClerkAvatarSkin({ children }: { children: React.ReactNode }) {
  const { identity } = useIdentity();
  const url = identity ? avatarCssUrl(identity.avatar) : undefined;

  return (
    <span
      className="clerk-avatar-skin contents"
      style={url ? ({ "--user-avatar": url } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}
