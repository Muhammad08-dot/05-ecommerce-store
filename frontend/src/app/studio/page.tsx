'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
  listAllForAdmin, upsertProduct, deleteProduct, categories as mockCategories,
} from '@/lib/mock';
import type { Category, ProductDetail } from '@/lib/types';

const MATERIALS = ['stoneware', 'porcelain', 'linen', 'wool', 'brass', 'oak', 'glass', 'cotton'];

interface Draft {
  id?: number;
  slug?: string; // used as the PATCH lookup key for existing products
  name: string;
  sku: string;
  category: number;
  material: string;
  price_dollars: string;
  stock: string;
  description: string;
  care: string;
  image_url: string;
  image_alt: string;
  featured: boolean;
  is_active: boolean;
}

const EMPTY: Draft = {
  name: '',
  sku: '',
  category: 0,
  material: 'stoneware',
  price_dollars: '',
  stock: '0',
  description: '',
  care: '',
  image_url: '',
  image_alt: '',
  featured: false,
  is_active: true,
};

function toNumber(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function StudioPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isAdmin = !!user?.is_admin_role;

  useEffect(() => {
    if (ready && !isAdmin) router.replace('/login?next=/studio');
  }, [ready, isAdmin, router]);

  const load = useCallback(() => {
    setLoading(true);
    try {
      setProducts(listAllForAdmin());
      setCategories(mockCategories);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function edit(product: ProductDetail) {
    // Pull the full record (list rows already carry it here) into the editor.
    setFormError(null);
    setDraft({
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      category: product.category,
      material: product.material,
      price_dollars: (product.price_cents / 100).toString(),
      stock: String(product.stock),
      description: product.description,
      care: product.care,
      image_url: product.image_url,
      image_alt: product.image_alt,
      featured: product.featured,
      is_active: product.is_active,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setFormError(null);
    const body = {
      name: draft.name,
      sku: draft.sku,
      category: draft.category,
      material: draft.material,
      price_cents: Math.round(toNumber(draft.price_dollars) * 100),
      stock: toNumber(draft.stock),
      description: draft.description,
      care: draft.care,
      image_url: draft.image_url,
      image_alt: draft.image_alt,
      featured: draft.featured,
      is_active: draft.is_active,
    };
    try {
      if (draft.id && draft.slug) {
        upsertProduct(draft.slug, body);
      } else {
        upsertProduct(null, body);
      }
      setDraft(null);
      load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not save the product.');
    } finally {
      setSaving(false);
    }
  }

  function remove(product: ProductDetail) {
    if (!confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      deleteProduct(product.slug);
      if (draft?.id === product.id) setDraft(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    }
  }

  function toggleActive(product: ProductDetail, value: boolean) {
    try {
      upsertProduct(product.slug, { is_active: value });
      setProducts((ps) => ps.map((p) => (p.id === product.id ? { ...p, is_active: value } : p)));
    } catch {
      setError('Could not update availability.');
    }
  }

  if (!ready || !isAdmin) {
    return <div className="shell py-20 text-center text-sm text-ink-faint">Checking your access…</div>;
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Studio</p>
          <h1 className="mt-3 font-heading text-h1 font-medium">Product management</h1>
          <p className="mt-1 text-sm text-ink-soft">{products.length} pieces · signed in as {user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/shop" className="btn-outline flex items-center gap-2">
            <ArrowLeft size={15} strokeWidth={1.5} /> Storefront
          </Link>
          <button type="button" className="btn-accent flex items-center gap-2" onClick={() => { setDraft({ ...EMPTY }); setFormError(null); }}>
            <Plus size={15} strokeWidth={2} /> New product
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-card border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>
      )}

      {draft ? (
        <form onSubmit={save} className="mt-8 rounded-card border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-h3 font-medium">
              {draft.id ? `Edit — ${draft.name}` : 'New product'}
            </h2>
            <button type="button" onClick={() => setDraft(null)} className="rounded-pill p-2 text-ink-soft hover:text-clay" aria-label="Close editor">
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="field-label">Name</label>
              <input className="field" value={draft.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="field-label">SKU</label>
              <input className="field" value={draft.sku} onChange={(e) => set('sku', e.target.value)} required />
            </div>
            <div>
              <label className="field-label">Category</label>
              <select className="field" value={draft.category} onChange={(e) => set('category', Number(e.target.value))} required>
                <option value={0} disabled>Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Material</label>
              <select className="field" value={draft.material} onChange={(e) => set('material', e.target.value)}>
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Price (USD)</label>
              <input className="field" type="number" step="0.01" min="0" value={draft.price_dollars} onChange={(e) => set('price_dollars', e.target.value)} required />
            </div>
            <div>
              <label className="field-label">Stock on hand</label>
              <input className="field" type="number" step="1" min="0" value={draft.stock} onChange={(e) => set('stock', e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Image URL</label>
              <input className="field" value={draft.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://images.unsplash.com/…" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Image alt text</label>
              <input className="field" value={draft.image_alt} onChange={(e) => set('image_alt', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Description</label>
              <textarea className="field" rows={3} value={draft.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Care</label>
              <input className="field" value={draft.care} onChange={(e) => set('care', e.target.value)} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" className="h-4 w-4 accent-clay" checked={draft.featured} onChange={(e) => set('featured', e.target.checked)} />
              Feature on home page
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" className="h-4 w-4 accent-clay" checked={draft.is_active} onChange={(e) => set('is_active', e.target.checked)} />
              Active (visible in shop)
            </label>
          </div>

          {formError && <p className="mt-4 text-sm text-danger">{formError}</p>}

          <div className="mt-6 flex gap-3">
            <button type="submit" className="btn-accent flex items-center gap-2" disabled={saving}>
              <Save size={15} strokeWidth={1.5} /> {saving ? 'Saving…' : 'Save product'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setDraft(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-line">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-sand-soft text-xs uppercase tracking-wider text-ink-faint">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Active</th>
                <th className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-5 animate-pulse rounded bg-sand-soft" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-ink-faint">No products yet.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={p.is_active ? '' : 'opacity-55'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-ink">{p.name}</span>
                        {p.featured && (
                          <span className="rounded-pill border border-clay/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-clay">Featured</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-ink-faint">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{p.category_name}</td>
                    <td className="px-4 py-3 tabular-nums">${(p.price_cents / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      <span className={p.stock === 0 ? 'text-danger' : 'text-ink-soft'}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-clay"
                        checked={p.is_active}
                        onChange={(e) => toggleActive(p, e.target.checked)}
                        aria-label={`Toggle ${p.name} active`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button type="button" className="rounded-pill p-2 text-ink-soft hover:text-clay" aria-label={`Edit ${p.name}`} onClick={() => edit(p)}>
                          <Pencil size={15} strokeWidth={1.5} />
                        </button>
                        <button type="button" className="rounded-pill p-2 text-ink-soft hover:text-danger" aria-label={`Delete ${p.name}`} onClick={() => remove(p)}>
                          <Trash2 size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
