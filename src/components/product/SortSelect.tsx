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
    <label className="flex items-center gap-2 text-sm">
      <span className="text-brand-brown">Sort by</span>
      <select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-brand-brown/30 bg-white px-2 py-1.5"
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
