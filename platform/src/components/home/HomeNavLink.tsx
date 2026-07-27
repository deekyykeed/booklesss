"use client";

import Link from "next/link";
import { useMobileNav } from "@/components/reader/MobileNav";

/* The only part of the home rail that needs to be a client component: tapping
 * a destination has to slide the mobile drawer shut. Keeping it this small is
 * what lets HomeSidebar stay on the server and resolve its Solar icons there —
 * the icon set is ~7,400 entries, and none of it should reach the browser. */
export function HomeNavLink({
  href,
  external,
  active,
  children,
}: {
  href: string;
  external?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  const { close } = useMobileNav();
  const shared = {
    onClick: () => close(),
    className: "home-nav squircle",
    "data-active": active ? "" : undefined,
    "aria-current": active ? ("page" as const) : undefined,
  };

  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" {...shared}>
      {children}
    </a>
  ) : (
    <Link href={href} {...shared}>
      {children}
    </Link>
  );
}
