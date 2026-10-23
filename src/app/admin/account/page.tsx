"use client";

import { PasswordForm, ProfileForm } from "@/components/account/AccountForms";
import { PageTitle } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function AdminAccountPage() {
  const { user, setUser } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageTitle>My account</PageTitle>
      <p className="text-sm text-brand-brown">
        Signed in as <span className="font-semibold">{user.email}</span>.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm user={user} onSaved={setUser} />
        <PasswordForm />
      </div>
    </div>
  );
}
