import type { ReactNode } from "react";
import { Button } from "@/components/ui";

export function AdminTable({
  head,
  children,
  empty,
  loading = false,
}: {
  head: string[];
  children: ReactNode;
  empty?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="admin-table-wrap overflow-x-auto border border-brand-brown/15 bg-white/70">
      <table className="admin-table w-full text-left text-sm">
        <thead className="bg-brand-brown/5 text-xs tracking-wide text-brand-brown uppercase">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-brown/10">
          {loading || empty ? (
            <tr>
              <td colSpan={head.length} className="admin-table-empty px-4 py-10 text-center text-brand-brown">
                {loading ? "Loading records…" : "Nothing found."}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pager({ page, totalPages, onPage }: { page: number; totalPages: number; onPage(page: number): void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm">
      <Button variant="outline" className="px-3 py-1" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        ←
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" className="px-3 py-1" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        →
      </Button>
    </div>
  );
}

export const tableInput =
  "rounded-md border border-brand-brown/30 bg-white px-3 py-2 text-sm focus:border-brand-red focus:outline-none";
