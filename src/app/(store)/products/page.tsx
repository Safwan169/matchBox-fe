import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingHeader } from "@/components/product/ListingHeader";
import { ProductGridSkeleton } from "@/components/product/ProductCard";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "All products" };

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8">
      <ListingHeader kicker="The collection" title="All pieces">
        <p>Lighters, tobacco and accessories, each chosen for its craft.</p>
      </ListingHeader>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductListing searchParams={searchParams} basePath="/products" />
      </Suspense>
    </section>
  );
}
