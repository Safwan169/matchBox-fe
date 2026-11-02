"use client";

import Link from "next/link";
import { useEffect, useState, type DragEvent } from "react";
import { AdminTable, Pager, tableInput } from "@/components/admin/AdminTable";
import { ProductImage } from "@/components/product/ProductImage";
import { Alert, PageTitle, buttonClass, errorMessage } from "@/components/ui";
import type { AdminCategory } from "@/lib/admin-types";
import { formatPrice } from "@/lib/format";
import type { ApiItem, ApiList, Product } from "@/lib/types";
import { api } from "@/lib/api";
import { useAdminApi } from "@/components/admin/AdminShell";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [reordering, setReordering] = useState(false);

  const params = new URLSearchParams({ page: String(page), limit: "20", status });
  if (query) params.set("search", query);
  if (categoryId) params.set("categoryId", categoryId);
  const { data, error, loading } = useAdminApi<ApiList<Product>>(`/admin/products?${params}`);
  const { data: cats } = useAdminApi<ApiItem<AdminCategory[]>>("/admin/categories");
  const { data: orderData, error: orderError } = useAdminApi<ApiItem<Product[]>>(reordering ? "/admin/products/order" : null);
  const categoryName = new Map(cats?.data.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>Products</PageTitle>
        <div className="flex gap-2">
          <button type="button" className={buttonClass("outline")} onClick={() => setReordering((v) => !v)}>{reordering ? "Done reordering" : "Reorder products"}</button>
          {!reordering && <Link href="/admin/products/new" className={buttonClass("primary")}>+ New product</Link>}
        </div>
      </div>

      {reordering ? <ProductOrderEditor products={orderData?.data} loadError={orderError} /> : <>

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
      </>}
    </div>
  );
}

function ProductOrderEditor({ products, loadError }: { products?: Product[]; loadError: string }) {
  const [ordered, setOrdered] = useState<Product[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  useEffect(() => { if (products) setOrdered(products); }, [products]);

  function move(id: string, targetId: string) {
    if (id === targetId) return;
    setOrdered((current) => {
      const from = current.findIndex((p) => p.id === id);
      const to = current.findIndex((p) => p.id === targetId);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      await api<ApiItem<Product[]>>("/admin/products/order", { method: "PATCH", body: { ids: ordered.map((p) => p.id) } });
      setStatus({ kind: "success", text: "Product order saved." });
    } catch (err) {
      setStatus({ kind: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  function onDrop(event: DragEvent<HTMLTableRowElement>, id: string) {
    event.preventDefault();
    if (dragId) move(dragId, id);
    setDragId(null);
  }

  return <section className="space-y-3">
    <p className="text-sm text-brand-brown">Drag products into the order customers should see. This order is used for the storefront’s recommended product list.</p>
    <Alert>{loadError}</Alert>
    {status && <Alert kind={status.kind}>{status.text}</Alert>}
    <AdminTable head={["Position", "Product", ""]} loading={!products} empty={!!products && products.length === 0}>
      {ordered.map((product, index) => <tr key={product.id} draggable onDragStart={() => setDragId(product.id)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, product.id)} className={`cursor-grab border-b border-brand-brown/10 hover:bg-brand-brown/5 ${dragId === product.id ? "opacity-40" : ""}`}>
        <td className="w-20 px-4 py-2 text-sm text-brand-brown">{index + 1}</td>
        <td className="px-4 py-2"><div className="flex items-center gap-3"><div className="w-10 overflow-hidden rounded"><ProductImage src={product.images[0]} alt="" sizes="40px" /></div><span className="font-semibold">{product.name}</span></div></td>
        <td className="px-4 py-2 whitespace-nowrap">
          <button className="px-2 py-1 text-brand-red disabled:opacity-30" disabled={index === 0} aria-label={`Move ${product.name} up`} onClick={() => move(product.id, ordered[index - 1].id)}>↑</button>
          <button className="px-2 py-1 text-brand-red disabled:opacity-30" disabled={index === ordered.length - 1} aria-label={`Move ${product.name} down`} onClick={() => move(product.id, ordered[index + 1].id)}>↓</button>
        </td>
      </tr>)}
    </AdminTable>
    <div className="flex justify-end"><button className={buttonClass("primary")} onClick={save} disabled={saving || !ordered.length}>{saving ? "Saving…" : "Save product order"}</button></div>
  </section>;
}
