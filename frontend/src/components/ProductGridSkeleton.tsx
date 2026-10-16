export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[4/5] animate-pulse rounded-card bg-sand" />
          <div className="mt-3 h-3.5 w-2/3 animate-pulse rounded bg-sand" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-sand" />
        </div>
      ))}
    </div>
  );
}
