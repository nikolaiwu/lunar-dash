// What the interface says about products: the categories, the list's
// filters, stock levels, and the rules a product's form is checked against.

import type { Product } from "@/lib/data";
import type { FormState } from "@/lib/form";
import type { ResourceDescription } from "@/resources/types";

export const categories = ["Rovers", "Arms", "Drones", "Sensors", "Parts"].map(
  (category) => ({ value: category, label: category }),
);

// At or below this, a product's stock is low: the overview counts it, and
// its meter turns to a warning
export const LOW_STOCK = 5;

export const productsResource: ResourceDescription<Product> = {
  singular: "product",
  plural: "products",
  path: "/products",
  title: (product) => product.name,
  // The list is a grid of cards, not a table; these are for a table of
  // products (and they're what ?sort= accepts)
  columns: [
    { field: "name", label: "Name", sortable: true, link: true },
    { field: "sku", label: "SKU", sortable: true },
    { field: "category", label: "Category", sortable: true },
    { field: "price", label: "Price", sortable: true, format: "money" },
    { field: "stock", label: "Stock", sortable: true, format: "number" },
  ],
  filters: [
    {
      type: "select",
      field: "category",
      label: "Category",
      options: categories,
    },
  ],
  search: "Name, SKU or category",
};

// The form's text fields, by name
export const PRODUCT_FIELDS = ["name", "sku", "category", "price", "stock"];

export const SKU_PATTERN = "[A-Z]{3}-[0-9]{3}";

// The image a product form may send. The demo doesn't keep it (it has
// nowhere to put it), but checks it like a real upload would.
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;

// Checks a product form's values: the same rules as the fields' native
// validation, and what only the server knows (`skuInUse`: the name of
// another product with this SKU, if one has it). Returns the product to
// save, or the errors.
export function checkProduct(
  values: Record<string, string>,
  image: File | null,
  skuInUse: string | null,
): { product: Omit<Product, "id"> } | { errors: FormState["errors"] } {
  const errors: FormState["errors"] = {};
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (!values.name) errors.name = "Enter the product's name.";
  else if (values.name.length > 80)
    errors.name = "Keep the name to 80 characters or fewer.";

  if (!new RegExp(`^${SKU_PATTERN}$`).test(values.sku))
    errors.sku =
      "Enter the SKU as three capital letters, a dash and three digits, like ROV-101.";
  else if (skuInUse)
    errors.sku = `${skuInUse} already has the SKU ${values.sku}. Give this product another one.`;

  if (!categories.some((c) => c.value === values.category))
    errors.category = "Choose a category.";

  if (values.price === "" || !Number.isFinite(price) || price < 0)
    errors.price = "Enter the price in euros, like 420 or 89.50.";
  else if (Math.round(price * 100) !== price * 100)
    errors.price = "Enter the price to the cent at most, like 89.50.";

  if (values.stock === "" || !Number.isInteger(stock) || stock < 0)
    errors.stock = "Enter the stock as a whole number, 0 or more.";

  if (image && image.size > 0) {
    if (!IMAGE_TYPES.includes(image.type))
      errors.image = "Choose a PNG, JPEG or WebP image.";
    else if (image.size > IMAGE_MAX_BYTES)
      errors.image = "Choose an image of 2MB or less.";
  }

  if (Object.keys(errors).length) return { errors };
  return {
    product: {
      name: values.name,
      sku: values.sku,
      category: values.category,
      price: Math.round(price * 100),
      stock,
    },
  };
}
