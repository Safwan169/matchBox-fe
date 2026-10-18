import { Pagination } from "@/components/Pagination";
import { apiGet } from "@/lib/api";
import type { ApiList, Product } from "@/lib/types";
import { ProductGrid } from "./ProductCard";
import { SortSelect } from "./SortSelect";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

interface Props {
  searchParams: Promise<SearchParams>;
  basePath: string;
  category?: string; // category slug
}

// Shared product grid + sort + pagination for /products and /categories/[slug].
export async function ProductListing({ searchParams, basePath, category }: Props) {
  const sp = await searchParams;
  const search = first(sp.search);
  const sort = first(sp.sort);
  const page = first(sp.page);

  const query = new URLSearchParams({ limit: "12" });
  if (category) query.set("category", category);
  if (search) query.set("search", search);
  if (sort) query.set("sort", sort);
  if (page) query.set("page", page);

  const { data: products, meta } = await apiGet<ApiList<Product>>(`/products?${query}`);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-brown">
          {search && <>Results for “<strong>{search}</strong>” · </>}
          {meta.total} {meta.total === 1 ? "product" : "products"}
        </p>
        <SortSelect />
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-lg border border-dashed border-brand-brown/30 py-16 text-center text-brand-brown">
          No products found.
        </p>
      )}

      <Pagination page={meta.page} totalPages={meta.totalPages} basePath={basePath} params={{ search, sort }} />
    </>
  );
}
