import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our studio',
  description:
    'Halden is a two-person homewares studio in Portland. How we make, what we use, and how to reach us.',
};

const STATS = [
  { value: '2', label: ' makers, no outsourced firing' },
  { value: '40', label: ' pieces per glaze run, then retired' },
  { value: '9', label: ' years at the same wheel' },
];

export default function AboutPage() {
  return (
    <div className="shell py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Our studio</p>
          <h1 className="mt-4 font-heading text-display font-medium leading-[1.05]">
            Two people, one<br />kiln, and a short list<br />of things worth making.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
            Halden started in the back of a rented woodshop in 2017 with a secondhand wheel and a
            stubborn idea: make fewer things, make them properly, and price them so a small studio
            can keep the lights on. We still throw, glaze and fire every piece ourselves.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sand">
          <Image
            src="https://images.unsplash.com/photo-1609881583302-61548332039c?auto=format&fit=crop&w=1000&q=80"
            alt="A clay vessel being shaped on a potter’s wheel"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((s) => (
          <div key={s.label} className="px-6 py-8 text-center">
            <p className="font-heading text-h2 font-medium text-clay">{s.value}</p>
            <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <section id="materials" className="mt-20 grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[16/11] order-2 overflow-hidden rounded-card bg-sand lg:order-1">
          <Image
            src="https://images.unsplash.com/photo-1589051088132-06f36a22012a?auto=format&fit=crop&w=1200&q=80"
            alt="Finished ceramic bowls stacked on a wooden shelf"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="font-heading text-h2 font-medium">Materials &amp; care</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            We work in high-fired stoneware and porcelain, undyed linen and wool, and solid brass and
            oak that patinas rather than peels. Nothing is decorative-only — every piece goes through
            a daily round of use in our own kitchen before it&rsquo;s worth selling.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-soft">
            <li><span className="font-medium text-ink">Ceramics</span> — dishwasher and microwave safe. Avoid a cold piece straight into a hot oven.</li>
            <li><span className="font-medium text-ink">Linen &amp; wool</span> — wash cool, line dry, skip the fabric softener.</li>
            <li><span className="font-medium text-ink">Brass &amp; oak</span> — wipe with a damp cloth; a little oil once a season keeps oak happy.</li>
          </ul>
        </div>
      </section>

      <section id="shipping" className="mt-20 rounded-card border border-line bg-sand-soft p-8 sm:p-12">
        <h2 className="font-heading text-h2 font-medium">Shipping &amp; returns</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-ink">Carbon-neutral, over $120 free</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Under $120, shipping is a flat $9. Everything leaves the studio in two to four days,
              packed in recycled, plastic-free material.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Thirty-day returns</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Changed your mind? Send it back unused, in its box, for a full refund. Return shipping
              is on you unless the piece arrived damaged.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Repaired, not binned</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Chip a glaze years from now? Email us a photo. We&rsquo;ll tell you whether to repair it
              here or send it to a kintsugi maker we trust.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="mt-20 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="font-heading text-h2 font-medium">Come by, or write</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
            The studio door is open Thursdays and Saturdays for pickup and a look at what&rsquo;s coming out
            of the kiln. For anything else, a real person reads every message.
          </p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex gap-3"><dt className="w-24 text-ink-faint">Email</dt><dd><a href="mailto:hello@halden.co" className="link-underline text-clay">hello@halden.co</a></dd></div>
            <div className="flex gap-3"><dt className="w-24 text-ink-faint">Studio</dt><dd className="text-ink-soft">118 SE Ankeny St, Portland, OR</dd></div>
            <div className="flex gap-3"><dt className="w-24 text-ink-faint">Hours</dt><dd className="text-ink-soft">Thu &amp; Sat, 11am–5pm</dd></div>
          </dl>
          <div className="mt-8">
            <Link href="/shop" className="btn-primary">Browse the collection</Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand">
          <Image
            src="https://images.unsplash.com/photo-1530006498959-b7884e829a04?auto=format&fit=crop&w=1000&q=80"
            alt="Finished ceramic pieces resting on the studio bench"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>
    </div>
  );
}
