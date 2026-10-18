"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";
import { useRequireAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/use-api";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/home", label: "Home page" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/settings", label: "Settings" },
];

const AdminReadyContext = createContext(false);

/** Like useApi, but waits until the signed-in user is confirmed as an admin. */
export function useAdminApi<T>(path: string | null) {
  const ready = useContext(AdminReadyContext);
  return useApi<T>(ready ? path : null);
}

// Pages always render (so Next can validate them), but stay hidden and fetch nothing
// until the admin check passes. The API also enforces admin access on every request.
export function AdminShell({ children }: { children: ReactNode }) {
  const { allowed } = useRequireAuth({ admin: true });
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <AdminReadyContext.Provider value={allowed}>
      {!allowed && <p className="mx-auto w-full max-w-6xl px-4 py-12 text-brand-brown">Checking access…</p>}
      <div hidden={!allowed} className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[200px_1fr]">
        <aside>
          <p className="mb-3 font-display text-lg text-brand-red">Admin</p>
          <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Admin">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap ${
                  isActive(l.href) ? "bg-brand-red text-brand-cream" : "hover:bg-brand-red/10"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </AdminReadyContext.Provider>
  );
}
