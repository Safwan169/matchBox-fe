"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { OrderDetail } from "@/components/order/OrderDetail";
import { Alert, Button, errorMessage } from "@/components/ui";
import { useRequireAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { ApiItem, Order } from "@/lib/types";

export default function OrderPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <Link href="/orders" className="text-sm font-semibold text-brand-red hover:underline">
        ← My orders
      </Link>
      <div className="mt-4">
        <Suspense>
          <OrderView />
        </Suspense>
      </div>
    </section>
  );
}

function OrderView() {
  const { allowed } = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const placed = useSearchParams().get("placed") === "1";
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!allowed) return;
    api<ApiItem<Order>>(`/orders/${encodeURIComponent(id)}`)
      .then((r) => setOrder(r.data))
      .catch((err) => setError(errorMessage(err)));
  }, [allowed, id]);

  async function cancel() {
    if (!order || !confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      setOrder((await api<ApiItem<Order>>(`/orders/${order.id}/cancel`, { method: "POST" })).data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  if (error && !order) return <Alert>{error}</Alert>;
  if (!order) return <p className="text-brand-brown">Loading order…</p>;

  return (
    <div className="space-y-6">
      {placed && order.status === "pending" && (
        <Alert kind="success">Thank you! Your order has been placed. We’ll contact you to confirm delivery.</Alert>
      )}
      {error && <Alert>{error}</Alert>}
      <OrderDetail
        order={order}
        actions={
          order.status === "pending" && (
            <Button variant="outline" onClick={cancel} disabled={cancelling} className="w-full">
              {cancelling ? "Cancelling…" : "Cancel order"}
            </Button>
          )
        }
      />
    </div>
  );
}
