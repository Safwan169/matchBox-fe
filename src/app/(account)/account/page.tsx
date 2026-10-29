"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AccountTopBar } from "@/components/account/AccountTopBar";
import { AddressForm, PasswordForm, ProfileForm } from "@/components/account/AccountForms";
import { BoxIcon, ChevronRightIcon, DashboardIcon, LockIcon, LogoutIcon, MapPinIcon, UserIcon } from "@/components/icons";
import { Button, PageTitle, buttonClass } from "@/components/ui";
import { useRequireAuth } from "@/context/AuthContext";

const rowClass = "flex w-full items-center gap-4 px-4 py-3.5 text-left hover:bg-brand-flame-light/50";

function MenuRow({ href, icon, label, hint }: { href: string; icon: ReactNode; label: string; hint?: string }) {
  return (
    <li>
      <Link href={href} className={rowClass}>
        <span className="text-brand-brown">{icon}</span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-light">{label}</span>
          {hint && <span className="block truncate text-xs text-brand-brown">{hint}</span>}
        </span>
        <ChevronRightIcon className="h-5 w-5 text-brand-brown" />
      </Link>
    </li>
  );
}

export default function AccountPage() {
  const { user, allowed, logout, setUser } = useRequireAuth();
  const router = useRouter();

  if (!allowed || !user) return <p className="mx-auto w-full max-w-3xl px-4 py-12 text-brand-brown">Loading…</p>;

  async function onLogout() {
    await logout();
    router.replace("/");
  }

  const address = user.address ? [user.address.addressLine, user.address.area, user.address.city].filter(Boolean).join(", ") : "";

  return (
    <>
      {/* Phones: app-style menu (like Daraz); each item opens its own page. */}
      <div className="md:hidden">
        <AccountTopBar title="My Account" backHref="/" backLabel="Back to the shop" />
        <p className="bg-white/70 px-4 py-4">
          Hello, <span className="font-semibold">{user.name}</span>
        </p>
        <ul className="mt-2 divide-y divide-brand-brown/10 bg-white/70">
          <MenuRow href="/orders" icon={<BoxIcon />} label="My Orders" />
          <MenuRow href="/account/address" icon={<MapPinIcon />} label="Address Book" hint={address || "Add your delivery address"} />
          <MenuRow href="/account/profile" icon={<UserIcon />} label="Account Information" hint={user.phone || user.email} />
          <MenuRow href="/account/password" icon={<LockIcon />} label="Change Password" />
          {user.role === "admin" && <MenuRow href="/admin" icon={<DashboardIcon />} label="Admin dashboard" />}
        </ul>
        <div className="mt-2 bg-white/70">
          <button onClick={onLogout} className={`${rowClass} text-brand-red`}>
            <LogoutIcon />
            <span className="flex-1 font-serif text-lg font-light">Log out</span>
          </button>
        </div>
      </div>

      {/* Larger screens: everything on one page. */}
      <section className="mx-auto hidden w-full max-w-3xl px-4 py-10 md:block">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageTitle>My account</PageTitle>
          <div className="flex flex-wrap gap-2">
            {user.role === "admin" && (
              <Link href="/admin" className={buttonClass("primary")}>
                Admin dashboard
              </Link>
            )}
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
    </>
  );
}
