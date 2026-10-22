"use client";

// A link that marks itself as the current page with aria-current, which
// LunarCSS draws. It reads the URL, so it's a client component: the root
// layout doesn't re-render when you navigate, and a server component can't
// read the URL. It still renders on the server, so the attribute is in the
// HTML with JavaScript off.
//
// Exactly this page: aria-current="page". A page below it (an order under
// Orders): aria-current="true".
//
// While the page it leads to loads, it says so: an ellipsis after its label,
// and aria-busy="true" on <main>, the region that's about to change. Pages
// render in full before they're sent (no loading.tsx: its fallback would
// never be replaced with JavaScript off), so this is the feedback a click
// gets in the meantime.

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
      <Pending />
    </Link>
  );
}

// Inside the link, where useLinkStatus can see it
function Pending() {
  const { pending } = useLinkStatus();

  useEffect(() => {
    if (!pending) return;
    const main = document.querySelector("main");
    main?.setAttribute("aria-busy", "true");
    return () => main?.removeAttribute("aria-busy");
  }, [pending]);

  return pending ? <span aria-hidden="true"> …</span> : null;
}
