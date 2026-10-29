import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryTiles } from "@/components/home/sections";
import { ListingHeader } from "@/components/product/ListingHeader";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse MatchBox by collection: cigarettes, lighters, accessories and more.",
};

export default function CategoriesPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8">
      <ListingHeader kicker="Explore" title="The Collections" />
      <Suspense fallback={<div className="aspect-[4/1] bg-lux-ink/5" />}>
        <CategoryTiles />
      </Suspense>
    </section>
  );
}
