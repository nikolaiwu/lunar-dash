// All of the dashboard's data goes through here. Every resource has the same
// functions (list, get, count, create, update, remove), and the overview's
// numbers are named functions in metrics. Pages call these and pass the
// results to components; components never fetch.
//
// To use your own database, rewrite resource.ts and metrics.ts against it,
// keeping these exports. store.ts and fixtures.ts are the demo's and can go.

import { siteConfig } from "@/site.config";
import { defineResource } from "./resource";
import type { Customer, Order, Product } from "./types";

export const orders = defineResource<Order>("orders", {
  searchable: ["number", "customerName"],
  defaultSort: "-placedAt",
  pageSize: siteConfig.pageSize.orders,
});

export const customers = defineResource<Customer>("customers", {
  searchable: ["name", "email", "company"],
  defaultSort: "name",
  pageSize: siteConfig.pageSize.customers,
});

export const products = defineResource<Product>("products", {
  searchable: ["name", "sku", "category"],
  defaultSort: "name",
  pageSize: siteConfig.pageSize.products,
});

export * as metrics from "./metrics";
export type * from "./types";
export type { ActivityEvent, CustomerTotals, Totals } from "./metrics";
