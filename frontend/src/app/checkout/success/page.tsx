'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Package } from 'lucide-react';
import type { Order } from '@/lib/types';
import { LAST_ORDER } from '@/lib/mock';
import { cents, formatDate } from '@/lib/format';
import { useAuth } from '@/lib/auth';

export default function CheckoutSuccessPage() {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | 'none'>('none');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_ORDER);
      setOrder(raw ? (JSON.parse(raw) as Order) : 'none');
    } catch {
      setOrder('none');
    }
  }, []);

  if (order === 'none') {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <Package size={28} strokeWidth={1.5} className="text-ink-faint" aria-hidden />
        <h1 className="font-heading text-h2 font-medium">No recent order found.</h1>
        <p className="max-w-sm text-sm text-ink-soft">
          Your order confirmation may have expired from this view. Your full history is always in your account.
        </p>
        <Link href="/shop" className="btn-accent mt-2">Back to the shop</Link>
      </div>
    );
  }

  return (
    <div className="shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-success/10">
            <Check size={26} strokeWidth={2} className="text-success" />
          </span>
          <p className="mt-6 eyebrow">Order confirmed</p>
          <h1 className="mt-3 font-heading text-h2 font-medium">Thank you — your order is placed</h1>
          <p className="mt-3 text-sm text-ink-soft">
            A confirmation is on its way to <span className="text-ink">{order.email}</span>. We&rsquo;ll
            email tracking as soon as your pieces leave the studio.
          </p>
        </div>

        <div className="mt-8 rounded-card border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-faint">Order number</p>
              <p className="mt-1 font-heading text-lg font-semibold tabular-nums">{order.reference}</p>
            </div>
            <span className="rounded-pill bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
              {order.status_display}
            </span>
          </div>

          <ul className="divide-y divide-line px-6">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="text-ink-soft">
                  {it.name} <span className="text-ink-faint">×{it.qty}</span>
                </span>
                <span className="tabular-nums">{cents(it.line_total_cents)}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-1.5 border-t border-line px-6 py-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <dt>Subtotal</dt>
              <dd>{cents(order.subtotal_cents)}</dd>
            </div>
            <div className="flex justify-between text-ink-soft">
              <dt>Shipping</dt>
              <dd>{order.shipping_cents === 0 ? 'Free' : cents(order.shipping_cents)}</dd>
            </div>
            <div className="flex justify-between text-ink-soft">
              <dt>Tax</dt>
              <dd>{cents(order.tax_cents)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-semibold text-ink">
              <dt>Total paid</dt>
              <dd>{cents(order.grand_total_cents)}</dd>
            </div>
          </dl>

          <div className="border-t border-line px-6 py-4 text-xs text-ink-faint">
            Placed {formatDate(order.created_at)} · Shipping to {order.shipping_name},{' '}
            {order.shipping_city} {order.shipping_postal}, {order.shipping_country}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {user ? (
            <Link href="/account" className="btn-primary">View your orders</Link>
          ) : (
            <Link href="/login?next=/account" className="btn-primary">Create an account to track orders</Link>
          )}
          <Link href="/shop" className="text-center text-sm text-ink-soft link-underline hover:text-clay">
            Continue shopping
          </Link>
        </div>
        <p className="mt-6 text-center text-xs text-ink-faint">
          Demo mode — this order is stored only in your browser. No payment was taken.
        </p>
      </div>
    </div>
  );
}
