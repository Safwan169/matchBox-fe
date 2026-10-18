"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { Alert, PageTitle } from "@/components/ui";
import type { ApiItem, Product } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";

export default function EditProductPage() {
  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="text-sm font-semibold text-brand-red hover:underline">← Products</Link>
      <Suspense>
        <EditProduct />
      </Suspense>
    </div>
  );
}

function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const created = useSearchParams().get("created") === "1";
  const { data, error } = useAdminApi<ApiItem<Product>>(`/admin/products/${encodeURIComponent(id)}`);

  if (error) return <Alert>{error}</Alert>;
  if (!data) return <p className="text-brand-brown">Loading…</p>;

  return (
    <>
      <PageTitle>Edit product</PageTitle>
      {created && <Alert kind="success">Product created.</Alert>}
      {/* key: remount the form with fresh defaults if another product is opened */}
      <ProductForm key={data.data.id} product={data.data} />
    </>
  );
}
