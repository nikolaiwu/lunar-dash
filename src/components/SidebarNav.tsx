import Link from "next/link";
import { Suspense } from "react";
import { NavLink } from "@/components/NavLink";
import { siteConfig } from "@/site.config";

// The main navigation: the links from site.config.ts, in one list.
//
// Each NavLink reads the URL. While a page is prerendered, the URL isn't
// known for pages with an id in it (an order), so the link waits behind
// Suspense and the same link without aria-current stands in.
//
// LunarCSS's layout stylesheet drops the theme's bullet ticks and the items'
// margins in a nav's list, which no utility can do; without it, the nav gets
// ticks and wider spacing.
export function SidebarNav() {
  return (
    <nav aria-label="Main">
      <ul className="grid gap-2">
        {siteConfig.nav.map((link) => (
          <li key={link.href}>
            <Suspense fallback={<Link href={link.href}>{link.label}</Link>}>
              <NavLink href={link.href}>{link.label}</NavLink>
            </Suspense>
          </li>
        ))}
      </ul>
    </nav>
  );
}
