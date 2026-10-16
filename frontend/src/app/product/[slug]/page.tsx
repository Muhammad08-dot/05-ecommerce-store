import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, getProducts } from '@/lib/server';
import { listProducts } from '@/lib/mock';
import { price } from '@/lib/format';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductCard } from '@/components/ProductCard';
import { Truck, RotateCcw, Leaf } from 'lucide-react';

interface Props {
  params: { slug: string };
}

// Static export: prerender every product page from the mock catalogue.
export function generateStaticParams() {
  return listProducts({ includeInactive: true }).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const p = await getProduct(params.slug);
    return { title: p.name, description: p.description.slice(0, 150) };
  } catch {
    return { title: 'Product' };
  }
}

const PROMISES = [
  { icon: Truck, label: 'Ships in 2–4 days', sub: 'Free over $120' },
  { icon: RotateCcw, label: '30-day returns', sub: 'Unused, in original box' },
  { icon: Leaf, label: 'Repaired, not binned', sub: 'Write us if it chips' },
];

export default async function ProductPage({ params }: Props) {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch {
    notFound();
  }

  const related = await getProducts({ category: product.category_slug ?? undefined });
  const suggestions = related.results.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="shell py-10">
      <nav className="mb-6 flex items-center gap-2 text-xs text-ink-faint" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-clay">Shop</Link>
        <span aria-hidden>/</span>
        <Link href={`/shop/${product.category_name.toLowerCase()}`} className="hover:text-clay">
          {product.category_name}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-soft">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-card bg-sand-soft lg:sticky lg:top-24">
          <Image
            src={product.image_url}
            alt={product.image_alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="eyebrow">{product.category_name}</p>
          <h1 className="mt-3 font-heading text-h1 font-medium">{product.name}</h1>
          <p className="mt-4 text-2xl font-medium">{price(product.price)}</p>

          <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-y-3 border-t border-line pt-6 text-sm">
            <dt className="text-ink-faint">Material</dt>
            <dd className="text-ink-soft">{product.material}</dd>
            <dt className="text-ink-faint">SKU</dt>
            <dd className="tabular-nums text-ink-soft">{product.sku}</dd>
            <dt className="text-ink-faint">Care</dt>
            <dd className="text-ink-soft">{product.care}</dd>
            <dt className="text-ink-faint">Availability</dt>
            <dd className={product.in_stock ? 'text-success' : 'text-danger'}>
              {product.in_stock ? `In stock (${product.stock})` : 'Sold out'}
            </dd>
          </dl>

          <div className="mt-8">
            <AddToCartButton productId={product.id} disabled={!product.in_stock} />
          </div>

          <ul className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            {PROMISES.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex flex-col gap-1.5">
                <Icon size={20} strokeWidth={1.5} className="text-clay" aria-hidden />
                <span className="text-sm font-medium leading-tight">{label}</span>
                <span className="text-xs text-ink-faint">{sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-24">
          <h2 className="font-heading text-h2 font-medium">More from {product.category_name}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
