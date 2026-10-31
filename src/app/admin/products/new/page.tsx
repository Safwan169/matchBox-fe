"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/ui";

export default function NewProductPage() {
  // With cacheComponents, a visited route stays mounted but hidden (React Activity), so the
  // form would keep the last product's inputs. Effects clean up when the page is hidden, so
  // bumping the key there gives a blank form on the next visit.
  const [formKey, setFormKey] = useState(0);
  useEffect(() => () => setFormKey((k) => k + 1), []);

  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="text-sm font-semibold text-brand-red hover:underline">← Products</Link>
      <PageTitle>New product</PageTitle>
      <ProductForm key={formKey} />
    </div>
  );
}
