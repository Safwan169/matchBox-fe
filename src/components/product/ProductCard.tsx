import Link from "next/link";
import { Reveal } from "@/components/luxury/Reveal";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToBagButton } from "./AddToBagButton";
import { ProductImage } from "./ProductImage";

/** Server-rendered card; only the "Add to bag" buttons are client components. */
export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const soldOut = product.stock <= 0;
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <article className="group">
      <div className="relative">
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="lux-card-media block">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            hoverZoom
            eager={eager}
          />
        </Link>
        {onSale && !soldOut && (
          <span className="absolute top-3 left-3 bg-lux-ivory px-2.5 py-1 text-[9px] tracking-[0.25em] text-lux-oxblood uppercase">Offer</span>
        )}
        {soldOut && <span className="absolute top-3 left-3 bg-lux-ink px-2.5 py-1 text-[9px] tracking-[0.25em] text-lux-ivory uppercase">Sold out</span>}
        {!soldOut && <AddToBagButton product={product} look="overlay" />}
      </div>
      <div className="mt-4 space-y-1 text-center sm:mt-5 sm:space-y-1.5">
        {product.brand && <p className="text-[9px] tracking-[0.3em] text-lux-stone uppercase sm:text-[10px]">{product.brand}</p>}
        <h3 className="font-serif text-lg leading-snug sm:text-xl">
          <Link href={`/products/${product.slug}`} className="transition-colors duration-300 hover:text-lux-brass">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm tracking-wide">
          <span className={onSale ? "text-lux-oxblood" : ""}>{formatPrice(product.price)}</span>
          {onSale && <span className="ml-2 text-lux-stone line-through">{formatPrice(product.compareAtPrice!)}</span>}
        </p>
        {product.ratingCount > 0 && (
          <p className="text-[11px] text-lux-stone">
            <span className="text-lux-brass">★</span> {product.ratingAverage.toFixed(1)} · {product.ratingCount} review{product.ratingCount === 1 ? "" : "s"}
          </p>
        )}
        {!soldOut && <AddToBagButton product={product} look="text" />}
      </div>
    </article>
  );
}

/** The first row is usually visible without scrolling, so load those images right away. */
export const EAGER_COUNT = 4;

export const PRODUCT_GRID_CLASS = "grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-16";

/** Product cards that wipe up into view, one after another along each row. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={PRODUCT_GRID_CLASS}>
      {products.map((p, i) => (
        <Reveal key={p.id} variant="card" delay={(i % 4) * 120}>
          <ProductCard product={p} eager={i < EAGER_COUNT} />
        </Reveal>
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={PRODUCT_GRID_CLASS} aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-lux-ink/5" />
          <div className="mx-auto mt-5 h-3 w-1/3 bg-lux-ink/5" />
          <div className="mx-auto mt-3 h-4 w-2/3 bg-lux-ink/5" />
        </div>
      ))}
    </div>
  );
}
