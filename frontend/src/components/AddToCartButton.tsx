'use client';

import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function AddToCartButton({ productId, disabled }: { productId: number; disabled?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="btn-accent w-full"
      disabled={disabled}
      onClick={() => {
        add(productId);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? (
        <>
          <Check size={17} strokeWidth={2} /> Added to cart
        </>
      ) : (
        <>
          <ShoppingBag size={17} strokeWidth={1.5} /> Add to cart
        </>
      )}
    </button>
  );
}
