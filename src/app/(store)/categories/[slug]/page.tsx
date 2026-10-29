import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingHeader } from "@/components/product/ListingHeader";
import { ProductGridSkeleton } from "@/components/product/ProductCard";
import { ProductListing } from "@/components/product/ProductListing";
import { ApiError, apiGet } from "@/lib/api";
import type { ApiItem, Category } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await apiGet<ApiItem<Category>>(`/categories/${encodeURIComponent(slug)}`);
    return { title: data.name, description: data.description || `Shop ${data.name} at MatchBox` };
  } catch {
    return { title: "Category not found" };
  }
}

export default function CategoryPage({ params, searchParams }: PageProps<"/categories/[slug]">) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8">
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
      <ListingHeader kicker="The collection" title={category.name}>
        {category.description && <p>{category.description}</p>}
      </ListingHeader>
      <div>
        <ProductListing searchParams={searchParams} basePath={`/categories/${category.slug}`} category={category.slug} />
      </div>
    </>
  );
}

function CategorySkeleton() {
  return (
    <>
      <div className="mx-auto mt-14 mb-20 h-14 w-64 animate-pulse bg-lux-ink/5" />
      <div>
        <ProductGridSkeleton />
      </div>
    </>
  );
}
