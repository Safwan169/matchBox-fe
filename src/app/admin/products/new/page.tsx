"use client";

import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/ui";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="text-sm font-semibold text-brand-red hover:underline">← Products</Link>
      <PageTitle>New product</PageTitle>
      <ProductForm />
    </div>
  );
}
