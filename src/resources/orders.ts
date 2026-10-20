// What the interface says about orders: labels, the list's columns and
// filters, and which status an order can move to. Pages and components read
// them from here, so orders are described in one place.

import type { Order, OrderStatus } from "@/lib/data";
import type { ResourceDescription } from "@/resources/types";

export const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function statusLabel(status: OrderStatus) {
  return orderStatuses.find((s) => s.value === status)?.label ?? status;
}

// What reaching a status means, after "Order #1042" in the activity feed
export function statusEvent(status: OrderStatus, customerName: string) {
  return {
    pending: `placed by ${customerName}`,
    paid: "paid",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
  }[status];
}

// A step in an order's history: "Placed", "Paid", …
export function historyLabel(status: OrderStatus) {
  return status === "pending" ? "Placed" : statusLabel(status);
}

// An order moves forward one step at a time, or is cancelled
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "paid",
  paid: "shipped",
  shipped: "delivered",
};

// The status an order moves to next (not counting cancelling), if any
export function nextStatus(status: OrderStatus): OrderStatus | null {
  return NEXT[status] ?? null;
}

// An order can be cancelled until it ships
export function canCancel(status: OrderStatus) {
  return status === "pending" || status === "paid";
}

// Whether an order in one status can move to another
export function canMove(from: OrderStatus, to: OrderStatus) {
  return to === "cancelled" ? canCancel(from) : nextStatus(from) === to;
}

// The list's bulk action: what selected orders can be moved to. Orders that
// can't make the move are skipped.
export const bulkStatusOptions = orderStatuses
  .filter((status) => status.value !== "pending")
  .map((status) => ({
    value: status.value,
    label:
      status.value === "cancelled"
        ? "Cancel"
        : `Mark ${status.label.toLowerCase()}`,
  }));

export const ordersResource: ResourceDescription<Order> = {
  singular: "order",
  plural: "orders",
  path: "/orders",
  title: (order) => `Order #${order.number}`,
  columns: [
    {
      field: "number",
      label: "Order",
      sortable: true,
      text: (order) => `#${order.number}`,
      link: true,
    },
    { field: "customerName", label: "Customer", sortable: true },
    { field: "placedAt", label: "Placed", sortable: true, format: "date" },
    {
      field: "status",
      label: "Status",
      sortable: true,
      text: (order) => statusLabel(order.status),
    },
    { field: "total", label: "Total", sortable: true, format: "money" },
  ],
  filters: [
    {
      type: "select",
      field: "status",
      label: "Status",
      options: orderStatuses,
    },
    { type: "dates", field: "placedAt", label: "Placed" },
  ],
  search: "Order number or customer",
};
