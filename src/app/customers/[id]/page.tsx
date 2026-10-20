import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { Split } from "@/components/Split";
import { customers, metrics, orders } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { readListQuery, toListParams } from "@/lib/list-query";
import { customersResource } from "@/resources/customers";
import { ordersResource } from "@/resources/orders";

// Renders in full for each request, from the URL: the root layout's
// instant = false doesn't reach a page that reads it
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/customers/[id]">): Promise<Metadata> {
  const customer = await customers.get((await params).id);
  return {
    title: customer ? customersResource.title(customer) : "Customer not found",
  };
}

export default async function CustomerPage({
  params,
  searchParams,
}: PageProps<"/customers/[id]">) {
  const { id } = await params;
  const path = `/customers/${id}`;
  // Their orders can be sorted and paged, like the orders list
  const { sort, page } = readListQuery(await searchParams, ordersResource);
  const query = { sort, page };
  const [customer, totals, theirOrders] = await Promise.all([
    customers.get(id),
    metrics.customerTotals(id),
    orders.list({
      ...toListParams(query, ordersResource),
      filter: { customerId: id },
    }),
  ]);
  if (!customer) notFound();

  return (
    <>
      <PageHeader
        title={customersResource.title(customer)}
        description={`${customer.company}, ${customer.country}`}
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Customers", href: "/customers" },
          { label: customer.name, href: path },
        ]}
      />

      <Split>
        <div>
          <section>
            <h2>Orders</h2>
            <DataTable
              resource={ordersResource}
              result={theirOrders}
              query={query}
              path={path}
              fields={["number", "placedAt", "status", "total"]}
              empty={<p>{customer.name} hasn&apos;t ordered yet.</p>}
            />
            <Pagination
              page={theirOrders.page}
              pageCount={theirOrders.pageCount}
              path={path}
              query={query}
            />
          </section>
        </div>
        <div>
          <section>
            <h2>Details</h2>
            <dl>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${customer.email}`}>{customer.email}</a>
              </dd>
              <dt>Company</dt>
              <dd>{customer.company}</dd>
              <dt>Country</dt>
              <dd>{customer.country}</dd>
              <dt>Customer since</dt>
              <dd>
                <time dateTime={customer.createdAt}>
                  {formatDate(customer.createdAt, { year: true })}
                </time>
              </dd>
              <dt>Orders</dt>
              <dd>{totals.orders}</dd>
              <dt>Spent</dt>
              <dd>
                <data value={totals.spent}>{formatMoney(totals.spent)}</data>
              </dd>
              {totals.lastOrderAt && (
                <>
                  <dt>Last order</dt>
                  <dd>
                    <time dateTime={totals.lastOrderAt}>
                      {formatDate(totals.lastOrderAt, { year: true })}
                    </time>
                  </dd>
                </>
              )}
            </dl>
          </section>
        </div>
      </Split>
    </>
  );
}
