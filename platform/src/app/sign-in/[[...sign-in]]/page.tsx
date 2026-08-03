import { notFound } from "next/navigation";
import { clerkEnabled } from "@/lib/clerk";
import { AuthShell } from "@/components/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  // Without keys there is no auth to sign into, so the route simply isn't there.
  if (!clerkEnabled) notFound();
  return (
    <AuthShell title="Welcome back" subtitle="Pick up where you left off.">
      {/* Our own form, not Clerk's <SignIn />. See components/auth/AuthForm. */}
      <AuthForm mode="sign-in" />
      <p className="mt-5 text-center text-[13.5px] text-muted">
        New here?{" "}
        <Link href="/sign-up" className="text-ink underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
