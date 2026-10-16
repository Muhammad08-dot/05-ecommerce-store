'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { listProducts } from '@/lib/mock';
import type { Category, Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

const MATERIALS = ['stoneware', 'porcelain', 'linen', 'wool', 'brass', 'oak', 'glass', 'cotton'];

const SORTS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: 'name', label: 'Alphabetical' },
];

export function ShopExplorer({
  activeCategory,
  categories,
}: {
  activeCategory: string;
  categories: Category[];
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('ready');
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [material, setMaterial] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  const fetchProducts = useCallback(() => {
    try {
      const rows = listProducts({
        category: activeCategory,
        search: search.trim() || undefined,
        material: material || undefined,
        ordering,
      });
      setProducts(rows);
      setStatus('ready');
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }
  }, [activeCategory, search, material, ordering]);

  // Recompute the filtered list whenever a control changes.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const heading = useMemo(() => {
    const cat = categories.find((c) => c.slug === activeCategory);
    return cat ? cat.name : 'All pieces';
  }, [activeCategory, categories]);

  return (
    <div className="shell py-12">
      <header className="mb-8">
        <h1 className="font-heading text-h1 font-medium">{heading}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {status === 'ready'
            ? `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}`
            : 'Loading the collection…'}
        </p>
      </header>

      {/* Filter bar */}
      <div className="mb-10 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pieces…"
            aria-label="Search products"
            className="field max-w-xs"
          />
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            aria-label="Filter by material"
            className="field max-w-[12rem]"
          >
            <option value="">All materials</option>
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-xs uppercase tracking-wider text-ink-faint">
            Sort
          </label>
          <select
            id="sort"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="field max-w-[12rem]"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === 'error' ? (
        <div className="rounded-card border border-danger/30 bg-danger/5 p-8 text-center">
          <p className="text-sm text-danger">{error || 'Something went wrong loading products.'}</p>
          <button type="button" onClick={() => fetchProducts()} className="btn-outline mt-4">
            Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-heading text-xl text-ink-soft">Nothing matches those filters.</p>
          <button
            type="button"
            className="btn-outline mt-5"
            onClick={() => {
              setSearch('');
              setMaterial('');
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// Re-export so pages can show a category nav without duplicating the list.
export function CategoryTabs({ categories, active }: { categories: Category[]; active: string }) {
  return (
    <nav className="shell mb-6 mt-10 flex flex-wrap gap-2" aria-label="Categories">
      <CategoryPill href="/shop" label="All" active={active === 'all'} />
      {categories.map((c) => (
        <CategoryPill key={c.slug} href={`/shop/${c.slug}`} label={c.name} active={active === c.slug} />
      ))}
    </nav>
  );
}

function CategoryPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-pill border px-4 py-1.5 text-sm transition-colors ${
        active ? 'border-clay bg-clay text-white' : 'border-line text-ink-soft hover:border-clay hover:text-clay'
      }`}
    >
      {label}
    </a>
  );
}
