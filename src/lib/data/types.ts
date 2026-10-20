// The shapes of the dashboard's data. Dates are ISO 8601 strings, money is in
// cents (integers), so everything serializes as it is.

export type OrderStatus =
  "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface StatusChange {
  status: OrderStatus;
  at: string;
}

export interface Order {
  id: string;
  number: number;
  customerId: string;
  // Filled in from the customer when the order is read
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  // Every status the order has had, oldest first
  history: StatusChange[];
}

// What every resource's list() takes: sort is a field name, with a leading
// "-" for descending; filter matches fields exactly; range keeps values
// from one to another, both included (dates as "2026-10-01" take in the
// whole day); q searches the resource's text fields.
export interface ListParams<T> {
  sort?: string;
  filter?: Partial<Record<keyof T, string>>;
  range?: Partial<Record<keyof T, { from?: string; to?: string }>>;
  q?: string;
  page?: number;
  pageSize?: number;
}

// A page of items, and how it was cut: the page and sort actually used (an
// unknown sort falls back to the default, a page past the end to the last)
export interface ListResult<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  sort: string;
}
