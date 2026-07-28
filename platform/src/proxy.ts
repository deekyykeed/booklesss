import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/* Clerk's middleware is what makes auth() and the session available to the
 * rest of the app. Without keys it throws on every request, so an unconfigured
 * environment gets a pass-through instead and the site behaves exactly as it
 * did before Clerk.
 *
 * This is `proxy.ts`, not `middleware.ts` — Next 16 renamed the convention and
 * warns on the old name. Clerk's docs still say middleware; the file is the
 * only difference, since both conventions want one default-exported handler.
 *
 * Nothing is gated yet — every lesson stays public, as it was. Making the
 * course members-only is a pricing decision, not a setup step; when it's time,
 * add a matcher here and call auth.protect():
 *
 *   const isMembersOnly = createRouteMatcher(["/microeconomics(.*)", ...]);
 *   export default clerkMiddleware(async (auth, req) => {
 *     if (isMembersOnly(req)) await auth.protect();
 *   });
 */
const enabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

export default enabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Everything except Next internals and files with an extension…
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // …plus API routes.
    "/(api|trpc)(.*)",
  ],
};
