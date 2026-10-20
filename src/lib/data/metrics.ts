// The overview's numbers, computed here rather than by the pages, so a real
// database can answer them with its own queries. Periods are whole days,
// ending with yesterday: today has only just begun.

import { getData } from "./store";
import type { Order, OrderStatus } from "./types";

const DAY = 24 * 60 * 60 * 1000;

// The start of the day `daysAgo` days before the data's today
function dayStart(today: string, daysAgo: number) {
  return new Date(Date.parse(today) - daysAgo * DAY);
}

function placedBetween(orders: Order[], from: Date, to: Date) {
  return orders.filter((order) => {
    const placed = new Date(order.placedAt);
    return placed >= from && placed < to;
  });
}

const counted = (order: Order) => order.status !== "cancelled";

export interface Totals {
  revenue: number;
  orders: number;
  newCustomers: number;
}

// Revenue, orders and new customers over the last `days` days, and over the
// same number of days before them, for comparison
export async function summary(
  days: number,
): Promise<{ current: Totals; previous: Totals }> {
  const { orders, customers, today } = await getData();
  const totals = (from: Date, to: Date): Totals => {
    const placed = placedBetween(orders, from, to).filter(counted);
    return {
      revenue: placed.reduce((sum, order) => sum + order.total, 0),
      orders: placed.length,
      newCustomers: customers.filter((c) => {
        const created = new Date(c.createdAt);
        return created >= from && created < to;
      }).length,
    };
  };
  return {
    current: totals(dayStart(today, days), dayStart(today, 0)),
    previous: totals(dayStart(today, 2 * days), dayStart(today, days)),
  };
}

// Revenue per day over the last `days` days, oldest first
export async function revenueByDay(
  days: number,
): Promise<{ date: string; revenue: number }[]> {
  const { orders, today } = await getData();
  return Array.from({ length: days }, (_, i) => {
    const from = dayStart(today, days - i);
    const to = dayStart(today, days - i - 1);
    return {
      date: from.toISOString().slice(0, 10),
      revenue: placedBetween(orders, from, to)
        .filter(counted)
        .reduce((sum, order) => sum + order.total, 0),
    };
  });
}

// How many orders placed in the last `days` days are in each status now
export async function ordersByStatus(
  days: number,
): Promise<Record<OrderStatus, number>> {
  const { orders, today } = await getData();
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const order of placedBetween(
    orders,
    dayStart(today, days),
    dayStart(today, 0),
  )) {
    counts[order.status]++;
  }
  return counts;
}

// Products with this many or fewer in stock
export async function lowStock(threshold = 5): Promise<number> {
  const { products } = await getData();
  return products.filter((product) => product.stock <= threshold).length;
}

export interface CustomerTotals {
  orders: number;
  // Cancelled orders left out
  spent: number;
  lastOrderAt: string | null;
}

// One customer's orders, what they've spent, and when they last ordered
export async function customerTotals(
  customerId: string,
): Promise<CustomerTotals> {
  const { orders } = await getData();
  const theirs = orders.filter((order) => order.customerId === customerId);
  return {
    orders: theirs.length,
    spent: theirs.filter(counted).reduce((sum, order) => sum + order.total, 0),
    lastOrderAt:
      theirs
        .map((order) => order.placedAt)
        .sort()
        .at(-1) ?? null,
  };
}

export interface ActivityEvent {
  at: string;
  orderId: string;
  number: number;
  customerName: string;
  status: OrderStatus;
}

// The latest status changes across all orders, newest first
export async function activity(limit: number): Promise<ActivityEvent[]> {
  const { orders } = await getData();
  return orders
    .flatMap((order) =>
      order.history.map((change) => ({
        at: change.at,
        orderId: order.id,
        number: order.number,
        customerName: order.customerName,
        status: change.status,
      })),
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}
