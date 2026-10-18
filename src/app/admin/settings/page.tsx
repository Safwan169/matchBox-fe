"use client";

import { useState, type FormEvent } from "react";
import { useAdminApi } from "@/components/admin/AdminShell";
import { Alert, Button, Card, Field, PageTitle, TextArea, errorMessage } from "@/components/ui";
import { api } from "@/lib/api";
import { BD_PHONE_PATTERN } from "@/lib/phone";
import type { ApiItem, StoreSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { data, error } = useAdminApi<ApiItem<StoreSettings>>("/admin/settings");

  return (
    <div className="space-y-4">
      <PageTitle>Store settings</PageTitle>
      <p className="text-sm text-brand-brown">
        Contact details shown on the website: the bar above the header, the footer, the WhatsApp chat button and
        “Ask on WhatsApp” on product pages. Leave a field empty to hide it.
      </p>
      <Alert>{error}</Alert>
      {data ? <SettingsForm key="loaded" settings={data.data} /> : !error && <p className="text-brand-brown">Loading…</p>}
    </div>
  );
}

function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

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
          <Field label="WhatsApp number" name="whatsapp" type="tel" defaultValue={settings.whatsapp} pattern={BD_PHONE_PATTERN} placeholder="01XXXXXXXXX" hint="Shows the green chat button." />
        </div>
        <Field label="Email" name="email" type="email" defaultValue={settings.email} placeholder="hello@example.com" />
        <TextArea label="Shop address" name="address" rows={2} maxLength={300} defaultValue={settings.address} />
        <Field label="Facebook page link" name="facebookUrl" type="url" defaultValue={settings.facebookUrl} placeholder="https://facebook.com/yourpage" />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</Button>
      </form>
    </Card>
  );
}
