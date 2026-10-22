import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { DataTable } from "@/components/DataTable";
import { FilterForm } from "@/components/FilterForm";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { orders } from "@/lib/data";
import { getFlash } from "@/lib/flash";
import {
  isFiltered,
  listHref,
  readListQuery,
  toListParams,
} from "@/lib/list-query";
import { bulkStatusOptions, ordersResource } from "@/resources/orders";
import { changeStatuses } from "./actions";

// Renders in full for each request, from the URL: the root layout's
// instant = false doesn't reach a page that reads it
export const instant = false;

export const metadata: Metadata = { title: "Orders" };

const BULK_FORM = "bulk-orders";

export default async function OrdersPage({
  searchParams,
}: PageProps<"/orders">) {
  const query = readListQuery(await searchParams, ordersResource);
  const [result, flash] = await Promise.all([
    orders.list(toListParams(query, ordersResource)),
    getFlash("/orders"),
  ]);

  return (
    <>
      <PageHeader
        title="Orders"
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Orders", href: "/orders" },
        ]}
        flash={flash.message}
      />

      <FilterForm resource={ordersResource} query={query} />

      {result.total > 0 && (
        <BulkActions
          id={BULK_FORM}
          action={changeStatuses}
          label="Selected orders"
          name="status"
          options={bulkStatusOptions}
          back={listHref("/orders", query)}
        />
      )}

      <DataTable
        resource={ordersResource}
        result={result}
        query={query}
        select={{ form: BULK_FORM }}
        empty={
          isFiltered(query) ? (
            <EmptyState
              message="No orders match."
              action={{
                href: listHref("/orders", { sort: query.sort }),
                label: "Show all orders",
              }}
            />
          ) : (
            <EmptyState message="No orders yet. They appear here as customers place them." />
          )
        }
      />

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        path="/orders"
        query={query}
      />
    </>
  );
}
