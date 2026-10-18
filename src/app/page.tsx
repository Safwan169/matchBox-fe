import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import { apiGet } from "@/lib/api";
import type { ApiItem, ApiList, Category, Product } from "@/lib/types";

export default function Home() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src="/brand/cover.png"
            alt="MatchBox — a row of matches with one lit"
            width={3280}
            height={1248}
            className="h-auto w-full"
            priority
          />
          <Link
            href="/products"
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-md bg-brand-flame px-5 py-2 text-sm font-bold text-brand-charcoal shadow hover:bg-brand-flame-light sm:px-8 sm:py-3 sm:text-base"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-12">
        <h2 className="font-display text-2xl text-brand-red">Shop by category</h2>
        <Suspense fallback={<div className="mt-4 h-24 animate-pulse rounded-lg bg-brand-brown/10" />}>
          <CategoryTiles />
        </Suspense>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl text-brand-red">Featured</h2>
          <Link href="/products" className="text-sm font-semibold hover:text-brand-red">View all →</Link>
        </div>
        <div className="mt-4">
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function CategoryTiles() {
  const categories = await apiGet<ApiItem<Category[]>>("/categories")
    .then((r) => r.data)
    .catch(() => [] as Category[]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/categories/${c.slug}`}
          className="rounded-lg border-2 border-brand-charcoal bg-brand-cream p-5 shadow-[4px_4px_0_var(--brand-charcoal)] transition hover:-translate-y-0.5 hover:bg-brand-flame-light"
        >
          <p className="font-display text-lg text-brand-red">{c.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-brand-brown">{c.description}</p>
        </Link>
      ))}
    </div>
  );
}

async function FeaturedProducts() {
  const products = await apiGet<ApiList<Product>>("/products?featured=true&limit=8")
    .then((r) => r.data)
    .catch(() => [] as Product[]);

  if (products.length === 0) return <p className="text-brand-brown">No featured products yet.</p>;
  return <ProductGrid products={products} />;
}
