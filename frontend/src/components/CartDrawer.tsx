'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cents } from '@/lib/format';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { quote, setQty, remove, loading, error } = useCart();

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const lines = quote?.lines ?? [];
  const totals = quote?.totals;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-lift transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-heading text-xl font-semibold">Your cart</h2>
          <button type="button" onClick={onClose} className="rounded-pill p-2 text-ink-soft hover:text-clay" aria-label="Close cart">
            <X size={20} strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="font-heading text-lg text-ink-soft">Your cart is empty.</p>
              <p className="text-sm text-ink-faint">Pieces you add will appear here.</p>
              <Link href="/shop" className="btn-outline mt-2" onClick={onClose}>
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li key={line.product_id} className="flex gap-4 py-5">
                  <Link href={`/product/${line.slug}`} onClick={onClose} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-card bg-sand-soft">
                    <Image src={line.image_url} alt={line.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link href={`/product/${line.slug}`} onClick={onClose} className="text-sm font-medium leading-snug hover:text-clay">
                        {line.name}
                      </Link>
                      <span className="text-sm font-semibold">{cents(line.line_total_cents)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-faint">{cents(line.unit_price_cents)} each</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line rounded-pill">
                        <button type="button" className="px-2.5 py-1.5 text-ink-soft hover:text-clay" aria-label="Decrease quantity" onClick={() => setQty(line.product_id, line.qty - 1)}>
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{line.qty}</span>
                        <button type="button" className="px-2.5 py-1.5 text-ink-soft hover:text-clay" aria-label="Increase quantity" onClick={() => setQty(line.product_id, line.qty + 1)}>
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <button type="button" className="flex items-center gap-1 text-xs text-ink-faint hover:text-danger" onClick={() => remove(line.product_id)}>
                        <Trash2 size={13} strokeWidth={1.5} /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-line px-6 py-5">
            {loading && <p className="mb-2 text-xs text-ink-faint">Updating totals…</p>}
            {totals && (
              <dl className="space-y-1.5 text-sm">
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
                <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{cents(totals.grand_total_cents)}</dd>
                </div>
              </dl>
            )}
            <Link href="/checkout" onClick={onClose} className="btn-accent mt-4 w-full">
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
