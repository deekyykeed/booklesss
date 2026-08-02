import { SignUp } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { clerkEnabled } from "@/lib/clerk";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  if (!clerkEnabled) notFound();
  return (
    <AuthShell title="Start reading" subtitle="Your progress follows you across devices.">
      <SignUp />
    </AuthShell>
  );
}
