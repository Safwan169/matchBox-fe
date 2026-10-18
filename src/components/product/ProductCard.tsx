import Link from "next/link";
import type { Product } from "@/lib/types";
import { Price } from "./Price";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-brand-brown/15 bg-white/60 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative">
        <ProductImage src={product.images[0]} alt={product.name} hoverZoom />
        {onSale && (
          <span className="absolute top-2 left-2 rounded bg-brand-flame px-2 py-0.5 text-xs font-bold text-brand-charcoal">
            SALE
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2 right-2 rounded bg-brand-charcoal px-2 py-0.5 text-xs font-bold text-brand-cream">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.brand && <p className="text-xs tracking-wide text-brand-brown/70 uppercase">{product.brand}</p>}
        <h3 className="line-clamp-2 font-semibold group-hover:text-brand-red">{product.name}</h3>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-auto pt-1" />
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-brand-brown/10">
          <div className="aspect-square bg-brand-brown/10" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-1/3 rounded bg-brand-brown/10" />
            <div className="h-4 w-3/4 rounded bg-brand-brown/10" />
            <div className="h-4 w-1/4 rounded bg-brand-brown/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
