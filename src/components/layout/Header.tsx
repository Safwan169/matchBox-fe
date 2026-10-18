import Link from "next/link";
import { Suspense } from "react";
import { AccountLinks } from "./AccountLinks";
import { CategoryNav } from "./CategoryNav";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-brand-red text-brand-cream shadow-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Logo />
        <SearchBar className="order-last w-full md:order-none md:w-auto md:flex-1 md:max-w-md" />
        <nav aria-label="Account" className="ml-auto flex items-center gap-4 text-sm font-semibold">
          <AccountLinks />
          <Link href="/cart" className="hover:text-brand-flame">
            Cart
          </Link>
        </nav>
      </div>
      <nav aria-label="Categories" className="border-t border-brand-cream/20">
        <div className="mx-auto max-w-6xl px-2">
          <Suspense fallback={<div className="h-9" />}>
            <CategoryNav />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
