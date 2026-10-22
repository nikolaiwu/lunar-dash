"use server";

// Adding, editing and deleting products. Each checks for a signed-in user,
// checks the form (resources/products.ts), and redirects: back to the form
// with its errors, or on with a flash message.

import { redirect } from "next/navigation";
import { products } from "@/lib/data";
import { setFlash } from "@/lib/flash";
import { sendBack, textValues } from "@/lib/form";
import { requireUser } from "@/lib/session";
import { checkProduct, PRODUCT_FIELDS } from "@/resources/products";

// Adds a product, or saves one when the form has its id
export async function saveProduct(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const path = id ? `/products/${id}` : "/products/new";
  if (id && !(await products.get(id))) redirect("/products");

  const values = textValues(formData, PRODUCT_FIELDS);
  const image = formData.get("image");
  const sameSku = (
    await products.list({ filter: { sku: values.sku } })
  ).items.find((product) => product.id !== id);
  const result = checkProduct(
    values,
    image instanceof File ? image : null,
    sameSku?.name ?? null,
  );
  if ("errors" in result)
    return sendBack(path, { values, errors: result.errors });

  const kept =
    image instanceof File && image.size > 0
      ? " The image passed the checks, but the demo doesn't keep it."
      : "";
  if (id) {
    await products.update(id, result.product);
    await setFlash(path, { message: `${result.product.name} saved.${kept}` });
    redirect(path);
  }
  const created = await products.create(result.product);
  const createdPath = `/products/${created.id}`;
  await setFlash(createdPath, {
    message: `${created.name} added.${kept}`,
  });
  redirect(createdPath);
}

export async function deleteProduct(formData: FormData) {
  await requireUser();
  const product = await products.get(String(formData.get("id") ?? ""));
  if (product) {
    await products.remove(product.id);
    await setFlash("/products", { message: `${product.name} deleted.` });
  }
  redirect("/products");
}
