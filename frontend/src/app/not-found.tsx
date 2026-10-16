import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-heading text-h1 font-medium">This page has left the shelf</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
        The piece you were looking for may have sold out or moved. The rest of the collection is
        still here.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-accent">Back to the shop</Link>
        <Link href="/" className="btn-outline">Home</Link>
      </div>
    </div>
  );
}
