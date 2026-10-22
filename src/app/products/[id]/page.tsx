import type { Metadata } from "next";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { NotFound } from "@/components/NotFound";
import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";
import { products } from "@/lib/data";
import { getFlash } from "@/lib/flash";
import { productsResource } from "@/resources/products";
import { deleteProduct, saveProduct } from "../actions";

// Renders in full for each request, from the URL: the root layout's
// instant = false doesn't reach a page that reads it
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await products.get((await params).id);
  // A missing product is a page that says so (below): not for indexing
  return product
    ? { title: productsResource.title(product) }
    : { title: "Product not found", robots: { index: false } };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const path = `/products/${id}`;
  const [product, flash] = await Promise.all([
    products.get(id),
    getFlash(path),
  ]);
  // Shown in the page, not with notFound(): Next renders a not-found page
  // on the client, so without JavaScript it would be blank
  if (!product) {
    return (
      <NotFound
        title="No such product"
        message="There's no product at this address. It may have been deleted, or the link is wrong."
        back={{ href: "/products", label: "Go to the products" }}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={productsResource.title(product)}
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name, href: path },
        ]}
        actions={
          <button
            type="button"
            commandfor="delete-product"
            command="show-modal"
          >
            Delete product
          </button>
        }
        flash={flash.message}
      />
      <ProductForm product={product} form={flash.form} action={saveProduct} />
      <ConfirmDialog
        id="delete-product"
        title={`Delete ${product.name}?`}
        action={deleteProduct}
        values={{ id: product.id }}
        confirm="Delete product"
        dismiss="Keep product"
      >
        <p>
          It goes from the products list. Orders that include it keep it. You
          can&apos;t undo this.
        </p>
      </ConfirmDialog>
    </>
  );
}
