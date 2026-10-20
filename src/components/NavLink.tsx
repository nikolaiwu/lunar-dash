"use client";

// A link that marks itself as the current page with aria-current, which
// LunarCSS draws. It reads the URL, so it's a client component: the root
// layout doesn't re-render when you navigate, and a server component can't
// read the URL. It still renders on the server, so the attribute is in the
// HTML with JavaScript off.
//
// Exactly this page: aria-current="page". A page below it (an order under
// Orders): aria-current="true".

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const current =
    pathname === href
      ? "page"
      : href !== "/" && pathname.startsWith(`${href}/`)
        ? "true"
        : undefined;

  return (
    <Link href={href} aria-current={current}>
      {children}
    </Link>
  );
}
