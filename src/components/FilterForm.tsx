import Link from "next/link";
import { Fragment } from "react";
import { isFiltered, listHref, type ListQuery } from "@/lib/list-query";
import type { ResourceDescription } from "@/resources/types";

// A list's search and filters, from the resource's description, as a GET
// form: submitting it loads the list with them in the URL, with or without
// JavaScript. It keeps the sort and starts again from the first page. Clear
// goes back to the list unfiltered.
//
// The fields sit in a row and wrap: LunarCSS's controls are full width, so
// each field gets a width to grow from (--dash-field-width, in site.css).
export function FilterForm<T>({
  resource,
  query,
  path = resource.path,
}: {
  resource: ResourceDescription<T>;
  query: ListQuery;
  path?: string;
}) {
  const field = "grow basis-(--dash-field-width)";

  return (
    <form
      method="get"
      action={path}
      role="search"
      aria-label={`Filter ${resource.plural}`}
      className="flex flex-wrap items-end gap-x-4"
    >
      <div className={field}>
        <label htmlFor="filter-q">Search</label>
        <input
          type="search"
          id="filter-q"
          name="q"
          defaultValue={query.q}
          placeholder={resource.search}
        />
      </div>
      {resource.filters.map((filter) =>
        filter.type === "select" ? (
          <div key={filter.field} className={field}>
            <label htmlFor={`filter-${filter.field}`}>{filter.label}</label>
            <select
              id={`filter-${filter.field}`}
              name={filter.field}
              defaultValue={query[filter.field] ?? ""}
            >
              <option value="">Any</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Fragment key={filter.field}>
            {(["from", "to"] as const).map((bound) => (
              <div key={bound} className={field}>
                <label htmlFor={`filter-${bound}`}>
                  {filter.label} {bound}
                </label>
                <input
                  type="date"
                  id={`filter-${bound}`}
                  name={bound}
                  defaultValue={query[bound]}
                />
              </div>
            ))}
          </Fragment>
        ),
      )}
      {query.sort && <input type="hidden" name="sort" value={query.sort} />}
      <div className="flex items-baseline gap-4">
        <button type="submit">Filter</button>
        {isFiltered(query) && (
          <Link href={listHref(path, { sort: query.sort })}>Clear</Link>
        )}
      </div>
    </form>
  );
}
