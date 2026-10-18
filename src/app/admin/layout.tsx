import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    // AdminShell reads the URL (usePathname), which must sit inside Suspense.
    <Suspense fallback={<p className="mx-auto w-full max-w-6xl px-4 py-12 text-brand-brown">Loading…</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
