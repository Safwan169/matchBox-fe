import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// Admin has its own simple top bar instead of the shop's header and footer.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="sticky top-0 z-30 bg-brand-red text-brand-cream shadow-md">
        <div className="mx-auto flex max-w-7xl items-center gap-x-4 px-4 py-2.5">
          <Logo />
          <span className="rounded bg-brand-flame px-2 py-0.5 text-sm font-bold text-brand-charcoal">Admin</span>
          <nav aria-label="Admin account" className="ml-auto flex items-center gap-4 text-sm font-semibold">
            <Link href="/" target="_blank" className="hover:text-brand-flame">
              View store ↗
            </Link>
            <AdminUserMenu />
          </nav>
        </div>
      </header>
      <main className="flex min-h-screen flex-1 flex-col">
        {/* AdminShell reads the URL (usePathname), which must sit inside Suspense. */}
        <Suspense fallback={<p className="mx-auto w-full max-w-6xl px-4 py-12 text-brand-brown">Loading…</p>}>
          <AdminShell>{children}</AdminShell>
        </Suspense>
      </main>
    </>
  );
}
