'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { createOrder, LAST_ORDER } from '@/lib/mock';
import { cents } from '@/lib/format';

interface PayForm {
  email: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  shipping_country: string;
  card_name: string;
  card_number: string;
  card_expiry: string;
  card_cvc: string;
}

const EMPTY: PayForm = {
  email: '', shipping_name: '', shipping_address: '', shipping_city: '',
  shipping_postal: '', shipping_country: 'United States',
  card_name: '', card_number: '', card_expiry: '', card_cvc: '',
};

const onlyDigits = (s: string) => s.replace(/\D/g, '');

export default function CheckoutPage() {
  const router = useRouter();
  const { quote, items, clear, loading } = useCart();
  const { user } = useAuth();

  const totals = quote?.totals;
  const lines = quote?.lines ?? [];

  const [form, setForm] = useState<PayForm>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Prefill contact from the signed-in account when available.
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        email: f.email || user.email,
        shipping_name:
          f.shipping_name || [user.first_name, user.last_name].filter(Boolean).join(' '),
      }));
    }
  }, [user]);

  function update(key: keyof PayForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function onCardNumber(v: string) {
    // Group into 4-digit blocks for a realistic card entry feel.
    const digits = onlyDigits(v).slice(0, 16);
    update('card_number', digits.replace(/(.{4})/g, '$1 ').trim());
  }
  function onExpiry(v: string) {
    const d = onlyDigits(v).slice(0, 4);
    update('card_expiry', d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  }
  function onCvc(v: string) {
    update('card_cvc', onlyDigits(v).slice(0, 4));
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.shipping_name.trim()) e.shipping_name = 'Full name is required.';
    if (!form.shipping_address.trim()) e.shipping_address = 'Street address is required.';
    if (!form.shipping_city.trim()) e.shipping_city = 'City is required.';
    if (!form.shipping_postal.trim()) e.shipping_postal = 'Postal code is required.';
    if (!form.card_name.trim()) e.card_name = 'Name on card is required.';
    const num = onlyDigits(form.card_number);
    if (num.length < 15 || num.length > 16) e.card_number = 'Card number looks incomplete.';
    const exp = onlyDigits(form.card_expiry);
    if (exp.length !== 4) e.card_expiry = 'Use MM/YY.';
    else {
      const mm = Number(exp.slice(0, 2));
      if (mm < 1 || mm > 12) e.card_expiry = 'Check the month.';
    }
    if (onlyDigits(form.card_cvc).length < 3) e.card_cvc = 'CVC is 3–4 digits.';
    return e;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!items.length) return;
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormError('Please review the highlighted fields.');
      return;
    }
    setFormError(null);
    setProcessing(true);
    try {
      const { order } = createOrder({
        email: form.email,
        shipping_name: form.shipping_name,
        shipping_address: form.shipping_address,
        shipping_city: form.shipping_city,
        shipping_postal: form.shipping_postal,
        shipping_country: form.shipping_country,
        items,
      });
      // Persist for the static success page, then hand off the cart.
      localStorage.setItem(LAST_ORDER, JSON.stringify(order));
      clear();
      router.push('/checkout/success');
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Checkout failed. Try again.');
      setProcessing(false);
    }
  }

  if (!items.length) {
    return (
      <div className="shell flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="font-heading text-h2 font-medium">There&rsquo;s nothing to check out yet.</h1>
        <p className="max-w-sm text-sm text-ink-soft">Add a piece from the shop and it&rsquo;ll appear here.</p>
        <Link href="/shop" className="btn-accent">Browse the collection</Link>
      </div>
    );
  }

  const err = (key: string) => fieldErrors[key];

  return (
    <div className="shell py-12">
      <h1 className="font-heading text-h1 font-medium">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={onSubmit} className="space-y-8" noValidate>
          <section>
            <h2 className="font-heading text-h3 font-medium">Contact</h2>
            <div className="mt-4">
              <label htmlFor="email" className="field-label">Email</label>
              <input
                id="email" type="email" className="field max-w-md"
                value={form.email} onChange={(e) => update('email', e.target.value)}
                autoComplete="email" placeholder="you@example.com"
                aria-invalid={!!err('email')}
              />
              {err('email') && <p className="mt-1 text-xs text-danger">{err('email')}</p>}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-h3 font-medium">Shipping address</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="field-label">Full name</label>
                <input
                  id="name" className="field max-w-md" value={form.shipping_name}
                  onChange={(e) => update('shipping_name', e.target.value)}
                  autoComplete="name" aria-invalid={!!err('shipping_name')}
                />
                {err('shipping_name') && <p className="mt-1 text-xs text-danger">{err('shipping_name')}</p>}
              </div>
              <div>
                <label htmlFor="address" className="field-label">Street address</label>
                <input
                  id="address" className="field max-w-md" value={form.shipping_address}
                  onChange={(e) => update('shipping_address', e.target.value)}
                  autoComplete="street-address" aria-invalid={!!err('shipping_address')}
                />
                {err('shipping_address') && <p className="mt-1 text-xs text-danger">{err('shipping_address')}</p>}
              </div>
              <div className="grid max-w-md grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="field-label">City</label>
                  <input
                    id="city" className="field" value={form.shipping_city}
                    onChange={(e) => update('shipping_city', e.target.value)}
                    autoComplete="address-level2" aria-invalid={!!err('shipping_city')}
                  />
                  {err('shipping_city') && <p className="mt-1 text-xs text-danger">{err('shipping_city')}</p>}
                </div>
                <div>
                  <label htmlFor="postal" className="field-label">Postal code</label>
                  <input
                    id="postal" className="field" value={form.shipping_postal}
                    onChange={(e) => update('shipping_postal', e.target.value)}
                    autoComplete="postal-code" aria-invalid={!!err('shipping_postal')}
                  />
                  {err('shipping_postal') && <p className="mt-1 text-xs text-danger">{err('shipping_postal')}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="country" className="field-label">Country</label>
                <select
                  id="country" className="field max-w-md" value={form.shipping_country}
                  onChange={(e) => update('shipping_country', e.target.value)}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-h3 font-medium">Payment</h2>
            <div className="mt-2 flex items-center gap-2 rounded-card border border-line bg-sand-soft px-4 py-2.5 text-xs text-ink-soft">
              <ShieldCheck size={14} strokeWidth={1.5} className="shrink-0 text-success" />
              Demo checkout — no card is charged. Try <span className="font-mono text-ink">4242 4242 4242 4242</span>, any future expiry, any CVC.
            </div>
            <div className="mt-4 space-y-4">
              <div className="relative flex items-center gap-2 rounded-card border border-line bg-white px-4 py-3">
                <CreditCard size={18} strokeWidth={1.5} className="text-ink-faint" aria-hidden />
                <span className="ml-auto text-xs font-medium uppercase tracking-wider text-ink-faint">Visa · Mastercard · Amex</span>
              </div>
              <div>
                <label htmlFor="cardname" className="field-label">Name on card</label>
                <input
                  id="cardname" className="field max-w-md" value={form.card_name}
                  onChange={(e) => update('card_name', e.target.value)}
                  autoComplete="cc-name" aria-invalid={!!err('card_name')}
                />
                {err('card_name') && <p className="mt-1 text-xs text-danger">{err('card_name')}</p>}
              </div>
              <div>
                <label htmlFor="cardnumber" className="field-label">Card number</label>
                <input
                  id="cardnumber" className="field max-w-md font-mono tracking-widest" inputMode="numeric"
                  value={form.card_number} onChange={(e) => onCardNumber(e.target.value)}
                  autoComplete="cc-number" placeholder="4242 4242 4242 4242" aria-invalid={!!err('card_number')}
                />
                {err('card_number') && <p className="mt-1 text-xs text-danger">{err('card_number')}</p>}
              </div>
              <div className="grid max-w-md grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp" className="field-label">Expiry</label>
                  <input
                    id="exp" className="field font-mono" inputMode="numeric" value={form.card_expiry}
                    onChange={(e) => onExpiry(e.target.value)} autoComplete="cc-exp"
                    placeholder="MM/YY" aria-invalid={!!err('card_expiry')}
                  />
                  {err('card_expiry') && <p className="mt-1 text-xs text-danger">{err('card_expiry')}</p>}
                </div>
                <div>
                  <label htmlFor="cvc" className="field-label">CVC</label>
                  <input
                    id="cvc" className="field font-mono" inputMode="numeric" value={form.card_cvc}
                    onChange={(e) => onCvc(e.target.value)} autoComplete="cc-csc"
                    placeholder="123" aria-invalid={!!err('card_cvc')}
                  />
                  {err('card_cvc') && <p className="mt-1 text-xs text-danger">{err('card_cvc')}</p>}
                </div>
              </div>
            </div>
          </section>

          {formError && (
            <p className="rounded-card border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              {formError}
            </p>
          )}

          <button type="submit" className="btn-accent w-full lg:max-w-xs" disabled={processing}>
            {processing ? 'Processing payment…' : `Pay ${totals ? cents(totals.grand_total_cents) : ''}`}
          </button>
          <p className="flex items-center gap-1.5 text-xs text-ink-faint">
            <Lock size={12} strokeWidth={1.5} /> Encrypted demo payment. Totals are calculated locally.
          </p>
        </form>

        <aside className="h-fit rounded-card border border-line bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-heading text-h3 font-medium">Summary</h2>
          {loading && <p className="mt-2 text-xs text-ink-faint">Recalculating…</p>}
          <ul className="mt-4 space-y-3 border-b border-line pb-4">
            {lines.map((line) => (
              <li key={line.product_id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink-soft">
                  {line.name} <span className="text-ink-faint">×{line.qty}</span>
                </span>
                <span className="tabular-nums">{cents(line.line_total_cents)}</span>
              </li>
            ))}
          </ul>
          {totals && (
            <dl className="mt-4 space-y-2 text-sm">
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
          )}
          <p className="mt-5 flex items-center gap-2 text-xs text-ink-faint">
            <ShieldCheck size={14} strokeWidth={1.5} className="text-success" />
            30-day returns · carbon-neutral shipping
          </p>
        </aside>
      </div>
    </div>
  );
}
