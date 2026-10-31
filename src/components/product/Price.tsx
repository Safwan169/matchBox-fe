import { formatPrice, PRICE_ON_REQUEST } from "@/lib/format";

export function Price({ price, compareAtPrice, className = "" }: { price: number | null; compareAtPrice?: number | null; className?: string }) {
  if (price === null) return <p className={`text-brand-brown ${className}`}>{PRICE_ON_REQUEST}</p>;
  const onSale = compareAtPrice != null && compareAtPrice > price;
  return (
    <p className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-medium text-brand-red">{formatPrice(price)}</span>
      {onSale && <s className="text-sm text-brand-brown">{formatPrice(compareAtPrice)}</s>}
    </p>
  );
}
