"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { apiGet } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Review, ReviewList } from "@/lib/types";
import { Stars } from "./Stars";

export function ReviewFeed({ slug, initial, totalPages, pageSize }: { slug: string; initial: Review[]; totalPages: number; pageSize: number }) {
  const [reviews, setReviews] = useState(initial);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const next = await apiGet<ReviewList>(`/products/${encodeURIComponent(slug)}/reviews?limit=${pageSize}&page=${page + 1}`);
      setReviews((prev) => [...prev, ...next.data.filter((r) => !prev.some((p) => p.id === r.id))]);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }

  if (reviews.length === 0) {
    return <p className="text-brand-brown">Be the first to share your thoughts after your order arrives.</p>;
  }

  return (
    <div>
      <ul className="divide-y divide-brand-brown/15">
        {reviews.map((r) => (
          <li key={r.id} className="py-4 first:pt-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Stars rating={r.rating} />
              <span className="font-semibold">{r.authorName}</span>
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-800">Verified buyer</span>
              <span className="text-sm text-brand-brown">{formatDate(r.createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-brand-charcoal/90">{r.comment}</p>
          </li>
        ))}
      </ul>
      {page < totalPages && (
        <Button variant="outline" className="mt-4" disabled={loading} onClick={loadMore}>
          {loading ? "Loading…" : "Show more reviews"}
        </Button>
      )}
    </div>
  );
}
