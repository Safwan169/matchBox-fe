import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/product/AddToCart";
import { Price } from "@/components/product/Price";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ApiError, apiGet } from "@/lib/api";
import type { ApiItem, Category, Product } from "@/lib/types";

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
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

  const categories = await apiGet<ApiItem<Category[]>>("/categories")
    .then((r) => r.data)
    .catch(() => [] as Category[]);
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
          {product.brand && <p className="text-sm tracking-wide text-brand-brown/70 uppercase">{product.brand}</p>}
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-4 text-2xl" />

          <p className={`mt-3 text-sm font-semibold ${inStock ? "text-green-700" : "text-brand-red"}`}>
            {inStock ? (product.stock < 10 ? `Only ${product.stock} left` : "In stock") : "Out of stock"}
          </p>

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

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
