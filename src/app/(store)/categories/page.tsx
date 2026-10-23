import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CategoryTiles } from "@/components/home/sections";
import { buttonClass } from "@/components/ui";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse MatchBox by category: cigarettes, lighters, accessories and more.",
};

export default function CategoriesPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand-red">Categories</h1>
        <Link href="/products" className={buttonClass("outline")}>
          All products
        </Link>
      </div>
      <div className="mt-6">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-brand-brown/10" />}>
          <CategoryTiles />
        </Suspense>
      </div>
    </section>
  );
}
