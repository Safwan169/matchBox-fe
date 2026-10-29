"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A–Z" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params}`);
  }

  return (
    <label className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase">
      <span className="text-lux-stone">Sort by</span>
      <select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer border-0 border-b border-lux-ink/30 bg-transparent py-1 pr-6 text-[11px] tracking-[0.2em] uppercase focus:border-lux-ink focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
