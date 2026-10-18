"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function AccountLinks() {
  const { user, loading } = useAuth();

  if (loading) return <span className="w-16" aria-hidden />;

  if (!user) {
    return (
      <Link href="/login" className="hover:text-brand-flame">
        Log in
      </Link>
    );
  }

  return (
    <>
      {user.role === "admin" && (
        <Link href="/admin" className="rounded bg-brand-flame px-2 py-0.5 text-brand-charcoal hover:bg-brand-flame-light">
          Admin
        </Link>
      )}
      <Link href="/account" className="hover:text-brand-flame" title={user.email}>
        Hi, {user.name.split(" ")[0]}
      </Link>
    </>
  );
}
