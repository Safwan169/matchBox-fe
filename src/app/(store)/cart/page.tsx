"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityInput } from "@/components/QuantityInput";
import { Alert, Card, PageTitle, buttonClass } from "@/components/ui";
import { useCart, type CartItem } from "@/context/CartContext";
import { apiGet } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { ApiItem, Product } from "@/lib/types";

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, remove, replace } = useCart();
  const [notice, setNotice] = useState("");
  const refreshed = useRef(false);

  // Once per visit, refresh prices/stock from the API and drop unavailable products.
  useEffect(() => {
    if (!ready || refreshed.current || items.length === 0) return;
    refreshed.current = true;

    Promise.all(
      items.map((item) =>
        apiGet<ApiItem<Product>>(`/products/${encodeURIComponent(item.slug)}`)
          .then(({ data }) => ({ item, product: data }))
          .catch(() => ({ item, product: null })),
      ),
    ).then((results) => {
      const changes: string[] = [];
      const next: CartItem[] = [];
      for (const { item, product } of results) {
        if (!product || product.stock <= 0) {
          changes.push(`${item.name} is no longer available and was removed.`);
          continue;
        }
        const quantity = Math.min(item.quantity, product.stock);
        if (product.price !== item.price) changes.push(`The price of ${item.name} changed.`);
        if (quantity < item.quantity) changes.push(`Only ${product.stock} of ${item.name} available.`);
        next.push({ ...item, productId: product.id, slug: product.slug, name: product.name, price: product.price, stock: product.stock, image: product.images[0] ?? null, quantity });
      }
      replace(next);
      setNotice(changes.join(" "));
    });
  }, [ready, items, replace]);

  if (!ready) return <p className="mx-auto w-full max-w-6xl px-4 py-12 text-brand-brown">Loading cart…</p>;

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
        <PageTitle>Your cart is empty</PageTitle>
        <p className="mt-3 text-brand-brown">Find something you like in the shop.</p>
        <Link href="/products" className={buttonClass("primary", "mt-6")}>
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <PageTitle>Your cart</PageTitle>
      {notice && (
        <div className="mt-4">
          <Alert>{notice}</Alert>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-brand-brown/15 rounded-lg border border-brand-brown/15 bg-white/60">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 p-4">
              <Link href={`/products/${item.slug}`} className="w-20 shrink-0 overflow-hidden rounded-md sm:w-24">
                <ProductImage src={item.image ?? undefined} alt={item.name} sizes="96px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/products/${item.slug}`} className="font-semibold hover:text-brand-red">
                    {item.name}
                  </Link>
                  <p className="text-sm text-brand-brown">{formatPrice(item.price)} each</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <QuantityInput value={item.quantity} max={item.stock} onChange={(q) => setQuantity(item.productId, q)} />
                  <p className="font-bold sm:w-24 sm:text-right">{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => remove(item.productId)} className="text-sm text-brand-red hover:underline" aria-label={`Remove ${item.name}`}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Card className="h-fit">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-brand-brown">
              <dt>Delivery</dt>
              <dd>Calculated at checkout</dd>
            </div>
          </dl>
          <Link href="/checkout" className={buttonClass("primary", "mt-6 w-full")}>
            Proceed to checkout
          </Link>
          <Link href="/products" className="mt-3 block text-center text-sm text-brand-red hover:underline">
            Continue shopping
          </Link>
        </Card>
      </div>
    </section>
  );
}
