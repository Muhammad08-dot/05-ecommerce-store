'use client';

import { useState, type ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export function Providers({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar onOpenCart={() => setCartOpen(true)} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
