"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { BagLine, GridLine, HomeLine, UserLine } from "@/components/luxury/icons";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useHydrated } from "@/lib/use-hydrated";

const itemClass = "flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-[9px] tracking-[0.2em] uppercase transition-colors duration-300";

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: ReactNode; active: boolean }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`${itemClass} ${active ? "text-lux-ink" : "text-lux-stone"}`}>
      {icon}
      {label}
      <span className={`h-px w-4 transition-colors duration-300 ${active ? "bg-lux-brass" : "bg-transparent"}`} />
    </Link>
  );
}

/** App-style bottom navigation for phones and small tablets (hidden from md up). */
export function MobileNavBar({ whatsappLink }: { whatsappLink: string | null }) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cart = useCart();
  const auth = useAuth();
  // Render what the server did until hydrated (see useHydrated).
  const count = hydrated ? cart.count : 0;
  const user = hydrated ? auth.user : null;
  const startsWith = (...paths: string[]) => paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <nav
      aria-label="Shortcuts"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-lux-ink/10 bg-lux-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-lg">
        <NavItem href="/" label="Home" icon={<HomeLine />} active={pathname === "/"} />
        <NavItem href="/categories" label="Shop" icon={<GridLine />} active={startsWith("/categories", "/products")} />
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={`${itemClass} text-lux-stone`}>
            <WhatsAppIcon className="h-5 w-5" />
            Chat
            <span className="h-px w-4" />
          </a>
        )}
        <NavItem
          href="/cart"
          label="Bag"
          active={startsWith("/cart", "/checkout")}
          icon={
            <span className="relative">
              <BagLine />
              {count > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-lux-brass px-0.5 text-[8px] text-lux-ink">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </span>
          }
        />
        <NavItem
          href={user ? "/account" : "/login"}
          label={user ? "Account" : "Log in"}
          icon={<UserLine />}
          active={startsWith("/account", "/orders", "/login", "/register")}
        />
      </div>
    </nav>
  );
}
