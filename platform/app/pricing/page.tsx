import { PricingTable } from '@clerk/nextjs'
import { AuthBrand, AuthUnavailable } from '@/components/auth-brand'

// Plans come from Clerk Billing (dev gateway until a production Stripe
// account exists — BUILD_PLAN §5). Mobile-money payers keep the WhatsApp
// flow; the owner grants course_access manually and the same doors open.

export const metadata = {
  title: 'Pricing — Booklesss',
  description: 'Study plans for Zambian university students.',
}

export default function PricingPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <AuthUnavailable />
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f5f4ef] px-4 py-14">
      <AuthBrand />
      <h1
        className="mt-8 text-[28px] font-bold text-[#121212]"
        style={{ fontFamily: 'var(--font-parastoo)' }}
      >
        Pick your plan
      </h1>
      <p className="mt-1 mb-10 max-w-[420px] text-center text-[14px] leading-relaxed text-[#71717A]">
        Every plan comes with a money-back guarantee — if Booklesss isn&rsquo;t
        for you in the first two weeks, you get a full refund. Paying by mobile
        money? Message us on WhatsApp and we&rsquo;ll set you up directly.
      </p>
      <div className="w-full max-w-[760px]">
        <PricingTable />
      </div>
    </div>
  )
}
