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
  price: number; // poisha
  compareAtPrice: number | null;
  stock: number;
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

/** Public hero banner (GET /promotions). */
export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  link: string;
  showText: boolean;
}

export interface StoreSettings {
  phone: string; // "01XXXXXXXXX" or ""
  whatsapp: string; // "01XXXXXXXXX" or ""
  email: string;
  address: string;
  facebookUrl: string;
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
