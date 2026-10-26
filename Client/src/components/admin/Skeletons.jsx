export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="admin-skeleton h-3.5 flex-1" style={{ maxWidth: c === 0 ? 140 : 90 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="admin-card overflow-hidden">
          <div className="admin-skeleton aspect-square rounded-none" />
          <div className="p-3 space-y-2">
            <div className="admin-skeleton h-3 w-4/5" />
            <div className="admin-skeleton h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="admin-card p-5 space-y-3">
          <div className="admin-skeleton h-8 w-8 rounded-lg" />
          <div className="admin-skeleton h-6 w-20" />
          <div className="admin-skeleton h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
