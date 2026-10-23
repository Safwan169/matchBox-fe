"use client";

import { ProfileForm } from "@/components/account/AccountForms";
import { AccountSubPage } from "@/components/account/AccountSubPage";
import { useRequireAuth } from "@/context/AuthContext";

export default function AccountProfilePage() {
  const { user, allowed, setUser } = useRequireAuth();

  return (
    <AccountSubPage title="Account Information" backHref="/account" backLabel="My account">
      {allowed && user ? <ProfileForm user={user} onSaved={setUser} /> : <p className="text-brand-brown">Loading…</p>}
    </AccountSubPage>
  );
}
