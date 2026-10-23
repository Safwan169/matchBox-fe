"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Field, errorMessage } from "@/components/ui";
import { api } from "@/lib/api";
import { BD_PHONE_HINT, BD_PHONE_PATTERN } from "@/lib/phone";
import type { ApiItem, User } from "@/lib/types";

export function ProfileForm({ user, onSaved }: { user: User; onSaved(user: User): void }) {
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const { data } = await api<ApiItem<User>>("/auth/me", {
        method: "PATCH",
        body: { name: form.get("name"), phone: form.get("phone") },
      });
      onSaved(data);
      setStatus({ kind: "success", text: "Profile saved." });
    } catch (err) {
      setStatus({ kind: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Profile</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {status && <Alert kind={status.kind}>{status.text}</Alert>}
        <Field label="Email" name="email" value={user.email} disabled readOnly />
        <Field label="Full name" name="name" defaultValue={user.name} required minLength={2} />
        <Field label="Mobile number" name="phone" type="tel" defaultValue={user.phone} required pattern={BD_PHONE_PATTERN} hint={BD_PHONE_HINT} />
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </Card>
  );
}

export function AddressForm({ user, onSaved }: { user: User; onSaved(user: User): void }) {
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const a = user.address;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const { data } = await api<ApiItem<User>>("/auth/me", {
        method: "PATCH",
        body: {
          address: {
            addressLine: form.get("addressLine"),
            area: form.get("area"),
            city: form.get("city"),
            postalCode: form.get("postalCode"),
          },
        },
      });
      onSaved(data);
      setStatus({ kind: "success", text: "Address saved. It will be used at checkout." });
    } catch (err) {
      setStatus({ kind: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Delivery address</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {status && <Alert kind={status.kind}>{status.text}</Alert>}
        <Field label="Address" name="addressLine" defaultValue={a?.addressLine} required minLength={5} autoComplete="street-address" placeholder="House, road, block" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Area" name="area" defaultValue={a?.area} placeholder="e.g. Dhanmondi" />
          <Field label="City" name="city" defaultValue={a?.city ?? "Dhaka"} required autoComplete="address-level2" />
        </div>
        <Field label="Postal code" name="postalCode" defaultValue={a?.postalCode} autoComplete="postal-code" />
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save address"}
        </Button>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    if (form.get("newPassword") !== form.get("confirm")) {
      setStatus({ kind: "error", text: "New passwords do not match" });
      return;
    }
    setSaving(true);
    try {
      await api("/auth/change-password", {
        method: "POST",
        body: { currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") },
      });
      formEl.reset();
      setStatus({ kind: "success", text: "Password changed." });
    } catch (err) {
      setStatus({ kind: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Change password</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {status && <Alert kind={status.kind}>{status.text}</Alert>}
        <Field label="Current password" name="currentPassword" type="password" autoComplete="current-password" required />
        <Field label="New password" name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
        <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Change password"}
        </Button>
      </form>
    </Card>
  );
}
