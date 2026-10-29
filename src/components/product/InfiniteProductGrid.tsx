"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/luxury/Reveal";
import { Button } from "@/components/ui";
import { apiGet } from "@/lib/api";
import type { ApiList, Product } from "@/lib/types";
import { PRODUCT_GRID_CLASS, ProductCard } from "./ProductCard";

interface Props {
  /** The first page, rendered on the server (a <ProductGrid>). */
  children: ReactNode;
  /** Ids already shown, to skip duplicates if products shift between pages. */
  initialIds: string[];
  /** Query string for /products without `page`, e.g. "limit=12&category=lighters". */
  query: string;
  page: number;
  totalPages: number;
}

/** Shows the server-rendered first page, then loads the next pages as the user scrolls. */
export function InfiniteProductGrid({ children, initialIds, query, page: startPage, totalPages }: Props) {
  const [more, setMore] = useState<Product[]>([]);
  const [page, setPage] = useState(startPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = page < totalPages;
  const shown = initialIds.length + more.length;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(false);
    try {
      const next = await apiGet<ApiList<Product>>(`/products?${query}&page=${page + 1}`);
      setMore((prev) => [...prev, ...next.data.filter((p) => !initialIds.includes(p.id) && !prev.some((q) => q.id === p.id))]);
      setPage((p) => p + 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, query, page, initialIds]);

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
      {children}
      {more.length > 0 && (
        <div className={`mt-12 lg:mt-16 ${PRODUCT_GRID_CLASS}`}>
          {more.map((p, i) => (
            <Reveal key={p.id} variant="card" delay={(i % 4) * 120}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}

      <div ref={sentinel} className="mt-16 flex flex-col items-center gap-2" aria-live="polite">
        {hasMore ? (
          <>
            {error && <p className="text-sm text-red-700">Couldn’t load more products.</p>}
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? "Loading…" : error ? "Try again" : "Load more"}
            </Button>
          </>
        ) : (
          shown > 12 && <p className="text-sm text-brand-brown">You’ve seen all {shown} pieces.</p>
        )}
      </div>
    </>
  );
}
