'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('mode') === 'register' ? 'register' : 'login',
  );
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    setFieldErrors({});
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, first_name: firstName, last_name: lastName, password });
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Something went wrong. Try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  const err = (key: string) => fieldErrors[key]?.[0];

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="flex rounded-pill border border-line p-1 text-sm">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setFieldErrors({});
                setFormError(null);
              }}
              className={`flex-1 rounded-pill py-2 font-medium transition-colors ${
                mode === m ? 'bg-ink text-paper' : 'text-ink-soft hover:text-clay'
              }`}
            >
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <h1 className="mt-8 font-heading text-h2 font-medium">
          {mode === 'login' ? 'Welcome back' : 'Join the studio list'}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {mode === 'login'
            ? 'Sign in to see your orders and check out faster.'
            : 'An account keeps your order history in one place. Checkout works without one too.'}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="field-label">First name</label>
                <input
                  id="firstName"
                  className="field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                {err('first_name') && <p className="mt-1 text-xs text-danger">{err('first_name')}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="field-label">Last name</label>
                <input
                  id="lastName"
                  className="field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
                {err('last_name') && <p className="mt-1 text-xs text-danger">{err('last_name')}</p>}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input
              id="email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            {err('email') && <p className="mt-1 text-xs text-danger">{err('email')}</p>}
          </div>

          <div>
            <label htmlFor="password" className="field-label">Password</label>
            <input
              id="password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
            {err('password') && <p className="mt-1 text-xs text-danger">{err('password')}</p>}
            {err('non_field_errors') && <p className="mt-1 text-xs text-danger">{err('non_field_errors')}</p>}
          </div>

          {formError && <p className="text-sm text-danger">{formError}</p>}

          <button type="submit" className="btn-accent w-full" disabled={busy}>
            {busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 rounded-card border border-line bg-sand-soft p-4 text-xs">
          <p className="font-medium uppercase tracking-wider text-ink-faint">Demo mode</p>
          <p className="mt-1.5 leading-relaxed text-ink-soft">
            This storefront runs entirely in your browser — no server, no real payment.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setEmail('shopper@halden.co');
                setPassword('Shopper#2025');
              }}
              className="btn-outline px-3 py-1.5 text-xs"
            >
              Use shopper
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setEmail('studio@halden.co');
                setPassword('HaldenAdmin#1');
              }}
              className="btn-outline px-3 py-1.5 text-xs"
            >
              Use studio admin
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          <Link href="/shop" className="link-underline hover:text-clay">
            Continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}
