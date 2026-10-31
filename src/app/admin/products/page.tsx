"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminTable, Pager, tableInput } from "@/components/admin/AdminTable";
import { ProductImage } from "@/components/product/ProductImage";
import { Alert, PageTitle, buttonClass } from "@/components/ui";
import type { AdminCategory } from "@/lib/admin-types";
import { formatPrice } from "@/lib/format";
import type { ApiItem, ApiList, Product } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page: String(page), limit: "20", status });
  if (query) params.set("search", query);
  if (categoryId) params.set("categoryId", categoryId);
  const { data, error, loading } = useAdminApi<ApiList<Product>>(`/admin/products?${params}`);
  const { data: cats } = useAdminApi<ApiItem<AdminCategory[]>>("/admin/categories");
  const categoryName = new Map(cats?.data.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>Products</PageTitle>
        <Link href="/admin/products/new" className={buttonClass("primary")}>
          + New product
        </Link>
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search.trim());
          setPage(1);
        }}
      >
        <input className={`${tableInput} min-w-56 flex-1`} placeholder="Search name or brand" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search products" />
        <select className={tableInput} value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} aria-label="Category">
          <option value="">All categories</option>
          {cats?.data.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={tableInput} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Visibility">
          <option value="all">All</option>
          <option value="active">Visible</option>
          <option value="inactive">Hidden</option>
        </select>
      </form>
      <Alert>{error}</Alert>

      <AdminTable head={["", "Product", "Category", "Price", "Stock", "Status"]} loading={loading} empty={!loading && data?.data.length === 0}>
        {data?.data.map((p) => (
          <tr key={p.id} className="hover:bg-brand-brown/5">
            <td className="w-14 px-4 py-2">
              <div className="w-10 overflow-hidden rounded">
                <ProductImage src={p.images[0]} alt="" sizes="40px" />
              </div>
            </td>
            <td className="px-4 py-3">
              <Link href={`/admin/products/${p.id}`} className="font-semibold hover:text-brand-red">{p.name}</Link>
              {p.brand && <span className="block text-xs text-brand-brown">{p.brand}</span>}
            </td>
            <td className="px-4 py-3">{categoryName.get(p.categoryId) ?? "—"}</td>
            <td className="px-4 py-3 whitespace-nowrap">{p.price === null ? "—" : formatPrice(p.price)}</td>
            <td className={`px-4 py-3 font-semibold ${p.stock <= 5 ? "text-red-700" : ""}`}>{p.stock}</td>
            <td className="px-4 py-3 text-xs font-semibold">
              {p.isActive ? <span className="text-green-800">Visible</span> : <span className="text-brand-brown">Hidden</span>}
              {p.isFeatured && <span className="ml-2 text-brand-red">★ Featured</span>}
            </td>
          </tr>
        ))}
      </AdminTable>
      {data && <Pager page={data.meta.page} totalPages={data.meta.totalPages} onPage={setPage} />}
    </div>
  );
}
