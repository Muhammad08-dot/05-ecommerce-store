import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { price } from '@/lib/format';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sand-soft">
          <Image
            src={product.image_url}
            alt={product.image_alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/70">
              <span className="rounded-pill border border-ink/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Sold out
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium leading-snug">
            <Link href={`/product/${product.slug}`} className="transition-colors hover:text-clay">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-faint">{product.material}</p>
        </div>
        <p className="text-sm font-semibold">{price(product.price)}</p>
      </div>
    </article>
  );
}
