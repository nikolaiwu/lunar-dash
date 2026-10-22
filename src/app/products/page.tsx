import type { Metadata } from "next";
import Link from "next/link";
import { CardGrid } from "@/components/CardGrid";
import { FilterForm } from "@/components/FilterForm";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";
import { getFlash } from "@/lib/flash";
import {
  isFiltered,
  listHref,
  readListQuery,
  toListParams,
} from "@/lib/list-query";
import { productsResource } from "@/resources/products";

// Renders in full for each request, from the URL: the root layout's
// instant = false doesn't reach a page that reads it
export const instant = false;

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const query = readListQuery(await searchParams, productsResource);
  const [result, flash] = await Promise.all([
    products.list(toListParams(query, productsResource)),
    getFlash("/products"),
  ]);

  return (
    <>
      <PageHeader
        title="Products"
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Products", href: "/products" },
        ]}
        actions={<Link href="/products/new">Add a product</Link>}
        flash={flash.message}
      />

      <FilterForm resource={productsResource} query={query} />

      {result.items.length > 0 ? (
        <CardGrid>
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CardGrid>
      ) : isFiltered(query) ? (
        <p>
          No products match.{" "}
          <Link href={listHref("/products", { sort: query.sort })}>
            Show all products
          </Link>
        </p>
      ) : (
        <p>
          No products yet. <Link href="/products/new">Add a product</Link>
        </p>
      )}

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        path="/products"
        query={query}
      />
    </>
  );
}
