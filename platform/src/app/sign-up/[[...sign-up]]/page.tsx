import { notFound } from "next/navigation";
import { clerkEnabled } from "@/lib/clerk";
import { AuthShell } from "@/components/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  if (!clerkEnabled) notFound();
  return (
    <AuthShell title="Start reading" subtitle="Your progress follows you across devices.">
      {/* Our own form, not Clerk's <SignUp />. See components/auth/AuthForm. */}
      <AuthForm mode="sign-up" />
      <p className="mt-5 text-center text-[13.5px] text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
