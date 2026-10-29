import { formatPrice } from "@/lib/format";

export function Price({ price, compareAtPrice, className = "" }: { price: number; compareAtPrice?: number | null; className?: string }) {
  const onSale = compareAtPrice != null && compareAtPrice > price;
  return (
    <p className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-medium text-brand-red">{formatPrice(price)}</span>
      {onSale && <s className="text-sm text-brand-brown">{formatPrice(compareAtPrice)}</s>}
    </p>
  );
}
