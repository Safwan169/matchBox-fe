"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Field, Select, TextArea, errorMessage } from "@/components/ui";
import type { AdminCategory } from "@/lib/admin-types";
import { api } from "@/lib/api";
import type { ApiItem, Product } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";
import { ImageUploader } from "./ImageUploader";

// Prices are entered in taka and stored in poisha.
const toTaka = (poisha: number | null | undefined) => (poisha == null ? "" : String(poisha / 100));
const toPoisha = (taka: string) => Math.round(parseFloat(taka) * 100);

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { data: cats } = useAdminApi<ApiItem<AdminCategory[]>>("/admin/categories");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const compareAt = String(f.get("compareAtPrice") ?? "").trim();
    const price = String(f.get("price") ?? "").trim();
    const maxPerOrder = String(f.get("maxPerOrder") ?? "").trim();
    const slug = String(f.get("slug") ?? "").trim();

    const body = {
      name: f.get("name"),
      ...(slug ? { slug } : {}),
      categoryId: f.get("categoryId"),
      brand: f.get("brand"),
      description: f.get("description"),
      price: price ? toPoisha(price) : null,
      compareAtPrice: compareAt ? toPoisha(compareAt) : null,
      stock: Number(f.get("stock")),
      maxPerOrder: maxPerOrder ? Number(maxPerOrder) : null,
      images,
      isActive: f.get("isActive") === "on",
      isFeatured: f.get("isFeatured") === "on",
      ageRestricted: f.get("ageRestricted") === "on",
    };

    setSaving(true);
    setError("");
    setSaved(false);
    try {
      if (product) {
        await api(`/admin/products/${product.id}`, { method: "PATCH", body });
        setSaved(true);
      } else {
        const { data } = await api<ApiItem<Product>>("/admin/products", { method: "POST", body });
        router.replace(`/admin/products/${data.id}?created=1`);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!product || !confirm(`Delete "${product.name}"? This cannot be undone. Past orders are not affected.`)) return;
    try {
      await api(`/admin/products/${product.id}`, { method: "DELETE" });
      router.replace("/admin/products");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Name" name="name" defaultValue={product?.name} required minLength={2} maxLength={120} />
          <Field label="URL slug" name="slug" defaultValue={product?.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" hint="Leave empty to generate from the name. Lowercase letters, numbers and dashes." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Category" name="categoryId" defaultValue={product?.categoryId} required key={cats ? "loaded" : "loading"}>
              <option value="">Choose…</option>
              {cats?.data.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {!c.isActive ? " (hidden)" : ""}
                </option>
              ))}
            </Select>
            <Field label="Brand" name="brand" defaultValue={product?.brand} maxLength={80} />
          </div>
          <TextArea label="Description" name="description" rows={5} maxLength={5000} defaultValue={product?.description} />
        </Card>
        <Card>
          <ImageUploader images={images} onChange={setImages} />
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Price (৳)" name="price" type="number" step="0.01" min="0" defaultValue={toTaka(product?.price)} hint={`Leave empty to show "Price on request". The product can't be ordered until it has a price.`} />
          <Field label="Compare-at price (৳)" name="compareAtPrice" type="number" step="0.01" min="0" defaultValue={toTaka(product?.compareAtPrice)} hint="Original price, shown crossed out when higher." />
          <Field label="Stock" name="stock" type="number" step="1" min="0" required defaultValue={product?.stock ?? 0} />
          <Field label="Max per order" name="maxPerOrder" type="number" step="1" min="1" max="50" defaultValue={product?.maxPerOrder ?? ""} hint="Most one customer can buy in a single order. Leave empty to use the store limit (50)." />
        </Card>
        <Card className="space-y-3 text-sm">
          <Toggle name="isActive" label="Visible in store" defaultChecked={product?.isActive ?? true} />
          <Toggle name="isFeatured" label="Featured on home page" defaultChecked={product?.isFeatured ?? false} />
          <Toggle name="ageRestricted" label="Age-restricted (18+)" defaultChecked={product?.ageRestricted ?? true} />
        </Card>
        <div className="space-y-3">
          <Alert>{error}</Alert>
          {saved && <Alert kind="success">Saved.</Alert>}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </Button>
          {product && (
            <>
              {product.isActive && (
                <Link href={`/products/${product.slug}`} target="_blank" className="block text-center text-sm text-brand-red hover:underline">
                  View in store ↗
                </Link>
              )}
              <Button type="button" variant="ghost" className="w-full" onClick={onDelete}>
                Delete product
              </Button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-brand-red" />
      {label}
    </label>
  );
}
