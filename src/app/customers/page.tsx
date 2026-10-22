import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { DataTable } from "@/components/DataTable";
import { FilterForm } from "@/components/FilterForm";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { customers } from "@/lib/data";
import {
  isFiltered,
  listHref,
  readListQuery,
  toListParams,
} from "@/lib/list-query";
import { customersResource } from "@/resources/customers";

// Renders in full for each request, from the URL: the root layout's
// instant = false doesn't reach a page that reads it
export const instant = false;

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: PageProps<"/customers">) {
  const query = readListQuery(await searchParams, customersResource);
  const result = await customers.list(toListParams(query, customersResource));

  return (
    <>
      <PageHeader
        title="Customers"
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Customers", href: "/customers" },
        ]}
      />

      <FilterForm resource={customersResource} query={query} />

      <DataTable
        resource={customersResource}
        result={result}
        query={query}
        empty={
          isFiltered(query) ? (
            <EmptyState
              message="No customers match."
              action={{
                href: listHref("/customers", { sort: query.sort }),
                label: "Show all customers",
              }}
            />
          ) : (
            <EmptyState message="No customers yet. They appear here with their first order." />
          )
        }
      />

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        path="/customers"
        query={query}
      />
    </>
  );
}
