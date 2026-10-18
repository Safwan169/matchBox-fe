"use client";

import { useState } from "react";
import { AdminTable, Pager, tableInput } from "@/components/admin/AdminTable";
import { Alert, PageTitle } from "@/components/ui";
import type { AdminCustomer } from "@/lib/admin-types";
import { formatDate } from "@/lib/format";
import type { ApiList } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (query) params.set("search", query);
  const { data, error, loading } = useAdminApi<ApiList<AdminCustomer>>(`/admin/customers?${params}`);

  return (
    <div className="space-y-4">
      <PageTitle>Customers</PageTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search.trim());
          setPage(1);
        }}
      >
        <input className={`${tableInput} w-full max-w-md`} placeholder="Name, email or phone" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search customers" />
      </form>
      <Alert>{error}</Alert>
      <AdminTable head={["Name", "Email", "Phone", "Orders", "Joined"]} empty={!loading && data?.data.length === 0}>
        {data?.data.map((u) => (
          <tr key={u.id} className="hover:bg-brand-brown/5">
            <td className="px-4 py-3 font-semibold">{u.name}</td>
            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">{u.phone || "—"}</td>
            <td className="px-4 py-3">{u.orderCount}</td>
            <td className="px-4 py-3 whitespace-nowrap">{formatDate(u.createdAt)}</td>
          </tr>
        ))}
      </AdminTable>
      {data && <Pager page={data.meta.page} totalPages={data.meta.totalPages} onPage={setPage} />}
    </div>
  );
}
