import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { LOW_STOCK } from "@/resources/products";

// A product in the products grid: its picture, name (linking to its page),
// price, and stock as a meter that turns to a warning when it runs low.
// LunarCSS draws the article as a card.
export function ProductCard({ product }: { product: Product }) {
  const stockId = `stock-${product.id}`;

  return (
    <article>
      <div>
        <ProductImage category={product.category} />
      </div>
      <header>
        <h2>
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h2>
      </header>
      <p>
        <data value={product.price}>{formatMoney(product.price)}</data>
      </p>
      <p>
        <span id={stockId}>{product.stock} in stock</span>{" "}
        <meter
          value={product.stock}
          min={0}
          max={100}
          low={LOW_STOCK + 1}
          high={20}
          optimum={100}
          aria-labelledby={stockId}
        >
          {product.stock}
        </meter>
      </p>
      <footer>
        <small>
          {product.sku} · {product.category}
        </small>
      </footer>
    </article>
  );
}
