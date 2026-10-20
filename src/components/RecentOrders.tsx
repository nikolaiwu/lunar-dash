import Link from "next/link";
import type { Order } from "@/lib/data";
import { TableScroll } from "@/components/TableScroll";
import { formatDate, formatMoney } from "@/lib/format";
import { statusLabel } from "@/resources/orders";

// A short table of orders: number (linking to the order), customer, date,
// status and total. The orders list (0.5) gets the full, sortable table.
export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <TableScroll label="Recent orders">
      <table>
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Customer</th>
            <th scope="col">Placed</th>
            <th scope="col">Status</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={`/orders/${order.id}`}>#{order.number}</Link>
              </td>
              <td>{order.customerName}</td>
              <td>
                <time dateTime={order.placedAt}>
                  {formatDate(order.placedAt)}
                </time>
              </td>
              <td>{statusLabel(order.status)}</td>
              <td>
                <data value={order.total}>{formatMoney(order.total)}</data>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  );
}
