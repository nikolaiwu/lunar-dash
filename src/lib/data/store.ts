// The demo's storage: the generated fixtures, with each visitor's changes on
// top. Changes live in a cookie, so every visitor sees their own, on any
// host (serverless instances share no memory), with JavaScript or without.
// They're capped, and the oldest drop off first; clearing cookies resets them.
//
// Demo only. With a real database, lib/data's resource functions query it
// and this file goes away.

import { cacheLife } from "next/cache";
import { cookies } from "next/headers";
import { createFixtures, type Fixtures } from "./fixtures";
import type { OrderStatus } from "./types";

export type ResourceName = keyof Fixtures;

export type Change =
  | {
      op: "create";
      resource: ResourceName;
      item: Record<string, unknown>;
      at: string;
    }
  | {
      op: "update";
      resource: ResourceName;
      id: string;
      fields: Record<string, unknown>;
      at: string;
    }
  | { op: "remove"; resource: ResourceName; id: string; at: string };

const COOKIE = "lunar-dash-changes";
const MAX_CHANGES = 30;
// A cookie holds about 4KB; leave room for its name and attributes
const MAX_BYTES = 3800;

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

// The fields a change may set, and their types. Anything else in the cookie
// is ignored: it comes from the browser, so it's never trusted.
const FIELDS: Record<
  ResourceName,
  Record<string, "string" | "number" | "status">
> = {
  orders: { status: "status" },
  customers: {
    name: "string",
    email: "string",
    company: "string",
    country: "string",
  },
  products: {
    name: "string",
    sku: "string",
    category: "string",
    price: "number",
    stock: "number",
  },
};

function clean(resource: ResourceName, values: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const [field, type] of Object.entries(FIELDS[resource])) {
    const value = values[field];
    const valid =
      type === "status"
        ? STATUSES.includes(value as OrderStatus)
        : type === "number"
          ? Number.isFinite(value)
          : typeof value === "string" && value.length <= 200;
    if (valid) result[field] = value;
  }
  return result;
}

function parse(value: string | undefined): Change[] {
  if (!value) return [];
  try {
    const changes: unknown = JSON.parse(value);
    if (!Array.isArray(changes)) return [];
    return changes.filter(
      (c): c is Change =>
        typeof c === "object" &&
        c !== null &&
        ["create", "update", "remove"].includes(c.op) &&
        c.resource in FIELDS &&
        typeof c.at === "string" &&
        (c.op === "create"
          ? typeof c.item === "object" &&
            c.item !== null &&
            typeof c.item.id === "string"
          : typeof c.id === "string") &&
        (c.op !== "update" ||
          (typeof c.fields === "object" && c.fields !== null)),
    );
  } catch {
    return [];
  }
}

// The fixtures depend only on the day, so they're cached and shared, and
// rebuilt within the hour after midnight (UTC). Reading the date while a page
// is prerendered is only allowed inside a cache like this: the value is then
// the same on every render until it's rebuilt. The fixtures are never
// changed: applying a visitor's changes copies.
async function todaysFixtures(): Promise<{
  today: string;
  fixtures: Fixtures;
}> {
  "use cache";
  cacheLife("hours");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return { today: today.toISOString(), fixtures: createFixtures(today) };
}

function apply(base: Fixtures, changes: Change[]): Fixtures {
  const data: Fixtures = {
    customers: [...base.customers],
    products: [...base.products],
    orders: [...base.orders],
  };

  for (const change of changes) {
    const list = data[change.resource] as unknown as Record<string, unknown>[];
    if (change.op === "create") {
      const values = clean(change.resource, change.item);
      // A created item needs every field
      if (
        Object.keys(values).length !==
        Object.keys(FIELDS[change.resource]).length
      )
        continue;
      if (change.resource === "orders") continue; // orders aren't created in the demo
      const extra =
        change.resource === "customers" ? { createdAt: change.at } : {};
      list.push({ ...values, ...extra, id: change.item.id });
      continue;
    }

    const index = list.findIndex((item) => item.id === change.id);
    if (index === -1) continue;
    if (change.op === "remove") {
      list.splice(index, 1);
      continue;
    }

    const before = list[index];
    const after: Record<string, unknown> = {
      ...before,
      ...clean(change.resource, change.fields),
    };
    if (change.resource === "orders" && after.status !== before.status) {
      after.history = [
        ...(before.history as unknown[]),
        { status: after.status, at: change.at },
      ];
    }
    list[index] = after;
  }

  // Orders show their customer's current name
  const names = new Map(data.customers.map((c) => [c.id, c.name]));
  data.orders = data.orders.map((order) => ({
    ...order,
    customerName: names.get(order.customerId) ?? order.customerName,
  }));

  return data;
}

export type Data = Fixtures & {
  // The start of the day the data counts back from, as an ISO string
  today: string;
};

// The data as this visitor sees it: today's fixtures with their changes.
export async function getData(): Promise<Data> {
  const jar = await cookies();
  const changes = parse(jar.get(COOKIE)?.value);
  const { today, fixtures } = await todaysFixtures();
  return { today, ...apply(fixtures, changes) };
}

// Records a change in this visitor's cookie. Only from a Server Action: a
// page can't set cookies while it renders.
export async function saveChange(change: Change) {
  const jar = await cookies();
  const changes = [...parse(jar.get(COOKIE)?.value), change].slice(
    -MAX_CHANGES,
  );
  while (
    changes.length > 1 &&
    encodeURIComponent(JSON.stringify(changes)).length > MAX_BYTES
  ) {
    changes.shift();
  }
  jar.set(COOKIE, JSON.stringify(changes), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
