import { notFound, redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

export const metadata = { title: "Sign up" };

/* The bare route goes to the real one; Clerk's own sub-steps below it still
 * render its card. See sign-in/page.tsx for the whole argument — the important
 * half being that a verification link Clerk emailed must not be answered with a
 * redirect to the form it was meant to complete. */
export default async function SignUpPage({
  params,
}: {
  params: Promise<{ "sign-up"?: string[] }>;
}) {
  if (!clerkEnabled) notFound();

  const { "sign-up": rest } = await params;
  if (!rest?.length) redirect("/onboarding");

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas p-6">
      <SignUp />
    </main>
  );
}
