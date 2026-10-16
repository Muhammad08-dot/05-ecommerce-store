'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop/ceramics', label: 'Ceramics' },
  { href: '/shop/textiles', label: 'Textiles' },
  { href: '/about', label: 'Our studio' },
];

export function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const pathname = usePathname();
  const { count } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <nav className="shell flex h-16 items-center justify-between gap-4" aria-label="Primary">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-2xl font-semibold tracking-tight text-ink">
            Halden
          </Link>
          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-sm transition-colors hover:text-clay ${
                    pathname === l.href ? 'text-clay' : 'text-ink-soft'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={user ? '/account' : '/login'}
            className="flex items-center gap-2 rounded-pill px-3 py-2 text-sm text-ink-soft transition-colors hover:text-clay"
          >
            <User size={18} strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">{user ? user.first_name || 'Account' : 'Sign in'}</span>
          </Link>
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-pill px-3 py-2 text-sm text-ink-soft transition-colors hover:text-clay"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag size={18} strokeWidth={1.5} aria-hidden />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-pill bg-clay px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="ml-1 rounded-pill p-2 text-ink-soft transition-colors hover:text-clay md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-line bg-paper md:hidden">
          <ul className="shell flex flex-col py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm text-ink-soft transition-colors hover:text-clay"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
