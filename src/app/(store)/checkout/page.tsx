"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { OrderTotals } from "@/components/order/OrderSummary";
import { Alert, Button, Card, Field, PageTitle, TextArea, buttonClass, errorMessage } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { BD_PHONE_HINT, BD_PHONE_PATTERN } from "@/lib/phone";
import type { ApiItem, Order, OrderQuote, ShippingAddress, User } from "@/lib/types";

const emptyAddress: ShippingAddress = { fullName: "", phone: "", addressLine: "", area: "", city: "Dhaka", postalCode: "" };

export default function CheckoutPage() {
  const { user, setUser } = useAuth();
  const cart = useCart();

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(true);
  const [notes, setNotes] = useState("");
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const prefilled = useRef(false);

  // Prefill once from the account: name, phone and saved delivery address.
  useEffect(() => {
    if (!user || prefilled.current) return;
    prefilled.current = true;
    setAddress((a) => ({ ...a, fullName: user.name, phone: user.phone, ...user.address, city: "Dhaka" }));
  }, [user]);

  const lines = useMemo(() => cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })), [cart.items]);

  // Live quote from the server (authoritative prices + delivery fee).
  useEffect(() => {
    if (!cart.ready || lines.length === 0) return;
    const timer = setTimeout(() => {
      api<ApiItem<OrderQuote>>("/orders/quote", { method: "POST", body: { items: lines, city: address.city } })
        .then((r) => {
          setQuote(r.data);
          setQuoteError("");
        })
        .catch((err) => {
          setQuote(null);
          setQuoteError(errorMessage(err));
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [cart.ready, lines, address.city]);

  if (completedOrder) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Order received</p>
        <PageTitle>Thank you, {completedOrder.shippingAddress.fullName}</PageTitle>
        <p className="mt-4 text-brand-brown">Your order number is <strong className="text-brand-charcoal">{completedOrder.orderNumber}</strong>. We’ll contact you at {completedOrder.shippingAddress.phone} to confirm delivery.</p>
        {completedOrder.userId && <Link href={`/orders/${completedOrder.id}`} className={buttonClass("primary", "mt-7")}>View order</Link>}
        <div><Link href="/products" className="mt-5 inline-block text-sm font-semibold text-brand-red hover:underline">Continue shopping</Link></div>
      </section>
    );
  }

  if (cart.ready && cart.items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
        <PageTitle>Nothing to check out</PageTitle>
        <Link href="/products" className={buttonClass("primary", "mt-6")}>
          Browse products
        </Link>
      </section>
    );
  }

  const set = (field: keyof ShippingAddress) => (e: { target: { value: string } }) =>
    setAddress((a) => ({ ...a, [field]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPlacing(true);
    setSubmitError("");
    try {
      const { data: order } = await api<ApiItem<Order>>("/orders", {
        method: "POST",
        body: { items: lines, shippingAddress: address, notes, saveAddress },
      });
      if (saveAddress && user) {
        // Refresh the account so the saved address shows up everywhere.
        api<ApiItem<User>>("/auth/me").then((r) => setUser(r.data)).catch(() => {});
      }
      cart.clear();
      setCompletedOrder(order);
    } catch (err) {
      setSubmitError(errorMessage(err));
      setPlacing(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <PageTitle>Checkout</PageTitle>
      {!user && <p className="mt-2 text-sm text-brand-brown">Want faster checkouts and a handy record of your purchases? <Link href={`/login?next=${encodeURIComponent("/checkout")}`} className="font-semibold text-brand-red hover:underline">Log in</Link> to save your address and keep your order history in one place.</p>}

      <form onSubmit={onSubmit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold">Delivery address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="fullName" value={address.fullName} onChange={set("fullName")} required minLength={2} autoComplete="name" />
              <Field label="Mobile number" name="phone" type="tel" value={address.phone} onChange={set("phone")} required pattern={BD_PHONE_PATTERN} hint={BD_PHONE_HINT} autoComplete="tel" placeholder="01XXXXXXXXX" />
              <div className="sm:col-span-2">
                <Field label="Address (optional)" name="addressLine" value={address.addressLine} onChange={set("addressLine")} autoComplete="street-address" placeholder="House, road, block" />
              </div>
            </div>
            <p className="mt-3 text-xs text-brand-brown">Address details are optional. Delivery is currently available within Dhaka; we’ll call to confirm the details.</p>
            {user && address.addressLine.trim().length >= 5 && <label className="mt-4 flex items-center gap-3 text-sm">
              <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 accent-brand-red" />
              Save this address to my account for next time
            </label>}
            <div className="mt-4">
              <TextArea label="Order notes (optional)" name="notes" rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Payment</h2>
            <label className="mt-4 flex items-center gap-3 rounded-md border-2 border-brand-red bg-brand-red/5 p-3">
              <input type="radio" name="payment" checked readOnly className="accent-brand-red" />
              <span>
                <span className="font-semibold">Cash on delivery</span>
                <span className="block text-sm text-brand-brown">Pay when your order arrives. ID may be checked (18+).</span>
              </span>
            </label>
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="text-lg font-semibold">Your order</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(quote?.items ?? []).map((i) => (
              <li key={i.productId} className="flex justify-between gap-3">
                <span>
                  {i.name} <span className="text-brand-brown">× {i.quantity}</span>
                </span>
                <span>{formatPrice(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-brand-brown/15 pt-4">
            {quote ? <OrderTotals {...quote} /> : !quoteError && <p className="text-sm text-brand-brown">Calculating…</p>}
          </div>
          <div className="mt-4 space-y-3">
            <Alert>{quoteError}</Alert>
            <Alert>{submitError}</Alert>
            {quoteError && (
              <Link href="/cart" className="block text-sm font-semibold text-brand-red hover:underline">
                ← Update your cart
              </Link>
            )}
          </div>
          <Button type="submit" disabled={placing || !quote} className="mt-4 w-full">
            {placing ? "Placing order…" : quote ? `Place order · ${formatPrice(quote.total)}` : "Place order"}
          </Button>
        </Card>
      </form>
    </section>
  );
}
