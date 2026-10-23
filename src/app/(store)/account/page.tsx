"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddressForm, PasswordForm, ProfileForm } from "@/components/account/AccountForms";
import { Button, PageTitle, buttonClass } from "@/components/ui";
import { useRequireAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, allowed, logout, setUser } = useRequireAuth();
  const router = useRouter();

  if (!allowed || !user) return <p className="mx-auto w-full max-w-3xl px-4 py-12 text-brand-brown">Loading…</p>;

  async function onLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>My account</PageTitle>
        <div className="flex gap-2">
          <Link href="/orders" className={buttonClass("outline")}>
            My orders
          </Link>
          <Button variant="ghost" onClick={onLogout}>
            Log out
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <ProfileForm user={user} onSaved={setUser} />
        <AddressForm user={user} onSaved={setUser} />
        <PasswordForm />
      </div>
    </section>
  );
}
