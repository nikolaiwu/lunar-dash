import type { OrderItem } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { TableScroll } from "@/components/TableScroll";

// An order's lines: each product, how many, at what price, and the total
// in the table's footer.
export function LineItems({
  items,
  total,
}: {
  items: OrderItem[];
  total: number;
}) {
  const money = (cents: number) => (
    <data value={cents}>{formatMoney(cents)}</data>
  );

  return (
    <TableScroll label="Items">
      <table>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={`${item.productId}-${i}`}>
              <th scope="row">{item.name}</th>
              <td>{item.quantity}</td>
              <td>{money(item.price)}</td>
              <td>{money(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={3}>
              Total
            </th>
            <td>{money(total)}</td>
          </tr>
        </tfoot>
      </table>
    </TableScroll>
  );
}
