"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AdminUserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <Link href="/admin/account" className="admin-account-link flex items-center gap-2 text-xs" title={user.email}>
        <span aria-hidden="true" className="admin-account-mark flex size-8 items-center justify-center border border-lux-ink/15 font-serif text-base">
          {user.name.trim().charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{user.name}</span>
      </Link>
      <button onClick={onLogout} className="admin-topbar-link text-[10px] tracking-[0.17em] uppercase">
        Log out
      </button>
    </div>
  );
}
