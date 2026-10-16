import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/server';
import { ProductCard } from '@/components/ProductCard';

const CATEGORY_CARDS = [
  { slug: 'ceramics', label: 'Ceramics', copy: 'Mugs, bowls and plates for the everyday table.' },
  { slug: 'textiles', label: 'Textiles', copy: 'Washed linen and undyed wool, woven in small runs.' },
  { slug: 'lighting', label: 'Lighting', copy: 'Warm, dimmable light in brass and oak.' },
  { slug: 'kitchen', label: 'Kitchen', copy: 'Tools and serving pieces that earn their space.' },
];

export default async function HomePage() {
  const { results } = await getProducts({ featured: 'true' });

  return (
    <>
      {/* Editorial split hero — image and copy share the fold, never centred. */}
      <section className="shell grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="order-2 md:order-1">
          <p className="eyebrow">Handmade in Portland</p>
          <h1 className="mt-4 font-heading text-display font-medium text-ink">
            Objects for a<br />
            <span className="italic text-clay">well-used</span> home.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
            Halden is a two-person studio making small runs of stoneware, linen and light.
            Nothing precious — pieces meant to be handled, filled, washed and used again tomorrow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">Shop all pieces</Link>
            <Link href="/about" className="btn-outline">Read our story</Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sand">
            <Image
              src="https://images.unsplash.com/photo-1605117012605-b68dedd4accc?auto=format&fit=crop&w=1000&q=80"
              alt="A brown ceramic cup resting on a pale saucer"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured pieces */}
      <section className="shell pb-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-h2 font-medium">This season&rsquo;s favourites</h2>
          <Link href="/shop" className="hidden text-sm text-ink-soft link-underline hover:text-clay sm:inline">
            View everything
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {results.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Category editorial strip — varied sizes, not an identical card row. */}
      <section className="border-y border-line bg-sand-soft py-20">
        <div className="shell">
          <h2 className="font-heading text-h2 font-medium">Browse by room</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_CARDS.map((c) => (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                className="group flex flex-col justify-between rounded-card border border-line bg-paper p-6 transition-shadow duration-300 hover:shadow-lift"
              >
                <span className="text-eyebrow font-semibold uppercase text-clay">{c.label}</span>
                <span className="mt-10 block font-heading text-xl leading-snug text-ink group-hover:text-clay">
                  {c.copy}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Studio promise — a single wide statement, breaking the card rhythm. */}
      <section className="shell py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[16/11] overflow-hidden rounded-card bg-sand">
            <Image
              src="https://images.unsplash.com/photo-1589051088132-06f36a22012a?auto=format&fit=crop&w=1200&q=80"
              alt="Hands shaping the rim of a clay bowl on the wheel"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-md">
            <p className="eyebrow">How we work</p>
            <h2 className="mt-4 font-heading text-h2 font-medium">Made slowly, in runs of forty</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Every piece is thrown, glazed and fired by us. We make forty of anything, then move
              on — which is why a favourite glaze might not come back. Prices are what a small
              studio can charge honestly: no middlemen, no marked-up wholesale.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
              <li>Free carbon-neutral shipping over $120</li>
              <li>Thirty-day returns on unused pieces</li>
              <li>Repaired, not discarded — write to us if something chips</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
