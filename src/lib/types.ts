// Mirrors the backend API response shapes.

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  price: number | null; // poisha; null = "price on request", not orderable
  compareAtPrice: number | null;
  stock: number;
  maxPerOrder: number | null; // per-order purchase limit; null = no product-specific limit
  images: string[];
  ageRestricted: boolean;
  isFeatured: boolean;
  isActive: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface ReviewList {
  data: Review[];
  meta: PageMeta;
  summary: RatingSummary;
}

export type UserRole = "customer" | "admin";

export interface SavedAddress {
  addressLine: string;
  area: string;
  city: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: SavedAddress | null;
  role: UserRole;
  dateOfBirth: string;
  createdAt: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  area: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "cod";
  paymentStatus: "unpaid" | "paid";
  shippingAddress: ShippingAddress;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderQuote {
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export type HomeSectionType =
  | "hero"
  | "categories"
  | "featured_products"
  | "new_arrivals"
  | "on_sale"
  | "category_products"
  | "banner"
  | "text"
  | "editorial"
  | "services"
  | "quote"
  | "contact";

export interface HomeSectionConfig {
  limit?: number;
  categoryId?: string;
  categorySlug?: string; // public API only
  image?: string; // "" = the built-in photo (editorial, quote)
  link?: string;
  linkText?: string;
  body?: string;
}

/** Home page section (GET /home-sections). */
export interface HomeSection {
  id: string;
  type: HomeSectionType;
  title: string;
  config: HomeSectionConfig;
}

/** Public hero banner (GET /promotions). */
export interface Promotion {
  id: string;
  kind: "brand" | "promotion";
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  image: string;
  buttonText: string;
  link: string;
  showText: boolean;
  textColor: "ivory" | "brass" | "ink";
  eyebrowColor: "ivory" | "brass" | "ink";
  accentColor: "ivory" | "brass" | "ink";
}

export interface StoreSettings {
  phone: string; // "01XXXXXXXXX" or ""
  whatsapp: string; // "01XXXXXXXXX" or ""
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiItem<T> {
  data: T;
}

export interface ApiList<T> {
  data: T[];
  meta: PageMeta;
}
