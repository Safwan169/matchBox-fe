"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";
import { useRequireAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/use-api";

const linkGroups = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }],
  },
  {
    label: "Orders & people",
    links: [
      { href: "/admin/orders", label: "Orders", icon: "orders" },
      { href: "/admin/customers", label: "Customers", icon: "customers" },
      { href: "/admin/reviews", label: "Reviews", icon: "reviews" },
    ],
  },
  {
    label: "Catalogue",
    links: [
      { href: "/admin/products", label: "Products", icon: "products" },
      { href: "/admin/categories", label: "Categories", icon: "categories" },
    ],
  },
  {
    label: "Storefront",
    links: [
      { href: "/admin/home", label: "Home page", icon: "home" },
      { href: "/admin/promotions", label: "Promotions", icon: "promotions" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
  {
    label: "Account",
    links: [{ href: "/admin/account", label: "My account", icon: "account" }],
  },
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
      {!allowed && <p role="status" className="mx-auto w-full max-w-6xl px-4 py-12 text-sm text-lux-stone">Checking administrator access…</p>}
      <div hidden={!allowed} className="mx-auto grid w-full max-w-[1600px] gap-0 px-4 sm:px-6 md:grid-cols-[190px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-8">
        <aside className="admin-sidebar min-w-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto md:py-8">
          <div className="hidden border-b border-lux-ink/10 pb-6 md:block">
            <p className="text-[10px] tracking-[0.3em] text-lux-stone uppercase">Workspace</p>
            <p className="mt-2 font-serif text-2xl font-light">Administration</p>
          </div>
          <nav className="admin-nav flex gap-1 overflow-x-auto border-b border-lux-ink/10 py-3 md:block md:space-y-5 md:overflow-visible md:border-0 md:py-6" aria-label="Admin">
            {linkGroups.map((group) => (
              <div key={group.label} className="admin-nav-group flex shrink-0 gap-1 md:block md:space-y-1">
                <p className="hidden px-3 pb-1 text-[9px] font-medium tracking-[0.24em] text-lux-stone uppercase md:block">{group.label}</p>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`admin-nav-link flex items-center gap-3 border px-3 py-2.5 text-xs whitespace-nowrap transition-colors duration-300 md:border-transparent ${
                      isActive(link.href)
                        ? "border-lux-ink bg-lux-ink text-lux-ivory md:border-lux-ink"
                        : "border-transparent text-lux-stone hover:border-lux-ink/10 hover:bg-white/60 hover:text-lux-ink"
                    }`}
                  >
                    <AdminNavIcon name={link.icon} />
                    <span>{link.label}</span>
                    {isActive(link.href) && <span aria-hidden="true" className="ml-auto hidden text-lux-brass md:inline">→</span>}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <p className="hidden border-t border-lux-ink/10 pt-5 text-[10px] leading-relaxed text-lux-stone md:block">
            MatchBox<br />Store management
          </p>
        </aside>
        <div className="admin-page-content min-w-0 py-6 sm:py-8 md:py-8">{children}</div>
      </div>
    </AdminReadyContext.Provider>
  );
}

type AdminNavIconName = (typeof linkGroups)[number]["links"][number]["icon"];

function AdminNavIcon({ name }: { name: AdminNavIconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="admin-nav-icon size-[18px] shrink-0" {...common}>
      {name === "dashboard" && <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>}
      {name === "orders" && <><path d="M4 5h16v15H4z" /><path d="M8 5V3h8v2M8 10h8M8 14h5" /></>}
      {name === "customers" && <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 15a5 5 0 0 1 3.5 4.8" /></>}
      {name === "reviews" && <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></>}
      {name === "products" && <><path d="m12 3 9 5-9 5-9-5zM3 8v8l9 5 9-5V8M12 13v8" /></>}
      {name === "categories" && <><path d="M3 5h18M3 12h18M3 19h18" /><circle cx="7" cy="5" r="1.5" /><circle cx="16" cy="12" r="1.5" /><circle cx="10" cy="19" r="1.5" /></>}
      {name === "home" && <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></>}
      {name === "promotions" && <><path d="M3 11v2h4l10 5V6L7 11zM7 13l1.5 6h3L10 14M20 9l2-2M20 15l2 2" /></>}
      {name === "settings" && <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.8z" transform="translate(-1 -1)" /></>}
      {name === "account" && <><circle cx="12" cy="8" r="3.5" /><path d="M4 21a8 8 0 0 1 16 0" /></>}
    </svg>
  );
}
