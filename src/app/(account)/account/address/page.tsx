"use client";

import { AddressForm } from "@/components/account/AccountForms";
import { AccountSubPage } from "@/components/account/AccountSubPage";
import { useRequireAuth } from "@/context/AuthContext";

export default function AccountAddressPage() {
  const { user, allowed, setUser } = useRequireAuth();

  return (
    <AccountSubPage title="Address Book" backHref="/account" backLabel="My account">
      {allowed && user ? <AddressForm user={user} onSaved={setUser} /> : <p className="text-brand-brown">Loading…</p>}
    </AccountSubPage>
  );
}
