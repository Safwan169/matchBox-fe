"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminTable, Pager, tableInput } from "@/components/admin/AdminTable";
import { useAdminApi } from "@/components/admin/AdminShell";
import { Stars } from "@/components/review/Stars";
import { Alert, PageTitle, errorMessage } from "@/components/ui";
import type { AdminReview } from "@/lib/admin-types";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { ApiList } from "@/lib/types";

export default function AdminReviewsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);
  const { data, error, loading, reload } = useAdminApi<ApiList<AdminReview>>(`/admin/reviews?${params}`);

  async function setReviewStatus(r: AdminReview, next: AdminReview["status"]) {
    setActionError("");
    try {
      await api(`/admin/reviews/${r.id}`, { method: "PATCH", body: { status: next } });
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  async function remove(r: AdminReview) {
    if (!confirm(`Delete this review by ${r.authorName}?`)) return;
    try {
      await api(`/admin/reviews/${r.id}`, { method: "DELETE" });
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  return (
    <div className="space-y-4">
      <PageTitle>Reviews</PageTitle>
      <p className="text-sm text-brand-brown">
        Reviews from verified buyers appear on the site straight away. Hide anything inappropriate. Hidden reviews don’t count towards the rating.
      </p>
      <select className={tableInput} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
        <option value="">All reviews</option>
        <option value="published">Published</option>
        <option value="hidden">Hidden</option>
      </select>
      <Alert>{error || actionError}</Alert>

      <AdminTable head={["Product", "Customer", "Rating", "Review", "Date", "Status", ""]} empty={!loading && data?.data.length === 0}>
        {data?.data.map((r) => (
          <tr key={r.id} className="align-top hover:bg-brand-brown/5">
            <td className="px-4 py-3">
              {r.product ? (
                <Link href={`/products/${r.product.slug}#reviews`} target="_blank" className="font-semibold hover:text-brand-red">{r.product.name}</Link>
              ) : (
                <span className="text-brand-brown">Deleted product</span>
              )}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">{r.authorName}</td>
            <td className="px-4 py-3"><Stars rating={r.rating} /></td>
            <td className="max-w-sm px-4 py-3"><p className="line-clamp-3">{r.comment}</p></td>
            <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.createdAt)}</td>
            <td className={`px-4 py-3 text-xs font-semibold capitalize ${r.status === "published" ? "text-green-800" : "text-brand-brown"}`}>{r.status}</td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <button onClick={() => setReviewStatus(r, r.status === "published" ? "hidden" : "published")} className="font-semibold text-brand-red hover:underline">
                {r.status === "published" ? "Hide" : "Publish"}
              </button>
              <button onClick={() => remove(r)} className="ml-3 text-brand-brown hover:text-red-700">Delete</button>
            </td>
          </tr>
        ))}
      </AdminTable>
      {data && <Pager page={data.meta.page} totalPages={data.meta.totalPages} onPage={setPage} />}
    </div>
  );
}
