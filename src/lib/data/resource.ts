// The functions every resource has, so pages and components work the same
// way with orders, customers and products: list, get, count, create, update,
// remove. With a real database, write these against it instead.

import { getData, saveChange, type ResourceName } from "./store";
import type { ListParams, ListResult } from "./types";

interface Options<T> {
  // Fields that ?q= searches
  searchable: (keyof T & string)[];
  // The sort when none is asked for: a field, "-" first for descending
  defaultSort: string;
  pageSize?: number;
}

function compare(a: unknown, b: unknown) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export function defineResource<T extends { id: string }>(
  name: ResourceName,
  { searchable, defaultSort, pageSize: defaultPageSize = 20 }: Options<T>,
) {
  const all = async () => (await getData())[name] as unknown as T[];

  function select(items: T[], { filter, q }: ListParams<T>) {
    let result = items;
    for (const [field, value] of Object.entries(filter ?? {})) {
      if (value === undefined || value === "") continue;
      result = result.filter(
        (item) => String(item[field as keyof T]) === value,
      );
    }
    const query = q?.trim().replace(/^#/, "").toLowerCase();
    if (query) {
      result = result.filter((item) =>
        searchable.some((field) =>
          String(item[field]).toLowerCase().includes(query),
        ),
      );
    }
    return result;
  }

  return {
    async list(params: ListParams<T> = {}): Promise<ListResult<T>> {
      const items = select(await all(), params);

      const requested = params.sort || defaultSort;
      const sort =
        items.length && requested.replace(/^-/, "") in items[0]
          ? requested
          : defaultSort;
      const field = sort.replace(/^-/, "") as keyof T;
      const direction = sort.startsWith("-") ? -1 : 1;
      const sorted = [...items].sort(
        (a, b) =>
          direction * compare(a[field], b[field]) || compare(a.id, b.id),
      );

      const pageSize = params.pageSize ?? defaultPageSize;
      const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
      const page = Math.min(Math.max(1, params.page ?? 1), pageCount);
      return {
        items: sorted.slice((page - 1) * pageSize, page * pageSize),
        total: sorted.length,
        page,
        pageCount,
      };
    },

    async get(id: string): Promise<T | null> {
      return (await all()).find((item) => item.id === id) ?? null;
    },

    async count(
      params: Pick<ListParams<T>, "filter" | "q"> = {},
    ): Promise<number> {
      return select(await all(), params).length;
    },

    // The new item's id follows the highest one so far (p24 → p25)
    async create(values: Omit<T, "id">): Promise<T> {
      const ids = (await all()).map((item) => item.id);
      const prefix = ids[0]?.replace(/\d+$/, "") ?? "";
      const highest = Math.max(
        0,
        ...ids.map((id) => Number(id.replace(/^\D+/, "")) || 0),
      );
      const item = { ...values, id: `${prefix}${highest + 1}` } as T;
      await saveChange({
        op: "create",
        resource: name,
        item,
        at: new Date().toISOString(),
      });
      return item;
    },

    async update(id: string, fields: Partial<Omit<T, "id">>): Promise<void> {
      await saveChange({
        op: "update",
        resource: name,
        id,
        fields,
        at: new Date().toISOString(),
      });
    },

    async remove(id: string): Promise<void> {
      await saveChange({
        op: "remove",
        resource: name,
        id,
        at: new Date().toISOString(),
      });
    },
  };
}
