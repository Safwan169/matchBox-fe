"use client";

import { useState } from "react";
import { BagLine } from "@/components/luxury/icons";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

/**
 * The only interactive part of a product card (the rest is server-rendered HTML).
 * "overlay": slides up over the photo on hover (desktop); "text": a small link under it (phones).
 */
export function AddToBagButton({ product, look }: { product: Product; look: "overlay" | "text" }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function addToBag() {
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (look === "text") {
    return (
      <button onClick={addToBag} className="mt-2 text-[10px] tracking-[0.25em] text-lux-ink uppercase underline decoration-lux-brass underline-offset-4 md:hidden">
        {added ? "Added" : "Add to bag"}
      </button>
    );
  }

  return (
    <button
      onClick={addToBag}
      aria-label={`Add ${product.name} to bag`}
      className="absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 bg-lux-ivory/95 py-3 text-[10px] tracking-[0.3em] text-lux-ink uppercase backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-lux-ink hover:text-lux-ivory focus-visible:translate-y-0 focus-visible:opacity-100 md:flex md:translate-y-3 md:opacity-0"
    >
      <BagLine className="h-4 w-4" />
      {added ? "Added" : "Add to bag"}
    </button>
  );
}
