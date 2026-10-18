import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product/ProductCard";
import { ProductListing } from "@/components/product/ProductListing";
import { ApiError, apiGet } from "@/lib/api";
import type { ApiItem, Category } from "@/lib/types";

export default function CategoryPage({ params, searchParams }: PageProps<"/categories/[slug]">) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryContent params={params} searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function CategoryContent({
  params,
  searchParams,
}: Pick<PageProps<"/categories/[slug]">, "params" | "searchParams">) {
  const { slug } = await params;

  let category: Category;
  try {
    category = (await apiGet<ApiItem<Category>>(`/categories/${encodeURIComponent(slug)}`)).data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <h1 className="font-display text-3xl text-brand-red">{category.name}</h1>
      {category.description && <p className="mt-2 text-brand-brown">{category.description}</p>}
      <div className="mt-6">
        <ProductListing searchParams={searchParams} basePath={`/categories/${category.slug}`} category={category.slug} />
      </div>
    </>
  );
}

function CategorySkeleton() {
  return (
    <>
      <div className="h-9 w-48 animate-pulse rounded bg-brand-brown/10" />
      <div className="mt-6">
        <ProductGridSkeleton />
      </div>
    </>
  );
}
