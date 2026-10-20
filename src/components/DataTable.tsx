import Link from "next/link";
import type { ListResult } from "@/lib/data";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { listHref, type ListQuery } from "@/lib/list-query";
import { TableScroll } from "@/components/TableScroll";
import type { Column, ResourceDescription } from "@/resources/types";

// A page of a list as a table, with the columns from the resource's
// description. A sortable column's header is a link that sorts by it (again
// to reverse), and the sorted column says so with aria-sort. The caption
// counts what's shown.
//
// `fields` shows only some of the columns, such as a customer's orders
// without the customer.
//
// With select, each row starts with a checkbox (name "ids", the item's id)
// that belongs to the form with that id, so a bulk action's form can sit
// anywhere on the page. When the list is empty, the table gives way to
// `empty`.
export function DataTable<T extends { id: string }>({
  resource,
  result,
  query,
  path = resource.path,
  fields,
  select,
  empty,
}: {
  resource: ResourceDescription<T>;
  result: ListResult<T>;
  // The URL's state, kept in the sort links
  query: ListQuery;
  // Where the sort links go: the page the table is on
  path?: string;
  fields?: (keyof T & string)[];
  select?: { form: string };
  empty: React.ReactNode;
}) {
  if (result.items.length === 0) return empty;

  const { items, total, page, pageSize, sort } = result;
  const first = (page - 1) * pageSize + 1;
  const last = first + items.length - 1;
  const caption =
    total <= items.length
      ? `${total} ${total === 1 ? resource.singular : resource.plural}`
      : `${first}–${last} of ${total} ${resource.plural}`;
  const columns = resource.columns.filter(
    (column) => !fields || fields.includes(column.field),
  );
  const rowHeader = columns.find((c) => c.link);

  return (
    <TableScroll label={caption}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {select && <th scope="col">Select</th>}
            {columns.map((column) => (
              <HeaderCell
                key={column.field}
                column={column}
                sort={sort}
                href={(sort) =>
                  listHref(path, query, { sort, page: undefined })
                }
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {select && (
                <td>
                  <input
                    type="checkbox"
                    name="ids"
                    value={item.id}
                    form={select.form}
                    aria-label={`Select ${resource.title(item)}`}
                  />
                </td>
              )}
              {columns.map((column) => {
                const content = (
                  <Value
                    column={column}
                    item={item}
                    href={column.link && `${resource.path}/${item.id}`}
                  />
                );
                return column === rowHeader ? (
                  <th key={column.field} scope="row">
                    {content}
                  </th>
                ) : (
                  <td key={column.field}>{content}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  );
}

// A column's header: a link that sorts by it if it can be sorted. A first
// click sorts ascending; on the sorted column the link reverses it.
function HeaderCell<T>({
  column,
  sort,
  href,
}: {
  column: Column<T>;
  sort: string;
  href: (sort: string) => string;
}) {
  if (!column.sortable) return <th scope="col">{column.label}</th>;

  const direction =
    sort === column.field
      ? "ascending"
      : sort === `-${column.field}`
        ? "descending"
        : undefined;
  const next = direction === "ascending" ? `-${column.field}` : column.field;

  return (
    <th scope="col" aria-sort={direction}>
      <Link href={href(next)}>
        {column.label}
        {direction && (
          <span aria-hidden="true">
            {direction === "ascending" ? " ↑" : " ↓"}
          </span>
        )}
      </Link>
    </th>
  );
}

// One cell's value, formatted as the column says, as a link if it is one
function Value<T>({
  column,
  item,
  href,
}: {
  column: Column<T>;
  item: T;
  href: string | false | undefined;
}) {
  const value = item[column.field];
  let content: React.ReactNode;
  if (column.text) {
    content = column.text(item);
  } else if (column.format === "money") {
    content = <data value={Number(value)}>{formatMoney(Number(value))}</data>;
  } else if (column.format === "number") {
    content = <data value={Number(value)}>{formatNumber(Number(value))}</data>;
  } else if (column.format === "date") {
    content = (
      <time dateTime={String(value)}>
        {formatDate(String(value), { year: true })}
      </time>
    );
  } else {
    content = String(value);
  }
  return href ? <Link href={href}>{content}</Link> : content;
}
