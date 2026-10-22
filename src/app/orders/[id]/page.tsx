import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/ActionButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LineItems } from "@/components/LineItems";
import { NotFound } from "@/components/NotFound";
import { PageHeader } from "@/components/PageHeader";
import { Split } from "@/components/Split";
import { Timeline } from "@/components/Timeline";
import { orders } from "@/lib/data";
import { getFlash } from "@/lib/flash";
import { formatDateTime, formatMoney } from "@/lib/format";
import {
  canCancel,
  historyLabel,
  nextStatus,
  ordersResource,
  statusLabel,
} from "@/resources/orders";
import { changeStatus } from "../actions";

// Renders in full for each request, from the URL: the root layout's
// instant = false doesn't reach a page that reads it
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/orders/[id]">): Promise<Metadata> {
  const order = await orders.get((await params).id);
  // A missing order is a page that says so (below): not for indexing
  return order
    ? { title: ordersResource.title(order) }
    : { title: "Order not found", robots: { index: false } };
}

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const [order, flash] = await Promise.all([
    orders.get(id),
    getFlash(`/orders/${id}`),
  ]);
  // Shown in the page, not with notFound(): Next renders a not-found page
  // on the client, so without JavaScript it would be blank
  if (!order) {
    return (
      <NotFound
        title="No such order"
        message="There's no order at this address. Check the link, or find it in the list."
        back={{ href: "/orders", label: "Go to the orders" }}
      />
    );
  }

  const title = ordersResource.title(order);
  const next = nextStatus(order.status);

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: `#${order.number}`, href: `/orders/${order.id}` },
        ]}
        flash={flash.message}
        actions={
          <>
            {next && (
              <ActionButton
                action={changeStatus}
                values={{ id: order.id, status: next }}
              >
                Mark {statusLabel(next).toLowerCase()}
              </ActionButton>
            )}
            {canCancel(order.status) && (
              <button
                type="button"
                commandfor="cancel-order"
                command="show-modal"
              >
                Cancel order
              </button>
            )}
          </>
        }
      />

      <Split>
        <div>
          <section>
            <h2>Items</h2>
            <LineItems items={order.items} total={order.total} />
          </section>
          <section>
            <h2>History</h2>
            <Timeline
              events={order.history.map((change) => ({
                at: change.at,
                label: historyLabel(change.status),
              }))}
            />
          </section>
        </div>
        <div>
          <section>
            <h2>Summary</h2>
            <dl>
              <dt>Status</dt>
              <dd>{statusLabel(order.status)}</dd>
              <dt>Customer</dt>
              <dd>
                <Link href={`/customers/${order.customerId}`}>
                  {order.customerName}
                </Link>
              </dd>
              <dt>Placed</dt>
              <dd>
                <time dateTime={order.placedAt}>
                  {formatDateTime(order.placedAt)}
                </time>
              </dd>
              <dt>Total</dt>
              <dd>
                <data value={order.total}>{formatMoney(order.total)}</data>
              </dd>
            </dl>
          </section>
        </div>
      </Split>

      {canCancel(order.status) && (
        <ConfirmDialog
          id="cancel-order"
          title={`Cancel order #${order.number}?`}
          action={changeStatus}
          values={{ id: order.id, status: "cancelled" }}
          confirm="Cancel order"
          dismiss="Keep order"
        >
          <p>
            {order.customerName}&apos;s order won&apos;t be shipped. You
            can&apos;t undo this.
          </p>
        </ConfirmDialog>
      )}
    </>
  );
}
