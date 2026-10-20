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

// How far a value is past a range's bound: above 0 after it, 0 on it. Text
// is cut to the bound's length, so a day takes in all of its times
// ("2026-10-01T09:30…" is on "2026-10-01").
function beyond(value: unknown, bound: string) {
  if (typeof value === "number") return value - Number(bound);
  const text = String(value).slice(0, bound.length);
  return text < bound ? -1 : text > bound ? 1 : 0;
}

export function defineResource<T extends { id: string }>(
  name: ResourceName,
  { searchable, defaultSort, pageSize: defaultPageSize = 20 }: Options<T>,
) {
  const all = async () => (await getData())[name] as unknown as T[];

  function select(items: T[], { filter, range, q }: ListParams<T>) {
    let result = items;
    for (const [field, value] of Object.entries(filter ?? {})) {
      if (value === undefined || value === "") continue;
      result = result.filter(
        (item) => String(item[field as keyof T]) === value,
      );
    }
    for (const [field, bounds] of Object.entries(range ?? {})) {
      const { from, to } = (bounds ?? {}) as { from?: string; to?: string };
      result = result.filter((item) => {
        const value = item[field as keyof T];
        return (
          (!from || beyond(value, from) >= 0) && (!to || beyond(value, to) <= 0)
        );
      });
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
        pageSize,
        sort,
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

    // One id, or several at once (a bulk action)
    async update(
      id: string | string[],
      fields: Partial<Omit<T, "id">>,
    ): Promise<void> {
      await saveChange({
        op: "update",
        resource: name,
        ids: [id].flat(),
        fields,
        at: new Date().toISOString(),
      });
    },

    async remove(id: string | string[]): Promise<void> {
      await saveChange({
        op: "remove",
        resource: name,
        ids: [id].flat(),
        at: new Date().toISOString(),
      });
    },
  };
}
