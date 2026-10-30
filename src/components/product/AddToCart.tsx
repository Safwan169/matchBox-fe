"use client";

import Link from "next/link";
import { useState } from "react";
import { QuantityInput } from "@/components/QuantityInput";
import { Button } from "@/components/ui";
import { orderLimit, useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return <Button disabled className="w-full sm:w-auto">Out of stock</Button>;
  }

  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const limit = orderLimit(product);
  const remaining = limit - inCart;
  const limitReached = product.maxPerOrder !== null && limit === product.maxPerOrder;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityInput value={Math.min(quantity, Math.max(remaining, 1))} max={Math.max(remaining, 1)} onChange={setQuantity} />
        <Button
          variant="primary"
          className="min-w-56"
          disabled={remaining <= 0}
          onClick={() => {
            add(product, Math.min(quantity, remaining));
            setQuantity(1);
            setAdded(true);
          }}
        >
          {remaining <= 0 ? (limitReached ? "Order limit in your bag" : "All stock in your bag") : "Add to bag"}
        </Button>
      </div>
      {product.maxPerOrder !== null && (
        <p className="text-sm text-lux-stone">Limit {product.maxPerOrder} per order</p>
      )}
      {added && (
        <p role="status" className="text-sm text-lux-stone">
          Added to your bag ·{" "}
          <Link href="/cart" className="text-lux-ink underline decoration-lux-brass underline-offset-4">
            View bag
          </Link>
        </p>
      )}
    </div>
  );
}
