import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// Admin has its own simple top bar instead of the shop's header and footer.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin-theme min-h-screen">
      <header className="admin-topbar sticky top-0 z-30">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="admin-wordmark shrink-0" aria-label="MatchBox admin dashboard">
            MATCHBOX
          </Link>
          <span className="admin-topbar-label hidden border-l border-lux-ink/15 pl-4 text-[10px] tracking-[0.24em] text-lux-stone uppercase sm:block">
            Store administration
          </span>
          <nav aria-label="Admin account" className="ml-auto flex items-center gap-3 sm:gap-6">
            <Link href="/" target="_blank" className="admin-topbar-link hidden text-[10px] tracking-[0.17em] uppercase sm:inline-flex">
              View store <span aria-hidden="true">↗</span>
            </Link>
            <AdminUserMenu />
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)]">
        {/* AdminShell reads the URL (usePathname), which must sit inside Suspense. */}
        <Suspense fallback={<p role="status" className="mx-auto max-w-[1600px] px-4 py-12 text-sm text-lux-stone sm:px-6 lg:px-8">Loading administration…</p>}>
          <AdminShell>{children}</AdminShell>
        </Suspense>
      </main>
    </div>
  );
}
