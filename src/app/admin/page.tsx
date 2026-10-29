"use client";

import Link from "next/link";
import { useAdminApi } from "@/components/admin/AdminShell";
import type { AdminStats } from "@/lib/admin-types";
import { formatDate, formatPrice } from "@/lib/format";
import type { ApiItem, OrderStatus } from "@/lib/types";

const orderStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminDashboard() {
  const { data, error } = useAdminApi<ApiItem<AdminStats>>("/admin/stats");
  const stats = data?.data;

  return (
    <div className="min-h-[calc(100vh-7rem)] space-y-8 bg-lux-ivory py-6 font-lux text-sm text-lux-ink sm:py-8">
      <header className="flex flex-col gap-5 border-b border-lux-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-medium tracking-[0.32em] text-lux-stone uppercase">Store overview</p>
          <h1 className="font-serif text-4xl leading-none font-light tracking-tight sm:text-5xl">Dashboard</h1>
          <p className="mt-3 text-sm font-light text-lux-stone">A clear view of your store, orders and inventory.</p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex w-fit items-center gap-3 border border-lux-ink/20 px-4 py-3 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 hover:border-lux-ink hover:bg-lux-ink hover:text-lux-ivory"
        >
          Review orders <span aria-hidden="true">→</span>
        </Link>
      </header>

      {error && (
        <p role="alert" className="border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {!stats ? (
        !error && <p role="status" className="py-8 text-sm font-light text-lux-stone">Loading store overview…</p>
      ) : (
        <>
          <section aria-label="Store metrics" className="grid grid-cols-2 border-t border-lux-ink/10 sm:grid-cols-3 xl:grid-cols-5">
            <Metric label="Revenue" value={formatPrice(stats.orders.revenue)} note="Excluding cancelled" />
            <Metric label="Orders" value={stats.orders.totalOrders} />
            <Metric
              label="Pending"
              value={stats.orders.byStatus.pending}
              href="/admin/orders"
              note="Awaiting action"
              accent={stats.orders.byStatus.pending > 0}
            />
            <Metric label="Customers" value={stats.customers} href="/admin/customers" />
            <Metric label="Products" value={stats.products} href="/admin/products" />
          </section>

          <section aria-labelledby="order-flow-title" className="border border-lux-ink/10 bg-white/55 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] text-lux-stone uppercase">Fulfilment</p>
                <h2 id="order-flow-title" className="mt-1 font-serif text-2xl font-light">Order flow</h2>
              </div>
              <Link href="/admin/orders" className="text-xs text-lux-stone transition-colors hover:text-lux-ink">
                Manage orders <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 border-t border-lux-ink/10 sm:grid-cols-5">
              {orderStatuses.map((status) => (
                <div key={status} className="flex items-center justify-between gap-3 border-b border-lux-ink/10 py-3 sm:border-b-0 sm:py-4">
                  <span className="flex items-center gap-2 text-xs capitalize text-lux-stone">
                    <StatusMark status={status} />
                    {status}
                  </span>
                  <span className="font-lux text-base tabular-nums">{stats.orders.byStatus[status]}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 2xl:grid-cols-2">
            <section aria-labelledby="recent-orders-title" className="min-w-0 border border-lux-ink/10 bg-white/55">
              <SectionHeading id="recent-orders-title" title="Recent orders" href="/admin/orders" linkLabel="All orders" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead className="border-y border-lux-ink/10 bg-lux-ink/[0.025] text-[10px] tracking-[0.18em] text-lux-stone uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-medium">Order</th>
                      <th scope="col" className="px-5 py-3 font-medium">Date</th>
                      <th scope="col" className="px-5 py-3 font-medium">Status</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lux-ink/10">
                    {stats.recentOrders.length === 0 ? (
                      <tr><td colSpan={4} className="px-5 py-10 text-center font-light text-lux-stone">No orders yet.</td></tr>
                    ) : (
                      stats.recentOrders.map((order) => (
                        <tr key={order.id} className="transition-colors hover:bg-lux-ink/[0.025]">
                          <td className="px-5 py-3.5 font-medium">
                            <Link href={`/admin/orders/${order.id}`} className="hover:underline">{order.orderNumber}</Link>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-lux-stone">{formatDate(order.createdAt)}</td>
                          <td className="px-5 py-3.5"><StatusLabel status={order.status} /></td>
                          <td className="px-5 py-3.5 text-right tabular-nums">{formatPrice(order.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="low-stock-title" className="min-w-0 border border-lux-ink/10 bg-white/55">
              <SectionHeading id="low-stock-title" title="Low stock" href="/admin/products" linkLabel="All products" note="5 units or fewer" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-left text-xs">
                  <thead className="border-y border-lux-ink/10 bg-lux-ink/[0.025] text-[10px] tracking-[0.18em] text-lux-stone uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-medium">Product</th>
                      <th scope="col" className="px-5 py-3 text-right font-medium">Available</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lux-ink/10">
                    {stats.lowStock.length === 0 ? (
                      <tr><td colSpan={2} className="px-5 py-10 text-center font-light text-lux-stone">No products need restocking.</td></tr>
                    ) : (
                      stats.lowStock.map((product) => (
                        <tr key={product.id} className="transition-colors hover:bg-lux-ink/[0.025]">
                          <td className="px-5 py-3.5 font-medium">
                            <Link href={`/admin/products/${product.id}`} className="hover:underline">{product.name}</Link>
                          </td>
                          <td className={`px-5 py-3.5 text-right tabular-nums ${product.stock === 0 ? "font-medium text-lux-oxblood" : "text-lux-stone"}`}>
                            {product.stock === 0 ? "Out of stock" : product.stock}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  href,
  accent = false,
}: {
  label: string;
  value: string | number;
  note?: string;
  href?: string;
  accent?: boolean;
}) {
  const content = (
    <div className={`min-h-28 border-b border-lux-ink/10 py-5 pr-4 sm:min-h-32 sm:py-6 ${accent ? "border-t-2 border-t-lux-brass" : ""}`}>
      <p className="text-[10px] font-medium tracking-[0.22em] text-lux-stone uppercase">{label}</p>
      <p className="mt-2 break-words font-serif text-3xl leading-none font-light tabular-nums sm:text-4xl">{value}</p>
      {note && <p className="mt-2 text-[11px] font-light text-lux-stone">{note}</p>}
    </div>
  );

  return (
    <div className="border-l border-lux-ink/10 pl-4 first:border-l-0 first:pl-0 sm:pl-5">
      {href ? <Link href={href} className="block transition-colors hover:text-lux-stone">{content}</Link> : content}
    </div>
  );
}

function SectionHeading({
  id,
  title,
  href,
  linkLabel,
  note,
}: {
  id: string;
  title: string;
  href: string;
  linkLabel: string;
  note?: string;
}) {
  return (
    <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <div>
        <h2 id={id} className="font-serif text-2xl leading-none font-light">{title}</h2>
        {note && <p className="mt-1.5 text-[11px] font-light text-lux-stone">{note}</p>}
      </div>
      <Link href={href} className="shrink-0 text-[10px] font-medium tracking-[0.15em] text-lux-stone uppercase transition-colors hover:text-lux-ink">
        {linkLabel} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function StatusMark({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    pending: "bg-lux-brass",
    confirmed: "bg-lux-stone",
    shipped: "bg-lux-ink/60",
    delivered: "bg-lux-ink",
    cancelled: "bg-lux-ink/25",
  };
  return <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${colors[status]}`} />;
}

function StatusLabel({ status }: { status: OrderStatus }) {
  return (
    <span className="inline-flex items-center gap-2 capitalize text-lux-stone">
      <StatusMark status={status} />
      {status}
    </span>
  );
}
