import { LuxHeader } from "@/components/luxury/LuxHeader";
import { getCategories } from "@/lib/store-data";

/** The shop header; category links come from the (cached) category list. */
export async function Header({ className = "" }: { className?: string }) {
  const categories = await getCategories();
  const categoryLinks = categories.map((c) => ({ href: `/categories/${c.slug}`, label: c.name }));
  // The desktop bar has room for three categories; the phone menu lists them all.
  return <LuxHeader links={[{ href: "/products", label: "Shop" }, ...categoryLinks.slice(0, 3)]} menuCategories={categoryLinks} className={className} />;
}
