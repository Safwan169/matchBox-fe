import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-brand-flame-light text-brand-brown",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-brand-charcoal/10 text-brand-charcoal/70",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span data-status={status} className={`order-status-badge inline-block rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${styles[status]}`}>{status}</span>
  );
}
