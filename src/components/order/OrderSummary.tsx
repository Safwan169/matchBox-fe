import { formatPrice } from "@/lib/format";

export function OrderTotals({ subtotal, shippingFee, total }: { subtotal: number; shippingFee: number; total: number }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Delivery</dt>
        <dd>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</dd>
      </div>
      <div className="flex justify-between border-t border-brand-brown/15 pt-2 text-base font-bold">
        <dt>Total</dt>
        <dd className="text-brand-red">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
