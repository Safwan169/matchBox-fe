"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { BagLine, CloseLine, FlameMark, MenuLine, SearchLine, UserLine } from "./icons";

type NavLink = { href: string; label: string };

const iconBtn = "flex h-10 w-10 items-center justify-center transition-opacity duration-300 hover:opacity-60";

/** Transparent over the hero, then a solid ivory bar once the page scrolls. */
export function LuxHeader({ links }: { links: NavLink[] }) {
  const { count } = useCart();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const light = !solid && !menuOpen; // ivory text over the dark hero

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`overflow-hidden bg-lux-ink text-center text-[10px] tracking-[0.2em] whitespace-nowrap text-lux-brass-light uppercase transition-all sm:tracking-[0.3em] duration-700 ${solid ? "max-h-0" : "max-h-8 py-2"}`}
      >
        <span className="sm:hidden">Free Dhaka delivery over ৳3,000</span>
        <span className="hidden sm:inline">Complimentary delivery in Dhaka on orders over ৳3,000</span>
      </div>
      <div
        className={`transition-colors duration-700 ${light ? "text-lux-ivory" : "border-b border-lux-ink/10 bg-lux-ivory/92 text-lux-ink backdrop-blur-md"}`}
      >
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-20 sm:px-8">
          <nav aria-label="Main" className="flex items-center">
            <button className={`${iconBtn} -ml-2 lg:hidden`} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen ? <CloseLine className="h-6 w-6" /> : <MenuLine className="h-6 w-6" />}
            </button>
            <ul className="hidden gap-8 text-[11px] font-normal tracking-[0.25em] uppercase lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group relative py-2">
                    {l.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/preview/luxury" className="flex flex-col items-center gap-1" aria-label="MatchBox home">
            <FlameMark className="h-4 w-4 text-lux-brass" />
            <span className="font-serif text-xl tracking-[0.42em] sm:text-2xl">MATCHBOX</span>
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Link href="/products" className={`${iconBtn} hidden sm:flex`} aria-label="Search">
              <SearchLine />
            </Link>
            <Link href="/account" className={`${iconBtn} hidden sm:flex`} aria-label="Account">
              <UserLine />
            </Link>
            <Link href="/cart" className={`${iconBtn} relative -mr-2`} aria-label={`Bag, ${count} items`}>
              <BagLine />
              {count > 0 && (
                <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lux-brass px-1 text-[9px] font-medium text-lux-ink">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Phone menu: full-screen, links rise in one after another. */}
      <div
        className={`absolute inset-x-0 top-full h-[100svh] border-t border-lux-ink/10 bg-lux-ivory transition-[opacity,visibility] duration-500 lg:hidden ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <ul className="px-6 pt-10">
          {[{ href: "/products", label: "All pieces" }, ...links.filter((l) => l.href !== "/products"), { href: "/account", label: "Account" }].map((l, i) => (
            <li key={l.href} className="overflow-hidden border-b border-lux-ink/10">
              <Link
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-5 font-serif text-4xl font-light transition-transform duration-700 ${menuOpen ? "translate-y-0" : "translate-y-full"}`}
                style={{ transitionDelay: menuOpen ? `${120 + i * 70}ms` : "0ms" }}
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
