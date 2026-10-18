import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, basePath, params = {} }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
    if (p > 1) query.set("page", String(p));
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const link = "rounded-md border border-brand-brown/30 px-3 py-1.5 text-sm hover:bg-brand-red hover:text-brand-cream";

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
      {page > 1 && <Link href={href(page - 1)} className={link}>← Previous</Link>}
      <span className="px-2 text-sm text-brand-brown">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && <Link href={href(page + 1)} className={link}>Next →</Link>}
    </nav>
  );
}
