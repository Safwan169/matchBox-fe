"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { OrderDetail } from "@/components/order/OrderDetail";
import { Alert, Button, Card, errorMessage } from "@/components/ui";
import { STATUS_TRANSITIONS, type AdminOrder } from "@/lib/admin-types";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { ApiItem, Order, OrderStatus } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";

const actionLabels: Record<OrderStatus, string> = {
  pending: "Mark pending",
  confirmed: "Confirm order",
  shipped: "Mark as shipped",
  delivered: "Mark as delivered (paid)",
  cancelled: "Cancel order",
};

export default function AdminOrderPage() {
  return (
    <Suspense>
      <AdminOrder />
    </Suspense>
  );
}

function AdminOrder() {
  const { id } = useParams<{ id: string }>();
  const { data, error, setData } = useAdminApi<ApiItem<AdminOrder>>(`/admin/orders/${encodeURIComponent(id)}`);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const order = data?.data;

  async function changeStatus(status: OrderStatus) {
    if (!order) return;
    if (status === "cancelled" && !confirm("Cancel this order? Items will be returned to stock.")) return;
    setBusy(true);
    setActionError("");
    try {
      const { data: updated } = await api<ApiItem<Order>>(`/admin/orders/${order.id}/status`, { method: "PATCH", body: { status } });
      setData({ data: { ...updated, customer: order.customer } });
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Link href="/admin/orders" className="text-sm font-semibold text-brand-red hover:underline">← Orders</Link>
      <Alert>{error}</Alert>
      {!order ? (
        !error && <p className="text-brand-brown">Loading…</p>
      ) : (
        <OrderDetail
          order={order}
          actions={
            <>
              <Card>
                <h2 className="font-semibold">Update status</h2>
                <div className="mt-3 space-y-2">
                  {STATUS_TRANSITIONS[order.status].length === 0 && <p className="text-sm text-brand-brown">This order is closed.</p>}
                  {STATUS_TRANSITIONS[order.status].map((s) => (
                    <Button key={s} variant={s === "cancelled" ? "outline" : "primary"} className="w-full" disabled={busy} onClick={() => changeStatus(s)}>
                      {actionLabels[s]}
                    </Button>
                  ))}
                  <Alert>{actionError}</Alert>
                </div>
              </Card>
              {order.customer && (
                <Card>
                  <h2 className="font-semibold">Customer account</h2>
                  <p className="mt-2 text-sm">
                    {order.customer.name}
                    <br />
                    {order.customer.email}
                    <br />
                    <span className="text-brand-brown">Born {formatDate(order.customer.dateOfBirth)}</span>
                  </p>
                </Card>
              )}
            </>
          }
        />
      )}
    </div>
  );
}
