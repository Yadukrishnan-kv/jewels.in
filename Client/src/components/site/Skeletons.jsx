export function ProductCardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="skeleton aspect-square rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3.5 w-4/5 rounded-full" />
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, variant = "listing" }) {
  const gridClasses =
    variant === "home"
      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-[30px]"
      : variant === "shop"
      ? "grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 xs:gap-4 md:gap-6 p-3 xs:p-4 md:p-6"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-5 lg:gap-6 p-px xs:p-5 md:p-6 lg:p-[30px]";
  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-28 text-primary/50">
      <span className="relative flex h-10 w-10">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30" />
        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <i className="fa-solid fa-gem text-sm" />
        </span>
      </span>
      <p className="text-sm tracking-wide">{label}</p>
    </div>
  );
}
