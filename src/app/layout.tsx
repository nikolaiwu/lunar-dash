import type { Metadata } from "next";
import Link from "next/link";
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
// LunarCSS's layout stylesheet is loaded too, and matches this markup (it has
// its own sidebar grid for body > aside + main). Everything it would set here
// is set by the classes below or switched off by its tokens in site.css, with
// one exception: the sidebar nav's list relies on it to drop the theme's
// bullet ticks (nav > ul > li::before) and the list items' margins. Without
// it, the nav gets ticks and wider spacing.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteConfig.lang}>
      <body className="grid min-h-dvh grid-cols-1 grid-rows-(--dash-shell-rows) lg:grid-cols-(--dash-shell-columns) lg:grid-rows-(--dash-shell-rows-lg)">
        <header className="col-span-full px-6 py-4">
          <Link href="/">{siteConfig.name}</Link>
        </header>
        <aside className="p-6">
          <nav aria-label="Main">
            <ul className="grid gap-2">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
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
