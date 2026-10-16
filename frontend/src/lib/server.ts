// Server-side data for the static storefront. Reads from the local mock layer
// (../mock) — no network, so these resolve synchronously at build and prerender.
import type { Category, Product, ProductDetail, Paginated } from '@/lib/types';
import { categories, listProducts, getProduct as mockGetProduct } from '@/lib/mock';

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getProducts(
  params: Record<string, string | number | undefined> = {},
): Promise<Paginated<Product>> {
  const results = listProducts({
    category: params.category ? String(params.category) : undefined,
    material: params.material ? String(params.material) : undefined,
    search: params.search ? String(params.search) : undefined,
    ordering: params.ordering ? String(params.ordering) : undefined,
    featured: params.featured === 'true',
  });
  return { count: results.length, next: null, previous: null, results };
}

export async function getProduct(slug: string): Promise<ProductDetail> {
  const p = mockGetProduct(slug);
  if (!p) throw new Error(`Product ${slug} not found`);
  return p;
}
