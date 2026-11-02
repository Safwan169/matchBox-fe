"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityInput } from "@/components/QuantityInput";
import { Alert, Card, PageTitle, buttonClass } from "@/components/ui";
import { orderLimit, useCart, type CartItem } from "@/context/CartContext";
import { apiGet } from "@/lib/api";
import { formatDeliveryFee, formatPrice } from "@/lib/format";
import type { ApiItem, Product, StoreSettings } from "@/lib/types";

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, remove, replace } = useCart();
  const [notice, setNotice] = useState("");
  const [deliveryTiers, setDeliveryTiers] = useState<StoreSettings["deliveryTiers"]>([]);
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
        if (!product || product.stock <= 0 || product.price === null) {
          changes.push(`${item.name} is no longer available and was removed.`);
          continue;
        }
        const limit = orderLimit(product);
        const quantity = Math.min(item.quantity, limit);
        if (product.price !== item.price) changes.push(`The price of ${item.name} changed.`);
        if (quantity < item.quantity) {
          changes.push(limit < product.stock ? `${item.name} is limited to ${limit} per order.` : `Only ${product.stock} of ${item.name} available.`);
        }
        next.push({ ...item, productId: product.id, slug: product.slug, name: product.name, price: product.price, stock: product.stock, maxPerOrder: product.maxPerOrder, image: product.images[0] ?? null, quantity });
      }
      replace(next);
      setNotice(changes.join(" "));
    });
  }, [ready, items, replace]);

  useEffect(() => {
    apiGet<ApiItem<StoreSettings>>("/settings").then(({ data }) => setDeliveryTiers(data.deliveryTiers ?? [])).catch(() => {});
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const orderedTiers = [...deliveryTiers].sort((a, b) => a.minItems - b.minItems);
  const currentTier = [...orderedTiers].reverse().find((tier) => tier.minItems <= itemCount) ?? orderedTiers[0];
  const nextTier = orderedTiers.find((tier) => tier.minItems > itemCount);
  const remaining = nextTier ? nextTier.minItems - itemCount : 0;
  const progress = nextTier ? Math.max(0, Math.min(100, ((itemCount - (currentTier?.minItems ?? 1) + 1) / (nextTier.minItems - (currentTier?.minItems ?? 1) + 1)) * 100)) : 100;
  const offerText = nextTier?.message
    ? nextTier.message
        .replaceAll("{remaining}", String(remaining))
        .replaceAll("{deliveryFee}", formatDeliveryFee(nextTier.insideDhakaFee))
        .replaceAll("product(s)", remaining === 1 ? "product" : "products")
        .replaceAll("item(s)", remaining === 1 ? "item" : "items")
    : nextTier
      ? `Add ${remaining} more ${remaining === 1 ? "item" : "items"} to lower your delivery fee.`
      : "You’ve unlocked the best delivery price for this cart.";

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
      {deliveryTiers.length > 0 && <div className="mt-5 overflow-hidden rounded-lg border border-lux-brass/60 bg-lux-ink text-lux-ivory shadow-lg" role="status">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.28em] text-lux-brass uppercase">Delivery reward</p>
            <p className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{nextTier ? `Only ${remaining} more ${remaining === 1 ? "item" : "items"} to unlock a lower delivery fee` : "You’ve unlocked the best delivery price"}</p>
            {nextTier?.message && <p className="mt-2 text-sm leading-relaxed text-lux-ivory/80">{offerText}</p>}
            {nextTier && <p className="mt-2 text-sm text-lux-ivory/75">Next delivery fee: {formatDeliveryFee(nextTier.insideDhakaFee)} within Dhaka</p>}
            {!nextTier && <p className="mt-2 text-sm text-lux-ivory/75">{offerText}</p>}
          </div>
          <Link href="/products" className="inline-flex shrink-0 items-center justify-center border border-lux-brass px-4 py-2 text-xs font-semibold tracking-[0.14em] text-lux-brass uppercase transition hover:bg-lux-brass hover:text-lux-ink">Add another item</Link>
        </div>
        <div className="h-1.5 bg-white/15"><div className="h-full bg-lux-brass transition-all" style={{ width: `${progress}%` }} /></div>
      </div>}
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
                  <QuantityInput value={item.quantity} max={orderLimit(item)} onChange={(q) => setQuantity(item.productId, q)} />
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
            {currentTier ? <>
              <div className="flex justify-between text-brand-brown"><dt>Delivery · Dhaka</dt><dd className="font-semibold text-brand-charcoal">{formatDeliveryFee(currentTier.insideDhakaFee)}</dd></div>
              <p className="text-xs leading-relaxed text-brand-brown">We currently deliver within Dhaka. Fee shown for {itemCount} {itemCount === 1 ? "item" : "items"}; confirmed at checkout.</p>
            </> : <div className="flex justify-between text-brand-brown"><dt>Delivery</dt><dd>Loading fees…</dd></div>}
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
