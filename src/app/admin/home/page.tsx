"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAdminApi } from "@/components/admin/AdminShell";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Alert, Button, Card, Field, PageTitle, Select, TextArea, buttonClass, errorMessage } from "@/components/ui";
import type { AdminCategory, AdminHomeSection } from "@/lib/admin-types";
import { api } from "@/lib/api";
import type { ApiItem, HomeSectionType } from "@/lib/types";

const TYPES: { type: HomeSectionType; label: string; help: string }[] = [
  { type: "hero", label: "Hero / promotions", help: "Rotating banners from Admin → Promotions (or the MatchBox cover)." },
  { type: "categories", label: "Categories", help: "Tiles linking to every visible category." },
  { type: "featured_products", label: "Featured products", help: "Products marked “Featured”." },
  { type: "new_arrivals", label: "New arrivals", help: "The newest products." },
  { type: "on_sale", label: "On sale", help: "Products with a compare-at price above the price." },
  { type: "category_products", label: "Products from a category", help: "Products from one category you choose." },
  { type: "banner", label: "Image banner", help: "A single wide image, optionally linked." },
  { type: "text", label: "Text block", help: "A heading and a short paragraph." },
];
const typeInfo = (t: HomeSectionType) => TYPES.find((x) => x.type === t)!;
const hasLimit = (t: HomeSectionType) => ["featured_products", "new_arrivals", "on_sale", "category_products"].includes(t);

export default function AdminHomePage() {
  const { data, error, reload, setData } = useAdminApi<ApiItem<AdminHomeSection[]>>("/admin/home-sections");
  const { data: cats } = useAdminApi<ApiItem<AdminCategory[]>>("/admin/categories");
  const [editing, setEditing] = useState<AdminHomeSection | null>(null);
  const [adding, setAdding] = useState<HomeSectionType | "">("");
  const [actionError, setActionError] = useState("");
  const sections = data?.data ?? [];
  const categoryName = new Map(cats?.data.map((c) => [c.id, c.name]));

  async function move(index: number, delta: number) {
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    setData({ data: next }); // optimistic
    setActionError("");
    try {
      const res = await api<ApiItem<AdminHomeSection[]>>("/admin/home-sections/order", { method: "PUT", body: { ids: next.map((s) => s.id) } });
      setData(res);
    } catch (err) {
      setActionError(errorMessage(err));
      reload();
    }
  }

  async function toggle(s: AdminHomeSection) {
    try {
      await api(`/admin/home-sections/${s.id}`, { method: "PATCH", body: { isActive: !s.isActive } });
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  async function remove(s: AdminHomeSection) {
    if (!confirm(`Remove the “${s.title || typeInfo(s.type).label}” section from the home page?`)) return;
    try {
      await api(`/admin/home-sections/${s.id}`, { method: "DELETE" });
      if (editing?.id === s.id) setEditing(null);
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  function summary(s: AdminHomeSection) {
    const parts: string[] = [];
    if (s.type === "category_products") parts.push(categoryName.get(s.config.categoryId ?? "") ?? "Missing category");
    if (hasLimit(s.type)) parts.push(`${s.config.limit ?? 8} products`);
    if (s.type === "banner" && s.config.link) parts.push(`→ ${s.config.link}`);
    if (s.type === "text") parts.push((s.config.body ?? "").slice(0, 60));
    return parts.join(" · ");
  }

  const closeForm = (saved: boolean) => () => {
    setEditing(null);
    setAdding("");
    if (saved) reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>Home page</PageTitle>
        <Link href="/" target="_blank" className={buttonClass("outline")}>View home page ↗</Link>
      </div>
      <p className="text-sm text-brand-brown">Add, reorder, hide or remove the sections shown on the home page. Changes are live immediately.</p>
      <Alert>{error || actionError}</Alert>

      <Card>
        <Select
          label="Add a section"
          name="newType"
          value={adding}
          onChange={(e) => {
            setEditing(null);
            setAdding(e.target.value as HomeSectionType | "");
          }}
        >
          <option value="">Choose a section type…</option>
          {TYPES.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
        </Select>
        {adding && <p className="mt-2 text-xs text-brand-brown">{typeInfo(adding).help}</p>}
      </Card>
      {adding && (
        <SectionForm key={adding} type={adding} section={null} categories={cats?.data ?? []} onDone={closeForm(true)} onCancel={closeForm(false)} />
      )}

      <ol className="space-y-2">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className={`rounded-lg border p-3 ${editing?.id === s.id ? "border-brand-flame bg-brand-flame-light/40" : "border-brand-brown/15 bg-white/70"}`}
          >
            <div className={`flex flex-wrap items-center gap-3 ${s.isActive ? "" : "opacity-60"}`}>
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="px-2 leading-none font-bold hover:text-brand-red disabled:opacity-25">▲</button>
                <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} aria-label="Move down" className="px-2 leading-none font-bold hover:text-brand-red disabled:opacity-25">▼</button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {s.title || <span className="italic text-brand-brown">No heading</span>}{" "}
                  <span className="ml-1 rounded bg-brand-brown/10 px-1.5 py-0.5 text-xs font-semibold text-brand-brown">{typeInfo(s.type).label}</span>
                  {!s.isActive && <span className="ml-1 text-xs font-semibold text-brand-brown">· Hidden</span>}
                </p>
                <p className="truncate text-xs text-brand-brown">{summary(s)}</p>
              </div>
              <div className="flex gap-3 text-sm whitespace-nowrap">
                <button onClick={() => toggle(s)} className="text-brand-brown hover:text-brand-red">{s.isActive ? "Hide" : "Show"}</button>
                <button
                  onClick={() => {
                    setAdding("");
                    setEditing(editing?.id === s.id ? null : s);
                  }}
                  aria-expanded={editing?.id === s.id}
                  className="font-semibold text-brand-red hover:underline"
                >
                  {editing?.id === s.id ? "Close" : "Edit"}
                </button>
                <button onClick={() => remove(s)} className="text-brand-brown hover:text-red-700">Remove</button>
              </div>
            </div>
            {/* The form opens right under the section being edited. */}
            {editing?.id === s.id && (
              <div className="mt-3">
                <SectionForm key={s.id} type={s.type} section={s} categories={cats?.data ?? []} onDone={closeForm(true)} onCancel={closeForm(false)} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function SectionForm({
  type,
  section,
  categories,
  onDone,
  onCancel,
}: {
  type: HomeSectionType;
  section: AdminHomeSection | null;
  categories: AdminCategory[];
  onDone(): void;
  onCancel(): void;
}) {
  const [images, setImages] = useState<string[]>(section?.config.image ? [section.config.image] : []);
  const ref = useRef<HTMLDivElement>(null);
  // Bring the form into view when it opens (long lists, small screens).
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const c = section?.config ?? {};
  const defaultTitles: Partial<Record<HomeSectionType, string>> = {
    categories: "Shop by category",
    featured_products: "Featured",
    new_arrivals: "New arrivals",
    on_sale: "On sale",
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const config: Record<string, unknown> = {};
    if (hasLimit(type)) config.limit = Number(f.get("limit") || 8);
    if (type === "category_products") config.categoryId = f.get("categoryId");
    if (type === "banner") {
      if (!images[0]) return setError("Please upload a banner image.");
      config.image = images[0];
      config.link = String(f.get("link") ?? "").trim();
    }
    if (type === "text") config.body = f.get("body");

    const body = { type, title: f.get("title") ?? "", isActive: f.get("isActive") === "on", config };
    setSaving(true);
    setError("");
    try {
      if (section) await api(`/admin/home-sections/${section.id}`, { method: "PATCH", body });
      else await api("/admin/home-sections", { method: "POST", body });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={ref} className="scroll-mt-24">
      <Card>
        <h2 className="font-semibold">{section ? "Edit section" : "New section"}: {typeInfo(type).label}</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <Alert>{error}</Alert>
          {type !== "hero" && (
            <Field label="Heading" name="title" defaultValue={section?.title ?? defaultTitles[type] ?? ""} maxLength={80} hint="Leave empty for no heading." />
          )}
          {type === "category_products" && (
            <Select label="Category" name="categoryId" defaultValue={c.categoryId ?? ""} required>
              <option value="">Choose…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}{!cat.isActive ? " (hidden)" : ""}</option>
              ))}
            </Select>
          )}
          {hasLimit(type) && <Field label="Number of products" name="limit" type="number" min="1" max="24" defaultValue={c.limit ?? 8} />}
          {type === "banner" && (
            <>
              <ImageUploader images={images} onChange={setImages} max={1} label="Banner image" help="Wide image, e.g. 1640×500. Remove (✕) to replace." />
              <Field label="Link (optional)" name="link" defaultValue={c.link ?? ""} placeholder="/categories/lighters" />
            </>
          )}
          {type === "text" && <TextArea label="Text" name="body" rows={4} required maxLength={2000} defaultValue={c.body ?? ""} />}
          {type === "hero" && (
            <p className="text-sm text-brand-brown">
              The banners themselves are managed in{" "}
              <Link href="/admin/promotions" className="font-semibold text-brand-red hover:underline">Promotions</Link>.
            </p>
          )}
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={section?.isActive ?? true} className="h-4 w-4 accent-brand-red" />
            Visible on the home page
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : section ? "Save" : "Add to home page"}</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
