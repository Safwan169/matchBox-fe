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
