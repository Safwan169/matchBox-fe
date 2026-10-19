"use client";

import { useState, type FormEvent } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { Alert, Button, Card, Field, PageTitle, errorMessage } from "@/components/ui";
import type { AdminCategory } from "@/lib/admin-types";
import { api } from "@/lib/api";
import type { ApiItem } from "@/lib/types";
import { useAdminApi } from "@/components/admin/AdminShell";

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
        <AdminTable head={["Name", "Slug", "Order", "Products", "Status", ""]} empty={!loading && data?.data.length === 0}>
          {data?.data.map((c) => (
            <tr key={c.id} className={editing?.id === c.id ? "bg-brand-flame-light/40" : "hover:bg-brand-brown/5"}>
              <td className="px-4 py-3 font-semibold">{c.name}</td>
              <td className="px-4 py-3 font-mono text-xs">{c.slug}</td>
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
          onDone={() => {
            setEditing(null);
            reload();
          }}
        />
      </div>
    </div>
  );
}

function CategoryForm({ category, onDone }: { category: AdminCategory | null; onDone(): void }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    const slug = String(f.get("slug") ?? "").trim();
    const body = {
      name: f.get("name"),
      ...(slug ? { slug } : {}),
      description: f.get("description"),
      sortOrder: Number(f.get("sortOrder") || 0),
      isActive: f.get("isActive") === "on",
    };
    setSaving(true);
    setError("");
    try {
      if (category) await api(`/admin/categories/${category.id}`, { method: "PATCH", body });
      else await api("/admin/categories", { method: "POST", body });
      formEl.reset();
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="h-fit">
      <h2 className="font-semibold">{category ? `Edit “${category.name}”` : "New category"}</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <Alert>{error}</Alert>
        <Field label="Name" name="name" defaultValue={category?.name} required minLength={2} maxLength={60} />
        <Field label="URL slug" name="slug" defaultValue={category?.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" hint="Leave empty to generate from the name." />
        <Field label="Description" name="description" defaultValue={category?.description} maxLength={500} />
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
