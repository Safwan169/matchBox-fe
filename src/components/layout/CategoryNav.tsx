import Link from "next/link";
import { getCategories } from "@/lib/store-data";

export async function CategoryNav() {
  // Cached; empty if the API is unavailable (still shows "All products").
  const categories = await getCategories();

  return (
    <ul className="flex gap-1 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-medium whitespace-nowrap">
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
