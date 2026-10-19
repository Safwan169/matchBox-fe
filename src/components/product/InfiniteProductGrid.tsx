"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { apiGet } from "@/lib/api";
import type { ApiList, Product } from "@/lib/types";
import { EAGER_COUNT, ProductCard } from "./ProductCard";

interface Props {
  initial: Product[];
  /** Query string for /products without `page`, e.g. "limit=12&category=lighters". */
  query: string;
  page: number;
  totalPages: number;
}

/** Product grid that loads the next page when the user scrolls near the end. */
export function InfiniteProductGrid({ initial, query, page: startPage, totalPages }: Props) {
  const [products, setProducts] = useState(initial);
  const [page, setPage] = useState(startPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(false);
    try {
      const next = await apiGet<ApiList<Product>>(`/products?${query}&page=${page + 1}`);
      // Skip duplicates in case products shifted between pages while browsing.
      setProducts((prev) => [...prev, ...next.data.filter((p) => !prev.some((q) => q.id === p.id))]);
      setPage((p) => p + 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, query, page]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || error) return;
    // Start loading a little before the user reaches the end.
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: "600px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, error, loadMore]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} eager={i < EAGER_COUNT} />
        ))}
      </div>

      <div ref={sentinel} className="mt-8 flex flex-col items-center gap-2" aria-live="polite">
        {hasMore ? (
          <>
            {error && <p className="text-sm text-red-700">Couldn’t load more products.</p>}
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? "Loading…" : error ? "Try again" : "Load more"}
            </Button>
          </>
        ) : (
          products.length > 12 && <p className="text-sm text-brand-brown">You’ve seen all {products.length} products.</p>
        )}
      </div>
    </>
  );
}
