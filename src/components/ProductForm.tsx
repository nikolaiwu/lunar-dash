import type { Product } from "@/lib/data";
import type { FormState } from "@/lib/form";
import { ErrorSummary } from "@/components/ErrorSummary";
import { Field } from "@/components/Field";
import { FieldGrid } from "@/components/FieldGrid";
import { categories, IMAGE_TYPES, SKU_PATTERN } from "@/resources/products";

// The form to add a product, or to edit one (given `product`). When the
// server sends it back with errors (`form`), the summary comes first and
// each field shows its own.
export function ProductForm({
  product,
  form,
  action,
}: {
  product?: Product;
  form?: FormState;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <>
      <ErrorSummary errors={form?.errors ?? {}} />
      <form action={action}>
        {product && <input type="hidden" name="id" value={product.id} />}
        <fieldset>
          <legend>Product</legend>
          <Field
            label="Name"
            name="name"
            form={form}
            defaultValue={product?.name}
            required
            maxLength={80}
          />
          <FieldGrid>
            <Field
              label="SKU"
              name="sku"
              hint="Three capital letters, a dash and three digits, like ROV-101."
              form={form}
              defaultValue={product?.sku}
              required
              pattern={SKU_PATTERN}
              autoCapitalize="characters"
            />
            <Field
              label="Category"
              name="category"
              form={form}
              defaultValue={product?.category ?? ""}
              required
              options={[
                { value: "", label: "Choose a category" },
                ...categories,
              ]}
            />
          </FieldGrid>
        </fieldset>
        <fieldset>
          <legend>Price and stock</legend>
          <FieldGrid>
            <Field
              label="Price (€)"
              name="price"
              type="number"
              form={form}
              defaultValue={product && (product.price / 100).toFixed(2)}
              required
              min={0}
              step={0.01}
              inputMode="decimal"
            />
            <Field
              label="Stock"
              name="stock"
              type="number"
              form={form}
              defaultValue={product?.stock}
              required
              min={0}
              step={1}
              inputMode="numeric"
            />
          </FieldGrid>
        </fieldset>
        <fieldset>
          <legend>Image</legend>
          <Field
            label="Product image"
            name="image"
            type="file"
            hint="PNG, JPEG or WebP, up to 2MB. The demo checks it, but has nowhere to keep it."
            form={form}
            accept={IMAGE_TYPES.join(",")}
          />
        </fieldset>
        <button type="submit">
          {product ? "Save product" : "Add product"}
        </button>
      </form>
    </>
  );
}
