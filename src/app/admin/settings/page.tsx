"use client";

import { useState, type FormEvent } from "react";
import { useAdminApi } from "@/components/admin/AdminShell";
import { Alert, Button, Card, Field, PageTitle, TextArea, errorMessage } from "@/components/ui";
import { api } from "@/lib/api";
import { BD_PHONE_PATTERN } from "@/lib/phone";
import type { ApiItem, DeliveryTier, StoreSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { data, error } = useAdminApi<ApiItem<StoreSettings>>("/admin/settings");

  return (
    <div className="space-y-4">
      <PageTitle>Store settings</PageTitle>
      <p className="text-sm text-brand-brown">
        Contact details shown on the website: the bar above the header, the footer, the WhatsApp chat button and
        “Ask on WhatsApp” on product pages. Leave a field empty to hide it.
      </p>
      <h2 className="pt-4 font-serif text-2xl">Delivery incentives</h2>
      <p className="text-sm text-brand-brown">Set the delivery fee at each cart item count. The message appears in the shopper’s cart before they reach that tier.</p>
      <Alert>{error}</Alert>
      {data ? <SettingsForm key="loaded" settings={data.data} /> : !error && <p className="text-brand-brown">Loading…</p>}
    </div>
  );
}

function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [tiers, setTiers] = useState<DeliveryTier[]>(settings.deliveryTiers.length ? settings.deliveryTiers : [{ minItems: 1, insideDhakaFee: 6000, message: "" }]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    setStatus(null);
    try {
      await api("/admin/settings", {
        method: "PATCH",
        body: {
          phone: f.get("phone"),
          whatsapp: f.get("whatsapp"),
          email: f.get("email"),
          address: f.get("address"),
          facebookUrl: f.get("facebookUrl"),
          instagramUrl: f.get("instagramUrl"),
          tiktokUrl: f.get("tiktokUrl"),
          deliveryTiers: tiers,
        },
      });
      setStatus({ kind: "success", text: "Saved. Refresh the store to see the changes." });
    } catch (err) {
      setStatus({ kind: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        {status && <Alert kind={status.kind}>{status.text}</Alert>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone number" name="phone" type="tel" defaultValue={settings.phone} pattern={BD_PHONE_PATTERN} placeholder="01XXXXXXXXX" hint="Customers can tap to call." />
          <Field label="WhatsApp number" name="whatsapp" type="tel" defaultValue={settings.whatsapp} pattern={BD_PHONE_PATTERN} placeholder="01XXXXXXXXX" hint="Shows the chat button and the WhatsApp links." />
        </div>
        <Field label="Email" name="email" type="email" defaultValue={settings.email} placeholder="hello@example.com" />
        <TextArea label="Shop address" name="address" rows={2} maxLength={300} defaultValue={settings.address} />
        <Field label="Facebook page link" name="facebookUrl" type="url" defaultValue={settings.facebookUrl} placeholder="https://facebook.com/yourpage" />
        <Field label="Instagram link" name="instagramUrl" type="url" defaultValue={settings.instagramUrl} placeholder="https://instagram.com/yourpage" />
        <Field
          label="TikTok link"
          name="tiktokUrl"
          type="url"
          defaultValue={settings.tiktokUrl}
          placeholder="https://tiktok.com/@yourpage"
          hint="Social links appear as “Follow us” buttons in the footer."
        />
        <div className="space-y-3 border-t border-brand-brown/15 pt-4">
          <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Delivery fee tiers · Dhaka only</h2><button type="button" className="text-sm font-semibold text-brand-red hover:underline" onClick={() => setTiers((current) => [...current, { minItems: (current.at(-1)?.minItems ?? 0) + 1, insideDhakaFee: current.at(-1)?.insideDhakaFee ?? 0, message: "" }])}>+ Add tier</button></div>
          {tiers.map((tier, index) => <div key={index} className="space-y-3 rounded-md border border-brand-brown/15 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Cart item count from" type="number" min="1" value={tier.minItems} onChange={(e) => setTiers((rows) => rows.map((row, i) => i === index ? { ...row, minItems: Number(e.target.value) } : row))} required />
              <Field label="Dhaka delivery (৳)" type="number" min="0" step="0.01" value={tier.insideDhakaFee / 100} onChange={(e) => setTiers((rows) => rows.map((row, i) => i === index ? { ...row, insideDhakaFee: Math.round(Number(e.target.value) * 100) } : row))} required />
            </div>
            <div className="flex items-end gap-3"><div className="min-w-0 flex-1"><Field label="Shopper message for this tier" maxLength={180} value={tier.message} placeholder="Add {remaining} more item to get reduced delivery" onChange={(e) => setTiers((rows) => rows.map((row, i) => i === index ? { ...row, message: e.target.value } : row))} hint="Use {remaining} for items still needed and {deliveryFee} for this tier’s fee." /></div><button type="button" className="pb-2 text-sm text-red-700 hover:underline" disabled={tiers.length === 1} onClick={() => setTiers((rows) => rows.filter((_, i) => i !== index))}>Remove</button></div>
          </div>)}
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</Button>
      </form>
    </Card>
  );
}
