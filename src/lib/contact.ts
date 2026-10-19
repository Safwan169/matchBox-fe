// Store contact settings (cached) for server components. Never throws.
export { getStoreSettings } from "./store-data";

// Numbers are stored as "01XXXXXXXXX" (Bangladesh).
const international = (local: string) => `880${local.replace(/^0/, "")}`;

export const telHref = (phone: string) => `tel:+${international(phone)}`;

export function whatsappHref(number: string, message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${international(number)}${text}`;
}

/** "01712345678" → "01712-345678" */
export const formatPhone = (phone: string) => (phone.length === 11 ? `${phone.slice(0, 5)}-${phone.slice(5)}` : phone);
