// What the interface says about orders. Lists and forms read their labels
// (and, from 0.5, their columns and filters) from here, so a resource is
// described in one place.

import type { OrderStatus } from "@/lib/data";

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
