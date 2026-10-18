import type { Category, Order, OrderStatus, Product, Promotion, User } from "./types";

export interface AdminStats {
  orders: { totalOrders: number; revenue: number; byStatus: Record<OrderStatus, number> };
  customers: number;
  products: number;
  lowStock: Product[];
  recentOrders: Order[];
}

export type AdminCategory = Category & { productCount: number };

export type AdminPromotion = Promotion & {
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
};
export type AdminCustomer = User & { orderCount: number };
export type AdminOrder = Order & { customer: User | null };

// Mirrors STATUS_TRANSITIONS in the backend (domain/order.ts).
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
