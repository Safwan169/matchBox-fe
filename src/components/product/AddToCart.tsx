"use client";

import Link from "next/link";
import { useState } from "react";
import { QuantityInput } from "@/components/QuantityInput";
import { Button } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return <Button disabled className="w-full sm:w-auto">Out of stock</Button>;
  }

  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const remaining = product.stock - inCart;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityInput value={Math.min(quantity, Math.max(remaining, 1))} max={Math.max(remaining, 1)} onChange={setQuantity} />
        <Button
          variant="accent"
          disabled={remaining <= 0}
          onClick={() => {
            add(product, Math.min(quantity, remaining));
            setQuantity(1);
            setAdded(true);
          }}
        >
          {remaining <= 0 ? "All stock in cart" : "Add to cart"}
        </Button>
      </div>
      {added && (
        <p role="status" className="text-sm text-green-800">
          Added to cart ·{" "}
          <Link href="/cart" className="font-semibold underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
