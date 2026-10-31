// Prices are stored in poisha (1/100 BDT).
export function formatPrice(poisha: number) {
  const taka = poisha / 100;
  const decimals = Number.isInteger(taka) ? 0 : 2; // ৳350, but ৳799.50 (not ৳799.5)
  return `৳${taka.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export const PRICE_ON_REQUEST = "Price on request";

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
