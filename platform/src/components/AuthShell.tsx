import Link from "next/link";

/* Page frame the sign-in and sign-up routes share: the same drifting backdrop
 * as the reader, with Clerk's own card centred on it. Clerk styles the card
 * itself (see the appearance variables on ClerkProvider) — this only sets the
 * stage around it. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-waves" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-16">
        <div className="text-center">
          <Link
            href="/"
            className="font-display text-[22px] font-bold tracking-tight text-ink transition-opacity hover:opacity-70"
          >
            Bklsss
          </Link>
          <h1 className="mt-5 font-display text-[26px] font-medium leading-tight tracking-[-0.02em] text-ink">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        {children}
      </main>
    </>
  );
}
