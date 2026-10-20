import type { Metadata } from "next";
import Link from "next/link";
import { SidebarNav } from "@/components/SidebarNav";
import { UserMenu } from "@/components/UserMenu";
import { siteConfig } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

// The app shell: <body> with the header, the sidebar, the page and the footer
// as its children. LunarCSS draws every region; the classes here only place
// them, on a grid whose tracks are --dash-shell-* tokens in site.css. A phone
// stacks the four regions; from lg the sidebar sits left of main.
//
// On a phone the navigation folds into a <details> disclosure, which works
// with no JavaScript; from lg it's always open. A disclosure can't be open on
// one screen size and closed on another without script, so the nav is in the
// page twice, and CSS shows one: the hidden one is out of the accessibility
// tree too.
//
// LunarCSS's layout stylesheet is loaded too, and matches this markup (it has
// its own sidebar grid for body > aside + main, and a row for the header).
// Everything it would set here is set by the classes below or switched off by
// its tokens in site.css, except what SidebarNav says it relies on.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteConfig.lang}>
      <body className="grid min-h-dvh grid-cols-1 grid-rows-(--dash-shell-rows) lg:grid-cols-(--dash-shell-columns) lg:grid-rows-(--dash-shell-rows-lg)">
        <header className="col-span-full flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/">{siteConfig.name}</Link>
          {/* Phone: its own row below the name and the user menu. From md:
              between them, taking the room left */}
          <form
            role="search"
            action={siteConfig.searchAction}
            className="order-last basis-full md:order-0 md:basis-auto md:grow"
          >
            <input
              type="search"
              name="q"
              aria-label="Search orders"
              placeholder="Search orders"
            />
            <button type="submit">Search</button>
          </form>
          <UserMenu />
        </header>
        <aside className="px-6 lg:py-6">
          <div className="lg:hidden">
            <details>
              <summary>Menu</summary>
              <SidebarNav />
            </details>
          </div>
          <div className="hidden lg:block">
            <SidebarNav />
          </div>
        </aside>
        <main className="p-6">{children}</main>
        <footer className="col-span-full px-6 py-4">
          <small>
            Built with{" "}
            <a href="https://github.com/nikolaiwu/lunar-dash">Lunar Dash</a> and{" "}
            <a href="https://github.com/nikolaiwu/lunarcss">LunarCSS</a>.
          </small>
        </footer>
      </body>
    </html>
  );
}
