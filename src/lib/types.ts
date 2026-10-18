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
  createdAt: string;
}

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
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
