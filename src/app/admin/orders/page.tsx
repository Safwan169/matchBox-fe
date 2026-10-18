"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminTable, Pager, tableInput } from "@/components/admin/AdminTable";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Alert, PageTitle } from "@/components/ui";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUSES, type ApiList, type Order } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);
  if (query) params.set("search", query);
  const { data, error, loading } = useAdminApi<ApiList<Order>>(`/admin/orders?${params}`);

  return (
    <div className="space-y-4">
      <PageTitle>Orders</PageTitle>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search.trim());
          setPage(1);
        }}
      >
        <input className={`${tableInput} min-w-56 flex-1`} placeholder="Order number, name or phone" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search orders" />
        <select className={tableInput} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </form>
      <Alert>{error}</Alert>

      <AdminTable head={["Order", "Date", "Customer", "Items", "Status", "Total"]} empty={!loading && data?.data.length === 0}>
        {data?.data.map((o) => (
          <tr key={o.id} className="hover:bg-brand-brown/5">
            <td className="px-4 py-3 font-mono">
              <Link href={`/admin/orders/${o.id}`} className="text-brand-red hover:underline">{o.orderNumber}</Link>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">{formatDate(o.createdAt)}</td>
            <td className="px-4 py-3">
              {o.shippingAddress.fullName}
              <span className="block text-xs text-brand-brown">{o.shippingAddress.phone} · {o.shippingAddress.city}</span>
            </td>
            <td className="px-4 py-3">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
            <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
            <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatPrice(o.total)}</td>
          </tr>
        ))}
      </AdminTable>
      {data && <Pager page={data.meta.page} totalPages={data.meta.totalPages} onPage={setPage} />}
    </div>
  );
}
