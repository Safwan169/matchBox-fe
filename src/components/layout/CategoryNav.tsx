import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { ApiItem, Category } from "@/lib/types";

export async function CategoryNav() {
  let categories: Category[] = [];
  try {
    categories = (await apiGet<ApiItem<Category[]>>("/categories")).data;
  } catch {
    // API unavailable: still show "All products".
  }

  return (
    <ul className="flex gap-1 overflow-x-auto text-sm font-medium whitespace-nowrap">
      <li>
        <Link href="/products" className="block rounded px-3 py-2 hover:bg-brand-red-dark">
          All products
        </Link>
      </li>
      {categories.map((c) => (
        <li key={c.id}>
          <Link href={`/categories/${c.slug}`} className="block rounded px-3 py-2 hover:bg-brand-red-dark">
            {c.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
