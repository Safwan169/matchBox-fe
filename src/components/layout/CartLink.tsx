"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="flex items-center gap-1.5 hover:text-brand-flame" aria-label={`Cart, ${count} items`}>
      Cart
      {count > 0 && (
        <span className="min-w-5 rounded-full bg-brand-flame px-1.5 text-center text-xs leading-5 font-bold text-brand-charcoal">
          {count}
        </span>
      )}
    </Link>
  );
}
