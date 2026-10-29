"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdminApi } from "@/components/admin/AdminShell";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Alert, Button, Card, Field, PageTitle, Select, TextArea, errorMessage } from "@/components/ui";
import type { AdminPromotion } from "@/lib/admin-types";
import { api } from "@/lib/api";
import { assetUrl, isUpload } from "@/lib/assets";
import { formatDate } from "@/lib/format";
import type { ApiItem } from "@/lib/types";

function scheduleStatus(p: AdminPromotion, now: number) {
  if (!p.isActive) return { label: "Hidden", className: "text-brand-brown" };
  if (p.startsAt && new Date(p.startsAt).getTime() > now) return { label: `Starts ${formatDate(p.startsAt)}`, className: "text-blue-700" };
  if (p.endsAt && new Date(p.endsAt).getTime() <= now) return { label: "Ended", className: "text-brand-brown" };
  return { label: p.endsAt ? `Live until ${formatDate(p.endsAt)}` : "Live", className: "text-green-800" };
}

export default function AdminPromotionsPage() {
  const { data, error, loading, reload } = useAdminApi<ApiItem<AdminPromotion[]>>("/admin/promotions");
  const [editing, setEditing] = useState<AdminPromotion | null>(null);
  const [actionError, setActionError] = useState("");
  const now = Date.now(); // eslint-disable-line react-hooks/purity -- display-only status, recomputed on render

  async function remove(p: AdminPromotion) {
    if (p.kind === "brand") return;
    if (!confirm(`Delete promotion "${p.title}"?`)) return;
    try {
      await api(`/admin/promotions/${p.id}`, { method: "DELETE" });
      if (editing?.id === p.id) setEditing(null);
      reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  return (
    <div className="space-y-4">
      <PageTitle>Promotions</PageTitle>
      <p className="text-sm text-brand-brown">
        The brand hero is the first slide; your scheduled promotions follow it. Edit either slide’s top line, title breaks and text color here.
      </p>
      <Alert>{error || actionError}</Alert>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,400px)]">
        <AdminTable head={["Type", "Banner", "Title", "Order", "Status", ""]} loading={loading} empty={!loading && data?.data.length === 0}>
          {data?.data.map((p) => {
            const status = scheduleStatus(p, now);
            return (
              <tr key={p.id} className={editing?.id === p.id ? "bg-brand-flame-light/40" : "hover:bg-brand-brown/5"}>
                <td className="px-4 py-3 whitespace-nowrap">{p.kind === "brand" ? "Brand hero" : "Promotion"}</td>
                <td className="px-4 py-2">
                  <div className="relative aspect-[1640/624] w-32 overflow-hidden rounded bg-brand-red">
                    <Image src={assetUrl(p.image)} alt="" fill sizes="128px" className="object-cover" unoptimized={!isUpload(p.image)} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.eyebrow && <p className="text-xs text-brand-brown">{p.eyebrow}</p>}
                  <p className="font-semibold whitespace-pre-line">{p.title}{p.accent && ` ${p.accent}`}</p>
                  {p.subtitle && <p className="text-xs whitespace-pre-line text-brand-brown">{p.subtitle}</p>}
                </td>
                <td className="px-4 py-3">{p.sortOrder}</td>
                <td className={`px-4 py-3 text-xs font-semibold ${status.className}`}>{status.label}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="font-semibold text-brand-red hover:underline">Edit</button>
                  {p.kind !== "brand" && <button onClick={() => remove(p)} className="ml-3 text-brand-brown hover:text-red-700">Delete</button>}
                </td>
              </tr>
            );
          })}
        </AdminTable>

        <PromotionForm
          key={editing?.id ?? "new"}
          promotion={editing}
          onDone={() => {
            setEditing(null);
            reload();
          }}
        />
      </div>
    </div>
  );
}

// <input type="datetime-local"> works in local time without a zone.
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const fromLocalInput = (value: FormDataEntryValue | null) => (value ? new Date(String(value)).toISOString() : null);

function PromotionForm({ promotion, onDone }: { promotion: AdminPromotion | null; onDone(): void }) {
  const [images, setImages] = useState<string[]>(promotion ? [promotion.image] : []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!images[0]) {
      setError("Please upload a banner image.");
      return;
    }
    const f = new FormData(e.currentTarget);
    const body = {
      image: images[0],
      eyebrow: f.get("eyebrow"),
      title: f.get("title"),
      accent: f.get("accent"),
      subtitle: f.get("subtitle"),
      buttonText: f.get("buttonText"),
      link: String(f.get("link") ?? "").trim(),
      showText: f.get("showText") === "on",
      textColor: f.get("textColor"),
      eyebrowColor: f.get("eyebrowColor"),
      accentColor: f.get("accentColor"),
      isActive: f.get("isActive") === "on",
      sortOrder: Number(f.get("sortOrder") || 0),
      startsAt: fromLocalInput(f.get("startsAt")),
      endsAt: fromLocalInput(f.get("endsAt")),
    };
    setSaving(true);
    setError("");
    try {
      if (promotion) await api(`/admin/promotions/${promotion.id}`, { method: "PATCH", body });
      else await api("/admin/promotions", { method: "POST", body });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="h-fit">
      <h2 className="font-semibold">{promotion ? `Edit “${promotion.title}”` : "New promotion"}</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <Alert>{error}</Alert>
        <ImageUploader
          images={images}
          onChange={setImages}
          max={1}
          label="Banner image"
          help="Wide image, ideally 1640×624 px (same as the Facebook cover). Remove (✕) to replace."
        />
        {images[0] && (
          <div className="relative aspect-[1640/624] overflow-hidden rounded-md bg-brand-red">
            <Image src={assetUrl(images[0])} alt="Banner preview" fill sizes="400px" className="object-cover" unoptimized={!isUpload(images[0])} />
          </div>
        )}
        <Field label="Top line / eyebrow" name="eyebrow" defaultValue={promotion?.eyebrow} maxLength={80} placeholder="e.g. MATCHBOX · DHAKA" />
        <Select label="Top line color" name="eyebrowColor" defaultValue={promotion?.eyebrowColor ?? "brass"}>
          <option value="brass">Brass</option>
          <option value="ivory">Ivory</option>
          <option value="ink">Ink</option>
        </Select>
        <TextArea label="Title" name="title" rows={3} defaultValue={promotion?.title} required minLength={2} maxLength={100} hint="Press Enter wherever you want the title to break onto a new line. Also used as image description." />
        <Field label="Accent word (optional)" name="accent" defaultValue={promotion?.accent} maxLength={40} placeholder="e.g. flame." />
        <Select label="Accent word color" name="accentColor" defaultValue={promotion?.accentColor ?? "brass"}>
          <option value="brass">Brass</option>
          <option value="ivory">Ivory</option>
          <option value="ink">Ink</option>
        </Select>
        <TextArea label="Subtitle" name="subtitle" rows={3} defaultValue={promotion?.subtitle} maxLength={200} placeholder="e.g. 20% off all lighters this week" hint="Press Enter to add line breaks." />
        <Select label="Text color" name="textColor" defaultValue={promotion?.textColor ?? "ivory"}>
          <option value="ivory">Ivory</option>
          <option value="brass">Brass</option>
          <option value="ink">Ink (for light images)</option>
        </Select>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button text" name="buttonText" defaultValue={promotion?.buttonText} maxLength={40} placeholder="Shop now" />
          <Field label="Button link" name="link" defaultValue={promotion?.link} maxLength={500} placeholder="/categories/lighters" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start (optional)" name="startsAt" type="datetime-local" defaultValue={toLocalInput(promotion?.startsAt ?? null)} />
          <Field label="End (optional)" name="endsAt" type="datetime-local" defaultValue={toLocalInput(promotion?.endsAt ?? null)} />
        </div>
        <Field label="Order" name="sortOrder" type="number" min="0" defaultValue={promotion?.sortOrder ?? 0} hint="Lower numbers show first." />
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="showText" defaultChecked={promotion?.showText ?? true} className="h-4 w-4 accent-brand-red" />
          Show title and subtitle over the image (turn off if the image has its own text)
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={promotion?.isActive ?? true} className="h-4 w-4 accent-brand-red" />
          Visible
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : promotion ? "Save" : "Add promotion"}</Button>
          {promotion && <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>}
        </div>
      </form>
    </Card>
  );
}
