// Everything that names or describes this dashboard lives here, so you can make
// it yours in one place. Layouts and pages import this object; none of them
// hard-code the app name, the navigation or how many rows a list shows.

export interface NavLink {
  label: string;
  // A path inside the app, with a leading slash (e.g. "/orders"). The link
  // is marked current on this page and on every page below it.
  href: string;
}

export interface SiteConfig {
  name: string;
  // The default meta description, for pages that don't set their own.
  description: string;
  // The language of the interface, as a BCP 47 tag (e.g. "en", "en-GB", "bg").
  // Sets <html lang>, which screen readers and search engines rely on.
  lang: string;
  // The currency prices and revenue are shown in, as an ISO 4217 code.
  currency: string;
  // The sidebar's main navigation, in order.
  nav: NavLink[];
  // Where the header's search form sends its query, as ?q=…
  searchAction: string;
  // How many rows or cards each list shows per page.
  pageSize: {
    orders: number;
    customers: number;
    products: number;
  };
}

export const siteConfig: SiteConfig = {
  name: "Acme Robotics",
  description:
    "Acme Robotics' back office: orders, customers and products. A Lunar Dash demo.",
  lang: "en",
  currency: "EUR",
  nav: [
    { label: "Overview", href: "/" },
    { label: "Orders", href: "/orders" },
    { label: "Customers", href: "/customers" },
    { label: "Products", href: "/products" },
    { label: "Settings", href: "/settings" },
  ],
  searchAction: "/orders",
  pageSize: {
    orders: 20,
    customers: 20,
    products: 12,
  },
};
