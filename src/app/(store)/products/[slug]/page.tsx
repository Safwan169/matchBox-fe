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
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
      <Suspense fallback={null}>
        <Reviews params={params} />
      </Suspense>
      <Suspense fallback={<div className="mt-16"><ProductGridSkeleton count={4} /></div>}>
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
    <section aria-labelledby="related-heading" className="mt-16 border-t border-brand-brown/15 pt-10">
      <h2 id="related-heading" className="font-display text-2xl text-brand-red">You may also like</h2>
      <div className="mt-6">
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
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-brown">
        <Link href="/products" className="hover:text-brand-red">Products</Link>
        {category && (
          <>
            {" / "}
            <Link href={`/categories/${category.slug}`} className="hover:text-brand-red">{category.name}</Link>
          </>
        )}
        {" / "}
        <span className="text-brand-charcoal">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.brand && <p className="text-sm tracking-wide text-brand-brown uppercase">{product.brand}</p>}
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          {product.ratingCount > 0 && (
            <a href="#reviews" className="mt-2 inline-block hover:underline">
              <RatingBadge average={product.ratingAverage} count={product.ratingCount} />
            </a>
          )}
          <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-4 text-2xl" />

          <p className={`mt-3 text-sm font-semibold ${inStock ? "text-green-800" : "text-brand-red"}`}>
            {inStock ? (product.stock < 10 ? `Only ${product.stock} left` : "In stock") : "Out of stock"}
          </p>

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          {settings.whatsapp && (
            <a
              href={whatsappHref(settings.whatsapp, `Hi MatchBox! I'm interested in "${product.name}" (${product.slug}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#128C7E] hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" /> Ask about this product on WhatsApp
            </a>
          )}

          {product.description && (
            <div className="mt-8 border-t border-brand-brown/15 pt-6">
              <h2 className="font-semibold">Description</h2>
              <p className="mt-2 whitespace-pre-line text-brand-charcoal/85">{product.description}</p>
            </div>
          )}

          {product.ageRestricted && (
            <p className="mt-6 rounded-md bg-brand-charcoal/5 p-3 text-xs text-brand-brown">
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
    <div className="grid animate-pulse gap-8 md:grid-cols-2" aria-busy="true">
      <div className="aspect-square rounded-lg bg-brand-brown/10" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-brand-brown/10" />
        <div className="h-8 w-3/4 rounded bg-brand-brown/10" />
        <div className="h-7 w-32 rounded bg-brand-brown/10" />
      </div>
    </div>
  );
}
