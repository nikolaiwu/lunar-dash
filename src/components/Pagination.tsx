import Link from "next/link";
import { listHref, type ListQuery } from "@/lib/list-query";

// Previous and next links for a list over several pages, keeping the rest of
// the URL's state. At either end the link is left out. Nothing at all for a
// list on one page.
export function Pagination({
  page,
  pageCount,
  path,
  query,
}: {
  page: number;
  pageCount: number;
  path: string;
  query: ListQuery;
}) {
  if (pageCount <= 1) return null;

  // Page 1 is the list without ?page=
  const href = (page: number) =>
    listHref(path, query, { page: page > 1 ? String(page) : undefined });

  return (
    <nav aria-label="Pagination">
      <ul className="flex flex-wrap items-baseline gap-6">
        {page > 1 && (
          <li>
            <Link href={href(page - 1)} rel="prev">
              Previous page
            </Link>
          </li>
        )}
        <li>
          Page {page} of {pageCount}
        </li>
        {page < pageCount && (
          <li>
            <Link href={href(page + 1)} rel="next">
              Next page
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
