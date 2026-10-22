import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";
import { getFlash } from "@/lib/flash";
import { saveProduct } from "../actions";

export const metadata: Metadata = { title: "Add a product" };

export default async function NewProductPage() {
  const flash = await getFlash("/products/new");

  return (
    <>
      <PageHeader
        title="Add a product"
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Add a product", href: "/products/new" },
        ]}
      />
      <ProductForm form={flash.form} action={saveProduct} />
    </>
  );
}
