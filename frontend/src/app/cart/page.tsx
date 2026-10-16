'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cents } from '@/lib/format';

export default function CartPage() {
  const { quote, setQty, remove, loading, error, items } = useCart();
  const lines = quote?.lines ?? [];
  const totals = quote?.totals;

  return (
    <div className="shell py-12">
      <h1 className="font-heading text-h1 font-medium">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-card border border-line bg-sand-soft py-20 text-center">
          <ShoppingBag size={28} strokeWidth={1.5} className="text-ink-faint" aria-hidden />
          <p className="font-heading text-2xl text-ink-soft">Nothing here yet.</p>
          <p className="max-w-sm text-sm text-ink-faint">
            Pieces you add from the shop will gather here until you&rsquo;re ready to check out.
          </p>
          <Link href="/shop" className="btn-accent mt-2">Browse the collection</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-line border-b border-line">
            {lines.map((line) => (
              <li key={line.product_id} className="flex gap-5 py-6">
                <Link
                  href={`/product/${line.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-card bg-sand-soft"
                >
                  <Image src={line.image_url} alt={line.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-medium leading-snug">
                        <Link href={`/product/${line.slug}`} className="hover:text-clay">
                          {line.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-wider text-ink-faint">
                        {line.sku} · {cents(line.unit_price_cents)} each
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{cents(line.line_total_cents)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center rounded-pill border border-line">
                      <button
                        type="button"
                        className="px-3 py-2 text-ink-soft hover:text-clay"
                        aria-label={`Decrease quantity of ${line.name}`}
                        onClick={() => setQty(line.product_id, line.qty - 1)}
                      >
                        <Minus size={14} strokeWidth={1.5} />
                      </button>
                      <span className="w-9 text-center text-sm tabular-nums">{line.qty}</span>
                      <button
                        type="button"
                        className="px-3 py-2 text-ink-soft hover:text-clay"
                        aria-label={`Increase quantity of ${line.name}`}
                        onClick={() => setQty(line.product_id, line.qty + 1)}
                      >
                        <Plus size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-danger"
                      onClick={() => remove(line.product_id)}
                    >
                      <Trash2 size={13} strokeWidth={1.5} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-card border border-line bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-heading text-h3 font-medium">Order summary</h2>
            {loading && <p className="mt-2 text-xs text-ink-faint">Recalculating totals…</p>}
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            {totals && (
              <>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between text-ink-soft">
                    <dt>Subtotal</dt>
                    <dd>{cents(totals.subtotal_cents)}</dd>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <dt>Shipping</dt>
                    <dd>{totals.shipping_cents === 0 ? 'Free' : cents(totals.shipping_cents)}</dd>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <dt>Estimated tax</dt>
                    <dd>{cents(totals.tax_cents)}</dd>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-semibold text-ink">
                    <dt>Total</dt>
                    <dd>{cents(totals.grand_total_cents)}</dd>
                  </div>
                </dl>
                {totals.shipping_cents > 0 && (
                  <p className="mt-3 text-xs text-ink-faint">
                    Spend {cents(12000 - totals.subtotal_cents)} more for free shipping.
                  </p>
                )}
                <Link href="/checkout" className="btn-accent mt-6 w-full">Checkout</Link>
                <Link
                  href="/shop"
                  className="mt-3 block text-center text-sm text-ink-soft transition-colors hover:text-clay"
                >
                  Continue shopping
                </Link>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
