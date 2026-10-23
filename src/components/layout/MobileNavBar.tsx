"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartIcon, GridIcon, HomeIcon, UserIcon, WhatsAppIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const itemClass = "flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1.5 text-[11px] font-semibold";

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: ReactNode; active: boolean }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`${itemClass} ${active ? "text-brand-red" : "text-brand-brown"}`}>
      {icon}
      {label}
    </Link>
  );
}

/** App-style bottom navigation for phones and small tablets (hidden from md up). */
export function MobileNavBar({ whatsappLink }: { whatsappLink: string | null }) {
  const pathname = usePathname();
  const { count } = useCart();
  const { user } = useAuth();
  const startsWith = (...paths: string[]) => paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <nav
      aria-label="Shortcuts"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-brown/15 bg-brand-cream/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgb(0_0_0/0.08)] backdrop-blur md:hidden"
    >
      <div className="mx-auto flex max-w-lg">
        <NavItem href="/" label="Home" icon={<HomeIcon />} active={pathname === "/"} />
        <NavItem href="/categories" label="Categories" icon={<GridIcon />} active={startsWith("/categories", "/products")} />
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={`${itemClass} text-brand-brown`}>
            <WhatsAppIcon className="h-6 w-6 text-[#1a9e4b]" />
            Chat
          </a>
        )}
        <NavItem
          href="/cart"
          label="Cart"
          active={startsWith("/cart", "/checkout")}
          icon={
            <span className="relative">
              <CartIcon />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-4.5 rounded-full bg-brand-red px-1 text-center text-[10px] leading-4.5 font-bold text-brand-cream">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </span>
          }
        />
        <NavItem
          href={user ? "/account" : "/login"}
          label={user ? "Account" : "Log in"}
          icon={<UserIcon />}
          active={startsWith("/account", "/orders", "/login", "/register")}
        />
      </div>
    </nav>
  );
}
