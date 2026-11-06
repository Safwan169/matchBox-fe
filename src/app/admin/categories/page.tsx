"use client";

import { useState, type FormEvent } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { Alert, Button, Card, Field, PageTitle, errorMessage } from "@/components/ui";
import type { AdminCategory } from "@/lib/admin-types";
import { api } from "@/lib/api";
import { notifyAdded } from "@/lib/alerts";
import type { ApiItem } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ProductImage } from "@/components/product/ProductImage";
import { ApiError } from "@/lib/api";
import { AdminDialog } from "@/components/admin/AdminDialog";

export default function AdminCategoriesPage() {
  const { data, error, loading, reload } = useAdminApi<ApiItem<AdminCategory[]>>("/admin/categories");
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [actionError, setActionError] = useState("");

  async function remove(c: AdminCategory) {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    setActionError("");
    try {
      await api(`/admin/categories/${c.id}`, { method: "DELETE" });
      if (editing?.id === c.id) setEditing(null);
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  return (
    <div className="space-y-4">
      <PageTitle>Categories</PageTitle>
      <Alert>{error || actionError}</Alert>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <AdminTable head={["Image", "Name", "Order", "Products", "Status", ""]} loading={loading} empty={!loading && data?.data.length === 0}>
          {data?.data.map((c) => (
            <tr key={c.id} className={editing?.id === c.id ? "bg-brand-flame-light/40" : "hover:bg-brand-brown/5"}>
              <td className="px-4 py-3"><ProductImage src={c.image ?? undefined} alt={c.name} className="w-12 rounded" /></td>
              <td className="px-4 py-3 font-semibold">{c.name}</td>
              <td className="px-4 py-3">{c.sortOrder}</td>
              <td className="px-4 py-3">{c.productCount}</td>
              <td className="px-4 py-3 text-xs font-semibold">
                {c.isActive ? <span className="text-green-800">Visible</span> : <span className="text-brand-brown">Hidden</span>}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button onClick={() => setEditing(c)} className="font-semibold text-brand-red hover:underline">Edit</button>
                <button onClick={() => remove(c)} className="ml-3 text-brand-brown hover:text-red-700 disabled:opacity-40" disabled={c.productCount > 0} title={c.productCount > 0 ? "Has products" : undefined}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>

        <CategoryForm
          key={editing?.id ?? "new"}
          category={editing}
          onEdit={setEditing}
          onDone={() => {
            setEditing(null);
            reload();
          }}
        />
      </div>
    </div>
  );
}

function CategoryForm({ category, onDone, onEdit }: { category: AdminCategory | null; onDone(): void; onEdit(category: AdminCategory): void }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<string[]>(category?.image ? [category.image] : []);
  const [existingCategory, setExistingCategory] = useState<AdminCategory | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    const body = {
      name: f.get("name"),
      description: f.get("description"),
      image: image[0] ?? null,
      sortOrder: Number(f.get("sortOrder") || 0),
      isActive: f.get("isActive") === "on",
    };
    setSaving(true);
    setError("");
    setExistingCategory(null);
    try {
      if (category) await api(`/admin/categories/${category.id}`, { method: "PATCH", body });
      else {
        await api("/admin/categories", { method: "POST", body });
        void notifyAdded("Category added");
      }
      formEl.reset();
      onDone();
    } catch (err) {
      if (err instanceof ApiError && err.details && typeof err.details === "object") {
        const details = err.details as { kind?: string; item?: AdminCategory };
        if (details.kind === "category" && details.item) {
          setExistingCategory(details.item);
          setError("");
        } else setError(errorMessage(err));
      } else {
        setError(errorMessage(err));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="h-fit">
      <h2 className="font-semibold">{category ? `Edit “${category.name}”` : "New category"}</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <Alert>{error}</Alert>
        {existingCategory && <AdminDialog title="Category already exists" onClose={() => setExistingCategory(null)}>
          <p className="text-sm text-brand-brown">There’s already a category with this name. Here are its details:</p>
          <div className="mt-4 flex items-center gap-4 rounded-md border border-brand-brown/15 bg-white p-3">
            <ProductImage src={existingCategory.image ?? undefined} alt={existingCategory.name} className="w-20 shrink-0 rounded" />
            <div><p className="text-lg font-semibold">{existingCategory.name}</p><p className="text-sm text-brand-brown">{existingCategory.productCount} products · {existingCategory.isActive ? "Visible in store" : "Hidden"}</p><p className="mt-1 text-sm">{existingCategory.description || "No description"}</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" onClick={() => onEdit(existingCategory)}>Open existing category</Button>
            <Button type="button" variant="outline" onClick={() => setExistingCategory(null)}>Keep editing</Button>
          </div>
        </AdminDialog>}
        <Field label="Name" name="name" defaultValue={category?.name} required minLength={2} maxLength={60} />
        <Field label="Description" name="description" defaultValue={category?.description} maxLength={500} />
        <ImageUploader images={image} onChange={setImage} max={1} label="Category image" help="Upload one JPEG, PNG, WebP or GIF image, up to 4 MB." />
        <Field label="Sort order" name="sortOrder" type="number" min="0" defaultValue={category?.sortOrder ?? 0} hint="Lower numbers appear first in the menu." />
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} className="h-4 w-4 accent-brand-red" />
          Visible in store
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : category ? "Save" : "Add category"}</Button>
          {category && (
            <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
          )}
        </div>
      </form>
    </Card>
  );
}
