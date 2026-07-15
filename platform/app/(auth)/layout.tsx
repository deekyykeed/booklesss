export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#f5f4ef] px-4 py-10">
      {children}
    </div>
  )
}
