"use client";

import { PasswordForm } from "@/components/account/AccountForms";
import { AccountSubPage } from "@/components/account/AccountSubPage";
import { useRequireAuth } from "@/context/AuthContext";

export default function AccountPasswordPage() {
  const { user, allowed } = useRequireAuth();

  return (
    <AccountSubPage title="Change Password" backHref="/account" backLabel="My account">
      {allowed && user ? <PasswordForm /> : <p className="text-brand-brown">Loading…</p>}
    </AccountSubPage>
  );
}
