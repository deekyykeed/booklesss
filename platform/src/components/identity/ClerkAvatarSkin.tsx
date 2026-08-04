"use client";

import { useUser } from "@clerk/nextjs";
import { useIdentity } from "@/lib/identity";
import { avatarCssUrl } from "./avatar-uri";

/**
 * Puts this student's assigned face behind Clerk's user button.
 *
 * Owner, 2026-08-04, on the first completed sign-up: "I have not gotten my user
 * icon." Signed out the header draws the Kameleon face; signed in it hands over
 * to Clerk's <UserButton>, which has no photo for an email-and-password account
 * and falls back to a mark of its own. Making an account swapped a face for a
 * placeholder.
 *
 * A WRAPPER RATHER THAN A PROP, because Clerk's appearance API takes CSS and
 * not components — there is no way to hand <UserButton> a React element for its
 * trigger. So the face arrives as a custom property on an element above it, and
 * globals.css paints Clerk's own avatar box with it.
 *
 * IT DID NOT WORK THE FIRST TIME, and the reason is worth keeping. Painting the
 * face as a BACKGROUND was chosen so that a real uploaded photo would cover it
 * and nothing would have to detect which case it was. That holds only if Clerk
 * draws an <img> when there is a photo and nothing when there isn't — and it
 * doesn't. With no photo Clerk generates a placeholder and renders THAT as an
 * <img> too, which sat on top of the background and hid it completely. The
 * face was there the whole time, underneath.
 *
 * So the case is now detected, using the one fact that separates them:
 * `user.hasImage`. No photo, and `data-no-photo` tells the stylesheet to hide
 * Clerk's generated <img> so the face below shows through. A real photo, and
 * the attribute is absent and Clerk's <img> stands — which is the behaviour
 * that was wanted all along.
 *
 * It renders nothing of its own and adds no box: `contents` keeps the wrapper
 * out of the header's flex layout entirely, so the button sits exactly where it
 * did. Before the store hydrates there is no face to name, and rather than
 * flash the wrong one it simply sets nothing and lets Clerk's initials stand.
 */
export function ClerkAvatarSkin({ children }: { children: React.ReactNode }) {
  const { identity } = useIdentity();
  /* One of the few components allowed to touch Clerk, and mounted only inside
     the provider — TopBar checks clerkEnabled before rendering it. */
  const { user } = useUser();
  const url = identity ? avatarCssUrl(identity.avatar) : undefined;

  return (
    <span
      className="clerk-avatar-skin contents"
      /* Only once we actually know. `user` is undefined while Clerk loads, and
         hiding the <img> in that gap would blank the button for a beat. */
      data-no-photo={user && !user.hasImage ? "" : undefined}
      style={url ? ({ "--user-avatar": url } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}
