import { Pagination } from "@/components/Pagination";
import { apiGet } from "@/lib/api";
import type { ApiList, Product } from "@/lib/types";
import { InfiniteProductGrid } from "./InfiniteProductGrid";
import { ProductGrid } from "./ProductCard";
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
      <div className="mb-12 flex flex-wrap items-center justify-between gap-3 border-y border-lux-ink/10 py-4">
        <p className="text-[11px] tracking-[0.2em] text-lux-stone uppercase">
          {search && <>Results for “<span className="text-lux-ink">{search}</span>” · </>}
          {onSale && <>Offers · </>}
          {meta.total} {meta.total === 1 ? "piece" : "pieces"}
        </p>
        <SortSelect />
      </div>

      <h2 className="sr-only">Products</h2>
      {products.length > 0 ? (
        // key: start a fresh list when the search, sort or category changes
        <InfiniteProductGrid key={`${query}|${meta.page}`} initialIds={products.map((p) => p.id)} query={query.toString()} page={meta.page} totalPages={meta.totalPages}>
          <ProductGrid products={products} />
        </InfiniteProductGrid>
      ) : (
        <p className="py-20 text-center font-serif text-2xl font-light text-lux-stone">
          Nothing here yet — try another search or collection.
        </p>
      )}

      <noscript>
        <Pagination page={meta.page} totalPages={meta.totalPages} basePath={basePath} params={{ search, sort, onSale: onSale ? "true" : undefined }} />
      </noscript>
    </>
  );
}
