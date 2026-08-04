import { notFound } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";

export const metadata = { title: "Sign up" };

/* Clerk's own card — see sign-in/page.tsx for why. */
export default function SignUpPage() {
  if (!clerkEnabled) notFound();
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas p-6">
      <SignUp />
    </main>
  );
}
