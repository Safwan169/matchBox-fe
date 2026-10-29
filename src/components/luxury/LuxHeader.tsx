"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useHydrated } from "@/lib/use-hydrated";
import { BagLine, CloseLine, FlameMark, MenuLine, SearchLine, UserLine } from "./icons";

export type NavLink = { href: string; label: string };

const iconBtn = "flex h-10 w-10 items-center justify-center transition-opacity duration-300 hover:opacity-60";

/**
 * The shop header. Solid ivory, except over a hero marked `data-header-overlay` (home), where it
 * starts transparent and turns solid once the page scrolls (see .lux-header-bar in globals.css).
 */
export function LuxHeader({ links, menuCategories, className = "" }: { links: NavLink[]; menuCategories: NavLink[]; className?: string }) {
  const hydrated = useHydrated();
  const cart = useCart();
  const auth = useAuth();
  // Render what the server did until hydrated (see useHydrated).
  const count = hydrated ? cart.count : 0;
  const user = hydrated ? auth.user : null;
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the panels when the page changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    setSearchOpen(false);
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  }

  const solid = scrolled || menuOpen || searchOpen;
  const menuLinks: NavLink[] = [
    { href: "/products", label: "All pieces" },
    ...menuCategories,
    { href: user ? "/account" : "/login", label: user ? "My account" : "Log in" },
    { href: "/orders", label: "My orders" },
  ];

  return (
    <header className={`lux-header fixed inset-x-0 top-0 z-50 ${className}`} data-solid={solid ? "" : undefined}>
      <div className="flex h-8 items-center justify-center bg-lux-ink px-4 text-[10px] tracking-[0.2em] whitespace-nowrap text-lux-brass-light uppercase sm:tracking-[0.3em]">
        <span className="sm:hidden">Free delivery over ৳3,000</span>
        <span className="hidden sm:inline">Complimentary delivery on orders over ৳3,000</span>
      </div>
      <div className="lux-header-bar">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-20 sm:px-8">
          <nav aria-label="Main" className="flex items-center">
            <button
              className={`${iconBtn} -ml-2 lg:hidden`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <CloseLine className="h-6 w-6" /> : <MenuLine className="h-6 w-6" />}
            </button>
            <ul className="hidden gap-8 text-[11px] tracking-[0.25em] uppercase lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined} className="group relative py-2">
                    {l.label}
                    <span
                      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 group-hover:scale-x-100 ${pathname === l.href ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="flex flex-col items-center gap-1" aria-label="MatchBox home">
            <FlameMark className="h-4 w-4 text-lux-brass" />
            <span className="font-serif text-xl tracking-[0.42em] sm:text-2xl">MATCHBOX</span>
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button className={iconBtn} aria-label={searchOpen ? "Close search" : "Search"} aria-expanded={searchOpen} onClick={() => setSearchOpen((o) => !o)}>
              {searchOpen ? <CloseLine /> : <SearchLine />}
            </button>
            {user?.role === "admin" && (
              <Link href="/admin" className="hidden px-2 text-[10px] tracking-[0.25em] uppercase hover:opacity-60 lg:block">
                Admin
              </Link>
            )}
            {/* Phones use the bottom bar for account and bag. */}
            <Link href={user ? "/account" : "/login"} className={`${iconBtn} hidden md:flex`} aria-label={user ? "My account" : "Log in"}>
              <UserLine />
            </Link>
            <Link href="/cart" className={`${iconBtn} relative -mr-2 hidden md:flex`} aria-label={`Bag, ${count} items`}>
              <BagLine />
              {count > 0 && (
                <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lux-brass px-1 text-[9px] font-medium text-lux-ink">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search panel */}
        <div className={`grid transition-[grid-template-rows] duration-500 ${searchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <form onSubmit={onSearch} role="search" className="mx-auto flex max-w-3xl items-center gap-4 px-6 pt-2 pb-8">
              <SearchLine className="h-5 w-5 shrink-0 text-lux-stone" />
              <input
                ref={searchInput}
                name="q"
                type="search"
                placeholder="Search the collection"
                aria-label="Search products"
                tabIndex={searchOpen ? 0 : -1}
                className="w-full border-b border-lux-ink/20 bg-transparent py-3 font-serif text-2xl font-light text-lux-ink placeholder:text-lux-stone focus:border-lux-ink focus:outline-none"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Phone/tablet menu: full screen, links rise in one after another. */}
      <div
        className={`absolute inset-x-0 top-full h-[100svh] overflow-y-auto border-t border-lux-ink/10 bg-lux-ivory text-lux-ink transition-[opacity,visibility] duration-500 lg:hidden ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <ul className="px-6 pt-8 pb-40">
          {menuLinks.map((l, i) => (
            <li key={l.href} className="overflow-hidden border-b border-lux-ink/10">
              <Link
                href={l.href}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
                className={`block py-4 font-serif text-3xl font-light transition-transform duration-700 ${menuOpen ? "translate-y-0" : "translate-y-full"}`}
                style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
