// A list's state lives in its URL, so a refresh, the back button and a
// shared link all show the same view: ?q= (search), ?sort=, ?page=, one
// parameter per select filter (?status=paid), and ?from= / ?to= for the
// dates filter. These read it, check it, turn it into the data layer's
// list() parameters, and build links that change one part and keep the rest.

import type { ListParams } from "@/lib/data";
import type { ResourceDescription } from "@/resources/types";

// The list's parameters that are set, as they read in the URL
export type ListQuery = Record<string, string>;

type SearchParams = Record<string, string | string[] | undefined>;

const DAY = /^\d{4}-\d{2}-\d{2}$/;

// Keeps only what this list understands; anything else in the URL, or a
// value that isn't valid (an unknown status, a sort on a field that can't be
// sorted), is dropped, so the page shows the list as if it weren't there.
export function readListQuery<T>(
  searchParams: SearchParams,
  resource: ResourceDescription<T>,
): ListQuery {
  const get = (name: string) => {
    const value = searchParams[name];
    return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
  };
  const query: ListQuery = {};

  const q = get("q");
  if (q) query.q = q.slice(0, 100);

  const sort = get("sort");
  const sortable = resource.columns.filter((c) => c.sortable);
  if (sortable.some((c) => c.field === sort.replace(/^-/, ""))) {
    query.sort = sort;
  }

  const page = Number(get("page"));
  if (Number.isInteger(page) && page > 1) query.page = String(page);

  for (const filter of resource.filters) {
    if (filter.type === "select") {
      const value = get(filter.field);
      if (filter.options.some((o) => o.value === value)) {
        query[filter.field] = value;
      }
    } else {
      for (const name of ["from", "to"]) {
        if (DAY.test(get(name))) query[name] = get(name);
      }
    }
  }
  return query;
}

// The query as the parameters of the data layer's list()
export function toListParams<T>(
  query: ListQuery,
  resource: ResourceDescription<T>,
): ListParams<T> {
  const params: ListParams<T> = {
    q: query.q,
    sort: query.sort,
    page: query.page ? Number(query.page) : undefined,
    filter: {},
    range: {},
  };
  for (const filter of resource.filters) {
    const field = filter.field as keyof T;
    if (filter.type === "select") {
      params.filter![field] = query[filter.field];
    } else if (query.from || query.to) {
      params.range![field] = { from: query.from, to: query.to };
    }
  }
  return params;
}

// Whether the list is searched or filtered (so "clear" has something to do)
export function isFiltered(query: ListQuery) {
  return Object.keys(query).some((name) => name !== "sort" && name !== "page");
}

// A link to the list with some parameters changed; undefined removes one
export function listHref(
  path: string,
  query: ListQuery,
  changes: Record<string, string | undefined> = {},
) {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries({ ...query, ...changes })) {
    if (value) params.set(name, value);
  }
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
