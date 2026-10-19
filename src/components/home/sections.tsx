import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import { assetUrl, isUpload } from "@/lib/assets";
import { getCategories, getProductList, getPromotions } from "@/lib/store-data";
import type { HomeSection } from "@/lib/types";
import { HeroCarousel } from "./HeroCarousel";

function SectionShell({ title, action, children, className = "pt-12" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-end justify-between gap-4">
          {title && <h2 className="font-display text-2xl text-brand-red">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const viewAll = (href: string) => (
  <Link href={href} className="shrink-0 text-sm font-semibold hover:text-brand-red">
    View all →
  </Link>
);

/** Renders one admin-configured section. Data-loading parts stream in their own Suspense. */
export function HomeSectionView({ section }: { section: HomeSection }) {
  const { type, title, config } = section;
  const limit = config.limit ?? 8;

  switch (type) {
    case "hero":
      return (
        <section className="mx-auto w-full max-w-6xl px-4 pt-6">
          <Suspense fallback={<DefaultHero />}>
            <Hero />
          </Suspense>
        </section>
      );
    case "categories":
      return (
        <SectionShell title={title}>
          <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-brand-brown/10" />}>
            <CategoryTiles />
          </Suspense>
        </SectionShell>
      );
    case "featured_products":
      return <ProductsSection title={title} query={`featured=true&limit=${limit}`} href="/products" count={limit} />;
    case "new_arrivals":
      return <ProductsSection title={title} query={`sort=newest&limit=${limit}`} href="/products?sort=newest" count={limit} />;
    case "on_sale":
      return <ProductsSection title={title} query={`onSale=true&limit=${limit}`} href="/products?onSale=true" count={limit} />;
    case "category_products":
      return config.categorySlug ? (
        <ProductsSection
          title={title}
          query={`category=${encodeURIComponent(config.categorySlug)}&limit=${limit}`}
          href={`/categories/${config.categorySlug}`}
          count={limit}
        />
      ) : null;
    case "banner":
      return config.image ? (
        <SectionShell title={title}>
          <BannerImage image={config.image} link={config.link ?? ""} alt={title || "Promotion"} />
        </SectionShell>
      ) : null;
    case "text":
      return (
        <SectionShell title="">
          <div className="rounded-xl border-2 border-brand-charcoal bg-brand-cream p-6 text-center shadow-[4px_4px_0_var(--brand-charcoal)] sm:p-10">
            {title && <h2 className="font-display text-2xl text-brand-red">{title}</h2>}
            <p className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-brand-charcoal/85">{config.body}</p>
          </div>
        </SectionShell>
      );
    default:
      return null;
  }
}

function ProductsSection({ title, query, href, count }: { title: string; query: string; href: string; count: number }) {
  return (
    <SectionShell title={title} action={viewAll(href)}>
      <Suspense fallback={<ProductGridSkeleton count={Math.min(count, 4)} />}>
        <ProductsFor query={query} />
      </Suspense>
    </SectionShell>
  );
}

async function ProductsFor({ query }: { query: string }) {
  const products = await getProductList(query);
  if (products.length === 0) return <p className="text-brand-brown">No products here yet.</p>;
  return <ProductGrid products={products} />;
}

function BannerImage({ image, link, alt }: { image: string; link: string; alt: string }) {
  const img = (
    <Image src={assetUrl(image)} alt={alt} width={1640} height={500} sizes="(min-width: 1152px) 1152px, 100vw" unoptimized={!isUpload(image)} className="h-auto w-full rounded-xl" />
  );
  if (!link) return img;
  return link.startsWith("/") ? (
    <Link href={link} className="block transition hover:opacity-95">{img}</Link>
  ) : (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block transition hover:opacity-95">{img}</a>
  );
}

async function Hero() {
  const promotions = await getPromotions();
  return promotions.length > 0 ? <HeroCarousel promotions={promotions} /> : <DefaultHero />;
}

export function DefaultHero() {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <Image
        src="/brand/cover.png"
        alt="MatchBox — a row of matches with one lit"
        width={3280}
        height={1248}
        sizes="(min-width: 1152px) 1120px, 100vw"
        className="h-auto w-full"
        preload
      />
      <Link
        href="/products"
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-md bg-brand-flame px-5 py-2 text-sm font-bold text-brand-charcoal shadow hover:bg-brand-flame-light sm:px-8 sm:py-3 sm:text-base"
      >
        Shop now
      </Link>
    </div>
  );
}

async function CategoryTiles() {
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
