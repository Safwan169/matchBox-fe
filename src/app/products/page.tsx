import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product/ProductCard";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "All products" };

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl text-brand-red">All products</h1>
      <div className="mt-6">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductListing searchParams={searchParams} basePath="/products" />
        </Suspense>
      </div>
    </section>
  );
}
