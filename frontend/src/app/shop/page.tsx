import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCategories } from '@/lib/server';
import { ShopExplorer, CategoryTabs } from '@/components/ShopExplorer';

export const metadata: Metadata = {
  title: 'Shop all pieces',
  description: 'Browse every piece in the studio — ceramics, textiles, kitchenware, lighting and bath.',
};

export default async function ShopPage() {
  const categories = await getCategories();
  return (
    <>
      <CategoryTabs categories={categories} active="all" />
      <Suspense fallback={null}>
        <ShopExplorer activeCategory="all" categories={categories} />
      </Suspense>
    </>
  );
}
