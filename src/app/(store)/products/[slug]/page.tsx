import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/product/AddToCart";
import { Price } from "@/components/product/Price";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import { ReviewsSection } from "@/components/review/ReviewsSection";
import { RatingBadge } from "@/components/review/Stars";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ApiError, apiGet } from "@/lib/api";
import { WhatsAppIcon } from "@/components/icons";
import { assetUrl } from "@/lib/assets";
import { getStoreSettings, whatsappHref } from "@/lib/contact";
import { getCategories } from "@/lib/store-data";
import type { ApiItem, Product } from "@/lib/types";

// Identical fetches in one request are de-duplicated, so this shares the page's request.
export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await apiGet<ApiItem<Product>>(`/products/${encodeURIComponent(slug)}`);
    return {
      title: data.name,
      description: data.description.slice(0, 160) || `${data.name} at MatchBox`,
      openGraph: data.images[0] ? { images: [assetUrl(data.images[0])] } : undefined,
    };
  } catch {
    return { title: "Product not found" };
  }
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-8 pb-24 sm:px-8 sm:pt-12">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
      <Suspense fallback={null}>
        <Reviews params={params} />
      </Suspense>
      <Suspense fallback={<div className="mt-24"><ProductGridSkeleton count={4} /></div>}>
        <RelatedProducts params={params} />
      </Suspense>
    </section>
  );
}

async function Reviews({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  return <ReviewsSection slug={slug} />;
}

async function RelatedProducts({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const related = await apiGet<ApiItem<Product[]>>(`/products/${encodeURIComponent(slug)}/related?limit=4`)
    .then((r) => r.data)
    .catch(() => [] as Product[]);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-24 border-t border-lux-ink/10 pt-20">
      <p className="text-center text-[10px] tracking-[0.35em] text-lux-stone uppercase">Complete the ritual</p>
      <h2 id="related-heading" className="mt-3 text-center font-serif text-4xl font-light sm:text-5xl">
        You may also like
      </h2>
      <div className="mt-14">
        <ProductGrid products={related} />
      </div>
    </section>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;

  let product: Product;
  try {
    product = (await apiGet<ApiItem<Product>>(`/products/${encodeURIComponent(slug)}`)).data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const [categories, settings] = await Promise.all([
    getCategories(),
    getStoreSettings(),
  ]);
  const category = categories.find((c) => c.id === product.categoryId);
  const inStock = product.stock > 0;

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8 text-[10px] tracking-[0.25em] text-lux-stone uppercase">
        <Link href="/products" className="hover:text-lux-ink">Shop</Link>
        {category && (
          <>
            <span className="mx-3 text-lux-brass">/</span>
            <Link href={`/categories/${category.slug}`} className="hover:text-lux-ink">{category.name}</Link>
          </>
        )}
        <span className="mx-3 text-lux-brass">/</span>
        <span className="text-lux-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-20">
        <ProductGallery images={product.images} name={product.name} />

        <div className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
          {(product.brand || category) && (
            <p className="text-[10px] tracking-[0.35em] text-lux-stone uppercase">{product.brand || category?.name}</p>
          )}
          <h1 className="mt-4 font-serif text-4xl leading-tight font-light sm:text-5xl">{product.name}</h1>
          {product.ratingCount > 0 && (
            <a href="#reviews" className="mt-4 inline-block text-sm hover:underline">
              <RatingBadge average={product.ratingAverage} count={product.ratingCount} />
            </a>
          )}
          <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-6 text-2xl font-light tracking-wide" />

          <p className={`mt-4 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase ${inStock ? "text-lux-stone" : "text-lux-oxblood"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-lux-brass" : "bg-lux-oxblood"}`} />
            {inStock ? (product.stock < 10 ? `Only ${product.stock} left` : "In stock") : "Sold out"}
          </p>

          <div className="mt-10">
            <AddToCart product={product} />
          </div>

          {settings.whatsapp && (
            <a
              href={whatsappHref(settings.whatsapp, `Hi MatchBox! I'm interested in "${product.name}" (${product.slug}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-lux-ink uppercase underline decoration-lux-brass underline-offset-4 hover:text-lux-brass"
            >
              <WhatsAppIcon className="h-4 w-4" /> Ask about this product on WhatsApp
            </a>
          )}

          {product.description && (
            <div className="mt-12 border-t border-lux-ink/10 pt-8">
              <h2 className="text-[10px] tracking-[0.35em] text-lux-stone uppercase">The details</h2>
              <p className="mt-4 leading-relaxed font-light whitespace-pre-line text-lux-ink/85">{product.description}</p>
            </div>
          )}

          {product.ageRestricted && (
            <p className="mt-8 border-l border-lux-brass pl-4 text-xs leading-relaxed text-lux-stone">
              Age-restricted product. Sold only to customers aged 18 or over. ID may be checked on delivery.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 md:grid-cols-2 lg:gap-20" aria-busy="true">
      <div className="aspect-[4/5] bg-lux-ink/5" />
      <div className="space-y-5 pt-12">
        <div className="h-3 w-24 bg-lux-ink/5" />
        <div className="h-12 w-3/4 bg-lux-ink/5" />
        <div className="h-7 w-32 bg-lux-ink/5" />
      </div>
    </div>
  );
}
