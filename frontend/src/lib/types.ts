// Shared API types mirroring the Django REST responses.

export interface Category {
  id: number;
  name: string;
  slug: string;
  blurb: string;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: number;
  category_name: string;
  material: string;
  price: string; // decimal string, e.g. "62.00"
  image_url: string;
  image_alt: string;
  in_stock: boolean;
  featured: boolean;
}

export interface ProductDetail extends Product {
  description: string;
  care: string;
  category_slug: string;
  price_cents: number;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface CartLine {
  product_id: number;
  name: string;
  slug: string;
  sku: string;
  image_url: string;
  unit_price_cents: number;
  qty: number;
  line_total_cents: number;
}

export interface CartTotals {
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  grand_total_cents: number;
}

export interface CartQuote {
  lines: CartLine[];
  totals: CartTotals;
}

export interface OrderItem {
  id: number;
  product: number;
  name: string;
  sku: string;
  unit_price_cents: number;
  qty: number;
  line_total_cents: number;
}

export interface Order {
  id: number;
  reference: string;
  email: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  shipping_country: string;
  status: string;
  status_display: string;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  grand_total_cents: number;
  items: OrderItem[];
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'admin';
  is_admin_role: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
