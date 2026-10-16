'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ArrowUpRight, Package } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ordersFor } from '@/lib/mock';
import type { Order } from '@/lib/types';
import { cents, formatDate } from '@/lib/format';

const STATUS_TONE: Record<string, string> = {
  paid: 'text-success',
  pending: 'text-clay',
  cancelled: 'text-danger',
};

export default function AccountPage() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/login?next=/account');
      return;
    }
    setOrders(ordersFor(user.email));
    setStatus('ready');
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="shell py-20 text-center text-sm text-ink-faint">Loading your account…</div>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-3 font-heading text-h1 font-medium">{fullName || user.email}</h1>
          <p className="mt-1 text-sm text-ink-soft">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {user.is_admin_role && (
            <Link href="/studio" className="btn-outline">
              Manage products <ArrowUpRight size={15} strokeWidth={1.5} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="btn flex items-center gap-2 text-ink-soft hover:text-clay"
          >
            <LogOut size={15} strokeWidth={1.5} /> Sign out
          </button>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-h3 font-medium">Order history</h2>

        {status === 'loading' && (
          <div className="mt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-card border border-line bg-sand-soft" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className="mt-6 rounded-card border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
            We couldn&rsquo;t load your orders. Refresh to try again.
          </p>
        )}

        {status === 'ready' && orders.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-card border border-line bg-sand-soft py-16 text-center">
            <Package size={26} strokeWidth={1.5} className="text-ink-faint" aria-hidden />
            <p className="font-heading text-xl text-ink-soft">No orders yet.</p>
            <Link href="/shop" className="btn-accent mt-1">Start your first order</Link>
          </div>
        )}

        {status === 'ready' && orders.length > 0 && (
          <ul className="mt-6 divide-y divide-line rounded-card border border-line bg-white">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div>
                  <p className="text-sm font-semibold tabular-nums">{order.reference}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {formatDate(order.created_at)} · {order.items.length}{' '}
                    {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${STATUS_TONE[order.status] ?? 'text-ink-soft'}`}>
                    {order.status_display}
                  </span>
                  <span className="text-sm font-semibold">{cents(order.grand_total_cents)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
