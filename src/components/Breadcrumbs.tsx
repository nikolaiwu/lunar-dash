import Link from "next/link";

export interface Crumb {
  label: string;
  href: string;
}

// Where this page sits: a trail of links from the top, ending with this page
// (marked aria-current="page"). Pages pass it to PageHeader.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={i === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
