import { SignUp } from '@clerk/nextjs'
import { AuthBrand, AuthUnavailable } from '@/components/auth-brand'

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <AuthUnavailable />
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f5f4ef] px-4 py-10">
      <AuthBrand />
      <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/steps" />
    </div>
  )
}
