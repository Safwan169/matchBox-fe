import { cacheLife, cacheTag } from "next/cache";
import { apiGet } from "./api";
import type { ApiItem, ApiList, Category, HomeSection, Product, Promotion, StoreSettings } from "./types";

/**
 * Store-wide data shared by every visitor, cached so pages can be prerendered and served
 * instantly. Entries refresh in the background at most every minute ("minutes" profile),
 * and immediately when the API calls /api/revalidate after an admin change.
 *
 * Never put per-user data here. Checkout always re-prices on the server.
 */
export const STORE_TAG = "store";

function cached() {
  cacheLife("minutes");
  cacheTag(STORE_TAG);
}

export const FALLBACK_SECTIONS: HomeSection[] = [
  { id: "hero", type: "hero", title: "", config: {} },
  { id: "categories", type: "categories", title: "The Collections", config: {} },
  { id: "featured", type: "featured_products", title: "The Curated Edit", config: { limit: 4 } },
  { id: "services", type: "services", title: "", config: {} },
];

const EMPTY_SETTINGS: StoreSettings = { phone: "", whatsapp: "", email: "", address: "", facebookUrl: "", instagramUrl: "", tiktokUrl: "" };

export async function getHomeSections(): Promise<HomeSection[]> {
  "use cache";
  cached();
  return apiGet<ApiItem<HomeSection[]>>("/home-sections")
    .then((r) => r.data)
    .catch(() => FALLBACK_SECTIONS);
}

export async function getPromotions(): Promise<Promotion[]> {
  "use cache";
  cached();
  return apiGet<ApiItem<Promotion[]>>("/promotions")
    .then((r) => r.data)
    .catch(() => []);
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cached();
  return apiGet<ApiItem<Category[]>>("/categories")
    .then((r) => r.data)
    .catch(() => []);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  "use cache";
  cached();
  return apiGet<ApiItem<StoreSettings>>("/settings")
    .then((r) => r.data)
    .catch(() => EMPTY_SETTINGS);
}

/** Product lists for home page sections, e.g. "featured=true&limit=8". */
export async function getProductList(query: string): Promise<Product[]> {
  "use cache";
  cached();
  return apiGet<ApiList<Product>>(`/products?${query}`)
    .then((r) => r.data)
    .catch(() => []);
}
