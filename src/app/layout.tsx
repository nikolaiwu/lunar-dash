import type { Metadata } from "next";
import Link from "next/link";
import { SidebarNav } from "@/components/SidebarNav";
import { UserMenu } from "@/components/UserMenu";
import { getPreferences } from "@/lib/preferences";
import { getCurrentUser } from "@/lib/session";
import { siteConfig } from "@/site.config";
import "./globals.css";

// Every page renders on the server for each request, in full, instead of
// sending a prerendered shell that fills in with streamed content. The pages
// read the demo's cookie (and the URL), and a streamed part only appears
// through a script: with JavaScript off it would never show.
export const instant = false;

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
// Signed out (on the sign-in page) the shell is the header with only the
// name, main and the footer: three rows, no sidebar.
//
// The visitor's appearance settings (lib/preferences.ts) go on <html> as it
// renders: data-theme forces light or dark (none follows the device), and an
// accent colour overrides the theme's --lunar-accent. No script, no flash.
//
// LunarCSS's layout stylesheet is loaded too, and matches this markup (it has
// its own sidebar grid for body > aside + main, and a row for the header).
// Everything it would set here is set by the classes below or switched off by
// its tokens in site.css, except what SidebarNav says it relies on.
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [user, { theme, accent }] = await Promise.all([
    getCurrentUser(),
    getPreferences(),
  ]);

  return (
    <html
      lang={siteConfig.lang}
      data-theme={theme === "system" ? undefined : theme}
      style={
        accent
          ? ({ "--lunar-accent": accent } as React.CSSProperties)
          : undefined
      }
    >
      <body
        className={
          user
            ? "grid min-h-dvh grid-cols-1 grid-rows-(--dash-shell-rows) lg:grid-cols-(--dash-shell-columns) lg:grid-rows-(--dash-shell-rows-lg)"
            : "grid min-h-dvh grid-cols-1 grid-rows-(--dash-shell-rows-lg)"
        }
      >
        <header className="col-span-full flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/">{siteConfig.name}</Link>
          {user && (
            <>
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
              <UserMenu user={user} />
            </>
          )}
        </header>
        {user && (
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
        )}
        <main className="p-6">{children}</main>
        <footer className="col-span-full px-6 py-4">
          <small>
            Demo data, invented. Your changes stay in this browser, until you
            clear its cookies.
          </small>
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
