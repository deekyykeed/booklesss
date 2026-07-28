import { SignIn } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { clerkEnabled } from "@/lib/clerk";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Sign in · Booklesss" };

export default function SignInPage() {
  // Without keys there is no auth to sign into, so the route simply isn't there.
  if (!clerkEnabled) notFound();
  return (
    <AuthShell title="Welcome back" subtitle="Pick up where you left off.">
      <SignIn />
    </AuthShell>
  );
}
