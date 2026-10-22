"use server";

// What can be done to orders: move one or several to another status, or
// cancel one. Each checks the move is allowed, saves it, and redirects back
// with a flash message, so a form works the same with JavaScript or without.
//
// Anyone who can reach the app can call these (they're POST endpoints), so
// each one checks for a signed-in user first.

import { redirect } from "next/navigation";
import { orders, type OrderStatus } from "@/lib/data";
import { setFlash } from "@/lib/flash";
import { requireUser } from "@/lib/session";
import { canMove, statusLabel } from "@/resources/orders";

// Where to go back to: a page under /orders, from the form, or the list
function back(formData: FormData) {
  const value = String(formData.get("back") ?? "");
  const url = new URL(value, "http://localhost");
  return value.startsWith("/") &&
    (url.pathname === "/orders" || url.pathname.startsWith("/orders/"))
    ? url.pathname + url.search
    : "/orders";
}

// Leave a flash message for the page
function say(path: string, message: string) {
  return setFlash(path, { message });
}

function done(status: OrderStatus) {
  return status === "cancelled"
    ? "cancelled"
    : `marked ${statusLabel(status).toLowerCase()}`;
}

export async function changeStatus(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const order = await orders.get(id);
  if (!order) redirect("/orders");

  const path = `/orders/${order.id}`;
  if (!canMove(order.status, status)) {
    await say(
      path,
      `Order #${order.number} is ${statusLabel(order.status).toLowerCase()}, so it can't be ${done(status)}.`,
    );
    redirect(path);
  }
  await orders.update(order.id, { status });
  await say(path, `Order #${order.number} ${done(status)}.`);
  redirect(path);
}

export async function changeStatuses(formData: FormData) {
  await requireUser();
  const path = back(formData);
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const ids = formData.getAll("ids").map(String);
  if (ids.length === 0) {
    await say(path, "Select one or more orders first.");
    redirect(path);
  }

  const selected = (await Promise.all(ids.map(orders.get))).filter(
    (order) => order !== null,
  );
  const moving = selected.filter((order) => canMove(order.status, status));
  if (moving.length) {
    await orders.update(
      moving.map((order) => order.id),
      { status },
    );
  }

  const skipped = selected.length - moving.length;
  const count = (n: number) => `${n} ${n === 1 ? "order" : "orders"}`;
  await say(
    path,
    [
      moving.length ? `${count(moving.length)} ${done(status)}.` : "",
      skipped
        ? `${count(skipped)} skipped: ${skipped === 1 ? "it" : "they"} can't be ${done(status)} from ${skipped === 1 ? "its" : "their"} status.`
        : "",
    ]
      .filter(Boolean)
      .join(" "),
  );
  redirect(path);
}
