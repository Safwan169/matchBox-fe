"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { BagLine, GridLine, HomeLine, UserLine } from "./icons";

const item = "flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-[9px] tracking-[0.2em] uppercase";

/** Phone bottom bar in the luxury style (the home preview, so Home is active). */
export function LuxBottomBar() {
  const { count } = useCart();
  return (
    <nav aria-label="Shortcuts" className="fixed inset-x-0 bottom-0 z-40 border-t border-lux-ink/10 bg-lux-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md">
        <Link href="/preview/luxury" aria-current="page" className={`${item} text-lux-ink`}>
          <HomeLine />
          Home
          <span className="h-px w-4 bg-lux-brass" />
        </Link>
        <Link href="/categories" className={`${item} text-lux-stone`}>
          <GridLine />
          Shop
          <span className="h-px w-4" />
        </Link>
        <Link href="/cart" className={`${item} relative text-lux-stone`}>
          <span className="relative">
            <BagLine />
            {count > 0 && <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-lux-brass px-0.5 text-[8px] text-lux-ink">{count}</span>}
          </span>
          Bag
          <span className="h-px w-4" />
        </Link>
        <Link href="/account" className={`${item} text-lux-stone`}>
          <UserLine />
          Account
          <span className="h-px w-4" />
        </Link>
      </div>
    </nav>
  );
}
