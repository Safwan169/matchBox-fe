import { Pagination } from "@/components/Pagination";
import { apiGet } from "@/lib/api";
import type { ApiList, Product } from "@/lib/types";
import { InfiniteProductGrid } from "./InfiniteProductGrid";
import { SortSelect } from "./SortSelect";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

interface Props {
  searchParams: Promise<SearchParams>;
  basePath: string;
  category?: string; // category slug
}

const PAGE_SIZE = 12;

// Shared product list for /products and /categories/[slug]: the first page is rendered on
// the server; more pages load as the user scrolls. Page links remain for no-JS and crawlers.
export async function ProductListing({ searchParams, basePath, category }: Props) {
  const sp = await searchParams;
  const search = first(sp.search);
  const sort = first(sp.sort);
  const onSale = first(sp.onSale) === "true";
  const page = first(sp.page);

  const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (category) query.set("category", category);
  if (search) query.set("search", search);
  if (sort) query.set("sort", sort);
  if (onSale) query.set("onSale", "true");

  const { data: products, meta } = await apiGet<ApiList<Product>>(`/products?${query}${page ? `&page=${encodeURIComponent(page)}` : ""}`);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-brown">
          {search && <>Results for “<strong>{search}</strong>” · </>}
          {onSale && <>On sale · </>}
          {meta.total} {meta.total === 1 ? "product" : "products"}
        </p>
        <SortSelect />
      </div>

      {products.length > 0 ? (
        // key: start a fresh list when the search, sort or category changes
        <InfiniteProductGrid key={`${query}|${meta.page}`} initial={products} query={query.toString()} page={meta.page} totalPages={meta.totalPages} />
      ) : (
        <p className="rounded-lg border border-dashed border-brand-brown/30 py-16 text-center text-brand-brown">
          No products found.
        </p>
      )}

      <noscript>
        <Pagination page={meta.page} totalPages={meta.totalPages} basePath={basePath} params={{ search, sort, onSale: onSale ? "true" : undefined }} />
      </noscript>
    </>
  );
}
