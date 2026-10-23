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
    <>
      <Link href="/admin/account" className="hidden hover:text-brand-flame sm:inline" title={user.email}>
        {user.name}
      </Link>
      <button onClick={onLogout} className="hover:text-brand-flame">
        Log out
      </button>
    </>
  );
}
