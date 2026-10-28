"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { assetUrl, isUpload } from "@/lib/assets";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { BagLine } from "./icons";

/**
 * `sample` is shown when the product has no photo yet, or always with `preferSample`
 * (design preview, so test uploads don't distract from the design).
 */
export function LuxProductCard({ product, category, sample, preferSample = false }: { product: Product; category?: string; sample: string; preferSample?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const src = preferSample ? undefined : product.images[0];
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const soldOut = product.stock <= 0;

  function addToBag() {
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-lux-linen">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={src ? assetUrl(src) : sample}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 75vw"
            unoptimized={src ? !isUpload(src) : false}
            className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </Link>
        {onSale && <span className="absolute top-4 left-4 bg-lux-ivory px-2.5 py-1 text-[9px] tracking-[0.25em] text-lux-oxblood uppercase">Offer</span>}
        {!soldOut && (
          <button
            onClick={addToBag}
            className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 bg-lux-ivory/95 py-3 text-[10px] tracking-[0.3em] text-lux-ink uppercase backdrop-blur transition-all duration-500 hover:bg-lux-ink hover:text-lux-ivory md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
          >
            <BagLine className="h-4 w-4" />
            {added ? "Added" : "Add to bag"}
          </button>
        )}
      </div>
      <div className="mt-5 space-y-1.5 text-center">
        {category && <p className="text-[10px] tracking-[0.3em] text-lux-stone uppercase">{category}</p>}
        <h3 className="font-serif text-xl leading-snug">
          <Link href={`/products/${product.slug}`} className="transition-colors duration-300 hover:text-lux-brass">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm tracking-wide">
          {soldOut ? (
            <span className="text-lux-stone">Sold out</span>
          ) : (
            <>
              <span className={onSale ? "text-lux-oxblood" : ""}>{formatPrice(product.price)}</span>
              {onSale && <span className="ml-2 text-lux-stone line-through">{formatPrice(product.compareAtPrice!)}</span>}
            </>
          )}
        </p>
      </div>
    </article>
  );
}
