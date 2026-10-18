"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form onSubmit={onSubmit} role="search" className={`flex ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full min-w-0 rounded-l-md border-2 border-r-0 border-brand-cream/70 bg-brand-cream px-3 py-1.5 text-sm text-brand-charcoal placeholder:text-brand-brown/60 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-r-md border-2 border-brand-flame bg-brand-flame px-3 text-sm font-semibold text-brand-charcoal hover:bg-brand-flame-light"
      >
        Search
      </button>
    </form>
  );
}
