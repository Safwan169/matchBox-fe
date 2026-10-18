// Prices are stored in poisha (1/100 BDT).
export function formatPrice(poisha: number) {
  const taka = poisha / 100;
  return `৳${taka.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
