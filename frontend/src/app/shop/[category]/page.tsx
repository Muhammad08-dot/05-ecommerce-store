import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategories } from '@/lib/server';
import { ShopExplorer, CategoryTabs } from '@/components/ShopExplorer';

interface Props {
  params: { category: string };
}

// Static export: prerender one page per category slug.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === params.category);
  return {
    title: cat ? cat.name : 'Shop',
    description: cat?.blurb || 'Browse the Halden collection.',
  };
}

export default async function CategoryPage({ params }: Props) {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) notFound();

  return (
    <>
      <CategoryTabs categories={categories} active={cat.slug} />
      <Suspense fallback={null}>
        <ShopExplorer activeCategory={cat.slug} categories={categories} />
      </Suspense>
    </>
  );
}
