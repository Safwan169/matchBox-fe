"use client";

import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Alert, Card, PageTitle } from "@/components/ui";
import type { AdminStats } from "@/lib/admin-types";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUSES, type ApiItem } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";

export default function AdminDashboard() {
  const { data, error } = useAdminApi<ApiItem<AdminStats>>("/admin/stats");
  const stats = data?.data;

  return (
    <div className="space-y-6">
      <PageTitle>Dashboard</PageTitle>
      <Alert>{error}</Alert>
      {!stats ? (
        !error && <p className="text-brand-brown">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Sales" value={formatPrice(stats.orders.revenue)} hint="excl. cancelled" />
            <Stat label="Orders" value={stats.orders.totalOrders} />
            <Stat label="Pending" value={stats.orders.byStatus.pending} href="/admin/orders" highlight={stats.orders.byStatus.pending > 0} />
            <Stat label="Customers" value={stats.customers} href="/admin/customers" />
          </div>

          <Card>
            <h2 className="font-semibold">Orders by status</h2>
            <div className="mt-3 flex flex-wrap gap-4">
              {ORDER_STATUSES.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <OrderStatusBadge status={s} />
                  <span className="font-bold">{stats.orders.byStatus[s]}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">Recent orders</h2>
                <Link href="/admin/orders" className="text-sm text-brand-red hover:underline">All orders →</Link>
              </div>
              <AdminTable head={["Order", "Date", "Status", "Total"]} empty={stats.recentOrders.length === 0}>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-brand-brown/5">
                    <td className="px-4 py-3 font-mono">
                      <Link href={`/admin/orders/${o.id}`} className="text-brand-red hover:underline">{o.orderNumber}</Link>
                    </td>
                    <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </AdminTable>
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">Low stock (5 or fewer)</h2>
                <Link href="/admin/products" className="text-sm text-brand-red hover:underline">All products →</Link>
              </div>
              <AdminTable head={["Product", "Stock"]} empty={stats.lowStock.length === 0}>
                {stats.lowStock.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-brown/5">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${p.id}`} className="hover:text-brand-red">{p.name}</Link>
                    </td>
                    <td className={`px-4 py-3 font-bold ${p.stock === 0 ? "text-red-700" : "text-brand-brown"}`}>{p.stock}</td>
                  </tr>
                ))}
              </AdminTable>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, hint, href, highlight }: { label: string; value: string | number; hint?: string; href?: string; highlight?: boolean }) {
  const body = (
    <div className={`rounded-lg border-2 p-4 ${highlight ? "border-brand-flame bg-brand-flame-light/40" : "border-brand-brown/15 bg-white/70"}`}>
      <p className="text-xs font-semibold tracking-wide text-brand-brown uppercase">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="text-xs text-brand-brown">{hint}</p>}
    </div>
  );
  return href ? <Link href={href} className="block hover:opacity-90">{body}</Link> : body;
}
