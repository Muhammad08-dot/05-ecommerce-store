import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { href: '/shop/ceramics', label: 'Ceramics' },
      { href: '/shop/textiles', label: 'Textiles' },
      { href: '/shop/kitchen', label: 'Kitchen' },
      { href: '/shop/lighting', label: 'Lighting' },
      { href: '/shop/bath', label: 'Bath' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { href: '/about', label: 'Our story' },
      { href: '/shop', label: 'All pieces' },
      { href: '/account', label: 'My orders' },
    ],
  },
  {
    title: 'Care',
    links: [
      { href: '/about#shipping', label: 'Shipping & returns' },
      { href: '/about#materials', label: 'Materials & care' },
      { href: '/about#contact', label: 'Contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-section border-t border-line bg-sand-soft">
      <div className="shell grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-heading text-2xl font-semibold">Halden</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Small-batch homewares made in a two-person studio in Portland. Built to be used,
            not to be kept.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-eyebrow font-semibold uppercase text-ink-faint">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-soft transition-colors hover:text-clay">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Halden Goods Co. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
            Demo mode — self-contained frontend with sample data. No orders are real.
          </p>
        </div>
      </div>
    </footer>
  );
}
