"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Alert, Button, PageTitle, buttonClass, errorMessage } from "@/components/ui";
import { useRequireAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { ApiList, Order } from "@/lib/types";

export default function OrdersPage() {
  const { allowed } = useRequireAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!allowed) return;
    api<ApiList<Order>>(`/orders?page=${page}&limit=10`)
      .then((r) => {
        setOrders((prev) => (page === 1 ? r.data : [...prev, ...r.data]));
        setTotalPages(r.meta.totalPages);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [allowed, page]);

  if (!allowed) return <p className="mx-auto w-full max-w-4xl px-4 py-12 text-brand-brown">Loading…</p>;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10">
      <PageTitle>My orders</PageTitle>
      <div className="mt-6">
        <Alert>{error}</Alert>
      </div>

      {!loading && orders.length === 0 && !error ? (
        <div className="py-12 text-center">
          <p className="text-brand-brown">You haven’t placed any orders yet.</p>
          <Link href="/products" className={buttonClass("primary", "mt-6")}>
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/orders/${o.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-brown/15 bg-white/60 p-4 hover:border-brand-red"
              >
                <div>
                  <p className="font-mono font-semibold">{o.orderNumber}</p>
                  <p className="text-sm text-brand-brown">
                    {formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.quantity, 0)} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={o.status} />
                  <span className="font-bold">{formatPrice(o.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {page < totalPages && (
        <div className="mt-6 text-center">
          <Button variant="outline" disabled={loading} onClick={() => { setLoading(true); setPage((p) => p + 1); }}>
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
