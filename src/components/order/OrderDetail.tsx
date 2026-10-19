import Link from "next/link";
import type { ReactNode } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Card } from "@/components/ui";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTotals } from "./OrderSummary";

const steps: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="rounded-md bg-brand-charcoal/5 p-3 text-sm">This order was cancelled.</p>;
  }
  const current = steps.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-2 text-center text-xs font-semibold capitalize">
      {steps.map((s, i) => (
        <li key={s}>
          <div className={`h-2 rounded-full ${i <= current ? "bg-brand-red" : "bg-brand-brown/15"}`} />
          <p className={`mt-2 ${i <= current ? "text-brand-red" : "text-brand-brown"}`}>{s}</p>
        </li>
      ))}
    </ol>
  );
}

/** Order details shared by the customer and admin pages. `actions` renders extra controls. */
export function OrderDetail({ order, actions }: { order: Order; actions?: ReactNode }) {
  const a = order.shippingAddress;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xl font-bold">{order.orderNumber}</p>
          <p className="text-sm text-brand-brown">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <StatusTimeline status={order.status} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-0">
          <ul className="divide-y divide-brand-brown/15">
            {order.items.map((i) => (
              <li key={i.productId} className="flex items-center gap-4 p-4">
                <div className="w-16 shrink-0 overflow-hidden rounded-md">
                  <ProductImage src={i.image ?? undefined} alt={i.name} sizes="64px" />
                </div>
                <div className="flex-1">
                  <Link href={`/products/${i.slug}`} className="font-semibold hover:text-brand-red">
                    {i.name}
                  </Link>
                  <p className="text-sm text-brand-brown">
                    {formatPrice(i.price)} × {i.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(i.lineTotal)}</p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <OrderTotals subtotal={order.subtotal} shippingFee={order.shippingFee} total={order.total} />
            <p className="mt-4 text-sm text-brand-brown">
              Payment: Cash on delivery · <span className="font-semibold capitalize">{order.paymentStatus}</span>
            </p>
          </Card>
          <Card>
            <h2 className="font-semibold">Delivery address</h2>
            <address className="mt-2 text-sm leading-relaxed not-italic">
              {a.fullName}
              <br />
              {a.phone}
              <br />
              {a.addressLine}
              {a.area && <>, {a.area}</>}
              <br />
              {a.city} {a.postalCode}
            </address>
            {order.notes && <p className="mt-3 text-sm text-brand-brown">Note: {order.notes}</p>}
          </Card>
          {actions}
        </div>
      </div>
    </div>
  );
}
